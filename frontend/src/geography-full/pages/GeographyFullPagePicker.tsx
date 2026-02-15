import { useState } from "react";
import questions from "../data/geoData.json";
import GeographyFullQuestion from "./GeographyFullQuestion";
import { Button } from "@/components/ui/button";
import type {
  GeoQuestion,
  GeoGradedAnswer,
} from "../types/geographyFull.types";
import GeographyFullGradingSummary from "../components/GeographyFullGradingSummary";

type Props = {
  count?: number; // πόσες ερωτήσεις θα εμφανιστούν
};

const GeographyFullPagePicker = ({ count = 4 }: Props) => {
  const [selectedQuestions, setSelectedQuestions] = useState<GeoQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [gradedAnswers, setGradedAnswers] = useState<GeoGradedAnswer[]>([]);
  const [score, setScore] = useState<number | null>(null);

  // επιλογή τυχαίων ερωτήσεων
  const pickRandomQuestions = () => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setSelectedQuestions(shuffled.slice(0, count));
  };

  const handleChange = (id: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const gradeAll = () => {
    let correct = 0;
    let total = 0;

    const results: GeoGradedAnswer[] = [];

    selectedQuestions.forEach((q) => {
      total++;

      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;

      if (isCorrect) correct++;

      results.push({
        id: q.id,
        userAnswer,
        correctAnswer: q.correctAnswer,
        correct: isCorrect,
        type: "multipleChoice",
      });
    });

    setScore(correct);
    setGradedAnswers(results);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <Button onClick={pickRandomQuestions}>Τυχαίες {count} Ερωτήσεις</Button>

      {selectedQuestions.map((q) => (
        <GeographyFullQuestion
          key={q.id}
          question={q}
          value={answers[q.id]}
          onChange={handleChange}
        />
      ))}

      {selectedQuestions.length > 0 && (
        <Button onClick={gradeAll}>Αξιολόγηση</Button>
      )}

      {gradedAnswers.length > 0 && (
        <GeographyFullGradingSummary gradedAnswers={gradedAnswers} />
      )}
    </div>
  );
};

export default GeographyFullPagePicker;
