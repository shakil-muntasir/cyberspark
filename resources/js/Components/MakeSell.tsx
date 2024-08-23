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
import { Separator } from '@/Components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'

import { cn } from '@/Lib/utils'
import { CircleCheck } from '@/Icons/CircleCheck'

const MakeSell = () => {
  const [openProductPopover, setOpenProductPopover] = useState(false)
  const [openDeliveryManPopover, setOpenDeliveryManPopover] = useState(false)
  const [value, setValue] = useState('')
  const [activeRadioItem, setActiveRadioItem] = useState('standard')
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

  {
    /* TODO: add animated sell button, turn radiobox to toggle, add payment methods*/
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='fixed bottom-5 right-5 flex items-center justify-center h-12 w-12 hover:w-36 font-medium rounded-full transition-all duration-500 group hover:bg-foreground'>
          <span className='inline-block max-w-0 overflow-hidden transition-all duration-500 group-hover:max-w-xs -translate-x-3.5'>Make a Sell</span>
          <PlusIcon className='fixed right-5 rounded-full bg-foreground transform transition-transform duration-500 group-hover:rotate-180 p-3 h-12 w-12' />
        </Button>
      </DialogTrigger>
      <DialogContent className='flex-1 max-w-7xl bg-primary-foreground h-screen lg:h-auto overflow-y-auto'>
        <DialogHeader className='space-y-0'>
          <DialogTitle className='text-xl'>Sell Product</DialogTitle>
          <DialogDescription>Please fill out this form to sell a product.</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col lg:flex-row'>
          <div className='w-full'>
            {/* WARNING: this div below is used to calculate the width for command dropdown */}
            <div className='pt-px' ref={commandSourceRef} />
            <div className='flex flex-col gap-4'>
              <Label className='text-lg'>Product Information</Label>
              <div className='flex flex-col gap-2'>
                <Popover open={openProductPopover} onOpenChange={setOpenProductPopover}>
                  <Label htmlFor='product'>Product</Label>
                  <PopoverTrigger asChild>
                    <Button id='product' variant='outline' role='combobox' className='justify-between'>
                      {value ? frameworks.find(framework => framework.value === value)?.label : 'Select product...'}
                      <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className={`p-0`} style={{ width: commandSourceRef.current?.offsetWidth ?? 'auto' }} align='end'>
                    <Command>
                      <CommandInput placeholder='Search product...' />
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
                            >
                              <Check className={cn('mr-2 h-4 w-4', value === framework.value ? 'opacity-100' : 'opacity-0')} />
                              {framework.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <p className='h-4'></p>
              </div>
            </div>
            <Separator className='mb-4 lg:mb-6 lg:mt-2 ' />
            <div className='flex flex-col gap-4'>
              <Label className='text-lg'>Customer information</Label>
              <div>
                <div className='space-y-2'>
                  <Label htmlFor='name'>Name</Label>
                  <Input id='name' placeholder='Name' />
                  <p className='h-4'></p>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='address'>Address</Label>
                  <Input id='address' placeholder='Address' />
                  <p className='h-4'></p>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='city'>City</Label>
                  <Input id='city' placeholder='City' />
                  <p className='h-4'></p>
                </div>
                <div className='flex space-x-2'>
                  <div className='w-1/2 space-y-2'>
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
                    <p className='h-4'></p>
                  </div>
                  <div className='w-1/2 space-y-2'>
                    <Label htmlFor='zip'>Zip</Label>
                    <Input id='zip' placeholder='Zip' />
                    <p className='h-4'></p>
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='zip'>Phone</Label>
                  <Input id='zip' placeholder='Phone' />
                  <p className='h-4'></p>
                </div>
              </div>
            </div>
          </div>
          <Separator orientation='vertical' className='mx-6 hidden lg:block' />
          <Separator className='lg:hidden mb-4' />
          <div className='w-full'>
            <div className='flex flex-col'>
              <Label className='text-lg mb-4'>Payment</Label>
              <div className='space-y-2'>
                <Label>Card number</Label>
                <Input id='card_number' placeholder='Card number' />
                <p className='h-4'></p>
              </div>
              <div className='space-y-2'>
                <Label>Owner name</Label>
                <Input id='owner_name' placeholder='Owner name' />
                <p className='h-4'></p>
              </div>
              <div className='flex gap-2'>
                <div className='space-y-2 w-11/12'>
                  <Label>Expiration date</Label>
                  <Input id='name' placeholder='(MM/YY)' />
                  <p className='h-4'></p>
                </div>
                <div className='space-y-2'>
                  <Label>CVC</Label>
                  <Input id='cvc' placeholder='CVC' />
                  <p className='h-4'></p>
                </div>
              </div>
            </div>
            <Separator className='mb-4 lg:mb-6 lg:mt-2' />
            <div className='space-y-6'>
              <Label className='text-lg'>Delivery method</Label>
              <RadioGroup defaultValue='standard' value={activeRadioItem} className='grid grid-cols-2 mb-2'>
                <Card className={cn('relative cursor-pointer', activeRadioItem === 'standard' ? 'outline-2 border-blue-500' : '')} onClick={() => setActiveRadioItem('standard')}>
                  <CardHeader className='space-y-0'>
                    <p className='text-sm font-medium'>Standard</p>
                    <p className='text-sm text-muted-foreground tracking-tight'>4–10 business days</p>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm font-medium'>$5.00</p>
                  </CardContent>
                  <RadioGroupItem className='absolute top-4 right-4 opacity-0 z-10' value='standard' />
                  <CircleCheck className={cn('absolute top-4 right-4 text-blue-500 transition-all duration-100', activeRadioItem === 'standard' ? '' : 'opacity-0')} aria-hidden='true' />
                </Card>
                <Card className={cn('relative cursor-pointer', activeRadioItem === 'express' ? 'outline-2 border-blue-500' : '')} onClick={() => setActiveRadioItem('express')}>
                  <CardHeader className='space-y-0'>
                    <p className='text-sm font-medium'>Express</p>
                    <p className='text-sm text-muted-foreground tracking-tight'>2–5 business days</p>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm font-medium'>$16.00</p>
                  </CardContent>
                  <RadioGroupItem className='absolute top-4 right-4 opacity-0 z-10' value='express' id='express' />
                  <CircleCheck className={cn('absolute top-4 right-4 text-blue-500 transition-all duration-100', activeRadioItem === 'express' ? '' : 'opacity-0')} aria-hidden='true' />
                </Card>
              </RadioGroup>
              <div className='flex flex-col'>
                <Label htmlFor='delivery_man'>Delivery Man</Label>
                <Popover open={openDeliveryManPopover} onOpenChange={setOpenDeliveryManPopover}>
                  <PopoverTrigger asChild>
                    <Button id='delivery_man' variant='outline' role='combobox' className='justify-between mt-2'>
                      {value ? frameworks.find(framework => framework.value === value)?.label : 'Search delivery man...'}
                      <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='p-0 ' style={{ width: commandSourceRef.current?.offsetWidth ?? 'auto' }} align='end'>
                    <Command>
                      <CommandInput placeholder='Search delivery man...' />
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
                            >
                              <Check className={cn('mr-2 h-4 w-4', value === framework.value ? 'opacity-100' : 'opacity-0')} />
                              {framework.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <p className='h-4'></p>
              </div>
            </div>
          </div>
          <Separator orientation='vertical' className='mx-6 hidden lg:block' />
          <Separator className='lg:hidden mb-4 mt-2 lg:mt-0 lg:mb-6' />
          <div className='w-full flex flex-col justify-between space-y-6'>
            <div className='space-y-4'>
              <div>
                <Label className='text-lg'>Order summary</Label>
                <p className='text-sm text-muted-foreground'>Please confirm the information to sell a product.</p>
              </div>
              <Card>
                <CardContent className='py-6 flex justify-between'>
                  <div className='flex gap-4'>
                    <img className='rounded-md h-28 w-20' src='https://5.imimg.com/data5/ANDROID/Default/2021/7/KU/YI/VT/44196072/product-jpeg.jpg' />
                    <div className='flex flex-col justify-between'>
                      <div>
                        <Label>Basic Tee</Label>
                        <p className='text-sm text-muted-foreground tracking-tight'>Black</p>
                        <p className='text-sm text-muted-foreground tracking-tight'>Large</p>
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
                    <InputNumber className='w-16' id='quantity' name='quantity' value='1' onChange={() => null}></InputNumber>
                  </div>
                </CardContent>
                <Separator />
                <CardContent className='py-6 flex justify-between'>
                  <div className='flex gap-4'>
                    <img className='rounded-md h-28 w-20' src='https://files.cdn.printful.com/o/upload/bfl-image/0f/10334_l_tech%20t-shirt.jpg' />
                    <div className='flex flex-col justify-between'>
                      <div>
                        <Label>Basic Tee</Label>
                        <p className='text-sm text-muted-foreground tracking-tight'>Black</p>
                        <p className='text-sm text-muted-foreground tracking-tight'>Large</p>
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
                    <InputNumber className='w-16' id='quantity' name='quantity' value='1' onChange={() => null}></InputNumber>
                  </div>
                </CardContent>
                <Separator />
                <CardContent className='py-6 space-y-6'>
                  <div className='flex items-center justify-between'>
                    <Label className='font-medium'>Subtotal</Label>
                    <p className='text-sm'>$64.00</p>
                  </div>
                  <div className='flex items-center justify-between'>
                    <Label className='font-medium'>Shipping</Label>
                    <p className='text-sm'>$5.00</p>
                  </div>
                  <div className='flex items-center justify-between'>
                    <Label className='font-medium'>Taxes</Label>
                    <p className='text-sm'>$5.42</p>
                  </div>
                </CardContent>
                <Separator />
                <CardContent className='py-6'>
                  <div className='flex items-center justify-between'>
                    <Label className='text-md font-medium'>Total</Label>
                    <p className='text-md'>$5.42</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className='flex gap-2 justify-end'>
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
