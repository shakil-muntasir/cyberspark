import { ChangeEvent, useRef, useState } from 'react'
import { Loader2, PlusCircle, AlertCircle, XIcon, RefreshCcwDotIcon, EyeIcon, EyeOffIcon, Trash2Icon } from 'lucide-react'

import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Separator } from '@/Components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/Components/ui/sheet'
import { useToast } from '@/Components/ui/use-toast'
import { ScrollArea } from '@/Components/ui/scroll-area'
import InputError from '@/Components/InputError'
import { useForm } from '@inertiajs/react'
import { UserForm } from '@/Pages/User/type'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'
import { CheckCircledIcon } from '@radix-ui/react-icons'
import { Avatar, AvatarImage } from '@/Components/ui/avatar'
import { cn } from '@/Lib/utils'

function getImageData(event: ChangeEvent<HTMLInputElement>) {
  try {
    // FileList is immutable, so we need to create a new one
    const dataTransfer = new DataTransfer()

    // Add newly uploaded images
    Array.from(event.target.files!).forEach(image => dataTransfer.items.add(image))

    const file = dataTransfer.files![0]
    const displayUrl = URL.createObjectURL(event.target.files![0])

    return { file, displayUrl }
  } catch (_) {
    return { file: undefined, displayUrl: '' }
  }
}

export default function AddUser() {
  const { toast } = useToast()

  const { data, setData, post, processing, errors, clearErrors, reset } = useForm<UserForm>({
    name: '',
    email: '',
    phone: '',
    image: undefined,
    role: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    password: ''
  })
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [passwordCopied, setPasswordCopied] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const imageRef = useRef<HTMLInputElement>(null)
  const [submitButtonText, setSubmitButtonText] = useState<string>('Save changes')

  const handleAddUser = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setSubmitButtonText('Saving')

    setTimeout(() => {
      post(route('users.store'), {
        onSuccess: handleSuccess,
        onError: handleError
      })
    }, 500)
  }

  const handleSuccess = () => {
    setTimeout(() => {
      setOpen(false)
      reset()
      toast({
        title: 'Success!',
        description: 'The user has been added successfully.',
        duration: 2000
      })
      setLoading(false)
      setSubmitButtonText('Save changes')
    }, 200)
  }

  const handleError = () => {
    setSubmitButtonText('Error')
    setTimeout(() => {
      setLoading(false)
      setSubmitButtonText('Save changes')
    }, 2000)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setData(name as keyof UserForm, value)
    clearErrors(name as keyof UserForm)
  }

  const handleFormOpen = (value: boolean) => {
    if (!loading || value) {
      setOpen(value)
    }

    if (!value) {
      reset()
      clearErrors()
    }
  }

  function generateStrongPassword() {
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz'
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numericChars = '0123456789'
    const specialChars = '!@#$%'

    const allChars = lowerCaseChars + upperCaseChars + numericChars
    const passwordLength = 10
    let password = ''

    // Ensure the password contains at least one character from each category
    password += lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)]
    password += upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)]
    password += numericChars[Math.floor(Math.random() * numericChars.length)]

    // Add up to 2 special characters
    const specialCharCount = 2
    for (let i = 0; i < specialCharCount; i++) {
      password += specialChars[Math.floor(Math.random() * specialChars.length)]
    }

    // Fill the remaining length with random characters from lower, upper, and numeric categories
    for (let i = password.length; i < passwordLength; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)]
    }

    // Shuffle the password to ensure randomness
    password = password
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('')

    setPasswordCopied(true)
    navigator.clipboard.writeText(password)

    setData('password', password)
    setShowPassword(true)
  }

  const handleImageClear = () => {
    setPreviewImage('')
    setData('image', undefined)
    if (imageRef.current) {
      imageRef.current.value = ''
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleFormOpen}>
      <SheetTrigger asChild>
        <Button onClick={() => setOpen(true)} className='gap-1'>
          <PlusCircle className='h-4 w-4' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Add User</span>
        </Button>
      </SheetTrigger>
      <SheetContent className='px-0'>
        <SheetHeader className='px-6'>
          <SheetTitle>Add User</SheetTitle>
          <SheetDescription>Fill in the form to add a new user to your store.</SheetDescription>
        </SheetHeader>

        <Separator className='my-2' />

        <ScrollArea className='h-[calc(100vh-80px)]'>
          <form onSubmit={handleAddUser} className='mt-3 mb-8 grid gap-3 mx-6'>
            <div className='grid gap-2'>
              <Label htmlFor='name' className={errors.name?.length ? 'text-destructive' : ''}>
                Name
              </Label>
              <div className='space-y-px'>
                <Input id='name' type='text' name='name' value={data.name} onChange={handleInputChange} placeholder='User Name' />
                <InputError message={errors.name} />
              </div>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='email' className={errors.email?.length ? 'text-destructive' : ''}>
                Email
              </Label>
              <div className='space-y-px'>
                <Input id='email' type='number' name='email' value={data.email !== null ? data.email : ''} onChange={handleInputChange} placeholder='your@email.com' />
                <InputError message={errors.email} />
              </div>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='phone' className={errors.phone?.length ? 'text-destructive' : ''}>
                Phone
              </Label>
              <div className='space-y-px'>
                <Input id='phone' type='text' name='phone' value={data.phone !== null ? data.phone : ''} onChange={handleInputChange} placeholder='01XXX-XXXXXX' />
                <InputError message={errors.phone} />
              </div>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='password' className={errors.password?.length ? 'text-destructive' : ''}>
                Password
              </Label>
              <div className='space-y-px'>
                <div className='relative w-full max-w-sm'>
                  <Input id='password' type={showPassword ? 'text' : 'password'} name='password' value={data.password !== null ? data.password : ''} onChange={handleInputChange} placeholder={showPassword ? 'Password' : '••••••••'} className='w-full pr-9' />
                  <div className='flex items-center absolute right-1 top-1/2'>
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Button type='button' variant='ghost' size='icon' className='-translate-y-1/2 h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mr-1' onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? (
                              <>
                                <EyeOffIcon className='h-4 w-4' />
                                <span className='sr-only'>Hide Password</span>
                              </>
                            ) : (
                              <>
                                <EyeIcon className='h-4 w-4' />
                                <span className='sr-only'>Show Password</span>
                              </>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{showPassword ? 'Hide password' : 'Show Password'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger
                          asChild
                          onClick={event => {
                            event.preventDefault()
                          }}
                          onMouseLeave={() => setTimeout(() => setPasswordCopied(false), 200)}
                        >
                          <Button type='button' variant='ghost' size='icon' className='-translate-y-1/2 h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={generateStrongPassword}>
                            <RefreshCcwDotIcon className='h-4 w-4' />
                            <span className='sr-only'>Generate Password</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          onPointerDownOutside={event => {
                            event.preventDefault()
                          }}
                        >
                          {passwordCopied ? (
                            <div className='flex items-center justify-center space-x-1'>
                              <CheckCircledIcon className='w-4 h-4' />
                              <p>Copied to clipboard</p>
                            </div>
                          ) : (
                            <p>Generate password</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <InputError message={errors.password} />
              </div>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='image' className={errors.image?.length ? 'text-destructive' : ''}>
                Profile image
              </Label>
              <div className='space-y-px'>
                {previewImage && (
                  <div className='flex justify-center items-center pb-2'>
                    <Avatar className='w-24 h-24'>
                      <AvatarImage className='object-cover' src={previewImage} />
                    </Avatar>
                  </div>
                )}
                <div className={cn('relative w-full max-w-sm', previewImage !== '' ? `relative` : '')}>
                  <Input
                    id='image'
                    ref={imageRef}
                    type='file'
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

            <div className='grid gap-2'>
              <Label htmlFor='role' className={errors.role?.length ? 'text-destructive' : ''}>
                Role
              </Label>
              <div className='space-y-px'>
                <Input id='role' type='text' name='role' value={data.role !== null ? data.role : ''} onChange={handleInputChange} placeholder='Role' />
                <InputError message={errors.role} />
              </div>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='address' className={errors.address?.length ? 'text-destructive' : ''}>
                Address
              </Label>
              <div className='space-y-px'>
                <Input id='address' type='text' name='address' value={data.address !== null ? data.address : ''} onChange={handleInputChange} placeholder='Address' />
                <InputError message={errors.address} />
              </div>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='city' className={errors.city?.length ? 'text-destructive' : ''}>
                City
              </Label>
              <div className='space-y-px'>
                <Input id='city' type='text' name='city' value={data.city !== null ? data.city : ''} onChange={handleInputChange} placeholder='City' />
                <InputError message={errors.city} />
              </div>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='state' className={errors.state?.length ? 'text-destructive' : ''}>
                State
              </Label>
              <div className='space-y-px'>
                <Input id='state' type='text' name='state' value={data.state !== null ? data.state : ''} onChange={handleInputChange} placeholder='State' />
                <InputError message={errors.state} />
              </div>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='zip' className={errors.zip?.length ? 'text-destructive' : ''}>
                ZIP
              </Label>
              <div className='space-y-px'>
                <Input id='zip' type='text' name='zip' value={data.zip !== null ? data.zip : ''} onChange={handleInputChange} placeholder='ZIP' />
                <InputError message={errors.zip} />
              </div>
            </div>

            <SheetFooter>
              <Button type='submit' className='w-32' disabled={loading}>
                {submitButtonText === 'Saving' ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    <span>{submitButtonText}</span>
                  </>
                ) : submitButtonText === 'Error' ? (
                  <>
                    <AlertCircle className='mr-2 h-4 w-4 text-destructive' />
                    <span>Failed</span>
                  </>
                ) : (
                  <span>{submitButtonText}</span>
                )}
              </Button>
            </SheetFooter>
          </form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
