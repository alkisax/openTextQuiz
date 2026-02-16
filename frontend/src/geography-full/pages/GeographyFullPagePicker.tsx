import { useState } from "react";
import rawQuestions from "../data/geoData.json";
import GeographyFullQuestion from "./GeographyFullQuestion";
import { Button } from "@/components/ui/button";
import type {
  GeoQuestion,
  GeoGradedAnswer,
  GeoMultipleChoiceQuestion,
  GeoShortTextQuestion,
  GeoMatchingQuestion,
  GeoMultiSelectQuestion,
  GeoListInputQuestion,
  GeoTrueFalseGroupQuestion,
} from "../types/geographyFull.types";
import GeographyFullGradingSummary from "../components/GeographyFullGradingSummary";
import { simplifyLang, expandOptionalParts } from "../utils/simplifyLang";

type Props = {
  count?: number; // πόσες ερωτήσεις θα εμφανιστούν
};

type GeoAnswer = string | string[] | Record<string, string>;

const GeographyFullPagePicker = ({ count = 4 }: Props) => {
  const [selectedQuestions, setSelectedQuestions] = useState<GeoQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, GeoAnswer>>({});
  const [gradedAnswers, setGradedAnswers] = useState<GeoGradedAnswer[]>([]);
  const [_score, setScore] = useState<number | null>(null);

  const questions = rawQuestions as GeoQuestion[];

  // επιλογή τυχαίων ερωτήσεων
  const pickRandomQuestions = () => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setSelectedQuestions(shuffled.slice(0, count));
  };

  const handleChange = (id: string, value: GeoAnswer) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const gradeMultipleChoice = (
    q: GeoMultipleChoiceQuestion,
    userAnswer: GeoAnswer | undefined,
  ): GeoGradedAnswer => {
    const isCorrect = userAnswer === q.correctAnswer;

    return {
      id: q.id,
      userAnswer,
      correctAnswer: q.correctAnswer,
      correct: isCorrect,
      type: q.type,
    };
  };

  const gradeShortText = (
    q: GeoShortTextQuestion,
    userAnswer: GeoAnswer | undefined,
  ): GeoGradedAnswer => {
    const userParts = Array.isArray(userAnswer) ? userAnswer : [];
    const correctParts = q.correctAnswer;

    let allCorrect = true;
    let hasSpellingErrors = false;

    correctParts.forEach((correctPart, index) => {
      const userPart = userParts[index];

      if (!userPart) {
        allCorrect = false;
        return;
      }

      const expanded = expandOptionalParts(correctPart);

      let partMatched = false;

      for (const variant of expanded) {
        const exactMatch = userPart.trim() === variant.trim();
        const simplifiedMatch =
          simplifyLang(userPart) === simplifyLang(variant);

        if (exactMatch) {
          partMatched = true;
          break;
        }

        if (!exactMatch && simplifiedMatch) {
          partMatched = true;
          hasSpellingErrors = true;
          break;
        }
      }

      if (!partMatched) {
        allCorrect = false;
      }
    });

    return {
      id: q.id,
      userAnswer,
      correctAnswer: q.correctAnswer,
      correct: allCorrect,
      hasSpellingErrors,
      type: q.type,
    };
  };

  const gradeMatching = (
    q: GeoMatchingQuestion,
    userAnswer: GeoAnswer | undefined,
  ): GeoGradedAnswer => {
    const userMap =
      userAnswer && typeof userAnswer === "object" && !Array.isArray(userAnswer)
        ? userAnswer
        : {};

    const correctMap = q.correctAnswer;

    const allCorrect = Object.keys(correctMap).every(
      (key) => userMap[key] === correctMap[key],
    );

    return {
      id: q.id,
      userAnswer,
      correctAnswer: correctMap,
      correct: allCorrect,
      type: q.type,
    };
  };

  const gradeMultiSelect = (
    q: GeoMultiSelectQuestion,
    userAnswer: GeoAnswer | undefined,
  ): GeoGradedAnswer => {
    const userSelections = Array.isArray(userAnswer) ? userAnswer : [];

    const correctOptions = q.correctAnswer;

    const correctCount = userSelections.filter((opt) =>
      correctOptions.includes(opt),
    ).length;

    const allCorrect =
      userSelections.length === q.maxSelections &&
      correctCount === userSelections.length;

    return {
      id: q.id,
      userAnswer,
      correctAnswer: correctOptions,
      correct: allCorrect,
      type: q.type,
    };
  };

  const gradeListInput = (
    q: GeoListInputQuestion,
    userAnswer: GeoAnswer | undefined,
  ): GeoGradedAnswer => {
    const userParts = Array.isArray(userAnswer) ? userAnswer : [];
    const cleaned = userParts.map((a) => a.trim()).filter(Boolean);

    const remaining = [...q.correctAnswer]; // διαθέσιμες σωστές
    let hasSpellingErrors = false;
    let matchedCount = 0;

    for (const ans of cleaned) {
      // 1) exact
      const exactIndex = remaining.findIndex((c) => c.trim() === ans);
      if (exactIndex !== -1) {
        matchedCount++;
        remaining.splice(exactIndex, 1);
        continue;
      }

      // 2) simplified
      const simplifiedIndex = remaining.findIndex(
        (c) => simplifyLang(c) === simplifyLang(ans),
      );
      if (simplifiedIndex !== -1) {
        matchedCount++;
        hasSpellingErrors = true;
        remaining.splice(simplifiedIndex, 1);
      }
    }

    const meetsCount =
      cleaned.length >= q.minItems && cleaned.length <= q.maxItems;

    const allCorrect = meetsCount && matchedCount === q.maxItems;

    return {
      id: q.id,
      userAnswer,
      correctAnswer: q.correctAnswer,
      correct: allCorrect,
      hasSpellingErrors: allCorrect ? hasSpellingErrors : false,
      type: q.type,
    };
  };

  const gradeTrueFalseGroup = (
    q: GeoTrueFalseGroupQuestion,
    userAnswer: GeoAnswer | undefined,
  ): GeoGradedAnswer => {
    const userMap =
      userAnswer && typeof userAnswer === "object" && !Array.isArray(userAnswer)
        ? (userAnswer as Record<string, "T" | "F">)
        : {};

    const correctMap = q.correctAnswer;

    const allCorrect = Object.keys(correctMap).every(
      (key) => userMap[key] === correctMap[key],
    );

    return {
      id: q.id,
      userAnswer,
      correctAnswer: correctMap,
      correct: allCorrect,
      type: q.type,
    };
  };

  const gradeAll = () => {
    let correct = 0;
    const results: GeoGradedAnswer[] = [];

    selectedQuestions.forEach((q) => {
      const userAnswer = answers[q.id];

      let result: GeoGradedAnswer | null = null;

      switch (q.type) {
        case "multipleChoice":
          result = gradeMultipleChoice(q, userAnswer);
          break;

        case "shortText":
          result = gradeShortText(q, userAnswer);
          break;

        case "matching":
          result = gradeMatching(q, userAnswer);
          break;

        case "multiSelect":
          result = gradeMultiSelect(q, userAnswer);
          break;

        case "listInput":
          result = gradeListInput(q, userAnswer);
          break;

        case "trueFalseGroup":
          result = gradeTrueFalseGroup(q, userAnswer);
          break;
      }

      if (result) {
        if (result.correct) correct++;
        results.push(result);
      }
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
