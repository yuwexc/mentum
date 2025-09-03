import { Post } from "@/types/Post"
import { Avatar } from "../Profile/Avatar"
import { Clock, Ellipsis, Eye, Heart } from "lucide-react"
import { Link, usePage } from "@inertiajs/react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/Components/ui/dropdown-menu"
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { PageProps } from "@/types"
import { toast } from "sonner"
import { Comment } from "./Comment"
import { CreateCommentComponent } from "./CreateCommentComponent"
import { CommentInterface } from "@/types/Comment"

export const PostItem = ({ post, setPostItems, current_user_is_owner }:
    {
        post: Post,
        setPostItems: React.Dispatch<React.SetStateAction<Post[]>>,
        current_user_is_owner: boolean
    }) => {

    const { auth } = usePage<PageProps>().props;

    const [comments, setComments] = useState<CommentInterface[]>(post.comments.data);
    const [hasMore, setHasMore] = useState(post.comments.hasMore);
    const [nextPage, setNextPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const [viewCount, setViewCount] = useState<string>(post.view_count);
    const postRef = useRef<HTMLDivElement>(null);
    const [isViewed, setIsViewed] = useState(false);

    const [isLiked, setIsLiked] = useState<boolean>(post.is_liked);
    const [likeCount, setlikeCount] = useState<string>(post.like_count);

    useEffect(() => {
        if (!postRef.current || isViewed) return;

        const observer = new IntersectionObserver(
            async ([entry]) => {
                if (entry.isIntersecting) {
                    try {
                        const response = await axios.post(`/posts/${post.id}/view`);

                        setViewCount(response.data.view_count);
                        setIsViewed(true);

                    } catch (error) {
                        console.error(error);
                    }

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

    const handleDelete = async () => {

        try {
            await axios.delete(`/posts/${post.id}`);
            setPostItems(prevState => prevState.filter(item => item.id !== post.id));
            toast.success('Пост удален');

        } catch {
            toast.error('Ошибка. Действие недоступно');
        }
    }

    const handleArchive = async () => {

        try {
            await axios.post(`/posts/${post.id}/archive`);
            setPostItems(prevState => prevState.filter(item => item.id !== post.id));
            toast.success('Пост перенсён в архив');

        } catch {
            toast.error('Ошибка. Действие недоступно');
        }
    }

    const fetchMoreData = async () => {
        if (!hasMore || loading) return;

        setLoading(true);

        try {
            const response = await axios.get(`/posts/${post.id}/comment`, {
                params: {
                    page: nextPage
                }
            });

            const newComments = response.data.comments.filter(
                (newComment: CommentInterface) => !comments.some(comment => comment.id === newComment.id)
            );

            setComments(prev => [...prev, ...newComments]);
            setHasMore(response.data.hasMore);
            setNextPage(prev => prev + 1);

        } catch {
            toast.error('Ошибка загрузки. Попробуйте позже');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {

        try {
            const response = await axios.post(`/posts/${post.id}/like`);
            setIsLiked(response.data.is_liked);
            setlikeCount(response.data.like_count);

        } catch {
            toast.error('Ошибка. Действие недоступно');
        }
    }

    return (
        <article
            ref={postRef}
            className="overflow-hidden bg-white rounded-xl"
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
                    current_user_is_owner &&
                    <DropdownMenu>
                        <DropdownMenuTrigger className="ml-auto mr-2"><Ellipsis /></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {/* <DropdownMenuItem>Закрепить</DropdownMenuItem> */}
                            <DropdownMenuItem onClick={handleArchive}>Архивировать</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDelete}>Удалить</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                }
            </div>
            <div className="p-4 pt-0">
                <p>{post.content}</p>
            </div>
            <div className="flex justify-between items-center gap-2 pt-0 pb-4 px-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <button onClick={handleLike}>
                        <Heart strokeWidth={1.5} className="h-4 w-4 text-red-600"
                            fill={isLiked ? "#dc2626" : 'none'} />
                    </button>
                    <p className="text-xs text-gray-400">{likeCount}</p>
                    {/* <button>
                        <Send strokeWidth={1.5} size={18} className="text-gray-600" />
                    </button> */}
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <p className="text-xs text-gray-400 mr-2">{post.created_at}</p>
                    <Eye className="h-4 w-4 text-gray-400" />
                    <p className="text-xs text-gray-400">{viewCount}</p>
                </div>
            </div>
            {
                comments.length > 0 &&
                <>
                    <div className="bg-indigo-50 flex flex-col gap-3 rounded-lg m-2 p-2">
                        {
                            comments.map(comment =>
                                <Comment comment={comment} key={comment.id} />
                            )
                        }
                    </div>
                    {
                        loading && <div className="flex justify-center py-8 mb-16">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-400"></div>
                        </div>
                    }
                    {
                        hasMore && <button disabled={loading} onClick={fetchMoreData} className="ml-4 text-indigo-500 underline font-medium text-sm">
                            Показать комментарии
                        </button>
                    }
                </>
            }
            <div className="border-t border-gray-100 m-2 mb-0 p-2">
                <CreateCommentComponent setComments={setComments} post={post} owner={auth.user.id} owner_type={'post'} />
            </div>
        </article>
    )
}