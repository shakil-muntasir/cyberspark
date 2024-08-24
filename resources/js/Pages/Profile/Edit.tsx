import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import DeleteUserForm from './Partials/DeleteUserForm'
import UpdatePasswordForm from './Partials/UpdatePasswordForm'
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm'

export default function Edit({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
  return (
    <AuthenticatedLayout title='Profile'>
      <div className='mx-auto max-w-7xl space-y-4 sm:px-6 lg:px-8'>
        <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />

        <UpdatePasswordForm />

        <DeleteUserForm />
      </div>
    </AuthenticatedLayout>
  )
}
