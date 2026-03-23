// frontend/src/core-transfer/hooks/useCoreFullGrading.ts

import type {
	CoreAnswer,
	CoreGradedAnswer,
	GradeAllResult,
} from "../types/client.types"
import type { Statement } from "../types/models"

export const useCoreFullGrading = () => {
	const gradeMultiple = (
		question: Statement,
		userAnswer: CoreAnswer | undefined,
	): CoreGradedAnswer => {
		if (question.type !== "MULTIPLE_CHOICE") {
			throw new Error("Wrong type")
		}

		const content = question.content

		// έχουμε ένα arr με [ { **, is_correct: false }, { **, is_correct: true } ] → βρίσκει σε ποιο index είναι η σωστή απάντηση
		// συγκρίνουμε την επιλογή του χρήστη με τη σωστή επιλογή
		// παίρνεις το index που είδε ο user
		const correctOriginalIndex = content.choices.findIndex(
			(choice) => choice.is_correct,
		)

		// βρίσκουμε σε ποια θέση εμφανίστηκε μετά το shuffle
		const correctIndexInShuffled =
			userAnswer?.order.indexOf(correctOriginalIndex)

		// συγκρίνουμε με αυτό που πάτησε ο user
		const isCorrect = userAnswer?.index === correctIndexInShuffled

		// αν δεν δώσει απάντηση false
		if (!userAnswer || !userAnswer.order) {
			return {
				id: question.id,
				userAnswer,
				correctAnswer: correctOriginalIndex,
				correct: false,
				type: "MULTIPLE_CHOICE",
			}
		}

		return {
			id: question.id,
			userAnswer,
			correctAnswer: correctOriginalIndex, // (κρατάμε και το correctAnswer για UI feedback)
			correct: isCorrect, // αυτό είναι το σημείο που επιστρέφουμε όλη την ερώτηση με boolean σωστο/λάθος
			type: "MULTIPLE_CHOICE",
		}
	}

	const gradeTrueFalseSimple = (
		question: Statement,
		userAnswer: CoreAnswer | undefined,
	): CoreGradedAnswer => {
		const content = question.content

		const correctIndex = content.choices.findIndex((c) => c.is_correct)

		const isCorrect = userAnswer?.index === correctIndex

		return {
			id: question.id,
			userAnswer,
			correctAnswer: correctIndex,
			correct: !!isCorrect,
			type: "TRUE_FALSE",
		}
	}

	const gradeAll = (
		questions: Statement[],
		answers: Record<number, CoreAnswer>,
	): GradeAllResult => {
		let correct = 0
		const results: CoreGradedAnswer[] = []

		for (const question of questions) {
			// φέρνουμε την απάντηση απο το array των απαντήσεων
			const userAnswer = answers[question.id]
			let result: CoreGradedAnswer

			switch (question.type) {
				case "MULTIPLE_CHOICE":
					result = gradeMultiple(question, userAnswer)
					break

				case "TRUE_FALSE":
					result = gradeTrueFalseSimple(question, userAnswer)
					break

				default:
					throw new Error(`Unsupported type: ${question.type}`)
			}

			if (result.correct) correct++
			results.push(result)
		}

		return {
			results,
			score: correct,
		}
	}

	return { gradeAll }
}
