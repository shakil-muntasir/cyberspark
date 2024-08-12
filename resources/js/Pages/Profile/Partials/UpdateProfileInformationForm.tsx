import InputError from '@/Components/InputError'
import { Link, useForm, usePage } from '@inertiajs/react'
import { Transition } from '@headlessui/react'
import { FormEventHandler } from 'react'
import { PageProps } from '@/Types'
import { Label } from '@/Components/ui/label'
import { Input } from '@/Components/ui/input'
import { Button } from '@/Components/ui/button'

type UpdateUserProfileData = {
  name: string
  email: string
}

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }: { mustVerifyEmail: boolean; status?: string; className?: string }) {
  const user = usePage<PageProps>().props.auth.user

  const { data, setData, patch, errors, clearErrors, processing, recentlySuccessful } = useForm<UpdateUserProfileData>({
    name: user.name,
    email: user.email
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setData(name as keyof UpdateUserProfileData, value)
    clearErrors(name as keyof UpdateUserProfileData)
  }

  const submit: FormEventHandler = e => {
    e.preventDefault()

    patch(route('profile.update'))
  }

  return (
    <section className={className}>
      <header>
        <h2 className='text-lg font-medium text-foreground'>Profile Information</h2>

        <p className='mt-1 text-sm text-muted-foreground'>Update your account's profile information and email address.</p>
      </header>

      <form onSubmit={submit} className='mt-6 space-y-5'>
        <div>
          <Label htmlFor='name' className={errors.name?.length ? 'text-destructive' : ''}>
            Name
          </Label>
          <div className='space-y-px'>
            <Input id='name' type='text' name='name' value={data.name} onChange={handleInputChange} placeholder='Name' autoComplete='name' />
            <InputError message={errors.name} />
          </div>
        </div>

        <div>
          <Label htmlFor='email' className={errors.email?.length ? 'text-destructive' : ''}>
            Email
          </Label>
          <div className='space-y-px'>
            <Input id='email' type='text' name='email' value={data.email} onChange={handleInputChange} placeholder='email' autoComplete='email' />
            <InputError message={errors.email} />
          </div>
        </div>

        {mustVerifyEmail && user.email_verified_at === null && (
          <div>
            <p className='text-sm mt-2 text-gray-800'>
              Your email address is unverified.
              <Link href={route('verification.send')} method='post' as='button' className='underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                Click here to re-send the verification email.
              </Link>
            </p>

            {status === 'verification-link-sent' && <div className='mt-2 font-medium text-sm text-green-600'>A new verification link has been sent to your email address.</div>}
          </div>
        )}

        <div className='flex items-center gap-4'>
          <Button type='submit' disabled={processing}>Save</Button>

          <Transition show={recentlySuccessful} enter='transition ease-in-out' enterFrom='opacity-0' leave='transition ease-in-out' leaveTo='opacity-0'>
            <p className='text-sm text-gray-600'>Saved.</p>
          </Transition>
        </div>
      </form>
    </section>
  )
}
