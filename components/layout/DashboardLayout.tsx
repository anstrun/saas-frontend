'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { Sidebar } from './Sidebar'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { authed } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !authed) router.replace('/login')
  }, [mounted, authed, router])

  if (!mounted) return null
  if (!authed) return null

  return (
    <div className="flex h-screen overflow-hidden bg-[#09090B]">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto min-w-0">
        {children}
      </main>
    </div>
  )
}
