import { Head, Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Banner } from "@/Components/Profile/Banner";
import { PageProps } from "@/types";
import { Avatar } from "@/Components/Profile/Avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/Components/ui/sheet";
import { Calendar, Globe, Pencil, PlusIcon, Settings } from "lucide-react";
import { AvatarFormUpdate } from "@/Components/Profile/AvatarFormUpdate";
import { Bio } from "@/Components/Profile/Bio";
import { Skeleton } from "@/Components/ui/skeleton";
import { Badge } from "@/Components/ui/badge";
import { Following } from "@/Components/Profile/Following";
import { Interactions } from "@/Components/Profile/Interactions";
import { MakeInteraction } from "@/Components/Profile/MakeInteraction";
import { useState } from "react";
import { User } from "@/types/User";
import { CreatePostComponent } from "@/Components/Post/CreatePostComponent";
import { PostItem } from "@/Components/Post/Post";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { toast } from "sonner";
import { Post } from "@/types/Post";

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

    const [postItems, setPostItems] = useState<Post[]>(profile.posts.list);

    const [hasMore, setHasMore] = useState(true);
    const [nextPage, setNextPage] = useState(2);
    const [loading, setLoading] = useState(false);

    const fetchMoreData = async () => {
        if (!hasMore || loading) return;

        setLoading(true);

        try {
            const response = await axios.get(`/posts`, {
                params: { 
                    page: nextPage,
                    username: profile.user.username
                 },
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });

            setPostItems([...postItems, ...response.data.posts])
            setHasMore(response.data.hasMore);
            setNextPage(nextPage + 1);

        } catch {
            toast.error('Ошибка загрузки. Попробуйте позже');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout>
            {
                profile ?
                    <Head title={` - @${profile.user.username}`} />
                    :
                    <Head title={` - профиль`} />
            }

            <div className="min-w-full flex gap-4 px-24 max-xl:px-9 max-lg:px-3">
                <section className="grow-[2] flex flex-col gap-4">
                    <article className="flex flex-col gap-4 max-sm:gap-0 bg-white rounded-xl p-1">
                        <Banner className="h-60 max-sm:h-40 max-[426px]:h-28" />
                        <div className="mb-4 mt-4 mx-16 max-xl:mx-4 max-[325px]:m-2 flex gap-5 max-[425px]:gap-4">
                            <Avatar photo={profile ? profile.user.avatar : null} className="-mt-[90px] relative group border-[4px] border-white min-w-[140px] min-h-[90px] max-w-[140px] h-[140px] w-[140px] max-sm:h-[90px] max-sm:min-w-[90px] max-sm:w-[90px] max-sm:-mt-[45px]">
                                {
                                    profile && profile.isMyProfile &&
                                    <Sheet>
                                        <SheetTrigger className="absolute bottom-0 right-[10px] hover:cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full p-1 bg-indigo-500 border-4 border-white">
                                            <Pencil color="white" size={18} strokeWidth={1} />
                                        </SheetTrigger>
                                        <SheetContent className="w-[400px] sm:w-[540px] max-[400px]:w-full z-[999]">
                                            <SheetHeader>
                                                <SheetTitle>Редактировать аватар</SheetTitle>
                                                <AvatarFormUpdate />
                                            </SheetHeader>
                                        </SheetContent>
                                    </Sheet>
                                }
                            </Avatar>
                            <div className="w-full max-[480px]:flex max-[480px]:items-center ">
                                {
                                    profile ?
                                        <>
                                            <div className="flex items-center gap-3">
                                                <h2 className="scroll-m-20 pb-2 max-[480px]:pb-0 font-semibold tracking-tight first:mt-0 text-3xl max-lg:text-2xl max-sm:text-xl">{profile.user.full_name}</h2>
                                                {
                                                    profile.isMyProfile ?
                                                        <Link href={route('profile.edit')}><Settings className="text-gray-400 mb-1" size={16} /></Link>
                                                        :
                                                        <MakeInteraction
                                                            setFriends={setFriends}
                                                            setRequests={setRequests}
                                                        />
                                                }
                                            </div>
                                            <div className="flex flex-wrap gap-2 w-fit max-[480px]:hidden">
                                                {
                                                    profile.interests && profile.interests.map((interest, index) =>
                                                        <Badge
                                                            variant="outline"
                                                            key={index}
                                                            className="px-3 py-1 bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100"
                                                        >
                                                            {interest.name}
                                                        </Badge>
                                                    )
                                                }
                                                {
                                                    profile.isMyProfile && <Link href={route('user.interests.create')} className={'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors text-white bg-indigo-500 hover:bg-indigo-600'}>добавить тему</Link>
                                                }
                                            </div>
                                        </>
                                        :
                                        <Skeleton className="h-[40px] w-96 rounded-full" />
                                }
                            </div>
                        </div>
                    </article>
                    {
                        profile && (profile.user.website || profile.user.show_birthdate) &&
                        <article className="w-full bg-white rounded-xl p-6 hidden max-[920px]:block">
                            <div className="space-y-4">
                                {
                                    profile.user.show_birthdate &&
                                    <div className="flex items-center gap-3">
                                        <Calendar size={18} className="text-gray-400" />
                                        <p className="text-sm text-gray-700">
                                            <span className="text-gray-500">Дата рождения: </span>
                                            <span className="font-medium">{profile.user.birthdate_formatted}</span>
                                        </p>
                                    </div>
                                }
                                {
                                    profile.user.website && (
                                        <a
                                            href={profile.user.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 text-sm hover:text-blue-600 transition-colors"
                                        >
                                            <Globe size={18} className="text-gray-400" />
                                            <span className="text-gray-700">Сайт</span>
                                        </a>
                                    )}
                            </div>
                        </article>
                    }
                    {
                        profile && (
                            <article className="w-full hidden max-[480px]:flex flex-col bg-white rounded-xl p-4">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-bold text-lg text-gray-900">Мои интересы</h3>
                                    {profile.isMyProfile && (
                                        <Link
                                            href={route('user.interests.create')}
                                            className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
                                        >
                                            <PlusIcon className="w-4 h-4" />
                                            Добавить
                                        </Link>
                                    )}
                                </div>
                                {
                                    profile.interests &&
                                    <div className="flex flex-wrap gap-2">
                                        {profile.interests.map((interest, index) => (
                                            <Badge
                                                variant="outline"
                                                key={index}
                                                className="rounded-full px-3 py-1 text-sm bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100"
                                            >
                                                {interest.name}
                                            </Badge>
                                        ))}

                                        {!profile.interests.length && (
                                            <p className="text-gray-500 text-sm">Пока нет интересов</p>
                                        )}
                                    </div>
                                }
                            </article>
                        )
                    }
                    {profile && profile.followings && <Following followings={profile.followings} className="hidden max-[920px]:block" />}
                    <section className="w-full flex items-start gap-4 max-xl:flex-col max-xl:items-stretch">
                        <Interactions
                            friends={friends}
                            setFriends={setFriends}
                            requests={requests}
                            setRequests={setRequests}
                        />
                        <section className="grow flex flex-col gap-4">
                            {profile.isMyProfile && <CreatePostComponent owner={profile.user.id} owner_type={'user'} />}

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
                                        <PostItem post={post} key={index} />
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
        </AuthenticatedLayout>
    )
}