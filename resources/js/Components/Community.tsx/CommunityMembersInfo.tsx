import { Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/Components/ui/dialog"
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { User } from "@/types/User";
import axios from "axios";
import { Link, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import InfiniteScroll from "react-infinite-scroll-component";
import { Avatar } from "../Profile/Avatar";

export default function CommunityMembersInfo() {

    const { community } = usePage<PageProps>().props;

    if (!community) {
        return null;
    }

    const [members, setMembers] = useState<User[]>(community.members || []);
    const [hasMore, setHasMore] = useState(true);
    const [nextPage, setNextPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchMoreData = async () => {
        if (!hasMore || loading) return;

        setLoading(true);

        try {
            const response = await axios.get(`/communities/${community.community.slug || community.community.id}/participants`, {
                params: { page: nextPage },
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });

            setMembers([...members, ...response.data.members]);
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

    useEffect(() => {
        return () => {
            setMembers([]);
            setHasMore(true);
            setNextPage(1);
            setLoading(false);
            setIsOpened(false);
        }
    }, []);

    return (
        <article className="w-full bg-white rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                <Users className="w-4 h-4 text-indigo-500" />
                <h3 className="font-medium text-gray-800">Подписчики</h3>
                <Dialog>
                    <DialogTrigger className="ml-auto text-sm text-indigo-500" onClick={() => setIsOpened(true)}>посмотреть</DialogTrigger>
                    <DialogContent className="max-h-[80dvh] max-w-[50vw] overflow-y-auto max-lg:max-w-[80vw]">
                        <DialogHeader>
                            <DialogTitle>Подписчики</DialogTitle>
                            <DialogDescription>
                            </DialogDescription>
                            <InfiniteScroll
                                dataLength={members!.length}
                                next={fetchMoreData}
                                hasMore={hasMore}
                                loader={
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-400"></div>
                                    </div>
                                }
                                className="flex flex-wrap justify-center gap-4 w-full"
                            >
                                {
                                    members.map((user, index) =>
                                        <>
                                            <Link href={`/@${user.username}`} key={index} className="w-fit flex flex-col items-center gap-2">
                                                <Avatar photo={user.avatar} className="h-16 w-16" />
                                                <p className="font-medium text-sm">{user.full_name}</p>
                                            </Link>
                                        </>
                                    )
                                }
                            </InfiniteScroll>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </article>
    )
}