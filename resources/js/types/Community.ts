import { Topic } from "./Topic";

export interface Community {
    id: string,
    name: string,
    slug: string | null,
    description: string | null,
    avatar: string,
    banner: string | null,
    topic: Topic,
    owner: string,
    followers_count: number,
    is_followed: boolean,
    created_at_formatted?: string
}