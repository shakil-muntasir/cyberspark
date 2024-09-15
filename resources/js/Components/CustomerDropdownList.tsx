import { useEffect, useRef, useState } from 'react'

import { Label } from '@/Components/ui/label'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/Components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover'
import axios from 'axios'
import { User, UserCollection } from '@/Pages/User/types'
import UserPlaceholder from '@/public/assets/user_male_placeholder.png'
import { Button } from '@/Components/ui/button'
import { Check, ChevronsUpDownIcon } from 'lucide-react'

interface UserDropdownListProps {
  handleSelectedCustomer: (user: User) => void
  id?: string
  label?: string
}

const CustomerDropdownList: React.FC<UserDropdownListProps> = ({ handleSelectedCustomer, id, label }) => {
  const [selectedCustomer, setSelectedCustomer] = useState<User | undefined>()
  const [open, setOpen] = useState(false)
  const widthRef = useRef<HTMLDivElement>(null)
  const [users, setUsers] = useState<User[]>([])
  const searchTimeout = useRef<NodeJS.Timeout | null>(null)
  const [search, setSearch] = useState<string | undefined>()

  const fetchUsers = async (search?: string) => {
    try {
      const url = !search ? '/users/dropdown' : `/users/dropdown?search=${search}`
      const { data } = await axios.get<UserCollection>(url)
      setUsers(data.data)
    } catch (_) {}
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }

    searchTimeout.current = setTimeout(() => {
      fetchUsers(search)
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
      <div ref={widthRef} className='h-px' />
      <div className='grid gap-2'>
        {label && <Label htmlFor={id}>{label}</Label>}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant='outline' role='combobox' aria-expanded={open} className='flex h-auto w-full items-center justify-between px-3 py-1.5'>
              <div className='flex flex-wrap justify-start gap-2'>
                <span className='flex justify-center'>{selectedCustomer ? selectedCustomer.attributes.name : 'Select Customer'}</span>
              </div>
              <div className='flex items-center self-center'>
                <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className='p-0' style={{ width: widthRef.current?.offsetWidth ?? 'auto' }}>
            <Command shouldFilter={false}>
              <CommandInput id={id} value={search} onValueChange={setSearch} placeholder='Search Customer...' />
              <CommandEmpty>No item found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {users?.map(user => (
                    <CommandItem
                      key={user.id}
                      onSelect={() => {
                        handleSelectedCustomer(user)
                        setSelectedCustomer(user)
                        setOpen(false)
                      }}
                      className='group flex justify-between rounded-md p-2 hover:bg-muted'
                    >
                      <div className='flex items-center gap-2'>
                        <div>
                          <img className='h-10 w-10 rounded-full object-cover' src={user.attributes.image || UserPlaceholder} />
                        </div>
                        <div className=''>
                          <div className='flex items-center gap-2'>
                            <span className='border-r pr-2 text-sm font-semibold group-hover:border-muted-foreground/20'>{user.attributes.name}</span>
                            <span className='text-sm font-semibold tracking-wide text-muted-foreground'>{user.attributes.email}</span>
                          </div>
                          <span className='text-xs font-semibold tracking-wide text-primary/70'>{user.attributes.phone}</span>
                        </div>
                      </div>
                      <Check className={user.id === selectedCustomer?.id ? 'mr-2 h-4 w-4 opacity-100' : 'mr-2 h-4 w-4 opacity-0'} />
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

export default CustomerDropdownList
