'use client'

import { useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import { FileList } from './FileList'
import { NewFileDialog } from './NewFileDialog'
import { TokenInput } from './TokenInput'
import { SearchBar } from './SearchBar'
import { useFileManager } from '@/lib/useFileManager'
import { BlobFile, FileManagerConfig } from '@/lib/types'
import toast from 'react-hot-toast'

interface FileManagerProps {
  onFileSelect?: (file: BlobFile) => void
  isLoading?: boolean
  setIsLoading?: (loading: boolean) => void
  config?: FileManagerConfig
  onConnectionChange?: (connected: boolean) => void
}

export interface FileManagerRef {
  handleSaveFile: (file: BlobFile, content: string) => Promise<string>
  handleReadFile: (file: BlobFile) => Promise<string | null>
  isConnected: boolean
}

const FileManager = forwardRef<FileManagerRef, FileManagerProps>(({ 
  onFileSelect, 
  isLoading = false,
  setIsLoading = () => {},
  config = { confirmDelete: false },
  onConnectionChange
}, ref) => {
  const {
    files,
    selectedFile,
    token,
    setToken,
    isConnected,
    handleDelete,
    handleSaveFile,
    handleReadFile,
    handleTokenSubmit
  } = useFileManager()

  useEffect(() => {
    onConnectionChange?.(isConnected)
  }, [isConnected, onConnectionChange])

  useImperativeHandle(ref, () => ({
    handleSaveFile,
    handleReadFile,
    isConnected
  }))

  const handleFileSelection = async (url: string) => {
    try {
      setIsLoading(true)
      const file = files.find(f => f.url === url)
      if (!file) return
      onFileSelect?.(file)
    } catch (error) {
      toast.error('Failed to select file')
    } finally {
      setIsLoading(false)
    }
  }

  const [isNewFileDialogOpen, setNewFileDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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
          onCreate={(filename, content) => handleSaveFile({ pathname: filename, url: '' }, content)}
        />
      </div>
    </div>
  )
})

FileManager.displayName = 'FileManager'

export default FileManager