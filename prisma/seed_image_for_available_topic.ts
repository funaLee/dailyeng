/**
 * Seed Script: Populate images for SpeakingScenario from Pexels API
 * 
 * This script:
 * 1. Fetches all speaking scenarios from the database
 * 2. Sends scenario titles to Gemini to get image search keywords
 * 3. Uses Pexels API to fetch relevant images
 * 4. Updates the database with new image URLs
 * 
 * Run with: npx ts-node prisma/seed_image_for_available_topic.ts
 */

import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const prisma = new PrismaClient();

// Configuration - Use environment variables for API keys
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!PEXELS_API_KEY) {
  console.error("❌ Missing PEXELS_API_KEY in environment variables");
  process.exit(1);
}

if (!GEMINI_API_KEY) {
  console.error("❌ Missing GEMINI_API_KEY in environment variables");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Helper: Delay to avoid rate limiting
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Pexels API Response Types
interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
}

interface PexelsResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
}

/**
 * Step 1: Fetch all scenarios from database
 */
async function fetchAllScenarios() {
  console.log("📥 Fetching all scenarios from database...");
  
  const scenarios = await prisma.speakingScenario.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
    },
  });
  
  console.log(`   Found ${scenarios.length} scenarios`);
  return scenarios;
}

/**
 * Step 2: Use Gemini to generate image search keywords for multiple titles
 * Batches up to 20 titles at once to reduce API calls
 */
async function generateKeywordsForTitles(
  scenarios: { id: string; title: string; description: string }[]
): Promise<Map<string, string>> {
  console.log("🤖 Generating search keywords with Gemini...");
  
  const keywordMap = new Map<string, string>();
  const BATCH_SIZE = 20;
  
  for (let i = 0; i < scenarios.length; i += BATCH_SIZE) {
    const batch = scenarios.slice(i, i + BATCH_SIZE);
    console.log(`   Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(scenarios.length / BATCH_SIZE)}`);
    
    const titlesText = batch
      .map((s, idx) => `${idx + 1}. "${s.title}" - ${s.description}`)
      .join("\n");
    
    const prompt = `For each scenario title below, provide ONE short image search keyword (2-3 words) suitable for finding a stock photo on Pexels. The keyword should represent the main visual theme of the scenario.

SCENARIOS:
${titlesText}

IMPORTANT RULES:
- Each keyword should be 2-3 words only
- Keywords should be general enough to find good stock photos
- Avoid words like "english" or "learning"
- Focus on the SETTING or ACTIVITY (e.g., "coffee shop", "job interview", "doctor office", "airport travel")

Output JSON format ONLY (no markdown):
{
  "keywords": [
    {"index": 1, "keyword": "coffee shop"},
    {"index": 2, "keyword": "job interview"},
    ...
  ]
}`;

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
        },
      });
      
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = JSON.parse(text) as { keywords: { index: number; keyword: string }[] };
      
      for (const item of parsed.keywords) {
        const scenario = batch[item.index - 1];
        if (scenario) {
          keywordMap.set(scenario.id, item.keyword);
          console.log(`   ✓ "${scenario.title}" → "${item.keyword}"`);
        }
      }
    } catch (error) {
      console.error(`   ❌ Gemini error for batch:`, error);
      // Fallback: use simple extraction from title
      for (const scenario of batch) {
        const fallbackKeyword = scenario.title.split(" ").slice(0, 2).join(" ");
        keywordMap.set(scenario.id, fallbackKeyword);
        console.log(`   ⚠ Fallback for "${scenario.title}" → "${fallbackKeyword}"`);
      }
    }
    
    // Rate limiting between batches
    if (i + BATCH_SIZE < scenarios.length) {
      await delay(1000);
    }
  }
  
  return keywordMap;
}

/**
 * Step 3: Search Pexels for an image using keyword
 */
async function searchPexelsImage(keyword: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=3&orientation=landscape`,
      {
        headers: {
          Authorization: PEXELS_API_KEY!,
        },
      }
    );
    
    if (!response.ok) {
      console.error(`   ❌ Pexels API error: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data: PexelsResponse = await response.json();
    
    if (data.photos.length === 0) {
      console.log(`   ⚠ No photos found for "${keyword}"`);
      return null;
    }
    
    // Return medium-sized image for good balance of quality and load time
    // Randomly pick from top 3 to add variety
    const randomIndex = Math.floor(Math.random() * Math.min(3, data.photos.length));
    return data.photos[randomIndex].src.medium;
  } catch (error) {
    console.error(`   ❌ Pexels fetch error for "${keyword}":`, error);
    return null;
  }
}

/**
 * Step 4: Update scenario with new image URL
 */
async function updateScenarioImage(scenarioId: string, imageUrl: string) {
  await prisma.speakingScenario.update({
    where: { id: scenarioId },
    data: { image: imageUrl },
  });
}

/**
 * Main execution
 */
async function main() {
  console.log("🚀 Starting image seeding process...\n");
  
  try {
    // Step 1: Fetch scenarios
    const scenarios = await fetchAllScenarios();
    
    if (scenarios.length === 0) {
      console.log("No scenarios found in database. Exiting.");
      return;
    }
    
    // Step 2: Generate keywords
    const keywordMap = await generateKeywordsForTitles(scenarios);
    console.log(`\n📝 Generated ${keywordMap.size} keywords\n`);
    
    // Step 3 & 4: Fetch images and update database
    console.log("📷 Fetching images from Pexels and updating database...\n");
    
    let successCount = 0;
    let failCount = 0;
    
    for (const scenario of scenarios) {
      const keyword = keywordMap.get(scenario.id);
      
      if (!keyword) {
        console.log(`   ⚠ No keyword for scenario ${scenario.id}, skipping`);
        failCount++;
        continue;
      }
      
      // Fetch image
      const imageUrl = await searchPexelsImage(keyword);
      
      if (imageUrl) {
        // Update database
        await updateScenarioImage(scenario.id, imageUrl);
        console.log(`   ✅ Updated "${scenario.title}" with image from "${keyword}"`);
        successCount++;
      } else {
        failCount++;
      }
      
      // Rate limiting: 200 requests/hour = 1 request per 18 seconds max
      // Being conservative with 500ms delay
      await delay(500);
    }
    
    console.log("\n" + "=".repeat(50));
    console.log("✨ SEEDING COMPLETE");
    console.log("=".repeat(50));
    console.log(`   ✅ Successfully updated: ${successCount} scenarios`);
    console.log(`   ❌ Failed/Skipped: ${failCount} scenarios`);
    console.log("=".repeat(50));
    
  } catch (error) {
    console.error("❌ Fatal error during seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
