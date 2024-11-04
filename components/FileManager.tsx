'use client'

import { useState } from 'react'
import { FileList } from './FileList'
import { FileEditor } from './FileEditor'
import { NewFileDialog } from './NewFileDialog'
import { TokenInput } from './TokenInput'
import { SearchBar } from './SearchBar'
import { FileManagerContainer } from './FileManagerContainer'
import { useFileManager } from './useFileManager'

export default function FileManager() {
  const {
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
  } = useFileManager()

  const [isNewFileDialogOpen, setNewFileDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFiles = files.filter(file => 
    file.pathname.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isConnected) {
    return <TokenInput token={token} setToken={setToken} onSubmit={handleTokenSubmit} />
  }

  return (
    <FileManagerContainer>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNewFile={() => setNewFileDialogOpen(true)}
      />
      <FileList 
        files={filteredFiles}
        onSelect={handleFileSelect}
        onDelete={handleDelete}
        selectedFile={selectedFile}
      />
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
    </FileManagerContainer>
  )
}