interface ToastErrorDescriptionProps<T> {
  errors: Partial<Record<keyof T, string>>
}

const ToastErrorDescription = <T,>({ errors }: ToastErrorDescriptionProps<T>) => {
  return (
    <div className='mt-2 space-y-1'>
      <span className='font-semibold'>Reason:</span>
      {Object.values(errors).map((error, index) => (
        <p key={index}>
          {Object.keys(errors).length > 1 && '•'} {error as string}
        </p>
      ))}
    </div>
  )
}

export default ToastErrorDescription
