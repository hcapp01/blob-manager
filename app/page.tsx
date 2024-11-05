'use client'

import { useState, useRef } from 'react'
import Uploader from '@/components/uploader'
import FileManager, { FileManagerRef } from '@/components/FileManager'
import { FileEditor } from '@/components/FileEditor'
import { Toaster } from '@/components/toaster'
import { BlobFile } from '@/lib/types'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<BlobFile | null>(null)
  const [fileContent, setFileContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const fileManagerRef = useRef<FileManagerRef>(null)

  const handleFileSelect = async (file: BlobFile, content: string) => {
    setSelectedFile(file)
    setFileContent(content)
  }

  const handleSave = async (content: string) => {
    if (!selectedFile || !fileManagerRef.current) return

    try {
      await fileManagerRef.current.handleSaveFile(selectedFile, content)
      setFileContent(content)
    } catch (error) {
      console.error('Save error:', error)
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <Toaster />
      <h1 className="pt-4 pb-8 bg-gradient-to-br from-black via-[#171717] to-[#575757] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
        File Manager
      </h1>
      <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-4xl mx-auto w-full">
        <Uploader fileManagerRef={fileManagerRef} />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileManager 
            ref={fileManagerRef} 
            onFileSelect={handleFileSelect}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            config={{ confirmDelete: false }}
          />
          {selectedFile && (
            <FileEditor
              content={fileContent}
              onSave={handleSave}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </main>
  )
}