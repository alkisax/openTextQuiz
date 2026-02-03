// backend/src/services/total.service.ts

import { cosineService } from "./cosineGrading.service";
import { bm25TextGrading } from "./bm25Text.service";
import { compareTextsWithBullets } from "./bullets.service";
import { gradeLanguage } from "./language.service";
import { ValidationError } from "../utils/error/errors.types";

type ScoreParts = {
  cosine: number;
  bullets: number;
  bm25: number;
  language: number;
};

export const calculateTotalScore = (scores: ScoreParts) => {
  const total =
    scores.cosine * 0.4 +
    scores.bullets * 0.35 +
    scores.bm25 * 0.15 +
    scores.language * 0.1;

  return Math.round(total);
};

export const gradeTotalTextToText = async (
  textA: string,
  textB: string,
) => {
  if (!textA || !textB) {
    throw new ValidationError("textA and textB are required");
  }

  // 1️⃣ Cosine
  const cosine = await cosineService.cosineTextService(textA, textB);

  // 2️⃣ BM25
  const bm25 = bm25TextGrading(textB, textA);

  // 3️⃣ Bullets (A → bullets, B → coverage)
  const bullets = await compareTextsWithBullets(textA, textB);

  // 4️⃣ Language (μόνο student)
  const language = await gradeLanguage(textB);

  // 5️⃣ Total
  const total = calculateTotalScore({
    cosine: cosine.cosineScore,
    bullets: bullets.score,
    bm25: bm25.bm25Score,
    language: language.score,
  });

  return {
    scores: {
      total,
      cosine: cosine.cosineScore,
      bm25: bm25.bm25Score,
      bullets: bullets.score,
      language: language.score,
    },
    raw: {
      cosine: cosine.raw,
      bm25: bm25.raw,
      bullets: bullets.details,
      language: language.note,
    },
  };
};
