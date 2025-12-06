import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { Button } from "@/Components/ui/button";
import Authenticated from "@/Screens/AuthenticatedScreen";
import { PageProps } from "@/types";
import { FeatureSubscription } from "@/types/FeatureSubscription";
import { Head, usePage } from "@inertiajs/react";
import { AlertCircleIcon, Check, Zap } from "lucide-react";

export default function CreateUserFeatureSubscription() {

    const { auth, features_subscriptions, errors } = usePage<PageProps>().props;

    const isSubscribed: FeatureSubscription = auth.user.user_feature_subscription;

    return (
        <Authenticated>
            <Head title=" - Оформить подписку" />

            <div className="min-w-full px-28 max-lg:px-14 max-md:px-10 max-sm:px-4 py-8">
                <div className="flex flex-col items-center text-center mb-6 gap-4">
                    <h2 className="scroll-m-20 text-4xl font-medium tracking-tight text-balance">Выберите подписку</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Получите доступ к эксклюзивным функциям и расширенным возможностям
                    </p>
                </div>

                {errors.subscription && (
                    <Alert variant="destructive" className='mb-6 max-sm:mb-4'>
                        <AlertCircleIcon className='stroke-red-400' />
                        <AlertTitle>Ошибка</AlertTitle>
                        <AlertDescription>
                            {errors.subscription}
                        </AlertDescription>
                    </Alert>
                )}

                <section className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-6 max-sm:gap-4 mb-16">
                    {features_subscriptions && features_subscriptions.map((item, index) => (
                        <article
                            key={index}
                            className={`flex flex-col gap-4 bg-white border-2 rounded-xl p-6 max-md:p-4 transition-all duration-300 hover:shadow-md hover:border-indigo-300 cursor-pointer relative overflow-hidden 
        ${isSubscribed.feature_subscription_type == item.feature_subscription_type ?
                                    'border-indigo-500 bg-indigo-50 shadow-sm ring-1 ring-indigo-200' :
                                    'border-gray-200'}`}
                        >
                            {isSubscribed.feature_subscription_type == item.feature_subscription_type && (
                                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg">
                                    Активна
                                </div>
                            )}

                            <div className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4
            ${isSubscribed.feature_subscription_type == item.feature_subscription_type ?
                                        'bg-indigo-100 text-indigo-600' :
                                        'bg-gray-100 text-gray-500'}`}
                                >
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className={`text-xl font-semibold 
                ${isSubscribed.feature_subscription_type == item.feature_subscription_type ?
                                            'text-indigo-700' :
                                            'text-gray-800'}`}
                                    >
                                        {item.name}
                                    </h3>
                                </div>
                            </div>

                            <div className="space-y-3 mb-2">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Check className="w-4 h-4 text-indigo-500" />
                                    {
                                        item.user_interest_count ?
                                            <span>Выбор до {item.user_interest_count} тем</span>
                                            :
                                            <span>Доступны все темы</span>
                                    }
                                </div>

                                <div className="flex items-center gap-2 text-gray-600">
                                    <Check className="w-4 h-4 text-indigo-500" />
                                    {
                                        item.community_subscription_count ?
                                            <span>Подписка на {item.community_subscription_count} сообществ</span>
                                            :
                                            <span>Доступны все сообщества</span>
                                    }
                                </div>

                                <div className="flex items-center gap-2 text-gray-600">
                                    <Check className="w-4 h-4 text-indigo-500" />
                                    {
                                        item.community_ownership_count ?
                                            <span>Создание {item.community_ownership_count} сообщества</span>
                                            :
                                            <span>Создание неограниченного количества сообществ</span>
                                    }
                                </div>

                                {item.user_subscription_count && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Check className="w-4 h-4 text-indigo-500" />
                                        <span>Подписка на {item.user_subscription_count} пользователей</span>
                                    </div>
                                )}

                                {item.can_subscribe_any_user && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Check className="w-4 h-4 text-indigo-500" />
                                        <span>Подписка на любого пользователя</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto">
                                <div className="border-t border-gray-200 pt-4 flex flex-col items-center">
                                    {item.price ? (
                                        <>
                                            <div className={`text-2xl font-bold text-indigo-600`}
                                            >
                                                {item.price} ₽
                                                <span className="text-sm font-normal text-gray-600"> / месяц</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-indigo-600 text-2xl">Бесплатно</div>
                                    )}
                                </div>
                            </div>

                            <Button
                                variant={"outline"}
                                className={
                                    isSubscribed.feature_subscription_type === item.feature_subscription_type ?
                                        "w-full bg-indigo-100 hover:bg-indigo-100 text-indigo-700 border-indigo-200 hover:text-indigo-700"
                                        :
                                        "w-full bg-indigo-600 hover:bg-indigo-700 text-white hover:text-white border-transparent"
                                }
                                disabled={isSubscribed.feature_subscription_type == item.feature_subscription_type}
                            >
                                {
                                    isSubscribed.feature_subscription_type === item.feature_subscription_type ?
                                        'Текущая подписка'
                                        :
                                        'Оформить подписку'
                                }
                            </Button>
                        </article>
                    ))}
                </section>
            </div>

        </Authenticated>
    )
}