import { CheckIcon, PlusCircle, SquareCheckBig, SquareIcon, Trash2Icon, X } from 'lucide-react'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion'
import { Button } from '@/Components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card'
import { Input } from '@/Components/ui/input'
import { InputNumber } from '@/Components/ui/input-number'
import { Label } from '@/Components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'
import { toast } from '@/Components/ui/use-toast'
import { useDeleteModal } from '@/Contexts/DeleteModalContext'
import { cn, formatCurrency, toTitleCase } from '@/Lib/utils'
import { Product, ProductVariant, ProductVariantForm } from '@/Pages/Product/type'
import { useTheme } from '@/Providers/theme-provider'
import { useForm } from '@inertiajs/react'
import { Pencil2Icon } from '@radix-ui/react-icons'
import { useState } from 'react'

interface ProductVariantDataProps {
  product: Product
  variants: ProductVariant[]
}

const ProductVariantData: React.FC<ProductVariantDataProps> = ({ product, variants }) => {
  const { theme } = useTheme()
  const [accordionValue, setAccordionValue] = useState('')
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const { initializeDeleteModal } = useDeleteModal()

  const initialFormData: ProductVariantForm = {
    sku: '',
    quantity: '',
    buying_price: '',
    retail_price: '',
    selling_price: ''
  }

  const { data, setData, post, patch, delete: destroy, processing, errors, clearErrors, reset } = useForm<ProductVariantForm>(initialFormData)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setData(name as keyof ProductVariantForm, value)
    clearErrors(name as keyof ProductVariantForm)
  }

  const handleAddVariant = async (event: React.FormEvent) => {
    event.preventDefault()

    setTimeout(() => {
      post(route('products.variants.store', { product: product.data.id }), {
        preserveScroll: true,
        onSuccess: () => handleSuccess('New product variant has been added successfully.'),
        onError: handleError
      })
    }, 500)
  }

  const handleEditVariant = async (event: React.FormEvent) => {
    event.preventDefault()

    setTimeout(() => {
      patch(route('products.variants.update', { product: product.data.id, variant: data.id }), {
        preserveScroll: true,
        onSuccess: () => handleSuccess('Product variant has been updated successfully.'),
        onError: handleError
      })
    }, 500)
  }

  const handleDeleteVariant = async (variant: ProductVariant) => {
    initializeDeleteModal({
      id: variant.id,
      name: variant.attributes.sku,
      title: 'product variants',
      onConfirm: () => {
        setTimeout(() => {
          destroy(route('products.variants.destroy', { product: product.data.id, variant: variant.id }), {
            preserveScroll: true,
            onSuccess: () => handleSuccess('Product variant has been deleted successfully.'),
            onError: handleError
          })
        }, 500)
      }
    })
  }

  const handleSuccess = (description: string) => {
    setIsAddFormOpen(false)
    setAccordionValue('')
    setTimeout(() => {
      reset()
      toast({
        title: 'Success!',
        description,
        duration: 2000
      })
    }, 200)
  }

  const handleError = (errors: Partial<Record<keyof ProductVariantForm, string>>) => {
    toast({
      variant: 'destructive',
      title: 'Error adding variant!',
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

  const showForm = () => {
    setIsAddFormOpen(true)
    setAccordionValue('add_variant')
  }

  const handleVariantStatusChange = () => {
    // TODO: implement update variant status
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Variants</CardTitle>
          <CardDescription>Add/update the buying, selling and retail prices of product variants.</CardDescription>
        </CardHeader>
        <CardContent className='lg:p-6 pb-3'>
          {/* Desktop view */}
          <Table className='hidden lg:block'>
            <TableHeader>
              <TableRow className='hover:bg-inherit'>
                <TableHead>SKU</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Buying Price</TableHead>
                <TableHead>Retail Price</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead className='text-center'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='text-center'>
                    No variants found.
                  </TableCell>
                </TableRow>
              ) : (
                variants.map(variant => (
                  <TableRow key={variant.id}>
                    <TableCell>
                      {variant.id !== data.id ? (
                        <>
                          <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only'>SKU</span>
                          <div>{variant.attributes.sku}</div>
                        </>
                      ) : (
                        <>
                          <Label htmlFor={`edit_sku_${variant.id}`} className='sr-only'>
                            SKU
                          </Label>
                          <Input id={`edit_sku_${variant.id}`} className='px-2' name='sku' value={data.sku} onChange={handleInputChange} placeholder='SKU' />
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      {variant.id !== data.id ? (
                        <>
                          <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only'>Quantity</span>
                          <div>{variant.attributes.quantity}</div>
                        </>
                      ) : (
                        <>
                          <Label htmlFor={`edit_quantity_${variant.id}`} className='sr-only'>
                            Quantity
                          </Label>
                          <InputNumber id={`edit_quantity_${variant.id}`} className='px-2' name='quantity' value={data.quantity} onChange={handleInputChange} placeholder='Quantity' />
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      {variant.id !== data.id ? (
                        <>
                          <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only'>Buying Price</span>
                          <div className='text-right font-medium'>{formatCurrency(variant.attributes.buying_price)}</div>
                        </>
                      ) : (
                        <>
                          <Label htmlFor={`edit_buying_price_${variant.id}`} className='sr-only'>
                            Buying Price
                          </Label>
                          <InputNumber id={`edit_buying_price_${variant.id}`} className='px-2' name='buying_price' value={data.buying_price} onChange={handleInputChange} placeholder='Buying Price' />
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      {variant.id !== data.id ? (
                        <>
                          <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only'>Retail Price</span>
                          <div className='text-right font-medium'>{formatCurrency(variant.attributes?.retail_price ?? '')}</div>
                        </>
                      ) : (
                        <>
                          <Label htmlFor={`edit_retail_price_${variant.id}`} className='sr-only'>
                            Retail Price
                          </Label>
                          <InputNumber id={`edit_retail_price_${variant.id}`} className='px-2' name='retail_price' value={data.retail_price ?? ''} onChange={handleInputChange} placeholder='Retail Price' />
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      {variant.id !== data.id ? (
                        <>
                          <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only'>Selling Price</span>
                          <div className='text-right font-medium'>{formatCurrency(variant.attributes.selling_price)}</div>
                        </>
                      ) : (
                        <>
                          <Label htmlFor={`edit_selling_price_${variant.id}`} className='sr-only'>
                            Selling Price
                          </Label>
                          <InputNumber id={`edit_selling_price_${variant.id}`} className='px-2' name='selling_price' value={data.selling_price} onChange={handleInputChange} placeholder='Selling Price' />
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className='sr-only'>Actions</span>
                      {variant.id !== data.id ? (
                        <div className='flex items-center justify-center h-full'>
                          <TooltipProvider>
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger asChild>
                                <Button type='button' variant='ghost' size='icon' className='group h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={() => setData(variant.attributes)}>
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
                                  <Button type='button' variant='ghost' size='icon' className='group h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={() => handleVariantStatusChange()}>
                                    <SquareCheckBig className='h-4 w-4 text-foreground group-hover:text-foreground' />
                                    <span className='sr-only'>Status</span>
                                  </Button>
                                ) : (
                                  <Button type='button' variant='ghost' size='icon' className='group h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={() => handleVariantStatusChange()}>
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
                                <Button type='button' variant='ghost' size='icon' className='group h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={() => handleDeleteVariant(variant)}>
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
                      ) : (
                        <div className='flex items-center justify-center h-full gap-3'>
                          <TooltipProvider>
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger asChild>
                                <Button type='button' variant={theme === 'dark' ? 'default' : 'outline'} size='icon' className='group h-7 w-7 text-gray-500 hover:text-gray-900' onClick={handleEditVariant}>
                                  <CheckIcon className='h-4 w-4 dark:file:text-primary-foreground/80 dark:file:group-hover:text-green-600' />
                                  <span className='sr-only'>Update</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Update</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger asChild>
                                <Button type='button' variant='destructive' size='icon' className='group h-7 w-7' onClick={() => setData(initialFormData)}>
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
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
              {isAddFormOpen && (
                <TableRow>
                  <TableCell className='px-1'>
                    <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only'>SKU</span>
                    <div>
                      <Input className='px-2' name='sku' value={data.sku} onChange={handleInputChange} placeholder='SKU' />
                    </div>
                  </TableCell>
                  <TableCell className='px-1'>
                    <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only'>Quantity</span>
                    <div>
                      <InputNumber className='px-2' id='quantity' name='quantity' value={data.quantity} onChange={handleInputChange} placeholder='Quantity' />
                    </div>
                  </TableCell>
                  <TableCell className='px-1'>
                    <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only'>Buying Price</span>
                    <div>
                      <InputNumber className='px-2' id='buying_price' name='buying_price' value={data.buying_price} onChange={handleInputChange} placeholder='Buying price' />
                    </div>
                  </TableCell>
                  <TableCell className='px-1'>
                    <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only'>Retail Price</span>
                    <InputNumber className='px-2' id='retail_price' name='retail_price' value={data.retail_price ?? ''} onChange={handleInputChange} placeholder='Retail price' />
                  </TableCell>
                  <TableCell className='px-1'>
                    <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only'>Selling Price</span>
                    <InputNumber className='px-2' id='selling_price' name='selling_price' value={data.selling_price} onChange={handleInputChange} placeholder='Selling price' />
                  </TableCell>

                  <TableCell className='px-1'>
                    <span className='sr-only'>Actions</span>
                    <div className='flex items-center justify-center h-full gap-3'>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <Button type='button' variant={theme === 'dark' ? 'default' : 'outline'} size='icon' className='group h-7 w-7 text-gray-500 hover:text-gray-900' onClick={handleAddVariant}>
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
                            <Button type='button' variant='destructive' size='icon' className='group h-7 w-7' onClick={() => setIsAddFormOpen(false)}>
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
          {/* Mobile view */}
          <Accordion type='single' value={accordionValue} onValueChange={setAccordionValue} collapsible className='w-full lg:hidden'>
            {variants.map((variant, index) => (
              <AccordionItem key={variant.id} value={variant.id}>
                {variant.id !== data.id ? (
                  <>
                    <AccordionTrigger className={cn('py-2.5', index !== variants.length - 1 ? 'border-b' : '')}>
                      <div>
                        <span className='text-muted-foreground font-semibold'>SKU:</span> {variant.attributes.sku}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className='space-y-3 pt-4 pb-0 '>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm text-muted-foreground font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Quantity</span>
                        <div className='text-right font-medium'>{variant.attributes.quantity}</div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm text-muted-foreground font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Buying Price</span>
                        <div className='text-right font-medium'>{formatCurrency(variant.attributes.buying_price)}</div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm text-muted-foreground font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Retail Price</span>

                        <div className='text-right font-medium'>{formatCurrency(variant.attributes?.retail_price ?? '')}</div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm text-muted-foreground font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Selling Price</span>
                        <div className='text-right font-medium'>{formatCurrency(variant.attributes.selling_price)}</div>
                      </div>
                      <div className='grid grid-cols-3 space-x-2'>
                        <Button type='button' variant='ghost' size='sm' className='group  text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={() => setData(variant.attributes)}>
                          <div className='flex items-center gap-2'>
                            <Pencil2Icon className='h-4 w-4 text-muted-foreground group-hover:text-foreground' />
                            <span className='tracking-wider'>Edit</span>
                          </div>
                        </Button>
                        <Button type='button' variant='ghost' size='sm' className='group text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 ' onClick={() => handleVariantStatusChange()}>
                          <div className='flex items-center gap-2'>
                            {variant.attributes.status === 'active' ? <SquareCheckBig className='h-4 w-4 text-foreground bg-' /> : <SquareIcon className='h-4 w-4 text-muted-foreground' />}
                            <span className={cn('tracking-wider', variant.attributes.status === 'active' ? 'text-foreground' : 'text-muted-foreground')}>{toTitleCase(variant.attributes.status)}</span>
                          </div>
                        </Button>

                        <Button type='button' variant='ghost' size='sm' className='group text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 gap-1 inline-flex items-center' onClick={() => handleDeleteVariant(variant)}>
                          <div className=' flex items-center gap-2'>
                            <Trash2Icon className='h-4 w-4 text-red-400 group-hover:text-red-600' />
                            <span className='tracking-wider'>Remove</span>
                          </div>
                        </Button>
                      </div>
                    </AccordionContent>
                  </>
                ) : (
                  <AccordionContent className='pb-0'>
                    <div className={cn('space-y-3', index !== 0 ? 'pt-2.5' : '')}>
                      <h1 className='text-lg font-semibold tracking-wide py-0.5'>Edit Variant</h1>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor={`edit_sku_2_${variant.id}`}>SKU</Label>
                        <div>
                          <Input id={`edit_sku_2_${variant.id}`} name='sku' value={data.sku} onChange={handleInputChange} placeholder='SKU'></Input>
                        </div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor={`edit_quantity_2_${variant.id}`}>Quantity</Label>
                        <div>
                          <InputNumber id={`edit_quantity_2_${variant.id}`} name='quantity' value={data.quantity} onChange={handleInputChange} placeholder='Quantity'></InputNumber>
                        </div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor={`edit_buying_price_2_${variant.id}`}>Buying Price</Label>
                        <div>
                          <InputNumber id={`edit_buying_price_2_${variant.id}`} name='buying_price' value={data.buying_price} onChange={handleInputChange} placeholder='Buying price'></InputNumber>
                        </div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor={`edit_retail_price_2_${variant.id}`}>Retail Price</Label>
                        <div>
                          <InputNumber id={`edit_retail_price_2_${variant.id}`} name='retail_price' value={data.retail_price ?? ''} onChange={handleInputChange} placeholder='Retail price'></InputNumber>
                        </div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor={`edit_selling_price_2_${variant.id}`}>Selling Price</Label>
                        <div>
                          <InputNumber id={`edit_selling_price_2_${variant.id}`} name='selling_price' value={data.selling_price} onChange={handleInputChange} placeholder='Selling price'></InputNumber>
                        </div>
                      </div>
                      <div className='flex items-center justify-center space-x-2'>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          className='group min-w-24 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 gap-1 inline-flex items-center'
                          onClick={() => {
                            setData(initialFormData)
                            setAccordionValue('')
                          }}
                        >
                          <div className=' flex items-center gap-2'>
                            <X className='h-4 w-4 text-red-400' />
                            <span className='tracking-wider'>Discard</span>
                          </div>
                        </Button>
                        <Button type='button' variant='outline' size='sm' className='group min-w-24 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={handleEditVariant}>
                          <div className='flex items-center gap-2'>
                            <CheckIcon className='h-4 w-4 text-muted-foreground group-hover:text-foreground' />
                            <span className='tracking-wider'>Add</span>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                )}
              </AccordionItem>
            ))}
            <AccordionItem value='add_variant'>
              <AccordionContent className='pb-0'>
                <div className={`space-y-3 pt-2.5 border-t`}>
                  <h1 className='text-lg font-semibold tracking-wide py-0.5'>Add new Variant</h1>
                  <div className='flex items-center justify-between'>
                    <Label htmlFor='sku_2'>SKU</Label>
                    <div>
                      <Input id='sku_2' name='sku' value={data.sku} onChange={handleInputChange} placeholder='SKU'></Input>
                    </div>
                  </div>
                  <div className='flex items-center justify-between'>
                    <Label htmlFor='quantity_2'>Quantity</Label>
                    <div>
                      <InputNumber id='quantity_2' name='quantity' value={data.quantity} onChange={handleInputChange} placeholder='Quantity'></InputNumber>
                    </div>
                  </div>
                  <div className='flex items-center justify-between'>
                    <Label htmlFor='buying_price_2'>Buying Price</Label>
                    <div>
                      <InputNumber id='buying_price_2' name='buying_price' value={data.buying_price} onChange={handleInputChange} placeholder='Buying price'></InputNumber>
                    </div>
                  </div>
                  <div className='flex items-center justify-between'>
                    <Label htmlFor='retail_price_2'>Retail Price</Label>
                    <div>
                      <InputNumber id='retail_price_2' name='retail_price' value={data.retail_price ?? ''} onChange={handleInputChange} placeholder='Retail price'></InputNumber>
                    </div>
                  </div>
                  <div className='flex items-center justify-between'>
                    <Label htmlFor='selling_price_2'>Selling Price</Label>
                    <div>
                      <InputNumber id='selling_price_2' name='selling_price' value={data.selling_price} onChange={handleInputChange} placeholder='Selling price'></InputNumber>
                    </div>
                  </div>
                  <div className='flex items-center justify-center space-x-2'>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      className='group min-w-24 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 gap-1 inline-flex items-center'
                      onClick={() => {
                        setIsAddFormOpen(false)
                        setAccordionValue('')
                      }}
                    >
                      <div className=' flex items-center gap-2'>
                        <X className='h-4 w-4 text-red-400' />
                        <span className='tracking-wider'>Discard</span>
                      </div>
                    </Button>
                    <Button type='button' variant='outline' size='sm' className='group min-w-24 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={handleAddVariant}>
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
          <Button size='sm' variant='ghost' className='gap-1' onClick={showForm}>
            <PlusCircle className='h-4 w-4' />
            Add Variant
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}

export default ProductVariantData
