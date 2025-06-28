import { Topic } from "./Topic";
import { User } from "./User";

export type ProfileProps = {
    user: User;
    interests?: Topic[],
    isMyProfile?: boolean;
};