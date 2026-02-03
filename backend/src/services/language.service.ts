import axios from "axios";
import { consts } from "../config/constants";
import { ValidationError } from "../utils/error/errors.types";

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
