import { useEffect, useRef, useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/Components/ui/command'
import axios from 'axios'
import { Product, ProductCollection } from '@/Pages/Product/types'
import { Button } from '@/Components/ui/button'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'

interface ProductDropdownListProps {
  handleAddToCart: (product: Product) => void
  clearProductName?: boolean
  id?: string
}

const ProductDropdownList: React.FC<ProductDropdownListProps> = ({ handleAddToCart, id, clearProductName }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product>()
  const [search, setSearch] = useState<string | undefined>()
  const searchTimeout = useRef<NodeJS.Timeout | null>(null)
  const widthRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const fetchProducts = async (search?: string) => {
    try {
      const url = !search ? '/products/dropdown' : `/products/dropdown?search=${search}`
      const { data } = await axios.get<ProductCollection>(url)
      setProducts(data.data)
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
    if (clearProductName) {
      setSelectedProduct(undefined)
    }
  }, [clearProductName])

  return (
    <div>
      {/* WARNING: this div below is used to calculate the width for command dropdown */}
      <div ref={widthRef} className='h-px' />
      <div className='grid gap-2'>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant='outline' role='combobox' aria-expanded={open} className='flex h-auto w-full items-center justify-between px-3 py-1.5'>
              <div className='flex flex-wrap justify-start gap-2'>
                <span className='flex justify-center'>{selectedProduct ? selectedProduct.attributes.name : 'Select Product'}</span>
              </div>
              <div className='flex items-center self-center'>
                <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </div>
            </Button>
          </PopoverTrigger>

          <PopoverContent className='p-0' style={{ width: widthRef.current?.offsetWidth ?? 'auto' }}>
            <Command shouldFilter={false}>
              <CommandInput id={id} value={search} onValueChange={setSearch} placeholder='Search Product products...' />
              <CommandEmpty>No item found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {products?.map(product => (
                    <CommandItem
                      key={product.id}
                      onSelect={() => {
                        handleAddToCart(product)
                        setSelectedProduct(product)
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
                            <span className='border-r pr-2 text-sm font-semibold group-hover:border-muted-foreground/20'>{product.attributes.name}</span>
                            <span className='text-sm font-semibold tracking-wide text-muted-foreground'>{product.attributes.sku_prefix}</span>
                          </div>
                          <span className='text-xs font-semibold tracking-wide text-primary/70'>{product.attributes.category}</span>
                        </div>
                      </div>
                      <CheckIcon className={product.id === selectedProduct?.id ? 'mr-2 h-4 w-4 opacity-100' : 'mr-2 h-4 w-4 opacity-0'} />
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

export default ProductDropdownList
