'use client'

import { useState, useEffect } from 'react'
import { FileList } from './FileList'
import { FileEditor } from './FileEditor'
import { NewFileDialog } from './NewFileDialog'
import toast from 'react-hot-toast'

interface BlobFile {
  pathname: string
  url: string
}

export default function FileManager() {
  const [files, setFiles] = useState<BlobFile[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string>('')
  const [isNewFileDialogOpen, setNewFileDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/files')
      const data = await response.json()
      setFiles(data.files)
    } catch (error) {
      toast.error('Failed to fetch files')
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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, content }),
      })

      if (!response.ok) {
        throw new Error('Failed to create file')
      }

      const newFile = await response.json()
      await fetchFiles()
      setSelectedFile(newFile.url)
      setFileContent(content)
      setNewFileDialogOpen(false)
      toast.success('File created successfully')
    } catch (error) {
      toast.error('Failed to create file')
    }
  }

  const filteredFiles = files.filter(file => 
    file.pathname.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Files</h2>
              <button
                onClick={() => setNewFileDialogOpen(true)}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
                New Text File
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
              />
              <svg
                className="absolute left-3 top-2.5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <FileList 
              files={filteredFiles}
              onSelect={handleFileSelect}
              onDelete={handleDelete}
              selectedFile={selectedFile}
            />
          </div>
        </div>
      </div>
      {selectedFile && (
        <FileEditor
          content={fileContent}
          onSave={handleSave}
          isLoading={isLoading}
        />
      )}
      <NewFileDialog
        isOpen={isNewFileDialogOpen}
        onClose={() => setNewFileDialogOpen(false)}
        onCreate={handleCreateFile}
      />
    </div>
  )
}