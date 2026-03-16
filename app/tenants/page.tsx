'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Topbar } from '@/components/layout/Topbar'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { Spinner } from '@/components/ui/Spinner'
import { useTenant, useUpdateTenant } from '@/hooks/useTenant'
import { fmtDate } from '@/lib/utils'
import { Building2, Globe, Hash, Calendar, ShieldCheck, Save } from 'lucide-react'
import type { Plan } from '@/types'

const planMeta: Record<Plan, { label: string; badge: 'muted' | 'blue' | 'green'; desc: string }> = {
  BASIC:      { label: 'Básico',      badge: 'muted',  desc: 'Hasta 10 usuarios, funciones esenciales' },
  PREMIUM:    { label: 'Premium',     badge: 'blue',   desc: 'Hasta 50 usuarios, API acccess, 2FA' },
  ENTERPRISE: { label: 'Enterprise',  badge: 'green',  desc: 'Usuarios ilimitados, SLAs, soporte prioritario' },
}

export default function TenantsPage() {
  const { data: tenant, isLoading } = useTenant()
  const { mutate: update, isPending } = useUpdateTenant()
  const { register, handleSubmit, reset } = useForm<{ name: string; security_level: number }>()

  useEffect(() => {
    if (tenant) reset({ name: tenant.name, security_level: tenant.security_level })
  }, [tenant, reset])

  const onSubmit = (data: { name: string; security_level: number }) => {
    if (!tenant) return
    update({ id: tenant.id, payload: { name: data.name, security_level: Number(data.security_level) } })
  }

  const pm = tenant ? planMeta[tenant.plan] ?? planMeta.BASIC : null

  return (
    <DashboardLayout>
      <Topbar title="Organización" subtitle="Configuración y detalles de tu tenant" />

      <div className="p-6 space-y-5 max-w-2xl">
        {/* Overview card */}
        <div className="card p-6 animate-fade-up">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#52525B] mb-5">Información</h2>
          {isLoading ? (
            <div className="space-y-3">{Array.from({length:5}).map((_,i) => <Skeleton key={i} className="h-5 w-full" />)}</div>
          ) : tenant ? (
            <div className="divide-y divide-white/[0.05] space-y-0">
              {[
                { label: 'Nombre',        value: tenant.name,  icon: Building2,   mono: false },
                { label: 'Slug',          value: tenant.slug,  icon: Globe,       mono: true  },
                { label: 'RUC',           value: tenant.ruc,   icon: Hash,        mono: true  },
                { label: 'Creado',        value: fmtDate(tenant.created_at), icon: Calendar, mono: false },
              ].map(({ label, value, icon: Icon, mono }) => (
                <div key={label} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2.5 text-[#52525B]">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{label}</span>
                  </div>
                  <span className={`text-sm ${mono ? 'font-mono text-[#A1A1AA]' : 'text-[#FAFAFA] font-medium'}`}>{value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2.5 text-[#52525B]">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-sm">Plan activo</span>
                </div>
                <Badge variant={pm?.badge ?? 'muted'}>{pm?.label ?? tenant.plan}</Badge>
              </div>
            </div>
          ) : (
            <p className="text-sm text-red-400">No se pudo cargar el tenant.</p>
          )}
        </div>

        {/* Plan details */}
        {tenant && pm && (
          <div className="card p-5 border-[#3B82F6]/20 animate-fade-up" style={{ animationDelay: '80ms' }}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#FAFAFA]">Plan {pm.label}</h3>
                <p className="text-sm text-[#52525B] mt-1">{pm.desc}</p>
              </div>
              <Badge variant={pm.badge}>{tenant.plan}</Badge>
            </div>
          </div>
        )}

        {/* Edit form */}
        <div className="card p-6 animate-fade-up" style={{ animationDelay: '120ms' }}>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#52525B] mb-5">Configuración</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-2">Nombre de la organización</label>
              <input {...register('name')} className="field" placeholder="Mi Empresa S.A." />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-2">
                Nivel de seguridad
                <span className="ml-2 text-[#52525B] font-normal">— 0 básico · 1 medio · 2 máximo (require 2FA)</span>
              </label>
              <select {...register('security_level')} className="field bg-[#18181B]">
                <option value={0}>0 — Básico</option>
                <option value={1}>1 — Medio</option>
                <option value={2}>2 — Máximo (2FA obligatorio)</option>
              </select>
            </div>
            <div className="pt-2">
              <button type="submit" disabled={isPending || isLoading} className="btn btn-primary">
                {isPending ? <Spinner size="sm" /> : <Save className="w-3.5 h-3.5" />}
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
