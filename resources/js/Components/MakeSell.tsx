import { Button } from '@/Components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog'
import { PlusIcon, ShoppingBagIcon } from 'lucide-react'

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
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default MakeSell
