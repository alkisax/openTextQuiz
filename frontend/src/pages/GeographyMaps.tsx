import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import geoQuestionsData from "../data/geoQuestionsData.json";
import MapClickQuiz from "../components/MapClickQuiz";

type GeoQuestion = {
  id: string;
  category: string;
  ερώτηση: string;
  rules?: {
    map?: boolean;
    maxPoints?: number;
    tolerancePct?: number;
    expectsSubset?: boolean;
    minItems?: number;
    maxItems?: number;
    tolerance?: boolean;
  };
  canonicalAnswer?: unknown;
};


const pickRandomQuestion = (questions: GeoQuestion[]) => {
  const mapQuestions = questions.filter((q) => q.rules?.map);
  if (mapQuestions.length === 0) return null;

  const index = Math.floor(Math.random() * mapQuestions.length);
  return mapQuestions[index];
};

const GeographyMaps = () => {
  const [question, setQuestion] = useState<GeoQuestion | null>(null);

  pickRandomQuestion(geoQuestionsData as GeoQuestion[]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Geography Maps
      </Typography>

      {question && (
        <>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {question.ερώτηση}
          </Typography>

          <Typography variant="caption" sx={{ display: "block", mb: 2 }}>
            id: {question.id}
          </Typography>
        </>
      )}

      <MapClickQuiz maxWidth={500} />

      <Button
        variant="contained"
        onClick={() =>
          setQuestion(pickRandomQuestion(geoQuestionsData as GeoQuestion[]))
        }
      >
        Νέα τυχαία ερώτηση
      </Button>

      {/* ΒΗΜΑ 2: εδώ θα μπει το MapClickQuiz + απαντήσεις */}
      {/* <MapClickQuiz maxWidth={900} /> */}
    </Box>
  );
};

export default GeographyMaps;
