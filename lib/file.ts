import supabase from "./supabase";

const bucket = "media";

export const uploadFile = async (
  file: File,
  path: "images" | "videos",
) => {

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const uploadedFile = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    const signedUrl = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

      return {
        signedUrl,
        uploadedFile,
      };

};