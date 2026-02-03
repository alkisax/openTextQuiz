export type BulletCoverage = "YES" | "PARTIAL" | "NO";

export type BulletEvaluation = {
  bullet: string;
  coverage: BulletCoverage;
  note?: string;
};

export type BulletsGradeResult = {
  score: number; // 0..100
  details: BulletEvaluation[];
};
