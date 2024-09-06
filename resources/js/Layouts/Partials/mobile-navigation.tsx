import { Link, usePage } from '@inertiajs/react'
import { PanelLeftIcon } from 'lucide-react'

import { routes } from '@/Lib/routes'

import { Button } from '@/Components/ui/button'
import { SheetTrigger, SheetContent, Sheet, SheetClose } from '@/Components/ui/sheet'

import SprintDevsLogo from '@/public/assets/sprint_devs.png'

export default function MobileNavigation() {
  const pathname = usePage().url.split('?')[0]

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className='px-2 sm:hidden' size='icon' variant='outline'>
          <PanelLeftIcon className='h-5 w-5' />
          <span className='sr-only'>Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent className='sm:max-w-xs' side='left'>
        <nav className='grid gap-2 text-lg font-medium'>
          <SheetClose asChild>
            <Link className='group mb-2 flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-gray-100 text-lg font-semibold text-primary-foreground md:text-base' href='/'>
              <img src={SprintDevsLogo} alt='Sprint Devs' className='rounded-full transition-all group-hover:scale-110' />
              <span className='sr-only'>Sprint Devs</span>
            </Link>
          </SheetClose>

          {routes.map(route => (
            <SheetClose key={route.href} asChild>
              <Link key={route.href} className={`flex items-center gap-4 rounded-md px-2.5 py-2 transition-colors ${pathname === route.href || pathname.startsWith(`${route.href}/`) ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'}`} href={route.href}>
                <route.icon className='h-5 w-5' />
                {route.tooltip}
              </Link>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
