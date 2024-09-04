import { SVGProps } from 'react'

export function MinusCircle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24' {...props}>
      <path fill='currentColor' fillRule='evenodd' d='M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12m5.757-1a1 1 0 1 0 0 2h8.486a1 1 0 1 0 0-2z' clipRule='evenodd' />
    </svg>
  )
}
