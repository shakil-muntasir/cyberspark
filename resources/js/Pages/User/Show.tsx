import { useEffect, useRef, useState } from 'react'
import { router } from '@inertiajs/react'
import { ChevronLeft, Trash2Icon } from 'lucide-react'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Input } from '@/Components/ui/input'
import { InputNumber } from '@/Components/ui/input-number'
import { Label } from '@/Components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'

import DeleteModal from '@/Components/DeleteModal'
import { DeleteModalData, useDeleteModal } from '@/Contexts/DeleteModalContext'
import InputError from '@/Components/InputError'
import { MultiSelect } from '@/Components/MultiSelect'
import UserAvatar from '@/Components/UserAvatar'

import { cn, getImageData } from '@/Lib/utils'
import { Role, UserForm, UserResource } from '@/Pages/User/types'
import { SelectOption } from '@/Types'
import useForm from '@/Hooks/form'

interface UserProps {
  user: UserResource
  genders: SelectOption[]
  roles: SelectOption[]
  states: SelectOption[]
  statuses: SelectOption[]
}

const ShowUser: React.FC<UserProps> = ({ genders, roles, states, statuses, user }) => {
  const { initializeDeleteModal } = useDeleteModal()
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>('')
  const imageRef = useRef<HTMLInputElement>(null)

  const initialData: UserForm = {
    name: user.data.attributes.name,
    email: user.data.attributes.email,
    gender: user.data.attributes.gender,
    phone: user.data.attributes.phone,
    image: undefined,
    password: '',
    roles: extractRoles(user.data.relationships?.roles),
    status: user.data.attributes.status,
    address: {
      street: user.data.relationships?.address?.attributes.street ?? '',
      city: user.data.relationships?.address?.attributes.city ?? '',
      state: user.data.relationships?.address?.attributes.state ?? '',
      zip: user.data.relationships?.address?.attributes.zip ?? ''
    }
  }
  const { data, setData, processing, errors, clearErrors, reset } = useForm<UserForm>(initialData)

  useEffect(() => {
    const hasChanges = Object.keys(initialData).some(key => data[key as keyof UserForm] !== initialData[key as keyof UserForm])

    setIsSaveButtonDisabled(hasChanges)
  }, [data])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setData(name as keyof UserForm, value)
    clearErrors(name as keyof UserForm)
  }

  const handleImageClear = () => {
    setPreviewImage('')
    setData('image', undefined)
    if (imageRef.current) {
      imageRef.current.value = ''
    }
  }

  function extractRoles(roles?: Role[]): string[] {
    return (
      roles?.map((role: Role) => {
        return role.attributes.value
      }) || []
    )
  }

  const deleteModalData: DeleteModalData = {
    id: user.data.id,
    name: user.data.attributes.name,
    title: 'user',
    onConfirm: () => router.visit('/users')
  }

  return (
    <AuthenticatedLayout title='User Details'>
      <main className='mx-auto grid max-w-[80rem] flex-1 items-start gap-4 md:gap-8'>
        <div className='flex auto-rows-max flex-col gap-4'>
          <div className='flex items-center gap-4'>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button variant='outline' size='icon' className='h-7 w-7' onClick={() => window.history.back()}>
                    <ChevronLeft className='h-4 w-4' />
                    <span className='sr-only'>Back</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Go back</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>{user.data.attributes.name}</h1>
            <div className='flex items-center space-x-1'>
              {user.data.relationships?.roles?.map((role, index) => (
                <Badge key={index} variant='outline' className='ml-auto sm:ml-0'>
                  {role.attributes.label}
                </Badge>
              ))}
            </div>
            <div className='hidden items-center gap-2 md:ml-auto md:flex'>
              <Button variant='secondary' size='sm' onClick={() => reset()}>
                Discard
              </Button>
              <Button size='sm' disabled={isSaveButtonDisabled}>
                Save User
              </Button>
            </div>
          </div>

          <div className='flex flex-col gap-4 lg:gap-8 2xl:flex-row'>
            <div className='flex flex-col gap-4 lg:gap-8'>
              <div className='flex flex-1 auto-rows-max flex-col items-start gap-4 lg:flex-row lg:gap-8'>
                <UserAvatar inputRef={imageRef} processing={processing} src={user.data.attributes.image ?? ''} handleImageClear={handleImageClear} previewImage={previewImage} className='mx-auto' />
                <Card className='w-full'>
                  <CardHeader>
                    <CardTitle>User Information</CardTitle>
                    <CardDescription>Update user information.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='grid gap-6'>
                      <div className='grid gap-2'>
                        <Label htmlFor='name'>Name</Label>
                        <Input id='name' type='text' name='name' value={data.name} onChange={handleInputChange} className='w-full' placeholder='Name' autoComplete='name' />
                      </div>
                      <div className='grid gap-2'>
                        <Label htmlFor='email'>Email</Label>
                        <Input id='email' type='email' name='email' value={data.email} onChange={handleInputChange} className='w-full' placeholder='Email' autoComplete='email' />
                      </div>
                      <div className='grid gap-2'>
                        <Label htmlFor='phone'>Phone</Label>
                        <Input id='phone' type='text' name='phone' value={data.phone} onChange={handleInputChange} className='w-full' placeholder='Phone' autoComplete='phone' />
                      </div>
                      <div className='grid gap-2'>
                        <Label htmlFor='gender'>Gender</Label>
                        <Select name='gender' value={data.gender} onValueChange={value => setData('gender', value)}>
                          <SelectTrigger id='gender' aria-label='Select Gender'>
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
                      </div>
                      <div className='grid gap-2'>
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

                          <InputError message={errors.image} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className='flex flex-col-reverse gap-4 lg:flex-row lg:gap-8'>
                <div className='grid auto-rows-max items-start gap-4 lg:-mt-58 lg:w-72 lg:min-w-72 lg:gap-8'>
                  <Card>
                    <CardHeader>
                      <CardTitle>Address Details</CardTitle>
                      <CardDescription>Update user address details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='grid gap-6'>
                        <div className='grid gap-2'>
                          <Label htmlFor='street'>Street</Label>
                          <Input id='street' type='text' name='street' value={data.address.street} onChange={handleInputChange} className='w-full' placeholder='street' autoComplete='street-address' />
                        </div>
                        <div className='grid gap-2'>
                          <Label htmlFor='city'>City</Label>
                          <Input id='city' type='text' name='city' value={data.address.city} onChange={handleInputChange} className='w-full' placeholder='City' autoComplete='address-level2' />
                        </div>
                        <div className='grid gap-2'>
                          <Label htmlFor='state'>State</Label>
                          <Select name='state' value={data.address.state} onValueChange={value => setData('address.state', value)}>
                            <SelectTrigger id='state' aria-label='Select state'>
                              <SelectValue placeholder='Select state' />
                            </SelectTrigger>
                            <SelectContent>
                              {states.map(state => (
                                <SelectItem key={state.value} value={state.value}>
                                  {state.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className='grid gap-2'>
                          <Label htmlFor='zip'>Zip</Label>
                          <InputNumber id='zip' value={data.address.zip} onChange={handleInputChange} name='zip' placeholder='Zip' />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className='w-full'>
                  <Tabs defaultValue='week'>
                    <div className='items-center justify-end lg:flex'>
                      <TabsList className='flex justify-center lg:justify-end'>
                        <TabsTrigger value='week'>Week</TabsTrigger>
                        <TabsTrigger value='month'>Month</TabsTrigger>
                        <TabsTrigger value='year'>Year</TabsTrigger>
                      </TabsList>
                    </div>
                    <TabsContent value='week'>
                      <Card>
                        <CardHeader className='px-7'>
                          <CardTitle>Orders</CardTitle>
                          <CardDescription>Recent orders from your store.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead className='hidden sm:table-cell'>Type</TableHead>
                                <TableHead className='hidden sm:table-cell'>Status</TableHead>
                                <TableHead className='hidden md:table-cell'>Date</TableHead>
                                <TableHead className='text-right'>Amount</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  <div className='font-medium'>Noah Williams</div>
                                  <div className='hidden text-sm text-muted-foreground md:inline'>noah@example.com</div>
                                </TableCell>
                                <TableCell className='hidden sm:table-cell'>Subscription</TableCell>
                                <TableCell className='hidden sm:table-cell'>
                                  <Badge className='text-xs' variant='secondary'>
                                    Fulfilled
                                  </Badge>
                                </TableCell>
                                <TableCell className='hidden md:table-cell'>2023-06-25</TableCell>
                                <TableCell className='text-right'>$350.00</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className='font-medium'>Emma Brown</div>
                                  <div className='hidden text-sm text-muted-foreground md:inline'>emma@example.com</div>
                                </TableCell>
                                <TableCell className='hidden sm:table-cell'>Sale</TableCell>
                                <TableCell className='hidden sm:table-cell'>
                                  <Badge className='text-xs' variant='secondary'>
                                    Fulfilled
                                  </Badge>
                                </TableCell>
                                <TableCell className='hidden md:table-cell'>2023-06-26</TableCell>
                                <TableCell className='text-right'>$450.00</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className='font-medium'>Liam Johnson</div>
                                  <div className='hidden text-sm text-muted-foreground md:inline'>liam@example.com</div>
                                </TableCell>
                                <TableCell className='hidden sm:table-cell'>Sale</TableCell>
                                <TableCell className='hidden sm:table-cell'>
                                  <Badge className='text-xs' variant='secondary'>
                                    Fulfilled
                                  </Badge>
                                </TableCell>
                                <TableCell className='hidden md:table-cell'>2023-06-23</TableCell>
                                <TableCell className='text-right'>$250.00</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className='font-medium'>Liam Johnson</div>
                                  <div className='hidden text-sm text-muted-foreground md:inline'>liam@example.com</div>
                                </TableCell>
                                <TableCell className='hidden sm:table-cell'>Sale</TableCell>
                                <TableCell className='hidden sm:table-cell'>
                                  <Badge className='text-xs' variant='secondary'>
                                    Fulfilled
                                  </Badge>
                                </TableCell>
                                <TableCell className='hidden md:table-cell'>2023-06-23</TableCell>
                                <TableCell className='text-right'>$250.00</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className='font-medium'>Olivia Smith</div>
                                  <div className='hidden text-sm text-muted-foreground md:inline'>olivia@example.com</div>
                                </TableCell>
                                <TableCell className='hidden sm:table-cell'>Refund</TableCell>
                                <TableCell className='hidden sm:table-cell'>
                                  <Badge className='text-xs' variant='outline'>
                                    Declined
                                  </Badge>
                                </TableCell>
                                <TableCell className='hidden md:table-cell'>2023-06-24</TableCell>
                                <TableCell className='text-right'>$150.00</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className='font-medium'>Emma Brown</div>
                                  <div className='hidden text-sm text-muted-foreground md:inline'>emma@example.com</div>
                                </TableCell>
                                <TableCell className='hidden sm:table-cell'>Sale</TableCell>
                                <TableCell className='hidden sm:table-cell'>
                                  <Badge className='text-xs' variant='secondary'>
                                    Fulfilled
                                  </Badge>
                                </TableCell>
                                <TableCell className='hidden md:table-cell'>2023-06-26</TableCell>
                                <TableCell className='text-right'>$450.00</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
            <div className='-mt-0 space-y-4 lg:-mt-[29.5rem] lg:w-72 lg:min-w-72 lg:space-y-8 2xl:-mt-0'>
              <Card>
                <CardHeader>
                  <CardTitle>User Role</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid gap-6'>
                    <div className='grid gap-2'>
                      <span className='-mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Role</span>
                      <MultiSelect
                        values={roles}
                        defaultSelectedValues={roles.filter(role => data.roles.includes(role.value))}
                        onValueChange={value => {
                          setData('roles', value)
                          clearErrors('roles')
                        }}
                        placeholder='Select roles'
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>User Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid gap-6'>
                    <div className='grid gap-2'>
                      <Label htmlFor='status'>Status</Label>
                      <Select name='status' value={data.status} onValueChange={value => setData('status', value)}>
                        <SelectTrigger id='status' aria-label='Select Status'>
                          <SelectValue placeholder='Select status' />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map(status => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Delete User</CardTitle>
                  <CardDescription>Once you delete a user, your actions can&apos;t be undone</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button size='sm' variant='destructive' onClick={() => initializeDeleteModal(deleteModalData)}>
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* for mobile view only */}
          <div className='flex items-center justify-end gap-2 md:hidden'>
            <Button variant='secondary' size='sm' onClick={() => reset()}>
              Discard
            </Button>
            <Button size='sm' disabled={isSaveButtonDisabled}>
              Save User
            </Button>
          </div>
        </div>
      </main>
      <DeleteModal />
    </AuthenticatedLayout>
  )
}

export default ShowUser
