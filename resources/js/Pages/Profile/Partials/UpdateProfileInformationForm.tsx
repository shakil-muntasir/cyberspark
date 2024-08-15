import { FormEventHandler, useRef, useState } from 'react'
import { Link, useForm, usePage } from '@inertiajs/react'
import { Trash2Icon } from 'lucide-react'

import InputError from '@/Components/InputError'
import { Label } from '@/Components/ui/label'
import { Input } from '@/Components/ui/input'
import { Button } from '@/Components/ui/button'
import { cn, getImageData } from '@/Lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'
import { Spinner } from '@/Components/ui/spinner'
import { toast } from '@/Components/ui/use-toast'
import { PageProps } from '@/Types'
import UserPlaceholder from '@/public/assets/user_male_placeholder.png'

type UpdateUserProfileData = {
  name: string
  email: string
  image?: File
}

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }: { mustVerifyEmail: boolean; status?: string; className?: string }) {
  const { data: user } = usePage<PageProps>().props.auth.user
  console.log(user)

  const [previewImage, setPreviewImage] = useState<string>('')
  const imageRef = useRef<HTMLInputElement>(null)
  const { data, setData, post, errors, clearErrors, processing, recentlySuccessful, reset } = useForm<UpdateUserProfileData>({
    name: user.attributes.name,
    email: user.attributes.email,
    image: undefined
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setData(name as keyof UpdateUserProfileData, value)
    clearErrors(name as keyof UpdateUserProfileData)
  }

  const submit: FormEventHandler = e => {
    e.preventDefault()

    setTimeout(() => {
      post(route('profile.update'), {
        onSuccess: handleSuccess
      })
    }, 500)
  }

  const handleSuccess = () => {
    setTimeout(() => {
      reset()
      toast({
        title: 'Success!',
        description: 'The profile has been updated successfully.',
        duration: 2000
      })
      handleImageClear()
    }, 200)
  }

  const handleImageClear = () => {
    setPreviewImage('')
    setData('image', undefined)
    if (imageRef.current) {
      imageRef.current.value = ''
    }
  }

  return (
    <section>
      <header>
        <h2 className='text-lg font-medium text-foreground'>Profile Information</h2>

        <p className='mt-1 text-sm text-muted-foreground'>Update your account's profile information and email address.</p>
      </header>

      <div className='flex items-center space-x-24'>
        <form onSubmit={submit} className='mt-6 space-y-5 w-1/2'>
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

          <div>
            <Label htmlFor='image' className={errors.image?.length ? 'text-destructive' : ''}>
              Profile image
            </Label>
            <div className='space-y-px'>
              <div className={cn('relative w-full', previewImage !== '' ? `relative` : '')}>
                <Input
                  id='image'
                  ref={imageRef}
                  type='file'
                  accept='image/*'
                  name='image'
                  className='dark:file:text-foreground pr-8'
                  onChange={e => {
                    if (e.target.files) {
                      const { file, displayUrl } = getImageData(e)
                      setPreviewImage(displayUrl)
                      setData('image', file)
                    }
                  }}
                />
                {previewImage && (
                  <div className='flex items-center absolute right-1 top-1/2'>
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Button type='button' variant='ghost' size='icon' className='group -translate-y-1/2 h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={handleImageClear}>
                            <Trash2Icon className='h-4 w-4 text-red-400 group-hover:text-red-600' />
                            <span className='sr-only'>Remove picture</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remove picture</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </div>

              <InputError message={errors.image} />
            </div>
          </div>

          {mustVerifyEmail && user.attributes.email_verified_at === null && (
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
            <Button type='submit' disabled={processing}>
              Save
            </Button>
          </div>
        </form>

        <div className='flex justify-center items-center pb-2'>
          <Avatar className='relative w-56 h-56'>
            {/* Show spinner if processing state is true */}
            {previewImage && processing && (
              <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                <Spinner size='large' />
              </div>
            )}

            {/* Avatar Image Logic */}
            <AvatarImage className='object-cover' src={previewImage || user.attributes?.image || UserPlaceholder} />

            {/* Fallback if no image is present */}
            <AvatarFallback>
              <Spinner size='large' />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </section>
  )
}
