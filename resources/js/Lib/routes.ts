import { HomeIcon, PackageIcon, ShoppingCartIcon, UsersIcon, UserCircle2Icon, ScrollTextIcon } from 'lucide-react'

type Route = {
    href: string
    icon: React.ElementType
    tooltip: string
}

export const routes: Route[] = [
    {
        href: '/',
        icon: HomeIcon,
        tooltip: 'Dashboard'
    },
    {
        href: '/invoices',
        icon: ScrollTextIcon,
        tooltip: 'Invoices'
    },
    {
        href: '/products',
        icon: PackageIcon,
        tooltip: 'Products'
    },
    {
        href: '/orders',
        icon: ShoppingCartIcon,
        tooltip: 'Orders'
    },
    {
        href: '/users',
        icon: UsersIcon,
        tooltip: 'Users'
    },
    {
        href: '/profile',
        icon: UserCircle2Icon,
        tooltip: 'Profile'
    }
]
