import { Separator } from '@/Components/ui/separator'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import PageHeader from '@/Layouts/Partials/page-header'
import AddInvoice from '@/Pages/Invoice/Partials/add-invoice'
import React from 'react'

const Invoice = () => {
  return (
    <AuthenticatedLayout title='Invoices'>
      <div className='flex items-center justify-between'>
        <PageHeader title='Invoices' description='This is the invoices page. You can view, edit, and delete invoices here.' />
        <AddInvoice />
      </div>

      <Separator className='mt-4' />
    </AuthenticatedLayout>
  )
}

export default Invoice
