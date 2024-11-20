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

export function toTitleCase(str: string) {
    if (typeof str !== 'string' || str.length === 0) {
        return ''
    }

    return str
        .toLowerCase()
        .split(/[-_\s]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export function formatCurrency(amount?: number | null, currency = 'BDT'): string {
    if (amount === 0 || amount === undefined || amount === null) {
        if (currency === 'BDT') return `৳ 0.00`

        return `${currency} 0.00`
    }

    // Format the amount using Intl.NumberFormat
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        currencyDisplay: 'symbol'
    }).format(typeof amount === 'number' ? amount : parseInt(amount))

    if (currency === 'BDT') {
        return formattedAmount.replace('BDT', '৳')
    }

    return formattedAmount
}

export function abbreviateWords(phrase: string) {
    const words = phrase.split(' ')

    if (words.length === 1) {
        return words[0].slice(0, 3).toUpperCase()
    }

    return words
        .slice(0, 3)
        .map(word => word[0])
        .join('')
        .toUpperCase()
}
