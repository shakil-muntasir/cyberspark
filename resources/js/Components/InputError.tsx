import { HTMLAttributes } from 'react'

interface InputErrorProps {
    message?: string
    className?: string
}

export default function InputError({ message, className = '', ...props }: InputErrorProps & HTMLAttributes<HTMLParagraphElement>) {
    if (message && message.length > 0) {
        return (
            <p {...props} className={'text-destructive text-xs' + className}>
                {message}
            </p>
        )
    }

    return <p className='h-4' />
}
