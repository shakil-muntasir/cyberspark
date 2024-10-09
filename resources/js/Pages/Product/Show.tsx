import { useEffect, useState } from 'react'
import { Link, useForm } from '@inertiajs/react'
import { AlertCircleIcon, ChevronLeft, Loader2Icon } from 'lucide-react'
import { LockClosedIcon, LockOpen1Icon } from '@radix-ui/react-icons'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card'
import { Input } from '@/Components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { Textarea } from '@/Components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'
import { toast } from '@/Components/ui/use-toast'

import DeleteModal from '@/Components/DeleteModal'

import { DeleteModalData, useDeleteModal } from '@/Contexts/DeleteModalContext'
import FormInput from '@/Components/FormInput'
import ToastErrorDescription from '@/Components/ToastErrorDescription'

import { toTitleCase } from '@/Lib/utils'
import ProductVariantData from '@/Pages/Product/Partials/variant-data'
import { ProductForm, ProductResource } from '@/Pages/Product/types'
import { SelectOption } from '@/Types'
import { InputNumber } from '@/Components/ui/input-number'

interface ShowProductTypes {
  categories: SelectOption[]
  product: ProductResource
  statuses: SelectOption[]
}

const ShowProduct: React.FC<ShowProductTypes> = ({ categories, product, statuses }) => {
  const { initializeDeleteModal } = useDeleteModal()

  const initialProductData: ProductForm = {
    name: product.data.attributes.name,
    sku_prefix: product.data.attributes.sku_prefix,
    description: product.data.attributes.description,
    category_id: product.data.attributes.category_id,
    status: product.data.attributes.status,
    stock_threshold: product.data.attributes.stock_threshold
  }
  const { data, setData, patch, delete: destroy, errors, clearErrors, reset } = useForm<ProductForm>(initialProductData)
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [skuManualInput, setSkuManualInput] = useState(false)
  const [submitButtonText, setSubmitButtonText] = useState<'Save Product' | 'Processing' | 'Error'>('Save Product')

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setData(name as keyof ProductForm, value)
    clearErrors(name as keyof ProductForm)
  }

  const handleEditProduct = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setSubmitButtonText('Processing')

    setTimeout(() => {
      patch(route('products.update', product.data.id), {
        onSuccess: handleSuccess,
        onError: handleError,
        preserveScroll: true
      })
    }, 500)
  }

  const handleDeleteProduct = async () => {
    setTimeout(() => {
      destroy(route('products.destroy', product.data.id), {
        onSuccess: () => {
          toast({
            title: 'Success!',
            description: 'The product has been deleted successfully.',
            duration: 2000
          })
        },
        onError: (errors: Partial<Record<keyof ProductForm, string>>) => {
          toast({
            variant: 'destructive',
            title: 'Error deleting product!',
            description: <ToastErrorDescription errors={errors} />,
            duration: 3000
          })
        },
        preserveScroll: true
      })
    }, 1)
  }

  const handleSuccess = () => {
    setTimeout(() => {
      toast({
        title: 'Success!',
        description: 'The product has been updated successfully.',
        duration: 2000
      })
      setLoading(false)
      setSubmitButtonText('Save Product')
    }, 200)
  }

  const handleError = () => {
    setSubmitButtonText('Error')
    setTimeout(() => {
      setLoading(false)
      setSubmitButtonText('Save Product')
    }, 2000)
  }

  useEffect(() => {
    const hasChanges = Object.keys(initialProductData).some(key => data[key as keyof ProductForm] !== initialProductData[key as keyof ProductForm])

    setIsSaveButtonDisabled(!hasChanges)
  }, [data])

  const deleteModalData: DeleteModalData = {
    id: product.data.id,
    name: product.data.attributes.name,
    title: 'product',
    onConfirm: handleDeleteProduct
  }

  let availability: 'default' | 'destructive' | 'secondary' | 'outline' = 'default'
  switch (product.data.attributes.availability) {
    case 'available':
      availability = 'default'
      break
    case 'stock low':
      availability = 'outline'
      break
    case 'out of stock':
      availability = 'destructive'
      break
    default:
      availability = 'default'
  }

  return (
    <AuthenticatedLayout title='Product Details'>
      <main className='flex w-full justify-center sm:px-6 sm:py-0'>
        <div className='flex max-w-[80rem] flex-1 flex-col gap-4'>
          <div className='flex items-center gap-4'>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button variant='outline' size='icon' className='h-7 w-7' onClick={() => window.history.back()}>
                    <ChevronLeft className='h-4 w-4' />
                    <span className='sr-only'>Back</span>
                  </Button>
                </TooltipTrigger>

                <TooltipContent>
                  <p>Go back</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>{product.data.attributes.name}</h1>

            <Badge variant={availability} className='ml-auto sm:ml-0'>
              {toTitleCase(product.data.attributes.availability)}
            </Badge>

            <div className='hidden items-center gap-2 md:ml-auto md:flex'>
              <Button variant='secondary' size='sm' onClick={() => reset()}>
                Discard
              </Button>

              <Button onClick={handleEditProduct} size='sm' className='lg:w-full' disabled={isSaveButtonDisabled || loading}>
                {submitButtonText === 'Processing' ? (
                  <>
                    <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
                  </>
                ) : submitButtonText === 'Error' ? (
                  <>
                    <AlertCircleIcon className='mr-2 h-4 w-4 text-destructive' />
                  </>
                ) : null}
                <span>{submitButtonText}</span>
              </Button>
            </div>
          </div>
          <div className='flex flex-col gap-4 lg:flex-row lg:gap-6'>
            <div className='flex flex-1 flex-col gap-4 lg:gap-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                  <CardDescription>Update product details.</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className='grid gap-4'>
                    <div className='flex flex-col gap-4 lg:flex-row'>
                      <div className='lg:w-7/12'>
                        <FormInput id='name' label='Product Name' errorMessage={errors.name}>
                          <Input id='name' type='text' name='name' value={data.name} onChange={handleInputChange} placeholder='Name' autoComplete='off' />
                        </FormInput>
                      </div>

                      <div className='lg:w-2/12'>
                        <FormInput id='sku_prefix' label='SKU Prefix' errorMessage={errors.sku_prefix}>
                          <div className='relative'>
                            <Input id='sku_prefix' name='sku_prefix' value={data.sku_prefix} onChange={handleInputChange} placeholder='SKU Prefix' readOnly={!skuManualInput} autoComplete='off' />
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
                        </FormInput>
                      </div>

                      <div className='w-3/12'>
                        <FormInput id='stock_threshold' label='Stock Threshold' errorMessage={errors.stock_threshold}>
                          <InputNumber id='stock_threshold' name='stock_threshold' value={data.stock_threshold ?? ''} onChange={handleInputChange} placeholder='Stock Threshold' />
                        </FormInput>
                      </div>
                    </div>

                    <FormInput id='description' label='Description' errorMessage={errors.description}>
                      <Textarea id='description' rows={4} name='description' value={data.description ?? ''} onChange={handleInputChange} placeholder='Description' autoComplete='off' />
                    </FormInput>
                  </div>
                </CardContent>

                {product.data.attributes.created_by || product.data.attributes.updated_by ? (
                  <CardFooter className='grid gap-7 border-t py-6 lg:gap-6'>
                    {product.data.attributes.created_by && (
                      <div className='grid gap-3'>
                        <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Created by</span>
                        <div className='flex items-center justify-between'>
                          <Link href={`/users/${product.data.attributes.created_by?.id}`}>
                            <p className='text-sm underline underline-offset-2'>{product.data.attributes.created_by?.name}</p>
                          </Link>
                          <p className='text-[0.7rem] text-muted-foreground'>
                            <span className='hidden lg:inline'>Created at: </span>
                            {product.data.attributes.created_at}
                          </p>
                        </div>
                      </div>
                    )}

                    {product.data.attributes.updated_by && (
                      <div className='grid gap-3'>
                        <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Updated by</span>
                        <div className='flex items-center justify-between'>
                          <Link href={`/users/${product.data.attributes.updated_by?.id}`}>
                            <p className='text-sm underline underline-offset-2'>{product.data.attributes.updated_by?.name}</p>
                          </Link>
                          <p className='text-[0.7rem] text-muted-foreground'>
                            <span className='hidden lg:inline'>Updated at: </span>
                            {product.data.attributes.updated_at}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardFooter>
                ) : null}
              </Card>

              {/* The Product Variants table and add form will be rendered here */}
              <ProductVariantData product={product.data} variants={product.data.relationships?.variants} />
            </div>

            <div className='grid w-full auto-rows-max items-start gap-4 lg:max-w-72 lg:gap-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Product Category</CardTitle>
                </CardHeader>

                <CardContent className='pb-2'>
                  <div className='grid gap-6'>
                    <FormInput id='category_id' label='Category' errorMessage={errors.category_id}>
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
                    </FormInput>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>

                <CardContent className='pb-2'>
                  <div className='grid gap-6'>
                    <FormInput id='status' label='Status' errorMessage={errors.status}>
                      <Select
                        name='status'
                        value={data.status}
                        onValueChange={value => {
                          setData('status', value)
                          clearErrors('status')
                        }}
                      >
                        <SelectTrigger id='status' aria-label='Select Status'>
                          <SelectValue placeholder='Select Status' />
                        </SelectTrigger>

                        <SelectContent>
                          {statuses.map(status => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormInput>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Delete Product</CardTitle>
                  <CardDescription>Once you delete a product, your actions can&apos;t be undone</CardDescription>
                </CardHeader>

                <CardContent>
                  <Button size='sm' variant='destructive' onClick={() => initializeDeleteModal(deleteModalData)}>
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* for mobile view only */}
          <div className='flex items-center justify-end gap-2 md:hidden'>
            <Button variant='secondary' size='sm' onClick={() => reset()}>
              Discard
            </Button>

            <Button onClick={handleEditProduct} size='sm' className='lg:w-full' disabled={isSaveButtonDisabled || loading}>
              {submitButtonText === 'Processing' ? (
                <>
                  <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
                </>
              ) : submitButtonText === 'Error' ? (
                <>
                  <AlertCircleIcon className='mr-2 h-4 w-4 text-destructive' />
                </>
              ) : null}
              <span>{submitButtonText}</span>
            </Button>
          </div>
        </div>
      </main>

      <DeleteModal />
    </AuthenticatedLayout>
  )
}

export default ShowProduct
