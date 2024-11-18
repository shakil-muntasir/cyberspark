import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react'

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from '@/Components/ui/sidebar'
import { Link } from '@inertiajs/react'

// Menu items.
const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home
  },
  {
    title: 'Inbox',
    url: '/acquisitions',
    icon: Inbox
  },
  {
    title: 'Calendar',
    url: '#',
    icon: Calendar
  },
  {
    title: 'Search',
    url: '#',
    icon: Search
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings
  }
]

export function AppSidebar() {
  return (
    <Sidebar collapsible='icon'>
      <SidebarContent className='relative bg-background'>
        <SidebarTrigger className='absolute left-2 top-4 z-10 p-1.5' />
        <SidebarGroup className='mt-12'>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* {routes.slice(0, -1).map(route => (
                <Tooltip key={route.href}>
                  <TooltipTrigger asChild>
                    <Link className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${pathname === route.href || pathname.startsWith(`${route.href}/`) ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'}`} href={route.href}>
                      <route.icon className='h-5 w-5' />
                      <span className='sr-only'>{route.tooltip}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side='right'>{route.tooltip}</TooltipContent>
                </Tooltip>
              ))} */}
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
