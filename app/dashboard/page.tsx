'use client'
import { useQuery } from '@tanstack/react-query'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Topbar } from '@/components/layout/Topbar'
import { StatCard } from '@/components/ui/StatCard'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { authService } from '@/services/auth.service'
import { usersService } from '@/services/users.service'
import { useAuth } from '@/hooks/useAuth'
import { fmtRelative, fmtDate } from '@/lib/utils'
import { Users2, MonitorSmartphone, ShieldCheck, Activity, Globe, Laptop, Smartphone } from 'lucide-react'
import type { Session } from '@/types'

function DeviceIcon({ ua }: { ua: string | null }) {
  if (!ua) return <Globe className="w-4 h-4" />
  if (/mobile/i.test(ua)) return <Smartphone className="w-4 h-4" />
  return <Laptop className="w-4 h-4" />
}

export default function DashboardPage() {
  const { user } = useAuth()

  const { data: me,       isLoading: meLoading }    = useQuery({ queryKey: ['me'],       queryFn: authService.me })
  const { data: sessions, isLoading: sessLoading }  = useQuery({ queryKey: ['sessions'], queryFn: authService.sessions })
  const { data: stats,    isLoading: statsLoading } = useQuery({ queryKey: ['users-stats'], queryFn: usersService.stats })

  return (
    <DashboardLayout>
      <Topbar title="Dashboard" subtitle={`Bienvenido, ${user?.name ?? user?.email ?? '...'}`} />

      <div className="p-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 stagger">
          <StatCard label="Total usuarios"  value={statsLoading ? '—' : stats?.total ?? 0}   icon={Users2}           color="#3B82F6" index={0} />
          <StatCard label="Activos"         value={statsLoading ? '—' : stats?.active ?? 0}  icon={Activity}         color="#22C55E" index={1} />
          <StatCard label="Sesiones vivas"  value={sessLoading  ? '—' : sessions?.length ?? 0} icon={MonitorSmartphone} color="#F59E0B" index={2} />
          <StatCard label="Administradores" value={statsLoading ? '—' : stats?.admins ?? 0}  icon={ShieldCheck}      color="#A78BFA" index={3} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Profile card */}
          <div className="card p-5 animate-fade-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[#52525B] mb-4">Tu cuenta</h2>
            {meLoading ? (
              <div className="space-y-3">
                {Array.from({length:4}).map((_,i) => <Skeleton key={i} className="h-4 w-full" />)}
              </div>
            ) : me ? (
              <div className="space-y-3">
                {[
                  { label: 'Email',          value: me.email },
                  { label: 'Rol',            value: me.role,     badge: true },
                  { label: 'Plan',           value: me.plan,     badge: true, color: 'blue' as const },
                  { label: 'Tenant ID',      value: me.tenantId, mono: true },
                  { label: 'Nivel seguridad',value: String(me.securityLevel) },
                ].map(({ label, value, badge, color, mono }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                    <span className="text-xs text-[#52525B]">{label}</span>
                    {badge ? (
                      <Badge variant={color ?? 'muted'}>{value}</Badge>
                    ) : (
                      <span className={`text-sm ${mono ? 'font-mono text-[#A1A1AA] text-xs' : 'text-[#FAFAFA]'}`}>
                        {value}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#52525B]">No se pudo cargar el perfil.</p>
            )}
          </div>

          {/* Active sessions */}
          <div className="card p-5 animate-fade-up" style={{ animationDelay: '240ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#52525B]">Sesiones activas</h2>
              {sessions && (
                <Badge variant="blue">{sessions.length} activa{sessions.length !== 1 ? 's' : ''}</Badge>
              )}
            </div>

            {sessLoading ? (
              <div className="space-y-3">
                {Array.from({length:3}).map((_,i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sessions?.length === 0 ? (
              <p className="text-sm text-[#52525B]">No hay sesiones activas.</p>
            ) : (
              <div className="space-y-1">
                {sessions?.slice(0, 6).map((s: Session) => (
                  <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.03] transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-[#A1A1AA] shrink-0">
                      <DeviceIcon ua={s.user_agent} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-[#FAFAFA] font-medium truncate">
                        {s.device_name ?? 'Dispositivo desconocido'}
                      </p>
                      <p className="text-xs text-[#52525B] font-mono">{s.ip_address ?? '—'}</p>
                    </div>
                    <span className="text-xs text-[#52525B] shrink-0">{fmtRelative(s.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
