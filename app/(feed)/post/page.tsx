"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getImageContext } from "@/lib/ai";
import { TablesInsert } from "@/lib/database.types";
import { uploadFile } from "@/lib/file";
import { createReport } from "@/lib/report";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreatePostPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [report, setReport] = useState<TablesInsert<"reports"> | undefined>();
  const [isStreaming, setIsStreaming] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);

    // Get first image file for AI description
    const imageFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/"),
    );
    if (imageFiles.length > 0) {
      try {
        setAiLoading(true);
        // Use getImageContext to get AI description
        const response = await getImageContext(imageFiles);
        // let aiDescription = "";
        // for await (const chunk of response) {
        //   aiDescription += chunk.response;
        // }
        // setDescription(aiDescription);



        if (response) {
          const reader = response.getReader();
          const decoder = new TextDecoder();
      
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              const chunk = decoder.decode(value);
              // Split by newlines since each JSON object is separated by \n
              const jsonStrings = chunk.split('\n');
              
              for (const jsonString of jsonStrings) {
                if (jsonString.trim()) {  // Only parse non-empty strings
                  try {
                    const json = JSON.parse(jsonString);
                    const chunkRes = json.response;
                    if (chunkRes) {
                      setDescription((prev) => prev + chunkRes);
                    }
                  } catch (error) {
                    console.error("Error parsing chunk:", error);
                  }
                }
              }
            }
          } catch (error) {
            console.error('Streaming error:', error);
            throw error;
          } finally {
            reader.releaseLock();
          }
        }

        setAiLoading(false);



      } catch (error) {
        console.error("Error getting AI description:", error);
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

      if (!report) {
        setIsStreaming(true);

        const uploadedImages = await Promise.all(files.map(async (file) => {
          const uploadedImage = await uploadFile(file, 'images');
          return uploadedImage.signedUrl;
        }));
       const createdReport = await createReport({
          data: formData,
          files: uploadedImages.map(image => ({url: image, user_id: formData.user_id})),
        });

        setReport(createdReport.report);
        // router.push(`/posts/${createdReport.report.id}`);
      }
    } catch (error) {
      console.error(error);
      // Handle error appropriately
    } finally {
      setIsStreaming(false);
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
          <input
            type="hidden"
            name="user_id"
            value={"622593a9-5df6-4007-a73f-7baa821b06cb"}
          />
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
              placeholder={
                aiLoading ? "Getting AI description..." : "Enter description"
              }
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
