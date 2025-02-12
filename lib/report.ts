import { Tables, TablesInsert } from "./database.types";
import supabase from "./supabase";

export async function createReport(args: {
    data: TablesInsert<'reports'>,
    files: TablesInsert<'files'>[],
}) {


    const createdFiles = await supabase.from('files').insert(args.files).select();
    if (createdFiles.error) throw new Error(createdFiles.error.message);
    const createdReport = await supabase.from('reports').insert(args.data).select().single();
    if (createdReport.error) throw new Error(createdReport.error.message);
    const reportFiles: TablesInsert<'report_files'>[] = createdFiles.data.map(file => ({
        report_id: createdReport.data.id,
        file_id: file.id,
    }));
    const createdReportFiles = await supabase.from('report_files').insert(reportFiles);
    if (createdReportFiles.error) throw new Error(createdReportFiles.error.message);
    return createdReport.data;
}

export async function updateReport(args: {
    report: Pick<Tables<'reports'>, 'id' | 'title' | 'description'>
}) {
    const updatedReport = await supabase.from('reports').update(args.report).eq('id', args.report.id).select().single();
    if (updatedReport.error) throw new Error(updatedReport.error.message);
    return updatedReport.data;
}