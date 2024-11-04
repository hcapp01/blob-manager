'use client'

import { useState } from 'react'
import { FileList } from './FileList'
import { NewFileDialog } from './NewFileDialog'
import { TokenInput } from './TokenInput'
import { SearchBar } from './SearchBar'
import { useFileManager } from '@/lib/useFileManager'
import { BlobFile } from '@/lib/types'

interface FileManagerProps {
  onFileSelect?: (file: BlobFile) => void
}

export default function FileManager({ onFileSelect }: FileManagerProps) {
  const {
    files,
    selectedFile,
    isLoading,
    token,
    setToken,
    isConnected,
    handleFileSelect,
    handleDelete,
    handleCreateFile,
    handleTokenSubmit
  } = useFileManager()

  const [isNewFileDialogOpen, setNewFileDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFiles = files.filter(file => 
    file.pathname.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isConnected) {
    return <TokenInput token={token} setToken={setToken} onSubmit={handleTokenSubmit} />
  }

  const handleFileSelection = async (url: string) => {
    const file = files.find(f => f.url === url)
    if (file) {
      handleFileSelect(url)
      onFileSelect?.(file)
    }
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
        />
        <NewFileDialog
          isOpen={isNewFileDialogOpen}
          onClose={() => setNewFileDialogOpen(false)}
          onCreate={handleCreateFile}
        />
      </div>
    </div>
  )
}