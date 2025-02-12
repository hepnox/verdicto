"use client";

import { useState } from "react";
import { uploadFile } from "@/lib/file";

export default function CrimesPage() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setUploading(true);
    setError(null);

    try {
      const file = e.target.files[0];
      const { data, error } = await uploadFile(file, "images");

      if (error) throw error;
      console.log("Upload successful:", data.publicUrl);
    } catch (err) {
      setError("Failed to upload file");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-semibold mb-6">Recent Crime Reports</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Evidence
        </label>
        <input
          type="file"
          onChange={handleFileUpload}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {uploading && (
          <p className="mt-2 text-sm text-gray-500">Uploading...</p>
        )}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="grid gap-6">
        {/* Crime reports will be listed here */}
        <p className="text-gray-500">No crime reports yet.</p>
      </div>
    </div>
  );
}
