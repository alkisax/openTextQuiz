import fs from "fs"; // filesystem
import type { QuestionSpec } from "../types/qa.types";

/*
  DAO για JSON-based storage (temporary)
  -------------------------------------
  Το dataPath έρχεται απ’ έξω (script/argv).
  Αντικαθιστά το Mongo AnswerModel για τώρα.
  οταν θα βάλουμε Mongo αλλάζει μόνο αυτό το αρχείο και λίγο το script γιατι δεν θα θέλει αρχείο argv.
*/

/*
  Αποθηκεύει embedding στο JSON αρχείο
  in → id και vector array
  out → updated καταχώριση του JSON
*/
const saveEmbeddingById = async (inputQuestionId: string, embedding: number[], dataPath: string) => {
  const all = readAll(dataPath);
  const index = all.findIndex((question) => question.id === inputQuestionId);

  if (index === -1) {
    throw new Error(`Question ${inputQuestionId} not found`);
  }

  all[index] = {
    ...all[index],
    embedding,
  };

  writeAll(all, dataPath);
};

//  Γράφει ΟΛΕΣ τις ερωτήσεις (atomic overwrite)
const writeAll = (data: QuestionSpec[], dataPath: string) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
}

// Διαβάζει ΟΛΕΣ τις ερωτήσεις
const readAll = (dataPath: string): QuestionSpec[] => {
  const raw = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(raw);
};

// Φέρνει ερώτηση με βάση id
const getQuestionById = (id: string, dataPath: string): QuestionSpec => {
  const all = readAll(dataPath);
  const found = all.find((q) => q.id === id);

  if (!found) {
    throw new Error(`Question ${id} not found`);
  }

  return found;
};

export const vectorDao = {
  saveEmbeddingById,
  readAll,
  getQuestionById,
};
