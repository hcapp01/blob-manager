'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { list, put, del } from '@vercel/blob'
import { BlobFile } from './types'

export function useFileManager() {
  const [files, setFiles] = useState<BlobFile[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState("vercel_blob_rw_5X49eQVT11Cu7LAB_spAr6cNxZEZvP2itU8iI9FiY2RGafR")
  const [isConnected, setIsConnected] = useState(false)

  const fetchFiles = async () => {
    try {
      const { blobs } = await list({ token })
      setFiles(blobs)
    } catch (error) {
      toast.error('Failed to fetch files')
      throw error
    }
  }

  const handleFileSelect = async (url: string) => {
    try {
      setIsLoading(true)
      setSelectedFile(url)
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch file content')
      }
      const content = await response.text()
      setFileContent(content)
    } catch (error) {
      toast.error('Failed to load file content')
      setSelectedFile(null)
      setFileContent('')
    } finally {
      setIsLoading(false)
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
        setFileContent('')
      }
      toast.success('File deleted successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete file')
    }
  }

  const handleSave = async (content: string) => {
    if (!selectedFile) return

    try {
      // Find the old file information
      const oldFile = files.find(f => f.url === selectedFile)
      if (!oldFile) throw new Error('File not found')

      // Create new blob with updated content
      const newBlob = await put(oldFile.pathname, content, {
        access: 'public',
        contentType: 'text/plain',
        token
      })

      // Delete the old blob using its URL
      await del(oldFile.url, { token })
      console.log("deleted" , oldFile.url)

      // Update state with new blob URL
      setSelectedFile(newBlob.url)
      setFileContent(content)
      await fetchFiles()
      toast.success('File saved successfully1')
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save file')
    }
  }

  const handleCreateFile = async (filename: string, content: string) => {
    try {
      const blob = await put(filename, content, {
        access: 'public',
        contentType: 'text/plain',
        token
      })
      await fetchFiles()
      setSelectedFile(blob.url)
      setFileContent(content)
      toast.success('File created successfully')
    } catch (error) {
      toast.error('Failed to create file')
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
    fileContent,
    isLoading,
    token,
    setToken,
    isConnected,
    handleFileSelect,
    handleDelete,
    handleSave,
    handleCreateFile,
    handleTokenSubmit
  }
}