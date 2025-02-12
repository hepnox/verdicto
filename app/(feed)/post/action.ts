"use server";
import { createClient } from "@/lib/supabase/server";
import { Tables, TablesInsert } from "../../../lib/database.types";
import { uploadFileToSupabase } from "../../../lib/file";

export async function createReport(args: {
  data: TablesInsert<"reports">;
  location?: TablesInsert<"geolocations">;
  files: File[];
}) {
  const supabase = await createClient();
  let locationId = args.location?.id ?? undefined;
  if (!locationId && args.location) {
  const createdLocation = await supabase
    .from("geolocations")
    .insert(args.location)
    .select()
    .single();

    if (createdLocation.error) throw new Error(createdLocation.error.message);
    if (createdLocation.data) locationId = createdLocation.data.id;
  }

  const userPreferences = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", args.data.user_id)
    .single();

  // Download and upload the compressed image without watermark
  const compressedImages = await Promise.all(
    args.files.map(async (file) => {
      const uploadedCompressedImage = await uploadFileToSupabase(file, "images");
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

  delete args.data.district;
  delete args.data.division;
  if (!args.data.id) delete args.data.id;
  const createdReport = await supabase
    .from("reports")
    .insert({
      title: args.data.title,
      description: args.data.description,
      golocation_id: locationId ?? "",
      incident_at: args.data.incident_at,
      user_id: args.data.user_id,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),

    })
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
  const supabase = await createClient();
  const updatedReport = await supabase
    .from("reports")
    .update(args.report)
    .eq("id", args.report.id)
    .select()
    .single();
  if (updatedReport.error) throw new Error(updatedReport.error.message);
  return updatedReport.data;
}
