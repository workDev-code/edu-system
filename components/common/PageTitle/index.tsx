import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props {
  title: ReactNode
  className?: string
}

export default function PageTitle({ title, className }: Props) {
  return (
    <h1
      className={twMerge(
        'text-3xl md:text-4xl font-extrabold relative pb-2 mb-6 text-blue-500',
        'before:absolute before:-bottom-1 before:left-0 before:h-1 before:w-24 before:rounded-full before:bg-gradient-to-r before:from-purple-500 before:to-pink-500',
        className,
      )}
    >
      {title}
    </h1>
  )
}
