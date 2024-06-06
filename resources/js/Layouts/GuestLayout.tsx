import LoginBackgroundImage from '@/public/assets/background.jpg'

import { Head } from '@inertiajs/react'

export default function GuestLayout({ title = '', children }: { title?: string; children: React.ReactNode }) {
    return (
        <>
            <Head title={title} />
            <div className='w-full min-h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]'>
                <div className='hidden bg-muted lg:block'>
                    <img src={LoginBackgroundImage} alt='Login Background' className='h-screen w-full object-cover dark:brightness-[0.2] dark:grayscale' />
                </div>
                {children}
            </div>
        </>
    )
}
