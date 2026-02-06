import { Box } from '@mui/material';
import type { GradedPoint, GeoQuestion } from '../types/geoTypes';

type GeoGradingSummaryProps = {
  gradedPoints: GradedPoint[];
  question: GeoQuestion | null;
};

const GeoGradingSummary = ({
  gradedPoints,
  question,
}: GeoGradingSummaryProps) => {
  return (
    <Box
      sx={{
        mt: 2,
        p: 1,
        border: '1px solid #ccc',
        fontFamily: 'monospace',
      }}
    >
      <div>
        Πλήρως σωστά:{' '}
        {gradedPoints.filter((p) => p.correct && p.labelCorrect).length} /{' '}
        {question?.rules?.maxPoints ?? gradedPoints.length}
      </div>

      <div>
        Χωρικά σωστά: {gradedPoints.filter((p) => p.correct).length}
      </div>

      {gradedPoints.map((p, i) => (
        <div key={i}>
          {i + 1}. ({p.x.toFixed(2)}, {p.y.toFixed(2)}) → "{p.label}" |{' '}
          <span>📍 {p.correct ? 'σωστό σημείο' : 'λάθος σημείο'}</span> |{' '}
          <span>
            🏷{' '}
            {p.labelCorrect
              ? p.hasSpellingErrors
                ? 'σωστό με ορθογραφικά'
                : 'σωστό λεκτικό'
              : 'λάθος λεκτικό'}
          </span>
        </div>
      ))}
    </Box>
  );
};

export default GeoGradingSummary;
