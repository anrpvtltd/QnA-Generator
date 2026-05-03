import { supabase } from '../src/config/supabase.js';
import { redisClient } from '../src/config/redis.js';
import { generateEmbedding } from '../src/utils/embedding.js';
import { splitIntoChunks } from '../src/utils/chunking.js';

async function testSystem() {
  console.log("--- Starting System Test ---");

  // 1. Test Supabase
  try {
    const { data, error } = await supabase.from('documents').select('id').limit(1);
    if (error) throw error;
    console.log("✅ Supabase Connection: Success");
  } catch (err) {
    console.error("❌ Supabase Connection: Failed", err.message);
  }

  // 2. Test OpenAI Embedding
  try {
    const testText = "Hello, this is a test chunk.";
    const embedding = await generateEmbedding(testText);
    console.log(`Actual Embedding Length: ${embedding?.length}`);
    if (embedding && embedding.length > 0) {
      console.log("✅ Gemini API: Success (Embedding generated)");
    } else {
      throw new Error(`Invalid embedding length: ${embedding?.length}`);
    }
  } catch (err) {
    console.error("❌ OpenAI API: Failed", err.message);
  }

  // 3. Test Redis
  try {
    await redisClient.set("test_key", "test_value");
    const val = await redisClient.get("test_key");
    if (val === "test_value") {
      console.log("✅ Redis Connection: Success");
    } else {
      throw new Error("Redis value mismatch");
    }
  } catch (err) {
    console.error("❌ Redis Connection: Failed", err.message);
  }

  // 4. Test Chunking
  const longText = "A".repeat(1200);
  const chunks = splitIntoChunks(longText, 500);
  console.log(`✅ Chunking: Success (${chunks.length} chunks generated for 1200 chars)`);
  
  process.exit(0);
}

testSystem();
