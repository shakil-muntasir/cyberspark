import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

export default function Dashboard() {
  return (
    <AuthenticatedLayout title='Dashboard'>
      <div className='py-12'>
        <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
          <div className='overflow-hidden bg-background shadow-sm sm:rounded-lg'>
            <div className='p-6 text-foreground'>You&apos;re logged in!</div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
