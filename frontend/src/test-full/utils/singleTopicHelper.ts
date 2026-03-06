import type { FullQuestion } from '../types/Full.types'

type QuestionGroups = {
  geography: FullQuestion[]
  culture: FullQuestion[]
  history: FullQuestion[]
  institutions: FullQuestion[]
}

// true αν έχουμε μόνο μια θεματική ενεργή (TODO να γίνει ποιο όμορφο αυτό schöne Scheiße)
export const isSingleTopicMode = (
  geo: number,
  cult: number,
  hist: number,
  inst: number,
) =>
  (geo > 0 && cult === 0 && hist === 0 && inst === 0) ||
  (geo === 0 && cult > 0 && hist === 0 && inst === 0) ||
  (geo === 0 && cult === 0 && hist > 0 && inst === 0) ||
  (geo === 0 && cult === 0 && hist === 0 && inst > 0)

export const pickNextQuestionHelper = (
  questionPointer: number,
  geo: number,
  cult: number,
  hist: number,
  inst: number,
  geoQuestions: FullQuestion[],
  cultureQuestions: FullQuestion[],
  historyQuestions: FullQuestion[],
  instQuestions: FullQuestion[],
): QuestionGroups => {

  if (geo > 0) {
    // το modulo το έχουμε για να ξεκινάει ξανα απο την αρχή αν πάει να πάρει ερώτηση που δεν είναι έξω απo το array
    const q = geoQuestions[questionPointer % geoQuestions.length]

    return {
      geography: [q], // δηλ geoQuestions[q]
      culture: [],
      history: [],
      institutions: [],
    }
  }

  if (cult > 0) {
    const q = cultureQuestions[questionPointer % cultureQuestions.length]

    return {
      geography: [],
      culture: [q],
      history: [],
      institutions: [],
    }
  }

  if (hist > 0) {
    const q = historyQuestions[questionPointer % historyQuestions.length]

    return {
      geography: [],
      culture: [],
      history: [q],
      institutions: [],
    }
  }

  if (inst > 0) {
    const q = instQuestions[questionPointer % instQuestions.length]

    return {
      geography: [],
      culture: [],
      history: [],
      institutions: [q],
    }
  }

  return {
    geography: [],
    culture: [],
    history: [],
    institutions: [],
  }
}