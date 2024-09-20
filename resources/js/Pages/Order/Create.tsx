import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/Components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover'
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
import { CartItemType, ProductVariant } from '@/Pages/Product/types'
import { AlertCircleIcon, ChevronDownIcon, ChevronLeftIcon, ChevronUpIcon, Loader2Icon, ShoppingCartIcon } from 'lucide-react'
import { User } from '@/Pages/User/types'
import { SelectOption } from '@/Types'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'
import useForm from '@/Hooks/form'
import { OrderForm, OrderVariant } from '@/Pages/Order/types'
import { useToast } from '@/Components/ui/use-toast'
import CartItem from '@/Components/CartItem'
import FormInput from '@/Components/FormInput'

interface CourierServiceProps extends SelectOption {
  id: string
}

type MakeSellProps = {
  courier_services: CourierServiceProps[]
  states: SelectOption[]
}

const CreateOrder: React.FC<MakeSellProps> = ({ courier_services, states }) => {
  const { toast } = useToast()

  const { data, setData, post, reset, errors, clearErrors } = useForm<OrderForm>({
    customer_id: undefined,
    delivery_method: undefined,
    delivery_cost: undefined,
    delivery_man_id: undefined,
    courier_service_id: undefined,
    total_payable: undefined,

    order_variants: [],
    address: {
      contact_number: '',
      email: '',
      street: '',
      city: '',
      state: '',
      zip: undefined
    },

    payment_status: undefined,
    total_paid: undefined,
    payment_method: undefined,
    service_provider: undefined,
    account_number: undefined,
    txn_id: undefined,
    bank_name: undefined,
    cheque_number: undefined
  })

  const [openPartialPaymentPopover, setOpenPartialPaymentPopover] = useState(false)
  const [mobileExpand, setMobileExpand] = useState(false)
  const [cartItems, setCartItems] = useState<CartItemType[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [totalRemaining, setTotalRemaining] = useState<number | undefined>()
  const [loading, setLoading] = useState(false)
  const [submitButtonText, setSubmitButtonText] = useState<'Place Order' | 'Processing' | 'Failed to Place Order'>('Place Order')

  const contentRef = useRef<HTMLDivElement>(null)

  const handleAddNewOrder = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setSubmitButtonText('Processing')

    setTimeout(() => {
      post(route('orders.store'), {
        onSuccess: handleSuccess,
        onError: handleError,
        preserveScroll: true
      })
    }, 500)

    setOpenPartialPaymentPopover(false)
  }

  const handleSuccess = () => {
    setTimeout(() => {
      reset()
      toast({
        title: 'Success!',
        description: 'New order has been placed successfully.',
        duration: 2000
      })
      setLoading(false)
      setSubmitButtonText('Place Order')
    }, 200)
  }

  const handleError = () => {
    setSubmitButtonText('Failed to Place Order')
    setTimeout(() => {
      setLoading(false)
      setSubmitButtonText('Place Order')
    }, 2000)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setData(name as keyof OrderForm, value)
    clearErrors(name as keyof OrderForm)
  }

  const handleSelectedCustomerInformation = (user: User) => {
    setData(data => ({
      ...data,
      address: {
        contact_number: user.attributes.phone,
        email: user.attributes.email,
        street: user.relationships!.address!.attributes.street,
        city: user.relationships!.address!.attributes.city,
        state: user.relationships!.address!.attributes.state,
        zip: parseInt(user.relationships!.address!.attributes.zip)
      }
    }))

    setData('customer_id', user.id)
    clearErrors('address.contact_number')
    clearErrors('address.email')
    clearErrors('address.street')
    clearErrors('address.city')
    clearErrors('address.state')
    clearErrors('address.zip')
    clearErrors('customer_id')
  }

  const handleSelectedDeliveryMan = (user: User) => {
    setData('delivery_man_id', user.id)
    clearErrors('delivery_man_id')
    clearErrors('courier_service_id')
  }

  const handleAddToCart = (variant: ProductVariant) => {
    const itemFound = data.order_variants.find(item => item.product_variant_id === variant.id)
    if (itemFound) {
      setData(data => {
        const updatedVariants = data.order_variants.map(item => {
          if (item.product_variant_id === itemFound.product_variant_id) {
            return {
              ...item,
              quantity: item.quantity + 1
            }
          }

          return item
        })

        return {
          ...data,
          order_variants: updatedVariants
        }
      })
      setCartItems(items =>
        items.map(item =>
          item.variant.id === variant.id
            ? {
                ...item,
                quantity: item.quantity + 1
              }
            : item
        )
      )

      return
    }
    setData('order_variants', (currentItems: OrderVariant[]) => [
      ...currentItems,
      {
        product_variant_id: variant.id,
        quantity: 1
      }
    ])
    setCartItems(cartItems => [
      ...cartItems,
      {
        variant: variant,
        quantity: 1
      }
    ])
    clearErrors('order_variants')
  }

  const handleCartItemChange = (variant: ProductVariant, event: React.ChangeEvent<HTMLInputElement>) => {
    setData(data => {
      const updatedVariants = data.order_variants.map(item => {
        if (item.product_variant_id === variant.id) {
          return {
            ...item,
            quantity: parseInt(event.target.value)
          }
        }

        return item
      })

      return {
        ...data,
        order_variants: updatedVariants
      }
    })
    setCartItems(items =>
      items.map(item =>
        item.variant.id === variant.id
          ? {
              ...item,
              quantity: parseInt(event.target.value)
            }
          : item
      )
    )
  }

  const removeFromCart = (variant: ProductVariant) => {
    setData(data => ({
      ...data,
      order_variants: data.order_variants.filter(item => item.product_variant_id !== variant.id)
    }))
    setCartItems(cartItems.filter(item => item.variant.id !== variant.id))
  }

  useEffect(() => {
    let subtotal = 0
    cartItems.map(item => {
      subtotal += parseFloat(item.variant.attributes.selling_price) * item.quantity
    })
    setSubtotal(subtotal)
  }, [cartItems, data.order_variants])

  useEffect(() => {
    setData('total_payable', subtotal + (data.delivery_cost ?? 0))
    setData(data => ({
      ...data,
      total_paid: undefined,
      payment_status: undefined
    }))
  }, [subtotal, data.delivery_cost])

  useEffect(() => {
    const totalRemaining = (data.total_payable ?? 0) - (data.total_paid ?? 0)
    const timer = setTimeout(() => {
      setTotalRemaining(parseFloat(totalRemaining.toFixed(2)))
    }, 200)

    return () => clearTimeout(timer)
  }, [data.total_payable, data.total_paid])

  useEffect(() => {
    if (data.payment_method === 'mobile_banking' || data.payment_method === 'cheque') {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [data.payment_method])

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
          <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>New Order</h1>
        </div>
        <div className='flex flex-col gap-4 md:gap-8 lg:flex-row'>
          <div className='flex flex-1 flex-col gap-4 md:gap-8'>
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Browse and add multiple products to your cart.</CardDescription>
              </CardHeader>
              <CardContent className='pb-0 lg:pb-6'>
                <FormInput id='order_variants' label='Products' errorMessage={errors.order_variants}>
                  <ProductDropdownList id='order_variants' handleAddToCart={handleAddToCart} />
                </FormInput>
              </CardContent>
              {/* for mobile view only */}
              <Separator className={cn('lg:hidden', cartItems.length === 0 && 'hidden')} />
              <CardContent className='px-3 pb-3 lg:hidden'>
                {cartItems.length > 0 && (
                  <div className={cn('overflow-hidden', mobileExpand ? 'max-h-full' : 'max-h-[14.5rem]')}>
                    {cartItems.map((cartItem, index) => (
                      <div key={cartItem.variant.id}>
                        <CartItem data={cartItem} removeFromCart={removeFromCart} handleCartItemChange={handleCartItemChange} />
                        {index !== data.order_variants.length - 1 && (
                          <div className='mx-4'>
                            <Separator />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {cartItems.length > 2 && (
                  <>
                    {mobileExpand && (
                      <div className='mx-4'>
                        <Separator />
                      </div>
                    )}
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
                  </>
                )}
              </CardContent>
            </Card>

            <Card className='h-fit'>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>Select a customer from the dropdown.</CardDescription>
              </CardHeader>
              <CardContent className='grid gap-1.5'>
                <FormInput id='customer_id' label='Customer' errorMessage={errors.customer_id}>
                  <CustomerDropdownList handleSelectedCustomer={handleSelectedCustomerInformation} id='customer_id' label='Customer' />
                </FormInput>

                <div className='grid grid-cols-2 gap-4'>
                  <FormInput id='contact_number' label='Contact Number' errorMessage={errors['address.contact_number']}>
                    <Input id='contact_number' type='text' name='address.contact_number' value={data.address.contact_number} onChange={handleInputChange} placeholder='+880 1XXX-XXXXXX' />
                  </FormInput>

                  <FormInput id='email' label='Email' errorMessage={errors['address.email']}>
                    <Input id='email' type='email' name='address.email' value={data.address.email} onChange={handleInputChange} placeholder='your@email.com' />
                  </FormInput>
                </div>

                <FormInput id='street' label='Street' errorMessage={errors['address.street']}>
                  <Input id='street' type='text' name='address.street' value={data.address.street} onChange={handleInputChange} placeholder='Street' />
                </FormInput>

                <FormInput id='city' label='City' errorMessage={errors['address.city']}>
                  <Input id='city' type='text' name='address.city' value={data.address.city} onChange={handleInputChange} placeholder='City' />
                </FormInput>

                <div className='grid grid-cols-2 gap-4'>
                  <FormInput id='state' label='State' errorMessage={errors['address.state']}>
                    <Select
                      name='address.state'
                      value={data.address.state}
                      onValueChange={value => {
                        setData('address.state', value)
                        clearErrors('address.state')
                      }}
                    >
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
                  </FormInput>

                  <FormInput id='zip' label='ZIP' errorMessage={errors['address.zip']}>
                    <Input id='zip' type='text' name='address.zip' value={data.address.zip} onChange={handleInputChange} placeholder='ZIP' />
                  </FormInput>
                </div>
              </CardContent>
            </Card>
            <div className='flex flex-col gap-4 lg:flex-row lg:gap-8'>
              <Card className='h-fit w-full'>
                <CardHeader>
                  <CardTitle>Delivery Information</CardTitle>
                  <CardDescription>Choose delivery method and service.</CardDescription>
                </CardHeader>
                <CardContent className='pb-2'>
                  <FormInput id='delivery_method' label='Delivery Method' errorMessage={errors.delivery_method}>
                    <div className='grid grid-cols-2 gap-2'>
                      <Button
                        variant='outline'
                        className={cn('relative h-auto p-0', data.delivery_method === 'in-house' ? 'border-[#6096ba] outline-2' : '')}
                        onClick={() => {
                          setData((data: OrderForm) => ({
                            ...data,
                            delivery_method: 'in-house',
                            delivery_cost: 60,
                            courier_service_id: undefined
                          }))
                          clearErrors('delivery_method')
                          clearErrors('courier_service_id')
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
                        <CheckCircleIcon className={cn('absolute right-3 top-3 h-4 w-4 text-[#6096ba] transition-all duration-100', data.delivery_method === 'in-house' ? '' : 'opacity-0')} aria-hidden='true' />
                      </Button>
                      <Button
                        className={cn('relative h-auto p-0', data.delivery_method === 'external' ? 'border-[#81c3d7] outline-2' : '')}
                        variant='outline'
                        onClick={() => {
                          {
                            setData((data: OrderForm) => ({
                              ...data,
                              delivery_method: 'external',
                              delivery_cost: 100,
                              delivery_man_id: undefined
                            }))
                            clearErrors('delivery_method')
                            clearErrors('delivery_man_id')
                          }
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
                        <CheckCircleIcon className={cn('absolute right-3 top-3 h-4 w-4 text-[#81c3d7] transition-all duration-100', data.delivery_method === 'external' ? '' : 'opacity-0')} aria-hidden='true' />
                      </Button>
                    </div>
                  </FormInput>
                </CardContent>
                <CardContent className='pb-2'>
                  {data.delivery_method === 'external' ? (
                    <FormInput id='courier_service' label='Courier Service' errorMessage={errors.courier_service_id}>
                      <Select
                        name='service_provider'
                        onValueChange={value => {
                          setData('courier_service_id', value)
                          clearErrors('courier_service_id')
                          clearErrors('delivery_man_id')
                        }}
                        disabled={data.order_variants.length === 0}
                      >
                        <SelectTrigger id='service_provider'>
                          <SelectValue placeholder='Select Courier Service' />
                        </SelectTrigger>
                        <SelectContent>
                          {courier_services.map(service => (
                            <SelectItem key={service.value} value={service.id} checkPosition='right' className='group'>
                              <div className='flex items-center gap-2'>
                                <span>{service.label}</span>
                                <span className='border-l pl-2 text-xs text-muted-foreground group-hover:border-muted-foreground/20'>BDT {service.value}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormInput>
                  ) : (
                    <FormInput id='delivery_man' label='Delivery Man' errorMessage={errors.delivery_man_id}>
                      <CustomerDropdownList id='delivery_man' label='Delivery Man' handleSelectedCustomer={handleSelectedDeliveryMan} disabled={data.order_variants.length === 0} className='-mt-px' />
                    </FormInput>
                  )}
                </CardContent>
              </Card>
              <Card className='h-fit w-full'>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                  <CardDescription>Choose payment status and method.</CardDescription>
                </CardHeader>
                <CardContent className='grid gap-2 pb-2'>
                  <FormInput id='payment_method' label='Payment Method' errorMessage={errors.payment_method}>
                    <Card>
                      <CardContent className='flex h-18 p-0'>
                        <Button
                          variant='ghost'
                          className={cn('flex h-full w-1/3 items-end justify-start rounded-r-none px-2.5 pb-2.5', data.payment_method === 'cash_on_delivery' ? 'bg-accent' : '')}
                          onClick={() => {
                            setData(data => ({
                              ...data,
                              payment_method: 'cash_on_delivery',
                              bank_name: undefined,
                              cheque_number: undefined,
                              service_provider: undefined,
                              account_number: undefined,
                              txn_id: undefined
                            }))
                            clearErrors('payment_method')
                            clearErrors('bank_name')
                            clearErrors('cheque_number')
                            clearErrors('service_provider')
                            clearErrors('account_number')
                            clearErrors('txn_id')
                          }}
                          disabled={cartItems.length === 0}
                        >
                          <div className={cn('space-y-0.5 transition-all duration-200', data.payment_method === 'cash_on_delivery' ? 'text-[#70a288]' : '')}>
                            <CashIcon className='h-5 w-5' />
                            <p className='text-sm font-medium tracking-tighter'>On Delivery</p>
                          </div>
                        </Button>
                        <Button
                          variant='ghost'
                          className={cn('flex h-full w-1/3 items-end justify-start rounded-none border-x px-2.5 pb-2.5', data.payment_method === 'mobile_banking' ? 'bg-accent' : '')}
                          onClick={() => {
                            setData(data => ({
                              ...data,
                              payment_method: 'mobile_banking',
                              payment_status: data.payment_status !== 'due' ? data.payment_status : undefined,
                              bank_name: undefined,
                              cheque_number: undefined
                            }))
                            clearErrors('payment_method')
                            clearErrors('bank_name')
                            clearErrors('cheque_number')
                          }}
                          disabled={cartItems.length === 0}
                        >
                          <div className={cn('space-y-0.5 transition-all duration-200', data.payment_method === 'mobile_banking' ? 'text-[#dab785]' : '')}>
                            <MobileBankingIcon className='h-5 w-5' />
                            <p className='text-sm font-medium tracking-tighter'>Mobile Banking</p>
                          </div>
                        </Button>
                        <Button
                          variant='ghost'
                          className={cn('flex h-full w-1/3 items-end justify-start rounded-l-none px-2.5 pb-2.5', data.payment_method === 'cheque' ? 'bg-accent' : '')}
                          onClick={() => {
                            setData(data => ({
                              ...data,
                              payment_method: 'cheque',
                              service_provider: undefined,
                              account_number: undefined,
                              txn_id: undefined
                            }))
                            clearErrors('payment_method')
                            clearErrors('service_provider')
                            clearErrors('account_number')
                            clearErrors('txn_id')
                          }}
                          disabled={cartItems.length === 0}
                        >
                          <div className={cn('space-y-0.5 transition-all duration-200', data.payment_method === 'cheque' ? 'text-[#d5896f]' : '')}>
                            <ChequeIcon className='h-5 w-5' />
                            <p className='text-sm font-medium tracking-tighter'>Cheque</p>
                          </div>
                        </Button>
                      </CardContent>
                    </Card>
                  </FormInput>
                </CardContent>
                <CardContent className='pb-2'>
                  <FormInput id='payment_status' label='Payment Status' errorMessage={errors.payment_status || errors.total_paid}>
                    <div className='grid grid-cols-3 gap-2'>
                      <Button
                        variant='outline'
                        className={cn('relative h-auto px-0 py-3 hover:bg-transparent', data.payment_status === 'due' ? 'border-[#cad2c5] outline-2' : '')}
                        onClick={() => {
                          setData('payment_status', 'due')
                          setData('total_paid', undefined)
                          setOpenPartialPaymentPopover(false)
                          clearErrors('total_paid')
                        }}
                        disabled={cartItems.length === 0 || ['mobile_banking', 'cheque'].includes(data.payment_method ?? '')}
                      >
                        <div className='h-full w-full'>
                          <p className={cn('flex h-full items-center justify-center text-sm font-medium transition-all duration-300 ease-in-out', data.payment_status === 'due' ? '-translate-x-[28%] translate-y-[28%]' : '')}>Due</p>
                        </div>
                        <MinusCircle className={cn('absolute right-2.5 top-2 h-4 w-4 text-[#cad2c5] transition-all duration-100', data.payment_status === 'due' ? '' : 'opacity-0')} aria-hidden='true' />
                      </Button>
                      <Popover open={openPartialPaymentPopover}>
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            className={cn('relative h-auto px-0 py-3 hover:bg-transparent focus-visible:outline-none focus-visible:ring-0', data.payment_status === 'partial' ? 'border-[#83c5be] outline-2' : '')}
                            onClick={() => {
                              setData('payment_status', 'partial')
                              setData('total_paid', undefined)
                              setOpenPartialPaymentPopover(true)
                            }}
                            disabled={cartItems.length === 0}
                          >
                            <div className='h-full w-full'>
                              <p className={cn('flex h-full items-center justify-center text-sm font-medium transition-all duration-300 ease-in-out', data.payment_status === 'partial' ? '-translate-x-[22%] translate-y-[28%]' : '')}>Partial</p>
                            </div>
                            <PartiallyPaidIcon className={cn('absolute right-2.5 top-2 h-4 w-4 text-[#83c5be] transition-all duration-100', data.payment_status === 'partial' ? '' : 'opacity-0')} aria-hidden='true' />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='grid gap-2'>
                          <Label>Amount</Label>
                          <Input
                            id='total_paid'
                            name='total_paid'
                            type='number'
                            value={data.total_paid}
                            className='h-8 w-36 no-spin'
                            placeholder='Amount'
                            onChange={e => {
                              if (parseFloat(e.target.value) > 0) {
                                setData('total_paid', parseFloat(e.target.value))
                              } else {
                                setData('total_paid', undefined)
                              }
                            }}
                            onKeyDown={e => {
                              const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab', 'Enter', 'Escape', 'Home', 'End', '.']

                              const input = e.target as HTMLInputElement
                              const hasDecimal = input.value.includes('.')
                              if (!/^[0-9]$/.test(e.key) && (!allowedKeys.includes(e.key) || (e.key === '.' && hasDecimal))) {
                                e.preventDefault()
                              }
                            }}
                            onKeyUp={e => {
                              if (e.key === 'Enter') {
                                setOpenPartialPaymentPopover(false)
                                clearErrors('total_paid')
                              }
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <Button
                        variant='outline'
                        className={cn('relative h-auto px-0 py-3 hover:bg-transparent', data.payment_status === 'paid' ? 'border-[#006d77] outline-2' : '')}
                        onClick={() => {
                          setData('payment_status', 'paid')
                          setTimeout(() => {
                            setData('total_paid', data.total_payable)
                          }, 100)
                          setOpenPartialPaymentPopover(false)
                          clearErrors('total_paid')
                        }}
                        disabled={cartItems.length === 0}
                      >
                        <div className='h-full w-full'>
                          <p className={cn('flex h-full items-center justify-center text-sm font-medium transition-all duration-300 ease-in-out', data.payment_status === 'paid' ? '-translate-x-[28%] translate-y-[28%]' : '')}>Paid</p>
                        </div>
                        <CheckCircleIcon className={cn('absolute right-2.5 top-2 h-4 w-4 text-[#006d77] transition-all duration-100', data.payment_status === 'paid' ? '' : 'opacity-0')} aria-hidden='true' />
                      </Button>
                    </div>
                  </FormInput>
                </CardContent>

                <CardContent className={cn('pb-0 transition-all duration-300 ease-in-out', (data.payment_method === 'mobile_banking' || data.payment_method === 'cheque') && 'pb-6')}>
                  <div ref={contentRef} className={cn('grid h-0 gap-1.5 opacity-0 transition-all duration-300 ease-in-out', (data.payment_method === 'mobile_banking' || data.payment_method === 'cheque') && 'h-auto opacity-100')}>
                    {data.payment_method === 'mobile_banking' && (
                      <>
                        <FormInput id='service_provider' label='Service Provider' errorMessage={errors.service_provider}>
                          <Select
                            name='service_provider'
                            value={data.service_provider}
                            onValueChange={value => {
                              setData(data => ({
                                ...data,
                                service_provider: value
                              }))
                              clearErrors('service_provider')
                            }}
                          >
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
                        </FormInput>

                        <div className='grid grid-cols-2 gap-2'>
                          <FormInput id='account_number' label='Account Number' errorMessage={errors.account_number}>
                            <Input value={data.account_number} onChange={handleInputChange} name='account_number' id='account_number' placeholder='+880 1XXX-XXXXXX' />
                          </FormInput>
                          <FormInput id='txn_id' label='Transaction ID' errorMessage={errors.txn_id}>
                            <Input value={data.txn_id} onChange={handleInputChange} name='txn_id' id='txn_id' placeholder='Transaction ID' />
                          </FormInput>
                        </div>
                      </>
                    )}
                    {data.payment_method === 'cheque' && (
                      <>
                        <FormInput id='bank_name' label='Bank Name' errorMessage={errors.bank_name}>
                          <Input value={data.bank_name} onChange={handleInputChange} name='bank_name' id='bank_name' placeholder='Bank name' />
                        </FormInput>
                        <FormInput id='cheque_number' label='Cheque Number' errorMessage={errors.cheque_number}>
                          <Input value={data.cheque_number} onChange={handleInputChange} name='cheque_number' id='cheque_number' placeholder='Cheque number' />
                        </FormInput>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className='lg:w-3/8'>
            <div className='grid'>
              <Card>
                <CardHeader className='lg:pb-3'>
                  <CardTitle>Order summary</CardTitle>
                  <CardDescription>Check order details, quantities, and total amount.</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className='hidden px-0 pb-0 lg:block'>
                  {data.order_variants.length > 0 ? (
                    <ScrollArea className='lg:h-[350px]'>
                      <div>
                        {cartItems.map((cartItem, index) => (
                          <div key={cartItem.variant.id}>
                            <div>
                              <CartItem data={cartItem} removeFromCart={removeFromCart} handleCartItemChange={handleCartItemChange} />
                            </div>
                            {index !== cartItems.length - 1 && <Separator />}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className='flex flex-col items-center justify-center gap-2 text-muted-foreground lg:h-[350px]'>
                      <ShoppingCartIcon className='mt-4 h-18 w-18' />
                      <span className='ml-2 text-sm font-medium'>Add items to cart.</span>
                    </div>
                  )}
                </CardContent>
                <Separator className='hidden lg:block' />
                <CardContent className={cn('mx-6 max-h-max p-0 text-xs text-muted-foreground transition-height-padding-opacity duration-500 ease-in-out', subtotal !== 0 || data.delivery_cost ? 'border-b opacity-100' : 'opacity-0')}>
                  <div className={`flex items-center justify-between overflow-hidden text-xs text-muted-foreground transition-all duration-300 ease-in-out ${subtotal !== 0 ? 'max-h-20 py-2 opacity-100' : 'max-h-0 py-0 opacity-0'}`}>
                    <Label className='transition-all duration-300'>Subtotal</Label>
                    <p className='text-sm transition-all duration-300'>{formatCurrency(subtotal)}</p>
                  </div>

                  <div className={`flex items-center justify-between overflow-hidden text-xs text-muted-foreground transition-all duration-300 ease-in-out ${data.delivery_cost ? 'max-h-20 py-2 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <Label className='transition-all duration-300'>Shipping</Label>
                    <p className='text-sm transition-all duration-300'>{formatCurrency(data.delivery_cost)}</p>
                  </div>
                </CardContent>

                <CardContent className={cn('mx-6 max-h-max p-0 text-xs transition-height-padding-opacity duration-500 ease-in-out', subtotal !== 0 && data.delivery_cost ? 'space-y-0 opacity-100' : 'space-y-4 opacity-0', data.total_paid && 'border-b')}>
                  <div className={`flex items-center justify-between overflow-hidden text-xs transition-all duration-300 ease-in-out ${subtotal !== 0 && data.delivery_cost ? 'max-h-20 py-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <Label className='text-sm transition-all duration-300'>Total Payable</Label>
                    <p className='text-sm transition-all duration-300'>{formatCurrency(data.total_payable)}</p>
                  </div>
                </CardContent>
                <CardContent className={cn('mx-6 max-h-max p-0 text-xs transition-height-padding-opacity duration-500 ease-in-out', data.total_paid ? 'space-y-0 opacity-100' : 'space-y-4 opacity-0', data.total_paid !== totalRemaining && 'border-b')}>
                  <div className={`flex items-center justify-between overflow-hidden text-xs transition-all duration-300 ease-in-out ${data.total_paid ? 'max-h-20 py-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <Label className='text-sm transition-all duration-300'>Total Paid</Label>
                    <p className='text-sm transition-all duration-300'>{formatCurrency(data.total_paid)}</p>
                  </div>
                </CardContent>
                <CardContent className={cn('mx-6 max-h-max p-0 text-xs transition-height-padding-opacity duration-500 ease-in-out', data.total_paid ? 'space-y-0 opacity-100' : 'space-y-4 opacity-0')}>
                  <div className={`flex items-center justify-between overflow-hidden text-xs transition-all duration-300 ease-in-out ${data.total_paid && data.total_paid !== data.total_payable ? 'max-h-20 py-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <Label className='text-sm transition-all duration-300'>Total Remaining</Label>
                    <p className='text-sm transition-all duration-300'>BDT {totalRemaining}</p>
                  </div>
                </CardContent>
                <CardFooter className={cn('justify-end space-x-2 pt-4 transition-all duration-300 lg:space-x-0', ((subtotal && data.delivery_cost) || data.total_paid) && 'pt-0')}>
                  <Button variant='secondary' className='rounded-sm lg:hidden'>
                    Cancel
                  </Button>
                  <Button onClick={handleAddNewOrder} className='lg:w-full' disabled={loading}>
                    {submitButtonText === 'Processing' ? (
                      <>
                        <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
                      </>
                    ) : submitButtonText === 'Failed to Place Order' ? (
                      <>
                        <AlertCircleIcon className='mr-2 h-4 w-4 text-destructive' />
                      </>
                    ) : null}
                    <span>{submitButtonText}</span>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

export default CreateOrder
