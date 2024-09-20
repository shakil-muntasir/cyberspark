/* eslint-disable @typescript-eslint/no-explicit-any */

import { FormErrors, FormKeyOf } from '@/Types'
import { useForm as useInertiaForm } from '@inertiajs/react'

function useForm<T extends object>(initialData: T) {
    const form = useInertiaForm<T>(initialData)

    // Helper function to update nested data
    const updateNestedData = (data: any, keys: string[], value: any): any => {
        const [firstKey, ...remainingKeys] = keys

        // If the current data is not an object, return it directly
        if (typeof data !== 'object' || data === null) {
            throw new Error(`Invalid path: ${firstKey} is not an object.`)
        }

        if (remainingKeys.length === 0) {
            return {
                ...data,
                [firstKey]: value
            }
        }

        return {
            ...data,
            [firstKey]: updateNestedData(data[firstKey], remainingKeys, value)
        }
    }

    // SetData function with dot notation and callback support
    const setData = (keyOrCallback: FormKeyOf<T> | ((data: T) => T), value?: any) => {
        if (typeof keyOrCallback === 'function') {
            // If a callback is provided, execute it with the current form data
            form.setData(prevData => keyOrCallback(prevData))
        } else if (typeof keyOrCallback === 'string' && keyOrCallback.includes('.')) {
            const keys = keyOrCallback.split('.') as Array<string>
            const lastKey = keys.pop() as string

            form.setData(prevData => {
                const currentValue = keys.reduce((acc: any, k: string) => acc?.[k], prevData)
                const finalValue = typeof value === 'function' ? value(currentValue) : value

                return updateNestedData(prevData, [...keys, lastKey], finalValue)
            })
        } else {
            form.setData(prevData => {
                const finalValue = typeof value === 'function' ? value((prevData as any)[keyOrCallback as keyof T]) : value

                return {
                    ...prevData,
                    [keyOrCallback as keyof T]: finalValue
                }
            })
        }
    }

    // Override the return type to include correctly typed errors
    return {
        ...form,
        setData,
        errors: form.errors as FormErrors<T>, // This makes errors aware of nested structures
        clearErrors: form.clearErrors as (key?: FormKeyOf<T>) => void
    }
}

export default useForm
