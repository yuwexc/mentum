import { PageProps } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { Avatar } from "@/Components/Profile/Avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/Components/ui/sheet";
import { MessageCircle, Pencil, Settings } from "lucide-react";
import { AvatarFormUpdate } from "@/Components/Profile/AvatarFormUpdate";
import { MakeInteraction } from "@/Components/Profile/MakeInteraction";
import { Badge } from "@/Components/ui/badge";
import { Skeleton } from "@/Components/ui/skeleton";
import { User } from "@/types/User";
import { Dispatch, SetStateAction } from "react";

export const MainInfo = ({ setFriends, setRequests }: {
    setFriends: Dispatch<SetStateAction<{ list: User[], hasMore: boolean }>>,
    setRequests: Dispatch<SetStateAction<{ id: string, user: User }[]>>
}) => {

    const { profile } = usePage<PageProps>().props;

    if (!profile) {
        return null;
    }

    return (
        <div className="mb-4 mt-4 mx-16 max-xl:mx-4 flex gap-5 max-sm:m-0 max-sm:h-full max-sm:flex-col max-sm:gap-0">
            <Avatar photo={profile ? profile.user.avatar : null} className="-mt-[90px] relative group border-[4px] border-white min-w-[140px] min-h-[90px] max-w-[140px] h-[140px] w-[140px] max-sm:min-w-[90px] max-sm:m-0 max-sm:border-none
            max-sm:w-full max-sm:max-w-none max-sm:h-full max-sm:rounded-[40px] max-sm:flex max-sm:justify-end max-sm:overflow-hidden">
                {
                    profile && profile.isMyProfile &&
                    <Sheet>
                        <SheetTrigger className="absolute bottom-0 right-[10px] hover:cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full p-1 bg-indigo-500 border-4 border-white
                        max-sm:bottom-4 max-sm:right-4 max-sm:rounded-full max-sm:px-4 max-sm:bg-indigo-500/60
                        max-sm:opacity-100 max-sm:border-2 max-sm:flex max-sm:gap-2 items-center">
                            <p className="hidden text-white max-sm:block">Редактировать</p>
                            <Pencil color="white" size={18} strokeWidth={1} />
                        </SheetTrigger>
                        <SheetContent className="w-[400px] sm:w-[540px] max-[426px]:w-full z-[999]">
                            <SheetHeader>
                                <SheetTitle>Редактировать аватар</SheetTitle>
                                <AvatarFormUpdate />
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>
                }
            </Avatar>
            <div className="hidden w-full max-sm:block">
                {
                    profile ?
                        <>
                            <div className="flex items-center gap-3 max-sm:flex-col max-sm:p-6 max-sm:items-start max-sm:gap-0.5">
                                <h2 className="scroll-m-20 pb-2 max-[480px]:pb-0 font-semibold tracking-tight first:mt-0 text-3xl max-lg:text-2xl">{profile.user.full_name}</h2>
                                <div className="w-full flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-4">
                                    {profile.user.bio && <p>{profile.user.bio}</p>}
                                    <div className="flex flex-wrap gap-2 w-fit">
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
                                    {
                                        profile.isMyProfile ?
                                            <Link href={route('profile.edit')}><Settings className="text-gray-400 mb-1 max-sm:hidden" size={16} /></Link>
                                            :
                                            <div className="ml-auto flex items-center gap-2 max-sm:m-0 max-sm:w-full">
                                                <Link href={route('chats')} className="mb-2 flex justify-center items-center h-8 w-8 rounded-full bg-indigo-50 hover:bg-indigo-100 transition-colors text-indigo-500
                                                max-sm:min-h-full max-sm:aspect-square max-sm:m-0">
                                                    <MessageCircle strokeWidth={1.25} className="h-5 w-5" />
                                                </Link>
                                                <MakeInteraction
                                                    setFriends={setFriends}
                                                    setRequests={setRequests}
                                                />
                                            </div>
                                    }
                                </div>
                            </div>
                        </>
                        :
                        <Skeleton className="h-[40px] w-96 rounded-full" />
                }
            </div>
            <div className="w-full max-sm:hidden">
                {
                    profile ?
                        <>
                            <div className="flex items-center gap-3">
                                <h2 className="scroll-m-20 pb-2 max-[480px]:pb-0 font-semibold tracking-tight first:mt-0 text-3xl max-lg:text-2xl max-sm:text-xl">{profile.user.full_name}</h2>
                                {
                                    profile.isMyProfile ?
                                        <Link href={route('profile.edit')}><Settings className="text-gray-400 mb-1" size={16} /></Link>
                                        :
                                        <div className="ml-auto flex items-center gap-2">
                                            <Link href={route('chats')} className="mb-2 flex justify-center items-center h-8 w-8 rounded-full bg-indigo-50 hover:bg-indigo-100 transition-colors text-indigo-500">
                                                <MessageCircle strokeWidth={1.25} className="h-5 w-5" />
                                            </Link>
                                            <MakeInteraction
                                                setFriends={setFriends}
                                                setRequests={setRequests}
                                            />
                                        </div>
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
    );
}