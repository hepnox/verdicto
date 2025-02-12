import { Enums } from "./database.types";
import supabase from "./supabase";
const bucket = "media";

export const uploadFile = async (
  file: File,
  path: "images" | "videos",
  quality: Enums<"file_quality"> = "low",
  watermark?: string,
) => {

  const fileExt = file.name.split(".").pop()?.toLowerCase();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  // Convert File to Buffer for processing
  // const arrayBuffer = await file.arrayBuffer();
  // const buffer = Buffer.from(arrayBuffer);

  // let processedBuffer = buffer;

  // // Only process images
  // if (
  //   path === "images" &&
  //   fileExt &&
  //   ["jpg", "jpeg", "png", "webp"].includes(fileExt)
  // ) {
  //   processedBuffer = await uploadCompressedImage(
  //     buffer,
  //     fileExt,
  //     quality,
  //     watermark,
  //   );
  // }

  const uploadedFile = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  const {
    data: { publicUrl: signedUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return {
    signedUrl,
    uploadedFile,
  };
};

