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

// question-based
router.post("/cosine", controllers.gradeWithCosineDb);

// text-to-text
router.post("/cosine/text", controllers.gradeTextWithCosine);

export default router;
