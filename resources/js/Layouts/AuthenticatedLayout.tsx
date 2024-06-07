import { SearchIcon } from 'lucide-react'

import DynamicBreadcrumb from '@/Layouts/Partials/breadcrumb'
import MobileNavigation from '@/Layouts/Partials/mobile-navigation'
import PcNavigation from '@/Layouts/Partials/pc-navigation'
import UserDropdown from '@/Layouts/Partials/user-dropdown'
import { DarkModeToggle } from '@/Components/ui/dark-mode-toggle'
import { Input } from '@/Components/ui/input'
import { Toaster } from '@/Components/ui/toaster'
import { Head } from '@inertiajs/react'

export default function AuthenticatedLayout({ title = '', children }: { title?: string; children: React.ReactNode }) {
    return (
        <>
            <Head title={title} />
            <div className='flex min-h-screen w-full flex-col bg-muted/40'>
                <PcNavigation />
                <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
                    <header className='sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
                        <MobileNavigation />
                        <DynamicBreadcrumb />
                        <div className='relative ml-auto flex-1 md:grow-0'>
                            <SearchIcon className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                            <Input className='w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]' placeholder='Search...' type='search' />
                        </div>
                        <DarkModeToggle />
                        <UserDropdown />
                    </header>
                    <main className='flex-1 items-start px-6 py-4 md:py-0'>{children}</main>
                </div>
            </div>
            <Toaster />
        </>
    )
}
