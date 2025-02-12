"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getAddressSuggestions } from "@/lib/addressAutocomplete";
import { getImageContext } from "@/lib/ai";
import { TablesInsert } from "@/lib/database.types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createReport } from "./action";

interface BarikoiPlace {
  id: number;
  longitude: number;
  latitude: number;
  address: string;
  city: string;
  area: string;
  postCode: number;
}

export default function CreatePostPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [report, setReport] = useState<TablesInsert<"reports"> | undefined>();
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [addressQuery, setAddressQuery] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<BarikoiPlace[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<BarikoiPlace | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Add Bangladesh administrative data
  const bangladeshData = {
    "Dhaka": ["Dhaka", "Gazipur", "Narayanganj", "Tangail", "Kishoreganj", "Narsingdi", "Faridpur", "Gopalganj", "Madaripur", "Manikganj", "Munshiganj", "Rajbari", "Shariatpur"],
    "Chittagong": ["Chittagong", "Cox's Bazar", "Bandarban", "Rangamati", "Khagrachari", "Feni", "Lakshmipur", "Comilla", "Noakhali", "Chandpur", "Brahmanbaria"],
    "Rajshahi": ["Rajshahi", "Natore", "Naogaon", "Chapainawabganj", "Pabna", "Bogra", "Sirajganj", "Joypurhat"],
    "Khulna": ["Khulna", "Bagerhat", "Satkhira", "Jessore", "Magura", "Jhenaidah", "Narail", "Kushtia", "Chuadanga", "Meherpur"],
    "Barisal": ["Barisal", "Bhola", "Patuakhali", "Pirojpur", "Jhalokati", "Barguna"],
    "Sylhet": ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
    "Rangpur": ["Rangpur", "Gaibandha", "Nilphamari", "Kurigram", "Lalmonirhat", "Dinajpur", "Thakurgaon", "Panchagarh"],
    "Mymensingh": ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"]
  };

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

  const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setAddressQuery(query);
    setShowSuggestions(true);

    if (query.length > 2) {
      const suggestions = await getAddressSuggestions(query, selectedDivision);
      setAddressSuggestions(suggestions);
    } else {
      setAddressSuggestions([]);
    }
  };

  const handleLocationSelect = (place: BarikoiPlace) => {
    setSelectedLocation(place);
    setAddressQuery(place.address);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = Object.fromEntries(
        new FormData(e.currentTarget),
      ) as unknown as TablesInsert<"reports">;

      if (!selectedLocation) {
        alert("Please select a valid address from suggestions");
        return;
      }

      if (!report) {
        setIsStreaming(true);

        // Create geolocation first
        const geoLocationData = {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        };

        // const uploadedImages = await Promise.all(files.map(async (file) => {
        //   const uploadedImage = await uploadFileToSupabase(file, 'images');
        //   return uploadedImage.signedUrl;
        // }));

        // Add golocation_id to formData
        const createdReport = await createReport({
          data: {
            ...formData,
          },
          location: geoLocationData,
          files: files,
        });

        setReport(createdReport.report);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsStreaming(false);
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>New Report</CardTitle>
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
              rows={20}
              required
              value={description?.trim()}
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
              <select
                id="division"
                name="division"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
              >
                <option value="">Select Division</option>
                {Object.keys(bangladeshData).map((division) => (
                  <option key={division} value={division}>
                    {division}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="district">District</Label>
              <select
                id="district"
                name="district"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                disabled={!selectedDivision}
              >
                <option value="">Select District</option>
                {selectedDivision &&
                  bangladeshData[selectedDivision as keyof typeof bangladeshData].map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="relative">
            <Label htmlFor="address">Address</Label>
            <Input 
              id="address" 
              value={addressQuery}
              onChange={handleAddressChange}
              placeholder="Search for an address"
              required 
            />
            
            {showSuggestions && !!addressSuggestions?.length && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {addressSuggestions?.map((place) => (
                  <div
                    key={place.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleLocationSelect(place)}
                  >
                    <div className="font-medium">{place.address}</div>
                    <div className="text-sm text-gray-500">
                      {place.area}, {place.city} - {place.postCode}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="crimeTime">Crime Time</Label>
            <Input
              id="crimeTime"
              name="incident_at"
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
