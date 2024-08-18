import InputError from '@/Components/InputError'
import Modal from '@/Components/Modal'
import { Button } from '@/Components/ui/button'
import { Card, CardFooter, CardHeader } from '@/Components/ui/card'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { useForm } from '@inertiajs/react'
import { FormEventHandler, useRef, useState } from 'react'

type DeleteUserPasswordData = {
  password: string
}

export default function DeleteUserForm() {
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false)
  const passwordInput = useRef<HTMLInputElement>(null)

  const {
    data,
    setData,
    delete: destroy,
    processing,
    reset,
    errors,
    clearErrors
  } = useForm<DeleteUserPasswordData>({
    password: ''
  })

  const confirmUserDeletion = () => {
    setConfirmingUserDeletion(true)
  }

  const deleteUser: FormEventHandler = e => {
    e.preventDefault()

    destroy(route('profile.destroy'), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => {
        reset('password')
        passwordInput.current?.focus()
      },
      onFinish: () => reset()
    })
  }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setData(name as keyof DeleteUserPasswordData, value)
    clearErrors(name as keyof DeleteUserPasswordData)
  }

  const closeModal = () => {
    setConfirmingUserDeletion(false)
    reset()
  }

  return (
    <Card>
      <CardHeader className='max-w-xl lg:pr-0'>
        <h2 className='text-lg font-medium text-foreground'>Delete Account</h2>

        <p className='mt-1 text-sm text-muted-foreground'>Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.</p>
      </CardHeader>

      <CardFooter>
        <Button variant='destructive' onClick={confirmUserDeletion}>
          Delete Account
        </Button>
      </CardFooter>

      <Modal show={confirmingUserDeletion} onClose={closeModal}>
        <form onSubmit={deleteUser} className='p-6'>
          <h2 className='text-lg font-medium text-foreground'>Are you sure you want to delete your account?</h2>

          <p className='mt-1 text-sm text-muted-foreground'>Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.</p>

          <div className='mt-6'>
            <Label htmlFor='password' className={errors.password?.length ? 'text-destructive' : ''}>
              Password
            </Label>
            <div className='space-y-px'>
              <Input id='password' type='password' name='password' value={data.password} onChange={handleInputChange} placeholder='Password' autoFocus autoComplete='current-password' />
              <InputError message={errors.password} />
            </div>
          </div>

          <div className='mt-6 flex justify-end'>
            <Button variant='secondary' onClick={closeModal}>
              Cancel
            </Button>

            <Button type='submit' variant='destructive' className='ms-3' disabled={processing}>
              Delete Account
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  )
}
