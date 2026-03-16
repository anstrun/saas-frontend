'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { useCreateUser } from '@/hooks/useUsers'
import { Spinner } from '@/components/ui/Spinner'

const schema = z.object({
  email:    z.string().email('Email inválido'),
  name:     z.string().min(2, 'Mínimo 2 caracteres'),
  password: z.string().min(8).regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'Necesita mayúscula, número y símbolo'),
  role:     z.enum(['USER', 'ADMIN', 'VIEWER']).default('USER'),
})
type F = z.infer<typeof schema>

export function CreateUserModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateUser()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<F>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: F) => {
    await mutateAsync(data)
    reset(); onClose()
  }

  return (
    <Modal open={open} onClose={() => { reset(); onClose() }} title="Nuevo usuario" description="Crea un usuario en tu organización">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Nombre completo</label>
          <input {...register('name')} placeholder="Juan Pérez" className={`field ${errors.name ? 'field-error' : ''}`} />
          {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Email</label>
          <input {...register('email')} type="email" placeholder="juan@empresa.com" className={`field ${errors.email ? 'field-error' : ''}`} />
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Contraseña</label>
          <input {...register('password')} type="password" placeholder="Min 8 chars, 1 mayúsc, 1 núm, 1 símbolo" className={`field ${errors.password ? 'field-error' : ''}`} />
          {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Rol</label>
          <select {...register('role')} className="field bg-[#18181B]">
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="VIEWER">VIEWER</option>
          </select>
        </div>
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/[0.06] mt-5">
          <button type="button" onClick={() => { reset(); onClose() }} className="btn btn-secondary">Cancelar</button>
          <button type="submit" disabled={isPending} className="btn btn-primary">
            {isPending && <Spinner size="sm" />}
            Crear usuario
          </button>
        </div>
      </form>
    </Modal>
  )
}
