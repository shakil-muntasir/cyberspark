import '../css/app.css'
import './bootstrap'

import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createRoot } from 'react-dom/client'

import { DeleteModalProvider } from '@/Contexts/DeleteModalContext'
import { UserProvider } from '@/Contexts/UserContext'
import { ThemeProvider } from '@/Providers/theme-provider'
import { PageProps } from '@/Types'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'

createInertiaApp({
  title: title => `${title} - ${appName}`,
  resolve: name => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
  setup({ el, App, props }) {
    const root = createRoot(el)

    const pageProps = props.initialPage.props as unknown as PageProps

    root.render(
      <UserProvider authUser={pageProps.auth.user}>
        <ThemeProvider defaultTheme='light' storageKey='ui-theme'>
          <DeleteModalProvider>
            <App {...props} />
          </DeleteModalProvider>
        </ThemeProvider>
      </UserProvider>
    )
  },
  progress: {
    color: '#4B5563'
  }
})
