import { Checkbox } from "@/components/ui/checkbox"
import type { GeoMultiSelectQuestion } from "../types/geographyFull.types"

type Props = {
	question: GeoMultiSelectQuestion
	value?: string[]
	onChange: (value: string[]) => void
}

const MultiSelectQuestion = ({ question, value = [], onChange }: Props) => {
	const handleToggle = (option: string) => {
		const current = value ?? []

		const alreadySelected = current.includes(option)

		if (alreadySelected) {
			onChange(current.filter((o) => o !== option))
			return
		}

		// Αν φτάσαμε maxSelections δεν προσθέτουμε άλλο
		if (current.length >= question.maxSelections) return

		onChange([...current, option])
	}

	return (
		<div className="space-y-4">
			<p className="font-medium">{question.question}</p>

			<div className="space-y-2">
				{question.options.map((option) => (
					<div key={option} className="flex items-center space-x-2">
						<Checkbox
							checked={value?.includes(option)}
							onCheckedChange={() => handleToggle(option)}
						/>
						<label className="text-sm font-medium">{option}</label>
					</div>
				))}
			</div>

			<p className="text-xs text-muted-foreground">
				Επιλέξτε {question.minSelections} έως {question.maxSelections}.
			</p>
		</div>
	)
}

export default MultiSelectQuestion
