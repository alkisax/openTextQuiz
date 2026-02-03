import type { Request, Response } from "express";
import { cosineService } from "../services/cosineGrading.service";
import { handleControllerError } from "../utils/error/errorHandler";
import { ValidationError } from "../utils/error/errors.types";
import path from "path";

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
      raw: result.raw
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
      raw: result.raw
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const controllers = {
  gradeWithCosineDb,
  gradeTextWithCosine,
};
