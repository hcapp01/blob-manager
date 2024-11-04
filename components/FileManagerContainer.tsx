'use client'

interface FileManagerContainerProps {
  children: React.ReactNode
}

export function FileManagerContainer({ children }: FileManagerContainerProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}