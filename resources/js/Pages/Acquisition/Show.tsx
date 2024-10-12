import { CalendarIcon, ChevronLeftIcon } from 'lucide-react'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'

import { AcquiredProductForm, AcquisitionResource } from '@/Pages/Acquisition/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import FormInput from '@/Components/FormInput'
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover'
import { Calendar } from '@/Components/ui/calendar'
import { format, parse } from 'date-fns'
import useForm from '@/Hooks/form'
import { Input } from '@/Components/ui/input'
import { useEffect, useState } from 'react'
import AcquisitionVariantData from '@/Pages/Acquisition/Partials/variant-data'
import { SelectOption } from '@/Types'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/Components/ui/dialog'
import AddEditProductForm from '@/Pages/Acquisition/Partials/add-edit-product-form'
import { ProductVariant } from '@/Pages/Product/types'

interface AcquisitionShowProps {
  acquisition: AcquisitionResource
  categories: SelectOption[]
}

const AcquisitionShow: React.FC<AcquisitionShowProps> = ({ acquisition, categories }) => {
  const initialFormData = {
    invoice_number: acquisition.data.attributes.invoice_number,
    acquired_date: acquisition.data.attributes.acquired_date,
    products: acquisition.data.relationships?.variants
  }

  const { data, setData } = useForm(initialFormData)
  const [productToEdit, setProductToEdit] = useState<AcquiredProductForm>()
  const [openForm, setOpenForm] = useState(false)

  const handleAddProduct = () => {
    setOpenForm(true)
  }

  const handleEditProduct = (productVariant: ProductVariant) => {
    setProductToEdit({
      id: productVariant.id,
      product_id: productVariant.relationships?.product?.id,
      name: productVariant.relationships!.product!.attributes.name,
      sku_prefix: productVariant.relationships!.product!.attributes.sku_prefix,
      category_id: productVariant.relationships!.product!.attributes.category_id,
      quantity: productVariant.attributes.quantity,
      buying_price: productVariant.attributes.buying_price,
      retail_price: productVariant.attributes.retail_price ?? '',
      selling_price: productVariant.attributes.selling_price,
      stock_threshold: productVariant.relationships!.product!.attributes.stock_threshold,
      description: productVariant.relationships!.product!.attributes.description
    })
    setOpenForm(true)
  }

  useEffect(() => {
    setProductToEdit(undefined)
  }, [openForm])

  const [openCalendarPopover, setOpenCalendarPopover] = useState(false)

  return (
    <AuthenticatedLayout title='Order Details'>
      <main className='mx-auto flex max-w-[80rem] flex-1 flex-col gap-4'>
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
          <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>{acquisition.data.attributes.invoice_number}</h1>
          <Badge variant='default' className='ml-auto sm:ml-0'>
            {acquisition.data.attributes.variants_count}
          </Badge>

          <div className='hidden items-center gap-2 md:ml-auto md:flex'>
            <Button variant='secondary' size='sm' onClick={() => null}>
              Discard
            </Button>
            <Button size='sm'>Save Order</Button>
          </div>
        </div>

        <div className='flex flex-col gap-4 lg:gap-6'>
          <Card>
            <CardHeader>
              <div className='flex justify-between'>
                <div>
                  <CardTitle>{acquisition.data.attributes.invoice_number}</CardTitle>
                  <CardDescription>Here is an overview of your order.</CardDescription>
                </div>
                <Button variant='outline' className='flex gap-2 px-3'>
                  <span>Edit</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className='flex flex-col gap-4 lg:flex-row lg:justify-between lg:gap-0'>
              <div className='mt-0.5 flex gap-4 lg:w-1/2'>
                <FormInput id='invoice_number' label='Invoice Number'>
                  <Input id='invoice_number' type='text' name='invoice_number' value={data.invoice_number} placeholder='Invoice Number' />
                </FormInput>

                <FormInput id='calendar' label='Acquired Date'>
                  <Popover open={openCalendarPopover} onOpenChange={setOpenCalendarPopover}>
                    <PopoverTrigger asChild>
                      <Button type='button' variant='outline' id='calendar' className='flex w-full justify-between px-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={() => setOpenCalendarPopover(true)}>
                        {data.acquired_date ? <p>{data.acquired_date && format(data.acquired_date, 'MM-dd-yyyy')}</p> : 'Select Date'}
                        <CalendarIcon className='h-4 w-4' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align='end'>
                      <Calendar
                        mode='single'
                        captionLayout='dropdown-buttons'
                        selected={parse(data.acquired_date, 'MM-dd-yyyy', new Date())}
                        onSelect={e => {
                          if (e) {
                            setData('acquired_date', format(e, 'MM-dd-yyyy'))
                            setOpenCalendarPopover(false)
                          }
                        }}
                        fromYear={new Date().getFullYear() - 5}
                        toYear={new Date().getFullYear() + 5}
                      />
                    </PopoverContent>
                  </Popover>
                </FormInput>
              </div>
              <div className='flex flex-col lg:items-end'>
                <Badge variant='secondary' className='mb-2 flex w-fit gap-2 rounded-md py-1 dark:bg-secondary/50'>
                  <span>Created by:</span>
                  <span className='text-muted-'>{acquisition.data.attributes.created_by?.name}</span>
                </Badge>
                <div className='flex h-fit w-full flex-col gap-2 lg:flex-row'>
                  <Badge variant='secondary' className='flex w-fit gap-2 rounded-md py-1 dark:bg-secondary/50'>
                    <span>Placed on:</span>
                    <span className='text-muted-'>{acquisition.data.attributes.created_at}</span>
                  </Badge>
                  <Badge variant='secondary' className='flex w-fit gap-2 rounded-md py-1 dark:bg-secondary/50'>
                    <span>Updated at:</span>
                    <span className='text-muted-'>{acquisition.data.attributes.updated_at}</span>
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <AcquisitionVariantData variants={data.products} handleAddProduct={handleAddProduct} handleEditProduct={handleEditProduct} />

          <Dialog open={openForm} onOpenChange={setOpenForm}>
            <DialogContent className='max-w-3xl p-0'>
              <DialogHeader className='border-b px-6 pb-4 pt-6'>
                <DialogTitle>Add Products</DialogTitle>
                <DialogDescription>Add the acquired products to the store.</DialogDescription>
              </DialogHeader>
              <div className='px-6'>
                <AddEditProductForm categories={categories} productToEdit={productToEdit} onProductAdd={() => null} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </AuthenticatedLayout>
  )
}

export default AcquisitionShow
