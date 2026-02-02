// backend\src\types\grade.types.ts
export type GradeResponse = {
  questionId: string;

  recommendedAnswer: {
    text: string;
    bullets?: string[];
  };

  scores: {
    total: number;        // 0..100
    cosine: number;       // 0..100
    bm25: number;         // 0..100
    bullets: number;      // 0..100
    language: number;     // 0..100
  };

  notes: {
    cosine: string;
    bm25: string;
    bullets: string;
    language: string;
    total: string;
  };

  debug?: {
    topK?: Array<{ id: string; cosine?: number; bm25?: number }>;
  };
};
