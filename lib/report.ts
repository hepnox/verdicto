import { Tables, TablesInsert } from "./database.types";
import { uploadFile } from "./file";
import { downloadAndCompressImage } from "./file.server";
import supabase from "./supabase";

export async function createReport(args: {
    data: TablesInsert<'reports'>,
    files: TablesInsert<'files'>[],
}) {
    const userPreferences = await supabase.from('user_preferences').select('*').eq('user_id', args.data.user_id).single();
    // Download and upload the compressed image without watermark
    const compressedImages = await Promise.all(args.files.map(async (file) => {
        const compressedImage = await downloadAndCompressImage(file.url, userPreferences.data?.watermark ?? undefined, userPreferences.data?.image_quality ?? 'low');
        const uploadedCompressedImage = await uploadFile(new File([compressedImage], file.url.split('/').pop() ?? 'image.jpg'), 'images');
        return uploadedCompressedImage.signedUrl;
    }))

    const createdFiles = await supabase.from('files').insert(compressedImages.map(image => ({url: image, user_id: args.data.user_id}))).select();
    const createdCompressedFiles = await supabase.from('files').insert(compressedImages.map(image => ({url: image, user_id: args.data.user_id,}))).select();
    if (createdFiles.error) throw new Error(createdFiles.error.message);
    const createdReport = await supabase.from('reports').insert(args.data).select().single();
    if (createdReport.error) throw new Error(createdReport.error.message);
    const reportFiles: TablesInsert<'report_files'>[] = createdFiles.data.map(file => ({
        report_id: createdReport.data.id,
        file_id: file.id,
    }));
    const createdReportFiles = await supabase.from('report_files').insert(reportFiles);
    if (createdReportFiles.error) throw new Error(createdReportFiles.error.message);
    const compressedReportFiles: TablesInsert<'report_files'>[] = createdCompressedFiles.data?.map(file => ({
        report_id: createdReport.data.id,
        file_id: file.id,
        quality: userPreferences.data?.image_quality ?? 'low',
    })) ?? [];
    const createdCompressedReportFiles = await supabase.from('report_files').insert(compressedReportFiles);
    if (createdCompressedReportFiles.error) throw new Error(createdCompressedReportFiles.error.message);
    return {
        report: createdReport.data,
        files: createdFiles.data,
    }
}

export async function updateReport(args: {
    report: Pick<Tables<'reports'>, 'id' | 'title' | 'description'>
}) {
    const updatedReport = await supabase.from('reports').update(args.report).eq('id', args.report.id).select().single();
    if (updatedReport.error) throw new Error(updatedReport.error.message);
    return updatedReport.data;
}

export async function getReports() {
    const reports = await supabase.from('reports').select('*, files(*)');
    if (reports.error) throw new Error(reports.error.message);
    return reports.data;
}