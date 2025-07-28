import { PageProps } from "@/types"
import { Link, usePage } from "@inertiajs/react"
import { Handshake, X } from "lucide-react"
import { Avatar } from "./Avatar";
import { Dispatch, SetStateAction, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { User } from "@/types/User";
import { Interaction } from "@/types/Profile";

export const Interactions = ({ friends, requests, setFriends, setRequests }: {
    friends: { list: User[], hasMore: boolean },
    requests: { id: string, user: User }[],
    setFriends: Dispatch<SetStateAction<{ list: User[], hasMore: boolean }>>,
    setRequests: Dispatch<SetStateAction<{ id: string, user: User }[]>>
}) => {

    const { profile } = usePage<PageProps>().props;

    if (!profile || !profile.interactions) {
        return null;
    }

    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const handleAccept = async (id: string) => {
        if (isProcessing) return;

        setIsProcessing(true);

        try {
            const { data } = await axios.post<{
                interaction_status: {
                    id: string,
                    code: string,
                    initiator_id: string
                },
                interactions: Interaction,
                error: string
            }>(
                `/friendship/accept`, {
                id: id
            });

            if (data.error) {
                toast.error(data.error);
            } else {
                setFriends(data.interactions.friends);
                setRequests(data.interactions.requests);
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
        <article className="grow max-w-[320px] max-xl:max-w-none bg-white rounded-xl">
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                <Handshake className="w-4 h-4 text-indigo-500" />
                {
                    profile.isMyProfile ?
                        <Link href={route('user.friends')} className="font-medium text-gray-800">Друзья</Link>
                        :
                        <Link href={route('user.friends', { user: profile.user.username })} className="font-medium text-gray-800">Друзья</Link>
                }
            </div>
            <div className="p-4 flex flex-col gap-4">
                {
                    friends.list.length > 0 ?
                        friends.list.map((user, index) =>
                            <Link href={`/@${user.username}`} key={index} className="flex items-center gap-2">
                                <Avatar photo={user.avatar} className="min-h-11 min-w-11" />
                                <div className="w-full flex items-center justify-between overflow-hidden">
                                    <p className="w-fit text-sm truncate">{user.full_name}</p>
                                </div>
                            </Link>
                        )
                        :
                        <p className="text-sm text-gray-400">Друзей нет</p>
                }
                {
                    friends.hasMore && (
                        profile.isMyProfile ?
                            <Link href={route('user.friends')} className="w-fit self-center pt-1 px-4 text-sm text-indigo-500 border-t border-t-indigo-100 max-[920px]:border-0 max-[920px]:p-0">посмотреть всех</Link>
                            :
                            <Link href={route('user.friends', { user: profile.user.username })} className="w-fit self-center pt-1 px-4 text-sm text-indigo-500 border-t border-t-indigo-100 max-[920px]:border-0 max-[920px]:p-0">посмотреть всех</Link>
                    )
                }
            </div>
            {
                requests.length > 0 && profile.isMyProfile &&
                <>
                    <div className="flex items-center gap-3 p-4 border-y border-gray-100">
                        <p className="h-6 aspect-square bg-red-500 flex items-center justify-center rounded-full text-white text-sm">
                            {profile.interactions.requests.length}
                        </p>
                        <h3 className="font-medium text-gray-800">Заявки в друзья</h3>
                    </div>
                    <div className="p-4 flex flex-col gap-4">
                        {
                            requests.map((interaction, index) =>
                                <div key={index} className="flex items-center gap-2">
                                    <Avatar photo={interaction.user.avatar} className="min-h-11 min-w-11" />
                                    <div className="w-full flex items-center justify-between overflow-hidden">
                                        <Link href={`/@${interaction.user.username}`} className="w-fit text-sm truncate">{interaction.user.full_name}</Link>
                                        <button onClick={() => handleAccept(interaction.id)} className="ml-auto mr-2 text-sm bg-indigo-50 text-indigo-500 p-1 rounded-md">принять</button>
                                        {/* <button className="text-gray-400"><X strokeWidth={1} size={18} /></button> */}
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </>
            }
        </article >
    )
}