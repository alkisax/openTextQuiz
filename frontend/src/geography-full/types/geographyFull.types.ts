// frontend\src\geography-full\types\geographyFull.types.ts

export type GeoQuestionBase = {
  id: string;
  category: "γεωγραφία";
};

export type GeoMultipleChoiceQuestion = GeoQuestionBase & {
  type: "multipleChoice";
  question: string;
  options: Record<string, string>;
  correctAnswer: string;
};

export type GeoShortTextQuestion = GeoQuestionBase & {
  type: "shortText";
  multipleBlanks: true;
  question: string;
  correctAnswer: string[];
};

export type GeoMatchingQuestion = GeoQuestionBase & {
  type: "matching";
  question: string;
  columnAHeader?: string;
  columnBHeader?: string;
  columnA: { key: string; label: string }[];
  columnB: { key: string; label: string }[];
  correctAnswer: Record<string, string>;
};

export type GeoMultiSelectQuestion = GeoQuestionBase & {
  type: "multiSelect";
  question: string;
  minSelections: number;
  maxSelections: number;
  options: string[];
  correctAnswer: string[];
};

export type GeoListInputQuestion = GeoQuestionBase & {
  type: "listInput";
  question: string;
  minItems: number;
  maxItems: number;
  correctAnswer: string[];
};

export type GeoTrueFalseGroupQuestion = GeoQuestionBase & {
  type: "trueFalseGroup";
  question: string;
  statements: {
    key: string;
    text: string;
  }[];
  correctAnswer: Record<string, "T" | "F">;
};

export type GeoCategorizationQuestion = GeoQuestionBase & {
  type: "categorization";
  question: string;
  categories: {
    key: string;
    label: string;
  }[];
  items: string[];
  correctAnswer: Record<string, string[]>; // categoryKey → items[]
};

export type MapPoint = {
  x: number; // ποσοστό X (0–100)
  y: number; // ποσοστό Y (0–100)
  label: string; // κείμενο (προς το παρόν δεν βαθμολογείται)
};

export type GeoMapPointsQuestion = GeoQuestionBase & {
  type: "mapPoints";
  question: string; // όχι "ερώτηση"
  rules: {
    map: true;
    maxPoints: number;
    tolerancePct?: number;
    expectsSubset?: boolean;
    minItems?: number;
    maxItems?: number;
  };
  canonicalAnswer: {
    type: "points";
    points: {
      x: number;
      y: number;
      label: string;
      aliases?: string[];
    }[];
  };
};

export type GeoQuestion =
  | GeoMultipleChoiceQuestion
  | GeoShortTextQuestion
  | GeoMatchingQuestion
  | GeoMultiSelectQuestion
  | GeoListInputQuestion
  | GeoTrueFalseGroupQuestion
  | GeoCategorizationQuestion
  | GeoMapPointsQuestion;

export type GeoAnswer = string | string[] | Record<string, string> | MapPoint[];

export type GradedPoint = MapPoint & {
  correct: boolean;
  labelCorrect: boolean;
  hasSpellingErrors: boolean;
};

export type LabelCheckResult = {
	correct: boolean
	hasSpellingErrors: boolean
}

export type GeoGradedAnswer = {
  id: string;
  userAnswer?: GeoAnswer;
  correctAnswer: unknown;
  correct: boolean;
  hasSpellingErrors?: boolean;
  type: GeoQuestion["type"];
  mapGradedPoints?: GradedPoint[];
  mapReviewPoints?: MapPoint[];
};
