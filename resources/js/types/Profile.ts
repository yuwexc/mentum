import { Community } from "./Community";
import { Post } from "./Post";
import { Topic } from "./Topic";
import { User } from "./User";

export type ProfileProps = {
    user: User;
    interests?: Topic[],
    isMyProfile?: boolean,
    followings?: {
        list: Community[],
        hasMore: boolean
    },
    interactions?: Interaction,
    interaction_status?: {
        id: string,
        code: string,
        initiator_id: string
    }
};

export type Interaction = {
    friends: {
        list: User[],
        hasMore: boolean
    },
    requests: {
        id: string,
        user: User
    }[],
}