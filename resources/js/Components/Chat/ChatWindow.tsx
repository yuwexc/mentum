import { Send } from "lucide-react"
import { Avatar } from "../Profile/Avatar"
import { useState } from "react"
import { Message } from "./Message"

export const ChatWindow = () => {
    const [message, setMessage] = useState<string>('')

    return (
        <div className="bg-white rounded-xl flex flex-col overflow-y-scroll h-[calc(100vh-182.6px)]">
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                <Avatar photo={null} className="h-10 w-10" />
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Иван Иванов</h3>
                    {/* <p className="text-xs text-gray-400">в сети</p> */}
                </div>
            </div>

            <div className="flex-1 p-4 space-y-4 ">
                <Message isOwn={false} />
                <Message isOwn={true} />
                <Message isOwn={false} />
                <Message isOwn={true} />
                <Message isOwn={true} />
                <Message isOwn={true} />
                <Message isOwn={true} />
                <Message isOwn={true} />
                <Message isOwn={true} />
                <Message isOwn={true} />
                <Message isOwn={true} />
            </div>

            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Напишите сообщение..."
                        className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    )
}
