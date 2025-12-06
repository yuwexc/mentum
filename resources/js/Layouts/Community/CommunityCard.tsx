import { Check, Dot, Plus } from "lucide-react"
import { Avatar } from "../../Components/Profile/Avatar"
import { Community } from "@/types/Community"
import { Link, router, usePage } from "@inertiajs/react"
import { PageProps } from "@/types"
import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"

export const CommunityCard = ({ communityItem }: { communityItem: Community }) => {

    const { auth } = usePage<PageProps>().props;
    const [community, setCommunity] = useState<Community>(communityItem);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubscribe = async () => {
        if (isProcessing) return;

        setIsProcessing(true);
        try {
            const { data } = await axios.post<{ followers_count: number, is_followed: boolean, error: string }>(
                `/communities/${community.id}/toggle-subscription`
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
        <article className="flex flex-col gap-3 bg-white rounded-xl p-4 min-w-[231px] max-w-[384px] flex-1 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
            <div className="self-center mb-2">
                <div className="h-[100px] w-[100px] rounded-full bg-gradient-to-r from-blue-400 to-purple-500 p-[2px]">
                    <Avatar
                        photo={community.avatar}
                        person={false}
                        className="h-full w-full rounded-full border-4 border-white bg-gray-100"
                    />
                </div>
            </div>

            <Link href={route('community.show', { community: community.slug || community.id })} className="line-clamp-1 font-bold text-lg text-gray-900 text-center group-hover:text-indigo-600 transition-colors px-1">
                {community.name}
            </Link>

            {
                community.description &&
                <p className="line-clamp-3 text-sm text-gray-600 leading-relaxed max-sm:hidden">
                    {community.description}
                </p>
            }

            <div className={'-mt-2 w-fit inline-flex items-center rounded-md'}>
                <p className="text-xs font-semibold text-indigo-500">#{community.topic.name}</p>
                <Dot className="text-gray-300" size={16} />
                <p className="text-xs text-gray-500">{community.owner}</p>
            </div>

            <div className="mt-auto pt-2 border-t border-gray-100 flex flex-col items-center">
                <p className="text-sm font-semibold text-gray-700">{community.followers_count}</p>
                <p className="text-xs text-gray-500 mt-[-2px]">{getSubscribersText(community.followers_count)}</p>
            </div>

            {
                community.owner === auth.user.username ? (
                    <div className="h-[28px] flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-1 px-4 text-sm font-semibold rounded-lg transition-colors">
                        <span>Ваше сообщество</span>
                        <Check size={18} />
                    </div>
                ) : !community.is_followed ? (
                    <button disabled={isProcessing} onClick={handleSubscribe} className="h-[28px] cursor-pointer flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-4 text-sm font-semibold rounded-lg transition-colors">
                        <Plus size={18} />
                        <span>Подписаться</span>
                    </button>
                ) : (
                    <button disabled={isProcessing} onClick={handleSubscribe} className="h-[28px] flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-1 px-4 text-sm font-semibold rounded-lg transition-colors">
                        <span>Вы подписаны</span>
                        <Check size={18} />
                    </button>
                )
            }
        </article>
    )
}

function getSubscribersText(count: number) {
    if (count == 0) return 'подписчиков';
    if (count == 1) return 'подписчик';
    if (count >= 2 && count <= 4) return `подписчика`;
    return `подписчиков`;
}