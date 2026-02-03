// backend\src\types\total.types.ts

import { BulletEvaluation } from "./bullets.types";

export type CanonicalAnalysis = {
  embedding: number[];
  bullets: string[];
};

export type StudentAnalysis = {
  embedding: number[];
  bulletsCoverage: BulletEvaluation[];
  language: {
    score: number;
    note: string;
  };
};
