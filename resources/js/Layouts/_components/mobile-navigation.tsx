import { Link } from '@inertiajs/react'
import { PanelLeftIcon } from 'lucide-react'

import { routes } from '@/lib/routes'

import { Button } from '@/Components/ui/button'
import { SheetTrigger, SheetContent, Sheet, SheetClose } from '@/Components/ui/sheet'

import SprintDevsLogo from '@/public/assets/sprint_devs.png'

export default function MobileNavigation() {
    const pathname = route().current()

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className='sm:hidden' size='icon' variant='outline'>
                    <PanelLeftIcon className='h-5 w-5' />
                    <span className='sr-only'>Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent className='sm:max-w-xs' side='left'>
                <nav className='grid gap-6 text-lg font-medium'>
                    <SheetClose asChild>
                        <Link className='group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-gray-100 text-lg font-semibold text-primary-foreground md:text-base' href='/'>
                            <img src={SprintDevsLogo} alt='Sprint Devs' className='rounded-full transition-all group-hover:scale-110' />
                            <span className='sr-only'>Sprint Devs</span>
                        </Link>
                    </SheetClose>

                    {routes.map(route => (
                        <SheetClose key={route.href} asChild>
                            <Link key={route.href} className={`flex items-center gap-4 px-2.5 transition-colors ${pathname === route.href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`} href={route.href}>
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
