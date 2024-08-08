import { useState } from 'react'
import { Loader2, PlusCircle, AlertCircle } from 'lucide-react'

import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Separator } from '@/Components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/Components/ui/sheet'
import { useToast } from '@/Components/ui/use-toast'
import { Textarea } from '@/Components/ui/textarea'
import { ScrollArea } from '@/Components/ui/scroll-area'
import InputError from '@/Components/InputError'
import { useForm } from '@inertiajs/react'
import { ProductForm } from '@/Types/product'

export default function AddProduct() {
  const { toast } = useToast()

  const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
    sku: '',
    name: '',
    description: '',
    quantity: null,
    buying_price: null,
    retail_price: null,
    selling_price: null
  })
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitButtonText, setSubmitButtonText] = useState<string>('Save changes')

  const handleAddProduct = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setSubmitButtonText('Saving')

    setTimeout(() => {
      post(route('products.store'), {
        onSuccess: handleSuccess,
        onError: handleError
      })
    }, 500)
  }

  const handleSuccess = () => {
    setTimeout(() => {
      setOpen(false)
      reset()
      toast({
        title: 'Success!',
        description: 'The product has been added successfully.',
        duration: 2000
      })
      setLoading(false)
      setSubmitButtonText('Save changes')
    }, 200)
  }

  const handleError = () => {
    setSubmitButtonText('Error')
    setTimeout(() => {
      setLoading(false)
      setSubmitButtonText('Save changes')
    }, 2000)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setData(name as keyof ProductForm, value)
    clearErrors(name as keyof ProductForm)
  }

  const handleFormOpen = (value: boolean) => {
    if (!loading || value) {
      setOpen(value)
    }

    if (!value) {
      reset()
      clearErrors()
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleFormOpen}>
      <SheetTrigger asChild>
        <Button onClick={() => setOpen(true)} className='gap-1'>
          <PlusCircle className='h-4 w-4' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Add Product</span>
        </Button>
      </SheetTrigger>
      <SheetContent className='px-0'>
        <SheetHeader className='px-6'>
          <SheetTitle>Add Product</SheetTitle>
          <SheetDescription>Fill in the form to add a new product to your store.</SheetDescription>
        </SheetHeader>

        <Separator className='my-2' />

        <ScrollArea className='h-[calc(100vh-80px)]'>
          <form onSubmit={handleAddProduct} className='mt-3 mb-8 grid gap-3 mx-6'>
            <div className='grid gap-2'>
              <Label htmlFor='sku' className={errors.sku?.length ? 'text-destructive' : ''}>
                SKU
              </Label>
              <div className='space-y-px'>
                <Input id='sku' type='text' name='sku' value={data.sku} onChange={handleInputChange} placeholder='Product SKU' />
                <InputError message={errors.sku} />
              </div>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='name' className={errors.name?.length ? 'text-destructive' : ''}>
                Name
              </Label>
              <div className='space-y-px'>
                <Input id='name' type='text' name='name' value={data.name} onChange={handleInputChange} placeholder='Product Name' />
                <InputError message={errors.name} />
              </div>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='description' className={errors.description?.length ? 'text-destructive' : ''}>
                Description
              </Label>
              <div className='space-y-px'>
                <Textarea id='description' name='description' value={data.description} onChange={handleInputChange} placeholder='Product Description' />
                <InputError message={errors.description} />
              </div>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='quantity' className={errors.quantity?.length ? 'text-destructive' : ''}>
                Quantity
              </Label>
              <div className='space-y-px'>
                <Input id='quantity' type='number' name='quantity' value={data.quantity !== null ? data.quantity : ''} onChange={handleInputChange} placeholder='Quantity' />
                <InputError message={errors.quantity} />
              </div>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='buying_price' className={errors.buying_price?.length ? 'text-destructive' : ''}>
                Buying Price
              </Label>
              <div className='space-y-px'>
                <Input id='buying_price' type='number' name='buying_price' value={data.buying_price !== null ? data.buying_price : ''} onChange={handleInputChange} placeholder='Buying Price' />
                <InputError message={errors.buying_price} />
              </div>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='retail_price' className={errors.retail_price?.length ? 'text-destructive' : ''}>
                Retail Price
              </Label>
              <div className='space-y-px'>
                <Input id='retail_price' type='number' name='retail_price' value={data.retail_price !== null ? data.retail_price : ''} onChange={handleInputChange} placeholder='Retail Price' />
                <InputError message={errors.retail_price} />
              </div>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='selling_price' className={errors.selling_price?.length ? 'text-destructive' : ''}>
                Selling Price
              </Label>
              <div className='space-y-px'>
                <Input id='selling_price' type='number' name='selling_price' value={data.selling_price !== null ? data.selling_price : ''} onChange={handleInputChange} placeholder='Selling Price' />
                <InputError message={errors.selling_price} />
              </div>
            </div>

            <SheetFooter>
              <Button type='submit' className='w-32' disabled={loading}>
                {submitButtonText === 'Saving' ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    <span>{submitButtonText}</span>
                  </>
                ) : submitButtonText === 'Error' ? (
                  <>
                    <AlertCircle className='mr-2 h-4 w-4 text-destructive' />
                    <span>Failed</span>
                  </>
                ) : (
                  <span>{submitButtonText}</span>
                )}
              </Button>
            </SheetFooter>
          </form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
