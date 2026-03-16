'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui/Spinner'
import { Hexagon, Mail, Lock, ArrowRight } from 'lucide-react'

const schema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(1, 'Requerido'),
})
type F = z.infer<typeof schema>

export default function LoginPage() {
  const { login, loading } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm<F>({ resolver: zodResolver(schema) })

  return (
    <div className="min-h-screen flex bg-[#09090B]">
      {/* Left — branding panel */}
      <div className="hidden lg:flex w-[44%] flex-col justify-between p-12 bg-[#0A0A0C] border-r border-white/[0.05] relative overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        {/* Glow */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-500/[0.06] blur-[120px] pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 rounded-[10px] bg-[#3B82F6] flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              <Hexagon className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <span className="font-bold text-[17px] text-[#FAFAFA] tracking-tight">FacturaSaaS</span>
          </div>

          <h2 className="text-[38px] font-bold text-[#FAFAFA] leading-[1.15] tracking-tight mb-4">
            Tu plataforma<br />de facturación<br />
            <span className="text-[#3B82F6]">inteligente.</span>
          </h2>
          <p className="text-[#52525B] text-base leading-relaxed max-w-sm">
            Gestiona múltiples organizaciones, usuarios y accesos desde un solo lugar.
          </p>
        </div>

        <div className="relative space-y-4">
          {[
            { title: 'Multi-tenant', desc: 'Aislamiento total por organización' },
            { title: 'JWT seguro',   desc: 'Tokens con rotación automática' },
            { title: 'Auditoría',    desc: 'Cada acción registrada y trazable' },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] shrink-0" />
              <span className="text-[#FAFAFA] font-medium">{f.title}</span>
              <span className="text-[#3F3F46]">—</span>
              <span className="text-[#52525B]">{f.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[380px] animate-fade-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-[8px] bg-[#3B82F6] flex items-center justify-center">
              <Hexagon className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <span className="font-bold text-[15px] text-[#FAFAFA]">FacturaSaaS</span>
          </div>

          <div className="mb-8">
            <h1 className="text-[24px] font-bold text-[#FAFAFA] tracking-tight">Bienvenido de vuelta</h1>
            <p className="text-sm text-[#52525B] mt-1">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit(d => login(d.email, d.password))} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-2 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3F3F46] pointer-events-none" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="admin@empresa.com"
                  autoComplete="email"
                  className={`field pl-10 ${errors.email ? 'field-error' : ''}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1.5">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-2 uppercase tracking-wider">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3F3F46] pointer-events-none" />
                <input
                  {...register('password')}
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`field pl-10 ${errors.password ? 'field-error' : ''}`}
                />
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1.5">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full mt-6">
              {loading ? <Spinner size="sm" /> : <ArrowRight className="w-4 h-4" />}
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-8 p-4 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <p className="text-[11px] font-semibold text-[#3F3F46] uppercase tracking-widest mb-2">Demo</p>
            <div className="font-mono text-xs text-[#52525B] space-y-1">
              <p><span className="text-[#3F3F46]">email</span>    admin@techfuture.com</p>
              <p><span className="text-[#3F3F46]">pass </span>    Admin123!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
