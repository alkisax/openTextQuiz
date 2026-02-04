export type Scores = {
  total: number;
  cosine: number;
  bm25: number;
  bullets: number;
  language: number;
};

export type GradeResponse = {
  status: boolean;
  scores: Scores;
  raw: {
    cosine: number;
    bm25: number;
    bullets: { bullet: string; coverage: 'YES' | 'NO' }[];
    language: string;
  };
};
