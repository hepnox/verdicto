"use client";
import { Tables } from "@/lib/database.types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile } from "./action";
import { useRouter } from "next/navigation";
import { uploadFile } from "@/lib/file.client";

export default function EditProfile({
  profile,
  onClose,
}: {
  profile: Tables<"users">;
  onClose: () => void;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: profile.full_name,
    phone: profile.phone,
    status: profile.status || "",
  });
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatarUrl;
      if (image) {
        // Validate image type
        if (!image.type.startsWith("image/")) {
          throw new Error("Please upload a valid image file");
        }

        const { signedUrl } = await uploadFile(image, "images", "original");
        avatarUrl = signedUrl;
      }

      const result = await updateProfile({
        id: profile.id,
        ...formData,
        avatarUrl,
      });

      if (!result.success) {
        throw new Error("Failed to update profile");
      }

      onClose();
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
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
