import { createElement } from 'react'

import { Link, usePage } from '@inertiajs/react'

import { routes } from '@/Lib/routes'

import { TooltipTrigger, TooltipContent, Tooltip, TooltipProvider } from '@/Components/ui/tooltip'

import SprintDevsLogo from '@/public/assets/sprint_devs.png'

export default function PcNavigation() {
    const pathname = usePage().url.split('?')[0]

    return (
        <aside className='fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex'>
            <nav className='flex flex-col items-center gap-4 px-2 sm:py-5'>
                <TooltipProvider>
                    <Link className='group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-gray-100 text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base' href='/'>
                        <img src={SprintDevsLogo} alt='Sprint Devs' className='rounded-full transition-all group-hover:scale-110' />
                        <span className='sr-only'>Sprint Devs</span>
                    </Link>
                    {routes.slice(0, -1).map(route => (
                        <Tooltip key={route.href}>
                            <TooltipTrigger asChild>
                                <Link className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${pathname === route.href ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'}`} href={route.href}>
                                    <route.icon className='h-5 w-5' />
                                    <span className='sr-only'>{route.tooltip}</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side='right'>{route.tooltip}</TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>
            </nav>
            <nav className='mt-auto flex flex-col items-center gap-4 px-2 sm:py-5'>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${pathname === routes[routes.length - 1].href ? 'bg-highlight text-foreground' : 'text-muted-foreground hover:text-foreground'}`} href={routes[routes.length - 1].href}>
                                {createElement(routes[routes.length - 1].icon, { className: 'h-5 w-5' })}
                                <span className='sr-only'>{routes[routes.length - 1].tooltip}</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side='right'>{routes[routes.length - 1].tooltip}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </nav>
        </aside>
    )
}
