import { useState } from "react"
import type { CoreAnswer } from "../types/client.types"
import type { Statement, TrueFalseContent } from "../types/models"
import QuestionMediaBlock from "./QuestionMediaBlock"

type Props = {
	question: Statement
	userAnswer?: CoreAnswer
	onChange: (value: CoreAnswer) => void
}

const TrueFalseStatementQuestion = ({
	question,
	userAnswer,
	onChange,
}: Props) => {
	const content = question.content as TrueFalseContent

	const [localAnswers, setLocalAnswers] = useState<Record<number, boolean>>(
		userAnswer?.type === "multi_tf" ? userAnswer.values : {},
	)

	const handleSelect = (index: number, value: boolean) => {
		const updated = {
			...localAnswers,
			[index]: value,
		}

		setLocalAnswers(updated)

		onChange({
			type: "multi_tf",
			values: updated,
		})
	}

	return (
		<div className="border p-4 rounded space-y-3">
			{/* prompt */}
			{content.prompt_text && <p>{content.prompt_text}</p>}

			{/* image */}
			{content.prompt_asset_id && (
				<QuestionMediaBlock
					text={content.prompt_text}
					assetId={content.prompt_asset_id}
				/>
			)}

			{/* statements */}
			{content.choices.map((choice, index) => (
				<div
					key={`${question.id}-${choice.text}`}
					className="flex gap-4 items-center"
				>
					<span className="flex-1">{choice.text}</span>

					<label>
						<input
							type="radio"
							name={`q-${question.id}-${index}`}
							checked={
								userAnswer?.type === "multi_tf" &&
								userAnswer.values[index] === true
							}
							onChange={() => handleSelect(index, true)}
						/>
						Σωστό
					</label>

					<label>
						<input
							type="radio"
							name={`q-${question.id}-${index}`}
							checked={
								userAnswer?.type === "multi_tf" &&
								userAnswer.values[index] === false
							}
							onChange={() => handleSelect(index, false)}
						/>
						Λάθος
					</label>
				</div>
			))}
		</div>
	)
}

export default TrueFalseStatementQuestion
