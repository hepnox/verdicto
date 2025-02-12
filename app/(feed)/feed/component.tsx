"use client";

import Image from "next/image";
import { format } from "date-fns";
import { useState, useEffect } from "react";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tables } from "@/lib/database.types";

type ReactionState = {
  upvotes: number;
  downvotes: number;
  userReaction: "upvote" | "downvote" | undefined;
};

export function PostCard({
  post,
  reactions,
  userId,
}: {
  post: Awaited<ReturnType<Awaited<typeof getCrimeReports>>>[number];
  reactions: Array<{ type: "upvote" | "downvote"; user_id: string }>;
  userId: string;
}) {
  const queryClient = useQueryClient();
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState("");
  const [reactionState, setReactionState] = useState<ReactionState>({
    upvotes: reactions.filter((r) => r.type === "upvote").length,
    downvotes: reactions.filter((r) => r.type === "downvote").length,
    userReaction: reactions.find((r) => r.user_id === userId)?.type,
  });

  // Update local state when reactions prop changes
  useEffect(() => {
    setReactionState({
      upvotes: reactions.filter((r) => r.type === "upvote").length,
      downvotes: reactions.filter((r) => r.type === "downvote").length,
      userReaction: reactions.find((r) => r.user_id === userId)?.type,
    });
  }, [reactions, userId]);

  const handleUpvote = async () => {
    const result = await toggleReaction(post.id, userId, "upvote");
    if (result.success) {
      setReactionState({
        upvotes: result.upvotes,
        downvotes: result.downvotes,
        userReaction: result.userReaction,
      });
      // Invalidate the query to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    }
  };

  const handleDownvote = async () => {
    const result = await toggleReaction(post.id, userId, "downvote");
    if (result.success) {
      setReactionState({
        upvotes: result.upvotes,
        downvotes: result.downvotes,
        userReaction: result.userReaction,
      });
      // Invalidate the query to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    }
  };

  const toggleCommentInput = () => setShowCommentInput((prev) => !prev);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addComment(post.id, userId, comment);
    setComment("");
    setShowCommentInput(false);
  };

  return (
    <Card className="w-full mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{post.title}</span>
          {post.verified && (
            <Badge variant="secondary" className="ml-2">
              <CheckCircle className="w-4 h-4 mr-1" />
              Verified
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video">
          {post.report_files[0]?.files ? (
            <Image
              src={post.report_files[0]?.files?.url}
              alt={post.title}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          ) : (
            <Image
              src="/placeholder.svg"
              alt="Placeholder"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          )}
        </div>

        <p className="text-sm text-gray-600">{post.description}</p>
        {post.golocation_id && (
          <Badge variant="outline" className="flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {post.golocation_id}
          </Badge>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="flex justify-between text-sm text-gray-500 w-full">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>Posted: {format(new Date(post.created_at), "PPp")}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>Incident: {format(new Date(post.incident_at), "PPp")}</span>
          </div>
        </div>
        <div className="flex justify-between w-full">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUpvote}
              className={
                reactionState.userReaction === "upvote" ? "bg-green-100" : ""
              }
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              {reactionState.upvotes}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownvote}
              className={
                reactionState.userReaction === "downvote" ? "bg-red-100" : ""
              }
            >
              <ThumbsDown className="w-4 h-4 mr-1" />
              {reactionState.downvotes}
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

export function CrimesFeed() {
  const reportsQuery = useQuery({
    queryKey: ["reports"],
    queryFn: getCrimeReports,
    staleTime: 0, // Always fetch fresh data
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });

  if (reportsQuery.isLoading) return <div>Loading...</div>;
  if (reportsQuery.isError)
    return <div>Error: {reportsQuery.error.message}</div>;

  const reports = reportsQuery.data;

  if (!reports || reports.length === 0) {
    return <div>No reports found</div>;
  }

  return (
    <div className="space-y-6">
      {reports.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          reactions={post.report_reactions}
          userId={post.user_id ?? ""}
        />
      ))}
    </div>
  );
}
