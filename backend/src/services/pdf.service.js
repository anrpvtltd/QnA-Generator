import fs from 'fs/promises';
import pdfParse from 'pdf-parse';

export async function extractTextFromPDF(filePath) {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}
