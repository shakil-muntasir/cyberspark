import { useRef, useState } from 'react'
import { Check, ChevronsUpDown, PlusIcon, Trash2Icon } from 'lucide-react'

import { Button } from '@/Components/ui/button'
import { Card, CardContent, CardHeader } from '@/Components/ui/card'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/Components/ui/command'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog'
import { Input } from '@/Components/ui/input'
import { InputNumber } from '@/Components/ui/input-number'
import { Label } from '@/Components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'

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

type PaymentStatusType = 'due' | 'partial' | 'paid'
type DeliveryOptionType = 'in-house' | 'external'
type PaymentMethodType = 'cash_on_delivery' | 'cheque' | 'mobile_banking'

const MakeSell = () => {
  const [openProductPopover, setOpenProductPopover] = useState(false)
  const [openDeliveryManPopover, setOpenDeliveryManPopover] = useState(false)
  const [openPartialPaymentPopover, setOpenPartialPaymentPopover] = useState(false)
  const [value, setValue] = useState('')
  const [activePaymentStatus, setActivePaymentStatus] = useState<PaymentStatusType>('due')
  const [activePaymentMethod, setActivePaymentMethod] = useState<PaymentMethodType>('cash_on_delivery')
  const [activeDeliveryMethod, setActiveDeliveryMethod] = useState<DeliveryOptionType>('in-house')
  const [partialPaymentAmount, setPartialPaymentAmount] = useState('')
  const commandSourceRef = useRef<HTMLDivElement>(null)

  const frameworks = [
    {
      value: 'next.js',
      label: 'Next.js'
    },
    {
      value: 'sveltekit',
      label: 'SvelteKit'
    },
    {
      value: 'nuxt.js',
      label: 'Nuxt.js'
    },
    {
      value: 'remix',
      label: 'Remix'
    },
    {
      value: 'astro',
      label: 'Astro'
    }
  ]

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
      <DialogContent className='h-screen max-w-7xl gap-2.5 overflow-y-auto bg-primary-foreground px-5 pb-6 pt-4 lg:h-auto'>
        <DialogHeader className='space-y-0'>
          <DialogTitle className='text-xl'>Sell Product</DialogTitle>
          <DialogDescription>Please fill out this form to sell a product.</DialogDescription>
        </DialogHeader>
        <Separator />
        <div className='flex flex-col pt-3 lg:flex-row'>
          <div className='w-full'>
            {/* WARNING: this div below is used to calculate the width for command dropdown */}
            <div ref={commandSourceRef} />
            <div className='grid gap-2'>
              <Label htmlFor='product'>Product</Label>
              <Popover open={openProductPopover} onOpenChange={setOpenProductPopover}>
                <PopoverTrigger asChild>
                  <Button id='product' variant='outline' role='combobox' className='w-full items-center justify-between px-3'>
                    <div className='flex flex-wrap justify-start gap-2 font-normal'>{value ? frameworks.find(framework => framework.value === value)?.label : 'Select Product...'}</div>
                    <div className='flex items-center self-center'>
                      <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className={`p-0`} style={{ width: commandSourceRef.current?.offsetWidth ?? 'auto' }} align='end'>
                  <Command>
                    <CommandInput placeholder='Search Product...' />
                    <CommandList>
                      <CommandEmpty>No product found.</CommandEmpty>
                      <CommandGroup>
                        {frameworks.map(framework => (
                          <CommandItem
                            key={framework.value}
                            value={framework.value}
                            onSelect={currentValue => {
                              setValue(currentValue === value ? '' : currentValue)
                              setOpenProductPopover(false)
                            }}
                            className='flex justify-between'
                          >
                            {framework.label}
                            <Check className={cn('h-4 w-4', value === framework.value ? 'opacity-100' : 'opacity-0')} />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
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
          <Separator className='mb-4 lg:hidden' />
          <div className='w-full'>
            <div className='space-y-5'>
              <div className='grid gap-2'>
                <Label htmlFor='payment_status' className='h-3.5'>
                  Payment Status
                </Label>
                <RadioGroup defaultValue='due' className='grid grid-cols-3' id='payment_status'>
                  <Card
                    className={cn('relative cursor-pointer', activePaymentStatus === 'due' ? 'border-[#cad2c5] outline-2' : '')}
                    onClick={() => {
                      setActivePaymentStatus('due')
                      setPartialPaymentAmount('')
                      setOpenPartialPaymentPopover(false)
                    }}
                  >
                    <CardContent className='h-full px-0 py-3'>
                      <p className={cn('flex h-full items-center justify-center text-sm font-medium transition-all duration-300 ease-in-out', activePaymentStatus === 'due' ? '-translate-x-[28%] translate-y-[28%]' : '')}>Due</p>
                    </CardContent>
                    <RadioGroupItem asChild className='hidden' value='due' />
                    <MinusCircle className={cn('absolute right-2.5 top-2 h-4 w-4 text-[#cad2c5] transition-all duration-100', activePaymentStatus === 'due' ? '' : 'opacity-0')} aria-hidden='true' />
                  </Card>
                  <Popover open={openPartialPaymentPopover}>
                    <PopoverTrigger asChild>
                      <Card
                        className={cn('relative cursor-pointer', activePaymentStatus === 'partial' ? 'border-[#83c5be] outline-2' : '')}
                        onClick={() => {
                          setActivePaymentStatus('partial')
                          setOpenPartialPaymentPopover(true)
                        }}
                      >
                        <CardContent className='h-full px-0 py-3'>
                          <p className={cn('flex h-full items-center justify-center text-sm font-medium transition-all duration-300 ease-in-out', activePaymentStatus === 'partial' ? '-translate-x-[22%] translate-y-[28%]' : '')}>Partial</p>
                        </CardContent>
                        <RadioGroupItem asChild className='hidden' value='partial' />
                        <PartiallyPaidIcon className={cn('absolute right-2.5 top-2 h-4 w-4 text-[#83c5be] transition-all duration-100', activePaymentStatus === 'partial' ? '' : 'opacity-0')} aria-hidden='true' />
                      </Card>
                    </PopoverTrigger>
                    <PopoverContent className='grid gap-2' onCloseAutoFocus={e => e.preventDefault()}>
                      <Label>Partial amount</Label>
                      <InputNumber
                        id=''
                        name=''
                        className='h-8 w-36'
                        placeholder=''
                        onEnterPress={e => {
                          setPartialPaymentAmount(e.target.value)
                          setOpenPartialPaymentPopover(false)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <Card
                    className={cn('relative cursor-pointer', activePaymentStatus === 'paid' ? 'border-[#006d77] outline-2' : '')}
                    onClick={() => {
                      setActivePaymentStatus('paid')
                      setPartialPaymentAmount('')
                      setOpenPartialPaymentPopover(false)
                    }}
                  >
                    <CardContent className='h-full px-0 py-3'>
                      <p className={cn('flex h-full items-center justify-center text-sm font-medium transition-all duration-300 ease-in-out', activePaymentStatus === 'paid' ? '-translate-x-[28%] translate-y-[28%]' : '')}>Paid</p>
                    </CardContent>
                    <RadioGroupItem asChild className='hidden' value='paid' />
                    <CheckCircleIcon className={cn('absolute right-2.5 top-2 h-4 w-4 text-[#006d77] transition-all duration-100', activePaymentStatus === 'paid' ? '' : 'opacity-0')} aria-hidden='true' />
                  </Card>
                </RadioGroup>
              </div>
              <div className='grid gap-2'>
                <Label className=''>Payment Method</Label>
                <RadioGroup defaultValue='cash_on_delivery' value={activePaymentMethod}>
                  <Card>
                    <CardContent className='flex h-18 p-0'>
                      <Button variant='ghost' className={cn('flex h-full w-1/3 items-end justify-start rounded-r-none pb-2.5', activePaymentMethod === 'cash_on_delivery' ? 'bg-accent' : '')} onClick={() => setActivePaymentMethod('cash_on_delivery')}>
                        <RadioGroupItem asChild className='hidden' value='cash_on_delivery' id='cash_on_delivery' />
                        <div className={cn('space-y-0.5 transition-all duration-200', activePaymentMethod === 'cash_on_delivery' ? 'text-[#70a288]' : '')}>
                          <CashIcon className='h-5 w-5' />
                          <p className='text-sm font-medium tracking-tighter'>On Delivery</p>
                        </div>
                      </Button>
                      <Button variant='ghost' className={cn('flex h-full w-1/3 items-end justify-start rounded-none border-x pb-2.5', activePaymentMethod === 'mobile_banking' ? 'bg-accent' : '')} onClick={() => setActivePaymentMethod('mobile_banking')}>
                        <RadioGroupItem asChild className='hidden' value='mobile_banking' id='mobile_banking' />
                        <div className={cn('space-y-0.5 transition-all duration-200', activePaymentMethod === 'mobile_banking' ? 'text-[#dab785]' : '')}>
                          <MobileBankingIcon className='h-5 w-5' />
                          <p className='text-sm font-medium tracking-tighter'>Mobile Banking</p>
                        </div>
                      </Button>
                      <Button variant='ghost' className={cn('flex h-full w-1/3 items-end justify-start rounded-l-none pb-2.5', activePaymentMethod === 'cheque' ? 'bg-accent' : '')} onClick={() => setActivePaymentMethod('cheque')}>
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
                  <Card className={cn('relative cursor-pointer', activeDeliveryMethod === 'in-house' ? 'border-[#6096ba] outline-2' : '')} onClick={() => setActiveDeliveryMethod('in-house')}>
                    <CardHeader className='space-y-0 px-4 py-3.5'>
                      <p className='text-sm font-medium'>In House</p>
                      <p className='text-sm tracking-tight text-muted-foreground'>4–10 business days</p>
                    </CardHeader>
                    <CardContent className='px-4 pb-3.5'>
                      <p className='text-sm font-medium'>$5.00</p>
                    </CardContent>
                    <RadioGroupItem asChild className='hidden' value='standard' />
                    <CheckCircleIcon className={cn('absolute right-3 top-3 h-4 w-4 text-[#6096ba] transition-all duration-100', activeDeliveryMethod === 'in-house' ? '' : 'opacity-0')} aria-hidden='true' />
                  </Card>
                  <Card className={cn('relative cursor-pointer', activeDeliveryMethod === 'external' ? 'border-[#81c3d7] outline-2' : '')} onClick={() => setActiveDeliveryMethod('external')}>
                    <CardHeader className='space-y-0 px-4 py-3.5'>
                      <p className='text-sm font-medium'>External</p>
                      <p className='text-sm tracking-tight text-muted-foreground'>2–5 business days</p>
                    </CardHeader>
                    <CardContent className='px-4 pb-3.5'>
                      <p className='text-sm font-medium'>$16.00</p>
                    </CardContent>
                    <RadioGroupItem asChild className='hidden' value='express' id='express' />
                    <CheckCircleIcon className={cn('absolute right-3 top-3 h-4 w-4 text-[#81c3d7] transition-all duration-100', activeDeliveryMethod === 'external' ? '' : 'opacity-0')} aria-hidden='true' />
                  </Card>
                </RadioGroup>
              </div>
              {activeDeliveryMethod === 'in-house' ? (
                <div className='grid gap-2'>
                  <Label htmlFor='delivery_man'>Delivery Man</Label>
                  <Popover open={openDeliveryManPopover} onOpenChange={setOpenDeliveryManPopover}>
                    <PopoverTrigger asChild>
                      <Button id='delivery_man' variant='outline' role='combobox' className='w-full items-center justify-between px-3'>
                        <div className='font-normal'>{value ? frameworks.find(framework => framework.value === value)?.label : 'Select Delivery Man...'}</div>
                        <div className='flex items-center self-center'>
                          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='p-0' style={{ width: commandSourceRef.current?.offsetWidth ?? 'auto' }} align='end'>
                      <Command>
                        <CommandInput placeholder='Search Delivery Man...' />
                        <CommandList>
                          <CommandEmpty>No delivery man found.</CommandEmpty>
                          <CommandGroup>
                            {frameworks.map(framework => (
                              <CommandItem
                                key={framework.value}
                                value={framework.value}
                                onSelect={currentValue => {
                                  setValue(currentValue === value ? '' : currentValue)
                                  setOpenDeliveryManPopover(false)
                                }}
                                className='flex justify-between'
                              >
                                {framework.label}
                                <Check className={cn('h-4 w-4', value === framework.value ? 'opacity-100' : 'opacity-0')} />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              ) : (
                <div className='grid gap-2'>
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
          <Separator className='mb-4 mt-2 lg:mb-6 lg:mt-0 lg:hidden' />
          <div className='flex w-full flex-col justify-between space-y-2.5'>
            <div className='grid gap-2'>
              <Label>Order Summary</Label>
              <Card>
                <ScrollArea className='lg:h-[320px]'>
                  <CardContent className='flex justify-between p-4'>
                    <div className='flex gap-4'>
                      <img className='h-20 w-14 rounded-md object-cover' src='https://5.imimg.com/data5/ANDROID/Default/2021/7/KU/YI/VT/44196072/product-jpeg.jpg' />
                      <div className='flex flex-col justify-between'>
                        <div>
                          <Label>Basic Tee</Label>
                          <div className='flex'>
                            <p className='border-r pr-2 text-sm tracking-tight text-muted-foreground'>White</p>
                            <p className='pl-2 text-sm tracking-tight text-muted-foreground'>Large</p>
                          </div>
                        </div>
                        <p className='text-sm font-medium'>$32.00</p>
                      </div>
                    </div>
                    <div className='flex flex-col items-end justify-between'>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <Button type='button' variant='ghost' size='icon' className='group h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'>
                              <Trash2Icon className='h-4 w-4 text-destructive group-hover:text-red-700' />
                              <span className='sr-only'>Remove</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <InputNumber className='h-8 w-18' id='quantity' name='quantity' value='1' onChange={() => null} />
                    </div>
                  </CardContent>
                  <Separator />
                  <CardContent className='flex justify-between p-4'>
                    <div className='flex gap-4'>
                      <img className='h-20 w-14 rounded-md' src='https://files.cdn.printful.com/o/upload/bfl-image/0f/10334_l_tech%20t-shirt.jpg' />
                      <div className='flex flex-col justify-between'>
                        <div>
                          <Label>Printed Tee</Label>
                          <div className='flex'>
                            <p className='border-r pr-2 text-sm tracking-tight text-muted-foreground'>Black</p>
                            <p className='pl-2 text-sm tracking-tight text-muted-foreground'>Large</p>
                          </div>
                        </div>
                        <p className='text-sm font-medium'>$45.00</p>
                      </div>
                    </div>
                    <div className='flex flex-col items-end justify-between'>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <Button type='button' variant='ghost' size='icon' className='group h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'>
                              <Trash2Icon className='h-4 w-4 text-destructive group-hover:text-red-700' />
                              <span className='sr-only'>Remove</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <InputNumber className='h-8 w-18' id='quantity' name='quantity' value='1' onChange={() => null} />
                    </div>
                  </CardContent>
                  <Separator />
                  <CardContent className='flex justify-between p-4'>
                    <div className='flex gap-4'>
                      <img className='h-20 w-14 rounded-md' src='https://tailwindui.com/img/ecommerce-images/checkout-page-02-product-02.jpg' />
                      <div className='flex flex-col justify-between'>
                        <div>
                          <Label>Basic Tee</Label>
                          <div className='flex'>
                            <p className='border-r pr-2 text-sm tracking-tight text-muted-foreground'>Beige</p>
                            <p className='pl-2 text-sm tracking-tight text-muted-foreground'>Large</p>
                          </div>
                        </div>
                        <p className='text-sm font-medium'>$32.00</p>
                      </div>
                    </div>
                    <div className='flex flex-col items-end justify-between'>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <Button type='button' variant='ghost' size='icon' className='group h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'>
                              <Trash2Icon className='h-4 w-4 text-destructive group-hover:text-red-700' />
                              <span className='sr-only'>Remove</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <InputNumber className='h-8 w-18' id='quantity' name='quantity' value='1' onChange={() => null} />
                    </div>
                  </CardContent>
                  <Separator />
                  <CardContent className='flex justify-between p-4'>
                    <div className='flex gap-4'>
                      <img className='h-20 w-14 rounded-md' src='https://tailwindui.com/img/ecommerce-images/checkout-page-02-product-02.jpg' />
                      <div className='flex flex-col justify-between'>
                        <div>
                          <Label>Basic Tee</Label>
                          <div className='flex'>
                            <p className='border-r pr-2 text-sm tracking-tight text-muted-foreground'>Beige</p>
                            <p className='pl-2 text-sm tracking-tight text-muted-foreground'>Large</p>
                          </div>
                        </div>
                        <p className='text-sm font-medium'>$32.00</p>
                      </div>
                    </div>
                    <div className='flex flex-col items-end justify-between'>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <Button type='button' variant='ghost' size='icon' className='group h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'>
                              <Trash2Icon className='h-4 w-4 text-destructive group-hover:text-red-700' />
                              <span className='sr-only'>Remove</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <InputNumber className='h-8 w-18' id='quantity' name='quantity' value='1' onChange={() => null} />
                    </div>
                  </CardContent>
                </ScrollArea>
                <Separator />
                <CardContent className='space-y-2 py-2 text-xs'>
                  <div className='flex items-center justify-between'>
                    <Label className='text-xs'>Subtotal</Label>
                    <p className='font-semibold'>$64.00</p>
                  </div>
                  <div className='flex items-center justify-between'>
                    <Label className='text-xs'>Shipping</Label>
                    <p className='font-semibold'>$5.00</p>
                  </div>
                  <div className='flex items-center justify-between'>
                    <Label className='text-xs'>Taxes</Label>
                    <p className='font-semibold'>$5.42</p>
                  </div>
                </CardContent>
                <Separator />
                <CardContent className='py-1.5'>
                  <div className='flex items-center justify-between'>
                    <Label className='text-sm'>Total Payable</Label>
                    <p className='text-sm font-semibold'>$5.42</p>
                  </div>
                </CardContent>
                <Separator />
                <CardContent className='py-1.5'>
                  <div className='flex items-center justify-between'>
                    <Label className='text-sm'>Total Paid</Label>
                    <p className='text-sm font-semibold'>{partialPaymentAmount !== '' ? formatCurrency(partialPaymentAmount) : '$0.00'}</p>
                  </div>
                </CardContent>
                <Separator />
                <CardContent className='py-1.5'>
                  <div className='flex items-center justify-between'>
                    <Label className='text-sm'>Total Remaining</Label>
                    <p className='text-sm font-semibold'>$5.42</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className='flex justify-end gap-2'>
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
