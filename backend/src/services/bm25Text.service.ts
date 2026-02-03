import { ValidationError } from "../utils/error/errors.types";
import { normalizeText } from "../utils/textNormalize";

/*
  🧮 BM25 Text-to-Text Service
  ----------------------------------------------------
  - Pure lexical relevance
  - In-memory
  - Χωρίς OpenAI
  - Χωρίς Mongo
  - Χρήσιμο ως secondary grading signal
*/

type BM25Options = {
  k1?: number; // term frequency saturation
  b?: number;  // length normalization
};

const DEFAULTS: Required<BM25Options> = {
  k1: 1.5,
  b: 0.75,
};

/*
  Tokenization:
  - lowercasing
  - accents stripped (μέσω normalizeText)
  - split σε λέξεις
*/
const tokenize = (text: string): string[] =>
  normalizeText(text)
    .split(/\s+/)
    .filter(Boolean);

/*
  BM25 score για query vs document
*/
export const bm25TextScore = (
  queryText: string,
  documentText: string,
  options: BM25Options = {},
) => {
  if (!queryText || !documentText) {
    throw new ValidationError("Both queryText and documentText are required");
  }

  const { k1, b } = { ...DEFAULTS, ...options };

  const queryTokens = tokenize(queryText);
  const docTokens = tokenize(documentText);

  const docLength = docTokens.length;
  const avgDocLength = docLength; 
  // ⚠️ text-to-text: έχουμε ΕΝΑ document
  // άρα avgDocLength = docLength

  // term frequency στον document
  const tf = new Map<string, number>();
  for (const token of docTokens) {
    tf.set(token, (tf.get(token) ?? 0) + 1);
  }

  let score = 0;

  for (const term of queryTokens) {
    const freq = tf.get(term);
    if (!freq) continue;

    const numerator = freq * (k1 + 1);
    const denominator =
      freq +
      k1 * (1 - b + (b * docLength) / avgDocLength);

    score += numerator / denominator;
  }

  return score;
};

/*
  Helper για grading:
  - raw BM25
  - normalized 0–100 (relative)
*/
export const bm25TextGrading = (
  queryText: string,
  documentText: string,
) => {
  const raw = bm25TextScore(queryText, documentText);

  /*
    Normalization strategy (pragmatic):
    - συγκρίνουμε με self-score του document
    - δηλαδή: πόσο καλά θα "έπιανε" τον εαυτό του
  */
  const maxPossible = bm25TextScore(documentText, documentText) || 1;

  const normalized = Math.min(
    100,
    Math.round((raw / maxPossible) * 100),
  );

  return {
    bm25Score: normalized,
    raw,
  };
};
