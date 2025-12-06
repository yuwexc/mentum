import { ChatCreate } from "../../Components/Chat/ChatCreate"
import { ChatListItem } from "../../Components/Chat/ChatListItem"
import { ChatSearch } from "../../Components/Chat/ChatSearch"

export const ChatList = () => {

    return (
        <section className="flex flex-col grow max-w-[768px] h-[calc(100vh-96.8px)] min-2xl:max-w-[560px] bg-white rounded-xl p-4">
            <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="ml-2 font-bold text-lg text-gray-900">Диалоги</h2>
                <div className="flex items-stretch gap-3">
                    <ChatSearch />
                    <ChatCreate />
                </div>
            </div>

            <div className="flex-1 overflow-y-scroll space-y-2 pr-1">
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
