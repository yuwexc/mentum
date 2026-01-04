import { CommentInterface } from "./Comment";

interface UserPost {
    id: string,
    content: string,
    owner: {
        id: string,
        avatar: string,
        username: string,
        full_name: string
    },
    owner_type: 'user',
    view_count: string
    created_at: string

    comments: {
        data: CommentInterface[],
        hasMore: boolean
    },

    like_count: string,
    is_liked: boolean,
}

interface CommunityPost {
    id: string,
    content: string,
    owner: {
        id: string,
        avatar: string,
        name: string
    },
    owner_type: 'community',
    view_count: string
    created_at: string,
    created_at_formatted: string,

    comments: {
        data: CommentInterface[],
        hasMore: boolean
    },

    like_count: string,
    is_liked: boolean,
}

export type Post = UserPost | CommunityPost;