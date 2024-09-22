import { Button } from '@/Components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { ChevronLeftIcon } from 'lucide-react'

const Show = () => {
  return (
    <AuthenticatedLayout title='Order Details'>
      <main className='mx-auto flex max-w-[80rem] flex-1 flex-col gap-4'>
        <div className='flex items-center gap-4'>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button variant='outline' size='icon' className='h-7 w-7' onClick={() => window.history.back()}>
                  <ChevronLeftIcon className='h-4 w-4' />
                  <span className='sr-only'>Back</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go back</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>New Order</h1>
        </div>
      </main>
    </AuthenticatedLayout>
  )
}

export default Show
