import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/Components/ui/alert-dialog'
import { useDeleteModal } from '@/Contexts/DeleteModalContext'
import { toTitleCase } from '@/Lib/utils'

const DeleteModal = () => {
  const { data, isOpen, setIsOpen } = useDeleteModal()

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-xl'>Are you absolutely sure?</AlertDialogTitle>
          {data && (
            <span className='pt-2 flex space-x-2 items-baseline'>
              <p>
                {toTitleCase(data.title)}: {data?.name}
              </p>
              <p className='text-xs text-muted-foreground'>ID: {data?.id}</p>
            </span>
          )}
          <AlertDialogDescription>This action cannot be undone. This will permanently delete this {data.title} and remove it from the server.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              data.onConfirm()
              setIsOpen(false)
            }}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteModal
