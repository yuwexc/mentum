import { MiniProfile } from '@/Layouts/FeedableScreenComponents/MiniProfile';
import { UserInterests } from '@/Layouts/FeedableScreenComponents/UserInterests';
import FeedableScreen from '@/Screens/FeedableScreen';

export default function IndexFeed() {

    return (
        <FeedableScreen title=' - Лента'>
            <section className="grow max-w-[768px] flex flex-col gap-4">
                <article className="w-full bg-white h-[100px] rounded-xl p-4">
                    <p>Лента</p>
                </article>
            </section>
            <section className="min-w-[320px] max-w-[320px] max-lg:hidden">
                <div className="sticky top-[81px] flex flex-col gap-4">
                    <MiniProfile />
                    <UserInterests />
                </div>
            </section>
        </FeedableScreen>
    );
}
