import { useEffect, useRef, useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/Components/ui/command'
import { formatCurrency } from '@/Lib/utils'
import axios from 'axios'
import { ProductVariant, ProductVariantCollection } from '@/Pages/Product/types'
import { Button } from '@/Components/ui/button'
import { ChevronsUpDownIcon } from 'lucide-react'
import { CheckCircleIcon } from '@/Icons/CheckCircleIcon'

interface ProductDropdownListProps {
  handleAddToCart: (variant: ProductVariant) => void
  id?: string
}

const ProductVariantDropdownList: React.FC<ProductDropdownListProps> = ({ handleAddToCart, id }) => {
  const [open, setOpen] = useState(false)
  const widthRef = useRef<HTMLDivElement>(null)
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const searchTimeout = useRef<NodeJS.Timeout | null>(null)
  const [search, setSearch] = useState<string | undefined>()
  const [productAdded, setProductAdded] = useState(false)

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

  useEffect(() => {
    if (productAdded) {
      setTimeout(() => {
        setProductAdded(false)
      }, 1000)
    }
  }, [productAdded])

  return (
    <div>
      {/* WARNING: this div below is used to calculate the width for command dropdown */}
      <div ref={widthRef} className='h-px' />
      <div className='grid gap-2'>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant='outline' role='combobox' aria-expanded={open} className='flex h-auto w-full items-center justify-between px-3 py-1.5'>
              <div className='flex flex-wrap justify-start gap-2'>
                <span className='flex justify-center'>
                  {productAdded ? (
                    <span className='flex items-center space-x-2'>
                      <CheckCircleIcon className='h-4 w-4' />
                      <span>Product Added</span>
                    </span>
                  ) : (
                    'Select Products'
                  )}
                </span>
              </div>
              <div className='flex items-center self-center'>
                <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </div>
            </Button>
          </PopoverTrigger>

          <PopoverContent className='p-0' style={{ width: widthRef.current?.offsetWidth ?? 'auto' }}>
            <Command shouldFilter={false}>
              <CommandInput id={id} value={search} onValueChange={setSearch} placeholder='Search Product Variants...' />
              <CommandEmpty>No item found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {variants?.map(variant => (
                    <CommandItem
                      key={variant.id}
                      onSelect={() => {
                        handleAddToCart(variant)
                        setProductAdded(true)
                        setOpen(false)
                      }}
                      className='group flex justify-between rounded-md p-2 hover:bg-muted'
                    >
                      <div className='flex items-center gap-2'>
                        <div>
                          <img className='h-10 w-8 rounded-md object-cover' src='https://5.imimg.com/data5/ANDROID/Default/2021/7/KU/YI/VT/44196072/product-jpeg.jpg' />
                        </div>
                        <div>
                          <div className='flex items-center gap-2'>
                            <span className='border-r pr-2 text-sm font-semibold group-hover:border-muted-foreground/20'>{variant.attributes.sku}</span>
                            <span className='text-sm font-semibold tracking-wide text-muted-foreground'>{variant.relationships?.product?.attributes.name}</span>
                          </div>
                          <span className='text-xs font-semibold tracking-wide text-primary/70'>{formatCurrency(parseFloat(variant.attributes.selling_price))}</span>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default ProductVariantDropdownList
