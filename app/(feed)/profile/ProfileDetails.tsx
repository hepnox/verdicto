import { Tables } from "@/lib/database.types";

export default function ProfileDetails({
  profile,
}: {
  profile: Tables<"users">;
}) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
      <div className="space-y-2">
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Status:</strong> {profile.status || "No bio provided"}
        </p>
        <p>
          <strong>Contact:</strong>{" "}
          {profile.phone || "No contact information provided"}
        </p>
      </div>
    </div>
  );
}
