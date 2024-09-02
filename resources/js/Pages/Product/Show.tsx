import { useEffect, useState } from 'react'
import { Link, router, useForm } from '@inertiajs/react'
import { ChevronLeft } from 'lucide-react'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { Textarea } from '@/Components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'

import DeleteModal from '@/Components/DeleteModal'

import { DeleteModalData, useDeleteModal } from '@/Contexts/DeleteModalContext'
import ProductVariantData from '@/Pages/Product/Partials/variant-data'
import { Product, ProductForm } from '@/Pages/Product/type'
import { SelectOption } from '@/Types'

// TODO: fix width

interface ShowProductTypes {
  categories: SelectOption[]
  product: Product
  statuses: SelectOption[]
}

const ShowProduct: React.FC<ShowProductTypes> = ({ categories, product, statuses }) => {
  const { initializeDeleteModal } = useDeleteModal()

  const initialProductData = {
    name: product.data.attributes.name,
    description: product.data.attributes.description ?? '',
    category_id: product.data.attributes.category_id,
    status: product.data.attributes.status
  }
  const { data, setData, clearErrors, reset } = useForm<ProductForm>(initialProductData)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setData(name as keyof ProductForm, value)
    clearErrors(name as keyof ProductForm)
  }

  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false)

  useEffect(() => {
    const hasChanges = Object.keys(initialProductData).some(key => data[key as keyof ProductForm] !== initialProductData[key as keyof ProductForm])

    setIsSaveButtonDisabled(!hasChanges)
  }, [data])

  const deleteModalData: DeleteModalData = {
    id: product.data.attributes.id,
    name: product.data.attributes.name,
    title: 'product',
    onConfirm: () => router.visit('/products')
  }

  return (
    <AuthenticatedLayout title='Product Details'>
      <main className='grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8'>
        <div className='mx-auto grid max-w-[80rem] flex-1 auto-rows-max gap-4'>
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
            <Badge variant='outline' className='ml-auto sm:ml-0'>
              In stock
            </Badge>
            <div className='hidden items-center gap-2 md:ml-auto md:flex'>
              <Button variant='secondary' size='sm' onClick={() => reset()}>
                Discard
              </Button>
              <Button size='sm' disabled={isSaveButtonDisabled}>
                Save Product
              </Button>
            </div>
          </div>
          <div className='flex flex-col gap-4 lg:flex-row lg:gap-8'>
            <div className='grid auto-rows-max items-start gap-4 lg:gap-8'>
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                  <CardDescription>Update product details.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='grid gap-6'>
                    <div className='grid gap-2'>
                      <Label htmlFor='name'>Name</Label>
                      <Input id='name' type='text' name='name' className='w-full' value={data.name} onChange={handleInputChange} autoComplete='name' />
                    </div>
                    <div className='grid gap-2'>
                      <Label htmlFor='description'>Description</Label>
                      <Textarea id='description' name='description' value={data.description} className='min-h-32' onChange={handleInputChange} placeholder='Description' />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className='grid gap-7 border-t py-6 lg:gap-6'>
                  <div className='grid gap-3'>
                    <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Created by</span>
                    <div className='flex items-center justify-between'>
                      <Link href={`/users/${product.data.attributes.created_by_id}`}>
                        <p className='text-sm underline underline-offset-2'>{product.data.attributes.created_by}</p>
                      </Link>
                      <p className='text-[0.7rem] text-muted-foreground'>
                        <span className='hidden lg:inline'>Created at: </span>
                        {product.data.attributes.created_at}
                      </p>
                    </div>
                  </div>
                  <div className='grid gap-3'>
                    <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Updated by</span>
                    <div className='flex items-center justify-between'>
                      <Link href={`/users/${product.data.attributes.updated_by_id}`}>
                        <p className='text-sm underline underline-offset-2'>{product.data.attributes.updated_by}</p>
                      </Link>
                      <p className='text-[0.7rem] text-muted-foreground'>
                        <span className='hidden lg:inline'>Updated at: </span>
                        {product.data.attributes.updated_at}
                      </p>
                    </div>
                  </div>
                </CardFooter>
              </Card>

              {/* The Product Variants table and add form will be rendered here */}
              <ProductVariantData product={product} variants={product.data.relationships?.variants} />
            </div>
            <div className='grid w-full auto-rows-max items-start gap-4 lg:max-w-72 lg:gap-8'>
              <Card>
                <CardHeader>
                  <CardTitle>Product Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid gap-6'>
                    <div className='grid gap-2'>
                      <Label htmlFor='category'>Category</Label>
                      <Select name='category' value={data.category_id} onValueChange={value => setData('category_id', value)}>
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
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid gap-6'>
                    <div className='grid gap-2'>
                      <Label htmlFor='status'>Status</Label>
                      <Select name='status' value={data.status} onValueChange={value => setData('status', value)}>
                        <SelectTrigger id='status' aria-label='Select status'>
                          <SelectValue placeholder='Select status' />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map(status => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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
            <Button size='sm' disabled={isSaveButtonDisabled}>
              Save Product
            </Button>
          </div>
        </div>
      </main>
      <DeleteModal />
    </AuthenticatedLayout>
  )
}

export default ShowProduct
