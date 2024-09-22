import { ChevronLeftIcon } from 'lucide-react'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'

import { AcquisitionResource } from '@/Pages/Acquisition/types'

interface AcquisitionShowProps {
  acquisition: AcquisitionResource
}

const AcquisitionShow: React.FC<AcquisitionShowProps> = ({ acquisition }) => {
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
          <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>{acquisition.data.attributes.invoice_number}</h1>
          <Badge variant='default' className='ml-auto sm:ml-0'>
            {acquisition.data.attributes.products_count}
          </Badge>
        </div>
      </main>
    </AuthenticatedLayout>
  )
}

export default AcquisitionShow
