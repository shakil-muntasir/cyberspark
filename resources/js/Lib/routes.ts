import { HomeIcon, LineChartIcon, PackageIcon, SettingsIcon, ShoppingCartIcon, UsersIcon, UserCircle2Icon } from 'lucide-react'

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
    // {
    //     href: '/analytics',
    //     icon: LineChartIcon,
    //     tooltip: 'Analytics'
    // },
    {
        href: '/profile',
        icon: UserCircle2Icon,
        tooltip: 'Profile'
    }
]
