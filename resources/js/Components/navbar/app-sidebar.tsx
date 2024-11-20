import { ClipboardListIcon, Settings2, ShoppingBagIcon, UsersIcon } from 'lucide-react'

import { NavMain } from '@/Components/navbar/nav-main'
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from '@/Components/ui/sidebar'
import NGOFLogo from '@/public/assets/NGOF_Logo_white.png'
import NGOFLogoSmall from '@/public/assets/NGOF_Logo_Small.png'
import { Link } from '@inertiajs/react'

const data = {
  navMain: [
    {
      title: 'Purchases',
      url: '#',
      icon: ShoppingBagIcon,
      isActive: true,
      items: [
        {
          title: 'Dashboard',
          url: '#'
        },
        {
          title: 'Acquisitions',
          url: '/acquisitions'
        },
        {
          title: 'Orders List',
          url: '/orders'
        },
        {
          title: 'Create Order',
          url: '/orders/create'
        },
        {
          title: 'Quotation Entries',
          url: '#'
        },
        {
          title: 'Comparative Statements',
          url: '#'
        },
        {
          title: 'Receives',
          url: '#'
        },
        {
          title: 'Returns',
          url: '#'
        },
        {
          title: 'Payments',
          url: '#'
        },
        {
          title: 'Analytics',
          url: '#'
        },
        {
          title: 'Reports',
          url: '#'
        }
      ]
    },
    {
      title: 'Inventory',
      url: '#',
      icon: ClipboardListIcon,
      items: [
        {
          title: 'Dashboard',
          url: '#'
        },
        {
          title: 'Products',
          url: '/products'
        },
        {
          title: 'Transfer Requests',
          url: '#'
        },
        {
          title: 'Conversions',
          url: '#'
        },
        {
          title: 'Requisitions',
          url: '#'
        },
        {
          title: 'Issues',
          url: '#'
        },
        {
          title: 'Stock Adjustments',
          url: '#'
        },
        {
          title: 'Reports',
          url: '#'
        },
        {
          title: 'Stock Conversions',
          url: '#'
        }
      ]
    },
    {
      title: 'HR',
      url: '#',
      icon: UsersIcon,
      items: [
        {
          title: 'Dashboard',
          url: '#'
        },
        {
          title: 'Users',
          url: '/users'
        },
        {
          title: 'Attendance',
          url: '#'
        },
        {
          title: 'Leaves & Movements',
          url: '#'
        },
        {
          title: 'Salary Disbursements',
          url: '#'
        },
        {
          title: 'Self Service',
          url: '#'
        }
      ]
    },
    {
      title: 'Configurations',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'Personal Profile',
          url: '/profile'
        },
        {
          title: 'Employees',
          url: '#'
        },
        {
          title: 'Item Profile',
          url: '#'
        },
        {
          title: 'Customer Profile',
          url: '#'
        },
        {
          title: 'Supplier Profile',
          url: '#'
        },
        {
          title: 'Partner Profile',
          url: '#'
        },
        {
          title: 'Company Profile',
          url: '#'
        },
        {
          title: 'Wallet Profile',
          url: '#'
        },
        {
          title: 'Approval Profile',
          url: '#'
        }
      ]
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader className='mt-2'>
        <Link href='/' className='flex items-center justify-center'>
          <img src={NGOFLogo} className='-ml-1.5 h-12 object-contain group-data-[collapsible=icon]:!hidden' />
          <img src={NGOFLogoSmall} className='-ml-1.5 -mt-1.5 mb-1.5 hidden h-12 object-contain group-data-[collapsible=icon]:!block' />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
