// backend\src\scripts.vector\vectorizeAllQuestions.ts
import { getEmbedding } from "../vectorize/gptEmbeddings.service";
import { vectorDao } from "../dao/vector.json.dao";
import type { QuestionSpec } from "../types/qa.types";

/*
  Script:
  - δεν ξέρει αν data είναι JSON ή Mongo
  - μιλάει ΜΟΝΟ με DAO
*/

export const buildEmbeddingText = (q: QuestionSpec): string => {
  return [
    `Ερώτηση: ${q.questionText}`,
    `Ενδεικτική απάντηση: ${q.canonicalAnswer}`,
    q.answerBullets?.length
      ? `Βασικά σημεία: ${q.answerBullets.join(", ")}`
      : "",
    q.keywords?.length ? `Λέξεις-κλειδιά: ${q.keywords.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");
};

const run = async () => {
  // chose file from script argv
  const dataPath = process.argv[2];

  if (!dataPath) {
    console.error("Usage: vectorize <path-to-json>");
    process.exit(1);
  }

  const questions = vectorDao.readAll(dataPath);

  console.log(`📄 Found ${questions.length} questions`);

  for (const question of questions) {
    if (question.embedding && question.embedding.length > 0) {
      console.log(`⏭️  ${question.id} already vectorized`);
      continue;
    }

    console.log(`🔢 Vectorizing ${question.id}`);

    // const text = buildEmbeddingText(question);
    const text = question.canonicalAnswer;
    const embedding = await getEmbedding(text);

    await vectorDao.saveEmbeddingById(question.id, embedding, dataPath);

    console.log(`✅ Saved embedding for ${question.id}`);
  }

  console.log("🎉 Vectorization completed");
};

run().catch((err) => {
  console.error("❌ Vectorization failed:", err);
  process.exit(1);
});
