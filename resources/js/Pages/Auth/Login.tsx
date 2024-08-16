import { FormEventHandler } from 'react'
import { Link, useForm } from '@inertiajs/react'

import GuestLayout from '@/Layouts/GuestLayout'

import InputError from '@/Components/InputError'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'

interface LoginForm {
  email: string
  password: string
  remember: boolean
}

export default function Login() {
  const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
    email: '',
    password: '',
    remember: false
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setData(name as keyof LoginForm, value)
    clearErrors(name as keyof LoginForm)
  }

  const handleLoginSubmit: FormEventHandler = (event: React.FormEvent) => {
    event.preventDefault()

    post(route('login'))
  }

  return (
    <GuestLayout title='Login'>
      <div className='h-screen flex items-center justify-center py-12'>
        <div className='mx-auto grid w-[350px] gap-6'>
          <div className='grid gap-2 text-center'>
            <h1 className='text-3xl font-bold'>Login</h1>
            <p className='w-full text-balance lg:text-nowrap text-muted-foreground'>Enter your email below to login to your account</p>
          </div>

          <form onSubmit={handleLoginSubmit} className='grid gap-3'>
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
              <div className='flex items-center'>
                <Label htmlFor='password' className={errors.password?.length ? 'text-destructive' : ''}>
                  Password
                </Label>
                <Link href='#' className='ml-auto inline-block text-sm underline'>
                  Forgot your password?
                </Link>
              </div>
              <div className='space-y-px'>
                <Input id='password' type='password' name='password' value={data.password} onChange={handleInputChange} placeholder='••••••••' />
                <InputError message={errors.password} />
              </div>
            </div>

            <Button type='submit' className='w-full'>
              Login
            </Button>
          </form>

          <div className='mt-4 text-center text-sm'>
            Don&apos;t have an account?{' '}
            <Link href='/register' className='underline'>
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </GuestLayout>
  )
}
