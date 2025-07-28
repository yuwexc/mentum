import FeedableLayout from "@/Layouts/FeedableLayout";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/Components/ui/sheet";
import { Link, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Banner } from "@/Components/Community.tsx/Banner";
import { Avatar } from "@/Components/Profile/Avatar";
import { Pencil, Settings } from "lucide-react";
import { AvatarFormUpdate } from "@/Components/Community.tsx/AvatarFormUpdate";
import { MiniProfile } from "@/Components/FeedableLayoutComponents/MiniProfile";
import { UserInterests } from "@/Components/FeedableLayoutComponents/UserInterests";
import { CommunityManagement } from "@/Components/Community.tsx/CommunityManagement";
import { CommunityContactInfo } from "@/Components/Community.tsx/CommunityContactInfo";
import CommunityMembersInfo from "@/Components/Community.tsx/CommunityMembersInfo";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Community } from "@/types/Community";
import { CreatePostComponent } from "@/Components/Post/CreatePostComponent";

export default function ShowCommunity() {

    const { auth, community } = usePage<PageProps>().props;

    if (!community) {
        return (
            <FeedableLayout title=" - Сообщества">
                <section className="grow flex flex-col items-center justify-center gap-4 bg-white rounded-xl p-4 min-2xl:max-w-[560px]">
                    <p className="text-gray-400">Сообщество не найдено</p>
                </section>
                <section className="min-w-[320px] max-w-[320px] max-lg:hidden">
                    <div className="sticky top-[81px] flex flex-col gap-4">
                        <MiniProfile />
                        <UserInterests />
                    </div>
                </section>
            </FeedableLayout>
        )
    }

    const [communityItem, setCommunity] = useState<Community>(community.community);

    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubscribe = async () => {
        if (isProcessing) return;

        setIsProcessing(true);
        try {
            const { data } = await axios.post<{ followers_count: number, is_followed: boolean, error: string }>(
                `/communities/${community.community.id}/toggle-subscription`
            );

            if (data.error) {
                toast.error(data.error);
            } else {
                setCommunity(prev => ({
                    ...prev,
                    followers_count: data.followers_count,
                    is_followed: data.is_followed
                }));
            }

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.error || 'Произошла ошибка');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <FeedableLayout title=" - Сообщества">

            <section className="grow flex flex-col items-stretch gap-4 max-[426px]:-mx-2 max-[426px]:gap-3 max-w-[768px]">
                <article className="flex flex-col items-stretch gap-4 bg-white rounded-xl p-4 min-2xl:max-w-[560px]">
                    <Banner photo={community.community.banner} className="h-40" />
                    <Avatar photo={community.community.avatar} person={false} className="-mt-14 ml-6 border-white border-4 relative group h-[80px] w-[80px]">
                        {
                            community.isMyCommunity &&
                            <Sheet>
                                <SheetTrigger className="absolute bottom-0 right-0 hover:cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full p-1 bg-gray-500">
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
                    <div className="-mt-2">
                        <div className="flex items-center gap-3">
                            <h2 className="ml-6 text-2xl font-bold text-gray-900 tracking-tight">{community.community.name}</h2>
                            {
                                community.isMyCommunity && <Link href={route("community.edit", { community: community.community.slug || community.community.id })}><Settings className="text-gray-400" size={16} /></Link>
                            }
                            {
                                communityItem.owner === auth.user.username ? (
                                    null
                                ) : !communityItem.is_followed ? (
                                    <button disabled={isProcessing} onClick={handleSubscribe} className="ml-auto h-[28px] cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-4 text-sm font-semibold rounded-lg transition-colors">
                                        Подписаться
                                    </button>
                                ) : (
                                    <button disabled={isProcessing} onClick={handleSubscribe} className="ml-auto h-[28px] cursor-pointer bg-indigo-50 hover:bg-indigo-100 text-indigo-500 py-1 px-4 text-sm font-semibold rounded-lg transition-colors">
                                        Отписаться
                                    </button>
                                )
                            }
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="ml-6 text-gray-500 text-sm">
                                <span className="font-medium text-indigo-500">{community.community.topic.name}</span>
                                {' • '}{communityItem.followers_count} {getSubscribersText(communityItem.followers_count)}
                            </p>
                            {
                                community.community.created_at_formatted && <p className="text-gray-500 text-sm max-sm:hidden">с {community.community.created_at_formatted.slice(-4)} г.</p>
                            }
                        </div>
                    </div>
                    {
                        community.community.description &&
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                {community.community.description}
                            </p>
                        </div>
                    }
                </article>
                {community.isMyCommunity && <CreatePostComponent owner={community.community.id} owner_type={'community'} />}
                <article className="flex flex-col items-stretch gap-4 bg-white rounded-xl p-4 min-2xl:max-w-[560px]">
                    <p>Пост</p>
                </article>
                <article className="flex flex-col items-stretch gap-4 bg-white rounded-xl p-4 min-2xl:max-w-[560px]">
                    <p>Пост</p>
                </article>
            </section>

            <section className="min-w-[320px] max-w-[320px] max-lg:hidden">
                <div className="sticky top-[81px] flex flex-col gap-4">
                    <CommunityContactInfo community={community.community} />
                    {community.community.show_members && <CommunityMembersInfo />}
                    {community.isMyCommunity && <CommunityManagement community={community.community} />}
                </div>
            </section>
        </FeedableLayout>
    )
}

function getSubscribersText(count: number) {
    if (count == 0) return 'подписчиков';
    if (count == 1) return 'подписчик';
    if (count >= 2 && count <= 4) return `подписчика`;
    return `подписчиков`;
}