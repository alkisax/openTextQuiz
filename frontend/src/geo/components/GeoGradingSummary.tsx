import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Chip,
} from '@mui/material';
import type { GradedPoint, GeoQuestion } from '../types/geoTypes';

type GeoGradingSummaryProps = {
  gradedPoints: GradedPoint[];
  question: GeoQuestion | null;
};

const GeoGradingSummary = ({
  gradedPoints,
  question,
}: GeoGradingSummaryProps) => {
  const fullyCorrect = gradedPoints.filter(
    (p) => p.correct && p.labelCorrect,
  ).length;

  const spatialCorrect = gradedPoints.filter((p) => p.correct).length;

  const maxPoints = question?.rules?.maxPoints ?? gradedPoints.length;

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        {/* Τίτλος */}
        <Typography variant="h6" gutterBottom>
          Αξιολόγηση
        </Typography>

        {/* Summary */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Chip
            label={`Πλήρως σωστά: ${fullyCorrect} / ${maxPoints}`}
            color={fullyCorrect === maxPoints ? 'success' : 'default'}
          />
          <Chip
            label={`Χωρικά σωστά: ${spatialCorrect}`}
            color="info"
          />
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Λεπτομέρειες */}
        <List dense>
          {gradedPoints.map((p, i) => (
            <ListItem key={i} disableGutters>
              <ListItemText
                primary={
                  <Typography variant="body2">
                    {i + 1}. ({p.x.toFixed(2)}, {p.y.toFixed(2)}) → “{p.label}”
                  </Typography>
                }
                secondary={
                  <Box sx={{ mt: 0.5 }}>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        size="small"
                        label={p.correct ? 'σωστό σημείο' : 'λάθος σημείο'}
                        color={p.correct ? 'success' : 'error'}
                      />
                      <Chip
                        size="small"
                        label={
                          p.labelCorrect
                            ? p.hasSpellingErrors
                              ? 'σωστό με ορθογραφικά'
                              : 'σωστό λεκτικό'
                            : 'λάθος λεκτικό'
                        }
                        color={p.labelCorrect ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </Stack>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default GeoGradingSummary;
