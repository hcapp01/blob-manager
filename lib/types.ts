export interface BlobFile {
  pathname: string
  url: string
}

export interface FileManagerConfig {
  confirmDelete?: boolean
}

export interface FileManagerProps {
  token: string
  onFileSelect?: (file: BlobFile, content: string) => void
  onFileDelete?: (file: BlobFile) => void
  onFileCreate?: (file: BlobFile) => void
  onFileUpdate?: (file: BlobFile, content: string) => void
  className?: string
  children?: ReactNode
  config?: FileManagerConfig
  onConnectionChange?: (connected: boolean) => void
}

export interface UseFileManagerOptions {
  token: string
  onFileSelect?: (file: BlobFile) => void
  onFileDelete?: (file: BlobFile) => void
  onFileCreate?: (file: BlobFile) => void
  onFileUpdate?: (file: BlobFile, content: string) => void
  config?: FileManagerConfig
}