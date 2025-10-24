import { Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip"

export const ChatCreate = () => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger
                    className="flex justify-center items-center bg-indigo-500 h-[37.6px] aspect-square rounded-full"
                >
                    <Plus
                        size={18}
                        className="text-white"
                        strokeWidth={2.5}
                    />
                </TooltipTrigger>
                <TooltipContent>
                    <p>Новый диалог</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}