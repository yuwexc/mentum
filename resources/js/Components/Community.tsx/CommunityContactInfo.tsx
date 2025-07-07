import { Community } from "@/types/Community"
import { Contact, Globe, Mail } from "lucide-react";

export const CommunityContactInfo = ({ community }: { community: Community }) => {

    if (!community.email && !community.website) {
        return null;
    }

    return (
        <article className="w-full bg-white rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                <Contact className="w-4 h-4 text-indigo-500" />
                <h3 className="font-medium text-gray-800">Контакты сообщества</h3>
            </div>

            {
                community.email &&
                <p
                    className="flex items-center gap-3 text-sm hover:text-blue-600 transition-colors p-4"
                >
                    <Mail size={18} className="text-gray-400" />
                    <span className="text-gray-700">{community.email}</span>
                </p>

            }
            {
                community.website &&
                <a
                    href={community.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm hover:text-blue-600 transition-colors p-4"
                >
                    <Globe size={18} className="text-gray-400" />
                    <span className="text-gray-700">Сайт сообщества</span>
                </a>
            }
        </article>
    )
}