'use client'

import { useState, forwardRef, useImperativeHandle } from 'react'
import { FileList } from './FileList'
import { NewFileDialog } from './NewFileDialog'
import { TokenInput } from './TokenInput'
import { SearchBar } from './SearchBar'
import { useFileManager } from '@/lib/useFileManager'
import { BlobFile, FileManagerConfig } from '@/lib/types'
import toast from 'react-hot-toast'

interface FileManagerProps {
  onFileSelect?: (file: BlobFile, content: string) => void
  isLoading?: boolean
  setIsLoading?: (loading: boolean) => void
  config?: FileManagerConfig
}

export interface FileManagerRef {
  handleCreateFile: (filename: string, content: string) => Promise<void>
  handleSaveFile: (file: BlobFile, content: string) => Promise<void>
}

const FileManager = forwardRef<FileManagerRef, FileManagerProps>(({ 
  onFileSelect, 
  isLoading = false,
  setIsLoading = () => {},
  config = { confirmDelete: false }
}, ref) => {
  const {
    files,
    selectedFile,
    token,
    setToken,
    isConnected,
    handleDelete,
    handleCreateFile,
    handleSaveFile,
    handleTokenSubmit
  } = useFileManager()

  const [isNewFileDialogOpen, setNewFileDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useImperativeHandle(ref, () => ({
    handleCreateFile,
    handleSaveFile
  }))

  const handleFileSelection = async (url: string) => {
    try {
      setIsLoading(true)
      const file = files.find(f => f.url === url)
      if (!file) return

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch file content')
      }
      const content = await response.text()
      onFileSelect?.(file, content)
    } catch (error) {
      toast.error('Failed to load file content')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredFiles = files.filter(file => 
    file.pathname.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isConnected) {
    return <TokenInput token={token} setToken={setToken} onSubmit={handleTokenSubmit} />
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-col space-y-4">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onNewFile={() => setNewFileDialogOpen(true)}
        />
        <FileList 
          files={filteredFiles}
          onSelect={handleFileSelection}
          onDelete={handleDelete}
          selectedFile={selectedFile}
          confirmDelete={config.confirmDelete}
        />
        <NewFileDialog
          isOpen={isNewFileDialogOpen}
          onClose={() => setNewFileDialogOpen(false)}
          onCreate={handleCreateFile}
        />
      </div>
    </div>
  )
})

FileManager.displayName = 'FileManager'

export default FileManager