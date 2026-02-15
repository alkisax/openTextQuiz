// frontend\src\geography-full\types\geographyFull.types.ts

export type GeoQuestionBase = {
  id: string
  category: 'γεωγραφία'
}

export type GeoMultipleChoiceQuestion = GeoQuestionBase & {
  type: 'multipleChoice'
  question: string
  options: Record<string, string>
  correctAnswer: string
}

export type GeoShortTextQuestion = GeoQuestionBase & {
  type: 'shortText'
  multipleBlanks: true
  question: string
  correctAnswer: string[]
}

export type GeoQuestion =
  | GeoMultipleChoiceQuestion
  | GeoShortTextQuestion

export type GeoGradedAnswer = {
  id: string
  userAnswer?: string | string[]
  correctAnswer: string | string[]
  correct: boolean
  hasSpellingErrors?: boolean 
  type: GeoQuestion['type']
}