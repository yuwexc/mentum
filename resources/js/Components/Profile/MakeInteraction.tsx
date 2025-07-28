import { PageProps } from "@/types";
import { Interaction } from "@/types/Profile";
import { User } from "@/types/User";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

export const MakeInteraction = ({ setFriends, setRequests }: {
    setFriends: Dispatch<SetStateAction<{ list: User[], hasMore: boolean }>>,
    setRequests: Dispatch<SetStateAction<{ id: string, user: User }[]>>
}) => {

    const { auth, profile } = usePage<PageProps>().props;

    if (!profile) {
        return null;
    }

    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const [interactionStatus, setInteractionStatus] = useState<{ id: string, code: string, initiator_id: string } | null>(profile.interaction_status || null);

    const handleSubscribe = async () => {
        if (isProcessing) return;

        setIsProcessing(true);

        try {
            const { data } = await axios.post<{
                interaction_status: { id: string, code: string, initiator_id: string },
                interactions: Interaction,
                error: string
            }>(
                `/friendship`, {
                username: profile.user.username
            });

            if (data.error) {
                toast.error(data.error);
            } else {
                setInteractionStatus(data.interaction_status)
                setFriends(data.interactions.friends)
                setRequests(data.interactions.requests)
            }

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.error || 'Произошла ошибка');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    if (!interactionStatus) {
        return (
            <button onClick={handleSubscribe} disabled={isProcessing} className="ml-auto max-[426px]:hidden mb-2 max-[480px]:mb-0 h-[28px] cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-4 text-sm font-semibold rounded-lg transition-colors">
                Подписаться
            </button>
        )
    }

    if (interactionStatus.code === 'banned') {
        return null;
    }

    const handleAccept = async () => {
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
                id: interactionStatus.id
            });

            if (data.error) {
                toast.error(data.error);
            } else {
                setInteractionStatus(data.interaction_status)
                setFriends(data.interactions.friends)
                setRequests(data.interactions.requests)
            }

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.error || 'Произошла ошибка');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    if (interactionStatus.code === 'requested') {
        const isRequestSentByMe = interactionStatus.initiator_id === auth.user.id;

        if (isRequestSentByMe) {
            return (
                <button onClick={handleSubscribe} disabled={isProcessing} className="ml-auto max-[426px]:hidden mb-2 max-[480px]:mb-0 h-[28px] cursor-pointer bg-indigo-50 text-indigo-500 hover:bg-indigo-100 py-1 px-4 text-sm font-semibold rounded-lg transition-colors">
                    Отменить запрос
                </button>
            );
        } else {
            return (
                <div className="ml-auto flex gap-2">
                    <button onClick={handleAccept} className="max-[426px]:hidden mb-2 max-[480px]:mb-0 h-[28px] cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-4 text-sm font-semibold rounded-lg transition-colors">
                        Принять в друзья
                    </button>
                    {/* <button className="max-[426px]:hidden mb-2 max-[480px]:mb-0 h-[28px] cursor-pointer bg-indigo-50 text-indigo-500 hover:bg-indigo-100 py-1 px-4 text-sm font-semibold rounded-lg transition-colors">
                        Оставить в подписчиках
                    </button> */}
                </div>
            );
        }
    }

    if (interactionStatus.code === 'followed') {
        return (
            <button onClick={handleSubscribe} className="ml-auto max-[426px]:hidden mb-2 max-[480px]:mb-0 h-[28px] cursor-pointer bg-red-50 hover:bg-red-100 text-red-500 py-1 px-4 text-sm font-semibold rounded-lg transition-colors">
                Удалить из друзей
            </button>
        );
    }
}