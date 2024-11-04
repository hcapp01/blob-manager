'use client'

import { useState } from 'react'

interface NewFileDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (filename: string, content: string) => void
}

export function NewFileDialog({ isOpen, onClose, onCreate }: NewFileDialogProps) {
  const [filename, setFilename] = useState('')
  const [content, setContent] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (filename && content) {
      // Remove any file extension if present
      const cleanFilename = filename.split('.')[0]
      onCreate(cleanFilename, content)
      setFilename('')
      setContent('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create New Text File</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="filename" className="block text-sm font-medium text-gray-700 mb-1">
              Filename
            </label>
            <input
              type="text"
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="readme"
              required
            />
            <p className="mt-1 text-sm text-gray-500">Enter filename without extension</p>
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-32 p-2 font-mono text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter file content..."
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}