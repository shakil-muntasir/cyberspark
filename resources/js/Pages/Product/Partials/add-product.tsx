import { useState } from 'react'
import { useForm } from '@inertiajs/react'
import { AlertCircle, Loader2, PlusCircle } from 'lucide-react'

import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { ScrollArea } from '@/Components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { Separator } from '@/Components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/Components/ui/sheet'
import { Textarea } from '@/Components/ui/textarea'
import { useToast } from '@/Components/ui/use-toast'

import InputError from '@/Components/InputError'
import { ProductForm } from '@/Pages/Product/type'
import { SelectOption } from '@/Types'

interface AddProductProps {
  categories: SelectOption[]
}

const AddProduct: React.FC<AddProductProps> = ({ categories }) => {
  const { toast } = useToast()

  const { data, setData, post, errors, clearErrors, reset } = useForm<ProductForm>({
    name: '',
    description: '',
    category_id: '',
    status: ''
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
      <SheetContent className='px-0' fullscreen={true}>
        <SheetHeader className='space-y-0 px-6'>
          <SheetTitle>Add Product</SheetTitle>
          <SheetDescription>Fill in the form to add a new product to your store.</SheetDescription>
        </SheetHeader>

        <Separator className='my-2' />

        <ScrollArea className='h-[calc(100vh-80px)]'>
          <form onSubmit={handleAddProduct} className='mx-6 mb-8 mt-3 grid gap-3'>
            <div className='grid gap-2'>
              <Label htmlFor='name' className={errors.name?.length ? 'text-destructive' : ''}>
                Product Name
              </Label>
              <div className='space-y-px'>
                <Input id='name' type='text' name='name' value={data.name} onChange={handleInputChange} placeholder='Name' />
                <InputError message={errors.name} />
              </div>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='category_id' className={errors.category_id?.length ? 'text-destructive' : ''}>
                Category
              </Label>
              <Select
                name='category_id'
                value={data.category_id}
                onValueChange={value => {
                  setData('category_id', value)
                  clearErrors('category_id')
                }}
              >
                <SelectTrigger id='category_id' aria-label='Select Category'>
                  <SelectValue placeholder='Select Category' />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.category_id} />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='description' className={errors.description?.length ? 'text-destructive' : ''}>
                Description
              </Label>
              <div className='space-y-px'>
                <Textarea id='description' name='description' value={data.description} onChange={handleInputChange} placeholder='Description' />
                <InputError message={errors.description} />
              </div>
            </div>

            <SheetFooter>
              <div className='flex justify-end gap-2'>
                <Button
                  variant='secondary'
                  onClick={() => {
                    setOpen(false)
                    setTimeout(() => {
                      reset()
                      clearErrors()
                    }, 200)
                  }}
                >
                  Cancel
                </Button>
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
              </div>
            </SheetFooter>
          </form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export default AddProduct
