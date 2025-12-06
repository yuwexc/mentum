import { Community } from "@/types/Community"
import { UsersRound } from "lucide-react"
import { Avatar } from "../../Components/Profile/Avatar"
import { Link, usePage } from "@inertiajs/react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/Components/ui/dialog"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import axios from "axios"
import { PageProps } from "@/types"

export const Following = ({ followings, className }: { followings: { list: Community[], hasMore: boolean }, className?: string }) => {

    const { profile } = usePage<PageProps>().props;

    if (!profile) {
        return null;
    }

    const [communities, setCommunities] = useState<Community[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [nextPage, setNextPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchMoreData = async () => {
        if (!hasMore || loading) return;

        setLoading(true);

        try {
            const response = await axios.get(`/@${profile.user.username}/following`, {
                params: { page: nextPage },
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });

            setCommunities(response.data.communities);
            setHasMore(response.data.hasMore);
            setNextPage(nextPage + 1);

        } catch {
            toast.error('Ошибка загрузки. Попробуйте позже');
        } finally {
            setLoading(false);
        }
    };

    const [isOpened, setIsOpened] = useState<boolean>(false);

    useEffect(() => {
        if (isOpened) {
            fetchMoreData();
        }
    }, [isOpened]);

    return (
        <article className={"w-full bg-white rounded-xl max-[920px]:p-4 " + className}>
            <div className="flex items-center gap-3 pl-6 p-4 border-b border-gray-100 max-[920px]:p-0 max-[920px]:border-0">
                <UsersRound className="w-4 h-4 text-indigo-500" />
                <h3 className="font-medium text-gray-800">Подписки</h3>
            </div>
            <div className="flex flex-col max-[920px]:flex-row max-[920px]:flex-wrap items-stretch gap-4 p-4">
                {
                    followings.list.length == 0 && <p className="text-sm text-gray-500">Подписок нет</p>
                }
                {
                    followings.list.map((community, index) =>
                        <Link href={route('community.show', {
                            community: community.slug || community.id
                        })} key={index} className="flex items-center gap-2">
                            <Avatar photo={community.avatar} className="min-h-11 min-w-11" />
                            <div className="w-full flex items-center justify-between overflow-hidden">
                                <div className="flex flex-col">
                                    <p className="w-fit text-sm truncate">{community.name}</p>
                                    {community.is_common_community && !profile.isMyProfile && <p className="w-fit text-sm text-gray-400 truncate max-[920px]:hidden">Вы подписаны</p>}
                                </div>
                                <p className="text-sm text-gray-400 max-[920px]:hidden">#{community.topic.code}</p>
                            </div>
                        </Link>
                    )
                }
                {
                    followings.hasMore &&
                    <Dialog onOpenChange={(open) => {
                        if (!open) {
                            setCommunities([]);
                            setHasMore(true);
                            setNextPage(1);
                            setLoading(false);
                            setIsOpened(false);
                        }
                    }}>
                        <DialogTrigger className="w-fit self-center pt-1 px-4 text-sm text-indigo-500 border-t border-t-indigo-100 max-[920px]:border-0 max-[920px]:p-0" onClick={() => setIsOpened(true)}>посмотреть все</DialogTrigger>
                        <DialogContent className="max-h-[80dvh] max-w-[50vw] overflow-y-auto max-lg:max-w-[80vw]">
                            <DialogHeader>
                                <DialogTitle>Подписки</DialogTitle>
                                <DialogDescription>
                                </DialogDescription>
                                <div className="flex flex-wrap justify-center gap-4 w-full">
                                    {
                                        communities.length === 0 &&
                                        <div className="flex justify-center py-8">
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-400"></div>
                                        </div>
                                    }
                                    {
                                        communities.map((community, index) =>
                                            <Link href={route('community.show', {
                                                community: community.slug || community.id
                                            })} key={index} className="w-fit flex flex-col items-center gap-2">
                                                <Avatar photo={community.avatar} className="h-16 w-16" />
                                                <p className="font-medium text-sm">{community.name}</p>
                                            </Link>
                                        )
                                    }
                                </div>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                }
            </div>
        </article>
    )
}