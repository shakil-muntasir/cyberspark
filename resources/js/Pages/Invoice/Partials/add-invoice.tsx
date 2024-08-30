import { Button } from '@/Components/ui/button'
import { Calendar } from '@/Components/ui/calendar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog'
import { Input } from '@/Components/ui/input'
import { InputNumber } from '@/Components/ui/input-number'
import { Label } from '@/Components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { Separator } from '@/Components/ui/separator'
import { Textarea } from '@/Components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'
import { formatCurrency } from '@/Lib/utils'
import { LockClosedIcon, LockOpen1Icon, Pencil2Icon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { CalendarIcon, CheckIcon, PlusCircle, Trash2Icon } from 'lucide-react'
import { FormEvent, useState } from 'react'

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

const AddInvoice = () => {
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
  const [invoiceProducts, setInvoiceProducts] = useState<ProductForm[]>([])
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [openCalendarPopover, setOpenCalendarPopover] = useState(false)
  const [productAddButtonTitle, setProductAddButtonTitle] = useState('Add')
  const [openAddInvoiceDialog, setOpenAddInvoiceDialog] = useState(false)
  const [skuManualInput, setSkuManualInput] = useState(true)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setProductForm(currentData => ({
      ...currentData,
      [name]: value
    }))
  }

  const handleAddProduct = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setInvoiceProducts(currentProducts => [...currentProducts, productForm])
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
  }

  return (
    <Dialog open={openAddInvoiceDialog} onOpenChange={setOpenAddInvoiceDialog}>
      <DialogTrigger asChild>
        <Button className='gap-1'>
          <PlusCircle className='h-4 w-4' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Add Invoice</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='flex h-screen flex-col justify-between gap-0 overflow-y-auto p-0 lg:h-auto lg:max-w-[60rem]'>
        <div className='flex flex-col-reverse justify-end lg:flex-row'>
          {/* for mobile view only */}
          {invoiceProducts.length > 0 ? (
            <div className='lg:hidden'>
              <ul className='flex flex-col space-y-2 pb-4'>
                {invoiceProducts.map((invoice, index) => (
                  <li key={index} className='mx-4 flex h-auto items-center justify-between rounded-md bg-muted-foreground/5 p-4 text-start dark:bg-accent/50'>
                    <div className='w-full space-y-0.5'>
                      <div className='flex items-center justify-between border-b pb-2'>
                        <div className='flex-1 space-y-1'>
                          <div className='flex items-center'>
                            <p className='border-r pr-2 text-base font-semibold'>{invoice.name}</p>
                            <p className='pl-2 text-xs'>{invoice.sku_prefix}</p>
                          </div>
                          <p className='text-xs font-light'>
                            Quantity: <span className='font-semibold'>{invoice.quantity}</span>
                          </p>
                          <p className='text-xs font-light'>
                            Category: <span className='font-semibold'>{invoice.category}</span>
                          </p>
                        </div>
                        <div className='flex gap-0.5'>
                          <TooltipProvider>
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger asChild>
                                <Button type='button' variant='ghost' size='icon' className='group h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'>
                                  <Pencil2Icon className='h-4 w-4 text-muted-foreground group-hover:text-foreground' />
                                  <span className='sr-only'>Edit</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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
                        </div>
                      </div>
                      <div className='flex pt-1.5'>
                        <p className='border-r pr-2 text-xs font-light'>
                          Buying Price <span className='font-semibold'>{formatCurrency(invoice.buying_price)}</span>
                        </p>
                        <p className='border-r px-2 text-xs font-light'>
                          Retail Price <span className='font-semibold'>{formatCurrency(invoice.retail_price)}</span>
                        </p>
                        <p className='pl-2 text-xs font-light'>
                          Selling Price <span className='font-semibold'>{formatCurrency(invoice.selling_price)}</span>
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className='flex justify-center lg:hidden'>
              <p>No products added yet.</p>
            </div>
          )}

          <form className='w-full pb-4 pt-6 lg:h-auto' onSubmit={e => handleAddProduct(e)}>
            <DialogHeader className='px-4'>
              <DialogTitle>Add products to an invoice.</DialogTitle>
              <DialogDescription>Make changes to your profile here.</DialogDescription>
            </DialogHeader>
            <Separator className='my-3' />

            <div className='space-y-6 px-4'>
              <div className='flex gap-2'>
                <div className='grid w-9/12 gap-2'>
                  <Label htmlFor='name'>Product Name</Label>
                  <Input id='name' type='text' name='name' value={productForm.name} onChange={handleInputChange} placeholder='Name' />
                </div>
                <div>
                  <Label htmlFor='sku_prefix'>SKU Prefix</Label>
                  <div className='relative'>
                    <Input id='sku_prefix' type='text' name='sku_prefix' value={productForm.sku_prefix} onChange={handleInputChange} placeholder='SKU Prefix' readOnly={skuManualInput} />
                    <div className='absolute right-1 top-1/2 flex items-center'>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <Button type='button' variant='ghost' size='icon' className='mr-1 h-7 w-7 -translate-y-1/2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={() => setSkuManualInput(!skuManualInput)}>
                              {skuManualInput ? <LockClosedIcon className='h-4 w-4' /> : <LockOpen1Icon className='h-4 w-4' />}
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
              </div>
              <div className='flex w-full gap-2'>
                <div className='grid w-9/12 gap-2'>
                  <Label htmlFor='category'>Category</Label>
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
                <div className='grid gap-2'>
                  <Label htmlFor='quantity'>Quantity</Label>
                  <InputNumber id='quantity' name='quantity' value={productForm.quantity} onChange={handleInputChange} placeholder='Quantity' />
                </div>
              </div>
              <div className='flex w-full gap-2'>
                <div className='grid w-1/3 gap-2'>
                  <Label htmlFor='buying_price'>Buying Price</Label>
                  <InputNumber id='buying_price' name='buying_price' value={productForm.buying_price} onChange={handleInputChange} placeholder='Buying Price' />
                </div>
                <div className='grid w-1/3 gap-2'>
                  <Label htmlFor='retail_price'>Retail Price</Label>
                  <InputNumber id='retail_price' name='retail_price' value={productForm.retail_price} onChange={handleInputChange} placeholder='Retail Price' />
                </div>
                <div className='grid w-1/3 gap-2'>
                  <Label htmlFor='selling_price'>Selling Price</Label>
                  <InputNumber id='selling_price' name='selling_price' value={productForm.selling_price} onChange={handleInputChange} placeholder='Selling Price' />
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
                <DialogTitle>Invoice Information.</DialogTitle>
                <DialogDescription>Make changes to your profile here.</DialogDescription>
              </DialogHeader>
            </div>
            <div className='mr-4 flex flex-1 gap-2 border-b pb-4 pt-px'>
              <div className='grid w-1/2 gap-2'>
                <Label htmlFor='invoice_number'>Invoice Number</Label>
                <Input id='invoice_number' type='text' name='invoice_number' placeholder='Invoice Number' />
              </div>
              <div className='grid w-1/2 gap-2'>
                <Label htmlFor='calendar'>Delivery Date</Label>
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
            <div className='mr-1 hidden h-[326px] overflow-hidden overflow-y-auto pr-3 lg:block'>
              <ul className='flex flex-col space-y-2'>
                {invoiceProducts.map((invoice, index) => (
                  <li key={index} className='flex h-auto items-center justify-between rounded-md bg-muted-foreground/5 px-3 py-2 text-start dark:bg-accent/50'>
                    <div className='w-full space-y-0.5'>
                      <div className='flex items-center justify-between border-b pb-2'>
                        <div className='flex-1'>
                          <div className='flex items-center'>
                            <p className='border-r pr-2 text-base font-semibold'>{invoice.name}</p>
                            <p className='pl-2 text-xs'>{invoice.sku_prefix}</p>
                          </div>
                          <p className='text-xs font-light'>
                            Quantity: <span className='font-semibold'>{invoice.quantity}</span>
                          </p>
                          <p className='text-xs font-light'>
                            Category: <span className='font-semibold'>{invoice.category}</span>
                          </p>
                        </div>
                        <div className='flex gap-0.5'>
                          <TooltipProvider>
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger asChild>
                                <Button type='button' variant='ghost' size='icon' className='group h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'>
                                  <Pencil2Icon className='h-4 w-4 text-muted-foreground group-hover:text-foreground' />
                                  <span className='sr-only'>Edit</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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
                        </div>
                      </div>
                      <div className='flex pt-1.5'>
                        <p className='border-r pr-2 text-xs font-light'>
                          Buying Price <span className='font-semibold'>{formatCurrency(invoice.buying_price)}</span>
                        </p>
                        <p className='border-r px-2 text-xs font-light'>
                          Retail Price <span className='font-semibold'>{formatCurrency(invoice.retail_price)}</span>
                        </p>
                        <p className='pl-2 text-xs font-light'>
                          Selling Price <span className='font-semibold'>{formatCurrency(invoice.selling_price)}</span>
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <DialogFooter className='border-t'>
          <div className='flex justify-end gap-2 px-4 py-4'>
            <Button
              variant='secondary'
              onClick={() => {
                setOpenAddInvoiceDialog(false)
                setInvoiceProducts([])
                setProductForm(initialFormData)
              }}
            >
              Cancel
            </Button>
            <Button type='submit'>Save Invoice</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddInvoice
