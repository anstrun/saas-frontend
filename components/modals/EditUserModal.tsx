'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Modal } from '@/components/ui/Modal'
import { useUpdateUser } from '@/hooks/useUsers'
import { Spinner } from '@/components/ui/Spinner'
import type { User } from '@/types'

interface F { name: string; role: string; status: string }

export function EditUserModal({ user, onClose }: { user: User | null; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateUser()
  const { register, handleSubmit, reset } = useForm<F>()

  useEffect(() => {
    if (user) reset({ name: user.name, role: user.role, status: user.status })
  }, [user, reset])

  const onSubmit = async (data: F) => {
    if (!user) return
    await mutateAsync({ id: user.id, payload: data as any })
    onClose()
  }

  return (
    <Modal open={!!user} onClose={onClose} title="Editar usuario">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Nombre</label>
          <input {...register('name')} className="field" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Rol</label>
          <select {...register('role')} className="field bg-[#18181B]">
            {['USER', 'ADMIN', 'VIEWER', 'SUPER_ADMIN'].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Estado</label>
          <select {...register('status')} className="field bg-[#18181B]">
            {['ACTIVE', 'INACTIVE', 'SUSPENDED'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-2 border-t border-white/[0.06] mt-4">
          <button type="button" onClick={onClose} className="btn btn-secondary">Cancelar</button>
          <button type="submit" disabled={isPending} className="btn btn-primary">
            {isPending && <Spinner size="sm" />} Guardar cambios
          </button>
        </div>
      </form>
    </Modal>
  )
}
