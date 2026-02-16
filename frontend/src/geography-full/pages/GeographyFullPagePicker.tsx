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
  GeoCategorizationQuestion,
  GeoAnswer,
} from "../types/geographyFull.types";
import GeographyFullGradingSummary from "../components/GeographyFullGradingSummary";
import { simplifyLang, expandOptionalParts } from "../utils/simplifyLang";
import type {
  GeoMapPointsQuestion,
  MapPoint,
} from "../types/geographyFull.types";
import { gradePoints, buildReviewPoints } from "../utils/geoGrading";

type Props = {
  count?: number; // πόσες ερωτήσεις θα εμφανιστούν
};

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
    // θέλουμε μόνο string[] εδώ (όχι MapPoint[])
    const userParts: string[] =
      Array.isArray(userAnswer) &&
      userAnswer.every((item) => typeof item === "string")
        ? userAnswer
        : [];
        
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
    // multiSelect περιμένει string[]
    const userSelections: string[] =
      Array.isArray(userAnswer) &&
      userAnswer.every((item) => typeof item === "string")
        ? userAnswer
        : [];

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
    // listInput επίσης περιμένει string[]
    const userParts: string[] =
      Array.isArray(userAnswer) &&
      userAnswer.every((item) => typeof item === "string")
        ? userAnswer
        : [];

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

  const gradeCategorization = (
    q: GeoCategorizationQuestion,
    userAnswer: GeoAnswer | undefined,
  ): GeoGradedAnswer => {
    const userMap =
      userAnswer && typeof userAnswer === "object" && !Array.isArray(userAnswer)
        ? (userAnswer as Record<string, string>)
        : {};

    const correctMap = q.correctAnswer;

    const allCorrect = Object.entries(correctMap).every(
      ([categoryKey, items]) =>
        items.every((item) => userMap[item] === categoryKey),
    );

    return {
      id: q.id,
      userAnswer,
      correctAnswer: correctMap,
      correct: allCorrect,
      type: q.type,
    };
  };

  const isMapPointArray = (value: unknown): value is MapPoint[] => {
    return (
      Array.isArray(value) &&
      value.every(
        (v) =>
          typeof v === "object" &&
          v !== null &&
          "x" in v &&
          "y" in v &&
          "label" in v,
      )
    );
  };

  const gradeMapPoints = (
    q: GeoMapPointsQuestion,
    userAnswer: GeoAnswer | undefined,
  ): GeoGradedAnswer => {
    const userPoints = isMapPointArray(userAnswer) ? userAnswer : [];

    const tolerance = q.rules?.tolerancePct ?? 3.5;

    const graded = gradePoints(userPoints, q.canonicalAnswer.points, tolerance);

    const reviewPoints = buildReviewPoints(
      graded,
      q.canonicalAnswer.points,
      tolerance,
    );

    const fullyCorrect =
      graded.filter((p) => p.correct && p.labelCorrect).length ===
      q.rules.maxPoints;

    return {
      id: q.id,
      userAnswer,
      correctAnswer: q.canonicalAnswer.points,
      correct: fullyCorrect,
      type: q.type,
      mapGradedPoints: graded,
      mapReviewPoints: reviewPoints,
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

        case "categorization":
          result = gradeCategorization(q, userAnswer);
          break;

        case "mapPoints":
          result = gradeMapPoints(q, userAnswer);
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
