// core\frontend\js\trueFalse-alkis\core-transfer\pages\CoreTestFullQuestion.tsx

import MultipleChoiceQuestion from "../components/MultipleChoiceQuestion"
import TrueFalseStatementQuestion from "../components/TrueFalseStatementQuestion"
import type { CoreAnswer } from "../types/client.types"
import { StatementType } from "../types/enums"
import type { Statement } from "../types/models"

type Props = {
	question: Statement
	userAnswer?: CoreAnswer
	onChange: (value: CoreAnswer) => void
}

const CoreTestFullQuestion = ({ question, userAnswer, onChange }: Props) => {
	// dispatcher ανά type
	if (question.type === StatementType.MULTIPLE_CHOICE) {
		console.log(question)

		return (
			<MultipleChoiceQuestion // TODO θα αλλάξουμε το
				question={question}
				userAnswer={userAnswer}
				onChange={onChange}
			/>
		)
	}

	if (question.type === StatementType.TRUE_FALSE) {
		console.log(question)
		return (
			<TrueFalseStatementQuestion
				question={question}
				userAnswer={userAnswer}
				onChange={onChange}
			/>
		)
	}

	// fallback message
	return (
		<div className="text-red-500 text-sm">
			Unsupported question type: {question.type}
		</div>
	)
}

export default CoreTestFullQuestion
