import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import DeleteUserForm from './Partials/DeleteUserForm'
import UpdatePasswordForm from './Partials/UpdatePasswordForm'
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm'

export default function Edit({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
  return (
    <AuthenticatedLayout title='Profile'>
      <div className='max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-4'>
        <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />

        <UpdatePasswordForm />

        <DeleteUserForm />
      </div>
    </AuthenticatedLayout>
  )
}
