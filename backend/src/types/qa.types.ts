// backend/src/types/question.types.ts
export type QuestionRules = {
  expectsList: boolean;
  maxWords?: number;
  minItems?: number;
  maxItems?: number;
};

export type QuestionSpec = {
  id: string;
  category: string;
  questionText: string;
  rules: QuestionRules;

  canonicalAnswer: string;
  answerBullets?: string[];
  acceptedItems?: string[];

  keywords?: string[];
  difficulty: number;
  embedding: number[];
};

export type AnswerDoc = {
  questionId: string;

  canonicalAnswer: string;
  answerBullets?: string[];

  keywords?: string[];
  embedding?: number[]; // cosine
  
  difficulty: number;

  createdAt?: Date;
  updatedAt?: Date;
};
