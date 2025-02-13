'use server';
import { createClient } from "@/lib/supabase/server";

interface ReportWithUser {
    user_id: string;
    users: {
        email: string;
        full_name: string;
    };
}

export async function getLeaderboardData() {
    const supabase = await createClient();
    
    // Fetch all reports with their user information
    const { data: reports, error } = await supabase
        .from('reports')
        .select(`
            user_id,
            users!inner (
                email,
                full_name
            )
        `);

    if (error) {
        console.error('Error fetching leaderboard data:', error);
        return [];
    }

    // Group reports by user and count them
    const userReportCounts = reports.reduce((acc: { [key: string]: any }, report: ReportWithUser) => {
        const userId = report.user_id;
        
        if (!acc[userId]) {
            acc[userId] = {
                user_id: userId,
                email: report.users.email,
                full_name: report.users.full_name,
                report_count: 0
            };
        }
        
        acc[userId].report_count++;
        return acc;
    }, {});

    // Convert to array and sort by report count
    return Object.values(userReportCounts);
}