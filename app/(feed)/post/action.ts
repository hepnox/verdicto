"use server";
import { createClient } from "@/lib/supabase/server";
import { Tables, TablesInsert } from "../../../lib/database.types";
import { uploadFile } from "../../../lib/file";
import { downloadAndCompressImage } from "../../../lib/file.server";

export async function createReport(args: {
  data: TablesInsert<"reports">;
  files: TablesInsert<"files">[];
}) {
  const supabase = await createClient();
  const userPreferences = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", args.data.user_id)
    .single();

  // Download and upload the compressed image without watermark
  const compressedImages = await Promise.all(
    args.files.map(async (file) => {
      const compressedImage = await downloadAndCompressImage(
        file.url,
        userPreferences.data?.watermark ?? undefined,
        userPreferences.data?.image_quality ?? "low",
      );

      // Create FormData to upload file
      const formData = new FormData();
      formData.append(
        "file",
        new File([compressedImage], file.url.split("/").pop() ?? "image.jpg"),
      );

      const uploadedCompressedImage = await uploadFile(formData, "images");
      return uploadedCompressedImage.signedUrl;
    }),
  );

  const createdFiles = await supabase
    .from("files")
    .insert(
      compressedImages.map((image) => ({
        url: image,
        user_id: args.data.user_id,
      })),
    )
    .select();

  if (createdFiles.error) throw new Error(createdFiles.error.message);

  const createdReport = await supabase
    .from("reports")
    .insert(args.data)
    .select()
    .single();

  if (createdReport.error) throw new Error(createdReport.error.message);

  const reportFiles: TablesInsert<"report_files">[] = createdFiles.data.map(
    (file) => ({
      report_id: createdReport.data.id,
      file_id: file.id,
      quality: userPreferences.data?.image_quality ?? "low",
    }),
  );

  const createdReportFiles = await supabase
    .from("report_files")
    .insert(reportFiles);

  if (createdReportFiles.error)
    throw new Error(createdReportFiles.error.message);

  return {
    report: createdReport.data,
    files: createdFiles.data,
  };
}

export async function updateReport(args: {
  report: Pick<Tables<"reports">, "id" | "title" | "description">;
}) {
  const updatedReport = await supabase
    .from("reports")
    .update(args.report)
    .eq("id", args.report.id)
    .select()
    .single();
  if (updatedReport.error) throw new Error(updatedReport.error.message);
  return updatedReport.data;
}

export async function getReports() {
  const reports = await supabase.from("reports").select("*, files(*)");
  if (reports.error) throw new Error(reports.error.message);
  return reports.data;
}
