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

export type GeoMatchingQuestion = {
  id: string;
  category: string;
  type: "matching";
  question: string;
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
  userAnswer?: GeoAnswer
  correctAnswer: string | string[];
  correct: boolean;
  hasSpellingErrors?: boolean;
  type: GeoQuestion["type"];
};
