import { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";
import { Calendar, Globe, ExternalLink } from "lucide-react";

export const AddInfo = () => {

    const { profile } = usePage<PageProps>().props;

    if (!profile || (!profile.user.website && !profile.user.show_birthdate)) {
        return null;
    }

    return (
        <article className="w-full bg-white rounded-xl p-2 hidden max-[920px]:block">
            {
                profile.user.show_birthdate &&
                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors max-sm:hover:bg-transparent">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-md">
                        <Calendar size={16} className="text-indigo-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-0.5">Дата рождения</p>
                        <p className="text-sm font-medium text-gray-900">
                            {profile.user.birthdate_formatted}
                        </p>
                    </div>
                </div>
            }
            {
                profile.user.website && (
                    <a
                        href={profile.user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors group"
                    >
                        <div className="flex items-center justify-center w-8 h-8 bg-green-50 rounded-md">
                            <Globe size={16} className="text-green-600" />
                        </div>
                        <div className="flex-1 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5">Веб-сайт</p>
                                <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                                    {profile.user.website.replace(/^https?:\/\//, '')}
                                </p>
                            </div>
                            <ExternalLink size={14} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                        </div>
                    </a>
                )
            }
        </article>
    );
}