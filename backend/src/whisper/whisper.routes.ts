import { Router } from "express"
import multer from "multer"
import path from "path"
import { whisperControllers } from "./whisper.controller"

const router = Router()

const upload = multer({
  dest: path.join(process.cwd(), "uploads"),
})

router.post(
  "/transcribe",
  upload.single("audio"),
  whisperControllers.transcribeAudioController
)

export default router