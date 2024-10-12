import { FormEvent, useEffect, useState } from 'react'
import { CheckIcon, LockClosedIcon, LockOpen1Icon } from '@radix-ui/react-icons'

import { Button } from '@/Components/ui/button'
import { DialogFooter } from '@/Components/ui/dialog'
import { Input } from '@/Components/ui/input'
import { InputNumber } from '@/Components/ui/input-number'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { Textarea } from '@/Components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'

import { abbreviateWords } from '@/Lib/utils'
import { AcquiredProductForm as AddEditProductFormType } from '@/Pages/Acquisition/types'
import { SelectOption } from '@/Types'
import ProductDropdownList from '@/Components/ProductDropdownList'
import { Product } from '@/Pages/Product/types'
import FormInput from '@/Components/FormInput'
import axios, { AxiosError } from 'axios'

interface AddEditProductFormProps {
  categories: SelectOption[]
  onProductAdd: (product: AddEditProductFormType) => void
  productToEdit?: AddEditProductFormType
}

const AddEditProductForm: React.FC<AddEditProductFormProps> = ({ categories, onProductAdd, productToEdit }) => {
  const initialFormData: AddEditProductFormType = {
    id: '',
    product_id: '',
    name: '',
    sku_prefix: '',
    category_id: '',
    quantity: '',
    buying_price: '',
    retail_price: '',
    selling_price: '',
    stock_threshold: '',
    description: ''
  }

  const [productForm, setProductForm] = useState<AddEditProductFormType>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [productManualInput, setProductManualInput] = useState(false)
  const [skuManualInput, setSkuManualInput] = useState(false)
  const [productAddButtonTitle, setProductAddButtonTitle] = useState('Add')

  useEffect(() => {
    if (productToEdit) {
      setProductForm(productToEdit)
      setProductAddButtonTitle('Save')

      if (productToEdit.product_id === '') {
        setProductManualInput(true)
      } else {
        setProductManualInput(false)
      }
    }
  }, [productToEdit])

  useEffect(() => {
    if (!skuManualInput && productManualInput && !productToEdit) {
      if (productForm.name !== '') {
        setProductFormData('sku_prefix', abbreviateWords(productForm.name))

        return
      }

      return setProductFormData('sku_prefix', '')
    }
  }, [productForm.name, skuManualInput, productManualInput])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isValidated = await validateProduct()

    if (!isValidated) {
      return
    }

    handleAddProduct(e)
    clearErrors()
  }

  const validateProduct = async (): Promise<boolean> => {
    try {
      await axios.post<{ success: boolean }>(route('variants.validate'), productForm)

      return true
    } catch (error: unknown) {
      const errors = (error as AxiosError<{ errors: Record<string, string[] | string> }>)?.response?.data?.errors
      const formatted: Record<string, string> = {}

      if (errors) {
        for (const key in errors) {
          formatted[key] = Array.isArray(errors[key]) ? errors[key][0] : (errors[key] as string)
        }
      }

      setErrors(formatted)

      return false
    }
  }

  const handleAddProduct = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onProductAdd(productForm)
    setProductForm(initialFormData)

    if (productToEdit) {
      setProductAddButtonTitle('Saved')
    } else {
      setProductAddButtonTitle('Added')
    }

    setProductManualInput(false)
    setTimeout(() => {
      setProductAddButtonTitle('Add')
    }, 1300)
  }

  const handleProductSelect = (product: Product) => {
    setProductForm(data => ({
      ...data,
      product_id: product.id,
      name: product.attributes.name,
      sku_prefix: product.attributes.sku_prefix,
      category_id: product.attributes.category_id,
      stock_threshold: product.attributes.stock_threshold,
      description: product.attributes.description
    }))
    clearErrors(['product_id', 'name', 'sku_prefix', 'category_id'])
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setProductForm(currentData => ({
      ...currentData,
      [name]: value
    }))
    clearErrors(name as keyof AddEditProductFormType)
  }

  const handleDiscardProduct = () => {
    setProductForm(initialFormData)
    setProductAddButtonTitle('Add')
    setProductManualInput(false)
    clearErrors()
  }

  const setProductFormData = (name: keyof AddEditProductFormType, value: string) => {
    setProductForm(currentData => ({
      ...currentData,
      [name]: value
    }))
    clearErrors(name as keyof AddEditProductFormType)
  }

  const clearErrors = (name?: keyof AddEditProductFormType | Array<keyof AddEditProductFormType>) => {
    if (!name) {
      setErrors({})

      return
    }

    setErrors(currentErrors => {
      const newErrors = { ...currentErrors }

      if (Array.isArray(name)) {
        name.forEach(n => {
          delete newErrors[n]
        })
      } else {
        delete newErrors[name]
      }

      return newErrors
    })
  }

  return (
    <form className='w-full pb-4 lg:h-auto' onSubmit={handleSubmit}>
      <div className='space-y-2'>
        <div className='flex flex-col gap-2 lg:flex-row'>
          <div className='relative w-8/12'>
            <FormInput id='name' label='Product Name' errorMessage={errors.product_id || errors.name}>
              {productToEdit && productToEdit.product_id !== '' ? (
                <Input id='product' className='mt-px' value={productForm.name} name='name' placeholder='Name' onChange={handleInputChange} readOnly={true} />
              ) : !productManualInput ? (
                <ProductDropdownList handleAddToCart={handleProductSelect} id='product' productName={productForm?.name} />
              ) : (
                <Input id='product' className='mt-px' type='text' name='name' value={productForm.name} onChange={handleInputChange} placeholder='Name' />
              )}
            </FormInput>
          </div>
          <div className='w-4/12'>
            <FormInput id='sku_prefix' label='SKU Prefix' errorMessage={errors.sku_prefix}>
              <div className='relative'>
                <Input id='sku_prefix' className='mt-px' name='sku_prefix' value={productForm.sku_prefix} onChange={handleInputChange} placeholder='SKU Prefix' readOnly={!skuManualInput} />
                {productManualInput && (
                  <div className='absolute right-1 top-1/2 flex items-center'>
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='mr-1 h-7 w-7 -translate-y-1/2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                            onClick={() => {
                              if (productManualInput) {
                                setSkuManualInput(!skuManualInput)
                              }
                            }}
                          >
                            {skuManualInput ? <LockOpen1Icon className='h-4 w-4' /> : <LockClosedIcon className='h-4 w-4' />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Manual Input?</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </div>
            </FormInput>
          </div>
        </div>
        <div className='flex flex-col gap-2 lg:flex-row'>
          <div className='w-1/3'>
            <FormInput id='category_id' label='Category' errorMessage={errors.category_id}>
              {productManualInput ? (
                <Select name='category_id' value={productForm.category_id} onValueChange={value => setProductFormData('category_id', value)}>
                  <SelectTrigger id='category_id' aria-label='Select Category'>
                    <SelectValue placeholder='Select Category' />
                  </SelectTrigger>
                  <SelectContent className='max-h-80'>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input id='category_id' value={categories.find(category => category.value === productForm.category_id)?.label} placeholder='Category' readOnly={true} />
              )}
            </FormInput>
          </div>
          <div className='w-1/3'>
            <FormInput id='quantity' label='Quantity' errorMessage={errors.quantity}>
              <InputNumber id='quantity' name='quantity' value={productForm.quantity} onChange={handleInputChange} placeholder='Quantity' />
            </FormInput>
          </div>
          <div className='w-1/3'>
            <FormInput id='stock_threshold' label='Threshold' errorMessage={errors.stock_threshold}>
              <InputNumber id='stock_threshold' name='stock_threshold' value={productForm.stock_threshold ?? ''} onChange={handleInputChange} placeholder='Threshold' readOnly={!productManualInput} />
            </FormInput>
          </div>
        </div>
        <div className='flex flex-col gap-2 lg:flex-row'>
          <div className='lg:w-1/3'>
            <FormInput id='buying_price' label='Buying Price' errorMessage={errors.buying_price}>
              <InputNumber id='buying_price' name='buying_price' value={productForm.buying_price} onChange={handleInputChange} placeholder='Buying Price' />
            </FormInput>
          </div>
          <div className='lg:w-1/3'>
            <FormInput id='retail_price' label='Retail Price' errorMessage={errors.retail_price}>
              <InputNumber id='retail_price' name='retail_price' value={productForm.retail_price} onChange={handleInputChange} placeholder='Retail Price' />
            </FormInput>
          </div>
          <div className='lg:w-1/3'>
            <FormInput id='selling_price' label='Selling Price' errorMessage={errors.selling_price}>
              <InputNumber id='selling_price' name='selling_price' value={productForm.selling_price} onChange={handleInputChange} placeholder='Selling Price' />
            </FormInput>
          </div>
        </div>
        <FormInput id='description' label='Description' errorMessage={errors.description}>
          <Textarea id='description' name='description' value={productForm.description ?? ''} onChange={handleInputChange} rows={4} placeholder='Description' readOnly={!productManualInput} />
        </FormInput>
      </div>
      <DialogFooter>
        <div className='flex justify-end gap-2'>
          <Button variant='secondary' className='px-2.5' onClick={handleDiscardProduct}>
            Discard
          </Button>
          <Button type='submit' className='w-21.5 space-x-px px-2.5 transition-all duration-200' disabled={productAddButtonTitle === 'Added' || productAddButtonTitle === 'Saved'}>
            {(productAddButtonTitle === 'Added' || productAddButtonTitle === 'Saved') && <CheckIcon className='h-4 w-4' />}
            <p>{productAddButtonTitle}</p>
          </Button>
        </div>
      </DialogFooter>
    </form>
  )
}

export default AddEditProductForm
