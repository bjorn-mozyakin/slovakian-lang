import type { ButtonHTMLAttributes } from 'react'
import './Button.scss'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  fullWidth?: boolean
}

export function Button({ variant = 'primary', fullWidth, className, ...rest }: ButtonProps) {
  const classes = [
    'button',
    `button--${variant}`,
    fullWidth ? 'button--full-width' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return <button className={classes} {...rest} />
}
