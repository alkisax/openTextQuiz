/*
  🧠 GPT Embeddings Service
  ----------------------------------------------------
  Σκοπός:
  - Μετατροπή κειμένου σε vector (embedding[]) μέσω OpenAI
  - Υπολογισμός cosine similarity μεταξύ δύο διανυσμάτων

  Αυτό είναι η ΒΑΣΗ του RAG grading pipeline.
  Όλα τα υπόλοιπα (BM25, hybrid, vector index)
  θα "χτίσουν" από πάνω.

  prev → Question / Answer loaders
  next → cosine grading service
*/

import axios from "axios";
import { consts } from "../config/constants";

/*
  Αν στείλεις:
  {
    model: "text-embedding-3-small",
    input: "Ανατολικό Ζήτημα"
  }

  Το OpenAI απαντά:
  {
    data: [
      {
        embedding: [0.0123, -0.0456, ...]
      }
    ]
  }

  Επομένως:
  response.data.data[0].embedding → number[]
*/
export const getEmbedding = async (text: string): Promise<number[]> => {

  const response = await axios.post(
    "https://api.openai.com/v1/embeddings",
    {
      model: "text-embedding-3-small",
      input: text,
    },
    {
      headers: {
        Authorization: `Bearer ${consts.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data[0].embedding;
};

/*
  📐 Cosine Similarity
  ----------------------------------------------------
  Κλασικός μαθηματικός τύπος.
  Υπολογίζει πόσο "κοντά" είναι δύο διανύσματα.

  αποτέλεσμα:
  - 1.0 → απόλυτη ταύτιση
  - 0.0 → καμία σχέση
*/
export const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

  return dot / (normA * normB);
};
