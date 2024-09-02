import { FormEvent, useEffect, useState } from 'react'
import { CalendarIcon, CheckIcon, PlusCircle, Trash2Icon, XIcon } from 'lucide-react'
import { LockClosedIcon, LockOpen1Icon, Pencil2Icon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { z } from 'zod'

import { useTheme } from '@/Providers/theme-provider'

import { Button } from '@/Components/ui/button'
import { Calendar } from '@/Components/ui/calendar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog'
import { Input } from '@/Components/ui/input'
import { InputNumber } from '@/Components/ui/input-number'
import { Label } from '@/Components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover'
import { ScrollArea } from '@/Components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { Separator } from '@/Components/ui/separator'
import { Textarea } from '@/Components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'

import InputError from '@/Components/InputError'

import { formatCurrency } from '@/Lib/utils'

const categories = [
  { label: 'Clothing', value: 'clothing' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Accessories', value: 'accessories' }
]

type ProductForm = {
  name: string
  sku_prefix: string
  category: string
  quantity: string
  buying_price: string
  retail_price: string
  selling_price: string
  description?: string
}

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku_prefix: z.string().min(1, 'SKU prefix is required'),
  category: z.string().min(1, 'Category is required'),
  quantity: z
    .string()
    .transform(val => Number(val))
    .refine(val => !isNaN(val) && val > 0, {
      message: 'Must be a positive number'
    }),
  buying_price: z
    .string()
    .refine(val => val.trim() !== '', {
      message: 'Buying price is required'
    })
    .transform(val => Number(val))
    .refine(val => !isNaN(val) && val >= 0, {
      message: 'Must be a non-negative number'
    }),
  retail_price: z
    .string()
    .refine(val => val.trim() !== '', {
      message: 'Retail price is required'
    })
    .transform(val => Number(val))
    .refine(val => !isNaN(val) && val >= 0, {
      message: 'Must be a non-negative number'
    }),
  selling_price: z
    .string()
    .refine(val => val.trim() !== '', {
      message: 'Selling price is required'
    })
    .transform(val => Number(val))
    .refine(val => !isNaN(val) && val >= 0, {
      message: 'The selling price field must be greater than 0.'
    }),
  description: z.string().optional()
})

const AddAcquisition = () => {
  const initialFormData: ProductForm = {
    name: '',
    sku_prefix: '',
    category: '',
    quantity: '',
    buying_price: '',
    retail_price: '',
    selling_price: '',
    description: ''
  }

  const [productForm, setProductForm] = useState<ProductForm>(initialFormData)
  const [acquiredProducts, setAcquiredProducts] = useState<ProductForm[]>([])
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [openCalendarPopover, setOpenCalendarPopover] = useState(false)
  const [productAddButtonTitle, setProductAddButtonTitle] = useState('Add')
  const [openAddAcquisitionDialog, setOpenAddAcquisitionDialog] = useState(false)
  const [skuManualInput, setSkuManualInput] = useState(false)
  const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null)
  const [openMobilePopoverIndex, setOpenMobilePopoverIndex] = useState<number | null>(null)
  const [openEditPopover, setOpenEditPopover] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    if (!skuManualInput) {
      if (productForm.name !== '') {
        setProductFormData('sku_prefix', abbreviateWords(productForm.name))

        return
      }

      return setProductFormData('sku_prefix', '')
    }
  }, [productForm.name, skuManualInput])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setProductForm(currentData => ({
      ...currentData,
      [name]: value
    }))
    clearErrors(name as keyof ProductForm)
  }

  const clearErrors = (name: keyof ProductForm) => {
    setErrors(currentErrors => {
      const newErrors = { ...currentErrors }
      delete newErrors[name]

      return newErrors
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = productSchema.safeParse(productForm)

    if (!result.success) {
      const newErrors: Record<string, string | undefined> = {}
      result.error.errors.forEach(error => {
        newErrors[error.path[0]] = error.message
      })
      setErrors(newErrors)
    } else {
      handleAddProduct(e)
      setErrors({})
    }
  }

  const handleAddProduct = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setAcquiredProducts(currentProducts => [...currentProducts, productForm])
    setProductForm(initialFormData)
    setProductAddButtonTitle('Added')
    setTimeout(() => {
      setProductAddButtonTitle('Add')
    }, 1300)
  }

  const setProductFormData = (name: keyof ProductForm, value: string) => {
    setProductForm(currentData => ({
      ...currentData,
      [name]: value
    }))
    clearErrors(name as keyof ProductForm)
  }

  const handleEditForm = (product: ProductForm) => {
    if (JSON.stringify(productForm) === JSON.stringify(initialFormData)) {
      setOpenEditPopover(false)
      setProductForm(product)
      setAcquiredProducts(acquiredProducts.filter(acquiredProduct => acquiredProduct !== product))
    } else {
      setOpenEditPopover(true)
    }
  }

  function abbreviateWords(phrase: string) {
    const words = phrase.split(' ')

    if (words.length === 1) {
      return words[0].slice(0, 3).toUpperCase()
    }

    return words
      .slice(0, 3)
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }

  return (
    <Dialog open={openAddAcquisitionDialog} onOpenChange={setOpenAddAcquisitionDialog}>
      <DialogTrigger asChild>
        <Button className='gap-1'>
          <PlusCircle className='h-4 w-4' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Add Acquisition</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='flex h-screen flex-col justify-between gap-0 overflow-y-auto p-0 lg:h-auto lg:max-w-[60rem]'>
        <div className='flex flex-col-reverse justify-end lg:flex-row'>
          {/* for mobile view only */}
          {acquiredProducts.length > 0 ? (
            <div className='lg:hidden'>
              <ul className='flex flex-col space-y-2 pb-4'>
                {acquiredProducts.map((product, index) => (
                  <li key={index} className='mx-4 flex h-auto items-center justify-between rounded-md bg-muted-foreground/5 p-4 text-start dark:bg-accent/50'>
                    <div className='w-full space-y-0.5'>
                      <div className='flex items-center justify-between border-b pb-2'>
                        <div className='flex-1 space-y-1'>
                          <div className='flex items-center'>
                            <p className='border-r pr-2 text-base font-semibold'>{product.name}</p>
                            <p className='pl-2 text-xs'>{product.sku_prefix}</p>
                          </div>
                          <p className='text-xs font-light'>
                            Quantity: <span className='font-semibold'>{product.quantity}</span>
                          </p>
                          <p className='text-xs font-light'>
                            Category: <span className='font-semibold'>{product.category}</span>
                          </p>
                        </div>
                        <div className='flex gap-0.5'>
                          <Popover
                            open={openEditPopover && openMobilePopoverIndex === index} // Control the open state
                            onOpenChange={isOpen => setOpenMobilePopoverIndex(isOpen ? index : null)}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                className='group h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                                onClick={() => {
                                  handleEditForm(product)
                                  setOpenMobilePopoverIndex(openMobilePopoverIndex === index ? null : index)
                                }}
                              >
                                <Pencil2Icon className='h-4 w-4 text-muted-foreground group-hover:text-foreground' />
                                <span className='sr-only'>Edit</span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent align='end'>
                              <Button
                                onClick={() => {
                                  setOpenEditPopover(false)
                                  setProductForm(product)
                                  setAcquiredProducts(acquiredProducts.filter(acquiredProduct => acquiredProduct !== product))
                                }}
                              >
                                <CheckIcon />
                              </Button>
                              <Button onClick={() => setOpenEditPopover(false)}>
                                <XIcon />
                              </Button>
                            </PopoverContent>
                          </Popover>
                          <Button type='button' variant='ghost' size='icon' className='group h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'>
                            <Trash2Icon className='h-4 w-4 text-destructive group-hover:text-red-700' />
                            <span className='sr-only'>Remove</span>
                          </Button>
                        </div>
                      </div>
                      <div className='flex pt-1.5'>
                        <p className='border-r pr-2 text-xs font-light'>
                          Buying Price <span className='font-semibold'>{formatCurrency(product.buying_price)}</span>
                        </p>
                        <p className='border-r px-2 text-xs font-light'>
                          Retail Price <span className='font-semibold'>{formatCurrency(product.retail_price)}</span>
                        </p>
                        <p className='pl-2 text-xs font-light'>
                          Selling Price <span className='font-semibold'>{formatCurrency(product.selling_price)}</span>
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className='flex justify-center lg:hidden'>
              <p className='py-4'>No products added yet.</p>
            </div>
          )}

          <form className='w-full pb-4 pt-6 lg:h-auto' onSubmit={handleSubmit}>
            <DialogHeader className='px-4'>
              <DialogTitle>Add Products</DialogTitle>
              <DialogDescription>Add the acquired products to the store.</DialogDescription>
            </DialogHeader>
            <Separator className='my-3' />

            <div className='space-y-2 px-4'>
              <div className='flex gap-2'>
                <div className='w-9/12'>
                  <div className='grid gap-2'>
                    <Label htmlFor='name' className={errors.name?.length ? 'text-destructive' : ''}>
                      Product Name
                    </Label>
                    <Input id='name' type='text' name='name' value={productForm.name} onChange={handleInputChange} placeholder='Name' />
                  </div>
                  <InputError message={errors.name} />
                </div>
                <div>
                  <div className='grid gap-2'>
                    <Label htmlFor='sku_prefix' className={errors.sku_prefix?.length ? 'text-destructive' : ''}>
                      SKU Prefix
                    </Label>
                    <div className='relative'>
                      <Input id='sku_prefix' name='sku_prefix' value={productForm.sku_prefix} onChange={handleInputChange} placeholder='SKU Prefix' readOnly={!skuManualInput} />
                      <div className='absolute right-1 top-1/2 flex items-center'>
                        <TooltipProvider>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                              <Button type='button' variant='ghost' size='icon' className='mr-1 h-7 w-7 -translate-y-1/2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={() => setSkuManualInput(!skuManualInput)}>
                                {skuManualInput ? <LockOpen1Icon className='h-4 w-4' /> : <LockClosedIcon className='h-4 w-4' />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Manual Input?</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                  <InputError message={errors.sku_prefix} />
                </div>
              </div>
              <div className='flex w-full gap-2'>
                <div className='w-9/12'>
                  <div className='grid gap-2'>
                    <Label htmlFor='category' className={errors.category?.length ? 'text-destructive' : ''}>
                      Category
                    </Label>
                    <div className='space-y-px'>
                      <Select name='category' value={productForm.category} onValueChange={value => setProductFormData('category', value)}>
                        <SelectTrigger id='category' aria-label='Select category'>
                          <SelectValue placeholder='Select category' />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <InputError message={errors.category} />
                </div>
                <div>
                  <div className='grid gap-2'>
                    <Label htmlFor='quantity' className={errors.quantity?.length ? 'text-destructive' : ''}>
                      Quantity
                    </Label>
                    <InputNumber id='quantity' name='quantity' value={productForm.quantity} onChange={handleInputChange} placeholder='Quantity' />
                  </div>
                  <InputError message={errors.quantity} />
                </div>
              </div>
              <div className='flex w-full gap-2'>
                <div className='w-1/3'>
                  <div className='grid gap-2'>
                    <Label htmlFor='buying_price' className={errors.buying_price?.length ? 'text-destructive' : ''}>
                      Buying Price
                    </Label>
                    <InputNumber id='buying_price' name='buying_price' value={productForm.buying_price} onChange={handleInputChange} placeholder='Buying Price' />
                  </div>
                  <InputError message={errors.buying_price} />
                </div>
                <div className='w-1/3'>
                  <div className='grid gap-2'>
                    <Label htmlFor='retail_price' className={errors.retail_price?.length ? 'text-destructive' : ''}>
                      Retail Price
                    </Label>
                    <InputNumber id='retail_price' name='retail_price' value={productForm.retail_price} onChange={handleInputChange} placeholder='Retail Price' />
                  </div>
                  <InputError message={errors.retail_price} />
                </div>
                <div className='w-1/3'>
                  <div className='grid gap-2'>
                    <Label htmlFor='selling_price' className={errors.selling_price?.length ? 'text-destructive' : ''}>
                      Selling Price
                    </Label>
                    <InputNumber id='selling_price' name='selling_price' value={productForm.selling_price} onChange={handleInputChange} placeholder='Selling Price' />
                  </div>
                  <InputError message={errors.selling_price} />
                </div>
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='description'>Description</Label>
                <Textarea id='description' value={productForm.description} onChange={handleInputChange} name='description' rows={4} placeholder='Description' />
              </div>
            </div>
            <DialogFooter>
              <div className='flex justify-end gap-2 px-4 pt-4'>
                <Button variant='secondary' className='px-2.5' onClick={() => setProductForm(initialFormData)}>
                  Discard
                </Button>
                <Button type='submit' className='w-21.5 space-x-px px-2.5 transition-all duration-200' disabled={productAddButtonTitle === 'Added'}>
                  {productAddButtonTitle === 'Added' && <CheckIcon className='h-4 w-4' />}
                  <p>{productAddButtonTitle}</p>
                </Button>
              </div>
            </DialogFooter>
          </form>
          <div className='space-y-4 bg-primary-foreground pl-4 pt-6 lg:w-1/2'>
            <div className='mb-6'>
              <DialogHeader>
                <DialogTitle>Acquisition Information</DialogTitle>
                <DialogDescription>Add new acquisition to the store.</DialogDescription>
              </DialogHeader>
            </div>
            <div className='mr-4 flex flex-1 gap-2 border-b pb-4 pt-px'>
              <div className='grid w-1/2 gap-2'>
                <Label htmlFor='invoice_number'>Invoice Number</Label>
                <Input id='invoice_number' type='text' name='invoice_number' placeholder='Invoice Number' />
              </div>
              <div className='grid w-1/2 gap-2'>
                <Label htmlFor='calendar'>Acquired Date</Label>
                <Popover open={openCalendarPopover} onOpenChange={setOpenCalendarPopover}>
                  <PopoverTrigger asChild>
                    <Button type='button' variant='outline' id='calendar' className='flex justify-between px-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={() => setOpenCalendarPopover(true)}>
                      <p>{date && format(date, 'MM-dd-yyyy')}</p>
                      <CalendarIcon className='h-4 w-4' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align='end'>
                    <Calendar
                      mode='single'
                      captionLayout='dropdown-buttons'
                      selected={date}
                      onSelect={e => {
                        setDate(e)
                        setOpenCalendarPopover(false)
                      }}
                      fromYear={new Date().getFullYear() - 5}
                      toYear={new Date().getFullYear() + 5}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <ScrollArea className='mr-1 hidden h-[326px] pr-3 lg:block'>
              <ul className='flex flex-col space-y-2'>
                {acquiredProducts.map((product, index) => (
                  <li key={index} className='flex h-auto items-center justify-between rounded-md bg-muted-foreground/5 px-3 py-2 text-start dark:bg-accent/50'>
                    <div className='w-full space-y-0.5'>
                      <div className='flex items-center justify-between border-b pb-2'>
                        <div className='flex-1'>
                          <div className='flex items-center'>
                            <p className='border-r pr-2 text-base font-semibold'>{product.name}</p>
                            <p className='pl-2 text-xs'>{product.sku_prefix}</p>
                          </div>
                          <p className='text-xs font-light'>
                            Quantity: <span className='font-semibold'>{product.quantity}</span>
                          </p>
                          <p className='text-xs font-light'>
                            Category: <span className='font-semibold'>{product.category}</span>
                          </p>
                        </div>
                        <div className='flex gap-0.5'>
                          <Popover
                            open={openEditPopover && openPopoverIndex === index} // Control the open state
                            onOpenChange={isOpen => setOpenPopoverIndex(isOpen ? index : null)}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                className='group h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                                onClick={() => {
                                  handleEditForm(product)
                                  setOpenPopoverIndex(openPopoverIndex === index ? null : index)
                                }}
                              >
                                <Pencil2Icon className='h-4 w-4 text-muted-foreground group-hover:text-foreground' />
                                <span className='sr-only'>Edit</span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent align='end' className='w-52 space-y-1.5 p-2.5'>
                              <div className='space-y-1.5 text-xs'>
                                <p>This will overwrite the current form data.</p>
                                <p className='font-semibold'>Do you want to proceed?</p>
                              </div>
                              <div className='flex justify-end gap-1'>
                                <Button type='button' variant='destructive' size='icon' className='group h-7 w-7' onClick={() => setOpenEditPopover(false)}>
                                  <XIcon className='h-4 w-4 text-white/80 group-hover:text-white' />
                                  <span className='sr-only'>Discard</span>
                                </Button>
                                <Button
                                  type='button'
                                  variant={theme === 'dark' ? 'default' : 'outline'}
                                  size='icon'
                                  className='group h-7 w-7 text-gray-500 hover:text-gray-900'
                                  onClick={() => {
                                    setOpenEditPopover(false)
                                    setProductForm(product)
                                    setAcquiredProducts(acquiredProducts.filter(acquiredProduct => acquiredProduct !== product))
                                  }}
                                >
                                  <CheckIcon className='h-4 w-4 dark:file:text-primary-foreground/80 dark:file:group-hover:text-green-600' />
                                  <span className='sr-only'>Add</span>
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                          <Button type='button' variant='ghost' size='icon' className='group h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={() => setAcquiredProducts(acquiredProducts.filter(acquiredProduct => acquiredProduct !== product))}>
                            <Trash2Icon className='h-4 w-4 text-destructive group-hover:text-red-700' />
                            <span className='sr-only'>Remove</span>
                          </Button>
                        </div>
                      </div>
                      <div className='flex pt-1.5'>
                        <p className='border-r pr-2 text-xs font-light'>
                          Buying Price <span className='font-semibold'>{formatCurrency(product.buying_price)}</span>
                        </p>
                        <p className='border-r px-2 text-xs font-light'>
                          Retail Price <span className='font-semibold'>{formatCurrency(product.retail_price)}</span>
                        </p>
                        <p className='pl-2 text-xs font-light'>
                          Selling Price <span className='font-semibold'>{formatCurrency(product.selling_price)}</span>
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter className='border-t'>
          <div className='flex justify-end gap-2 px-4 py-4'>
            <Button
              variant='secondary'
              onClick={() => {
                setOpenAddAcquisitionDialog(false)
                setAcquiredProducts([])
                setProductForm(initialFormData)
              }}
            >
              Cancel
            </Button>
            <Button type='submit'>Save Acquisition</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddAcquisition
