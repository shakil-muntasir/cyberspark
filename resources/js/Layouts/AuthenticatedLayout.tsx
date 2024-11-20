import { BellIcon, MessageCircleMoreIcon, NotebookTextIcon, PlusIcon } from 'lucide-react'
import { Head, Link, usePage } from '@inertiajs/react'

import { useTheme } from '@/Providers/theme-provider'
import { DarkModeToggle } from '@/Components/ui/dark-mode-toggle'
import { Separator } from '@/Components/ui/separator'
import { Toaster } from '@/Components/ui/toaster'
import DynamicBreadcrumb from '@/Layouts/Partials/breadcrumb'
import MobileNavigation from '@/Layouts/Partials/mobile-navigation'
import UserDropdown from '@/Layouts/Partials/user-dropdown'
import SprintDevsFullDark from '@/public/assets/sprint_devs_full_dark.svg'
import SprintDevsFullLight from '@/public/assets/sprint_devs_full_light.svg'
import { FacebookIcon } from '@/Icons/FacebookIcon'
import { InstagramIcon } from '@/Icons/InstagramIcon'
import { LinkedInIcon } from '@/Icons/LinkedInIcon'
import { Button } from '@/Components/ui/button'
import { AppSidebar } from '@/Components/navbar/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/Components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/Components/ui/tooltip'
import { StarFilledIcon } from '@radix-ui/react-icons'
import { CircleFillIcon } from '@/Icons/CircleFill'

export default function AuthenticatedLayout({ title, children }: { title: string; children: React.ReactNode }) {
  const currentDate = new Date()
  const { theme } = useTheme()
  const { url } = usePage()

  return (
    <SidebarProvider>
      <AppSidebar />
      <Head title={title} />
      <div className='flex w-full flex-col bg-muted/40'>
        {/* <PcNavigation /> */}
        <div className='flex min-h-screen flex-col sm:gap-4 sm:py-4'>
          <header className='sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
            <MobileNavigation />
            {/* <DynamicBreadcrumb /> */}

            <div className='flex items-center gap-4'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarTrigger className='-ml-1.5' />
                </TooltipTrigger>
                <TooltipContent side='bottom' align='center'>
                  Toggle Sidebar
                </TooltipContent>
              </Tooltip>

              <Separator orientation='vertical' className='h-4' />
              <DynamicBreadcrumb />
            </div>

            <div className='flex flex-1 items-center justify-end space-x-1'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='relative'>
                    <Button variant='link' size='icon' className='group px-2 hover:bg-accent'>
                      <BellIcon className='h-5 w-5 group-hover:text-teal-600' />
                      <span className='sr-only'>Notifications</span>
                    </Button>
                    <CircleFillIcon className='absolute right-1.5 top-1 h-3 w-3 text-red-600' />
                  </div>
                </TooltipTrigger>
                <TooltipContent side='bottom' align='center'>
                  Notifications
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='link' size='icon' className='group px-2 hover:bg-accent'>
                    <NotebookTextIcon className='h-5 w-5 group-hover:text-blue-500' />
                    <span className='sr-only'>Notes</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='bottom' align='center'>
                  Notes
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='link' size='icon' className='group relative px-2 hover:bg-accent'>
                    <StarFilledIcon className='h-5 w-5 group-hover:text-orange-500' />
                    <span className='sr-only'>Favorites</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='bottom' align='center'>
                  Favorites
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='link' size='icon' className='group relative px-2 hover:bg-accent'>
                    <MessageCircleMoreIcon className='h-5 w-5 group-hover:text-emerald-600' />
                    <span className='sr-only'>Messages</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='bottom' align='center'>
                  Messages
                </TooltipContent>
              </Tooltip>

              <div className='rounded-lg border bg-accent/30 px-4 py-1'>
                <span className='text-sm font-semibold'>NGO Forum for Public Health</span>
              </div>
            </div>

            <div className='flex items-center gap-4'>
              <DarkModeToggle />
              <UserDropdown />
            </div>
          </header>
          <main className='flex-1 items-start px-6 py-4 md:py-0'>{children}</main>
          <footer className='px-6'>
            <div className='my-3 flex flex-row-reverse items-center lg:flex-row'>
              <div className='flex w-1/2 justify-end lg:justify-start'>
                <img className='h-12 p-2' src={theme === 'dark' ? SprintDevsFullDark : SprintDevsFullLight} />
              </div>
              <div className='flex w-1/2 items-center gap-2 px-2 lg:-ml-14 lg:justify-start'>
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
            </div>
            <Separator />
            <div className='my-4 flex items-center justify-center gap-1 text-sm text-muted-foreground lg:mb-0'>
              <span>&copy; 2022-{currentDate.getFullYear()} </span>
              <a href='https://sprintdevs.com' target='_blank' rel='noreferrer'>
                <span className='font-semibold text-brand underline-offset-2 hover:underline'>Sprint Devs</span>
                <span className='text-muted-foreground no-underline'>.</span>
              </a>
              <span>All Rights Reserved.</span>
            </div>
          </footer>
        </div>
      </div>
      {!['/orders', '/orders/create'].includes(url) && (
        <Link href='/orders/create'>
          <Button className='group fixed bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full font-medium transition-all duration-500 hover:w-36 hover:bg-foreground'>
            <span className='z-20 inline-block max-w-0 -translate-x-3.5 overflow-hidden opacity-0 transition-all duration-700 group-hover:max-w-xs group-hover:opacity-100'>Create Order</span>
            <PlusIcon className='delay-50 fixed right-5 h-12 w-12 transform rounded-full bg-foreground p-3 text-primary-foreground transition-transform duration-500 group-hover:rotate-180' />
          </Button>
        </Link>
      )}
      <Toaster />
    </SidebarProvider>
  )
}
