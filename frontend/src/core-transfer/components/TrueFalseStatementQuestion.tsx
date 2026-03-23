// frontend\src\core-transfer\components\TrueFalseStatementQuestion.tsx
import type { Statement, TrueFalseContent } from '../types/models'
import QuestionMediaBlock from './QuestionMediaBlock'

type Props = {
  question: Statement
  userAnswer?: number
  onChange: (value: number, order: number[]) => void
}

const TrueFalseStatementQuestion = ({ question, userAnswer, onChange }: Props) => {
  const content = question.content as TrueFalseContent

  // βρίσκουμε index απο data (όχι hardcode)
  const trueIndex = content.choices.findIndex(c => c.text === 'Σωστό')
  const falseIndex = content.choices.findIndex(c => c.text === 'Λάθος')

  return (
    <div className='border p-4 rounded space-y-3'>
      {/* prompt */}
      {content.prompt_text && <p>{content.prompt_text}</p>}

      {/* image */}
      {content.prompt_asset_id && (
        <QuestionMediaBlock
          text={content.prompt_text}
          assetId={content.prompt_asset_id}
        />
      )}

      {/* TRUE / FALSE */}
      <div className='flex gap-4'>
        <label>
          <input
            type='radio'
            checked={userAnswer === trueIndex}
            onChange={() => onChange(trueIndex, [])}
          />
          Σωστό
        </label>

        <label>
          <input
            type='radio'
            checked={userAnswer === falseIndex}
            onChange={() => onChange(falseIndex, [])}
          />
          Λάθος
        </label>
      </div>
    </div>
  )
}

export default TrueFalseStatementQuestion