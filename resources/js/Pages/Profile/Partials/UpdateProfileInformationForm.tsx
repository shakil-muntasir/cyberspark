import { Link, useForm, usePage } from '@inertiajs/react'
import { Trash2Icon } from 'lucide-react'
import { FormEventHandler, useRef, useState } from 'react'

import InputError from '@/Components/InputError'
import { Button } from '@/Components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/Components/ui/card'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'
import { toast } from '@/Components/ui/use-toast'
import UserAvatar from '@/Components/UserAvatar'
import { cn, getImageData } from '@/Lib/utils'
import { PageProps } from '@/Types'

type UpdateUserProfileData = {
  name: string
  email: string
  image?: File
}

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }: { mustVerifyEmail: boolean; status?: string; className?: string }) {
  const { data: user } = usePage<PageProps>().props.auth.user

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
        onSuccess: handleSuccess,
        preserveScroll: true
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
    <section className='lg:pt-6'>
      <UserAvatar inputRef={imageRef} processing={processing} src={user.attributes.image ?? ''} handleImageClear={handleImageClear} previewImage={previewImage} className='flex lg:hidden pb-4' />
      <Card className='flex  flex-col-reverse lg:flex-row items-center'>
        <div className='max-w-xl flex-1'>
          <CardHeader className='max-w-xl'>
            <h2 className='text-lg font-medium text-foreground'>Profile Information</h2>

            <p className='mt-1 text-sm text-muted-foreground'>Update your account's profile information and email address.</p>
          </CardHeader>
          <form onSubmit={submit}>
            <CardContent className='pb-2 lg:pr-0 max-w-xl'>
              <div className='gap-2'>
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
            </CardContent>

            <CardFooter>
              <div className='flex items-center'>
                <Button type='submit' disabled={processing}>
                  Save
                </Button>
              </div>
            </CardFooter>
          </form>
        </div>

        <UserAvatar inputRef={imageRef} processing={processing} src={user.attributes.image ?? ''} handleImageClear={handleImageClear} previewImage={previewImage} className='hidden lg:flex' />
      </Card>
    </section>
  )
}
