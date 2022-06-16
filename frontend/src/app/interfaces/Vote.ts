export interface Vote {
  id?: number;
  createdAt: string;
  post_id: number;
  status: number;
  type: "upvote" | "downvote";
  user_id: number;
}
