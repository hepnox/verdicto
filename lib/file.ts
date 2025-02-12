
'use server';
import { Enums } from "./database.types";
import { createClient } from "./supabase/server";
import sharp from 'sharp';

const bucket = "media";

export const uploadFileToSupabase = async (
  file: File,
  path: "images" | "videos",
  quality: Enums<"file_quality"> = "low",
  watermark?: string,
) => {
  const supabase = await createClient();
  const fileExt = file.name.split(".").pop()?.toLowerCase();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  // Convert File to Buffer for processing
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let processedBuffer = buffer;

  // Only process images
  if (
    path === "images" &&
    fileExt &&
    ["jpg", "jpeg", "png", "webp"].includes(fileExt)
  ) {
    processedBuffer = await uploadCompressedImage(
      buffer,
      fileExt,
      quality,
      watermark,
    );
  }

  const uploadedFile = await supabase.storage
    .from(bucket)
    .upload(filePath, processedBuffer);

  const {
    data: { publicUrl: signedUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return {
    signedUrl,
    uploadedFile,
  };
};



export async function uploadCompressedImage(
  buffer: Buffer,
  fileExt: string,
  quality: Enums<'file_quality'>,
  watermark?: string
): Promise<Buffer> {
  let sharpInstance = sharp(buffer);

  // Apply compression based on quality
  const compressionOptions = {
    low: { quality: 60 },
    medium: { quality: 80 },
    high: { quality: 90 },
    original: { quality: 100 }
  };
  
  // Add watermark if provided
  if (watermark) {
    const watermarkBuffer = Buffer.from(
      `<svg><text x="50%" y="50%" font-family="Arial" font-size="24" fill="rgba(255,255,255,0.5)" text-anchor="middle">${watermark}</text></svg>`
    );
    sharpInstance = sharpInstance.composite([
      {
        input: watermarkBuffer,
        top: 10,
        left: 10,
      },
    ]);
  }

  // Process the image
  return sharpInstance
    .toFormat(fileExt as keyof sharp.FormatEnum)
    .jpeg(compressionOptions[quality])
    .toBuffer();
} 
