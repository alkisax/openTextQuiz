import fs from 'fs'
import path from 'path'

// path στο draftLanguageTests.json
const filePath = path.resolve(
  __dirname,
  '../../../frontend/src/test-full/data/draftLanguageTests.json'
)

// διάβασε το αρχείο
const raw = fs.readFileSync(filePath, 'utf-8')
const tests = JSON.parse(raw)

const migrated = tests.map((test: any) => {
  // προσθήκη active
  test.active = true

  const processQuestions = (questions: any[]) => {
    return questions.map((q) => {
      // πρόσθεσε category αν δεν υπάρχει
      if (!q.category) {
        q.category = 'γλώσσα'
      }

      // μετατροπή shortText
      if (q.type === 'shortText') {
        // correctAnswer string -> array
        if (typeof q.correctAnswer === 'string') {
          q.correctAnswer = [q.correctAnswer]
        }

        // multipleBlanks αν δεν υπάρχει
        if (q.multipleBlanks === undefined) {
          q.multipleBlanks = false
        }

        // αφαίρεση legacy flags
        delete q.caseSensitive
        delete q.trim
        delete q.normalizeGreek
      }

      return q
    })
  }

  // process Μέρος Α
  test.parts.A.questions = processQuestions(test.parts.A.questions)

  // process Μέρος Β
  test.parts.B.questions = processQuestions(test.parts.B.questions)

  return test
})

// γράψε νέο αρχείο (overwrite)
fs.writeFileSync(filePath, JSON.stringify(migrated, null, 2), 'utf-8')

console.log('Migration completed successfully.')