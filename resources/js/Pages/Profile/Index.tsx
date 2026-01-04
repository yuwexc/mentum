import { Head, usePage } from "@inertiajs/react";
import AuthenticatedScreen from '@/Screens/AuthenticatedScreen';
import { Banner } from "@/Components/Profile/Banner";
import { PageProps } from "@/types";
import { Bio } from "@/Layouts/Profile/Bio";
import { Following } from "@/Layouts/Profile/Following";
import { Interactions } from "@/Layouts/Profile/Interactions";
import { useEffect, useState } from "react";
import { User } from "@/types/User";
import { CreatePostComponent } from "@/Layouts/Post/CreatePostComponent";
import { PostItem } from "@/Layouts/Post/Post";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { toast } from "sonner";
import { Post } from "@/types/Post";
import { NoPost } from "@/Layouts/Post/NoPost";
import { MainInfo } from "@/Layouts/Profile/MainInfo";
import { AddInfo } from "@/Layouts/Profile/AddInfo";

export default function IndexProfile() {

    const { profile } = usePage<PageProps>().props;

    if (!profile) {
        return null;
    }

    const [friends, setFriends] = useState<{ list: User[], hasMore: boolean }>(
        profile.interactions ? profile.interactions.friends : {
            list: [],
            hasMore: false
        });

    const [requests, setRequests] = useState<{ id: string, user: User }[]>(profile.interactions ? profile.interactions.requests : []);

    const [postItems, setPostItems] = useState<Post[]>([]);

    const [hasMore, setHasMore] = useState(true);
    const [nextPage, setNextPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const [showNoPost, setShowNoPost] = useState<boolean>(false);

    useEffect(() => {
        fetchInitialPosts();
    }, [profile?.user.username]);

    const fetchInitialPosts = async () => {
        if (!profile?.user.username) return;

        try {
            const response = await axios.get(`/posts`, {
                params: {
                    page: 1,
                    owner: profile.user.username
                }
            });

            setPostItems(response.data.posts);
            setHasMore(response.data.hasMore);
            setNextPage(2);

            if (postItems.length == 0) {
                setShowNoPost(true);
            }

        } catch {
            toast.error('Ошибка загрузки постов');
        }
    };

    const fetchMoreData = async () => {
        if (!hasMore || loading || !profile?.user.username) return;

        setLoading(true);

        try {
            const response = await axios.get(`/posts`, {
                params: {
                    page: nextPage,
                    owner: profile.user.username
                }
            });

            setPostItems(prev => [...prev, ...response.data.posts]);
            setHasMore(response.data.hasMore);
            setNextPage(prev => prev + 1);

        } catch {
            toast.error('Ошибка загрузки. Попробуйте позже');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedScreen>
            {
                profile ?
                    <Head title={` - @${profile.user.username}`} />
                    :
                    <Head title={` - профиль`} />
            }

            <div className="min-w-full flex gap-4 px-24 max-xl:px-9 max-lg:px-3 max-md:px-0">
                <section className="grow-[2] flex flex-col gap-4">
                    <article className="max-sm:h-[calc(100dvh-4.5rem)] flex flex-col gap-4 max-sm:gap-0 rounded-xl bg-white p-1 max-sm:p-2 max-sm:rounded-[48px]">
                        <Banner className="h-60 max-sm:hidden" />
                        <MainInfo
                            setFriends={setFriends}
                            setRequests={setRequests}
                        />
                    </article>
                    <AddInfo />
                    {
                        profile && profile.followings &&
                        <Following followings={profile.followings} className="hidden max-[920px]:block" />
                    }
                    <section className="w-full flex items-start gap-4 max-xl:flex-col max-xl:items-stretch">
                        <Interactions
                            friends={friends}
                            setFriends={setFriends}
                            requests={requests}
                            setRequests={setRequests}
                        />
                        <section className="grow flex flex-col gap-4">
                            {profile.isMyProfile && <CreatePostComponent setPostItems={setPostItems} owner={profile.user.id} owner_type={'user'} />}
                            {postItems.length == 0 && showNoPost && <NoPost
                                is_owner={profile.isMyProfile || false}
                                owner_type={'user'}
                            />}
                            <InfiniteScroll
                                className="flex flex-col gap-4"
                                dataLength={postItems.length}
                                next={fetchMoreData}
                                hasMore={hasMore}
                                loader={
                                    <div className="flex justify-center py-8 mb-16">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-400"></div>
                                    </div>
                                }
                            >
                                {
                                    postItems.map((post, index) =>
                                        <PostItem
                                            post={post}
                                            setPostItems={setPostItems}
                                            current_user_is_owner={profile.isMyProfile || false}
                                            key={index} />
                                    )
                                }
                            </InfiniteScroll>
                        </section>
                    </section>
                </section>
                <section className="grow-[1] min-w-[320px] max-w-[320px] max-[920px]:hidden flex flex-col gap-4">
                    <Bio />
                    {/* {
                        profile && profile.isMyProfile &&
                        <article className="w-full bg-white rounded-xl p-4 flex flex-col items-center gap-2">
                            <div className="w-full flex justify-between items-center gap-4">
                                <p className="flex items-center gap-2 text-gray-500 text-sm self-start">
                                    <span>Уведомления</span>
                                    <BellRing size={14} />
                                </p>
                                <button className="text-sm text-indigo-500">прочитать все</button>
                            </div>
                            <div className="w-full h-28 bg-gray-100 border rounded-lg flex items-center justify-center">
                                <p className="text-gray-400 text-xs">*раздел находится в стадии разработки*</p>
                            </div>
                        </article>
                    } */}

                    {profile && profile.followings && <Following followings={profile.followings} />}
                </section>
            </div>
        </AuthenticatedScreen>
    )
}