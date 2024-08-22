import { FormErrors, FormKeyOf } from '@/Types'
import { useForm as useInertiaForm } from '@inertiajs/react'

function useForm<T extends object>(initialData: T) {
    const form = useInertiaForm<T>(initialData)

    // SetData function with dot notation support
    const setData = (key: FormKeyOf<T>, value: any) => {
        if (key.includes('.')) {
            const keys = key.split('.') as Array<string>
            const lastKey = keys.pop() as string

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

            form.setData(prevData => {
                return updateNestedData(prevData, [...keys, lastKey], value)
            })
        } else {
            form.setData(key as keyof T, value)
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
