import { getImageContext } from "./ai";
import { Tables, TablesInsert } from "./database.types";
import { uploadFile } from "./file";
import supabase from "./supabase";

export async function createReport(args: {
    data: TablesInsert<'reports'>,
    files: File[],
}) {

    const uploadedFiles = await Promise.all(args.files.map(async (file) => {
        const uploadedFile = await uploadFile(file, 'images');
        if (uploadedFile.uploadedFile.error) throw new Error(uploadedFile.uploadedFile.error.message);
        return uploadedFile.signedUrl.data.publicUrl;
    }));

    const createdFiles = await supabase.from('files').insert(uploadedFiles.map(url => ({url, user_id: args.data.user_id}))).select();
    if (createdFiles.error) throw new Error(createdFiles.error.message);
    const createdReport = await supabase.from('reports').insert(args.data).select().single();
    if (createdReport.error) throw new Error(createdReport.error.message);
    const reportFiles: TablesInsert<'report_files'>[] = createdFiles.data.map(file => ({
        report_id: createdReport.data.id,
        file_id: file.id,
    }));
    const createdReportFiles = await supabase.from('report_files').insert(reportFiles);
    if (createdReportFiles.error) throw new Error(createdReportFiles.error.message);

    const imageCtxStream = await getImageContext(args.files);


    return {
        report: createdReport.data,
        files: createdFiles.data,
        description: imageCtxStream,
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