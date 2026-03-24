// core\frontend\js\trueFalse-alkis\core-transfer\components\MultipleChoiceQuestion.tsx

import { useMemo } from "react"
import type { CoreAnswer } from "../types/client.types"
import type { Statement, TrueFalseContent } from "../types/models"
import QuestionMediaBlock from "./QuestionMediaBlock"

type Props = {
	question: Statement
	userAnswer?: CoreAnswer
	onChange: (value: CoreAnswer) => void
}

const MultipleChoiceQuestion = ({ question, userAnswer, onChange }: Props) => {
	// κάνουμε type narrowing
	const content = question.content as TrueFalseContent

	// αυτό προστέθηκε για την λειτουργία shuffled. To προβλημα που προσπαθούμε να λύσουμε είναι το εξής: σε κάθε render αλλάζει η σειρά που εμφανίζονται οι απαντήσεις. Εμείς έχουμε κρατήσει που βρίσκονται οι αρχικές θέσεις των ερωτήσεων και που πήγαν μετά και έτσι μπορούμε να αντιστοιχισουμε την απάντηση του user στην σειρά που του εμφανίστηκε με την αρχική θέση της απάντησης αυτής στα data
	// ο λόγος που χρησιμοποιούμε useMemo είναι γιατί δεν θέλουμε να κάνει rerender και άρα reshuffle τις απαντήσεις πριν να είναι ώρα.
	// biome-ignore lint/correctness/useExhaustiveDependencies: shuffle only once per mount
	const shuffledChoices = useMemo(() => {
		// φτιάχνουμε array με indexes των επιλογών
		// πχ choices: [A, B, C] → indexed: [0, 1, 2]
		const indexed = content.choices.map((_, i) => i)

		// κάνουμε shuffle τα indexes (όχι τα ίδια τα choices)
		// πχ [0,1,2] → [1,2,0]
		// αυτό είναι το "order": UI θέση → original index
		return indexed.sort(() => 0.5 - Math.random())
	}, []) // (αγνόησα το lint) θέλουμε shuffle μόνο στο mount (όχι σε κάθε render / change)

	return (
		<div className="border p-4 rounded space-y-3">
			{/* prompt */}
			{content.prompt_text && <p>{content.prompt_text}</p>}

			{/* image (αν υπάρχει) */}
			{content.prompt_asset_id && (
				<QuestionMediaBlock
					text={content.prompt_text}
					assetId={content.prompt_asset_id}
				/>
			)}

			{/* επιλογές */}
			{shuffledChoices.map((originalIndex, i) => {
				const choice = content.choices[originalIndex]

				return (
					<div key={`q-${question.id}-choice-${i}`}>
						<input
							type="radio"
							name={`q-${question.id}`}
							checked={userAnswer?.type === "single" && userAnswer.index === i}
							onChange={() =>
								onChange({
									type: "single",
									index: i,
									order: shuffledChoices,
								})
							}
						/>
						<span>{choice.text}</span>
					</div>
				)
			})}
		</div>
	)
}

export default MultipleChoiceQuestion
