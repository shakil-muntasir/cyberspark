import { Head } from '@inertiajs/react'

export default function GuestLayout({ title = '', children }: { title?: string; children: React.ReactNode }) {
  return (
    <>
      <Head title={title} />
      <div className='min-h-screen w-full lg:grid lg:min-h-[600px] xl:min-h-[800px]'>{children}</div>
    </>
  )
}
