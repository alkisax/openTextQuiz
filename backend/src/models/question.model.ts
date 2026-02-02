// backend\src\models\question.model.ts
import { Schema, model } from "mongoose";

const QuestionRulesSchema = new Schema(
  {
    expectsList: { type: Boolean, required: true },
    maxWords: { type: Number },
    minItems: { type: Number },
    maxItems: { type: Number },
  },
  { _id: false }
);

const QuestionSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true },
    questionText: { type: String, required: true },

    rules: { type: QuestionRulesSchema, required: true },

    canonicalAnswer: { type: String, required: true },
    answerBullets: { type: [String], default: [] },
    acceptedItems: { type: [String], default: [] },

    keywords: { type: [String], default: [] },
    difficulty: { type: Number, required: true },
  },
  { timestamps: true }
);

export const QuestionModel = model("Question", QuestionSchema);
