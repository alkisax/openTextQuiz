import axios from "axios";
import { consts } from "../config/constants";
import { ValidationError } from "../utils/error/errors.types";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

type SimpleScores = {
  content: number;
  coverage: number;
  language: number;
};

type SimpleResult = {
  scores: {
    content: number;
    coverage: number;
    language: number;
    wordLimit: number;
    total: number;
  };
  pass: boolean;
};

const countWords = (text: string) =>
  text.trim().split(/\s+/).filter(Boolean).length;

const buildPrompt = (
  question: string,
  correctAnswer: string,
  studentText: string,
) => `
Είσαι επίσημος εξεταστής.

Ερώτηση:
"${question}"

Σωστή απάντηση:
"""
${correctAnswer}
"""

Απάντηση μαθητή:
"""
${studentText}
"""

Αξιολόγησε από 0 έως 100:

1. content → ορθότητα και κατανόηση
2. coverage → αν καλύπτει τα βασικά σημεία
3. language → σαφήνεια και γραμματική

ΕΠΙΣΤΡΕΨΕ ΜΟΝΟ έγκυρο JSON:

{
  "content": number,
  "coverage": number,
  "language": number
}
`;

const calculateWordLimitScore = (
  wordCount: number,
  maxWords: number,
): number => {
  const lower100 = Math.floor(maxWords * 0.8);
  const upper100 = Math.ceil(maxWords * 1.2);

  const lower80 = Math.floor(maxWords * 0.7);
  const upper80 = Math.ceil(maxWords * 1.3);

  // Ζώνη 100%
  if (wordCount >= lower100 && wordCount <= upper100) {
    return 100;
  }

  // Ζώνη 80%
  if (
    (wordCount >= lower80 && wordCount < lower100) ||
    (wordCount > upper100 && wordCount <= upper80)
  ) {
    return 80;
  }

  // Εκτός ορίων
  return 0;
};

export const gradeOpenTextSimple = async (
  question: string,
  correctAnswer: string,
  studentText: string,
  maxWords: number,
): Promise<SimpleResult> => {
  if (!question || !correctAnswer || !studentText) {
    throw new ValidationError("Missing required fields");
  }

  // Word count locally
  const words = countWords(studentText);
  const wordLimitScore = calculateWordLimitScore(words, maxWords);

  console.log("Word count:", words);
  console.log("Word limit score:", wordLimitScore);
  
  // OpenAI call
  const response = await axios.post(
    OPENAI_URL,
    {
      model: MODEL,
      messages: [
        {
          role: "user",
          content: buildPrompt(question, correctAnswer, studentText),
        },
      ],
      temperature: 0,
    },
    {
      headers: {
        Authorization: `Bearer ${consts.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  const raw = response.data.choices[0].message.content;
  const parsed = JSON.parse(raw) as SimpleScores;

  // clamp safety
  const content = Math.max(0, Math.min(100, parsed.content));
  const coverage = Math.max(0, Math.min(100, parsed.coverage));
  const language = Math.max(0, Math.min(100, parsed.language));

  // ✅ 3️⃣ Calculate total backend-side
  const total = Math.round(
    (content + coverage + language + wordLimitScore) / 4,
  );

  const pass = total > 60;

  return {
    scores: {
      content,
      coverage,
      language,
      wordLimit: wordLimitScore,
      total,
    },
    pass,
  };
};
