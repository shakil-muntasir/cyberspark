import InputError from '@/Components/InputError'
import { Button } from '@/Components/ui/button'
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog'
import { Input } from '@/Components/ui/input'
import { InputNumber } from '@/Components/ui/input-number'
import { Label } from '@/Components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { Separator } from '@/Components/ui/separator'
import { Textarea } from '@/Components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'
import { abbreviateWords } from '@/Lib/utils'
import { AcquiredProductForm as AcquiredProductFormType } from '@/Pages/Acquisition/type'
import { CheckIcon, LockClosedIcon, LockOpen1Icon } from '@radix-ui/react-icons'
import { FormEvent, useEffect, useState } from 'react'
import { z } from 'zod'

const categories = [
  { label: 'Clothing', value: 'clothing' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Accessories', value: 'accessories' }
]

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

interface AcquiredProductFormProps {
  onProductAdd: (product: AcquiredProductFormType) => void
  productToEdit?: AcquiredProductFormType
  checkDirtyBeforeEdit: (isDirty: boolean) => void
  discardFormData: boolean
}

const AcquiredProductForm: React.FC<AcquiredProductFormProps> = ({ onProductAdd, productToEdit, checkDirtyBeforeEdit, discardFormData = false }) => {
  const initialFormData: AcquiredProductFormType = {
    name: '',
    sku_prefix: '',
    category: '',
    quantity: '',
    buying_price: '',
    retail_price: '',
    selling_price: '',
    description: ''
  }

  const [productForm, setProductForm] = useState<AcquiredProductFormType>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [productAddButtonTitle, setProductAddButtonTitle] = useState('Add')
  const [skuManualInput, setSkuManualInput] = useState(false)
  const [isDirty, setIsDirty] = useState(false) // Track form dirty state

  useEffect(() => {
    if (productToEdit) {
      setProductForm(productToEdit)
      setProductAddButtonTitle('Save')
    }
  }, [productToEdit])

  useEffect(() => {
    // Check if form is dirty by comparing it to initialFormData
    const formDirty = JSON.stringify(productForm) !== JSON.stringify(initialFormData)
    setIsDirty(formDirty)
    checkDirtyBeforeEdit(formDirty) // Notify parent component if the form is dirty
  }, [productForm])

  useEffect(() => {
    if (!skuManualInput) {
      if (productForm.name !== '') {
        setProductFormData('sku_prefix', abbreviateWords(productForm.name))

        return
      }

      return setProductFormData('sku_prefix', '')
    }
  }, [productForm.name, skuManualInput])

  useEffect(() => {
    if (discardFormData) {
      setProductForm(initialFormData)
      setProductAddButtonTitle('Add')
    }
  }, [discardFormData])

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
    onProductAdd(productForm)
    setProductForm(initialFormData)
    setProductAddButtonTitle('Added')
    setSkuManualInput(false)
    setTimeout(() => {
      setProductAddButtonTitle('Add')
    }, 1300)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setProductForm(currentData => ({
      ...currentData,
      [name]: value
    }))
    clearErrors(name as keyof AcquiredProductFormType)
  }

  const setProductFormData = (name: keyof AcquiredProductFormType, value: string) => {
    setProductForm(currentData => ({
      ...currentData,
      [name]: value
    }))
    clearErrors(name as keyof AcquiredProductFormType)
  }

  const clearErrors = (name: keyof AcquiredProductFormType) => {
    setErrors(currentErrors => {
      const newErrors = { ...currentErrors }
      delete newErrors[name]

      return newErrors
    })
  }

  return (
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
          <Button variant='secondary' className='px-2.5' onClick={() => setProductForm(initialFormData)} disabled={!isDirty}>
            Discard
          </Button>
          <Button type='submit' className='w-21.5 space-x-px px-2.5 transition-all duration-200' disabled={productAddButtonTitle === 'Added'}>
            {productAddButtonTitle === 'Added' && <CheckIcon className='h-4 w-4' />}
            <p>{productAddButtonTitle}</p>
          </Button>
        </div>
      </DialogFooter>
    </form>
  )
}

export default AcquiredProductForm
