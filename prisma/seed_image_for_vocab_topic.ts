/**
 * Seed Script: Populate images for Vocabulary Topics from Pexels API
 *
 * This script:
 * 1. Fetches all vocabulary topics from the database
 * 2. Uses the subcategory to search for images on Pexels
 * 3. Randomly selects an image from search results to ensure variety
 * 4. Updates only the thumbnail field of vocabulary topics
 *
 * Key Features:
 * - Removes level suffix from topic titles for cleaner search (e.g., "Shopping - A2" → "Shopping")
 * - Uses subcategory for more relevant image searches
 * - Randomizes image selection to ensure different images for same subcategories
 * - Only affects vocabulary hub topics (hubType: 'vocab')
 *
 * Run with: tsx prisma/seed_image_for_vocab_topic.ts
 *
 * Required env vars:
 * - PEXELS_API_KEY: Your Pexels API key
 */

// Load environment variables from .env.local
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Configuration - Use environment variables for API keys
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

if (!PEXELS_API_KEY) {
  console.error("❌ Missing PEXELS_API_KEY in environment variables");
  process.exit(1);
}

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
 * Remove level suffix from topic title
 * Examples:
 * - "Shopping - A2" → "Shopping"
 * - "Food and Cooking - B1" → "Food and Cooking"
 * - "Travel" → "Travel" (no change)
 */
function cleanTitle(title: string): string {
  // Pattern: " - A1", " - A2", " - B1", " - B2", " - C1", " - C2" at the end
  return title.replace(/\s*-\s*(A1|A2|B1|B2|C1|C2)\s*$/i, "").trim();
}

/**
 * Step 1: Fetch all vocabulary topics from database
 * Only fetches topics that belong to vocab TopicGroups
 */
async function fetchAllVocabTopics() {
  console.log("📥 Fetching all vocabulary topics from database...");

  const topics = await prisma.topic.findMany({
    where: {
      topicGroup: {
        hubType: "vocab",
      },
    },
    select: {
      id: true,
      title: true,
      subcategory: true,
      thumbnail: true,
    },
  });

  console.log(`   Found ${topics.length} vocabulary topics`);
  return topics;
}

/**
 * Step 2: Search Pexels for images using subcategory as keyword
 * Returns a random image from the search results to ensure variety
 */
async function searchPexelsImage(keyword: string): Promise<string | null> {
  try {
    // Request more images (10) to have better variety for random selection
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        keyword
      )}&per_page=10&orientation=landscape`,
      {
        headers: {
          Authorization: PEXELS_API_KEY!,
        },
      }
    );

    if (!response.ok) {
      console.error(
        `   ❌ Pexels API error: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const data: PexelsResponse = await response.json();

    if (data.photos.length === 0) {
      console.log(`   ⚠ No photos found for "${keyword}"`);
      return null;
    }

    // Random selection from all available photos (up to 10)
    const randomIndex = Math.floor(Math.random() * data.photos.length);
    return data.photos[randomIndex].src.medium;
  } catch (error) {
    console.error(`   ❌ Pexels fetch error for "${keyword}":`, error);
    return null;
  }
}

/**
 * Step 3: Update topic with new thumbnail URL
 * Only updates the thumbnail field, preserving all other data
 */
async function updateTopicThumbnail(topicId: string, imageUrl: string) {
  await prisma.topic.update({
    where: { id: topicId },
    data: { thumbnail: imageUrl },
  });
}

/**
 * Main execution
 */
async function main() {
  console.log("🚀 Starting vocabulary topic image seeding process...\n");
  console.log("=".repeat(60));
  console.log(
    "📌 This script ONLY updates thumbnail images for vocabulary topics"
  );
  console.log("📌 No other data will be modified");
  console.log("=".repeat(60) + "\n");

  try {
    // Step 1: Fetch vocabulary topics
    const topics = await fetchAllVocabTopics();

    if (topics.length === 0) {
      console.log("No vocabulary topics found in database. Exiting.");
      return;
    }

    // Group topics by subcategory to show progress better
    const subcategoryGroups = new Map<string, typeof topics>();
    for (const topic of topics) {
      const subcat = topic.subcategory || "Unknown";
      if (!subcategoryGroups.has(subcat)) {
        subcategoryGroups.set(subcat, []);
      }
      subcategoryGroups.get(subcat)!.push(topic);
    }

    console.log(
      `\n📊 Topics grouped by ${subcategoryGroups.size} subcategories\n`
    );

    // Step 2 & 3: Fetch images and update database
    console.log("📷 Fetching images from Pexels and updating database...\n");

    let successCount = 0;
    let failCount = 0;

    for (const [subcategory, subcatTopics] of subcategoryGroups) {
      console.log(
        `\n🏷️  Processing subcategory: "${subcategory}" (${subcatTopics.length} topics)`
      );

      for (const topic of subcatTopics) {
        const cleanedTitle = cleanTitle(topic.title);

        // Use subcategory as the primary search keyword
        // This ensures relevant images while random selection adds variety
        const searchKeyword = subcategory || cleanedTitle;

        // Fetch image with random selection
        const imageUrl = await searchPexelsImage(searchKeyword);

        if (imageUrl) {
          // Update database
          await updateTopicThumbnail(topic.id, imageUrl);
          console.log(
            `   ✅ "${cleanedTitle}" → random image from "${searchKeyword}"`
          );
          successCount++;
        } else {
          // Try fallback with cleaned title if subcategory search failed
          const fallbackUrl = await searchPexelsImage(cleanedTitle);
          if (fallbackUrl) {
            await updateTopicThumbnail(topic.id, fallbackUrl);
            console.log(
              `   ✅ "${cleanedTitle}" → fallback image from "${cleanedTitle}"`
            );
            successCount++;
          } else {
            console.log(`   ❌ "${cleanedTitle}" → no image found`);
            failCount++;
          }
        }

        // Rate limiting: Pexels allows 200 requests/hour = 1 request per 18 seconds max
        // Being conservative with 500ms delay
        await delay(500);
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("✨ VOCABULARY IMAGE SEEDING COMPLETE");
    console.log("=".repeat(60));
    console.log(`   ✅ Successfully updated: ${successCount} topics`);
    console.log(`   ❌ Failed/Skipped: ${failCount} topics`);
    console.log("=".repeat(60));
  } catch (error) {
    console.error("❌ Fatal error during seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
