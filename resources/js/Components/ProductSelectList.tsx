import { useEffect, useRef, useState } from 'react'

import { Label } from '@/Components/ui/label'
import { Popover, PopoverContent } from '@/Components/ui/popover'
import { formatCurrency } from '@/Lib/utils'
import axios from 'axios'
import { ProductVariant, ProductVariantCollection } from '@/Pages/Product/types'
import { Input } from '@/Components/ui/input'
import { PopoverAnchor } from '@radix-ui/react-popover'

interface ProductSelectListProps {
  handleAddToCart: (variant: ProductVariant) => void
  id?: string
  label?: string
}

const ProductSelectList: React.FC<ProductSelectListProps> = ({ handleAddToCart, id, label }) => {
  const [openProductPopover, setOpenProductPopover] = useState(false)
  const commandSourceRef = useRef<HTMLDivElement>(null)
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const searchTimeout = useRef<NodeJS.Timeout | null>(null)
  const [search, setSearch] = useState<string | undefined>()

  const fetchProducts = async (search?: string) => {
    try {
      const url = !search ? '/variants/dropdown' : `/variants/dropdown?search=${search}`
      const { data } = await axios.get<ProductVariantCollection>(url)
      setVariants(data.data)
    } catch (_) {}
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }

    searchTimeout.current = setTimeout(() => {
      fetchProducts(search)
    }, 400)

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current)
      }
    }
  }, [search])

  return (
    <div>
      {/* WARNING: this div below is used to calculate the width for command dropdown */}
      <div ref={commandSourceRef} className='h-px' />
      <div className='grid gap-2'>
        {label && <Label htmlFor={id}>{label}</Label>}
        <Popover open={openProductPopover}>
          <PopoverAnchor asChild>
            <Input
              id={id}
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setOpenProductPopover(true)
              }}
              onClick={() => setOpenProductPopover(true)}
              onBlur={() => setOpenProductPopover(false)}
              placeholder='Search Product...'
            />
          </PopoverAnchor>

          <PopoverContent className='p-0' style={{ width: commandSourceRef.current?.offsetWidth ?? 'auto' }} align='end' onOpenAutoFocus={e => e.preventDefault()}>
            <div className='h-auto max-h-64 overflow-hidden overflow-y-auto p-1'>
              {variants?.map(variant => (
                <div
                  key={variant?.id}
                  onClick={() => {
                    handleAddToCart(variant)
                    setOpenProductPopover(false)
                  }}
                  className='group flex justify-between rounded-md p-2 hover:bg-muted'
                >
                  <div className='flex items-center gap-2'>
                    <div>
                      <img className='h-10 w-8 rounded-md object-cover' src='https://5.imimg.com/data5/ANDROID/Default/2021/7/KU/YI/VT/44196072/product-jpeg.jpg' />
                    </div>
                    <div className=''>
                      <div className='flex items-center gap-2'>
                        <span className='border-r pr-2 text-sm font-semibold group-hover:border-muted-foreground/20'>{variant.attributes.sku}</span>
                        <span className='text-sm font-semibold tracking-wide text-muted-foreground'>{variant.relationships?.product?.attributes.name}</span>
                      </div>
                      <span className='text-xs font-semibold tracking-wide text-primary/70'>{formatCurrency(parseFloat(variant.attributes.selling_price))}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default ProductSelectList
