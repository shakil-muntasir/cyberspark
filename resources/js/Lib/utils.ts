import { type ClassValue, clsx } from 'clsx'
import { ChangeEvent } from 'react'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getImageData(event: ChangeEvent<HTMLInputElement>) {
    try {
        // FileList is immutable, so we need to create a new one
        const dataTransfer = new DataTransfer()

        // Add newly uploaded images
        Array.from(event.target.files!).forEach(image => dataTransfer.items.add(image))

        const file = dataTransfer.files![0]
        const displayUrl = URL.createObjectURL(event.target.files![0])

        return { file, displayUrl }
    } catch (_) {
        return { file: undefined, displayUrl: '' }
    }
}

export function generatePassword(passwordLength = 10): string {
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz'
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numericChars = '0123456789'
    const specialChars = '!@#$%'

    const allChars = lowerCaseChars + upperCaseChars + numericChars
    let password = ''

    // Ensure the password contains at least one character from each category
    password += lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)]
    password += upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)]
    password += numericChars[Math.floor(Math.random() * numericChars.length)]

    // Add up to 2 special characters
    const specialCharCount = 2
    for (let i = 0; i < specialCharCount; i++) {
      password += specialChars[Math.floor(Math.random() * specialChars.length)]
    }

    // Fill the remaining length with random characters from lower, upper, and numeric categories
    for (let i = password.length; i < passwordLength; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)]
    }

    // Shuffle the password to ensure randomness
    password = password
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('')

    return password
  }