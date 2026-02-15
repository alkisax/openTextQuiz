// frontend\src\geography-full\types\geographyFull.types.ts

export type GeoQuestion = {
  id: string
  type: string
  question: string
  options: Record<string, string>
  correctAnswer: string
}

export type GeoGradedAnswer = {
  id: string
  userAnswer?: string
  correctAnswer: string
  correct: boolean
  type: GeoQuestion['type']
}