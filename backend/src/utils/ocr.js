import Tesseract from 'tesseract.js';
import pdfImgConvert from 'pdf-img-convert';

export async function performOCR(pdfPath) {
  try {
    console.log("Starting OCR process...");
    // 1. Convert PDF pages to images
    const pdfImages = await pdfImgConvert.convert(pdfPath);
    
    let fullText = "";
    
    // 2. Perform OCR on each image
    for (let i = 0; i < pdfImages.length; i++) {
      console.log(`OCRing page ${i + 1}...`);
      const { data: { text } } = await Tesseract.recognize(
        pdfImages[i],
        'eng',
        { logger: m => console.log(m.status) }
      );
      fullText += text + "\n";
    }
    
    return fullText;
  } catch (error) {
    console.error("OCR Error:", error);
    throw new Error("Failed to process document with OCR");
  }
}
