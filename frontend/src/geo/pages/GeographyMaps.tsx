import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import geoQuestionsData from "../../data/geoQuestionsData.json";
import MapClickQuiz from "../components/MapClickQuiz";
import type { GeoQuestion, MapPoint, GradedPoint } from "../types/geoTypes";

// UTILS / HELPERS
import {
  // διαλέγει τυχαία ΜΟΝΟ ερώτηση που έχει rules.map === true
  // αυτό είναι μονο για dev. αλλιώς η ερώτηση θα έρχετε αλλιώς
  getCanonicalPoints,
  // Σημεία απο την απάντηση
  // μετατρέπει το canonicalAnswer της ερώτησης σε MapPoint[]
  pickRandomQuestion,
} from "../utils/geoQuestionUtils";

import { gradePoints, buildReviewPoints } from "../utils/geoGrading";
import GeoGradingSummary from "../components/GeoGradingSummary";

const GeographyMaps = () => {
  // τρέχουσα ερώτηση
  const [question, setQuestion] = useState<GeoQuestion | null>(null);

  // σημεία που έχει βάλει ο χρήστης (ή που δείχνουμε ως λύσεις)
  const [points, setPoints] = useState<MapPoint[]>([]);

  // αποτέλεσμα αξιολόγησης των σημείων του χρήστη (σωστό / λάθος)
  const [gradedPoints, setGradedPoints] = useState<
    (GradedPoint & { correct: boolean })[] | null
  >(null);

  // στο submit θα δείχνουμε όλα τα σημεια του user + όσα δεν βρέθηκαν
  const [displayPoints, setDisplayPoints] = useState<MapPoint[]>([]);

  // flag μόνο για flow (δεν το διαβάζουμε)
  const [, setShowAnswers] = useState(false);

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

    const canonicalPoints = getCanonicalPoints(question); // μου επιστρέφει [x,y,label]

    // αντικαθιστούμε τα user points με τα canonical
    // θα αλλάξει να δείχνει τα λάθη και τις απαντήσεις
    setPoints(canonicalPoints);
    setShowAnswers(true);
  };

  // submit απαντήσεων
  const handleSubmit = () => {
    if (!question?.canonicalAnswer) return;

    const tolerance = question.rules?.tolerancePct ?? 3.5;

    const graded = gradePoints(
      points,
      question.canonicalAnswer.points,
      tolerance,
    );

    setGradedPoints(graded);

    const canonicalPoints = getCanonicalPoints(question);
    const reviewPoints = buildReviewPoints(graded, canonicalPoints, tolerance);

    setDisplayPoints(reviewPoints);
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
        maxWidth={900}
        points={gradedPoints ? displayPoints : points} // πριν submit → points, μετά submit → displayPoints
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
        <GeoGradingSummary gradedPoints={gradedPoints} question={question} />
      )}
    </Box>
  );
};

export default GeographyMaps;
