import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

const DemoPage = () => {
  return (
    <AuthenticatedLayout title='Demo'>
      <div className='flex h-full flex-1 flex-col gap-4 pt-0'>
        <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
          <div className='aspect-video rounded-xl bg-muted/50' />
          <div className='aspect-video rounded-xl bg-muted/50' />
          <div className='aspect-video rounded-xl bg-muted/50' />
        </div>
        <div className='flex-1 rounded-xl bg-muted/50' />
      </div>
    </AuthenticatedLayout>
  )
}

export default DemoPage
