import type { Request, Response } from "express"
import { transcribeAudioService } from "./transcribe.service"
import { handleControllerError } from "../utils/error/errorHandler"
import { ValidationError } from "../utils/error/errors.types"

export const transcribeAudioController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.file) {
      throw new ValidationError("Audio file is required")
    }

    const transcript = await transcribeAudioService(req.file.path)

    return res.json({
      status: true,
      transcript,
    })
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export const whisperControllers = {
  transcribeAudioController,
}