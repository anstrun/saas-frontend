'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Topbar } from '@/components/layout/Topbar'
import BillingIframe from '@/components/BillingIframe'

export default function FacturacionPage() {
  return (
    <DashboardLayout>
      <Topbar title="Facturación" subtitle="Gestión de facturas" />
      <div className="p-6 h-full">
        <BillingIframe />
      </div>
    </DashboardLayout>
  )
}