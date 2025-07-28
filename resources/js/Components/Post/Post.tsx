import { Post } from "@/types/Post"
import { Avatar } from "../Profile/Avatar"
import { Clock, Ellipsis, Eye, Heart } from "lucide-react"
import { Link, usePage } from "@inertiajs/react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/Components/ui/dropdown-menu"
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { PageProps } from "@/types"

export const PostItem = ({ post }: { post: Post }) => {

    const { profile } = usePage<PageProps>().props;

    const [viewCount, setViewCount] = useState(post.view_count);
    const postRef = useRef<HTMLDivElement>(null);
    const [isViewed, setIsViewed] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

    if (isDeleted) {
        return null;
    }

    useEffect(() => {
        if (!postRef.current || isViewed) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    axios.post(`/posts/${post.id}/view`)
                        .then(() => {
                            setViewCount(prev => prev + 1);
                            setIsViewed(true);
                        })
                        .catch(console.error);

                    observer.disconnect();
                }
            },
            {
                threshold: 0.75
            }
        );

        observer.observe(postRef.current);

        return () => {
            if (postRef.current) {
                observer.unobserve(postRef.current);
            }
        };
    }, [post.id, isViewed]);


    return (
        <article
            ref={postRef}
            className="bg-white rounded-xl"
            id={`post-${post.id}`}
        >
            <div className="flex items-center gap-2 p-4">
                <Avatar photo={post.owner.avatar} className="w-11 h-11" />
                {
                    post.owner_type === 'user' ?
                        <Link href={`/@${post.owner.username}`} className="font-medium text-gray-800">{post.owner.full_name}</Link>
                        :
                        <h3 className="font-medium text-gray-800">{post.owner.name}</h3>
                }
                {
                    profile?.isMyProfile &&
                    <DropdownMenu>
                        <DropdownMenuTrigger className="ml-auto mr-2"><Ellipsis /></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {/* <DropdownMenuItem>Закрепить</DropdownMenuItem>
                        <DropdownMenuItem>Архивировать</DropdownMenuItem> */}
                            <DropdownMenuItem>Удалить</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                }
            </div>
            <div className="p-4 pt-0">
                <p>{post.content}</p>
            </div>
            <div className="flex justify-between items-center gap-2 pt-0 pb-4 px-5">
                <div className="flex items-center gap-2">
                    {/* <button>
                        <Heart strokeWidth={1.5} size={18} className="text-red-600" />
                    </button> */}
                    {/* <button>
                        <Send strokeWidth={1.5} size={18} className="text-gray-600" />
                    </button> */}
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <p className="text-xs text-gray-400 mr-2">{post.created_at_formatted}</p>
                    <Eye className="h-4 w-4 text-gray-400" />
                    <p className="text-xs text-gray-400">{viewCount}</p>
                </div>
            </div>
        </article>
    )
}