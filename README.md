# Vercel Blob File Manager

A React component for managing files in Vercel Blob storage.

## Installation

```bash
npm install @hcapp01/blob-manager
```

## Usage

```tsx
import { useRef, useState } from 'react'
import { FileManager, FileManagerRef } from '@hcapp01/vercel-blob-file-manager'
import { BlobFile } from '@hcapp01/vercel-blob-file-manager'

function App() {
  const [selectedFile, setSelectedFile] = useState<BlobFile | null>(null)
  const [fileContent, setFileContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const fileManagerRef = useRef<FileManagerRef>(null)

  const handleFileSelect = async (file: BlobFile) => {
    setSelectedFile(file)
    if (fileManagerRef.current) {
      try {
        const content = await fileManagerRef.current.handleReadFile(file)
        setFileContent(content)
      } catch (error) {
        console.error('Failed to read file:', error)
      }
    }
  }

  const handleSave = async (content: string) => {
    if (!selectedFile || !fileManagerRef.current) return
    await fileManagerRef.current.handleSaveFile(selectedFile, content)
    setFileContent(content)
  }

  return (
    <div>
      {isConnected && <Uploader fileManagerRef={fileManagerRef} />}
      <FileManager
        ref={fileManagerRef}
        onFileSelect={handleFileSelect}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        config={{ confirmDelete: true }}
        onConnectionChange={setIsConnected}
      />
      {selectedFile && (
        <FileEditor
          content={fileContent}
          onSave={handleSave}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}
```

## Props

### FileManager Props
- `ref`: Reference to access FileManager methods
- `onFileSelect`: Callback when a file is selected, receives file object
- `isLoading`: Loading state for file operations
- `setIsLoading`: Function to update loading state
- `config`: Configuration object
  - `confirmDelete`: Show confirmation dialog before deleting files (default: false)
- `onConnectionChange`: Callback when Blob storage connection status changes
- `className`: Optional CSS class name

### FileManagerRef Methods
- `handleReadFile`: Read content of a file
- `handleSaveFile`: Create new or update existing file with content
- `isConnected`: Boolean indicating if connected to Blob storage

### Uploader Props
- `fileManagerRef`: Reference to FileManager component

### FileEditor Props
- `content`: Current file content
- `onSave`: Callback when saving changes
- `isLoading`: Loading state indicator
```