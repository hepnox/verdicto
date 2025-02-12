"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getImageContext } from "@/lib/ai";
import { TablesInsert } from "@/lib/database.types";
import { createReport } from "@/lib/report";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreatePostPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);

    // Get first image file for AI description
    const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length > 0) {
      try {
        setAiLoading(true);
        // Use getImageContext to get AI description
        const response = await getImageContext(imageFiles);
        let aiDescription = "";
        for await (const chunk of response) {
          aiDescription += chunk.response;
        }
        setDescription(aiDescription);
      } catch (error) {
        console.error('Error getting AI description:', error);
      } finally {
        setAiLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = Object.fromEntries(
        new FormData(e.currentTarget),
      ) as TablesInsert<"reports">;
      const fileUrls = await Promise.all(
        files.map(async (file) => {
          // Here you would implement file upload logic
          // Return the URL of the uploaded file
          return "temp-url";
        }),
      );

      //   const report = await createReport({
      //     data: formData,
      //     files: fileUrls.map((url) => ({ url })),
      //   });

      //   router.push(`/posts/${report.id}`);
    } catch (error) {
      console.error(error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Crime Report</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={aiLoading ? "Getting AI description..." : "Enter description"}
              disabled={aiLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="division">Division</Label>
              <Input id="division" name="division" required />
            </div>
            <div>
              <Label htmlFor="district">District</Label>
              <Input id="district" name="district" required />
            </div>
          </div>

          <div>
            <Label htmlFor="crimeTime">Crime Time</Label>
            <Input
              id="crimeTime"
              name="crimeTime"
              type="datetime-local"
              required
            />
          </div>

          <div>
            <Label htmlFor="files">Images/Videos</Label>
            <Input
              id="files"
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
          </div>

          <Button type="submit" disabled={loading || aiLoading}>
            {loading ? "Creating..." : "Create Post"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
