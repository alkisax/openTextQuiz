import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { GeoGradedAnswer } from '../types/geographyFull.types'

type Props = {
  gradedAnswers: GeoGradedAnswer[]
}

const GeographyFullGradingSummary = ({ gradedAnswers }: Props) => {
  const total = gradedAnswers.length
  const correctCount = gradedAnswers.filter(a => a.correct).length

  return (
    <Card className='mt-4'>
      <CardContent>
        <h3 className='mb-2 text-lg font-semibold'>
          Αξιολόγηση
        </h3>

        <div className='mb-3'>
          <Badge className='bg-primary text-primary-foreground'>
            Σωστά: {correctCount} / {total}
          </Badge>
        </div>

        <ul className='space-y-2'>
          {gradedAnswers.map((a, i) => (
            <li key={a.id} className='rounded-md border p-2'>
              <p className='text-sm font-medium'>
                {i + 1}. {a.userAnswer || '—'} → {a.correctAnswer}
              </p>

              <Badge
                className={
                  a.correct
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-destructive text-white'
                }
              >
                {a.correct ? 'σωστό' : 'λάθος'}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default GeographyFullGradingSummary