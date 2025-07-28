import { MiniProfile } from '@/Components/FeedableLayoutComponents/MiniProfile';
import { UserInterests } from '@/Components/FeedableLayoutComponents/UserInterests';
import FeedableLayout from '@/Layouts/FeedableLayout';

export default function IndexFeed() {

    return (
        <FeedableLayout title=' - Лента'>
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
        </FeedableLayout>
    );
}
