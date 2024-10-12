import { PlusCircle, Trash2Icon } from 'lucide-react'

import { Button } from '@/Components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'
import { formatCurrency } from '@/Lib/utils'
import { ProductVariant } from '@/Pages/Product/types'
import { Link } from '@inertiajs/react'
import { Pencil2Icon } from '@radix-ui/react-icons'

interface AcquisitionVariantDataProps {
  variants?: ProductVariant[]
  handleAddProduct: () => void
  handleEditProduct: (productVariant: ProductVariant) => void
}

const AcquisitionVariantData: React.FC<AcquisitionVariantDataProps> = ({ variants = [], handleAddProduct, handleEditProduct }) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Variants</CardTitle>
          <CardDescription>Add/update the buying, selling and retail prices of product variants.</CardDescription>
        </CardHeader>
        <CardContent className='pb-3 lg:p-6 lg:pt-0'>
          {/* Desktop view */}
          <Table className='hidden flex-col lg:flex'>
            <TableHeader className='flex flex-1'>
              <TableRow className='flex flex-1 items-center hover:bg-inherit'>
                <TableHead className='flex flex-1 items-center'>Name</TableHead>
                <TableHead className='flex flex-1 items-center'>SKU</TableHead>
                <TableHead className='flex flex-1 items-center justify-end text-end'>Quantity</TableHead>
                <TableHead className='flex flex-1 items-center justify-end text-end'>Buying Price</TableHead>
                <TableHead className='flex flex-1 items-center justify-end text-end'>Retail Price</TableHead>
                <TableHead className='flex flex-1 items-center justify-end text-end'>Selling Price</TableHead>
                <TableHead className='flex flex-1 items-center justify-center text-center'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='flex flex-col'>
              {variants.length > 0 &&
                variants.map(variant => (
                  <TableRow key={variant.id} className='flex'>
                    <TableCell className='flex flex-1 items-center'>
                      <span className='sr-only text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>SKU</span>
                      <Link href={`/products/${variant.relationships?.product?.id}`} className='text-nowrap font-medium text-blue-500 underline-offset-2 hover:underline dark:text-blue-300'>
                        {variant.relationships?.product?.attributes.name}
                      </Link>
                    </TableCell>

                    <TableCell className='flex flex-1 items-center'>
                      <span className='sr-only text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>SKU</span>
                      <div className='font-medium'>{variant.attributes.sku}</div>
                    </TableCell>

                    <TableCell className='flex flex-1 items-center justify-end'>
                      <span className='sr-only text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Quantity</span>
                      <div className='text-end'>{variant.attributes.quantity}</div>
                    </TableCell>

                    <TableCell className='flex flex-1 items-center justify-end'>
                      <span className='sr-only text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Buying Price</span>
                      <div className='text-right font-medium'>{formatCurrency(parseFloat(variant.attributes.buying_price))}</div>
                    </TableCell>

                    <TableCell className='flex flex-1 items-center justify-end'>
                      <span className='sr-only text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Retail Price</span>
                      <div className='text-right'>{formatCurrency(parseFloat(variant.attributes?.retail_price ?? '0'))}</div>
                    </TableCell>

                    <TableCell className='flex flex-1 items-center justify-end'>
                      <span className='sr-only text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Selling Price</span>
                      <div className='text-right font-medium'>{formatCurrency(parseFloat(variant.attributes.selling_price))}</div>
                    </TableCell>

                    <TableCell className='flex flex-1 items-center justify-center'>
                      <span className='sr-only'>Actions</span>
                      <div className='flex h-full items-center justify-center'>
                        <TooltipProvider>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                              <Button type='button' variant='ghost' size='icon' className='group h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={() => handleEditProduct(variant)}>
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
                              <Button type='button' variant='ghost' size='icon' className='group h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={() => null}>
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
                ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className='justify-center border-t p-1 lg:p-2'>
          <Button size='sm' variant='ghost' className='gap-1' onClick={handleAddProduct}>
            <PlusCircle className='h-4 w-4' />
            Add Variant
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}

export default AcquisitionVariantData
