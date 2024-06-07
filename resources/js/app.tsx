import './bootstrap'
import '../css/app.css'

import React from 'react'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'

import { ThemeProvider } from '@/providers/theme-provider'
import { UserProvider } from '@/Contexts/UserContext'
import { PageProps } from '@/types'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'

createInertiaApp({
    title: title => `${title} - ${appName}`,
    resolve: name => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el)

        const pageProps = props.initialPage.props as unknown as PageProps

        root.render(
            <React.StrictMode>
                <UserProvider authUser={pageProps.auth.user}>
                    <ThemeProvider defaultTheme='light' storageKey='ui-theme'>
                        <App {...props} />
                    </ThemeProvider>
                </UserProvider>
            </React.StrictMode>
        )
    },
    progress: {
        color: '#4B5563'
    }
})
