import React from 'react'
import { CameraIcon, Trash2Icon } from 'lucide-react'

import { Avatar, AvatarImage } from '@/Components/ui/avatar'
import { Spinner } from '@/Components/ui/spinner'

import { cn } from '@/Lib/utils'
import UserPlaceholder from '@/public/assets/user_male_placeholder.png'

interface AvatarProps {
  inputRef: React.RefObject<HTMLInputElement>
  previewImage: string
  src: string
  processing: boolean
  className?: string
  handleImageClear: () => void
}

const UserAvatar: React.FC<AvatarProps> = ({ inputRef, processing, src, previewImage, className = '', handleImageClear }) => {
  return (
    <div className={cn('relative flex flex-1 items-center justify-center rounded-full', className)}>
      <Avatar className='relative h-72 w-72 overflow-hidden rounded-full'>
        {/* Show spinner if processing state is true */}
        {previewImage && processing && (
          <div className='absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50'>
            <Spinner size='large' />
          </div>
        )}

        {/* Avatar Image Logic */}
        <div className='group relative h-full w-full rounded-full hover:cursor-pointer'>
          <AvatarImage className='h-full w-full rounded-full object-cover' src={previewImage || src || UserPlaceholder} />

          <button onClick={() => inputRef.current?.click()} className='absolute inset-0 flex items-center justify-center rounded-full bg-gray-900/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
            <CameraIcon className='h-12 w-12 text-white' />
          </button>
        </div>

        {/* Fallback if no image is present */}
        {/* TODO: this fallback avatar jumps while uploading/removing an image. Fix/Remove later. */}
        {/* <AvatarFallback>
          <Spinner size='large' />
        </AvatarFallback> */}
      </Avatar>

      {previewImage && (
        <button onClick={handleImageClear} className='absolute ml-52 mt-52 rounded-full bg-red-500 p-2.5 outline-offset-1 outline-red-700 transition-all duration-75 ease-linear hover:cursor-pointer hover:bg-red-700 hover:outline'>
          <span className='h-8 w-8'>
            <Trash2Icon className='h-4 w-4 text-white' />
            <span className='sr-only'>Remove picture</span>
          </span>
        </button>
      )}
    </div>
  )
}

export default UserAvatar
