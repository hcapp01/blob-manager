import { ReactNode } from 'react'

export interface BlobFile {
  pathname: string
  url: string
}

export interface FileManagerProps {
  token: string
  onFileSelect?: (file: BlobFile) => void
  onFileDelete?: (file: BlobFile) => void
  onFileCreate?: (file: BlobFile) => void
  onFileUpdate?: (file: BlobFile, content: string) => void
  className?: string
  children?: ReactNode
}

export interface UseFileManagerOptions {
  token: string
  onFileSelect?: (file: BlobFile) => void
  onFileDelete?: (file: BlobFile) => void
  onFileCreate?: (file: BlobFile) => void
  onFileUpdate?: (file: BlobFile, content: string) => void
}