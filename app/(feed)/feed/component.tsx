"use client";

import Image from "next/image";
import { format } from "date-fns";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  MapPin,
  Clock,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
} from "lucide-react";

interface PostCardProps {
  title: string;
  description: string;
  locations: string[];
  images: string[];
  video?: string;
  postTime: Date;
  crimeTime: Date;
  isVerified: boolean;
  width?: "sm" | "md" | "lg" | "xl" | "full";
}

export function PostCard({
  title,
  description,
  locations,
  images,
  video,
  postTime,
  crimeTime,
  isVerified,
  width = "md",
}: PostCardProps) {
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState("");

  const widthClasses = {
    sm: "w-full max-w-sm",
    md: "w-full max-w-md",
    lg: "w-full max-w-lg",
    xl: "w-full max-w-xl",
    full: "w-full",
  };

  const handleUpvote = () => setUpvotes((prev) => prev + 1);
  const handleDownvote = () => setDownvotes((prev) => prev + 1);
  const toggleCommentInput = () => setShowCommentInput((prev) => !prev);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the comment to your backend
    console.log("Comment submitted:", comment);
    setComment("");
    setShowCommentInput(false);
  };

  return (
    <Card className={`${widthClasses[width]} mx-auto shadow-md`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          {isVerified && (
            <Badge variant="secondary" className="ml-2">
              <CheckCircle className="w-4 h-4 mr-1" />
              Verified
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video">
          {video ? (
            <video
              src={video}
              controls
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <Image
              src={images[0] || "/placeholder.svg"}
              alt={title}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          )}
        </div>
        {images.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto py-2">
            {images.slice(1).map((image, index) => (
              <Image
                key={index}
                src={image || "/placeholder.svg"}
                alt={`Additional image ${index + 1}`}
                width={100}
                height={100}
                objectFit="cover"
                className="rounded-md"
              />
            ))}
          </div>
        )}
        <p className="text-sm text-gray-600">{description}</p>
        <div className="flex flex-wrap gap-2">
          {locations.map((location, index) => (
            <Badge key={index} variant="outline" className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {location}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="flex justify-between text-sm text-gray-500 w-full">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>Posted: {format(postTime, "PPp")}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>Crime: {format(crimeTime, "PPp")}</span>
          </div>
        </div>
        <div className="flex justify-between w-full">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleUpvote}>
              <ThumbsUp className="w-4 h-4 mr-1" />
              {upvotes}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownvote}>
              <ThumbsDown className="w-4 h-4 mr-1" />
              {downvotes}
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={toggleCommentInput}>
            <MessageSquare className="w-4 h-4 mr-1" />
            Comment
          </Button>
        </div>
        {showCommentInput && (
          <form onSubmit={handleCommentSubmit} className="w-full space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <Input type="file" id="file-upload" className="w-1/2" />
              <Button type="submit">Post Comment</Button>
            </div>
          </form>
        )}
      </CardFooter>
    </Card>
  );
}
