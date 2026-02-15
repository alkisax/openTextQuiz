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

type LanguageTestProps = {
  test: LanguageTestType;
};

const LanguageTest = ({ test }: LanguageTestProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [multiAnswers, setMultiAnswers] = useState<Record<string, string[]>>(
    {},
  );
  const [essayText, setEssayText] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [gradedAnswers, setGradedAnswers] = useState<GradedAnswer[]>([]);

  const [essayResult, setEssayResult] = useState<EssayResult | null>(null);
  const [essayLoading, setEssayLoading] = useState(false);

  // const test = testData[0];
  const partA = test.parts.A.questions;
  const partB = test.parts.B.questions;
  const partC = test.parts.C;

  // αποθηκεύουμε τις απαντήσεις
  // χρηαζόμαστε dynamic key για το id και για αυτό [id]: και οχι id:
  const handleChange = (id: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // κάποιες ερωτήσεις τύπου shortText είναι πιθανό να έχουν δύο κενα, σε αυτές η απάντηση δεν έρχετε ως string αλλά ως string[]
  // const handleMultiChange = (id: string, index: number, value: string) => {
  //   setMultiAnswers((prev) => {
  //     const existing = prev[id] || [];
  //     const updated = [...existing];
  //     updated[index] = value;

  //     return {
  //       ...prev,
  //       [id]: updated,
  //     };
  //   });
  // };

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

      // shortText
      if (q.type === "shortText") {
        // MULTI BLANK
        // κάποιες ερωτήσεις τύπου shortText είναι πιθανό να έχουν δύο κενα, σε αυτές η απάντηση δεν έρχετε ως string αλλά ως string[]
        if (q.multipleBlanks && Array.isArray(q.correctAnswer)) {
          const userParts = multiAnswers[q.id] || [];
          const correctParts = q.correctAnswer;

          let allCorrect = true;
          let hasSpellingErrors = false;

          correctParts.forEach((correctPart, index) => {
            const userPart = userParts[index];

            const result = gradeShortTextDetailed(userPart, correctPart);

            if (!result.correct) {
              allCorrect = false;
            }

            if (result.hasSpellingErrors) {
              hasSpellingErrors = true;
            }
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
          // SINGLE BLANK
          const userAnswer = answers[q.id];

          // TODO προς το παρόν δεχόμαστε πολλές απαντήσεις μόνο αν είναι ένα το κενο στην ερώτηση. θα δούμε αν υπάρχουν τέτοιες ερωτήσεις (δυο κενα - πολλαπλές απαντήσεις) και θα το κάνουμε τότε
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

      // multipleChoice
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
    console.log("score :", score);
    setGradedAnswers(results);

    console.log(`Total Score: ${correct} / ${total}`);
  };

  const gradeEssay = async () => {
    if (!essayText) return;

    try {
      setEssayLoading(true);

      console.log("url in ${url}/api/grade/language/essay :", url);

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

      {/* part A */}
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

      {/* part B1 */}
      <div className="max-w-3xl mx-auto py-8 space-y-8">
        <h2 className="text-xl font-bold">Μέρος Β</h2>

        {test.parts.B.instructionsShortText && (
          <p style={{ whiteSpace: "pre-line" }}>{test.parts.B.instructionsShortText}</p>
        )}

        {!test.parts.B.instructionsShortText && (
          <p>
            Ξαναγράψτε τις παρακάτω προτάσεις με βάση τη φράση που σας δίνεται
            στην αρχή. Γράψτε στο τετράδιο τον αριθμό της άσκησης και δίπλα τη
            σωστή πρόταση/απάντηση.
          </p>
        )}

        {partB.map((q) => {
          if (q.type === "shortText") {
            return (
              <ShortTextQuestion
                key={q.id}
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
            );
          }

          return null;
        })}
      </div>

      {/* part B2 */}
      <div className="max-w-3xl mx-auto py-8 space-y-8">
        <p>
          Στις προτάσεις που ακολουθούν κυκλώστε τη λέξη / φράση που έχει το
          ίδιο νόημα με την υπογραμμισμένη λέξη / φράση: Γράψτε στο τετράδιο τον
          αριθμό της άσκησης και δίπλα τη σωστή απάντηση.
        </p>
        {partB.map((q) => {
          if (q.type === "multipleChoice" && q.options) {
            return (
              <MultipleChoiceWithTargetQuestion
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

      {/* Part C */}
      <div className="max-w-3xl mx-auto py-8">
        <EssayQuestion
          instructions={partC.instructions}
          question={partC.question}
          minWords={partC.minWords}
          maxWords={partC.maxWords}
          value={essayText}
          onChange={setEssayText}
        />
        <button
          type="button"
          className="px-4 py-2 bg-black text-white rounded"
          onClick={gradeEssay}
          disabled={essayLoading}
        >
          {essayLoading ? "Αξιολόγηση..." : "Αξιολόγηση Γ Θέματος"}
        </button>

        {essayResult && <EssayGradingSummary result={essayResult} />}
      </div>

      <button
        type="button"
        className="px-4 py-2 bg-black text-white rounded"
        onClick={gradeAll}
      >
        Αξιολόγηση
      </button>

      {gradedAnswers.length > 0 && (
        <LanguageGradingSummary gradedAnswers={gradedAnswers} />
      )}
    </div>
  );
};

export default LanguageTest;
