// frontend\src\languageTest\pages\LanguageTest.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import testData from "../data/draftLanguageTests.json";
import axios from "axios";
import { url } from "@/constants/constants";
import { useState } from "react";
import { gradeShortTextDetailed } from "../utils/gradeShortText";
import MultipleChoiceQuestion from "../components/test-parts/MultipleChoiceQuestion";
import TrueFalseQuestion from "../components/test-parts/TrueFalseQuestion";
import MultipleChoiceWithTargetQuestion from "../components/test-parts/MultipleChoiceWithTargetQuestion";
import ShortTextQuestion from "../components/test-parts/ShortTextQuestion";
import LanguageGradingSummary from "../components/test-parts/LanguageGradingSummary";
import type {
  EssayResult,
  GradedAnswer,
  LanguageTestType,
} from "../types/language.types";
import EssayQuestion from "../components/test-parts/EssayQuestion";
import EssayGradingSummary from "../components/test-parts/EssayGradingSummary";
import { Button } from "@/components/ui/button";

type LanguageTestProps = {
  test: LanguageTestType;
};

const LanguageTest = ({ test }: LanguageTestProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [multiAnswers, setMultiAnswers] = useState<Record<string, string[]>>({});
  const [essayText, setEssayText] = useState("");
  const [_score, setScore] = useState<number | null>(null);
  const [gradedAnswers, setGradedAnswers] = useState<GradedAnswer[]>([]);

  const [essayResult, setEssayResult] = useState<EssayResult | null>(null);
  const [essayLoading, setEssayLoading] = useState(false);

  const partA = test.parts.A.questions;
  const partB = test.parts.B.questions;
  const partC = test.parts.C;

  const handleChange = (id: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const gradeAll = () => {
    let correct = 0;
    let total = 0;
    const results: GradedAnswer[] = [];

    // Part A
    partA.forEach((q) => {
      total++;
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correct++;

      results.push({
        id: q.id,
        userAnswer,
        correctAnswer: q.correctAnswer,
        correct: isCorrect,
        type: q.type,
      });
    });

    // Part B
    partB.forEach((q) => {
      total++;
      const userAnswer = answers[q.id];

      if (q.type === "shortText") {
        if (q.multipleBlanks && Array.isArray(q.correctAnswer)) {
          const userParts = multiAnswers[q.id] || [];
          const correctParts = q.correctAnswer;

          let allCorrect = true;
          let hasSpellingErrors = false;

          correctParts.forEach((correctPart, index) => {
            const userPart = userParts[index];
            const result = gradeShortTextDetailed(userPart, correctPart);

            if (!result.correct) allCorrect = false;
            if (result.hasSpellingErrors) hasSpellingErrors = true;
          });

          if (allCorrect) correct++;

          results.push({
            id: q.id,
            userAnswer: userParts.join(" "),
            correctAnswer: correctParts.join(" "),
            correct: allCorrect,
            hasSpellingErrors,
            type: q.type,
          });
        } else {
          const result = gradeShortTextDetailed(
            userAnswer,
            q.correctAnswer as string,
            q.acceptableAnswers ?? [],
          );

          if (result.correct) correct++;

          results.push({
            id: q.id,
            userAnswer,
            correctAnswer: q.correctAnswer,
            correct: result.correct,
            hasSpellingErrors: result.hasSpellingErrors,
            type: q.type,
          });
        }
      }

      if (q.type === "multipleChoice") {
        const isCorrect = userAnswer === q.correctAnswer;
        if (isCorrect) correct++;

        results.push({
          id: q.id,
          userAnswer,
          correctAnswer: q.correctAnswer,
          correct: isCorrect,
          type: q.type,
        });
      }
    });

    setScore(correct);
    setGradedAnswers(results);
  };

  const gradeEssay = async () => {
    if (!essayText) return;

    try {
      setEssayLoading(true);

      const response = await axios.post<EssayResult>(
        `${url}/api/grade/language/essay`,
        {
          prompt: partC.question,
          studentText: essayText,
        },
      );

      setEssayResult(response.data);
    } catch (error) {
      console.error("Essay grading error:", error);
    } finally {
      setEssayLoading(false);
    }
  };

  let questionIndex = 1;

  const getGraded = (id: string) =>
    gradedAnswers.find((a) => a.id === id);

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-8">
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

      {/* PART A */}
      <div className="max-w-3xl mx-auto py-8 space-y-8">
        <h2 className="text-xl font-bold">Μέρος Α</h2>

        {partA.map((q) => {
          const graded = getGraded(q.id);
          const gradedClass =
            gradedAnswers.length > 0 && graded
              ? graded.correct
                ? "bg-green-50 border border-green-400"
                : "bg-red-50 border border-red-400"
              : "";

          return (
            <div key={q.id} className="flex items-start gap-2">
              <span className="font-semibold">{questionIndex++}.</span>

              <div className={`flex-1 p-4 rounded ${gradedClass}`}>
                {q.type === "multipleChoice" && q.options && (
                  <MultipleChoiceQuestion
                    question={q}
                    value={answers[q.id]}
                    onChange={(value) => handleChange(q.id, value)}
                  />
                )}

                {q.type === "trueFalseNA" && (
                  <TrueFalseQuestion
                    question={q}
                    value={answers[q.id]}
                    onChange={(value) => handleChange(q.id, value)}
                  />
                )}

                {gradedAnswers.length > 0 && graded && !graded.correct && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Σωστή απάντηση: {graded.correctAnswer}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* PART B */}
      <div className="max-w-3xl mx-auto py-8 space-y-8">
        <h2 className="text-xl font-bold">Μέρος Β</h2>

        {partB.map((q) => {
          const graded = getGraded(q.id);
          const gradedClass =
            gradedAnswers.length > 0 && graded
              ? graded.correct
                ? "bg-green-50 border border-green-400"
                : "bg-red-50 border border-red-400"
              : "";

          return (
            <div key={q.id} className="flex items-start gap-2">
              <span className="font-semibold">{questionIndex++}.</span>

              <div className={`flex-1 p-4 rounded ${gradedClass}`}>
                {q.type === "shortText" && (
                  <ShortTextQuestion
                    question={q}
                    value={q.multipleBlanks ? multiAnswers[q.id] : answers[q.id]}
                    onChange={(value) => {
                      if (q.multipleBlanks) {
                        setMultiAnswers((prev) => ({
                          ...prev,
                          [q.id]: value as string[],
                        }));
                      } else {
                        setAnswers((prev) => ({
                          ...prev,
                          [q.id]: value as string,
                        }));
                      }
                    }}
                  />
                )}

                {q.type === "multipleChoice" && q.options && (
                  <MultipleChoiceWithTargetQuestion
                    question={q}
                    value={answers[q.id]}
                    onChange={(value) => handleChange(q.id, value)}
                  />
                )}

                {gradedAnswers.length > 0 && graded && !graded.correct && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Σωστή απάντηση: {graded.correctAnswer}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* PART C */}
      <div className="max-w-3xl mx-auto py-8">
        <EssayQuestion
          instructions={partC.instructions}
          question={partC.question}
          minWords={partC.minWords}
          maxWords={partC.maxWords}
          value={essayText}
          onChange={setEssayText}
        />

        <Button
          type="button"
          onClick={gradeEssay}
          disabled={essayLoading}
        >
          {essayLoading ? "Αξιολόγηση..." : "Αξιολόγηση Γ Θέματος"}
        </Button>

        {essayResult && <EssayGradingSummary result={essayResult} />}
      </div>

      <Button type="button" onClick={gradeAll}>
        Αξιολόγηση
      </Button>

      {gradedAnswers.length > 0 && (
        <LanguageGradingSummary gradedAnswers={gradedAnswers} />
      )}
    </div>
  );
};

export default LanguageTest;
