import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function CrimeReports({ userId }: { userId: string }) {
  const supabase = await createClient();

  const { data: reports, error } = await supabase
    .from("reports")
    .select(
      `
      *,
      golocation:geolocations(
        latitude,
        longitude
      )
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Crime Reports</h2>
        <Link
          href="/post"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
        >
          New Report
        </Link>
      </div>
      {reports && reports.length > 0 ? (
        <ul className="space-y-4">
          {reports.map((report) => (
            <li
              key={report.id}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <Link href={`/reports/${report.id}`}>
                <h3 className="font-medium text-lg text-blue-600 hover:text-blue-800">
                  {report.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  📍 {report.golocation?.latitude.toFixed(6)},{" "}
                  {report.golocation?.longitude.toFixed(6)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  📅 {new Date(report.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                  {report.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No crime reports filed yet.</p>
          <p className="text-sm mt-2">
            Create your first report to get started!
          </p>
        </div>
      )}
    </div>
  );
}
