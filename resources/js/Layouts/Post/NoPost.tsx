import { ArrowUp, MessageSquare } from "lucide-react"

export const NoPost = ({ is_owner, owner_type }: { is_owner: boolean, owner_type: string }) => {
    if (is_owner) {
        return (
            <article className="w-full rounded-xl bg-white p-6 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-full mb-3">
                    <ArrowUp size={28} className="text-indigo-500" />
                </div>
                <h3 className="font-bold text-lg text-indigo-600">Создайте первый пост</h3>
                {
                    owner_type == 'user' && <p className="text-gray-500 text-sm mt-1">
                        Поделитесь чем-то с вашими подписчиками, чтобы начать общение
                    </p>
                }
                {
                    owner_type == 'community' && <p className="text-gray-500 text-sm mt-1">
                        Поделитесь чем-то с вашим сообществом, чтобы начать общение
                    </p>
                }
            </article>


        )
    }

    return (
        <article className="w-full rounded-xl bg-white p-6 flex flex-col items-center justify-center text-center">
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-full mb-3">
                <MessageSquare size={28} className="text-indigo-400" />
            </div>
            <h3 className="font-bold text-lg text-indigo-600">Пока нет постов</h3>
            {
                owner_type == 'user' && <p className="text-gray-500 text-sm mt-1">
                    Здесь будут появляться публикации автора
                </p>
            }
            {
                owner_type == 'community' && <p className="text-gray-500 text-sm mt-1">
                    Здесь будут появляться публикации сообщества
                </p>
            }
        </article>
    )
}