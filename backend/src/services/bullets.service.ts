import axios from "axios";
import { consts } from "../config/constants";
import type {
  BulletEvaluation,
  BulletsGradeResult,
} from "../types/bullets.types";
import { ValidationError } from "../utils/error/errors.types";

const extractJson = (text: string): any => {
  // πάρε μόνο το πρώτο JSON block
  const match = text.match(/\[[\s\S]*\]/);

  if (!match) {
    throw new Error("No JSON array found in response");
  }

  return JSON.parse(match[0]);
};

// 🧠 Bullets Grading Service
// - Student text ελέγχεται αν καλύπτει κάθε bullet

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini"; // σταθερό & φθηνό

/*
  Prompt για αξιολόγηση κάλυψης
*/
const buildCoveragePrompt = (bullets: string[], studentText: string) => `
Είσαι εξεταστής.

Σου δίνονται:
1) Μια λίστα θεματικών μονάδων (bullets) που ΠΡΕΠΕΙ να καλυφθούν.
2) Μια απάντηση μαθητή.

Για ΚΑΘΕ bullet:
- Πες αν καλύπτεται από την απάντηση:
  - YES = καλύπτεται ξεκάθαρα
  - PARTIAL = αναφέρεται έμμεσα ή ασαφώς
  - NO = δεν καλύπτεται

ΕΠΙΣΤΡΕΨΕ ΜΟΝΟ έγκυρο JSON array.
ΧΩΡΙΣ εξηγήσεις.

Bullets:
${bullets.map((b, i) => `${i + 1}. ${b}`).join("\n")}

Απάντηση μαθητή:
"""
${studentText}
"""

Μορφή απάντησης:
[
  { "bullet": "...", "coverage": "YES|PARTIAL|NO" }
]
`;

const callOpenAI = async (prompt: string): Promise<any> => {
  const response = await axios.post(
    OPENAI_URL,
    {
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    },
    {
      headers: {
        Authorization: `Bearer ${consts.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  const content = response.data.choices[0].message.content;
  // debug
  console.log("🧠 [OPENAI RAW RESPONSE]");
  console.log(content);

  try {
    return extractJson(content);
  } catch {
    throw new ValidationError("Invalid JSON returned from OpenAI");
  }
};

/*
  📌 Main grading function
*/
export const gradeBulletsCoverage = async (
  canonicalBullets: string[],
  studentText: string,
): Promise<BulletsGradeResult> => {
  if (!canonicalBullets?.length) {
    throw new ValidationError("canonicalBullets are required");
  }
  if (!studentText) {
    throw new ValidationError("studentText is required");
  }

  const prompt = buildCoveragePrompt(canonicalBullets, studentText);
  const evaluation = (await callOpenAI(prompt)) as BulletEvaluation[];

  let sum = 0;

  for (const e of evaluation) {
    if (e.coverage === "YES") sum += 1;
    else if (e.coverage === "PARTIAL") sum += 0.5;
  }

  const score = Math.round((sum / canonicalBullets.length) * 100);

  return {
    score,
    details: evaluation,
  };
};

// bullets creator με open ai
// 🧠 Canonical Bullets Creator
// - Παράγει θεματικές μονάδες από canonical answer

const buildBulletsPrompt = (canonicalText: string) => `
Είσαι πανεπιστημιακός εξεταστής.

Από το παρακάτω κείμενο, εξήγαγε 4 έως 6
σαφείς και διακριτές ΘΕΜΑΤΙΚΕΣ ΜΟΝΑΔΕΣ.

Κανόνες:
- Κάθε bullet = σύντομος θεματικός τίτλος
- Όχι προτάσεις
- Όχι επεξηγήσεις
- Όχι παραδείγματα
- Όχι αλληλοεπικάλυψη
- Ελληνικά

ΕΠΙΣΤΡΕΨΕ ΜΟΝΟ έγκυρο JSON array string[].

Κείμενο:
"""
${canonicalText}
"""
`;

export const createCanonicalBullets = async (
  canonicalText: string,
): Promise<string[]> => {
  if (!canonicalText) {
    throw new ValidationError("canonicalText is required");
  }

  const response = await axios.post(
    OPENAI_URL,
    {
      model: MODEL,
      messages: [{ role: "user", content: buildBulletsPrompt(canonicalText) }],
      temperature: 0,
    },
    {
      headers: {
        Authorization: `Bearer ${consts.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  const content = response.data.choices[0].message.content;
  // 🔴 debug
  console.log("🧠 [OPENAI RAW BULLETS RESPONSE]");
  console.log(content);

  try {
    const bullets = extractJson(content);

    if (!Array.isArray(bullets)) throw new Error();
    return bullets;
  } catch {
    throw new ValidationError("Invalid bullets JSON from OpenAI");
  }
};

/*
  🧠 Ad-hoc Bullets Comparison
  ----------------------------------------------------
  - Δημιουργεί bullets από textA
  - Αμέσως ελέγχει αν textB τα καλύπτει
  - Τίποτα δεν αποθηκεύεται
*/

export const compareTextsWithBullets = async (
  textA: string,
  textB: string,
): Promise<BulletsGradeResult & { bullets: string[] }> => {
  if (!textA || !textB) {
    throw new ValidationError("Both textA and textB are required");
  }

  // 1️⃣ δημιουργία bullets από textA
  const bullets = await createCanonicalBullets(textA);
  console.log("[BULLETS] Generated canonical bullets:", bullets);

  if (!bullets.length) {
    throw new ValidationError("No bullets generated from textA");
  }

  // 2️⃣ αξιολόγηση κάλυψης textB
  const grading = await gradeBulletsCoverage(bullets, textB);
  console.log("[BULLETS] Coverage result:", grading.details);
  console.log("[BULLETS] Bullets score:", grading.score);
  return {
    bullets,
    score: grading.score,
    details: grading.details,
  };
};
