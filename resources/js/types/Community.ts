import { Topic } from "./Topic";

export interface Community {
    id: string,
    name: string,
    slug: string | null,
    description: string | null,
    avatar: string,
    banner: string | null,
    topic: Topic,
    email: string | null,
    website: string | null,
    owner: string,
    followers_count: number,
    is_followed: boolean,
    show_members: boolean,
    is_common_community: boolean,
    created_at_formatted?: string
}