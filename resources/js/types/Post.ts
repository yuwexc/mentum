import { Community } from "./Community";
import { User } from "./User";

interface UserPost {
    id: string,
    content: string,
    owner: User,
    owner_type: 'user',
    view_count: number
    created_at: string,
    created_at_formatted: string
}

interface CommunityPost {
    id: string,
    content: string,
    owner: Community,
    owner_type: 'community',
    view_count: number
    created_at: string,
    created_at_formatted: string
}

export type Post = UserPost | CommunityPost;