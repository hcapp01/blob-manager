'use client'

interface FileManagerContainerProps {
  children: React.ReactNode
}

export function FileManagerContainer({ children }: FileManagerContainerProps) {
  return (
    <div className="flex flex-col space-y-4">
      {children}
    </div>
  )
}