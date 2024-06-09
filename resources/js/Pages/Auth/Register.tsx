import { FormEventHandler } from 'react'
import { Link, useForm } from '@inertiajs/react'

import GuestLayout from '@/Layouts/GuestLayout'

import InputError from '@/Components/InputError'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'

interface RegisterForm {
    name: string
    email: string
    password: string
    password_confirmation: string
}

export default function Login() {
    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    })

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setData(name as keyof RegisterForm, value)
        clearErrors(name as keyof RegisterForm)
    }

    const handleRegisterSubmit: FormEventHandler = (event: React.FormEvent) => {
        event.preventDefault()

        post(route('register'))
    }

    return (
        <GuestLayout title='Register'>
            <div className='h-screen flex items-center justify-center py-12'>
                <div className='mx-auto grid w-[350px] gap-6'>
                    <div className='grid gap-2 text-center'>
                        <h1 className='text-3xl font-bold'>Login</h1>
                        <p className='w-full text-balance lg:text-nowrap text-muted-foreground'>Enter your email below to login to your account</p>
                    </div>

                    <form onSubmit={handleRegisterSubmit} className='grid gap-3'>
                        <div className='grid gap-2'>
                            <Label htmlFor='name' className={errors.name?.length ? 'text-destructive' : ''}>
                                Name
                            </Label>
                            <div className='space-y-px'>
                                <Input id='name' type='text' name='name' value={data.name} onChange={handleInputChange} placeholder='Full Name' />
                                <InputError message={errors.name} />
                            </div>
                        </div>

                        <div className='grid gap-2'>
                            <Label htmlFor='email' className={errors.email?.length ? 'text-destructive' : ''}>
                                Email
                            </Label>
                            <div className='space-y-px'>
                                <Input id='email' type='text' name='email' value={data.email} onChange={handleInputChange} placeholder='your@email.com' />
                                <InputError message={errors.email} />
                            </div>
                        </div>

                        <div className='grid gap-2'>
                            <Label htmlFor='password' className={errors.password?.length ? 'text-destructive' : ''}>
                                Password
                            </Label>
                            <div className='space-y-px'>
                                <Input id='password' type='password' name='password' value={data.password} onChange={handleInputChange} placeholder='••••••••' />
                                <InputError message={errors.password} />
                            </div>
                        </div>

                        <div className='grid gap-2'>
                            <Label htmlFor='password_confirmation' className={errors.password_confirmation?.length ? 'text-destructive' : ''}>
                                Confirm Password
                            </Label>
                            <div className='space-y-px'>
                                <Input id='password_confirmation' type='password' name='password_confirmation' value={data.password_confirmation} onChange={handleInputChange} placeholder='••••••••' />
                                <InputError message={errors.password_confirmation} />
                            </div>
                        </div>

                        <Button type='submit' className='w-full'>
                            Create an account
                        </Button>
                    </form>

                    <div className='mt-4 text-center text-sm'>
                        Already have an account?{' '}
                        <Link href='/login' className='underline'>
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </GuestLayout>
    )
}
