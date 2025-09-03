import { Search } from "lucide-react"
import { ChatListItem } from "./ChatListItem"

export const ChatList = () => {
    return (
        <section className="flex flex-col grow max-w-[768px] h-[calc(100vh-96.8px)] min-2xl:max-w-[560px] bg-white rounded-xl p-4">
            <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="font-bold text-lg text-gray-900">Чаты</h2>
                <div className="relative w-80">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Поиск..."
                        className="pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:border-transparent w-full"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-scroll space-y-2 pr-1">
                <ChatListItem />
                <ChatListItem />
                <ChatListItem />
                <ChatListItem />
                <ChatListItem />
                <ChatListItem />
                <ChatListItem />
                <ChatListItem />
                <ChatListItem />
                <ChatListItem />
                <ChatListItem />
                <ChatListItem />
                <ChatListItem />
                <ChatListItem />
                <ChatListItem />
                <ChatListItem />
                <ChatListItem />
                <ChatListItem />
                <ChatListItem />
                <ChatListItem />
                <ChatListItem />
                <ChatListItem />
                <ChatListItem />
                <ChatListItem />
                <ChatListItem />
                <ChatListItem />
                <ChatListItem />
            </div>
        </section>
    )
}
