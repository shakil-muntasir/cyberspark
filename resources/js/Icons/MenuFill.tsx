import { SVGProps } from 'react'

export function MenuFill(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='1rem' height='1rem' viewBox='0 0 32 32' {...props}>
      <path
        fill='currentColor'
        fillRule='evenodd'
        d='M6.667 4h18.666A2.667 2.667 0 0 1 28 6.667v18.666A2.667 2.667 0 0 1 25.333 28H6.667A2.667 2.667 0 0 1 4 25.333V6.667A2.667 2.667 0 0 1 6.667 4ZM10 9.667a1.333 1.333 0 1 0 0 2.666h12a1.333 1.333 0 1 0 0-2.666H10Zm0 5a1.333 1.333 0 1 0 0 2.666h12a1.333 1.333 0 1 0 0-2.666H10Zm0 5a1.333 1.333 0 1 0 0 2.666h12a1.333 1.333 0 1 0 0-2.666H10Z'
        clipRule='evenodd'
      />
    </svg>
  )
}
