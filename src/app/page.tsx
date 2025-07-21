'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// This is a redirect page - users should go to locale-specific pages
export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    // This will be handled by middleware, but just in case
    router.push('/en-US')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Redirecting...</h1>
        <p className="text-gray-600">Taking you to the right page</p>
      </div>
    </div>
  )
}