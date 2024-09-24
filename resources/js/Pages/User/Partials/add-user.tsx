import { useRef, useState } from 'react'
import { Loader2, PlusCircle, AlertCircle, RefreshCcwDotIcon, EyeIcon, EyeOffIcon, Trash2Icon } from 'lucide-react'

import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Separator } from '@/Components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/Components/ui/sheet'
import { useToast } from '@/Components/ui/use-toast'
import { ScrollArea } from '@/Components/ui/scroll-area'
import { UserForm } from '@/Pages/User/types'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'
import { CheckCircledIcon } from '@radix-ui/react-icons'
import { Avatar, AvatarImage } from '@/Components/ui/avatar'
import { cn, generatePassword, getImageData } from '@/Lib/utils'

import useForm from '@/Hooks/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { MultiSelect } from '@/Components/MultiSelect'
import FormInput from '@/Components/FormInput'

import { FormErrors, SelectOption } from '@/Types'

interface AddUserProps {
  genders: SelectOption[]
  roles: SelectOption[]
  states: SelectOption[]
}

const AddUser: React.FC<AddUserProps> = ({ genders, roles, states }) => {
  const { toast } = useToast()

  const { data, setData, post, errors, clearErrors, reset } = useForm<UserForm>({
    name: '',
    email: '',
    gender: '',
    phone: '',
    image: undefined,
    roles: [],
    password: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    }
  })
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [passwordCopied, setPasswordCopied] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const imageRef = useRef<HTMLInputElement>(null)
  const [submitButtonText, setSubmitButtonText] = useState<'Save Changes' | 'Processing' | 'Error'>('Save Changes')

  const handleAddUser = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setSubmitButtonText('Processing')

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
      setSubmitButtonText('Save Changes')
    }, 200)
  }

  const handleError = (_: FormErrors<UserForm>) => {
    setSubmitButtonText('Error')
    setTimeout(() => {
      setLoading(false)
      setSubmitButtonText('Save Changes')
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

  function generateRandomPassword() {
    const password = generatePassword()

    setPasswordCopied(true)
    navigator.clipboard.writeText(password)

    setData('password', password)
    clearErrors('password')
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

      <SheetContent className='px-0' fullscreen={true}>
        <SheetHeader className='space-y-0 px-6'>
          <SheetTitle>Add User</SheetTitle>
          <SheetDescription>Fill in the form to add a new user to your store.</SheetDescription>
        </SheetHeader>

        <Separator className='my-2' />

        <ScrollArea className='h-[calc(100vh-80px)]'>
          <form onSubmit={handleAddUser} className='mx-6 mb-8 mt-3 grid gap-3'>
            <FormInput id='name' label='Name' errorMessage={errors.name}>
              <Input id='name' type='text' name='name' value={data.name} onChange={handleInputChange} placeholder='User Name' autoComplete='name' />
            </FormInput>

            <FormInput id='email' label='Email' errorMessage={errors.email}>
              <Input id='email' type='text' name='email' value={data.email} onChange={handleInputChange} placeholder='your@email.com' autoComplete='email' />
            </FormInput>

            <FormInput id='gender' label='Gender' errorMessage={errors.email}>
              <Select
                name='gender'
                value={data.gender}
                onValueChange={value => {
                  setData('gender', value)
                  clearErrors('gender')
                }}
              >
                <SelectTrigger id='gender'>
                  <SelectValue placeholder='Select Gender' />
                </SelectTrigger>
                <SelectContent>
                  {genders.map(gender => (
                    <SelectItem key={gender.value} value={gender.value}>
                      {gender.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormInput>

            <FormInput id='phone' label='Phone' errorMessage={errors.phone}>
              <Input id='phone' type='text' name='phone' value={data.phone !== null ? data.phone : ''} onChange={handleInputChange} placeholder='01XXX-XXXXXX' autoComplete='tel' />
            </FormInput>

            <FormInput id='password' label='Password' errorMessage={errors.password}>
              <div className='relative w-full max-w-sm'>
                <Input id='password' type={showPassword ? 'text' : 'password'} name='password' value={data.password !== null ? data.password : ''} onChange={handleInputChange} placeholder={showPassword ? 'Password' : '••••••••'} className='w-full pr-9' />
                <div className='absolute right-1 top-1/2 flex items-center'>
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Button type='button' variant='ghost' size='icon' className='mr-1 h-7 w-7 -translate-y-1/2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={() => setShowPassword(!showPassword)}>
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
                        <Button type='button' variant='ghost' size='icon' className='h-7 w-7 -translate-y-1/2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={generateRandomPassword}>
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
                            <CheckCircledIcon className='h-4 w-4' />
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
            </FormInput>

            <FormInput id='image' label='Profile Image' errorMessage={errors.image}>
              <>
                {previewImage && (
                  <div className='flex items-center justify-center pb-2'>
                    <Avatar className='h-24 w-24'>
                      <AvatarImage className='object-cover' src={previewImage} />
                    </Avatar>
                  </div>
                )}
                <div className={cn('relative w-full max-w-sm', previewImage !== '' ? `relative` : '')}>
                  <Input
                    id='image'
                    ref={imageRef}
                    type='file'
                    accept='image/*'
                    name='image'
                    className='pr-8 dark:file:text-foreground'
                    onChange={e => {
                      if (e.target.files) {
                        const { file, displayUrl } = getImageData(e)
                        setPreviewImage(displayUrl)
                        setData('image', file)
                      }
                    }}
                  />
                  {previewImage && (
                    <div className='absolute right-1 top-1/2 flex items-center'>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <Button type='button' variant='ghost' size='icon' className='group h-7 w-7 -translate-y-1/2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={handleImageClear}>
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
              </>
            </FormInput>

            <FormInput id='roles' label='Roles' errorMessage={errors.roles}>
              <MultiSelect
                id='roles'
                values={roles}
                onValueChange={value => {
                  setData('roles', value)
                  clearErrors('roles')
                }}
                placeholder='Select Roles'
              />
            </FormInput>

            <FormInput id='address.street' label='Street' errorMessage={errors['address.street']}>
              <Input id='address.street' type='text' name='address.street' value={data.address.state !== null ? data.address.street : ''} onChange={handleInputChange} placeholder='Street' />
            </FormInput>

            <FormInput id='address.city' label='City' errorMessage={errors['address.city']}>
              <Input id='address.city' type='text' name='address.city' value={data.address.state !== null ? data.address.city : ''} onChange={handleInputChange} placeholder='City' />
            </FormInput>

            <FormInput id='address.state' label='State' errorMessage={errors['address.state']}>
              <Select
                name='address.state'
                value={data.address.state}
                onValueChange={value => {
                  setData('address.state', value)
                  clearErrors('address.state')
                }}
              >
                <SelectTrigger id='address.state'>
                  <SelectValue placeholder='Select State' />
                </SelectTrigger>
                <SelectContent>
                  {states.map(state => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormInput>

            <div className='grid grid-cols-2 space-x-2'>
              <FormInput id='address.state' label='State' errorMessage={errors['address.state']}>
                <Select
                  name='address.state'
                  value={data.address.state}
                  onValueChange={value => {
                    setData('address.state', value)
                    clearErrors('address.state')
                  }}
                >
                  <SelectTrigger id='address.state'>
                    <SelectValue placeholder='Select State' />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map(state => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormInput>

              <FormInput id='address.zip' label='ZIP' errorMessage={errors['address.zip']}>
                <Input id='address.zip' type='text' name='address.zip' value={data.address.state !== null ? data.address.zip : ''} onChange={handleInputChange} placeholder='ZIP' />
              </FormInput>
            </div>

            <SheetFooter>
              <div className='flex justify-end gap-2'>
                <Button
                  variant='secondary'
                  onClick={() => {
                    setOpen(false)
                    setTimeout(() => {
                      reset()
                      clearErrors()
                    }, 200)
                  }}
                >
                  Cancel
                </Button>

                <Button type='submit' className='w-32' disabled={loading}>
                  {submitButtonText === 'Processing' ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : submitButtonText === 'Error' ? <AlertCircle className='mr-2 h-4 w-4 text-destructive' /> : null}
                  <span>{submitButtonText}</span>
                </Button>
              </div>
            </SheetFooter>
          </form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export default AddUser
