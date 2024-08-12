import { useRef, FormEventHandler } from 'react'
import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'
import { useForm } from '@inertiajs/react'
import { Transition } from '@headlessui/react'
import { Label } from '@/Components/ui/label'
import { Input } from '@/Components/ui/input'
import { Button } from '@/Components/ui/button'

type UpdateUserPasswordData = {
  current_password: string
  password: string
  password_confirmation: string
}

export default function UpdatePasswordForm({ className = '' }: { className?: string }) {
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
      onSuccess: () => reset(),
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

  return (
    <section className={className}>
      <header>
        <h2 className='text-lg font-medium text-foreground'>Update Password</h2>

        <p className='mt-1 text-sm text-muted-foreground'>Ensure your account is using a long, random password to stay secure.</p>
      </header>

      <form onSubmit={updatePassword} className='mt-6 space-y-5'>
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

        <div className='flex items-center gap-4'>
          <Button type='submit' disabled={processing}>
            Save
          </Button>

          <Transition show={recentlySuccessful} enter='transition ease-in-out' enterFrom='opacity-0' leave='transition ease-in-out' leaveTo='opacity-0'>
            <p className='text-sm text-gray-600'>Saved.</p>
          </Transition>
        </div>
      </form>
    </section>
  )
}
