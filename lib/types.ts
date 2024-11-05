import type { ReactNode } from 'react'

export interface BlobFile {
  pathname: string
  url: string
}

export interface FileManagerConfig {
  confirmDelete?: boolean
}

export interface FileManagerProps {
  onFileSelect?: (file: BlobFile, content: string) => void
  isLoading?: boolean
  setIsLoading?: (loading: boolean) => void
  config?: FileManagerConfig
  onConnectionChange?: (connected: boolean) => void
  className?: string
  children?: ReactNode
}

export interface UseFileManagerOptions {
  token: string
  onFileSelect?: (file: BlobFile, content: string) => void
  onFileDelete?: (file: BlobFile) => void
  onFileCreate?: (file: BlobFile) => void
  onFileUpdate?: (file: BlobFile, content: string) => void
  config?: FileManagerConfig
}