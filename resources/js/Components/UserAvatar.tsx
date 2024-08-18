import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar'
import { Spinner } from '@/Components/ui/spinner'
import { cn } from '@/Lib/utils'
import UserPlaceholder from '@/public/assets/user_male_placeholder.png'
import { CameraIcon, Trash2Icon } from 'lucide-react'
import React, { useState } from 'react'

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
    <div className={cn('flex justify-center flex-1 items-center relative rounded-full pb-2 ', className)}>
      <Avatar className='relative w-72 h-72 rounded-full overflow-hidden' onClick={() => inputRef.current?.click()}>
        {/* Show spinner if processing state is true */}
        {previewImage && processing && (
          <div className='absolute inset-0 rounded-full flex items-center justify-center bg-black bg-opacity-50'>
            <Spinner size='large' />
          </div>
        )}

        {/* Avatar Image Logic */}
        <div className='relative rounded-full w-full h-full group hover:cursor-pointer'>
          <AvatarImage className='object-cover w-full h-full rounded-full' src={previewImage || src || UserPlaceholder} />

          <div className='absolute inset-0 bg-gray-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full'>
            <CameraIcon className='text-white h-8 w-8' />
          </div>
        </div>

        {/* Fallback if no image is present */}
        <AvatarFallback>
          <Spinner size='large' />
        </AvatarFallback>
      </Avatar>

      {previewImage && (
        <div className='absolute rounded-full mt-52 ml-52 bg-red-400 outline-red-700 hover:outline  outline-offset-1 hover:cursor-pointer p-2.5 hover:bg-red-700 transition-all duration-75 ease-linear'>
          <span className='h-8 w-8' onClick={handleImageClear}>
            <Trash2Icon className='h-4 w-4 text-white' />
            <span className='sr-only'>Remove picture</span>
          </span>
        </div>
      )}
    </div>
  )
}

export default UserAvatar
