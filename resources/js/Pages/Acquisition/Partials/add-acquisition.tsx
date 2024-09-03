import { useState } from 'react'
import { CalendarIcon, PlusCircle } from 'lucide-react'
import { format, parse } from 'date-fns'

import { Button } from '@/Components/ui/button'
import { Calendar } from '@/Components/ui/calendar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover'
import { ScrollArea } from '@/Components/ui/scroll-area'

import AcquiredProductForm from '@/Pages/Acquisition/Partials/acquired-product-form'
import PCAcquiredProductsList from '@/Pages/Acquisition/Partials/pc-acquired-product-list'
import MobileAcquiredProductsList from '@/Pages/Acquisition/Partials/mobile-acquired-product-list'
import useForm from '@/Hooks/form'
import { AcquiredProductForm as AcquiredProductFormType, AcquisitionForm } from '@/Pages/Acquisition/type'
import { SelectOption } from '@/Types'
import { toast } from '@/Components/ui/use-toast'

interface AddAcquisitionProps {
  categories: SelectOption[]
}

const AddAcquisition: React.FC<AddAcquisitionProps> = ({ categories }) => {
  const [productToEdit, setProductToEdit] = useState<AcquiredProductFormType | undefined>(undefined)
  const [openCalendarPopover, setOpenCalendarPopover] = useState(false)
  const [openAddAcquisitionDialog, setOpenAddAcquisitionDialog] = useState(false)
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [showEditConfirmation, setShowEditConfirmation] = useState(false) // Manage the popover state for edit confirmation
  const [discardFormData, setDiscardFormData] = useState(false)

  const { data, post, setData, clearErrors, reset } = useForm<AcquisitionForm>({
    invoice_number: '',
    acquired_date: '',
    products: []
  })

  const handleAcquisitionSubmit = () => {
    post(route('acquisitions.store'), {
      onSuccess: handleSuccess,
      onError: handleError
    })
  }

  const handleSuccess = () => {
    setTimeout(() => {
      setOpenAddAcquisitionDialog(false)
      reset()
      toast({
        title: 'Success!',
        description: 'The acquisition has been added successfully.',
        duration: 2000
      })
    }, 200)
  }

  const handleError = (errors: Partial<Record<keyof AcquiredProductFormType, string>>) => {
    toast({
      variant: 'destructive',
      title: 'Error adding acquisition!',
      description: (
        <div className='space-y-1'>
          {Object.values(errors).map((error, index) => (
            <p key={index}>• {error}</p>
          ))}
        </div>
      ),
      duration: 3000
    })
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setData(name as keyof AcquisitionForm, value)
    clearErrors(name as keyof AcquisitionForm)
  }

  const handleAddProduct = (product: AcquiredProductFormType) => {
    setData('products', [...data.products, product])
    setProductToEdit(undefined)
  }

  const handleEditProduct = (product: AcquiredProductFormType) => {
    if (isFormDirty) {
      // Show confirmation popover if the form is dirty
      setShowEditConfirmation(true)
    } else {
      // Directly edit the product if the form is not dirty
      setProductToEdit(product)
      setData(
        'products',
        data.products.filter(acquiredProduct => acquiredProduct !== product)
      )
    }
  }

  const handleConfirmEditProduct = (product: AcquiredProductFormType) => {
    setProductToEdit(product) // Set the product to edit
    setData(
      'products',
      data.products.filter(acquiredProduct => acquiredProduct !== product)
    )
    setIsFormDirty(false)
    setShowEditConfirmation(false) // Close the confirmation popover
  }

  const handleCancelEditProduct = () => {
    setProductToEdit(undefined) // Clear the product to edit
    setShowEditConfirmation(false) // Close the confirmation popover
  }

  const handleRemoveProduct = (product: AcquiredProductFormType) => {
    setData(
      'products',
      data.products.filter(acquiredProduct => acquiredProduct !== product)
    )
  }

  // Function to receive dirty check result from AcquiredProductForm
  const checkFormDirtyBeforeEditing = (isDirty: boolean) => {
    setIsFormDirty(isDirty) // Update the state with the dirty status
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
          <MobileAcquiredProductsList products={data.products} onEditProduct={handleEditProduct} onRemoveProduct={handleRemoveProduct} showEditConfirmation={showEditConfirmation} onConfirmEditProduct={handleConfirmEditProduct} onCancelEditProduct={handleCancelEditProduct} />

          <AcquiredProductForm onProductAdd={handleAddProduct} productToEdit={productToEdit} checkDirtyBeforeEdit={checkFormDirtyBeforeEditing} discardFormData={discardFormData} categories={categories} />

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
                <Input id='invoice_number' type='text' name='invoice_number' value={data.invoice_number} onChange={handleInputChange} placeholder='Invoice Number' />
              </div>
              <div className='grid w-1/2 gap-2'>
                <Label htmlFor='calendar'>Acquired Date</Label>
                <Popover open={openCalendarPopover} onOpenChange={setOpenCalendarPopover}>
                  <PopoverTrigger asChild>
                    <Button type='button' variant='outline' id='calendar' className='flex justify-between px-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={() => setOpenCalendarPopover(true)}>
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
              </div>
            </div>

            {/* for PC view only */}
            <ScrollArea className='mr-1 hidden h-[326px] pr-3 lg:block'>
              <PCAcquiredProductsList products={data.products} onEditProduct={handleEditProduct} onRemoveProduct={handleRemoveProduct} showEditConfirmation={showEditConfirmation} onConfirmEditProduct={handleConfirmEditProduct} onCancelEditProduct={handleCancelEditProduct} />
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className='border-t'>
          <div className='flex justify-end gap-2 px-4 py-4'>
            <Button
              variant='secondary'
              onClick={() => {
                setOpenAddAcquisitionDialog(false)
                setData('products', [])
                setDiscardFormData(false)
                reset()
              }}
            >
              Cancel
            </Button>
            <Button type='button' onClick={handleAcquisitionSubmit}>
              Save Acquisition
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddAcquisition
