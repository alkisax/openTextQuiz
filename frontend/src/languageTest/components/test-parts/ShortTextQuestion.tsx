import { Input } from "@/components/ui/input"

type Props = {
	question: {
		id: string
		prompt?: string
		question: string
		multipleBlanks?: boolean
	}
	value: string | string[] | undefined
	onChange: (value: string | string[]) => void
}

const ShortTextQuestion = ({ question, value, onChange }: Props) => {
	const parts = question.question.split("__")
	const blanksCount = parts.length - 1

	const handleSingleChange = (val: string) => {
		onChange(val)
	}

	const handleMultiChange = (index: number, val: string) => {
		const current = Array.isArray(value) ? value : []

		const updated = [...current]
		updated[index] = val

		onChange(updated)
	}

	const renderWithBlanks = () => {
		if (blanksCount === 0) {
			return question.question
		}

		return parts.map((part, index) => (
			<span key={`${part}`}>
				{part}

				{index < blanksCount && (
					<Input
						value={
							question.multipleBlanks
								? Array.isArray(value)
									? value[index] || ""
									: ""
								: typeof value === "string"
									? value
									: ""
						}
						onChange={(e) =>
							question.multipleBlanks
								? handleMultiChange(index, e.target.value)
								: handleSingleChange(e.target.value)
						}
						className="
              inline-block
              w-40
              mx-2
              border-0
              border-b-2
              border-black
              rounded-none
              px-1
              focus-visible:ring-0
              focus-visible:ring-offset-0
              focus-visible:border-black
              bg-transparent
              font-semibold
            "
					/>
				)}
			</span>
		))
	}

	return (
		<div className="space-y-2">
			{question.prompt && (
				<p className="text-muted-foreground">{question.prompt}</p>
			)}

			<p className="font-medium leading-6">{renderWithBlanks()}</p>
		</div>
	)
}

export default ShortTextQuestion
