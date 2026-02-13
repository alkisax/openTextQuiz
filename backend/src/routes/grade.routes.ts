/**
 * ⚠️ ΣΗΜΑΝΤΙΚΟ — Encoding προειδοποίηση
 * ----------------------------------------------------
 * Τα endpoints αυτά δέχονται ελεύθερο κείμενο (π.χ. ελληνικά).
 *
 * ❗ Προσοχή σε testing με curl σε Windows (Git Bash):
 * - Συχνά στέλνει το body με λάθος encoding (όχι UTF-8)
 * - Αυτό οδηγεί σε αλλοιωμένο text ("�� ����") και
 *   πολύ χαμηλό cosine score (~0.1), παρότι ο κώδικας είναι σωστός
 *
 * ✅ Συνιστώμενα εργαλεία για δοκιμές:
 * - PowerShell Invoke-RestMethod
 * - Postman
 * - Swagger UI
 *
 * ✅ Σε frontend / axios:
 * - Χρήση `Content-Type: application/json; charset=utf-8`
 * - Browsers στέλνουν UTF-8 by default → κανένα πρόβλημα
 */

import { Router } from "express";
import { controllers } from "../controllers/controller";

const router = Router();

console.log("grade.routes loaded");

// vector routes
// question-based
router.post("/cosine", controllers.gradeWithCosineDb);
// text-to-text
router.post("/cosine/text", controllers.gradeTextWithCosine);

// BM25 routes
// BM25 text-to-text
router.post("/bm25/text", controllers.gradeTextWithBm25);

// BULLETS ad-hoc comparison
router.post("/bullets/compare", controllers.compareTextWithBullets);

//language
router.post("/language", controllers.gradeTextWithLanguage);

// ✅ TOTAL (text-to-text)
router.post("/total/text", controllers.gradeTotalText);

// για την ενώτητα της έκθεσης
console.log("Registering POST /language/essay");
router.post("/language/essay", controllers.gradeEssay);

export default router;
