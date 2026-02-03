import {
  getEmbedding,
  cosineSimilarity,
} from "../vectorize/gptEmbeddings.service";
import { vectorDao } from "../dao/vector.json.dao";
import { NotFoundError, ValidationError } from "../utils/error/errors.types";
import { normalizeText } from "../utils/textNormalize";

/*
  Cosine similarity ανάμεσα σε ΔΥΟ κείμενα
  Χωρίς Question / DAO / JSON / Mongo
*/
const cosineTextService = async (textA: string, textB: string) => {
  if (!textA || !textB) {
    throw new ValidationError("Both textA and textB are required");
  }

  const embeddingA = await getEmbedding(textA);
  const embeddingB = await getEmbedding(textB);

  const cosine = cosineSimilarity(embeddingA, embeddingB);

  if (Number.isNaN(cosine)) {
    throw new ValidationError("Cosine similarity calculation failed");
  }

  // DEBUG — remove after
  console.log("LEN A:", textA.length);
  console.log("LEN B:", textB.length);
  console.log("EQUAL STRING:", textA === textB);
  console.log("JSON A:", JSON.stringify(textA));
  console.log("JSON B:", JSON.stringify(textB));
  const embeddingA2 = await getEmbedding(textA);
  const cosineSelf = cosineSimilarity(embeddingA, embeddingA2);
  console.log("COSINE(A vs B):", cosine);
  console.log("COSINE(A vs A fresh):", cosineSelf);

  return {
    cosineScore: Math.round(cosine * 100),
    raw: cosine,
  };
};

const cosineGradingService = async (
  questionId: string,
  answerText: string,
  dataPath: string,
) => {
  const question = vectorDao.getQuestionById(questionId, dataPath);
  console.log("DATA PATH:", dataPath);
  console.log("EMBEDDING LENGTH:", question.embedding?.length);

  if (!question.canonicalAnswer) {
    throw new NotFoundError(`Canonical answer missing for ${questionId}`);
  }

  const studentEmbedding = await getEmbedding(normalizeText(answerText));
  const cosine = cosineSimilarity(studentEmbedding, question.embedding);

  // DEBUG — remove after
  console.log("LEN student:", answerText.length);
  console.log("LEN canonical:", question.canonicalAnswer.length);
  console.log("EQUAL STRING:", answerText === question.canonicalAnswer);
  console.log("JSON student:", JSON.stringify(answerText));
  console.log("JSON canonical:", JSON.stringify(question.canonicalAnswer));
  const canonicalNow = await getEmbedding(question.canonicalAnswer);
  const cosStoredVsNow = cosineSimilarity(canonicalNow, question.embedding);
  console.log("COSINE(stored vs fresh canonical):", cosStoredVsNow);
  const freshCanonical = await getEmbedding(question.canonicalAnswer);
  console.log(
    "COSINE(student vs fresh canonical):",
    cosineSimilarity(studentEmbedding, freshCanonical),
  );
  console.log(
    "COSINE(student vs stored canonical):",
    cosineSimilarity(studentEmbedding, question.embedding),
  );

  return {
    cosineScore: Math.round(cosine * 100),
    raw: cosine,
  };
};

export const cosineService = {
  cosineTextService,
  cosineGradingService,
};
