import { Community } from "@/types/Community"
import { Link } from "@inertiajs/react"
import { Edit, Settings, Users } from "lucide-react"

export const CommunityManagement = ({ community }: { community: Community }) => {
    return (
        <article className="w-full bg-white rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                <Settings className="w-4 h-4 text-indigo-500" />
                <h3 className="font-medium text-gray-800">Управление сообществом</h3>
            </div>

            <div className="divide-y divide-gray-100">
                {
                    !route().current("community.edit") &&
                    <Link
                        href={route("community.edit", { community: community.slug || community.id })}
                        className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors duration-150"
                    >
                        <Edit className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 text-sm">Редактировать сообщество</span>
                    </Link>
                }

                {
                    !route().current("community.members") &&
                    <Link
                        href={route('community.members', { community: community.slug || community.id })}
                        className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors duration-150"
                    >
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 text-sm">Управление участниками</span>
                    </Link>
                }
            </div>
        </article>
    )
}