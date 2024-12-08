'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { list, put, del } from '@vercel/blob'
import { BlobFile } from './types'

export function useFileManager() {
  const [files, setFiles] = useState<BlobFile[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [token, setToken] = useState('')
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const storedToken = localStorage.getItem('blobToken') || 'vercel_blob_rw_5X49eQVT11Cu7LAB_spAr6cNxZEZvP2itU8iI9FiY2RGafr'

    if (storedToken) {
      setToken(storedToken)
      // Attempt to connect using the stored token
      list({ token: storedToken })
        .then(({ blobs }) => {
          setFiles(blobs)
          setIsConnected(true)
        })
        .catch(() => {
          localStorage.removeItem('blobToken')
          setIsConnected(false)
          toast.error('Stored token is invalid')
        })
    }
  }, [])

  const fetchFiles = async () => {
    try {
      const { blobs } = await list({ token })
      setFiles(blobs)
    } catch (error) {
      toast.error('Failed to fetch files')
      throw error
    }
  }

  const handleDelete = async (url: string) => {
    try {
      const filename = decodeURIComponent(url.split('/').pop() || '')
      
      if (!filename || filename.endsWith('/')) {
        throw new Error('Cannot delete folders')
      }

      await del(url, { token })
      await fetchFiles()
      
      if (selectedFile === url) {
        setSelectedFile(null)
      }
      toast.success('File deleted successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete file')
    }
  }

  const handleSaveFile = async (file: BlobFile, content: string) => {
    try {
      // Create new blob
      const newBlob = await put(file.pathname, content, {
        access: 'public',
        contentType: 'text/plain',
        token
      })

      // If updating an existing file, delete the old blob
      if ('url' in file && file.url) {
        await del(file.url, { token })
      }

      // Update files list
      await fetchFiles()
      
      // Update selected file with new URL
      setSelectedFile(newBlob.url)
      
      toast.success('File saved successfully')
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save file')
      throw error
    }
  }

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetchFiles()
      setIsConnected(true)
      localStorage.setItem('blobToken', token)
    } catch (error) {
      toast.error('Failed to connect to Vercel Blob')
    }
  }

  return {
    files,
    selectedFile,
    token,
    setToken,
    isConnected,
    handleDelete,
    handleSaveFile,
    handleTokenSubmit
  }
}