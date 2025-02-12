'use server'

import sharp from 'sharp';
import { Enums } from "./database.types";

export async function processImageBuffer(
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
    high: { quality: 90 }
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