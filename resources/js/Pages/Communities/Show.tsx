import FeedableLayout from "@/Layouts/FeedableLayout";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/Components/ui/sheet";
import { usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Banner } from "@/Components/Community.tsx/Banner";
import { Avatar } from "@/Components/Profile/Avatar";
import { Pencil } from "lucide-react";
import { AvatarFormUpdate } from "@/Components/Community.tsx/AvatarFormUpdate";

export default function ShowCommunity() {

    const { community } = usePage<PageProps>().props;

    if (!community) {
        return (
            <FeedableLayout title=" - Сообщества">
                <section className="grow flex flex-col items-center justify-center gap-4 bg-white rounded-xl p-4 min-2xl:max-w-[560px]">
                    <p className="text-gray-400">Сообщество не найдено</p>
                </section>
            </FeedableLayout>
        )
    }

    return (
        <FeedableLayout title=" - Сообщества">

            <section className="grow flex flex-col items-stretch gap-4">
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
                        <h2 className="ml-6 text-2xl font-bold text-gray-900 tracking-tight">{community.community.name}</h2>
                        <div className="flex items-center justify-between">
                            <p className="ml-6 text-gray-500 text-sm">
                                <span className="font-medium text-indigo-500">{community.community.topic.name}</span>
                                {' • '}{community.community.followers_count} {getSubscribersText(community.community.followers_count)}
                            </p>
                            {
                                community.community.created_at_formatted && <p className="text-gray-500 text-sm">с {community.community.created_at_formatted.slice(-4)} г.</p>
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
                <article className="flex flex-col items-stretch gap-4 bg-white rounded-xl p-4 min-2xl:max-w-[560px]">
                    <p>Создать пост</p>
                </article>
                <article className="flex flex-col items-stretch gap-4 bg-white rounded-xl p-4 min-2xl:max-w-[560px]">
                    <p>Пост</p>
                </article>
                <article className="flex flex-col items-stretch gap-4 bg-white rounded-xl p-4 min-2xl:max-w-[560px]">
                    <p>Пост</p>
                </article>
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