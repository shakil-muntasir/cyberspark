import { useState } from 'react'
import { CheckIcon, Trash2Icon, XIcon } from 'lucide-react'
import { Pencil2Icon } from '@radix-ui/react-icons'

import { Button } from '@/Components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover'
import { AcquiredProductForm } from '@/Pages/Acquisition/types'
import { useTheme } from '@/Providers/theme-provider'

import { formatCurrency } from '@/Lib/utils'

interface AcquiredProductsListProps {
  products: AcquiredProductForm[]
  onEditProduct: (product: AcquiredProductForm) => void
  showEditConfirmation: boolean
  onConfirmEditProduct: (product: AcquiredProductForm) => void
  onRemoveProduct: (product: AcquiredProductForm) => void
  onCancelEditProduct: () => void
}

const PCAcquiredProductsList: React.FC<AcquiredProductsListProps> = ({ products, onEditProduct, showEditConfirmation, onConfirmEditProduct, onRemoveProduct, onCancelEditProduct }) => {
  const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null)

  const { theme } = useTheme()

  return (
    <ul className='flex flex-col space-y-2'>
      {products.map((product, index) => (
        <li key={index} className='flex h-auto items-center justify-between rounded-md bg-muted-foreground/5 px-3 py-2 text-start dark:bg-accent/50'>
          <div className='w-full space-y-0.5'>
            <div className='flex items-center justify-between border-b pb-2'>
              <div className='flex-1'>
                <div className='flex items-center'>
                  <p className='border-r pr-2 text-base font-semibold'>{product.name}</p>
                  <p className='pl-2 text-xs'>{product.sku_prefix}</p>
                </div>
                <p className='text-xs font-light'>
                  Quantity: <span className='font-semibold'>{product.quantity}</span>
                </p>
                <p className='text-xs font-light'>
                  Category: <span className='font-semibold'>{product.category_id}</span>
                </p>
              </div>
              <div className='flex gap-0.5'>
                <Popover
                  open={showEditConfirmation && openPopoverIndex === index} // Control the open state
                  onOpenChange={isOpen => setOpenPopoverIndex(isOpen ? index : null)}
                >
                  <PopoverTrigger asChild>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='group h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                      onClick={() => {
                        onEditProduct(product)
                        setOpenPopoverIndex(openPopoverIndex === index ? null : index)
                      }}
                    >
                      <Pencil2Icon className='h-4 w-4 text-muted-foreground group-hover:text-foreground' />
                      <span className='sr-only'>Edit Product</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align='end' className='w-52 space-y-1.5 p-2.5'>
                    <div className='space-y-1.5 text-xs'>
                      <p>This will overwrite the current form data.</p>
                      <p className='font-semibold'>Do you want to proceed?</p>
                    </div>
                    <div className='flex justify-end gap-1'>
                      <Button type='button' variant='destructive' size='icon' className='group h-7 w-7' onClick={onCancelEditProduct}>
                        <XIcon className='h-4 w-4 text-white/80 group-hover:text-white' />
                        <span className='sr-only'>Cancel Confirmation</span>
                      </Button>
                      <Button type='button' variant={theme === 'dark' ? 'default' : 'outline'} size='icon' className='group h-7 w-7 text-gray-500 hover:text-gray-900' onClick={() => onConfirmEditProduct(product)}>
                        <CheckIcon className='h-4 w-4 dark:file:text-primary-foreground/80 dark:file:group-hover:text-green-600' />
                        <span className='sr-only'>Edit Confirmation</span>
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button type='button' variant='ghost' size='icon' className='group h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={() => onRemoveProduct(product)}>
                  <Trash2Icon className='h-4 w-4 text-destructive group-hover:text-red-700' />
                  <span className='sr-only'>Remove Product</span>
                </Button>
              </div>
            </div>
            <div className='flex pt-1.5'>
              <p className='border-r pr-2 text-xs font-light'>
                Buying Price <span className='font-semibold'>{formatCurrency(product.buying_price)}</span>
              </p>
              <p className='border-r px-2 text-xs font-light'>
                Retail Price <span className='font-semibold'>{formatCurrency(product.retail_price)}</span>
              </p>
              <p className='pl-2 text-xs font-light'>
                Selling Price <span className='font-semibold'>{formatCurrency(product.selling_price)}</span>
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default PCAcquiredProductsList
