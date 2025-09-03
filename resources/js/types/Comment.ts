export interface CommentInterface {
    id: string,
    author: {
        id: string,
        avatar: string,
        username: string,
        full_name: string
    },
    like_count: string,
    is_liked: boolean,
    content: string,
    created_at: string
}