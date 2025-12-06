import { ChatList } from "@/Layouts/Chat/ChatList";
import FeedableScreen from "@/Screens/FeedableScreen";
import { MiniProfile } from "@/Layouts/FeedableScreenComponents/MiniProfile";
import { UserInterests } from "@/Layouts/FeedableScreenComponents/UserInterests";

export default function IndexCommunities() {
    return (
        <FeedableScreen title=" - Чаты">

            <ChatList />

            <section className="min-w-[320px] max-w-[320px] max-lg:hidden">
                <div className="sticky top-[81px] flex flex-col gap-4">
                    <MiniProfile />
                    <UserInterests />
                </div>
            </section>
        </FeedableScreen>
    )
}