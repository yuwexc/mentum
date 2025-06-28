import FeedableLayout from '@/Layouts/FeedableLayout';

export default function IndexFeed() {

    return (
        <FeedableLayout title=' - Лента'>
            <section className="grow flex flex-col gap-4">
                <article className="w-full bg-white h-[100px] rounded-xl p-4">
                    <p>Лента</p>
                </article>
            </section>
        </FeedableLayout>
    );
}
