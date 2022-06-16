import { Vote } from "./Vote";

export interface Post {
    id?: number;
    title: string;
    type?: string;
    content: string;
    isActive?: number;
    createdAt?: any;
    channelId?: number;
    user?: { name?: string };
    votes?: Vote[];
}
