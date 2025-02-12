import { PostCard } from "./component";

const mockPosts = [
  {
    id: 1,
    title: "Suspicious Activity in Central Park",
    description:
      "Multiple individuals observed behaving suspiciously near the fountain.",
    locations: ["Central Park", "New York City"],
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=100&width=100",
    ],
    postTime: new Date(),
    crimeTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isVerified: true,
  },
  {
    id: 2,
    title: "Vandalism at Local School",
    description:
      "Graffiti found on the walls of Springfield Elementary School.",
    locations: ["Springfield Elementary", "Springfield"],
    images: ["/placeholder.svg?height=300&width=400"],
    video: "/placeholder.mp4",
    postTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    crimeTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isVerified: false,
  },
  {
    id: 3,
    title: "Shoplifting Incident at Downtown Mall",
    description:
      "Security footage shows a suspect shoplifting from a clothing store.",
    locations: ["Downtown Mall", "Metropolis"],
    images: ["/placeholder.svg?height=300&width=400"],
    postTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    crimeTime: new Date(
      Date.now() - 3 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000,
    ), // 3 days and 2 hours ago
    isVerified: true,
  },
];

export default function CrimeFeed() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="space-y-6">
        {mockPosts.map((post) => (
          <PostCard key={post.id} {...post} width="full" />
        ))}
      </div>
    </div>
  );
}
