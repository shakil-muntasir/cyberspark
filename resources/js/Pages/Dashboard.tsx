import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

export default function Dashboard() {
  return (
    <AuthenticatedLayout title='Dashboard'>
      <div className='py-12'>
        <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
          <div className='bg-background overflow-hidden shadow-sm sm:rounded-lg'>
            <div className='p-6 text-foreground'>You're logged in!</div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
