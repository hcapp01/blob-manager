interface FileListProps {
  files: Array<{ pathname: string; url: string }>
  onSelect: (url: string) => void
  onDelete: (url: string) => void
  selectedFile: string | null
  confirmDelete?: boolean
}

export function FileList({ files, onSelect, onDelete, selectedFile, confirmDelete = false }: FileListProps) {
  const formatFileName = (pathname: string) => {
    const maxLength = 30
    
    if (pathname.length <= maxLength) return pathname
    
    const lastDotIndex = pathname.lastIndexOf('.')
    if (lastDotIndex === -1) {
      return `${pathname.slice(0, maxLength)}...`
    }

    const extension = pathname.slice(lastDotIndex)
    const nameWithoutExt = pathname.slice(0, lastDotIndex)
    const truncatedName = nameWithoutExt.slice(0, maxLength - extension.length - 3)
    return `${truncatedName}...${extension}`
  }

  // Filter out folders (paths ending with '/')
  const fileList = files.filter(file => !file.pathname.endsWith('/'))

  const handleDelete = (url: string) => {
    if (confirmDelete) {
      if (confirm('Are you sure you want to delete this file?')) {
        onDelete(url)
      }
    } else {
      onDelete(url)
    }
  }

  return (
    <div className="overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <div className="space-y-2">
        {fileList.map(({ pathname, url }) => (
          <div 
            key={url}
            className={`flex justify-between items-center p-3 rounded-md ${
              selectedFile === url ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
          >
            <button
              onClick={() => onSelect(url)}
              className="flex-1 text-left flex items-center gap-2"
              title={pathname}
            >
              <span className="font-mono">{formatFileName(pathname)}</span>
            </button>
            <button
              onClick={() => handleDelete(url)}
              className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded"
              title="Delete file"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        ))}
        {fileList.length === 0 && (
          <p className="text-gray-500 text-sm p-3">No files found</p>
        )}
      </div>
    </div>
  )
}