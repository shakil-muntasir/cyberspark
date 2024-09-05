import { useEffect, useState } from 'react'
import { PlusIcon, ShoppingCartIcon } from 'lucide-react'

import { Button } from '@/Components/ui/button'
import { Card, CardContent } from '@/Components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog'
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
import { Textarea } from '@/Components/ui/textarea'
import { BkashIcon } from '@/Icons/BkashIcon'
import { RocketIcon } from '@/Icons/RocketIcon'
import { NagadIcon } from '@/Icons/NagadIcon'
import { UpayIcon } from '@/Icons/UpayIcon'
import ProductSelectList from '@/Components/ProductSelectList'
import { CartItem as CartItemType, ProductVariant } from '@/Pages/Product/types'
import CartItem from '@/Components/CartItem'

type PaymentStatusType = 'due' | 'partial' | 'paid'
type DeliveryOptionType = 'in-house' | 'external'
type PaymentMethodType = 'cash_on_delivery' | 'cheque' | 'mobile_banking'

const MakeSell = () => {
  const [openPartialPaymentPopover, setOpenPartialPaymentPopover] = useState(false)
  const [activePaymentStatus, setActivePaymentStatus] = useState<PaymentStatusType | undefined>('due')
  const [activePaymentMethod, setActivePaymentMethod] = useState<PaymentMethodType | undefined>('cash_on_delivery')
  const [activeDeliveryMethod, setActiveDeliveryMethod] = useState<DeliveryOptionType | undefined>()
  const [partialPaymentAmount, setPartialPaymentAmount] = useState(0)
  const [cartItems, setCartItems] = useState<CartItemType[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [totalPayable, setTotalPayable] = useState(0)
  const [totalRemaining, setTotalRemaining] = useState(0)
  const [deliveryCost, setDeliveryCost] = useState<number>(() => {
    return activeDeliveryMethod === 'in-house' ? 60 : activeDeliveryMethod === 'external' ? 100 : 0
  })

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
    <Dialog>
      <DialogTrigger asChild>
        <Button className='group fixed bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full font-medium transition-all duration-500 hover:w-36 hover:bg-foreground'>
          <span className='z-20 inline-block max-w-0 -translate-x-3.5 overflow-hidden opacity-0 transition-all duration-700 group-hover:max-w-xs group-hover:opacity-100'>Make a Sell</span>
          <PlusIcon className='delay-50 fixed right-5 h-12 w-12 transform rounded-full bg-foreground p-3 text-primary-foreground transition-transform duration-500 group-hover:rotate-180' />
        </Button>
      </DialogTrigger>
      <DialogContent className='h-screen max-w-7xl gap-2.5 overflow-y-auto p-6 lg:h-auto lg:px-5 lg:pb-6 lg:pt-4'>
        <DialogHeader className='space-y-0'>
          <DialogTitle className='text-xl'>Sell Product</DialogTitle>
          <DialogDescription>Please fill out this form to sell a product.</DialogDescription>
        </DialogHeader>
        <Separator />
        <div className='flex flex-col pt-3 lg:flex-row'>
          <div className='w-full'>
            <ProductSelectList id='products' label='Products' handleAddToCart={handleAddToCart} />
            {/* for mobile view only */}
            {cartItems.length > 0 && (
              <div className='grid lg:hidden'>
                <Separator className='my-4' />
                <div className='flex flex-col gap-2'>
                  <Label>Cart Items</Label>
                  <Card>
                    <CardContent className='p-0'>
                      {cartItems.map((cartItem, index) => (
                        <div key={cartItem.variant.id}>
                          <CartItem data={cartItem} removeFromCart={removeFromCart} />
                          {index !== cartItems.length - 1 && <Separator />}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            <Separator className='my-4' />
            <div className='space-y-5'>
              <div className='grid gap-2'>
                <Label htmlFor='name'>Customer Name</Label>
                <Input id='name' type='text' name='name' placeholder='Name' />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='name'>Phone</Label>
                <Input id='name' type='text' name='name' placeholder='+880 1XXX-XXXXXX' />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='name'>Email</Label>
                <Input id='name' type='text' name='name' placeholder='Email' />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='name'>Address</Label>
                <Textarea id='name' name='name' placeholder='Address' />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='name'>City</Label>
                <Input id='name' type='text' name='name' placeholder='City' />
              </div>
              <div className='flex space-x-2'>
                <div className='w-1/2'>
                  <div className='grid gap-2'>
                    <Label htmlFor='state'>State</Label>
                    <Select name='state'>
                      <SelectTrigger id='state'>
                        <SelectValue placeholder='Select State' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value='admin'>Admin</SelectItem>
                          <SelectItem value='sales_rep'>Sales Representative</SelectItem>
                          <SelectItem value='customer'>Customer</SelectItem>
                          <SelectItem value='delivery_man'>Delivery-Man</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className='w-1/2'>
                  <div className='grid gap-2'>
                    <Label htmlFor='zip'>Zip</Label>
                    <Input id='zip' placeholder='Zip' />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Separator orientation='vertical' className='mx-6 hidden lg:block' />
          <Separator className='my-4 lg:hidden' />
          <div className='w-full'>
            <div className='space-y-5'>
              <div className='grid gap-2'>
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
              </div>
              <div className='grid gap-2'>
                <Label className=''>Payment Method</Label>
                <RadioGroup defaultValue='cash_on_delivery' value={activePaymentMethod}>
                  <Card>
                    <CardContent className='flex h-18 p-0'>
                      <Button variant='ghost' className={cn('flex h-full w-1/3 items-end justify-start rounded-r-none pb-2.5', activePaymentMethod === 'cash_on_delivery' ? 'bg-accent' : '')} onClick={() => setActivePaymentMethod('cash_on_delivery')} disabled={cartItems.length === 0}>
                        <RadioGroupItem asChild className='hidden' value='cash_on_delivery' id='cash_on_delivery' />
                        <div className={cn('space-y-0.5 transition-all duration-200', activePaymentMethod === 'cash_on_delivery' ? 'text-[#70a288]' : '')}>
                          <CashIcon className='h-5 w-5' />
                          <p className='text-sm font-medium tracking-tighter'>On Delivery</p>
                        </div>
                      </Button>
                      <Button variant='ghost' className={cn('flex h-full w-1/3 items-end justify-start rounded-none border-x pb-2.5', activePaymentMethod === 'mobile_banking' ? 'bg-accent' : '')} onClick={() => setActivePaymentMethod('mobile_banking')} disabled={cartItems.length === 0}>
                        <RadioGroupItem asChild className='hidden' value='mobile_banking' id='mobile_banking' />
                        <div className={cn('space-y-0.5 transition-all duration-200', activePaymentMethod === 'mobile_banking' ? 'text-[#dab785]' : '')}>
                          <MobileBankingIcon className='h-5 w-5' />
                          <p className='text-sm font-medium tracking-tighter'>Mobile Banking</p>
                        </div>
                      </Button>
                      <Button variant='ghost' className={cn('flex h-full w-1/3 items-end justify-start rounded-l-none pb-2.5', activePaymentMethod === 'cheque' ? 'bg-accent' : '')} onClick={() => setActivePaymentMethod('cheque')} disabled={cartItems.length === 0}>
                        <RadioGroupItem asChild className='hidden' value='cheque' id='cheque' />
                        <div className={cn('space-y-0.5 transition-all duration-200', activePaymentMethod === 'cheque' ? 'text-[#d5896f]' : '')}>
                          <ChequeIcon className='h-5 w-5' />
                          <p className='text-sm font-medium tracking-tighter'>Cheque</p>
                        </div>
                      </Button>
                    </CardContent>
                  </Card>
                </RadioGroup>
              </div>
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
            <Separator className='my-4' />
            <div className='space-y-5'>
              <div className='grid gap-2'>
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
                        <p className='text-sm tracking-tight text-muted-foreground'>4–10 business days</p>
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
                        <p className='text-sm tracking-tight text-muted-foreground'>2–5 business days</p>
                      </div>
                      <div className='pb-3.5'>
                        <p className='text-sm font-medium'>{formatCurrency(100)}</p>
                      </div>
                    </div>
                    <RadioGroupItem asChild className='hidden' value='express' id='express' />
                    <CheckCircleIcon className={cn('absolute right-3 top-3 h-4 w-4 text-[#81c3d7] transition-all duration-100', activeDeliveryMethod === 'external' ? '' : 'opacity-0')} aria-hidden='true' />
                  </Button>
                </RadioGroup>
              </div>
              {activeDeliveryMethod === 'in-house' ? (
                <ProductSelectList id='delivery_man' label='Delivery Man' handleAddToCart={() => null} />
              ) : (
                <div className='grid gap-2 pt-px'>
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
                </div>
              )}
            </div>
          </div>
          <Separator orientation='vertical' className='mx-6 hidden lg:block' />
          <Separator className='my-4 lg:mb-6 lg:mt-0 lg:hidden' />
          <div className='flex w-full flex-col justify-between'>
            <div className='hidden gap-2 lg:grid'>
              <Label>Order Summary</Label>
              <Card className=''>
                <CardContent className='hidden p-0 lg:block'>
                  {cartItems.length > 0 ? (
                    <ScrollArea className='lg:h-[310px]'>
                      {cartItems.map((cartItem, index) => (
                        <div key={cartItem.variant.id}>
                          <CartItem data={cartItem} removeFromCart={removeFromCart} />
                          {index !== cartItems.length - 1 && <Separator />}
                        </div>
                      ))}
                    </ScrollArea>
                  ) : (
                    <div className='flex flex-col items-center justify-center gap-2 text-muted-foreground lg:h-[310px]'>
                      <ShoppingCartIcon className='mt-8 h-18 w-18' />
                      <span className='ml-2 text-sm font-medium'>Add items to cart.</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className='flex flex-col gap-1 lg:px-1.5 lg:pt-1'>
              <span className='space-y-2 pb-2 text-sm'>
                <div className='flex items-center justify-between'>
                  <Label>Subtotal</Label>
                  <p className='text-sm font-semibold'>{formatCurrency(subtotal)}</p>
                </div>
                <div className='flex items-center justify-between'>
                  <Label>Shipping</Label>
                  <p className='text-sm font-semibold'>{formatCurrency(deliveryCost)}</p>
                </div>
              </span>
              <Separator />
              <span className='py-1.5'>
                <div className='flex items-center justify-between'>
                  <Label className='text-sm'>Total Payable</Label>
                  <p className='text-sm font-semibold'>{formatCurrency(totalPayable)}</p>
                </div>
              </span>
              <Separator />
              <span className='py-1.5'>
                <div className='flex items-center justify-between'>
                  <Label className='text-sm'>Total Paid</Label>
                  <p className='text-sm font-semibold'>{formatCurrency(partialPaymentAmount)}</p>
                </div>
              </span>
              <Separator />
              <span className='py-1.5'>
                <div className='flex items-center justify-between'>
                  <Label className='text-sm'>Total Remaining</Label>
                  <p className='text-sm font-semibold'>{formatCurrency(totalRemaining)}</p>
                </div>
              </span>
            </div>
            <div className='mt-6 flex justify-end gap-2 lg:mt-0'>
              <Button variant='secondary' className='lg:hidden'>
                Cancel
              </Button>
              <Button className='lg:w-full'>Confirm order</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MakeSell
