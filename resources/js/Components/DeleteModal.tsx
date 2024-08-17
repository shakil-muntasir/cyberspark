import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/Components/ui/alert-dialog'
import { toTitleCase } from '@/Lib/utils'

interface DeleteModalProps {
  data?: {
    id: string
    name: string
  }
  title: string
  onConfirm: () => void
  isOpen?: boolean
  onCancel?: () => void
}

const DeleteModal = ({ data, title, onConfirm, isOpen = false, onCancel = () => null }: DeleteModalProps) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          {data && (
            <div className='tracking-wider'>
              <p className='-mt-2 underline '>{toTitleCase(title)}</p>
              <span className='text-sm '>
                <p>ID: {data?.id}</p>
                <p>Name: {data?.name}</p>
              </span>
            </div>
          )}
          <AlertDialogDescription>This action cannot be undone. This will permanently delete this {title} and remove it from the server.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className='bg-destructive text-destructive-foreground hover:bg-destructive/90'>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteModal
