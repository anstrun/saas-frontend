'use client'
import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Topbar } from '@/components/layout/Topbar'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { Empty } from '@/components/ui/Empty'
import { CreateUserModal } from '@/components/modals/CreateUserModal'
import { EditUserModal } from '@/components/modals/EditUserModal'
import { useUsers, useDeactivateUser } from '@/hooks/useUsers'
import { fmtRelative } from '@/lib/utils'
import { Plus, Search, Pencil, UserX, Users2 } from 'lucide-react'
import type { User, UserStatus, UserRole } from '@/types'
import { Spinner } from '@/components/ui/Spinner'

const statusBadge: Record<UserStatus, 'green' | 'red' | 'amber' | 'muted'> = {
  ACTIVE: 'green', INACTIVE: 'red', SUSPENDED: 'amber', PENDING_VERIFICATION: 'muted',
}
const roleBadge: Record<UserRole, 'purple' | 'blue' | 'muted' | 'muted'> = {
  SUPER_ADMIN: 'purple', ADMIN: 'blue', USER: 'muted', VIEWER: 'muted',
}

export default function UsersPage() {
  const [search, setSearch]       = useState('')
  const [createOpen, setCreate]   = useState(false)
  const [editUser, setEditUser]   = useState<User | null>(null)

  const { data, isLoading, error } = useUsers({ search: search || undefined })
  const { mutate: deactivate, isPending: deactivating } = useDeactivateUser()

  return (
    <DashboardLayout>
      <Topbar
        title="Usuarios"
        subtitle={data ? `${data.total} usuarios en tu organización` : undefined}
        actions={
          <button onClick={() => setCreate(true)} className="btn btn-primary">
            <Plus className="w-3.5 h-3.5" /> Nuevo usuario
          </button>
        }
      />

      <div className="p-6 space-y-4">
        {/* Search */}
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3F3F46] pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar usuario..."
            className="field pl-9 h-9"
          />
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          {isLoading ? <TableSkeleton rows={7} /> : error ? (
            <div className="p-8 text-center text-sm text-red-400">Error al cargar usuarios.</div>
          ) : !data?.items.length ? (
            <Empty icon={Users2} title="Sin usuarios" body="Crea el primer usuario de tu organización." action={
              <button onClick={() => setCreate(true)} className="btn btn-primary"><Plus className="w-3.5 h-3.5" /> Crear usuario</button>
            } />
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Último acceso</th>
                  <th>2FA</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((u: User) => (
                  <tr key={u.id}>
                    <td className="primary">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} size="sm" />
                        <div>
                          <p className="text-[13.5px] font-medium text-[#FAFAFA]">{u.name}</p>
                          <p className="text-xs text-[#52525B] font-mono">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td><Badge variant={roleBadge[u.role] ?? 'muted'}>{u.role}</Badge></td>
                    <td><Badge variant={statusBadge[u.status] ?? 'muted'} dot>{u.status}</Badge></td>
                    <td><span className="text-xs">{fmtRelative(u.last_login_at)}</span></td>
                    <td>
                      <Badge variant={u.two_fa_enabled ? 'green' : 'muted'}>
                        {u.two_fa_enabled ? '2FA ON' : 'OFF'}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => setEditUser(u)} className="btn btn-ghost p-1.5" title="Editar">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {u.status === 'ACTIVE' && (
                          <button onClick={() => deactivate(u.id)} disabled={deactivating}
                            className="btn btn-ghost p-1.5 hover:text-red-400" title="Desactivar">
                            {deactivating ? <Spinner size="sm" /> : <UserX className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {data && data.total > data.items.length && (
          <p className="text-xs text-[#52525B] text-center">
            Mostrando {data.items.length} de {data.total} usuarios
          </p>
        )}
      </div>

      <CreateUserModal open={createOpen} onClose={() => setCreate(false)} />
      <EditUserModal user={editUser} onClose={() => setEditUser(null)} />
    </DashboardLayout>
  )
}
