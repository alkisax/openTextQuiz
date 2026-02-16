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

export type GeoQuestion =
  | GeoMultipleChoiceQuestion
  | GeoShortTextQuestion
  | GeoMatchingQuestion;

export type GeoAnswer = string | string[] | Record<string, string>;

export type GeoGradedAnswer = {
  id: string;
  userAnswer?: GeoAnswer;
  correctAnswer: unknown;
  correct: boolean;
  hasSpellingErrors?: boolean;
  type: GeoQuestion["type"];
};
