'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { Sidebar } from './Sidebar'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const authed   = useAuthStore(s => s.authed)
  const hydrated = useAuthStore(s => s.hydrated)

  useEffect(() => {
    if (hydrated && !authed) router.replace('/login')
  }, [hydrated, authed, router])

  if (!hydrated) return null
  if (!authed)   return null

  return (
    <div className="flex h-screen overflow-hidden bg-[#09090B]">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto min-w-0">
        {children}
      </main>
    </div>
  )
}
