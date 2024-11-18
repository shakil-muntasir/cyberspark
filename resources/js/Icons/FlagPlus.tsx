import { SVGProps } from 'react'

export function FlagPlus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='1rem' height='1rem' viewBox='0 0 32 32' {...props}>
      <path
        fill='currentColor'
        fillRule='evenodd'
        d='M27.158 18.997c-.245.133-.52.203-.8.203H8.286v11.2c0 .424-.173.831-.481 1.131-.308.3-.726.469-1.162.469-.436 0-.854-.169-1.162-.469A1.58 1.58 0 0 1 5 30.4V1.6c0-.424.173-.831.481-1.131C5.79.169 6.207 0 6.643 0c.436 0 .854.169 1.162.469.308.3.48.707.48 1.131v1.6h18.073c.28 0 .555.07.8.203.244.133.45.324.597.556a1.57 1.57 0 0 1 .072 1.556L24.909 11.2l2.918 5.685a1.564 1.564 0 0 1-.072 1.556 1.625 1.625 0 0 1-.597.556ZM17.09 7.2a1 1 0 1 0-2 0v2.6h-2.697a1 1 0 0 0 0 2h2.697v2.6a1 1 0 1 0 2 0v-2.6h2.696a1 1 0 1 0 0-2H17.09V7.2Z'
        clipRule='evenodd'
      />
    </svg>
  )
}

// TODO: fix view box
