import { Link, useForm } from '@inertiajs/react'

import { CheckIcon, ChevronLeft, PlusCircle, SquareCheckBig, SquareIcon, Trash2Icon, X } from 'lucide-react'

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
import { cn, formatCurrency, toTitleCase } from '@/Lib/utils'
import { Product, ProductForm, ProductStatus, ProductVariant } from '@/Pages/Product/type'
import { useTheme } from '@/Providers/theme-provider'
import { Pencil2Icon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'

// TODO: fix width

export default function ShowProduct({ product: { data: product }, statuses }: { product: Product; statuses: ProductStatus[] }) {
  const initialProductData = {
    name: product.attributes.name,
    description: product.attributes.description ?? '',
    category: '',
    status: product.attributes.status
  }

  const { data, setData, post, processing, errors, clearErrors, reset } = useForm<ProductForm>(initialProductData)

  const [variants, setVariants] = useState<ProductVariant[]>(product.relationships.variants)

  const [newVariant, setNewVariant] = useState<ProductVariant>({
    type: 'product_variants',
    id: crypto.randomUUID(),
    attributes: {
      id: crypto.randomUUID(),
      product_id: product.id,
      sku: '',
      quantity: '',
      buying_price: '',
      retail_price: '',
      selling_price: '',
      status: 'active',
      created_by_id: '',
      updated_by_id: '',
      created_by: 'john doe',
      updated_by: 'jane doe',
      created_at: '',
      updated_at: ''
    }
  })

  const handleVariantInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setNewVariant(prevVariant => ({
      ...prevVariant,
      attributes: {
        ...prevVariant.attributes,
        [name]: value
      }
    }))
  }

  const [addVariantIsOpen, setAddVariantIsOpen] = useState(false)

  const addNewVariant = () => {
    setAddVariantIsOpen(false)
    setAccordionValue('')
    setVariants([...variants, newVariant])
    setNewVariant({
      type: 'product_variants',
      id: crypto.randomUUID(),
      attributes: {
        id: crypto.randomUUID(),
        product_id: product.id,
        sku: '',
        quantity: '',
        buying_price: '',
        retail_price: '',
        selling_price: '',
        status: 'active',
        created_by_id: '',
        updated_by_id: '',
        created_by: 'john doe',
        updated_by: 'jane doe',
        created_at: '',
        updated_at: ''
      }
    })
  }

  const deleteVariant = (id: string) => {
    const filteredVariants = variants.filter(variant => variant.id !== id)
    setVariants(filteredVariants)
  }

  const handleVariantStatus = (id: string) => {
    setVariants(prevVariants =>
      prevVariants.map(variant =>
        variant.id === id
          ? {
              ...variant,
              attributes: {
                ...variant.attributes,
                status: variant.attributes.status === 'active' ? 'inactive' : 'active'
              }
            }
          : variant
      )
    )
  }

  const { initializeDeleteModal } = useDeleteModal()

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

  const { theme } = useTheme()

  const [accordionValue, setAccordionValue] = useState('')

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
            <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>{product.attributes.name}</h1>
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
                      <Input id='name' type='text' name='name' className='w-full' value={data.name} onChange={handleInputChange} autoComplete='name' />
                    </div>
                    <div className='grid gap-2'>
                      <Label htmlFor='description'>Description</Label>
                      <Textarea id='description' name='description' value={data.description} className='min-h-32' onChange={handleInputChange} placeholder='Description' />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className='grid gap-7 lg:gap-6 border-t py-6'>
                  <div className='grid gap-3'>
                    <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Created by</span>
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
                    <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Updated by</span>
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
                <CardContent className='lg:p-6 pb-3'>
                  <Table className='hidden lg:block'>
                    <TableHeader>
                      <TableRow className='hover:bg-inherit'>
                        <TableHead>SKU</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Buying Price</TableHead>
                        <TableHead>Selling Price</TableHead>
                        <TableHead>Retail Price</TableHead>
                        <TableHead className='text-center'>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {variants.length === 0 ? (
                        <TableRow>
                          <div className='flex h-12 px-4 text-center align-middle font-medium text-muted-foreground'>Nothing to show</div>
                        </TableRow>
                      ) : (
                        variants.map(variant => (
                          <TableRow key={variant.id}>
                            <TableCell>
                              <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only'>SKU</span>
                              <div>{variant.attributes.sku}</div>
                            </TableCell>
                            <TableCell>
                              <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only'>Quantity</span>
                              <div className='text-right font-medium'>{variant.attributes.quantity}</div>
                            </TableCell>
                            <TableCell>
                              <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only'>Buying Price</span>
                              <div className='text-right font-medium'>{formatCurrency(variant.attributes.buying_price)}</div>
                            </TableCell>
                            <TableCell>
                              <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only'>Selling Price</span>
                              <div className='text-right font-medium'>{formatCurrency(variant.attributes.selling_price)}</div>
                            </TableCell>
                            <TableCell>
                              <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only'>Retail Price</span>
                              <div className='text-right font-medium'>{formatCurrency(variant.attributes.retail_price)}</div>
                            </TableCell>
                            <TableCell>
                              <span className='sr-only'>Actions</span>
                              <div className='flex items-center justify-center h-full'>
                                <TooltipProvider>
                                  <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                      <Button type='button' variant='ghost' size='icon' className='group h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={() => null}>
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
                                      {variant.attributes.status === 'active' ? (
                                        <Button type='button' variant='ghost' size='icon' className='group h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={() => handleVariantStatus(variant.id)}>
                                          <SquareCheckBig className='h-4 w-4 text-foreground group-hover:text-foreground' />
                                          <span className='sr-only'>Status</span>
                                        </Button>
                                      ) : (
                                        <Button type='button' variant='ghost' size='icon' className='group h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={() => handleVariantStatus(variant.id)}>
                                          <SquareIcon className='h-4 w-4 text-muted-foreground group-hover:text-foreground' />
                                          <span className='sr-only'>Status</span>
                                        </Button>
                                      )}
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{toTitleCase(variant.attributes.status)}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                      <Button type='button' variant='ghost' size='icon' className='group h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={() => deleteVariant(variant.id)}>
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
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                      {addVariantIsOpen && (
                        <TableRow>
                          <TableCell className='px-1'>
                            <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only'>SKU</span>
                            <div>
                              <Input className='px-2' name='sku' value={newVariant.attributes.sku} onChange={handleVariantInput} placeholder='SKU' />
                            </div>
                          </TableCell>
                          <TableCell className='px-1'>
                            <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only'>Quantity</span>
                            <div>
                              <InputNumber className='px-2' id='quantity' name='quantity' value={newVariant.attributes.quantity} onChange={handleVariantInput} placeholder='Quantity' />
                            </div>
                          </TableCell>
                          <TableCell className='px-1'>
                            <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only'>Buying Price</span>
                            <div>
                              <InputNumber className='px-2' id='buying_price' name='buying_price' value={newVariant.attributes.buying_price} onChange={handleVariantInput} placeholder='Buying price' />
                            </div>
                          </TableCell>
                          <TableCell className='px-1'>
                            <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only'>Retail Price</span>
                            <InputNumber className='px-2' id='retail_price' name='retail_price' value={newVariant.attributes.retail_price} onChange={handleVariantInput} placeholder='Retail price' />
                          </TableCell>
                          <TableCell className='px-1'>
                            <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only'>Selling Price</span>
                            <InputNumber className='px-2' id='selling_price' name='selling_price' value={newVariant.attributes.selling_price} onChange={handleVariantInput} placeholder='Selling price' />
                          </TableCell>

                          <TableCell className='px-1'>
                            <span className='sr-only'>Actions</span>
                            <div className='flex items-center justify-center h-full gap-3'>
                              <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                  <TooltipTrigger asChild>
                                    <Button type='button' variant={theme === 'dark' ? 'default' : 'outline'} size='icon' className='group h-7 w-7 text-gray-500 hover:text-gray-900' onClick={addNewVariant}>
                                      <CheckIcon className='h-4 w-4 dark:file:text-primary-foreground/80 dark:file:group-hover:text-green-600' />
                                      <span className='sr-only'>Add</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Add</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                  <TooltipTrigger asChild>
                                    <Button type='button' variant='destructive' size='icon' className='group h-7 w-7' onClick={() => setAddVariantIsOpen(false)}>
                                      <X className='h-4 w-4 text-white/80 group-hover:text-white' />
                                      <span className='sr-only'>Discard</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Discard</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <Accordion type='single' value={accordionValue} onValueChange={setAccordionValue} collapsible className='w-full lg:hidden'>
                    {variants.map((variant, index) => (
                      <AccordionItem key={variant.id} value={variant.id}>
                        <AccordionTrigger className={`py-2.5 ${index !== variants.length - 1 ? 'border-b' : ''}`}>
                          <div>
                            <span className='text-muted-foreground font-semibold'>SKU:</span> {variant.attributes.sku}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className='space-y-3 pt-4 pb-0 mr-0.5 '>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm text-muted-foreground font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Quantity</span>
                            <div className='text-right font-medium'>{variant.attributes.quantity}</div>
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm text-muted-foreground font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Buying Price</span>
                            <div className='text-right font-medium'>{formatCurrency(variant.attributes.buying_price)}</div>
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm text-muted-foreground font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Selling Price</span>
                            <div className='text-right font-medium'>{formatCurrency(variant.attributes.selling_price)}</div>
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm text-muted-foreground font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Retail Price</span>

                            <div className='text-right font-medium'>{formatCurrency(variant.attributes.retail_price)}</div>
                          </div>
                          <div className='grid grid-cols-3 space-x-2'>
                            <Button type='button' variant='ghost' size='sm' className='group  text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={() => null}>
                              <div className='flex items-center gap-2'>
                                <Pencil2Icon className='h-4 w-4 text-muted-foreground group-hover:text-foreground' />
                                <span className='tracking-wider'>Edit</span>
                              </div>
                            </Button>
                            <Button type='button' variant='ghost' size='sm' className='group text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 ' onClick={() => handleVariantStatus(variant.id)}>
                              <div className='flex items-center gap-2'>
                                {variant.attributes.status === 'active' ? <SquareCheckBig className='h-4 w-4 text-foreground bg-' /> : <SquareIcon className='h-4 w-4 text-muted-foreground' />}
                                <span className={cn('tracking-wider', variant.attributes.status === 'active' ? 'text-foreground' : 'text-muted-foreground')}>{toTitleCase(variant.attributes.status)}</span>
                              </div>
                            </Button>

                            <Button type='button' variant='ghost' size='sm' className='group text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 gap-1 inline-flex items-center' onClick={() => deleteVariant(variant.id)}>
                              <div className=' flex items-center gap-2'>
                                <Trash2Icon className='h-4 w-4 text-red-400 group-hover:text-red-600' />
                                <span className='tracking-wider'>Remove</span>
                              </div>
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                    <AccordionItem value='add_variant'>
                      <AccordionContent className='pb-0 mr-0.5'>
                        <div className={`space-y-3 pt-2.5 border-t`}>
                          <h1 className='text-lg font-semibold tracking-wide py-0.5'>Add new Variant</h1>
                          <div className='flex items-center justify-between'>
                            <Label htmlFor='sku_2'>SKU</Label>
                            <div>
                              <Input id='sku_2' name='sku' value={newVariant.attributes.sku} onChange={handleVariantInput} placeholder='SKU'></Input>
                            </div>
                          </div>
                          <div className='flex items-center justify-between'>
                            <Label htmlFor='quantity_2'>Quantity</Label>
                            <div>
                              <InputNumber id='quantity_2' name='quantity' value={newVariant.attributes.quantity} onChange={handleVariantInput} placeholder='Quantity'></InputNumber>
                            </div>
                          </div>
                          <div className='flex items-center justify-between'>
                            <Label htmlFor='buying_price_2'>Buying Price</Label>
                            <div>
                              <InputNumber id='buying_price_2' name='buying_price' value={newVariant.attributes.buying_price} onChange={handleVariantInput} placeholder='Buying price'></InputNumber>
                            </div>
                          </div>
                          <div className='flex items-center justify-between'>
                            <Label htmlFor='retail_price_2'>Retail Price</Label>
                            <div>
                              <InputNumber id='retail_price_2' name='retail_price' value={newVariant.attributes.retail_price} onChange={handleVariantInput} placeholder='Retail price'></InputNumber>
                            </div>
                          </div>
                          <div className='flex items-center justify-between'>
                            <Label htmlFor='selling_price_2'>Selling Price</Label>
                            <div>
                              <InputNumber id='selling_price_2' name='selling_price' value={newVariant.attributes.selling_price} onChange={handleVariantInput} placeholder='Selling price'></InputNumber>
                            </div>
                          </div>
                          <div className='flex items-center justify-center space-x-2'>
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              className='group min-w-24 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 gap-1 inline-flex items-center'
                              onClick={() => {
                                setAddVariantIsOpen(false)
                                setAccordionValue('')
                              }}
                            >
                              <div className=' flex items-center gap-2'>
                                <X className='h-4 w-4 text-red-400' />
                                <span className='tracking-wider'>Discard</span>
                              </div>
                            </Button>
                            <Button type='button' variant='outline' size='sm' className='group min-w-24 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={addNewVariant}>
                              <div className='flex items-center gap-2'>
                                <CheckIcon className='h-4 w-4 text-muted-foreground group-hover:text-foreground' />
                                <span className='tracking-wider'>Add</span>
                              </div>
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter className='justify-center border-t p-1 lg:p-2'>
                  <Button
                    size='sm'
                    variant='ghost'
                    className='gap-1'
                    onClick={() => {
                      setAddVariantIsOpen(true)
                      setAccordionValue('add_variant')
                    }}
                  >
                    <PlusCircle className='h-4 w-4' />
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
