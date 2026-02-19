import { expandOptionalParts, simplifyLang } from "./simplifyLang"

type ShortTextQuestion = {
	id: string
	correctAnswer: string
	caseSensitive?: boolean
	trim?: boolean
	normalizeGreek?: boolean
}

export const isShortTextCorrect = (
	userAnswer: string | undefined,
	question: ShortTextQuestion,
) => {
	if (!userAnswer) return false

	let user = userAnswer
	let correct = question.correctAnswer

	if (question.trim !== false) {
		user = user.trim()
		correct = correct.trim()
	}

	if (!question.caseSensitive) {
		user = user.toLowerCase()
		correct = correct.toLowerCase()
	}

	if (question.normalizeGreek) {
		user = simplifyLang(user)
		correct = simplifyLang(correct)
	}

	return user === correct
}

export const gradeShortTextDetailed = (
	userAnswer: string | undefined,
	correctAnswer: string,
	acceptableAnswers: string[] = [],
) => {
	if (!userAnswer) {
		return { correct: false, hasSpellingErrors: false }
	}

	const cleanUser = userAnswer.trim()

	// 🔹 δημιουργούμε variants μόνο αν υπάρχουν ()
	const correctVariants = expandOptionalParts(correctAnswer)
	//flatMap = map που δεν κρατά nested arrays.
	const acceptableVariants = acceptableAnswers.flatMap(expandOptionalParts)

	// exact match main
	if (correctVariants.some((v) => cleanUser === v.trim())) {
		return { correct: true, hasSpellingErrors: false }
	}

	// exact match acceptable
	if (acceptableVariants.some((v) => cleanUser === v.trim())) {
		return { correct: true, hasSpellingErrors: false }
	}

	const simplifiedUser = simplifyLang(cleanUser)

	// simplified match main
	if (correctVariants.some((v) => simplifiedUser === simplifyLang(v.trim()))) {
		return { correct: true, hasSpellingErrors: true }
	}

	// simplified match acceptable
	if (
		acceptableVariants.some((v) => simplifiedUser === simplifyLang(v.trim()))
	) {
		return { correct: true, hasSpellingErrors: true }
	}

	return { correct: false, hasSpellingErrors: false }
}
