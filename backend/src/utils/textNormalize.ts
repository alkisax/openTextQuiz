// utils/textNormalize.ts
export const normalizeText = (text: string) =>
  text
    .normalize("NFC")
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
