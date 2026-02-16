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
  type: 'multiSelect'
  question: string
  minSelections: number
  maxSelections: number
  options: string[]
  correctAnswer: string[]
}

export type GeoListInputQuestion = GeoQuestionBase & {
  type: 'listInput'
  question: string
  minItems: number
  maxItems: number
  correctAnswer: string[]
}

export type GeoQuestion =
  | GeoMultipleChoiceQuestion
  | GeoShortTextQuestion
  | GeoMatchingQuestion
  | GeoMultiSelectQuestion
  | GeoListInputQuestion

export type GeoAnswer = string | string[] | Record<string, string>;

export type GeoGradedAnswer = {
  id: string;
  userAnswer?: GeoAnswer;
  correctAnswer: unknown;
  correct: boolean;
  hasSpellingErrors?: boolean;
  type: GeoQuestion["type"];
};
