import { useState } from 'react'
import questions from '../data/geoData.json'
import MultipleChoiceQuestion from '@/languageTest/components/test-parts/MultipleChoiceQuestion'

const GeographyFullQuestion = () => {
  // κρατάμε μόνο μία ερώτηση για αρχή
  const question = questions[0]

  const [answer, setAnswer] = useState<string | undefined>()
  const [result, setResult] = useState<boolean | null>(null)

  // απλή αξιολόγηση
  const handleGrade = () => {
    if (!answer) return
    setResult(answer === question.correctAnswer)
  }

  return (
    <div className='max-w-3xl mx-auto py-10 space-y-6'>
      <h1 className='text-xl font-bold'>ΘΕΜΑ 1</h1>

      <p>
        Γράψτε στο τετράδιό σας τον αριθμό του θέματος και δίπλα τη σωστή
        απάντηση, σημειώνοντας το αντίστοιχο γράμμα (Α ή Β ή Γ ή Δ).
      </p>

      <MultipleChoiceQuestion
        question={{
          id: question.id,
          question: question.question,
          options: question.options
        }}
        value={answer}
        onChange={setAnswer}
      />

      <button
        type='button'
        className='px-4 py-2 bg-black text-white rounded'
        onClick={handleGrade}
      >
        Έλεγχος
      </button>

      {result !== null && (
        <p className='font-semibold'>
          {result ? 'Σωστό' : `Λάθος. Σωστή απάντηση: ${question.correctAnswer}`}
        </p>
      )}
    </div>
  )
}

export default GeographyFullQuestion