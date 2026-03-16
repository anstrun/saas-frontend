'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users2, MonitorSmartphone, Building2, ScrollText, LogOut, Hexagon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { Badge } from '@/components/ui/Badge'

const NAV = [
  { href: '/dashboard', label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/users',     label: 'Usuarios',       icon: Users2 },
  { href: '/sessions',  label: 'Sesiones',        icon: MonitorSmartphone },
  { href: '/tenants',   label: 'Organización',    icon: Building2 },
  { href: '/audit',     label: 'Auditoría',       icon: ScrollText },
]

const planBadge: Record<string, 'blue' | 'amber' | 'green' | 'muted'> = {
  BASIC: 'muted', PREMIUM: 'blue', ENTERPRISE: 'green',
}

export function Sidebar() {
  const path = usePathname()
  const { user, logout } = useAuth()

  return (
    <aside className="w-[224px] shrink-0 flex flex-col h-screen sticky top-0 bg-[#0A0A0C] border-r border-white/[0.05]">
      {/* Logo */}
      <div className="h-[56px] flex items-center px-5 border-b border-white/[0.05] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] rounded-[8px] bg-[#3B82F6] flex items-center justify-center shadow-[0_0_16px_rgba(59,130,246,0.45)]">
            <Hexagon className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          <span className="font-bold text-[15px] text-[#FAFAFA] tracking-tight">FacturaSaaS</span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== '/dashboard' && path.startsWith(href))
          return (
            <Link key={href} href={href} className={cn(
              'flex items-center gap-3 px-3 py-[9px] rounded-lg text-[13.5px] transition-all duration-100',
              active
                ? 'bg-[#3B82F6]/[0.14] text-[#FAFAFA] font-medium'
                : 'text-[#71717A] hover:text-[#BDBDBD] hover:bg-white/[0.04]'
            )}>
              <Icon className={cn('w-[17px] h-[17px] shrink-0', active && 'text-[#3B82F6]')} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/[0.05] p-3 space-y-1 shrink-0">
        {user && (
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              {(user.name ?? user.email)[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-medium text-[#FAFAFA] truncate leading-none mb-0.5">
                {user.name ?? user.email}
              </p>
              <Badge variant={planBadge[user.plan] ?? 'muted'} className="text-[10px] px-1.5 py-0">
                {user.plan}
              </Badge>
            </div>
          </div>
        )}
        <button onClick={logout} className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] text-[#71717A] hover:text-[#EF4444] hover:bg-[#EF4444]/[0.07] transition-all">
          <LogOut className="w-[17px] h-[17px] shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
