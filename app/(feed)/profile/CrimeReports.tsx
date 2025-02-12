import { createClient } from "@/lib/supabase/server";

export default async function CrimeReports({ userId }: { userId: string }) {
  const supabase = await createClient();

  const { data: reports, error } = await supabase
    .from("reports")
    .select()
    .eq("user_id", userId);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Crime Reports</h2>
      {reports && reports.length > 0 ? (
        <ul className="space-y-4">
          {reports.map((report) => (
            <li key={report.id} className="border-b pb-2">
              <h3 className="font-medium">{report.title}</h3>
              <p className="text-sm text-gray-600">{report.golocation_id}</p>
              <p className="text-sm text-gray-600">
                {new Date(report.created_at).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No crime reports filed yet.</p>
      )}
    </div>
  );
}
