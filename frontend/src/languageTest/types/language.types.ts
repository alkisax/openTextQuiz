export type QuestionBase = {
  id: string
  question: string
  correctAnswer: string
}

export type MultipleChoiceQuestion = QuestionBase & {
  type: 'multipleChoice'
  options: Record<string, string>
}

export type TrueFalseQuestion = QuestionBase & {
  type: 'trueFalseNA'
  correctAnswer: 'T' | 'F' | 'NA'
}

export type ShortTextQuestion = QuestionBase & {
  type: 'shortText'
  caseSensitive?: boolean
  trim?: boolean
  acceptableAnswers?: string[]
  normalizeGreek?: boolean
  multipleBlanks?: boolean
}

export type Question =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | ShortTextQuestion

export type LanguageTestType = {
  id: string
  category: string
  type: 'readingTest'
  title: string
  prompt: string
  text: string
  parts: {
    A: {
      type: 'comprehension'
      instructions: string
      questions: Question[]
    }
    B: {
      type: 'grammar'
      instructions: string
      questions: Question[]
    }
    C: {
      type: 'essay'
      instructions: string
      question: string
      minWords: number
      maxWords: number
      evaluation: {
        method: string
        responseFormat: string
        maxScore: number
        criteria: string[]
      }
    }
  }
}

export type GradedAnswer = {
  id: string
  userAnswer: string | undefined
  correctAnswer: string
  correct: boolean
  hasSpellingErrors?: boolean
  type: string
}

export type EssayScores = {
  content: number
  coherence: number
  grammar: number
  vocabulary: number
  structure: number
}

export type EssayResult = {
  status: boolean
  scores: EssayScores
  total: number
  feedback: string
  modelAnswer: string
}