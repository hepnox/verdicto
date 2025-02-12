import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CrimeReports from "./CrimeReports";
import ProfileDetails from "./ProfileDetails";
import ProfileHeader from "./ProfileHeader";

export default async function ProfilePage() {
  const supabase = await createClient();
  const authUser = await supabase.auth.getUser();

  if (!authUser.data.user) {
    redirect("/auth/login");
  }

  const profile = (
    await supabase
      .from("users")
      .select()
      .eq("id", authUser.data.user?.id)
      .single()
  ).data;

  if (!profile) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <ProfileHeader profile={profile} />
        <ProfileDetails profile={profile} />
        <CrimeReports userId={profile.id} />
      </div>
    </div>
  );
}
