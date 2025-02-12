import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProfileHeader from "./ProfileHeader";
import ProfileDetails from "./ProfileDetails";
import CrimeReports from "./CrimeReports";
import { createClient } from "@/lib/supabase/server";
import { Tables } from "@/lib/database.types";

export default async function ProfilePage() {
  const supabase = await createClient();
  const authUser = await supabase.auth.getUser();

  if (!authUser.data.user) {
    redirect("/auuth/login");
  }

  const profile = (
    await supabase
      .from("users")
      .select()
      .eq("id", authUser.data.user?.id)
      .single()
  ).data;

  if (!profile) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader profile={profile} />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <ProfileDetails profile={profile} />
        </div>
        <div>
          <CrimeReports userId={profile.id} />
        </div>
      </div>
    </div>
  );
}
