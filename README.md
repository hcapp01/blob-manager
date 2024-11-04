# Vercel Blob File Manager

A React component for managing files in Vercel Blob storage.

## Installation

```bash
npm install @hcapp01/vercel-blob-file-manager
```

## Usage

```tsx
import { FileManager } from '@hcapp01/vercel-blob-file-manager'

function App() {
  return (
    <FileManager
      token="your_vercel_blob_token"
      onFileSelect={(file) => console.log('Selected file:', file)}
      onFileDelete={(file) => console.log('Deleted file:', file)}
      onFileCreate={(file) => console.log('Created file:', file)}
      onFileUpdate={(file, content) => console.log('Updated file:', file, content)}
    >
      {/* Your custom UI components */}
    </FileManager>
  )
}
```

## Props

- `token`: Vercel Blob token for authentication
- `onFileSelect`: Callback when a file is selected
- `onFileDelete`: Callback when a file is deleted
- `onFileCreate`: Callback when a file is created
- `onFileUpdate`: Callback when a file is updated
- `className`: Optional CSS class name
- `children`: React components for custom UI

## License

MIT