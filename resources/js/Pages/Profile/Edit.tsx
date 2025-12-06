import { AvatarFormUpdate } from "@/Components/Profile/AvatarFormUpdate";
import { PersonalDataFormUpdate } from "@/Components/Profile/PersonalDataFormUpdate";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/Components/ui/accordion";
import EditProfileScreen from "@/Screens/EditProfileScreen";
import { CircleUserRound, Image } from "lucide-react";

export default function Edit() {

    return (
        <EditProfileScreen>
            <div className='w-[calc(100%-4rem)] flex flex-col gap-4 py-4 px-8 max-lg:w-full'>
                <h2 className='font-medium text-lg'>Ваш профиль</h2>
                <Accordion type="multiple" defaultValue={["item-2"]}>
                    <AccordionItem value="item-1" className="border-b-0">
                        <AccordionTrigger className="w-full">
                            <div className="flex items-center gap-2">
                                <Image size={18} strokeWidth={1.5} color="#4338ca" />
                                <h3 className="font-medium">Фото профиля</h3>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="w-fit px-6 max-sm:w-full max-sm:px-0">
                            <AvatarFormUpdate />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="border-b-0">
                        <AccordionTrigger className="w-full">
                            <div className="flex items-center gap-2">
                                <CircleUserRound size={18} strokeWidth={1.5} color="#4338ca" />
                                <h3 className="font-medium">Персональные данные</h3>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <PersonalDataFormUpdate />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </EditProfileScreen>
    );
}
