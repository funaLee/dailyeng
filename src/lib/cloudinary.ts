"use server";

import { v2 as cloudinary } from "cloudinary";

// Cloudinary is auto-configured via CLOUDINARY_URL environment variable
// Format: cloudinary://<api_key>:<api_secret>@<cloud_name>

export async function uploadToCloudinary(
  base64Data: string,
  folder: string = "avatars"
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  try {
    // Validate that CLOUDINARY_URL is configured
    if (!process.env.CLOUDINARY_URL) {
      console.error("CLOUDINARY_URL environment variable is not set");
      return { success: false, error: "Cloudinary is not configured" };
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(base64Data, {
      folder,
      resource_type: "image",
      transformation: [
        { width: 400, height: 400, crop: "fill", gravity: "face" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });

    return { success: true, url: result.secure_url };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}
