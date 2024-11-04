'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

interface BlobFile {
  pathname: string
  url: string
}

export function useFileManager() {
  const [files, setFiles] = useState<BlobFile[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState("vercel_blob_rw_5X49eQVT11Cu7LAB_spAr6cNxZEZvP2itU8iI9FiY2RGafR")
  const [isConnected, setIsConnected] = useState(false)

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/files', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch files')
      const data = await response.json()
      setFiles(data.files)
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
      const response = await fetch('/api/files/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete file')
      }

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
      const response = await fetch('/api/files/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url: selectedFile, content }),
      })

      if (!response.ok) {
        throw new Error('Failed to save file')
      }

      setFileContent(content)
      await fetchFiles()
      toast.success('File saved successfully')
    } catch (error) {
      toast.error('Failed to save file')
    }
  }

  const handleCreateFile = async (filename: string, content: string) => {
    try {
      const response = await fetch('/api/files/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ filename, content }),
      })

      if (!response.ok) {
        throw new Error('Failed to create file')
      }

      const newFile = await response.json()
      await fetchFiles()
      setSelectedFile(newFile.url)
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