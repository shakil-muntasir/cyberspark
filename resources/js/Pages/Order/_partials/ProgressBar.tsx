import { CheckThickIcon } from '@/Icons/CheckThickIcon'
import { CircleFillIcon } from '@/Icons/CircleFill'
import { cn, toTitleCase } from '@/Lib/utils'
import { StatusOption } from '@/Pages/Order/types'

export interface ProgressBarProps {
  steps: StatusOption[]
  currentStep: string
}

const baseLineStyles = 'absolute left-1/2 top-1/2 h-px w-full -translate-y-1/2'

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
  const currentStepOption = steps.find(step => step.value === currentStep)
  const currentStepIndex = currentStepOption ? steps.indexOf(currentStepOption) : -1

  return (
    <div className='flex w-full items-center justify-between'>
      {steps.map((step, index) => {
        const isActive = index <= currentStepIndex

        return (
          <div key={index} className='flex flex-1 flex-col items-center'>
            <div className='relative flex w-full justify-center'>
              {/* Circle */}
              <div className={cn('z-10 rounded-full border border-muted p-0.5', isActive ? `bg-${step.color}-400` : 'bg-gray-300')}>
                {index <= currentStepIndex - 1 || currentStepIndex === steps.length - 1 ? <CheckThickIcon className={cn('h-2.5 w-2.5 text-background')} /> : <CircleFillIcon className={cn('m-px h-2 w-2 text-background')} />}
              </div>

              {/* Line */}
              {index < steps.length - 1 && <div className={cn(baseLineStyles, index <= currentStepIndex - 1 ? `bg-${step.color}-400` : 'bg-gray-300')} />}
            </div>

            {/* Label */}
            <p className={cn('mt-2 text-nowrap text-[0.625rem] font-semibold tracking-wider', isActive ? `text-${step.color}-400` : 'text-gray-400')}>{toTitleCase(step.value)}</p>
          </div>
        )
      })}
    </div>
  )
}

export default ProgressBar
