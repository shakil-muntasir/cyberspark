import InputError from '@/Components/InputError'
import { Button } from '@/Components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/Components/ui/card'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { toast } from '@/Components/ui/use-toast'
import { useForm } from '@inertiajs/react'
import { FormEventHandler, useRef } from 'react'

type UpdateUserPasswordData = {
  current_password: string
  password: string
  password_confirmation: string
}

export default function UpdatePasswordForm() {
  const passwordInput = useRef<HTMLInputElement>(null)
  const currentPasswordInput = useRef<HTMLInputElement>(null)

  const { data, setData, errors, clearErrors, put, reset, processing, recentlySuccessful } = useForm<UpdateUserPasswordData>({
    current_password: '',
    password: '',
    password_confirmation: ''
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setData(name as keyof UpdateUserPasswordData, value)
    clearErrors(name as keyof UpdateUserPasswordData)
  }

  const updatePassword: FormEventHandler = e => {
    e.preventDefault()

    put(route('password.update'), {
      preserveScroll: true,
      onSuccess: handleSuccess,
      onError: errors => {
        if (errors.password) {
          reset('password', 'password_confirmation')
          passwordInput.current?.focus()
        }

        if (errors.current_password) {
          reset('current_password')
          currentPasswordInput.current?.focus()
        }
      }
    })
  }

  const handleSuccess = () => {
    setTimeout(() => {
      reset()
      toast({
        title: 'Success!',
        description: 'The password has been updated successfully.',
        duration: 2000
      })
    }, 200)
  }

  return (
    <Card>
      <CardHeader className='max-w-xl'>
        <h2 className='text-lg font-medium text-foreground'>Update Password</h2>

        <p className='mt-1 text-sm text-muted-foreground'>Ensure your account is using a long, random password to stay secure.</p>
      </CardHeader>

      <form onSubmit={updatePassword}>
        <CardContent className='pb-2 lg:pr-0 max-w-xl'>
          <div>
            <Label htmlFor='current_password' className={errors.current_password?.length ? 'text-destructive' : ''}>
              Current Password
            </Label>
            <div className='space-y-px'>
              <Input id='current_password' type='password' name='current_password' value={data.current_password} onChange={handleInputChange} placeholder='Current Password' autoComplete='current_password' />
              <InputError message={errors.current_password} />
            </div>
          </div>

          <div>
            <Label htmlFor='password' className={errors.password?.length ? 'text-destructive' : ''}>
              New Password
            </Label>
            <div className='space-y-px'>
              <Input id='password' type='password' name='password' value={data.password} onChange={handleInputChange} placeholder='New Password' autoComplete='new-password' />
              <InputError message={errors.password} />
            </div>
          </div>

          <div>
            <Label htmlFor='password_confirmation' className={errors.password_confirmation?.length ? 'text-destructive' : ''}>
              Confirm Password
            </Label>
            <div className='space-y-px'>
              <Input id='password_confirmation' type='password' name='password_confirmation' value={data.password_confirmation} onChange={handleInputChange} placeholder='Current Password' autoComplete='new-password' />
              <InputError message={errors.password_confirmation} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className='flex items-center gap-4'>
            <Button type='submit' disabled={processing}>
              Save
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
