export type CoreAnswer = {
	index: number
	order: number[]
}

export type CoreGradedAnswer = {
	id: number
	userAnswer: CoreAnswer | undefined
	correctAnswer: number
	correct: boolean
	type: "TRUE_FALSE" | "MULTIPLE_CHOICE"
}

export type GradeAllResult = {
	results: CoreGradedAnswer[]
	score: number
}
