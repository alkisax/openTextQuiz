// frontend/src/core-transfer/components/TrueFalseQuestion.tsx

import { useMemo } from 'react'
import type { Statement, TrueFalseContent } from '../types/models'
import QuestionMediaBlock from './QuestionMediaBlock'

type Props = {
  question: Statement
  userAnswer?: number
  onChange: (value: number, order: number[]) => void
}

const TrueFalseQuestion = ({ question, userAnswer, onChange }: Props) => {
  // κάνουμε type narrowing
  const content = question.content as TrueFalseContent

  const shuffledChoices = useMemo(() => {
    const indexed = content.choices.map((_, i) => i)

    return indexed.sort(() => 0.5 - Math.random())
  }, [question.id])

  return (
    <div className='border p-4 rounded space-y-3'>
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
              type='radio'
              checked={userAnswer === i}
              onChange={() => onChange(i, shuffledChoices)}
            />
            <span>{choice.text}</span>
          </div>
        )
      })}
    </div>
  )
}

export default TrueFalseQuestion