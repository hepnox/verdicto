import { Tables } from "@/lib/database.types";

export default function ProfileDetails({
  profile,
}: {
  profile: Tables<"users">;
}) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full">
      <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-500">Full Name</label>
            <p className="font-medium">{profile.full_name}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="font-medium">{profile.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Contact</label>
            <p className="font-medium">{profile.phone || "Not provided"}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-500">Status</label>
            <p className="font-medium">{profile.status || "No status set"}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Member Since</label>
            <p className="font-medium">
              {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Account Type</label>
            <p className="font-medium capitalize">{profile.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
