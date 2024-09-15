import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/Components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card'
import { Input } from '@/Components/ui/input'
import { InputNumber } from '@/Components/ui/input-number'
import { Label } from '@/Components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'

import { cn, formatCurrency } from '@/Lib/utils'
import { CheckCircleIcon } from '@/Icons/CheckCircleIcon'
import { ScrollArea } from '@/Components/ui/scroll-area'
import { ChequeIcon } from '@/Icons/ChequeIcon'
import { CashIcon } from '@/Icons/CashIcon'
import { MobileBankingIcon } from '@/Icons/MobileBankingIcon'
import { Separator } from '@/Components/ui/separator'
import { MinusCircle } from '@/Icons/MinusCircle'
import { PartiallyPaidIcon } from '@/Icons/PartiallyPaidIcon'
import { BkashIcon } from '@/Icons/BkashIcon'
import { RocketIcon } from '@/Icons/RocketIcon'
import { NagadIcon } from '@/Icons/NagadIcon'
import { UpayIcon } from '@/Icons/UpayIcon'
import ProductDropdownList from '@/Components/ProductDropdownList'
import CustomerDropdownList from '@/Components/CustomerDropdownList'
import { CartItem as CartItemType, ProductVariant } from '@/Pages/Product/types'
import CartItem from '@/Components/CartItem'
import { ChevronDownIcon, ChevronLeftIcon, ChevronUpIcon, ShoppingCartIcon } from 'lucide-react'
import { User } from '@/Pages/User/types'
import { SelectOption } from '@/Types'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'
import { Badge } from '@/Components/ui/badge'

type PaymentStatusType = 'due' | 'partial' | 'paid'
type DeliveryOptionType = 'in-house' | 'external'
type PaymentMethodType = 'cash_on_delivery' | 'cheque' | 'mobile_banking'

type UserForm = {
  name: string
  phone: string
  email: string
  image: File | undefined
  address: {
    street: string
    city: string
    state: string
    zip: string
  }
}

type MakeSellProps = {
  states: SelectOption[]
}

const MakeSell: React.FC<MakeSellProps> = ({ states }) => {
  const initialData: UserForm = {
    name: '',
    email: '',
    phone: '',
    image: undefined,
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    }
  }

  const [data, setData] = useState(initialData)

  const [openPartialPaymentPopover, setOpenPartialPaymentPopover] = useState(false)
  const [activePaymentStatus, setActivePaymentStatus] = useState<PaymentStatusType | undefined>(undefined)
  const [activePaymentMethod, setActivePaymentMethod] = useState<PaymentMethodType | undefined>(undefined)
  const [activeDeliveryMethod, setActiveDeliveryMethod] = useState<DeliveryOptionType | undefined>()
  const [partialPaymentAmount, setPartialPaymentAmount] = useState(0)
  const [mobileExpand, setMobileExpand] = useState(false)
  const [cartItems, setCartItems] = useState<CartItemType[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [totalPayable, setTotalPayable] = useState(0)
  const [totalRemaining, setTotalRemaining] = useState(0)
  const [deliveryCost, setDeliveryCost] = useState<number>(() => {
    return activeDeliveryMethod === 'in-house' ? 60 : activeDeliveryMethod === 'external' ? 100 : 0
  })

  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if the div should be visible
    if (activePaymentMethod === 'mobile_banking' || activePaymentMethod === 'cheque') {
      // Scroll into view if the ref is set
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activePaymentMethod])

  const handleSelectedCustomer = (user: User) => {
    setData({
      name: user.attributes.name,
      email: user.attributes.email,
      phone: user.attributes.phone,
      image: undefined,
      address: {
        street: user.relationships!.address!.attributes.street,
        city: user.relationships!.address!.attributes.city,
        state: user.relationships!.address!.attributes.state,
        zip: user.relationships!.address!.attributes.zip
      }
    })
  }

  const handleAddToCart = (variant: ProductVariant) => {
    const itemFound = cartItems.find(item => item.variant.id === variant.id)
    if (itemFound) {
      setCartItems(currentItems => {
        return currentItems.map(item => {
          if (item.variant.id === itemFound.variant.id) {
            return {
              ...item,
              quantity: item.quantity + 1,
              subtotal: item.subtotal + parseFloat(item.variant.attributes.selling_price)
            }
          }

          return item
        })
      })

      return
    }
    setCartItems(currentItems => [
      ...currentItems,
      {
        variant: variant,
        quantity: 1,
        subtotal: parseFloat(variant.attributes.selling_price)
      }
    ])
  }

  const handleCartItemChange = (variant: ProductVariant, event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseFloat(event.target.value)
    setCartItems(currentItems => {
      return currentItems.map(cartItem => {
        if (cartItem.variant.id === variant.id) {
          return {
            ...cartItem,
            quantity: parseFloat(event.target.value),
            subtotal: parseFloat(cartItem.variant.attributes.selling_price) * newQuantity
          }
        }

        return cartItem
      })
    })
  }

  const removeFromCart = (variant: ProductVariant) => {
    setCartItems(cartItems => cartItems.filter(item => item.variant.id !== variant.id))
  }

  useEffect(() => {
    let subtotal = 0
    cartItems.map(item => {
      subtotal += item.subtotal
    })

    setSubtotal(subtotal)

    if (cartItems.length === 0) {
      resetStates()
    }
  }, [cartItems])

  useEffect(() => {
    const totalPayable = subtotal + deliveryCost
    setTotalPayable(totalPayable)
    if (activePaymentStatus === 'paid') {
      setPartialPaymentAmount(totalPayable)
    }
    const timeout = setTimeout(() => {
      setTotalRemaining(() => totalPayable - partialPaymentAmount)
    }, 1)

    return () => clearTimeout(timeout)
  }, [deliveryCost, activePaymentStatus, partialPaymentAmount])

  const resetStates = () => {
    setActiveDeliveryMethod(undefined)
    setActivePaymentStatus(undefined)
    setActivePaymentMethod(undefined)
    setDeliveryCost(0)
    setPartialPaymentAmount(0)
    setTotalPayable(0)
    setTotalRemaining(0)
  }

  const serviceProviders = [
    {
      value: 'bkash',
      label: 'bKash',
      icon: BkashIcon
    },
    {
      value: 'rocket',
      label: 'Rocket',
      icon: RocketIcon
    },
    {
      value: 'nagad',
      label: 'Nagad',
      icon: NagadIcon
    },
    {
      value: 'upay',
      label: 'Upay',
      icon: UpayIcon
    }
  ]

  return (
    <AuthenticatedLayout title='Create Order'>
      <div className='mx-auto flex max-w-[80rem] flex-1 flex-col gap-4'>
        <div className='flex items-center gap-4'>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button variant='outline' size='icon' className='h-7 w-7' onClick={() => window.history.back()}>
                  <ChevronLeftIcon className='h-4 w-4' />
                  <span className='sr-only'>Back</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go back</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>Order #1234</h1>
          <Badge className='ml-auto sm:ml-0'>New</Badge>
          <div className='hidden items-center gap-2 md:ml-auto md:flex'>
            <Button variant='secondary' size='sm' onClick={() => null}>
              Discard
            </Button>
          </div>
        </div>
        <div className='flex flex-col gap-4 md:gap-8 lg:flex-row'>
          <div className='flex w-full flex-col gap-4 md:gap-8'>
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Browse and add multiple products to your cart.</CardDescription>
              </CardHeader>
              <CardContent>
                <ProductDropdownList id='products' label='Product' handleAddToCart={handleAddToCart} />
              </CardContent>
              {/* for mobile view only */}
              <CardContent className='px-3 pb-3 lg:hidden'>
                {cartItems.length > 0 && (
                  <div className={cn('overflow-hidden', mobileExpand ? '' : 'max-h-[14.5rem]')}>
                    {cartItems.map(cartItem => (
                      <div key={cartItem.variant.id}>
                        <CartItem data={cartItem} removeFromCart={removeFromCart} handleCartItemChange={handleCartItemChange} />
                      </div>
                    ))}
                  </div>
                )}
                {cartItems.length > 2 && (
                  <div className='flex justify-center'>
                    <Button className='-mb-1 flex h-14 flex-col items-center p-0 hover:bg-background' variant='ghost' onClick={() => setMobileExpand(!mobileExpand)}>
                      {mobileExpand ? (
                        <>
                          <span>Collapse</span>
                          <ChevronUpIcon />
                        </>
                      ) : (
                        <>
                          <span className='flex items-center gap-1'>
                            Expand <span className='text-xs text-muted-foreground'>+{cartItems.length - 2}</span>
                          </span>
                          <ChevronDownIcon />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>Select a customer from the dropdown.</CardDescription>
              </CardHeader>
              <CardContent className='grid gap-6'>
                <div className='grid gap-2'>
                  <CustomerDropdownList handleSelectedCustomer={handleSelectedCustomer} id='customer' label='Customer' />
                </div>
                <div className='flex gap-4'>
                  <div className='grid w-full gap-2'>
                    <Label htmlFor='name'>Phone</Label>
                    <Input id='name' type='text' value={data.phone} name='name' placeholder='+880 1XXX-XXXXXX' />
                  </div>
                  <div className='grid w-full gap-2'>
                    <Label htmlFor='name'>Email</Label>
                    <Input id='name' type='text' value={data.email} name='name' placeholder='Email' />
                  </div>
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='name'>Street</Label>
                  <Input id='name' name='name' value={data.address.street} placeholder='Street' />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='name'>City</Label>
                  <Input id='name' type='text' value={data.address.city} name='name' placeholder='City' />
                </div>
                <div className='flex gap-4'>
                  <div className='w-1/2'>
                    <div className='grid gap-2'>
                      <Label htmlFor='state'>State</Label>
                      <Select name='state' value={data.address.state}>
                        <SelectTrigger id='state'>
                          <SelectValue placeholder='Select State' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {states.map(state => (
                              <SelectItem key={state.value} value={state.value}>
                                {state.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className='w-1/2'>
                    <div className='grid gap-2'>
                      <Label htmlFor='zip'>Zip</Label>
                      <Input id='zip' value={data.address.zip} placeholder='Zip' />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className='flex flex-col gap-4 md:gap-8 lg:flex-row'>
              <Card className='w-full'>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                  <CardDescription>Choose payment status and method.</CardDescription>
                </CardHeader>
                <CardContent className='grid gap-2'>
                  <Label htmlFor='payment_status' className='h-3.5'>
                    Payment Status
                  </Label>
                  <RadioGroup defaultValue='due' className='grid grid-cols-3' id='payment_status'>
                    <Button
                      variant='outline'
                      className={cn('relative h-auto px-0 py-3 hover:bg-transparent', activePaymentStatus === 'due' ? 'border-[#cad2c5] outline-2' : '')}
                      onClick={() => {
                        setActivePaymentStatus('due')
                        setPartialPaymentAmount(0)
                        setOpenPartialPaymentPopover(false)
                      }}
                      disabled={cartItems.length === 0}
                    >
                      <div className='h-full w-full'>
                        <p className={cn('flex h-full items-center justify-center text-sm font-medium transition-all duration-300 ease-in-out', activePaymentStatus === 'due' ? '-translate-x-[28%] translate-y-[28%]' : '')}>Due</p>
                      </div>
                      <RadioGroupItem asChild className='hidden' value='due' />
                      <MinusCircle className={cn('absolute right-2.5 top-2 h-4 w-4 text-[#cad2c5] transition-all duration-100', activePaymentStatus === 'due' ? '' : 'opacity-0')} aria-hidden='true' />
                    </Button>
                    <Popover open={openPartialPaymentPopover}>
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          className={cn('relative h-auto px-0 py-3 hover:bg-transparent focus-visible:outline-none focus-visible:ring-0', activePaymentStatus === 'partial' ? 'border-[#83c5be] outline-2' : '')}
                          onClick={() => {
                            setActivePaymentStatus('partial')
                            setPartialPaymentAmount(0)
                            setOpenPartialPaymentPopover(true)
                          }}
                          disabled={cartItems.length === 0}
                        >
                          <div className='h-full w-full'>
                            <p className={cn('flex h-full items-center justify-center text-sm font-medium transition-all duration-300 ease-in-out', activePaymentStatus === 'partial' ? '-translate-x-[22%] translate-y-[28%]' : '')}>Partial</p>
                          </div>
                          <RadioGroupItem asChild className='hidden' value='partial' />
                          <PartiallyPaidIcon className={cn('absolute right-2.5 top-2 h-4 w-4 text-[#83c5be] transition-all duration-100', activePaymentStatus === 'partial' ? '' : 'opacity-0')} aria-hidden='true' />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='grid gap-2'>
                        <Label>Partial amount</Label>
                        <InputNumber
                          id=''
                          name=''
                          className='h-8 w-36'
                          placeholder='Amount'
                          onEnterPress={e => {
                            setPartialPaymentAmount(parseFloat(e.target.value))
                            setOpenPartialPaymentPopover(false)
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <Button
                      variant='outline'
                      className={cn('relative h-auto px-0 py-3 hover:bg-transparent', activePaymentStatus === 'paid' ? 'border-[#006d77] outline-2' : '')}
                      onClick={() => {
                        setActivePaymentStatus('paid')
                        setOpenPartialPaymentPopover(false)
                      }}
                      disabled={cartItems.length === 0}
                    >
                      <div className='h-full w-full'>
                        <p className={cn('flex h-full items-center justify-center text-sm font-medium transition-all duration-300 ease-in-out', activePaymentStatus === 'paid' ? '-translate-x-[28%] translate-y-[28%]' : '')}>Paid</p>
                      </div>
                      <RadioGroupItem asChild className='hidden' value='paid' />
                      <CheckCircleIcon className={cn('absolute right-2.5 top-2 h-4 w-4 text-[#006d77] transition-all duration-100', activePaymentStatus === 'paid' ? '' : 'opacity-0')} aria-hidden='true' />
                    </Button>
                  </RadioGroup>
                </CardContent>
                <CardContent className='grid gap-2'>
                  <Label className=''>Payment Method</Label>
                  <RadioGroup defaultValue='cash_on_delivery' value={activePaymentMethod}>
                    <Card>
                      <CardContent className='flex h-18 p-0'>
                        <Button variant='ghost' className={cn('flex h-full w-1/3 items-end justify-start rounded-r-none px-2.5 pb-2.5', activePaymentMethod === 'cash_on_delivery' ? 'bg-accent' : '')} onClick={() => setActivePaymentMethod('cash_on_delivery')} disabled={cartItems.length === 0}>
                          <RadioGroupItem asChild className='hidden' value='cash_on_delivery' id='cash_on_delivery' />
                          <div className={cn('space-y-0.5 transition-all duration-200', activePaymentMethod === 'cash_on_delivery' ? 'text-[#70a288]' : '')}>
                            <CashIcon className='h-5 w-5' />
                            <p className='text-sm font-medium tracking-tighter'>On Delivery</p>
                          </div>
                        </Button>
                        <Button variant='ghost' className={cn('flex h-full w-1/3 items-end justify-start rounded-none border-x px-2.5 pb-2.5', activePaymentMethod === 'mobile_banking' ? 'bg-accent' : '')} onClick={() => setActivePaymentMethod('mobile_banking')} disabled={cartItems.length === 0}>
                          <RadioGroupItem asChild className='hidden' value='mobile_banking' id='mobile_banking' />
                          <div className={cn('space-y-0.5 transition-all duration-200', activePaymentMethod === 'mobile_banking' ? 'text-[#dab785]' : '')}>
                            <MobileBankingIcon className='h-5 w-5' />
                            <p className='text-sm font-medium tracking-tighter'>Mobile Banking</p>
                          </div>
                        </Button>
                        <Button variant='ghost' className={cn('flex h-full w-1/3 items-end justify-start rounded-l-none px-2.5 pb-2.5', activePaymentMethod === 'cheque' ? 'bg-accent' : '')} onClick={() => setActivePaymentMethod('cheque')} disabled={cartItems.length === 0}>
                          <RadioGroupItem asChild className='hidden' value='cheque' id='cheque' />
                          <div className={cn('space-y-0.5 transition-all duration-200', activePaymentMethod === 'cheque' ? 'text-[#d5896f]' : '')}>
                            <ChequeIcon className='h-5 w-5' />
                            <p className='text-sm font-medium tracking-tighter'>Cheque</p>
                          </div>
                        </Button>
                      </CardContent>
                    </Card>
                  </RadioGroup>
                </CardContent>
                <CardContent className={cn('pb-0 transition-all duration-300 ease-in-out', (activePaymentMethod === 'mobile_banking' || activePaymentMethod === 'cheque') && 'pb-6')}>
                  <div ref={contentRef} className={cn('grid h-0 gap-4 opacity-0 transition-all duration-300 ease-in-out', (activePaymentMethod === 'mobile_banking' || activePaymentMethod === 'cheque') && 'h-auto opacity-100')}>
                    {activePaymentMethod === 'mobile_banking' && (
                      <>
                        <div className='grid gap-2'>
                          <Label>Service Provider</Label>
                          <Select name='service_provider'>
                            <SelectTrigger id='service_provider'>
                              <SelectValue placeholder='Select Service Provider' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {serviceProviders.map(provider => (
                                  <SelectItem key={provider.value} value={provider.value} checkPosition='right'>
                                    <div className='flex items-center gap-1.5'>
                                      <provider.icon className='h-5 w-5' />
                                      <span>{provider.label}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className='flex gap-2'>
                          <div className='grid gap-2'>
                            <Label>Account Number</Label>
                            <Input id='account_number' placeholder='+880 1XXX-XXXXXX' />
                          </div>
                          <div className='grid gap-2'>
                            <Label>Transaction ID</Label>
                            <Input id='transaction_id' placeholder='Transaction ID' />
                          </div>
                        </div>
                      </>
                    )}
                    {activePaymentMethod === 'cheque' && (
                      <>
                        <div className='grid gap-2'>
                          <Label>Bank name</Label>
                          <Input placeholder='Bank name' />
                        </div>
                        <div className='grid gap-2'>
                          <Label>Cheque number</Label>
                          <Input id='cheque_number' placeholder='Cheque number' />
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card className='h-fit w-full'>
                <CardHeader>
                  <CardTitle>Delivery Information</CardTitle>
                  <CardDescription>Choose delivery method and service.</CardDescription>
                </CardHeader>
                <CardContent className='grid gap-2'>
                  <Label>Delivery Method</Label>
                  <RadioGroup defaultValue='standard' value={activeDeliveryMethod} className='grid grid-cols-2'>
                    <Button
                      variant='outline'
                      className={cn('relative h-auto p-0', activeDeliveryMethod === 'in-house' ? 'border-[#6096ba] outline-2' : '')}
                      onClick={() => {
                        setActiveDeliveryMethod('in-house')
                        setDeliveryCost(60)
                      }}
                      disabled={cartItems.length === 0}
                    >
                      <div className='flex w-full flex-col items-start px-4'>
                        <div className='py-3.5'>
                          <p className='text-start text-sm font-medium'>In House</p>
                          <p className='text-sm tracking-tight text-muted-foreground'>4-10 business days</p>
                        </div>
                        <div className='pb-3.5'>
                          <p className='text-sm font-medium'>{formatCurrency(60)}</p>
                        </div>
                      </div>
                      <RadioGroupItem asChild className='hidden' value='standard' />
                      <CheckCircleIcon className={cn('absolute right-3 top-3 h-4 w-4 text-[#6096ba] transition-all duration-100', activeDeliveryMethod === 'in-house' ? '' : 'opacity-0')} aria-hidden='true' />
                    </Button>
                    <Button
                      className={cn('relative h-auto p-0', activeDeliveryMethod === 'external' ? 'border-[#81c3d7] outline-2' : '')}
                      variant='outline'
                      onClick={() => {
                        setActiveDeliveryMethod('external')
                        setDeliveryCost(100)
                      }}
                      disabled={cartItems.length === 0}
                    >
                      <div className='flex w-full flex-col items-start px-4'>
                        <div className='py-3.5'>
                          <p className='text-start text-sm font-medium'>External</p>
                          <p className='text-sm tracking-tight text-muted-foreground'>2-5 business days</p>
                        </div>
                        <div className='pb-3.5'>
                          <p className='text-sm font-medium'>{formatCurrency(100)}</p>
                        </div>
                      </div>
                      <RadioGroupItem asChild className='hidden' value='express' id='express' />
                      <CheckCircleIcon className={cn('absolute right-3 top-3 h-4 w-4 text-[#81c3d7] transition-all duration-100', activeDeliveryMethod === 'external' ? '' : 'opacity-0')} aria-hidden='true' />
                    </Button>
                  </RadioGroup>
                </CardContent>
                {activeDeliveryMethod === 'in-house' ? (
                  <CardContent>
                    <CustomerDropdownList id='delivery_man' label='Delivery Man' handleSelectedCustomer={() => null} />
                  </CardContent>
                ) : (
                  <CardContent className='grid gap-2 pt-px'>
                    <Label htmlFor='delivery_man'>Courier Service</Label>
                    <Select name='service_provider'>
                      <SelectTrigger id='service_provider'>
                        <SelectValue placeholder='Select Courier Service' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {serviceProviders.map(provider => (
                            <SelectItem key={provider.value} value={provider.value} checkPosition='right'>
                              <div className='flex items-center gap-1.5'>
                                <provider.icon className='h-5 w-5' />
                                <span>{provider.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
          <div className='lg:w-6/12'>
            <div className='grid'>
              <Card>
                <CardHeader>
                  <CardTitle>Order summary</CardTitle>
                  <CardDescription>Check order details, quantities, and total amount.</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className='hidden px-0 pb-0 lg:block'>
                  {cartItems.length > 0 ? (
                    <ScrollArea className='lg:h-[20rem]'>
                      <div>
                        {cartItems.map((cartItem, index) => (
                          <>
                            <div key={cartItem.variant.id}>
                              <CartItem data={cartItem} removeFromCart={removeFromCart} handleCartItemChange={handleCartItemChange} />
                            </div>
                            {index !== cartItems.length - 1 && <Separator />}
                          </>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className='flex flex-col items-center justify-center gap-2 text-muted-foreground lg:h-[20rem]'>
                      <ShoppingCartIcon className='mt-8 h-18 w-18' />
                      <span className='ml-2 text-sm font-medium'>Add items to cart.</span>
                    </div>
                  )}
                </CardContent>
                <Separator className='hidden lg:block' />
                <CardContent className='space-y-2 py-2 text-xs text-muted-foreground'>
                  <div className='flex items-center justify-between'>
                    <Label>Subtotal</Label>
                    <p className='text-sm'>{formatCurrency(subtotal)}</p>
                  </div>
                  <div className='flex items-center justify-between text-xs text-muted-foreground'>
                    <Label>Shipping</Label>
                    <p className='text-sm'>{formatCurrency(deliveryCost)}</p>
                  </div>
                </CardContent>
                <Separator />
                <CardContent className='py-2'>
                  <div className='flex items-center justify-between'>
                    <Label className='text-sm'>Total Payable</Label>
                    <p className='text-sm font-semibold'>{formatCurrency(totalPayable)}</p>
                  </div>
                </CardContent>
                <Separator />
                <CardContent className='py-2'>
                  <div className='flex items-center justify-between'>
                    <Label className='text-sm'>Total Paid</Label>
                    <p className='text-sm font-semibold'>{formatCurrency(partialPaymentAmount)}</p>
                  </div>
                </CardContent>
                <Separator />
                <CardContent className='py-2'>
                  <div className='flex items-center justify-between'>
                    <Label className='text-sm'>Total Remaining</Label>
                    <p className='text-sm font-semibold'>{formatCurrency(totalRemaining)}</p>
                  </div>
                </CardContent>
                <CardFooter className='justify-end space-x-2 pt-4 lg:space-x-0'>
                  <Button variant='secondary' className='rounded-sm lg:hidden'>
                    Cancel
                  </Button>
                  <Button className='lg:w-full'>Confirm Order</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

export default MakeSell
