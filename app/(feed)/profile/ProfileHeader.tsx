"use client";
import { Tables } from "@/lib/database.types";
import Image from "next/image";
import { useState } from "react";
import EditProfile from "./EditProfile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ProfileHeader({
  profile,
}: {
  profile: Tables<"users">;
}) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Image
              src={profile.avatar_url || "/placeholder.svg"}
              alt="Profile Picture"
              width={120}
              height={120}
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile.full_name}</h1>
            <p className="text-gray-600">{profile.email}</p>
            {profile.status && (
              <p className="text-gray-500 mt-2 max-w-md">{profile.status}</p>
            )}
          </div>
        </div>
        <Button onClick={() => setIsEditing(true)} variant="default">
          Edit Profile
        </Button>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <EditProfile profile={profile} onClose={() => setIsEditing(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
