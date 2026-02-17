// frontend\src\test-full\pages\TestFullPagePicker.tsx
import { useState } from "react";
import geoData from "../data/geoData.json";
import cultureData from "../data/cultureData.json";
import TestFullQuestion from "./TestFullQuestion";
import { Button } from "@/components/ui/button";
import type {
  FullQuestion,
  FullGradedAnswer,
  FullAnswer,
} from "../types/Full.types";
import FullGradingSummary from "../components/FullGradingSummary";
import { useFullGrading } from "../hooks/useFullGrading";

type QuestionGroups = {
  geography: FullQuestion[];
  culture: FullQuestion[];
};

type Props = {
  geoCount?: number;
  cultCount?: number; // πόσες ερωτήσεις θα εμφανιστούν
};

const GeographyFullPagePicker = ({ geoCount = 0, cultCount = 50 }: Props) => {
  const [selectedQuestions, setSelectedQuestions] = useState<QuestionGroups>({
    geography: [],
    culture: [],
  });
  const [answers, setAnswers] = useState<Record<string, FullAnswer>>({});
  const [gradedAnswers, setGradedAnswers] = useState<FullGradedAnswer[]>([]);
  const [_score, setScore] = useState<number | null>(null);

  const geoQuestions = geoData as FullQuestion[];
  const cultureQuestions = cultureData as FullQuestion[];

  // επιλογή τυχαίων ερωτήσεων
  const pickRandomQuestions = () => {
    const shuffledGeo = [...geoQuestions].sort(() => 0.5 - Math.random());

    const shuffledCulture = [...cultureQuestions].sort(
      () => 0.5 - Math.random(),
    );

    setSelectedQuestions({
      geography: shuffledGeo.slice(0, geoCount),
      culture: shuffledCulture.slice(0, cultCount),
    });

    setAnswers({});
    setGradedAnswers([]);
    setScore(null);
  };
  const { gradeAll } = useFullGrading();

  const handleChange = (id: string, value: FullAnswer) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // κάνουμε flaten τις ερωτήσεις για να  μπορούν να βαθμολογηθούν ενιαία
  const allQuestions = [
    ...selectedQuestions.geography,
    ...selectedQuestions.culture,
  ];

  const hasQuestions =
    selectedQuestions.geography.length > 0 ||
    selectedQuestions.culture.length > 0;

  const handleGradeAll = () => {
    const { results, score } = gradeAll(allQuestions, answers);
    setGradedAnswers(results);
    setScore(score);
  };

  // σκορ ανα θεματική
  const geoTotal = selectedQuestions.geography.length;
  const cultTotal = selectedQuestions.culture.length;

  const geoScore = gradedAnswers.filter(
    (a) => selectedQuestions.geography.some((q) => q.id === a.id) && a.correct,
  ).length;

  const cultScore = gradedAnswers.filter(
    (a) => selectedQuestions.culture.some((q) => q.id === a.id) && a.correct,
  ).length;

  const totalScore = geoScore + cultScore;
  const totalQuestions = geoTotal + cultTotal;

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <Button onClick={pickRandomQuestions}>
        Τυχαίες {geoCount} Ερωτήσεις
      </Button>

      {selectedQuestions.geography.length > 0 && (
        <>
          <h2 className="text-xl font-bold">Ερωτήσεις Γεωγραφίας</h2>

          {selectedQuestions.geography.map((q) => (
            <TestFullQuestion
              key={q.id}
              question={q}
              value={answers[q.id]}
              onChange={handleChange}
            />
          ))}
        </>
      )}

      {selectedQuestions.culture.length > 0 && (
        <>
          <h2 className="text-xl font-bold mt-8">Ερωτήσεις Πολιτισμού</h2>

          {selectedQuestions.culture.map((q) => (
            <TestFullQuestion
              key={q.id}
              question={q}
              value={answers[q.id]}
              onChange={handleChange}
            />
          ))}
        </>
      )}

      {hasQuestions && <Button onClick={handleGradeAll}>Αξιολόγηση</Button>}

      {/* σκορ ανα θεματική */}
      {gradedAnswers.length > 0 && (
        <div className="space-y-2 border p-4 rounded bg-muted/20">
          <p>
            Γεωγραφία: {geoScore} / {geoTotal}
          </p>
          <p>
            Πολιτισμός: {cultScore} / {cultTotal}
          </p>
          <p className="font-bold">
            Σύνολο: {totalScore} / {totalQuestions}
          </p>
        </div>
      )}

      {/* συνολικό σκορ */}
      {gradedAnswers.length > 0 && (
        <FullGradingSummary gradedAnswers={gradedAnswers} />
      )}
    </div>
  );
};

export default GeographyFullPagePicker;
