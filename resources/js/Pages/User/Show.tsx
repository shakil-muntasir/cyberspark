import { ChevronLeft, Trash2Icon } from 'lucide-react'

import DeleteModal from '@/Components/DeleteModal'
import InputError from '@/Components/InputError'
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
import UserAvatar from '@/Components/UserAvatar'
import { useDeleteModal } from '@/Contexts/DeleteModalContext'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { cn, getImageData } from '@/Lib/utils'
import { User, UserForm } from '@/Pages/User/type'
import { useForm } from '@inertiajs/react'
import { useRef, useState } from 'react'

export default function ShowUser({ user: { data: user } }: { user: User }) {
  const { data, setData, post, processing, errors, clearErrors, reset } = useForm<UserForm>({
    name: user.attributes.name,
    email: user.attributes.email,
    gender: '',
    phone: user.attributes.phone,
    image: undefined,
    roles: user.attributes.roles,
    status: user.attributes.status,
    address: user.attributes.address ?? '',
    city: '',
    state: '',
    zip: '',
    password: ''
  })

  const [previewImage, setPreviewImage] = useState<string>('')

  const imageRef = useRef<HTMLInputElement>(null)

  const { initializeDeleteModal } = useDeleteModal()

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

  const deleteModalData = {
    id: user.attributes.id,
    name: user.attributes.name,
    title: 'user',
    url: '/users'
  }

  const roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Sales Representative', value: 'sales_rep' },
    { label: 'Customer', value: 'customer' },
    { label: 'Delivery-Man', value: 'delivery_man' }
  ]

  const statuses = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
  ]

  const states = [
    { label: 'Dhaka', value: 'dhaka' },
    { label: 'Chattogram', value: 'chattogram' },
    { label: 'Khulna', value: 'khulna' },
    { label: 'Rajshahi', value: 'rajshahi' },
    { label: 'Barishal', value: 'barishal' },
    { label: 'Sylhet', value: 'sylhet' },
    { label: 'Rangpur', value: 'rangpur' },
    { label: 'Mymensingh', value: 'mymensingh' }
  ]

  return (
    <AuthenticatedLayout title='User Details'>
      <main className='grid mx-auto max-w-[80rem] flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8'>
        <div className='grid auto-rows-max gap-4'>
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
            <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>{user.attributes.name}</h1>
            <div className='flex items-center space-x-1'>
              {user.attributes.roles.map((role, index) => (
                <Badge key={index} variant='outline' className='ml-auto sm:ml-0'>
                  {role}
                </Badge>
              ))}
            </div>
            <div className='hidden items-center gap-2 md:ml-auto md:flex'>
              <Button variant='secondary' size='sm' onClick={() => reset()}>
                Discard
              </Button>
              <Button size='sm'>Save User</Button>
            </div>
          </div>

          <div className='flex flex-col lg:flex-row gap-4 lg:gap-8'>
            <div className='flex flex-col gap-4 lg:gap-8'>
              <div className='flex flex-col lg:flex-row flex-1 auto-rows-max items-start gap-4 lg:gap-8'>
                <UserAvatar inputRef={imageRef} processing={processing} src={user.attributes.image ?? ''} handleImageClear={handleImageClear} previewImage={previewImage} className='mx-auto' />
                <Card className='w-full'>
                  <CardHeader>
                    <CardTitle>User Information</CardTitle>
                    <CardDescription>Update user information.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='grid gap-6'>
                      <div className='grid gap-2'>
                        <Label htmlFor='name'>Name</Label>
                        <Input id='name' type='text' name='name' value={data.name} onChange={handleInputChange} className='w-full' />
                      </div>
                      <div className='grid gap-2'>
                        <Label htmlFor='email'>Email</Label>
                        <Input id='email' type='email' name='email' value={data.email} onChange={handleInputChange} className='w-full' />
                      </div>
                      <div className='grid gap-2'>
                        <Label htmlFor='phone'>Phone</Label>
                        <Input id='phone' type='text' name='phone' value={data.phone} onChange={handleInputChange} className='w-full' />
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
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className='flex flex-col-reverse lg:flex-row gap-4 lg:gap-8'>
                <div className='grid auto-rows-max items-start gap-4 lg:gap-8 lg:min-w-72 lg:w-72 lg:-mt-40'>
                  <Card>
                    <CardHeader>
                      <CardTitle>Address Details</CardTitle>
                      <CardDescription>Update user address details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='grid gap-6'>
                        <div className='grid gap-2'>
                          <Label htmlFor='address'>Address</Label>
                          <Input id='address' type='text' name='address' value={data.address} onChange={handleInputChange} className='w-full' />
                        </div>
                        <div className='grid gap-2'>
                          <Label htmlFor='city'>City</Label>
                          <Input id='city' type='text' name='city' value={data.city} onChange={handleInputChange} className='w-full' />
                        </div>
                        <div className='grid gap-2 '>
                          <Label htmlFor='state'>State</Label>
                          <Select name='state' value={data.state} onValueChange={value => setData('state', value)}>
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
                          <InputNumber id='zip' type='number' value={data.zip} onChange={handleInputChange} name='zip' placeholder='Zip' />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className='w-full'>
                  <Tabs defaultValue='week'>
                    <div className='lg:flex items-center justify-end'>
                      <TabsList className='w-full flex justify-center lg:justify-end'>
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
            <div className='space-y-4 lg:space-y-8 lg:min-w-72 lg:w-72 '>
              <Card>
                <CardHeader>
                  <CardTitle>User Role</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid gap-6'>
                    <div className='grid gap-2'>
                      <Label htmlFor='role'>Role</Label>
                      <Select name='role'>
                        <SelectTrigger id='role' aria-label='Select Role'>
                          <SelectValue placeholder='Select role' />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map(role => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
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
                  <CardDescription>Once you delete a user, your actions can't be undone</CardDescription>
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
            <Button size='sm' variant='default'>
              Save User
            </Button>
          </div>
        </div>
      </main>
      <DeleteModal />
    </AuthenticatedLayout>
  )
}
