import { ChatList } from "@/Components/Chat.tsx/ChatList";
import FeedableLayout from "@/Layouts/FeedableLayout";
import { MiniProfile } from "@/Components/FeedableLayoutComponents/MiniProfile";
import { UserInterests } from "@/Components/FeedableLayoutComponents/UserInterests";

export default function IndexCommunities() {
    return (
        <FeedableLayout title=" - Чаты">

            <ChatList />

            <section className="min-w-[320px] max-w-[320px] max-lg:hidden">
                <div className="sticky top-[81px] flex flex-col gap-4">
                    <MiniProfile />
                    <UserInterests />
                </div>
            </section>
        </FeedableLayout>
    )
}