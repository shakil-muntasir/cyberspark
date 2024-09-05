import { Trash2Icon } from 'lucide-react'

import { Button } from '@/Components/ui/button'
import { CardContent } from '@/Components/ui/card'
import { InputNumber } from '@/Components/ui/input-number'
import { Label } from '@/Components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'

import { formatCurrency } from '@/Lib/utils'
import { CartItem as CartItemType, ProductVariant } from '@/Pages/Product/types'

interface CartItemProps {
  data: CartItemType
  removeFromCart: (variant: ProductVariant) => void
}

const CartItem: React.FC<CartItemProps> = ({ data, removeFromCart }) => {
  return (
    <CardContent className='flex justify-between bg-primary-foreground/70 p-4'>
      <div className='flex gap-4'>
        <img className='h-20 w-14 rounded-md object-cover' src='https://5.imimg.com/data5/ANDROID/Default/2021/7/KU/YI/VT/44196072/product-jpeg.jpg' />
        <div className='flex flex-col justify-between'>
          <div>
            <Label>{data.variant.relationships?.product?.attributes.name}</Label>
            <div className='flex'>
              <p className='border-r pr-2 text-sm tracking-tight text-muted-foreground'>{data.variant.relationships?.product?.attributes.category}</p>
              <p className='pl-2 text-sm tracking-tight text-muted-foreground'>{data.variant.attributes.sku}</p>
            </div>
          </div>
          <p className='text-sm font-medium'>
            {formatCurrency(parseFloat(data.variant.attributes.selling_price))} <span className='text-foreground/60'>&times; {data.quantity}</span>
          </p>
        </div>
      </div>
      <div className='flex flex-col items-end justify-between'>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button type='button' variant='ghost' size='icon' className='group h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' onClick={() => removeFromCart(data.variant)}>
                <Trash2Icon className='h-4 w-4 text-destructive group-hover:text-red-700' />
                <span className='sr-only'>Remove</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <InputNumber className='h-8 w-18' id='quantity' name='quantity' value={data.quantity} onChange={() => null} />
      </div>
    </CardContent>
  )
}

export default CartItem
