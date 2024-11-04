'use client'

import { useState } from 'react'
import { put, del } from '@vercel/blob'
import Uploader from '@/components/uploader'
import FileManager from '@/components/FileManager'
import { FileEditor } from '@/components/FileEditor'
import { Toaster } from '@/components/toaster'
import { BlobFile } from '@/lib/types'
import toast from 'react-hot-toast'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<BlobFile | null>(null)
  const [fileContent, setFileContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleFileSelect = async (file: BlobFile) => {
    try {
      setIsLoading(true)
      setSelectedFile(file)
      const response = await fetch(file.url)
      if (!response.ok) {
        throw new Error('Failed to fetch file content')
      }
      const content = await response.text()
      setFileContent(content)
    } catch (error) {
      setSelectedFile(null)
      setFileContent('')
      toast.error('Failed to load file content')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (content: string) => {
    if (!selectedFile) return

    try {
      const token = localStorage.getItem('blobToken') || ''
      if (!token) {
        throw new Error('No blob token found')
      }

      // Create new blob with updated content first
      const newBlob = await put(selectedFile.pathname, content, {
        access: 'public',
        contentType: 'text/plain',
        token
      })

      // Delete the old blob only after successful creation
      await del(selectedFile.pathname, { token })

      // Update state with new blob URL
      setSelectedFile({ ...selectedFile, url: newBlob.url })
      setFileContent(content)
      toast.success('File saved successfully')
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save file')
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <Toaster />
      <h1 className="pt-4 pb-8 bg-gradient-to-br from-black via-[#171717] to-[#575757] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
        File Manager
      </h1>
      <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-4xl mx-auto w-full">
        <Uploader />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileManager onFileSelect={handleFileSelect} />
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