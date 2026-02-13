import axios from "axios";
import { consts } from "../config/constants";
import { ValidationError } from "../utils/error/errors.types";
import { EssayEvaluationResult } from "../types/essay.types";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

type LanguageResult = {
  score: number;      // 0–100
  note: string;       // 1–2 προτάσεις feedback
};

const extractJson = (text: string): any => {
  const match = text.match(/\{[\s\S]*\}/);

  if (!match) {
    throw new Error("No JSON object found in response");
  }

  return JSON.parse(match[0]);
};

const buildLanguagePrompt = (text: string) => `
Είσαι πανεπιστημιακός διορθωτής γραπτών.

Αξιολόγησε ΜΟΝΟ τη ΓΛΩΣΣΙΚΗ ΠΟΙΟΤΗΤΑ του παρακάτω κειμένου.
Αγνόησε το περιεχόμενο και την ιστορική ακρίβεια.

Κριτήρια:
- σαφήνεια
- συνοχή
- γραμματική
- ακαδημαϊκό ύφος

Βαθμολόγησε από 0 έως 100.

ΕΠΙΣΤΡΕΨΕ ΜΟΝΟ έγκυρο JSON:
{
  "score": number,
  "note": "σύντομο σχόλιο 1–2 προτάσεων"
}

Κείμενο:
"""
${text}
"""
`;

export const gradeLanguage = async (studentText: string): Promise<LanguageResult> => {
  if (!studentText) {
    throw new ValidationError("studentText is required");
  }

  const response = await axios.post(
    OPENAI_URL,
    {
      model: MODEL,
      messages: [{ role: "user", content: buildLanguagePrompt(studentText) }],
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

  try {
    const parsed = extractJson(raw);

    if (
      typeof parsed.score !== "number" ||
      typeof parsed.note !== "string"
    ) {
      throw new Error();
    }

    return {
      score: Math.max(0, Math.min(100, Math.round(parsed.score))),
      note: parsed.note,
    };
  } catch {
    throw new ValidationError("Invalid language JSON from OpenAI");
  }
};

// για την ενώτητα της εκθεσης
const buildEssayPrompt = (
  prompt: string,
  studentText: string,
) => `
Είσαι επίσημος αξιολογητής εξετάσεων.

Θέμα:
"""
${prompt}
"""

Κείμενο μαθητή:
"""
${studentText}
"""

Αξιολόγησε με άριστα το 100 στο κάθε κριτήριο:

- content (ανταπόκριση στο θέμα)
- coherence (συνοχή και οργάνωση)
- grammar (ορθογραφία και σύνταξη)
- vocabulary (λεξιλόγιο)
- structure (μορφή και δομή)

Δώσε επίσης:
- συνολική βαθμολογία (μέσος όρος)
- σύντομο feedback (2-3 προτάσεις)
- μία ενδεικτική απάντηση 90-100 λέξεων

ΕΠΙΣΤΡΕΨΕ ΜΟΝΟ έγκυρο JSON:

{
  "scores": {
    "content": number,
    "coherence": number,
    "grammar": number,
    "vocabulary": number,
    "structure": number
  },
  "total": number,
  "feedback": "string",
  "modelAnswer": "string"
}
`;

export const gradeEssayWithOpenAI = async (
  prompt: string,
  studentText: string,
): Promise<EssayEvaluationResult> => {

  const response = await axios.post(
    OPENAI_URL,
    {
      model: MODEL,
      messages: [
        {
          role: "user",
          content: buildEssayPrompt(prompt, studentText),
        },
      ],
      temperature: 0.3,
    },
    {
      headers: {
        Authorization: `Bearer ${consts.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  const raw = response.data.choices[0].message.content;

  return JSON.parse(raw);
};