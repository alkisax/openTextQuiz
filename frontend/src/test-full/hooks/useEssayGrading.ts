import { useState } from 'react'
import axios from 'axios'
import { url } from '../constants/constants'
type GradeEssayParams = {
  prompt: string
  studentText: string
}

export const useEssayGrading = () => {
  const [essayResult, setEssayResult] = useState<any>(null)
  const [essayLoading, setEssayLoading] = useState(false)

  const gradeEssay = async ({ prompt, studentText }: GradeEssayParams) => {
    if (!studentText) return

    try {
      setEssayLoading(true)

      const response = await axios.post(
        `${url}/api/grade/language/essay`,
        {
          prompt,
          studentText,
        },
      )

      setEssayResult(response.data)
    } catch (err) {
      console.error(err)
    } finally {
      setEssayLoading(false)
    }
  }

  return {
    gradeEssay,
    essayResult,
    essayLoading,
  }
}