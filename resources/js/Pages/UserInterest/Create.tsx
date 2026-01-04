import InfiniteScroll from 'react-infinite-scroll-component';
import Authenticated from "@/Screens/AuthenticatedScreen";
import { PageProps } from "@/types";
import { Topic } from "@/types/Topic";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

export default function CreateUserInterest() {

    const { auth, topics, errors } = usePage<PageProps>().props;

    const [selectedTopics, setSelectedTopics] = useState<Topic[]>(topics!.user_interests);
    const [topicsList, setTopicsList] = useState<Topic[]>(topics!.initial_data);
    const [hasMore, setHasMore] = useState(true);
    const [nextPage, setNextPage] = useState(2);
    const [loading, setLoading] = useState(false);

    const handleTopicSelect = (topic: Topic) => {
        const isSelected = selectedTopics.some(selected => selected.id === topic.id);

        if (isSelected) {
            setSelectedTopics(selectedTopics.filter(element => element.id !== topic.id));
        } else {
            const maxInterests = auth.user.user_feature_subscription.user_interest_count;
            if (!maxInterests || selectedTopics.length < maxInterests) {
                setSelectedTopics([...selectedTopics, topic]);
            }
        }
    };

    const fetchMoreData = async () => {
        if (!hasMore || loading) return;

        setLoading(true);

        try {
            const response = await axios.get('/topics', {
                params: { page: nextPage },
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });

            setTopicsList([...topicsList, ...response.data.data]);
            setHasMore(response.data.hasMore);
            setNextPage(nextPage + 1);

        } catch {
            toast.error('Ошибка загрузки. Попробуйте позже');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = () => {
        const topic_ids = selectedTopics.map(topic => topic.id);
        console.log(topic_ids);
        router.post(route('user.interests.store'), { topics: topic_ids }, {
            onError: () => {
                toast.error('Ошибка загрузки. Попробуйте позже');
            }
        });
    }

    return (
        <Authenticated>
            <Head title={` - Темы`} />

            <div className="min-w-full px-28 max-lg:px-14 max-sm:px-4 py-8">
                <div className="flex flex-col items-center text-center mb-6 gap-4">
                    <h2 className="scroll-m-20 text-4xl font-medium tracking-tight text-balance">Выберите интересующие вас темы</h2>
                    {
                        auth.user.user_feature_subscription.user_interest_count &&
                        <>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Это поможет нам рекомендовать вам соответствующие сообщества. Вы можете выбрать <span className="font-semibold text-indigo-600">максимум {auth.user.user_feature_subscription.user_interest_count} темы и только один раз</span>.
                            </p>
                            <div className="flex gap-2 items-center -mt-2 max-[450px]:flex-col max-[450px]:gap-0">
                                <p className="text-gray-500">Хотите больше возможностей?</p>
                                <Link href={route('feature.subscription.create')} className="text-indigo-600 font-medium hover:underline hover:cursor-pointer">Приобрести подписку</Link>
                            </div>
                        </>
                    }
                </div>

                {
                    errors &&
                    <Alert variant="destructive" className='mb-6 max-sm:mb-4'>
                        <AlertCircleIcon className='stroke-red-400' />
                        <AlertTitle>Обратите внимание!</AlertTitle>
                        <AlertDescription>
                            {errors.topics}
                        </AlertDescription>
                    </Alert>
                }

                <InfiniteScroll
                    dataLength={topicsList!.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={
                        <div className="flex justify-center py-8 -mt-16 mb-16">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-400"></div>
                        </div>
                    }
                >

                    <section className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-[1fr] gap-6 max-sm:gap-4 mb-16">
                        {topicsList.map((topic, index) => (
                            <div key={index}>
                                <article
                                    className={`bg-white border-2 rounded-xl p-6 max-md:p-4 transition-all duration-300 hover:shadow-md hover:border-indigo-300 cursor-pointer relative overflow-hidden
                                    ${selectedTopics.some(selected => selected.id === topic.id) ?
                                            'border-indigo-500 bg-indigo-50 shadow-sm' :
                                            'border-gray-200'}`}
                                    onClick={() => handleTopicSelect(topic)}
                                >
                                    {selectedTopics.some(selected => selected.id === topic.id) && (
                                        <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                                            Выбрано
                                        </div>
                                    )}

                                    <div className="flex items-center mb-4 max-[485px]:m-0">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4
                                    ${selectedTopics.some(selected => selected.id === topic.id) ?
                                                'bg-indigo-100 text-indigo-600' :
                                                'bg-gray-100 text-gray-500'}`}
                                        >
                                            <span className="text-xl font-bold">{index + 1}</span>
                                        </div>
                                        <h3 className={`text-xl font-semibold max-[485px]:text-base 
                                    ${selectedTopics.some(selected => selected.id === topic.id) ?
                                                'text-indigo-700' :
                                                'text-gray-800'}`}
                                        >
                                            {topic.name}
                                        </h3>
                                    </div>

                                    <div className="flex justify-between items-center max-[485px]:hidden">
                                        <span className="text-sm text-gray-500">
                                            {selectedTopics.some(selected => selected.id === topic.id) ?
                                                '✓ Доступны сообщества' :
                                                'Сообщества по теме'}
                                        </span>
                                        {selectedTopics.some(selected => selected.id === topic.id) && (
                                            <span className="text-indigo-600 text-sm">✓</span>
                                        )}
                                    </div>
                                </article>
                                {
                                    errors && errors[`topics.${index}`] && <p className='mt-2 -mb-4 text-red-500'>{errors[`topics.${index}`]}</p>
                                }
                            </div>
                        ))}
                    </section>

                </InfiniteScroll>

                <div className="fixed bottom-6 max-md:bottom-20 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-full px-6 py-3 flex items-center text-nowrap">
                    <span className="mr-4 text-gray-700">
                        Выбрано: <span className="font-bold">{selectedTopics.length}{auth.user.user_feature_subscription.user_interest_count && `/${auth.user.user_feature_subscription.user_interest_count}`}</span>
                    </span>
                    <button
                        className={`px-6 py-2 rounded-full font-medium transition-colors
                            ${selectedTopics.length > 0 ?
                                'bg-indigo-600 text-white hover:bg-indigo-700' :
                                'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                        disabled={selectedTopics.length === 0}
                        onClick={() => onSubmit()}
                    >
                        Продолжить
                    </button>
                </div>
            </div>

        </Authenticated>
    )
}