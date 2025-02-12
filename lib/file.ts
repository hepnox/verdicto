import supabase from "./supabase";

const bucket = "media";

export const uploadFile = async (
  file: File,
  path: "images" | "videos",
): Promise<{ data: any; error: any }> => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { data: publicUrl, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// export const deleteFile = async (
//   bucket: string,
//   path: string
// ): Promise<{ data: any; error: any }> => {
//   try {
//     const { data, error } = await supabase.storage
//       .from(bucket)
//       .remove([path]);

//     if (error) throw error;
//     return { data, error: null };
//   } catch (error) {
//     return { data: null, error };
//   }
// };
