'use client'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean; onClose: () => void
  title: string; description?: string
  children: React.ReactNode; size?: 'sm' | 'md' | 'lg'
}

export function Modal({ open, onClose, title, description, children, size = 'md' }: ModalProps) {
  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }
  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/55 backdrop-blur-[3px] z-40 animate-fade-in" />
        <Dialog.Content className={cn(
          'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
          'w-[calc(100vw-2rem)]', widths[size],
          'bg-[#111113] border border-white/[0.08] rounded-xl',
          'shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_20px_60px_rgba(0,0,0,0.7)]',
          'p-6 outline-none animate-fade-up'
        )}>
          <div className="flex items-start justify-between mb-5">
            <div>
              <Dialog.Title className="text-[15px] font-semibold text-[#FAFAFA] leading-snug">{title}</Dialog.Title>
              {description && <Dialog.Description className="text-sm text-[#71717A] mt-0.5">{description}</Dialog.Description>}
            </div>
            <button onClick={onClose} className="ml-4 p-1.5 rounded-md text-[#52525B] hover:text-[#A1A1AA] hover:bg-white/[0.06] transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
