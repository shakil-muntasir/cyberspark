import { Trash2Icon } from 'lucide-react'

import { Button } from '@/Components/ui/button'
import { CardContent } from '@/Components/ui/card'
import { InputNumber } from '@/Components/ui/input-number'
import { Label } from '@/Components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'

import { formatCurrency } from '@/Lib/utils'
import { CartItemType, ProductVariant } from '@/Pages/Product/types'

interface CartItemProps {
  data: CartItemType
  removeFromCart: (variant: ProductVariant) => void
  handleCartItemChange: (variant: ProductVariant, event: React.ChangeEvent<HTMLInputElement>) => void
}

const CartItem: React.FC<CartItemProps> = ({ data, removeFromCart, handleCartItemChange }) => {
  return (
    <CardContent className='flex w-full gap-4 rounded-md px-4 py-0 transition-all duration-200 hover:bg-muted/80 dark:hover:bg-muted/50 lg:rounded-none lg:px-6'>
      <img className='my-4 h-20 w-14 rounded-md object-cover' src='https://5.imimg.com/data5/ANDROID/Default/2021/7/KU/YI/VT/44196072/product-jpeg.jpg' />
      <div className='flex w-full flex-col justify-between'>
        <div className='mt-2.5 flex justify-between'>
          <div>
            <Label>{data.variant.relationships?.product?.attributes.name}</Label>
            <div className='flex'>
              <p className='border-r pr-2 text-sm tracking-tight text-muted-foreground'>{data.variant.relationships?.product?.attributes.category}</p>
              <p className='pl-2 text-sm tracking-tight text-muted-foreground'>{data.variant.attributes.sku}</p>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button type='button' variant='ghost' size='icon' className='group mt-2 h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={() => removeFromCart(data.variant)}>
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
        <div className='mb-4 flex flex-col items-end justify-between'>
          <div className='flex items-center gap-2'>
            <span className='text-sm'>{formatCurrency(parseFloat(data.variant.attributes.selling_price))}</span> <span className='text-foreground/60'>&times;</span>
            <InputNumber className='h-8 w-16' id='quantity' name='quantity' value={data.quantity} onChange={e => handleCartItemChange(data.variant, e)} />
          </div>
        </div>
      </div>
    </CardContent>
  )
}

export default CartItem
