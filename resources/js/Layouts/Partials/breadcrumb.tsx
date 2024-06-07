import { Link, usePage } from '@inertiajs/react'

import { BreadcrumbLink, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbPage, BreadcrumbList, Breadcrumb } from '@/Components/ui/breadcrumb'

type BreadcrumbItemType = {
    href: string
    text: string
}

const generateBreadcrumbs = (pathname: string): BreadcrumbItemType[] => {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs = paths.map((path, index) => {
        const href = '/' + paths.slice(0, index + 1).join('/')
        const text = path.charAt(0).toUpperCase() + path.slice(1)
        return { href, text }
    })

    return [{ href: '/', text: 'Dashboard' }, ...breadcrumbs]
}

export default function DynamicBreadcrumb() {
    const breadcrumbs: BreadcrumbItemType[] = generateBreadcrumbs(usePage().url ?? [])

    return (
        <Breadcrumb className='hidden md:flex'>
            <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                    <BreadcrumbItem key={breadcrumb.href}>
                        <BreadcrumbLink asChild>
                            <Link href={breadcrumb.href}>{breadcrumb.text}</Link>
                        </BreadcrumbLink>
                        {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                    </BreadcrumbItem>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
