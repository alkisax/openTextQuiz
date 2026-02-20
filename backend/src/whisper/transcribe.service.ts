import OpenAI from "openai"
import fs from "fs"
import "dotenv/config"


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const transcribeAudioService = async (filePath: string) => {
  const response = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: "gpt-4o-transcribe",
  })

  return response.text
}