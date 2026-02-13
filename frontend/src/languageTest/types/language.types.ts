export type MultipleChoiceQuestionType = {
  id: string
  type: string
  question: string
  options: Record<string, string>
  correctAnswer: string
}

export type TrueFalseQuestionType = {
  id: string
  type: 'trueFalseNA'
  question: string
  correctAnswer: string
}

export type Question = {
  id: string
  type: string
  question: string
  options?: Record<string, string>
  correctAnswer: string
}
