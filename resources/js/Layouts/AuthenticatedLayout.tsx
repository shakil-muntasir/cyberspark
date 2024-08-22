import { SearchIcon } from 'lucide-react'

import MakeSell from '@/Components/MakeSell'
import { DarkModeToggle } from '@/Components/ui/dark-mode-toggle'
import { Input } from '@/Components/ui/input'
import { Separator } from '@/Components/ui/separator'
import { Toaster } from '@/Components/ui/toaster'
import DynamicBreadcrumb from '@/Layouts/Partials/breadcrumb'
import MobileNavigation from '@/Layouts/Partials/mobile-navigation'
import PcNavigation from '@/Layouts/Partials/pc-navigation'
import UserDropdown from '@/Layouts/Partials/user-dropdown'
import { useTheme } from '@/Providers/theme-provider'
import SprintDevsFullDark from '@/public/assets/sprint_devs_full_dark.svg'
import SprintDevsFullLight from '@/public/assets/sprint_devs_full_light.svg'
import { Head } from '@inertiajs/react'
import { FacebookIcon } from '@/Icons/FacebookIcon'
import { InstagramIcon } from '@/Icons/InstagramIcon'
import { LinkedInIcon } from '@/Icons/LinkedInIcon'

export default function AuthenticatedLayout({ title = '', children }: { title?: string; children: React.ReactNode }) {
  const currentDate = new Date()
  const { theme } = useTheme()
  return (
    <>
      <Head title={title} />
      <div className='flex min-h-screen w-full flex-col bg-muted/40'>
        <PcNavigation />
        <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14 min-h-screen'>
          <header className='sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
            <MobileNavigation />
            <DynamicBreadcrumb />
            <div className='relative ml-auto flex-1 md:grow-0'>
              <SearchIcon className='absolute left-2.5 top-3 h-4 w-4 text-muted-foreground' />
              <Input id='search' type='search' name='search' className='w-full rounded-md bg-background pl-8 md:w-[200px] lg:w-[336px]' placeholder='Search...' />
            </div>
            <MakeSell />
            <DarkModeToggle />
            <UserDropdown />
          </header>
          <main className='flex-1 items-start px-6 py-4 md:py-0'>{children}</main>
          <footer className='px-6'>
            <div className='flex flex-row-reverse lg:flex-row items-center my-3'>
              <div className='flex justify-end lg:justify-start w-1/2'>
                <img className='h-12 p-2 ' src={theme === 'dark' ? SprintDevsFullDark : SprintDevsFullLight} />
              </div>
              <div className='flex items-center lg:justify-start w-1/2 gap-2 px-2 lg:-ml-14'>
                <a href='#'>
                  <FacebookIcon className='h-6 text-foreground/70 hover:text-foreground' />
                </a>
                <a href='#'>
                  <InstagramIcon className='h-6 text-foreground/70 hover:text-foreground' />
                </a>
                <a href='#'>
                  <LinkedInIcon className='h-6 text-foreground/70 hover:text-foreground' />
                </a>
              </div>
              <span></span>
            </div>
            <Separator />
            <div className='flex items-center justify-center text-sm text-muted-foreground my-4 gap-1 lg:mb-0'>
              <span>Copyright &copy;{currentDate.getFullYear()} </span>
              <a href='https://sprintdevs.com' target='_blank' className='text-brand font-semibold hover:underline underline-offset-2'>
                Sprint Devs
              </a>
            </div>
          </footer>
        </div>
      </div>
      <Toaster />
    </>
  )
}
