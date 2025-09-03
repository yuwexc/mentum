import { CommentInterface } from "@/types/Comment"
import { Avatar } from "../Profile/Avatar"
import { Heart } from "lucide-react"
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export const Comment = ({ comment }: { comment: CommentInterface }) => {

    const [isLiked, setIsLiked] = useState<boolean>(comment.is_liked);
    const [likeCount, setlikeCount] = useState<string>(comment.like_count);

    const handleLike = async () => {

        try {
            const response = await axios.post(`/comment/${comment.id}/like`);
            setIsLiked(response.data.is_liked);
            setlikeCount(response.data.like_count);

        } catch {
            toast.error('Ошибка. Действие недоступно');
        }
    }

    return (
        <div className="flex items-start gap-2">
            <Avatar photo={comment.author.avatar} className="min-h-8 min-w-8 mr-0" />
            <div className="w-full">
                <p className="text-sm font-medium">{comment.author.full_name}</p>
                <p className="text-sm">{comment.content}</p>
                <div className="flex items-center gap-1 mt-1">
                    <p className="text-xs text-gray-400">{comment.created_at}</p>
                    <button onClick={handleLike} className="ml-auto">
                        <Heart strokeWidth={1.5} size={14} className="text-red-600"
                            fill={isLiked ? "#dc2626" : 'none'} />
                    </button>
                    <p className="text-xs text-gray-400">{likeCount}</p>
                </div>
            </div>
        </div>
    )
}