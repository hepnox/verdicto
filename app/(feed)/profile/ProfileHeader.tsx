import { Tables } from "@/lib/database.types";
import { UserResponse } from "@supabase/supabase-js";
import Image from "next/image";

export default function ProfileHeader({
  profile,
}: {
  profile: Tables<"users">;
}) {
  return (
    <div className="flex items-center space-x-4">
      <Image
        src={profile.avatar_url || "/placeholder.svg"}
        alt="Profile Picture"
        width={100}
        height={100}
        className="rounded-full"
      />
      <h1 className="text-2xl font-bold">{profile.email}</h1>
    </div>
  );
}
