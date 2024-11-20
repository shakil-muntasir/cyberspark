import { FormEventHandler } from 'react'
import { Link, useForm } from '@inertiajs/react'

import GuestLayout from '@/Layouts/GuestLayout'

import InputError from '@/Components/InputError'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card'
import NGOFLogo from '@/public/assets/NGOF_Logo_white.png'

interface LoginForm {
  email: string
  password: string
  remember: boolean
}

export default function Login() {
  const { data, setData, post, errors, clearErrors } = useForm({
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
      <div className='flex h-screen items-center justify-center py-12'>
        <Card className='border-0 lg:border'>
          <CardHeader className='flex items-center justify-center'>
            <CardTitle>
              <img src={NGOFLogo} className='-ml-1.5 h-16 object-contain' />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='mx-auto grid w-[350px] gap-6'>
              <div className='grid gap-2 text-center'>
                <h1 className='text-2xl font-semibold'>NGO Forum ERP</h1>
                <p className='mt-2 w-full text-balance text-muted-foreground lg:text-nowrap'>Enter your email below to login to your account</p>
              </div>

              <form onSubmit={handleLoginSubmit} className='grid gap-3'>
                <div className='grid gap-2'>
                  <Label htmlFor='email' className={errors.email?.length ? 'text-destructive' : ''}>
                    Email
                  </Label>
                  <div className='space-y-px'>
                    <Input id='email' type='text' name='email' value={data.email} onChange={handleInputChange} tabIndex={1} placeholder='your@email.com' autoComplete='email' />
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
                    <Input id='password' type='password' name='password' value={data.password} onChange={handleInputChange} tabIndex={2} placeholder='••••••••' autoComplete='current-password' />
                    <InputError message={errors.password} />
                  </div>
                </div>

                <Button type='submit' className='w-full' tabIndex={3}>
                  Login
                </Button>
              </form>
            </div>
          </CardContent>
          <CardFooter>
            <div className='text-center text-sm'>
              Don&apos;t have an account?{' '}
              <Link href='/register' className='underline'>
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </GuestLayout>
  )
}
