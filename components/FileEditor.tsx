import { useState, useEffect } from 'react'

interface FileEditorProps {
  content: string
  onSave: (content: string) => void
  isLoading: boolean
}

export function FileEditor({ content, onSave, isLoading }: FileEditorProps) {
  const [editedContent, setEditedContent] = useState(content)
  const [isSaving, setSaving] = useState(false)

  useEffect(() => {
    setEditedContent(content)
  }, [content])

  const handleSave = async () => {
    setSaving(true)
    await onSave(editedContent)
    setSaving(false)
  }

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Text File</h2>
        </div>
        <div className="flex items-center justify-center h-[calc(100vh-300px)] min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Edit Text File</h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-4 py-2 rounded-md ${
            isSaving
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      <textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        className="w-full h-[calc(100vh-300px)] min-h-[300px] p-3 font-mono text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  )
}