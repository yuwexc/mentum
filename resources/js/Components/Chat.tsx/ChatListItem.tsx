import { Avatar } from "../Profile/Avatar"

export const ChatListItem = () => {
    return (
        <div
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
        >
            <Avatar
                photo={null}
                className="h-12 w-12"
            />
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    Иван Иванов
                </h3>
                <p className="text-sm text-gray-600 truncate">
                    Привет! Как дела? Давно не общались...
                </p>
            </div>
            <div className="flex flex-col items-end gap-1">
                <p className="text-xs text-gray-400">12:30</p>
                <p className="h-5 w-5 bg-indigo-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                </p>
            </div>
        </div>
    )
}
