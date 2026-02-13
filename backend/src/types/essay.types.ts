export type EssayEvaluationResult = {
  scores: {
    content: number;
    coherence: number;
    grammar: number;
    vocabulary: number;
    structure: number;
  };
  total: number;
  feedback: string;
  modelAnswer: string;
};