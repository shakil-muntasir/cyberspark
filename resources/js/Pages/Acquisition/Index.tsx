import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import { Separator } from '@/Components/ui/separator'
import PageHeader from '@/Layouts/Partials/page-header'
import AddAcquisition from '@/Pages/Acquisition/Partials/add-acquisition'

const AcquisitionsList = () => {
  return (
    <AuthenticatedLayout title='Acquisitions'>
      <div className='flex items-center justify-between'>
        <PageHeader title='Acquisitions' description='This is the acquisitions page. You can view, edit, and delete acquisitions here.' />
        <AddAcquisition />
      </div>

      <Separator className='mt-4' />
    </AuthenticatedLayout>
  )
}

export default AcquisitionsList
