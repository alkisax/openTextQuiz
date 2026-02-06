import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import geoQuestionsData from "../data/geoQuestionsData.json";
import MapClickQuiz from "../components/MapClickQuiz";
import { simplifyLang } from "../utils/simplifyLang";

// ΤΥΠΟΙ ΔΕΔΟΜΕΝΩΝ
// ερώτησης γεωγραφίας
type GeoQuestion = {
  id: string;
  category: string;
  ερώτηση: string;
  rules?: {
    map?: boolean; // αν είναι ερώτηση με χάρτη
    maxPoints?: number; // πόσα σημεία επιτρέπονται
    tolerance?: boolean; // αυτό είναι bool (δεν το έχω χρησιμοποιήσει γιατί βάζω απευθείας tolerancePct 3.5/8 )
    tolerancePct?: number; // ανοχή σε %
    expectsSubset?: boolean; // αυτό αφορά αλλλου τύπου έρωτήσεις (πχ 4 απο τους 12 θεους του ολύμπου. Αν και έχουμε και μία εδω)
    minItems?: number;
    maxItems?: number;
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

// σημείο πάνω στον χάρτη (user ή απάντησης)
type MapPoint = {
  x: number;
  y: number;
  label: string;
};

// τύπος graded point
type GradedPoint = MapPoint & {
  correct: boolean;
  labelCorrect: boolean;
  hasSpellingErrors: boolean;
};

type LabelCheckResult = {
  correct: boolean;
  hasSpellingErrors: boolean;
};

//HELPER
// διαλέγει τυχαία ΜΟΝΟ ερώτηση που έχει rules.map === true
// αυτό είναι μονο για dev. αλλιώς η ερώτηση θα έρχετε αλλιώς
const pickRandomQuestion = (questions: GeoQuestion[]) => {
  const mapQuestions = questions.filter((question) => question.rules?.map);
  if (mapQuestions.length === 0) return null;

  const index = Math.floor(Math.random() * mapQuestions.length);
  return mapQuestions[index];
};

const GeographyMaps = () => {
  // τρέχουσα ερώτηση
  const [question, setQuestion] = useState<GeoQuestion | null>(null);
  // σημεία που έχει βάλει ο χρήστης (ή που δείχνουμε ως λύσεις)
  const [points, setPoints] = useState<MapPoint[]>([]);
  // αποτέλεσμα αξιολόγησης των σημείων του χρήστη (σωστό / λάθος)
  const [gradedPoints, setGradedPoints] = useState<
    (GradedPoint & { correct: boolean })[] | null
  >(null);
  // στο submit θα δείχνουμε όλα τα σημεια του user + όσα σωστα δεν βρέθηκαν
  const [displayPoints, setDisplayPoints] = useState<MapPoint[]>([]);
  // TODO flag μόνο για flow (δεν το διαβάζουμε)
  const [, setShowAnswers] = useState(false);

  // Σημεία απο την απάντηση
  // μετατρέπει το canonicalAnswer της ερώτησης σε MapPoint[]
  const getCanonicalPoints = (question: GeoQuestion | null): MapPoint[] => {
    if (!question) return [];

    const canonical = question.canonicalAnswer;
    if (!canonical || canonical.type !== "points") return [];

    return canonical.points.map((point) => ({
      x: point.x,
      y: point.y,
      label: point.label,
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

    const canonicalPoints = getCanonicalPoints(question); // μου επιστρέφει [x,y,label]

    // αντικαθιστούμε τα user points με τα canonical
    // TODO θα αλλάξει να δείχνει τα λάθη και τις απαντήσεις
    setPoints(canonicalPoints);
    setShowAnswers(true);
  };

  // GRADING (ΜΟΝΟ ΣΗΜΕΙΟ)
  // απόσταση δύο σημείων σε ποσοστά → μου επιστρέφει την υποτείνουσα
  const distancePct = (
    a: { x: number; y: number },
    b: { x: number; y: number },
  ) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // ελέγχει αν τα user points πέφτουν κοντά σε canonical
  const gradePoints = (
    userPoints: MapPoint[],
    canonicalPoints: { x: number; y: number; label: string }[],
    tolerancePct: number,
  ): GradedPoint[] => {
    const remaining = [...canonicalPoints]; // για να μην αγγίζουμε το array των απαντήσεων

    // παίρνει ένα ένα τα σημεία του user, και ελεγχει αν η αποστασή με του με κάποιο απο τα σημεία της απάντησης είναι μικρότερη απο το οριο. αν ναί το μετράει ως σωστό. επιστρέφει το σημείο με correct: true/false
    return userPoints.map((userPoint) => {
      let matchedIndex = -1; // = δεν βρέθηκε τίποτα ακόμα
      let labelResult = {
        correct: false,
        hasSpellingErrors: false,
      };

      const isCorrect = remaining.some((canonicalPont, i) => {
        const dist = distancePct(userPoint, canonicalPont); // helper πιο πανω
        if (dist <= tolerancePct) {
          matchedIndex = i;
          return true;
        }
        return false;
      });

      // αν βρεθεί σωστό, αφαιρείται από τα διαθέσιμα
      if (matchedIndex !== -1) {
        const matchedCanonical = remaining[matchedIndex];
        labelResult = isLabelCorrect(userPoint.label, matchedCanonical.label);
        remaining.splice(matchedIndex, 1); // αφαιρεί 1 ξεκινόντας απο το matchedIndex, δηλ αφαιρεί το matchedIndex
      }

      return {
        ...userPoint,
        correct: isCorrect,
        labelCorrect: labelResult.correct,
        hasSpellingErrors: labelResult.hasSpellingErrors,
      };
    });
  };

  const isLabelCorrect = (
    userLabel: string,
    canonicalLabel: string,
  ): LabelCheckResult => {
    const cleanUser = userLabel.trim();
    const cleanCanonical = canonicalLabel.trim();

    // 1️⃣ exact match → όλα σωστά
    if (cleanUser === cleanCanonical) {
      return { correct: true, hasSpellingErrors: false };
    }

    // 2️⃣ simplified match → σωστό αλλά με ορθογραφικά
    const simplifiedUser = simplifyLang(cleanUser);
    const simplifiedCanonical = simplifyLang(cleanCanonical);

    if (simplifiedUser === simplifiedCanonical) {
      return { correct: true, hasSpellingErrors: true };
    }

    // 3️⃣ αποτυχία
    return { correct: false, hasSpellingErrors: false };
  };

  // φτιάχνει τα σημεία που θα εμφανιστούν μετά το submit (δηλ σωστά + τα λάθη και το αντιστοιχό σωστό σημείο)
  const buildReviewPoints = (
    graded: GradedPoint[],
    canonicalPoints: MapPoint[],
    tolerancePct: number,
  ): MapPoint[] => {
    // κρατάμε όσα canonical ΔΕΝ αντιστοιχήθηκαν σε σωστό user point
    const remainingCanonical = [...canonicalPoints]; // για να μην αγγίζουμε το array των απαντήσεων

    // αφαιρούμε από τα canonical όσα έχουν καλυφθεί σωστά
    graded.forEach((gradedPoint) => {
      if (!gradedPoint.correct) return;

      // αν είναι λάθος το σημείο θα πρέπει να δουμε ποιο απο τις απαντήσεις δεν έχει βρεί λύση. δεν σκεφτικα κάποιον άλλο τρόπο και θα κάνουμε τον ίδιο υπολογισμό με την υποτείνουσα με πριν
      const index = remainingCanonical.findIndex((canonicalPoint) => {
        const dx = gradedPoint.x - canonicalPoint.x;
        const dy = gradedPoint.y - canonicalPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= tolerancePct;
      });

      if (index !== -1) {
        remainingCanonical.splice(index, 1);
      }
    });

    // επιστρέφουμε:
    // - όλα τα user points (σωστά + λάθος)
    // - + όσα canonical έμειναν (αυτά που δεν βρήκε)
    return [
      ...graded.map((g) => ({
        x: g.x,
        y: g.y,
        label: g.label,
      })),
      ...remainingCanonical,
    ];
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
        points={gradedPoints ? displayPoints : points} //πριν submit → points, μετά submit → displayPoints
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
            Πλήρως σωστά:{" "}
            {gradedPoints.filter((p) => p.correct && p.labelCorrect).length} /{" "}
            {question?.rules?.maxPoints ?? gradedPoints.length}
          </div>

          <div>
            Χωρικά σωστά: {gradedPoints.filter((p) => p.correct).length}
          </div>

          {gradedPoints.map((p, i) => (
            <div key={i}>
              {i + 1}. ({p.x.toFixed(2)}, {p.y.toFixed(2)}) → "{p.label}"{" | "}
              <span>📍 {p.correct ? "σωστό σημείο" : "λάθος σημείο"}</span>
              {" | "}
              <span>
                🏷{" "}
                {p.labelCorrect
                  ? p.hasSpellingErrors
                    ? "σωστό με ορθογραφικά"
                    : "σωστό λεκτικό"
                  : "λάθος λεκτικό"}
              </span>
            </div>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default GeographyMaps;
