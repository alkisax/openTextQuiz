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
  canonicalAnswer?: CanonicalPointsAnswer;
};

type CanonicalPointsAnswer = {
  type: "points";
  points: {
    x: number;
    y: number;
    label: string;
  }[];
};

type MapPoint = {
  x: number;
  y: number;
  label: string;
};

const pickRandomQuestion = (questions: GeoQuestion[]) => {
  const mapQuestions = questions.filter((q) => q.rules?.map);
  if (mapQuestions.length === 0) return null;

  const index = Math.floor(Math.random() * mapQuestions.length);
  return mapQuestions[index];
};

const GeographyMaps = () => {
  const [question, setQuestion] = useState<GeoQuestion | null>(null);
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [showAnswers, setShowAnswers] = useState(false);

  pickRandomQuestion(geoQuestionsData as GeoQuestion[]);

  const getCanonicalPoints = (question: GeoQuestion | null): MapPoint[] => {
    if (!question) return [];

    const canonical = question.canonicalAnswer;
    if (!canonical || canonical.type !== "points") return [];

    return canonical.points.map((p) => ({
      x: p.x,
      y: p.y,
      label: p.label,
    }));
  };

  const handleNextQuestion = () => {
    setQuestion(pickRandomQuestion(geoQuestionsData as GeoQuestion[]));
    setPoints([]);
    setShowAnswers(false);
  };

  const handleShowAnswers = () => {
    if (!question) return;

    const canonicalPoints = getCanonicalPoints(question);

    setPoints(canonicalPoints); // 👈 φορτώνουμε τις σωστές απαντήσεις
    setShowAnswers(true);
  };

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

      <MapClickQuiz
        maxWidth={500}
        points={points}
        setPoints={setPoints}
        maxPoints={question?.rules?.maxPoints ?? 4}
        readOnly={showAnswers}
      />

      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button variant="contained" onClick={handleNextQuestion}>
          Νέα τυχαία ερώτηση
        </Button>

        <Button
          variant="outlined"
          onClick={handleShowAnswers}
          disabled={!question}
        >
          Δείξε απαντήσεις
        </Button>
      </Box>

      {/* ΒΗΜΑ 2: εδώ θα μπει το MapClickQuiz + απαντήσεις */}
      {/* <MapClickQuiz maxWidth={900} /> */}
    </Box>
  );
};

export default GeographyMaps;
