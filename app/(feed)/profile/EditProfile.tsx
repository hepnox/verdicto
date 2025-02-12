"use client";
import { Tables } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function EditProfile({
  profile,
  onClose,
}: {
  profile: Tables<"users">;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    full_name: profile.full_name,
    phone: profile.phone,
    status: profile.status || "",
  });
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatar_url = profile.avatar_url;

      if (image) {
        const fileExt = image.name.split(".").pop();
        const fileName = `${profile.id}.${fileExt}`;

        await supabase.storage
          .from("avatars")
          .upload(fileName, image, { upsert: true });

        avatar_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${fileName}`;
      }

      await supabase
        .from("users")
        .update({
          ...formData,
          avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="avatar">Profile Picture</Label>
        <Input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          value={formData.full_name}
          onChange={(e) =>
            setFormData({ ...formData, full_name: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </div>

      {/* <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          rows={3}
        />
      </div> */}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
