import { MiniProfile } from "@/Layouts/FeedableScreenComponents/MiniProfile";
import { UserInterests } from "@/Layouts/FeedableScreenComponents/UserInterests";
import { Avatar } from "@/Components/Profile/Avatar";
import { Input } from "@/Components/ui/input";
import { Skeleton } from "@/Components/ui/skeleton";
import FeedableScreen from "@/Screens/FeedableScreen";
import { PageProps } from "@/types";
import { Interaction } from "@/types/Profile";
import { User } from "@/types/User";
import { Link, usePage } from "@inertiajs/react";
import axios from "axios";
import { useCallback, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "sonner";

export default function ShowFriends() {

    const { auth, friends } = usePage<PageProps>().props;

    if (!friends) {
        return (
            <FeedableScreen title=" - Друзья">
                <section className="grow flex flex-col items-stretch gap-4 max-[426px]:-mx-2 max-[426px]:gap-3 max-w-[768px]">
                    <div>
                        {
                            !friends && <p>Ошибка</p>
                        }
                    </div>
                </section>

                <section className="min-w-[320px] max-w-[320px] max-lg:hidden">
                    <div className="sticky top-[81px] flex flex-col gap-4">
                        <MiniProfile />
                        <UserInterests />
                    </div>
                </section>
            </FeedableScreen>
        )
    }

    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const handleSubscribe = async (username: string) => {
        if (isProcessing) return;

        setIsProcessing(true);

        try {
            const { data } = await axios.post<{
                interaction_status: { id: string, code: string, initiator_id: string },
                interactions: Interaction,
                error: string
            }>(
                `/friendship`, {
                username: username
            });

            if (data.error) {
                toast.error(data.error);
            }

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.error || 'Произошла ошибка');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const [friendsItems, setFriends] = useState<User[]>(friends.list);
    const [hasMore, setHasMore] = useState(true);
    const [nextPage, setNextPage] = useState(2);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchMoreData = useCallback(async () => {

        if (!hasMore) return;

        setLoading(true);

        try {
            const response = await axios.get(`/friends`, {
                params: { page: nextPage },
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });

            setFriends([...friendsItems, ...response.data.friends.list]);
            setHasMore(response.data.friends.hasMore);
            setNextPage(nextPage + 1);

        } catch {
            toast.error('Ошибка загрузки. Попробуйте позже');
        } finally {
            setLoading(false);
        }
    }, [hasMore, nextPage]);

    const [searchQuery, setSearchQuery] = useState<string>("");

    const filteredFriends = friendsItems.filter(user =>
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return (
        <FeedableScreen title=" - Друзья">
            <section className="grow self-start bg-white flex flex-col items-stretch max-w-[768px] rounded-xl">
                <div className="w-full self-start flex justify-between items-center gap-4 pb-0 p-4">
                    <div>
                        <h2 className="font-bold text-2xl">
                            Друзья
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            пользователя {friends.user.full_name}
                        </p>
                    </div>
                </div>

                <div className="px-4 pt-4">
                    <Input
                        className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-400"
                        placeholder="Поиск друзей"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        id="user" />
                </div>

                <InfiniteScroll
                    dataLength={friendsItems.length}
                    next={fetchMoreData}
                    hasMore={hasMore && !searchQuery}
                    loader={loading && !searchQuery &&
                        <>
                            <div className="flex items-center gap-4 p-6 -mt-8">
                                <Skeleton className="min-w-20 h-20" style={{ borderRadius: '999px' }} />
                                <Skeleton className="w-52 h-5" />
                                <Skeleton className="ml-auto w-40 h-7" />
                            </div>
                            <div className="flex items-center gap-4 p-6 -mt-8">
                                <Skeleton className="min-w-20 h-20" style={{ borderRadius: '999px' }} />
                                <Skeleton className="w-52 h-5" />
                                <Skeleton className="ml-auto w-40 h-7" />
                            </div>
                            <div className="flex items-center gap-4 p-6 -mt-8">
                                <Skeleton className="min-w-20 h-20" style={{ borderRadius: '999px' }} />
                                <Skeleton className="w-52 h-5" />
                                <Skeleton className="ml-auto w-40 h-7" />
                            </div>
                        </>
                    }
                >
                    <div className="flex flex-col gap-4 p-6 max-sm:p-4">
                        {
                            (searchQuery ? filteredFriends : friendsItems).map((user, index) =>
                                <div key={index} className="flex items-center gap-4">
                                    <Avatar photo={user.avatar} className="h-20 w-20" />
                                    <Link href={`/@${user.username}`} className="font-medium">{user.full_name}</Link>
                                    {
                                        friends.user.id === auth.user.id &&
                                        <button disabled={isProcessing} onClick={() => handleSubscribe(user.username)} className="ml-auto h-[28px] cursor-pointer bg-red-50 hover:bg-red-100 text-red-500 py-1 px-4 text-sm font-semibold rounded-lg transition-colors">
                                            Удалить
                                        </button>
                                    }
                                </div>
                            )
                        }
                        {
                            searchQuery && filteredFriends.length === 0 && (
                                <p className="text-gray-500 text-sm text-center py-4">
                                    Ничего не найдено
                                </p>
                            )}
                    </div>
                </InfiniteScroll>
            </section>

            <section className="min-w-[320px] max-w-[320px] max-lg:hidden">
                <article className="w-full bg-white rounded-xl overflow-hidden">
                    <Link
                        href={`/@${friends.user.username}`}
                        className="flex items-center gap-3 p-4"
                    >
                        <Avatar className="w-11 h-11" photo={friends.user.avatar} />
                        <div className="flex flex-col">
                            <p className="font-semibold">{friends.user.full_name}</p>
                            <p className="text-gray-500 text-sm">Перейти к странице</p>
                        </div>
                    </Link>
                </article>
            </section>
        </FeedableScreen>
    )
}