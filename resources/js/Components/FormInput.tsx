import InputError from '@/Components/InputError'
import { Label } from '@/Components/ui/label'
import React, { ReactNode } from 'react'

interface FormInputProps {
  id: string
  label: string
  errorMessage?: string
  children: ReactNode
}

const FormInput: React.FC<FormInputProps> = ({ id, label, errorMessage, children }) => {
  return (
    <div className='grid w-full gap-2'>
      <Label htmlFor={id} className={errorMessage?.length ? 'text-destructive' : ''}>
        {label}
      </Label>
      <div className='w-full space-y-px'>
        {children}
        <InputError message={errorMessage} />
      </div>
    </div>
  )
}

export default FormInput
