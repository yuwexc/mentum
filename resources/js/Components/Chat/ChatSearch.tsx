import { Search, X } from "lucide-react"
import { useState } from "react"

export const ChatSearch = () => {

    const [search, setSearch] = useState<boolean>(false);

    if (search) {

        return (
            <div className="relative w-80 flex items-center">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                    type="text"
                    placeholder="Поиск..."
                    className="pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:border-transparent w-full"
                />
                <button onClick={() => setSearch(false)} className="flex justify-center items-center h-[37.6px] aspect-square">
                    <X size={18} className="text-gray-400" />
                </button>
            </div>
        )
    }

    return (
        <button onClick={() => setSearch(true)} className="flex justify-center items-center bg-indigo-50 h-[37.6px] aspect-square border border-indigo-100 rounded-lg">
            <Search
                size={18}
                className="text-indigo-400"
            />
        </button>
    )
}