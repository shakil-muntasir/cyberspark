import { Link, useForm } from '@inertiajs/react'

import { ChevronLeft, PlusCircle } from 'lucide-react'

import DeleteModal from '@/Components/DeleteModal'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion'
import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card'
import { Input } from '@/Components/ui/input'
import { InputNumber } from '@/Components/ui/input-number'
import { Label } from '@/Components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table'
import { Textarea } from '@/Components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'
import { useDeleteModal } from '@/Contexts/DeleteModalContext'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Product, ProductForm } from '@/Pages/Product/type'

export default function ShowProduct({ product: { data: product } }: { product: Product }) {
  const { data, setData, post, processing, errors, clearErrors, reset } = useForm<ProductForm>({
    sku: product.attributes.sku,
    name: product.attributes.name,
    description: product.attributes.description ?? '',
    category: '',
    status: product.attributes.status,
    quantity: product.attributes.quantity,
    buying_price: product.attributes.buying_price,
    retail_price: product.attributes.retail_price ?? null,
    selling_price: product.attributes.selling_price
  })

  const { initializeDeleteModal } = useDeleteModal()

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setData(name as keyof ProductForm, value)
    clearErrors(name as keyof ProductForm)
  }

  const deleteModalData = {
    id: product.attributes.id,
    name: product.attributes.name,
    title: 'product',
    url: '/products'
  }

  const categories = [
    { label: 'Clothing', value: 'clothing' },
    { label: 'Electronics', value: 'electronics' },
    { label: 'Accessories', value: 'accessories' }
  ]

  const statuses = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
  ]

  return (
    <AuthenticatedLayout title='Product Details'>
      <main className='grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8'>
        <div className='mx-auto grid max-w-[68rem] flex-1 auto-rows-max gap-4'>
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
            <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>{product.attributes.name}</h1>
            <Badge variant='outline' className='ml-auto sm:ml-0'>
              In stock
            </Badge>
            <div className='hidden items-center gap-2 md:ml-auto md:flex'>
              <Button variant='secondary' size='sm' onClick={() => reset()}>
                Discard
              </Button>
              <Button size='sm'>Save Product</Button>
            </div>
          </div>
          <div className='flex flex-col lg:flex-row gap-4 lg:gap-8'>
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
                      <Input id='name' type='text' name='name' className='w-full' value={data.name} onChange={handleInputChange} />
                    </div>
                    <div className='grid gap-2'>
                      <Label htmlFor='description'>Description</Label>
                      <Textarea id='description' name='description' value={data.description} className='min-h-32' onChange={handleInputChange} placeholder='Description' />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className='grid gap-7 lg:gap-6 border-t py-6'>
                  <div className='grid gap-3'>
                    <Label>Created by</Label>
                    <div className='flex items-center justify-between'>
                      <Link href={`/users/${product.attributes.created_by_id}`}>
                        <p className='text-sm underline underline-offset-2'>{product.attributes.created_by}</p>
                      </Link>
                      <p className='text-[0.7rem] text-muted-foreground'>
                        <span className='hidden lg:inline'>Created at: </span>
                        {product.attributes.created_at}
                      </p>
                    </div>
                  </div>
                  <div className='grid gap-3'>
                    <Label>Updated by</Label>
                    <div className='flex items-center justify-between'>
                      <Link href={`/users/${product.attributes.updated_by_id}`}>
                        <p className='text-sm underline underline-offset-2'>{product.attributes.updated_by}</p>
                      </Link>
                      <p className='text-[0.7rem] text-muted-foreground'>
                        <span className='hidden lg:inline'>Updated at: </span>
                        {product.attributes.updated_at}
                      </p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Variants</CardTitle>
                  <CardDescription>Add/update the buying, selling and retail prices of product variants.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table className='hidden lg:block'>
                    <TableHeader>
                      <TableRow className='hover:bg-inherit'>
                        <TableHead>SKU</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Buying Price</TableHead>
                        <TableHead>Selling Price</TableHead>
                        <TableHead>Retail Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Label htmlFor='sku' className='sr-only'>
                            SKU
                          </Label>
                          <Input id='sku' type='text' name='sku' value={data.sku} onChange={handleInputChange} placeholder='SKU' />
                        </TableCell>
                        <TableCell>
                          <Label htmlFor='quantity' className='sr-only'>
                            Quantity
                          </Label>
                          <InputNumber id='quantity' name='quantity' type='number' value={data.quantity ?? ''} onChange={handleInputChange} />
                        </TableCell>
                        <TableCell>
                          <Label htmlFor='buying_price' className='sr-only'>
                            Buying Price
                          </Label>
                          <InputNumber id='buying_price' name='buying_price' type='number' value={data.buying_price ?? ''} onChange={handleInputChange} />
                        </TableCell>
                        <TableCell>
                          <Label htmlFor='selling_price' className='sr-only'>
                            Selling Price
                          </Label>
                          <InputNumber id='selling_price' name='selling_price' type='number' value={data.selling_price ?? ''} onChange={handleInputChange} />
                        </TableCell>
                        <TableCell>
                          <Label htmlFor='retail_price' className='sr-only'>
                            Retail Price
                          </Label>
                          <InputNumber id='retail_price' name='retail_price' type='number' value={data.retail_price ?? ''} onChange={handleInputChange} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <Accordion type='single' collapsible className='w-full lg:hidden '>
                    <AccordionItem value='item-1'>
                      <AccordionTrigger className='py-0'>SKU: {data.sku}</AccordionTrigger>
                      <AccordionContent className='space-y-2 pt-4 pb-0 mr-0.5'>
                        <div className='flex items-center justify-between'>
                          <Label htmlFor='quantity'>Quantity</Label>
                          <InputNumber id='quantity' name='quantity' type='number' value={data.quantity ?? ''} onChange={handleInputChange} />
                        </div>
                        <div className='flex items-center justify-between'>
                          <Label htmlFor='buying_price'>Buying Price</Label>
                          <InputNumber id='buying_price' name='buying_price' type='number' value={data.buying_price ?? ''} onChange={handleInputChange} />
                        </div>
                        <div className='flex items-center justify-between'>
                          <Label htmlFor='selling_price'>Selling Price</Label>
                          <InputNumber id='selling_price' name='selling_price' type='number' value={data.selling_price ?? ''} onChange={handleInputChange} />
                        </div>
                        <div className='flex items-center justify-between'>
                          <Label htmlFor='retail_price'>Retail Price</Label>
                          <InputNumber id='retail_price' name='retail_price' type='number' value={data.retail_price ?? ''} onChange={handleInputChange} />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter className='justify-center border-t p-1 lg:p-2'>
                  <Button size='sm' variant='ghost' className='gap-1'>
                    <PlusCircle className='h-3.5 w-3.5' />
                    Add Variant
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div className='grid auto-rows-max items-start gap-4 lg:gap-8 w-full lg:max-w-72'>
              <Card>
                <CardHeader>
                  <CardTitle>Product Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid gap-6'>
                    <div className='grid gap-2'>
                      <Label htmlFor='category'>Category</Label>
                      <Select name='category' value={data.category} onValueChange={value => setData('category', value)}>
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
                  <CardDescription>Once you delete a product, your actions can't be undone</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button size='sm' variant='destructive' onClick={() => initializeDeleteModal(deleteModalData)}>
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className='flex items-center justify-end gap-2 md:hidden'>
            <Button variant='secondary' size='sm' onClick={() => reset()}>
              Discard
            </Button>
            <Button size='sm' variant='default'>
              Save Product
            </Button>
          </div>
        </div>
      </main>
      <DeleteModal />
    </AuthenticatedLayout>
  )
}
