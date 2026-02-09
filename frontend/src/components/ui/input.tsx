import * as React from "react"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className = "", ...props }, ref) => (
		<input
			ref={ref}
			{...props}
			className={`border rounded px-1 text-sm ${className}`}
		/>
	),
)

Input.displayName = "Input"
