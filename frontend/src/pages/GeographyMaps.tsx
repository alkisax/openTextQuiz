import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import geoQuestionsData from "../data/geoQuestionsData.json";
import MapClickQuiz from "../components/MapClickQuiz";

/* =========================
   ΤΥΠΟΙ ΔΕΔΟΜΕΝΩΝ
========================= */

// τύπος ερώτησης γεωγραφίας
type GeoQuestion = {
  id: string;
  category: string;
  ερώτηση: string;
  rules?: {
    map?: boolean; // αν είναι ερώτηση με χάρτη
    maxPoints?: number; // πόσα σημεία επιτρέπονται
    tolerancePct?: number; // ανοχή σε %
    expectsSubset?: boolean;
    minItems?: number;
    maxItems?: number;
    tolerance?: boolean;
  };
  canonicalAnswer?: CanonicalPointsAnswer; // σωστές απαντήσεις
};

// canonical απάντηση τύπου "points"
type CanonicalPointsAnswer = {
  type: "points";
  points: {
    x: number;
    y: number;
    label: string;
  }[];
};

// σημείο πάνω στον χάρτη (user ή canonical)
type MapPoint = {
  x: number;
  y: number;
  label: string;
};

//HELPERS
// διαλέγει τυχαία ΜΟΝΟ ερώτηση που έχει rules.map === true
const pickRandomQuestion = (questions: GeoQuestion[]) => {
  const mapQuestions = questions.filter((q) => q.rules?.map);
  if (mapQuestions.length === 0) return null;

  const index = Math.floor(Math.random() * mapQuestions.length);
  return mapQuestions[index];
};

const GeographyMaps = () => {
  // τρέχουσα ερώτηση
  const [question, setQuestion] = useState<GeoQuestion | null>(null);

  // σημεία που έχει βάλει ο χρήστης (ή που δείχνουμε ως λύσεις)
  const [points, setPoints] = useState<MapPoint[]>([]);

  const [gradedPoints, setGradedPoints] = useState<
    (MapPoint & { correct: boolean })[] | null
  >(null);

  // flag μόνο για flow (δεν το διαβάζουμε)
  const [, setShowAnswers] = useState(false);

  // CANONICAL POINTS
  // μετατρέπει το canonicalAnswer της ερώτησης σε MapPoint[]
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

  // BUTTON HANDLERS
  // νέα τυχαία ερώτηση
  const handleNextQuestion = () => {
    setQuestion(pickRandomQuestion(geoQuestionsData as GeoQuestion[]));
    setPoints([]);
    setGradedPoints(null);
    setShowAnswers(false);
  };

  // δείχνει τις σωστές απαντήσεις
  const handleShowAnswers = () => {
    if (!question) return;

    const canonicalPoints = getCanonicalPoints(question);

    // αντικαθιστούμε τα user points με τα canonical
    setPoints(canonicalPoints);
    setShowAnswers(true);
  };

  // GRADING (ΜΟΝΟ ΣΗΜΕΙΟ)
  // απόσταση δύο σημείων σε ποσοστά
  const distancePct = (
    a: { x: number; y: number },
    b: { x: number; y: number },
  ) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // τύπος graded point
  type GradedPoint = MapPoint & {
    correct: boolean;
  };

  // ελέγχει αν τα user points πέφτουν κοντά σε canonical
  const gradePoints = (
    userPoints: MapPoint[],
    canonicalPoints: { x: number; y: number }[],
    tolerancePct: number,
  ): GradedPoint[] => {
    const remaining = [...canonicalPoints]; // για να μη μετράει διπλό

    return userPoints.map((userPoint) => {
      let matchedIndex = -1;

      const isCorrect = remaining.some((canon, i) => {
        const dist = distancePct(userPoint, canon);
        if (dist <= tolerancePct) {
          matchedIndex = i;
          return true;
        }
        return false;
      });

      // αν βρεθεί σωστό, αφαιρείται από τα διαθέσιμα
      if (matchedIndex !== -1) {
        remaining.splice(matchedIndex, 1);
      }

      return {
        ...userPoint,
        correct: isCorrect,
      };
    });
  };

  // submit απαντήσεων
  const handleSubmit = () => {
    if (!question?.canonicalAnswer) return;

    const tolerance = question.rules?.tolerancePct ?? 2.5;

    const graded = gradePoints(
      points,
      question.canonicalAnswer.points,
      tolerance,
    );

    setGradedPoints(graded); // 👈 ΤΟ ΚΡΙΣΙΜΟ
    console.log("graded result:", graded);
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

        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          disabled={points.length === 0}
        >
          Submit
        </Button>
      </Box>

      {gradedPoints && (
        <Box
          sx={{
            mt: 2,
            p: 1,
            border: "1px solid #ccc",
            fontFamily: "monospace",
          }}
        >
          <div>
            Αποτέλεσμα: {gradedPoints.filter((p) => p.correct).length} /{" "}
            {question?.rules?.maxPoints ?? gradedPoints.length}
          </div>

          {gradedPoints.map((p, i) => (
            <div key={i}>
              {i + 1}. ({p.x.toFixed(2)}, {p.y.toFixed(2)}) →{" "}
              {p.correct ? "✔ σωστό" : "✖ λάθος"}
            </div>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default GeographyMaps;
