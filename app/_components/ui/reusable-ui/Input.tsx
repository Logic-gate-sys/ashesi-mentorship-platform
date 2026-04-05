import { forwardRef } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { ErrorIcon } from '../icons/'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:    string
  error?:    string
  hint?:     string
  left?:     ReactNode   // icon on the left
  right?:    ReactNode   // icon or button on the right
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, hint, left, right, id, className = '', ...props},
    ref
  ) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">

        {label && (
          <label
            htmlFor={id}
            className="font-body text-[14px] font-semibold text-text"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {left && (
            <div className="absolute left-3 text-text-muted pointer-events-none">
              {left}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            className={`
              w-full h-[44px] bg-surface border rounded-[8px]
              font-body text-[14px] text-text
              placeholder:text-text-muted
              outline-none transition-all duration-150
              ${error
                ? 'border-red-400 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]'
                : 'border-border hover:border-[#c0bfbf] focus:border-primary focus:shadow-[0_0_0_3px_rgba(127,29,29,0.10)]'
              }
              ${left  ? 'pl-10' : 'pl-4'}
              ${right ? 'pr-10' : 'pr-4'}
              ${className}
            `}
            {...props}
          />
          {right && (
            <div className="absolute right-3 text-text-muted">
              {right}
            </div>
          )}
        </div>
        {error && (
          <p className="font-body text-[12px] text-red-500 flex items-center gap-1.5">
            <ErrorIcon />
            {error}
          </p>
        )}

        {!error && hint && (
          <p className="font-body text-[12px] text-text-muted">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input';

export default Input ; 