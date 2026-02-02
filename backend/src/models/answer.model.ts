// backend\src\models\answer.model.ts
import { Schema, model } from "mongoose";

const AnswerSchema = new Schema(
  {
    questionId: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },

    canonicalAnswer: { type: String, required: true },
    answerBullets: { type: [String], default: [] },

    keywords: { type: [String], default: [] },

    embedding: {
      type: [Number],
      default: undefined,
    },

    difficulty: { type: Number, required: true },
  },
  { timestamps: true }
);

export const AnswerModel = model("Answer", AnswerSchema);
