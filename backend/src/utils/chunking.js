export function splitIntoChunks(text, size = 500) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + size));
    i += size - 50; // 50 char overlap for better context
  }
  return chunks;
}
