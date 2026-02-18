import type { Request, Response } from "express";
import { cosineService } from "../services/cosineGrading.service";
import { handleControllerError } from "../utils/error/errorHandler";
import { ValidationError } from "../utils/error/errors.types";
import path from "path";
import { bm25TextGrading } from "../services/bm25Text.service";
import { compareTextsWithBullets } from "../services/bullets.service";
import {
  gradeEssayWithOpenAI,
  gradeLanguage,
} from "../services/language.service";
import { gradeTotalTextToText } from "../services/total.service";
import { gradeOpenTextSimple } from "../services/openTextSimple.service";

/* 
VECTOR
*/
// ⚠️ hardcoded datapath
const gradeWithCosineDb = async (req: Request, res: Response) => {
  try {
    const { questionId, answerText } = req.body;

    if (!questionId || !answerText) {
      return res.status(400).json({
        error: "questionId and answerText are required",
      });
    }

    // προσωρινά JSON storage → path hardcoded
    const dataPath = path.join(process.cwd(), "src", "data", "test.data.json");

    const result = await cosineService.cosineGradingService(
      questionId,
      answerText,
      dataPath,
    );

    return res.json({
      questionId,
      score: result.cosineScore,
      raw: result.raw,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

const gradeTextWithCosine = async (req: Request, res: Response) => {
  try {
    const { textA, textB } = req.body;

    if (!textA || !textB) {
      throw new ValidationError("textA and textB are required");
    }

    const result = await cosineService.cosineTextService(textA, textB);

    return res.json({
      status: true,
      data: result,
      raw: result.raw,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/*
BM25
*/
const gradeTextWithBm25 = async (req: Request, res: Response) => {
  try {
    const { textA, textB } = req.body;

    if (!textA || !textB) {
      throw new ValidationError("textA and textB are required");
    }

    const result = bm25TextGrading(textA, textB);

    return res.json({
      status: true,
      score: result.bm25Score,
      raw: result.raw,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/*
bullets comparison
*/
const compareTextWithBullets = async (req: Request, res: Response) => {
  try {
    const { textA, textB } = req.body;

    if (!textA || !textB) {
      throw new ValidationError("textA and textB are required");
    }

    const result = await compareTextsWithBullets(textA, textB);

    return res.json({
      status: true,
      bullets: result.bullets,
      score: result.score,
      details: result.details,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/*
language
*/
const gradeTextWithLanguage = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text) {
      throw new ValidationError("text is required");
    }

    const result = await gradeLanguage(text);

    return res.json({
      status: true,
      score: result.score,
      note: result.note,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/*
TOTAL
*/
const gradeTotalText = async (req: Request, res: Response) => {
  try {
    const { textA, textB } = req.body;

    if (!textA || !textB) {
      throw new ValidationError("textA and textB are required");
    }

    const result = await gradeTotalTextToText(textA, textB);

    return res.json({
      status: true,
      ...result,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

// για την ενότητα της έκθεσης
// helper
const countWords = (text: string) =>
  text.trim().split(/\s+/).filter(Boolean).length;

// =================================================
// Essay
// =================================================
const gradeEssay = async (req: Request, res: Response) => {
  try {
    const { prompt, studentText } = req.body;

    // 1. type check
    if (typeof prompt !== 'string' || typeof studentText !== 'string') {
      throw new ValidationError('Invalid input types');
    }

    // 2. trim
    const safePrompt = prompt.trim();
    const studentSafeText = studentText.trim();

    // 3. empty check
    if (!safePrompt || !studentSafeText) {
      throw new ValidationError('prompt and studentText are required');
    }

    // 4. char hard cap
    if (studentSafeText.length > 5000) {
      throw new ValidationError('Text too large');
    }

    // 5. word hard cap
    const wordCount = countWords(studentSafeText);
    if (wordCount > 200) {
      throw new ValidationError('Word limit exceeded');
    }

    const result = await gradeEssayWithOpenAI(
      safePrompt,
      studentSafeText
    );

    return res.json({
      status: true,
      ...result,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

// =================================================
// Open Text Simple
// =================================================
const gradeOpenTextSimpleController = async (
  req: Request,
  res: Response
) => {
  try {
    const { question, correctAnswer, studentText, maxWords } = req.body;

    // 1. type check
    if (
      typeof question !== 'string' ||
      typeof correctAnswer !== 'string' ||
      typeof studentText !== 'string' ||
      typeof maxWords !== 'number'
    ) {
      throw new ValidationError('Invalid input types');
    }

    // 2. bounds check για maxWords
    if (!Number.isFinite(maxWords) || maxWords < 1 || maxWords > 1000) {
      throw new ValidationError('Invalid maxWords');
    }

    // 3. trim
    const studentSafeText = studentText.trim();

    // 4. empty check
    if (!studentSafeText) {
      throw new ValidationError('studentText is required');
    }

    // 5. char hard cap
    if (studentSafeText.length > 5000) {
      throw new ValidationError('Text too large');
    }

    // 6. word hard cap (security cap)
    const wordCount = countWords(studentSafeText);
    if (wordCount > 200) {
      throw new ValidationError('Word limit exceeded');
    }

    const result = await gradeOpenTextSimple(
      question.trim(),
      correctAnswer.trim(),
      studentSafeText,
      maxWords
    );

    return res.json({
      status: true,
      ...result,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};


export const controllers = {
  gradeWithCosineDb,
  gradeTextWithCosine,
  gradeTextWithBm25,
  compareTextWithBullets,
  gradeTextWithLanguage,
  gradeTotalText,
  gradeEssay,
  gradeOpenTextSimpleController,
};
