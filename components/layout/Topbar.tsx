'use client'
import { useAuth } from '@/hooks/useAuth'
import { Badge } from '@/components/ui/Badge'

interface TopbarProps { title: string; subtitle?: string; actions?: React.ReactNode }

export function Topbar({ title, subtitle, actions }: TopbarProps) {
  const { user } = useAuth()
  return (
    <header className="h-[56px] shrink-0 sticky top-0 z-10 flex items-center justify-between px-6
      bg-[#09090B]/90 backdrop-blur-sm border-b border-white/[0.05]">
      <div>
        <h1 className="text-[15px] font-semibold text-[#FAFAFA] leading-none">{title}</h1>
        {subtitle && <p className="text-xs text-[#52525B] mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        {user?.name && (
          <span className="text-xs text-[#3F3F46] font-mono hidden sm:block">{user.email}</span>
        )}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700
          flex items-center justify-center text-xs font-bold text-white shrink-0">
          {(user?.name ?? user?.email ?? '?')[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  )
}
