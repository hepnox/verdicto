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
import { toggleReaction, addComment, getCrimeReports } from "../action";
import { useQuery } from "@tanstack/react-query";

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
  id: string;
  userId: string;
  reactions?: Array<{
    type: 'upvote' | 'downvote';
    user_id: string;
  }>;
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
  id,
  userId,
  reactions = [],
}: PostCardProps) {
  const upvotes = reactions.filter(r => r.type === 'upvote').length;
  const downvotes = reactions.filter(r => r.type === 'downvote').length;
  const userReaction = reactions.find(r => r.user_id === userId)?.type;
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState("");

  const widthClasses = {
    sm: "w-full max-w-sm",
    md: "w-full max-w-md",
    lg: "w-full max-w-lg",
    xl: "w-full max-w-xl",
    full: "w-full",
  };

  const handleUpvote = async () => {
    await toggleReaction(id, userId, 'upvote');
  };

  const handleDownvote = async () => {
    await toggleReaction(id, userId, 'downvote');
  };

  const toggleCommentInput = () => setShowCommentInput((prev) => !prev);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addComment(id, userId, comment);
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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleUpvote}
              className={userReaction === 'upvote' ? 'bg-green-100' : ''}
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              {upvotes}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownvote}
              className={userReaction === 'downvote' ? 'bg-red-100' : ''}
            >
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


export  function Crimes() {
    const reportsQuery = useQuery({
      queryKey: ['reports'],
      queryFn: getCrimeReports
  })
  
  if (reportsQuery.isLoading) return <div>Loading...</div>
  if (reportsQuery.isError) return <div>Error: {reportsQuery.error.message}</div>
  
  const reports = reportsQuery.data;
  console.log(reports);
    return (
 
        <div className="space-y-6">
          {reports?.map((post) => (
            <PostCard key={post.id} {...post} width="full" />
          ))}
        </div>

    );
  }