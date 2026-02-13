// frontend\src\languageTest\pages\LanguageTest.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import testData from "../data/draftLanguageTests.json";
import { useState } from "react";
import MultipleChoiceQuestion from "../components/test-parts/MultipleChoiceQuestion";
import TrueFalseQuestion from "../components/test-parts/TrueFalseQuestion";

const LanguageTest = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);

  const test = testData[0];
  const partA = test.parts.A.questions;

  // αποθηκεύουμε τις απαντήσεις
  // χρηαζόμαστε dynamic key για το id και για αυτό [id]: και οχι id:
  const handleChange = (id: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const gradePartA = () => {
    let correct = 0;
    let total = 0;

    partA.forEach((q) => {
      if (q.correctAnswer) {
        total++;

        if (answers[q.id] === q.correctAnswer) {
          correct++;
        }
      }
    });

    setScore(correct);

    console.log(`Score: ${correct} / ${total}`);
  };

  return (
    <>
      <div className="max-w-3xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>{test.title}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="font-bold">{test.prompt}</p>

            <div className="whitespace-pre-line text-justify leading-5">
              {test.text}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-3xl mx-auto py-8 space-y-8">
        <h2 className="text-xl font-bold">Μέρος Α</h2>

        {partA.map((q) => {
          if (q.type === "multipleChoice" && q.options) {
            return (
              <MultipleChoiceQuestion
                key={q.id}
                question={q}
                value={answers[q.id]}
                onChange={(value) => handleChange(q.id, value)}
              />
            );
          }

          if (q.type === "trueFalseNA") {
            return (
              <TrueFalseQuestion
                key={q.id}
                question={q}
                value={answers[q.id]}
                onChange={(value) => handleChange(q.id, value)}
              />
            );
          }
          
          return null;
        })}
      </div>

      <button
        className="px-4 py-2 bg-black text-white rounded"
        onClick={() => gradePartA()}
      >
        Αξιολόγηση
      </button>

      {score !== null && (
        <div className="font-bold">
          Βαθμός: {score} / {partA.length}
        </div>
      )}
    </>
  );
};

export default LanguageTest;
