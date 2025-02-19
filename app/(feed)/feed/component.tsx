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
import emergencyContacts from "../../../lib/emergency.json";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  MapPin,
  Clock,
  CircleArrowUp,
  CircleArrowDown,
  MessageSquare,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { toggleReaction, addComment, getCrimeReports } from "../action";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tables } from "@/lib/database.types";
import { useAuth } from "@/hooks/use-auth";
import { processTitle } from "@/helpers/text";

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
  const isAnonymousPost = post.title.startsWith("__anon__:");

  const [isLoading, setIsLoading] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState("");
  const [localReactions, setLocalReactions] = useState(reactions);
  const queryClient = useQueryClient();

  useEffect(() => {
    setLocalReactions(reactions);
  }, [reactions]);

  const handleUpvote = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const result = await toggleReaction(post.id, userId, "upvote");
      if (result.success) {
        setLocalReactions((current) =>
          current
            .filter((r) => r.user_id !== userId)
            .concat(
              result.userReaction
                ? [{ type: result.userReaction, user_id: userId }]
                : [],
            ),
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownvote = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const result = await toggleReaction(post.id, userId, "downvote");
      if (result.success) {
        setLocalReactions((current) =>
          current
            .filter((r) => r.user_id !== userId)
            .concat(
              result.userReaction
                ? [{ type: result.userReaction, user_id: userId }]
                : [],
            ),
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCommentInput = () => setShowCommentInput((prev) => !prev);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await addComment(post.id, userId, comment);
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      setComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const upvotes = localReactions.filter((r) => r.type === "upvote").length;
  const downvotes = localReactions.filter((r) => r.type === "downvote").length;
  const userReaction = localReactions.find((r) => r.user_id === userId)?.type;

  const score = getTruthyScore(post.description);

  return (
    <Card className="w-full mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{processTitle(post.title)}</span>
          {upvotes > 2 && upvotes > downvotes && (
            <Badge className="ml-2 py-2 px-3 text-base bg-green-100 text-green-800">
              <CheckCircle className="size-5 mr-1" />
              Verified
            </Badge>
          )}
          {score === null ? null : score > 7 ? (
            <div className="flex justify-center bg-green-100 rounded-full p-2">
              <CheckCircle color="green" className="size-5" />
            </div>
          ) : score > 4 ? (
            <div className="flex justify-center bg-yellow-100 rounded-full p-2">
              <AlertTriangle color="orange" className="size-5" />
            </div>
          ) : score >= 0 ? (
            <div className="flex justify-center bg-red-100 rounded-full p-2">
              <AlertTriangle color="red" className="size-5" />
            </div>
          ) : null}
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
        {post.geolocations?.latitude && post.geolocations?.longitude && (
          <div className="w-full h-48 relative rounded-md overflow-hidden">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=[API_KEY]&q=${post.geolocations.latitude},${post.geolocations.longitude}`}
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="flex justify-between text-sm text-gray-500 w-full">
          <div className="flex flex-col">
            <span className="font-medium text-black">
              {isAnonymousPost
                ? "Anonymous"
                : post.users?.full_name || "Anonymous"}
            </span>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>Posted: {format(new Date(post.created_at), "PPp")}</span>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>Incident: {format(new Date(post.incident_at), "PPp")}</span>
          </div>
        </div>
        <div className="flex justify-between w-full">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUpvote}
              disabled={isLoading}
              className={userReaction === "upvote" ? "bg-green-100" : ""}
            >
              <CircleArrowUp className="w-4 h-4 mr-1" />
              {upvotes}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownvote}
              disabled={isLoading}
              className={userReaction === "downvote" ? "bg-red-100" : ""}
            >
              <CircleArrowDown className="w-4 h-4 mr-1" />
              {downvotes}
            </Button>
            <ContactList content={post.description} />
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
              required
              minLength={1}
              maxLength={500}
            />
            <div className="flex justify-end items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCommentInput(false);
                  setComment("");
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!comment.trim()}>
                Post Comment
              </Button>
            </div>
          </form>
        )}
        <div className="space-y-4 w-full">
          {post.report_comments?.map((comment) => (
            <div key={comment.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium">
                  {comment?.users?.full_name || "Anonymous User"}
                </p>
                <span className="text-xs text-gray-500">
                  {format(new Date(comment.created_at), "PPp")}
                </span>
              </div>
              <p className="text-sm text-gray-600">{comment.content}</p>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}

export function CrimesFeed() {
  const { user } = useAuth();

  const reportsQuery = useQuery({
    queryKey: ["reports"],
    queryFn: getCrimeReports,
    staleTime: 1000 * 60, // 1 minute
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
          userId={user?.id ?? ""} // Use the current user's ID
        />
      ))}
    </div>
  );
}

const ContactList = (props: { content: string }) => {
  try {
    // Handle empty/invalid content
    if (!props.content || typeof props.content !== "string") {
      console.warn("Invalid content provided to BadgeRender");
      return null;
    }

    const matches = Object.keys(emergencyContacts);
    if (!matches || matches.length === 0) {
      console.warn("No emergency contacts found");
      return null;
    }

    const find = matches.find((match) => {
      try {
        return props.content.toLowerCase().includes(match.toLowerCase());
      } catch (e) {
        console.error("Error matching content:", e);
        return false;
      }
    });

    // Handle no matches found
    if (!find) {
      return null;
    }

    const list = emergencyContacts[find as keyof typeof emergencyContacts];

    // Handle invalid or empty list
    if (!list || !Array.isArray(list) || list.length === 0) {
      return null;
    }

    return (
      <select
        className="w-full p-2 text-sm border rounded-md"
        onChange={(e) => {
          if (e.target.value) {
            window.location.href = `tel:${e.target.value}`;
          }
        }}
      >
        <option value="" disabled selected>
          Select {find.toLocaleLowerCase()} contact
        </option>
        {list.map((match, index) => {
          // Handle invalid match objects
          if (!match || !match.district || !match.phone) {
            console.warn(`Invalid contact data at index ${index}`);
            return null;
          }

          return (
            <option key={index} value={match.phone}>
              {match.district}: {match.phone}
            </option>
          );
        })}
      </select>
    );
  } catch (error) {
    console.error("Error in BadgeRender:", error);
    return null;
  }
};

function getTruthyScore(description: string) {
  const lastLine = description.split("\n").pop();
  if (!lastLine) return null;

  const onlyNumbers = lastLine.replace(/[^0-9]/g, "");
  const firstNumber = onlyNumbers.charAt(0);
  if (!firstNumber) return null;

  const number = parseInt(firstNumber);
  if (isNaN(number)) return null;

  return number;
}
