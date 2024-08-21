import { Button } from '@/Components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { PlusIcon } from 'lucide-react'

const MakeSell = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='fixed bottom-8 right-8 rounded-full h-12 w-12 space-x-1 p-0'>
          <PlusIcon className='h-6 w-6 ' />
          {/* <span className='hidden sm:inline'>Sell Product</span> */}
        </Button>
      </DialogTrigger>
      <DialogContent className=''>
        <DialogHeader>
          <DialogTitle>Sell Product</DialogTitle>
          <DialogDescription>Please fill out this form to sell a product.</DialogDescription>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Name
              </Label>
              <Input id='name' defaultValue='Pedro Duarte' className='col-span-3' />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='username' className='text-right'>
                Username
              </Label>
              <Input id='username' defaultValue='@peduarte' className='col-span-3' />
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default MakeSell
