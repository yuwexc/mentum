import { CommunityCard } from "@/Components/Community.tsx/CommunityCard";
import { MiniProfile } from "@/Components/FeedableLayoutComponents/MiniProfile";
import { UserInterests } from "@/Components/FeedableLayoutComponents/UserInterests";
import FeedableLayout from "@/Layouts/FeedableLayout";
import { PageProps } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { Plus } from "lucide-react";

export default function IndexCommunities() {

    const { communities } = usePage<PageProps>().props;

    return (
        <FeedableLayout title=" - Сообщества">

            <section className="grow max-w-[768px] flex flex-wrap gap-4 min-2xl:max-w-[560px]">
                <div className="w-full self-start flex justify-between items-center gap-4 max-sm:flex-col">
                    <div>
                        <h2 className="font-bold text-2xl">
                            Сообщества по вашим интересам
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Присоединяйтесь к сообществам, которые вам интересны
                        </p>
                    </div>
                    <Link href={route('communities.create')} className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 transition-colors text-white py-2 px-4 text-sm font-medium rounded-lg">
                        <span>Создать</span>
                        <Plus size={18} />
                    </Link>
                </div>
                {
                    communities && communities.map((community, index) =>
                        <CommunityCard communityItem={community} key={index} />
                    )
                }
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