'use client'

import { ChevronRight, HomeIcon, ShieldCheckIcon, ShieldPlusIcon, type LucideIcon } from 'lucide-react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/Components/ui/collapsible'
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/Components/ui/sidebar'
import { Link } from '@inertiajs/react'

export function NavMain({
  items
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip='Dashboard' className={location.pathname === '/' ? 'bg-accent text-foreground' : 'text-muted-foreground'}>
            <Link href='/'>
              <HomeIcon />
              <span>Dashboard</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {items.map(item => (
          <Collapsible key={item.title} asChild defaultOpen={item.items?.some(subItem => location.pathname === subItem.url || location.pathname.startsWith(`${subItem.url}/`))} className='group/collapsible'>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title} className={item.items?.some(subItem => location.pathname === subItem.url || location.pathname.startsWith(`${subItem.url}/`)) ? 'group-data-[collapsible=icon]:!bg-accent group-data-[collapsible=icon]:!text-foreground' : 'text-muted-foreground'}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map(subItem => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild className={location.pathname === subItem.url ? 'bg-accent text-foreground' : 'text-muted-foreground'}>
                        <Link href={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip='Approvals' className={location.pathname.startsWith('/misc1') ? 'bg-accent text-foreground' : 'text-muted-foreground'}>
            <Link href='/misc1'>
              <ShieldCheckIcon />
              <span>Approvals</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip='Multi-layer Approvals' className={location.pathname.startsWith('/misc2') ? 'bg-accent text-foreground' : 'text-muted-foreground'}>
            <Link href='/misc2'>
              <ShieldPlusIcon />
              <span>Multi-layer Approvals</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
