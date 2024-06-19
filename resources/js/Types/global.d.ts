import { PageProps } from '@/Types'
import { AxiosInstance } from 'axios'
import { route as ziggyRoute } from 'ziggy-js'

declare global {
    interface Window {
        axios: AxiosInstance
        initialPage: {
            props: PageProps
        }
    }

    var route: typeof ziggyRoute
}
