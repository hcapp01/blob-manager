'use client'

interface TokenInputProps {
  token: string
  setToken: (token: string) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
}

export function TokenInput({ token, setToken, onSubmit }: TokenInputProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="token" className="block text-sm font-medium text-gray-700">
            Vercel Blob token
          </label>
          <input
            type="text"
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter your Vercel Blob token"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Connect to Vercel Blob
        </button>
      </form>
    </div>
  )
}