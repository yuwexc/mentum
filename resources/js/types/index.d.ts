import { CommentInterface } from "./Comment";
import { Community } from "./Community";
import { CommunityProps } from "./CommunityProps";
import { CreateUserInterestsProps } from "./CreateUserInterestsProps";
import { FeatureSubscription } from "./FeatureSubscription";
import { GoogleUser } from "./GoogleUser";
import { ProfileProps } from "./Profile";
import { Topic } from "./Topic";
import { User } from "./User";

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User
    },
    google_user?: GoogleUser,

    profile?: ProfileProps,
    topics?: CreateUserInterestsProps,
    topicsList?: Topic[],
    features_subscriptions?: FeatureSubscription[]

    communities?: Community[],
    community?: CommunityProps,

    friends?: {
        list: User[],
        user: User
    }

    flash?: {
        error?: string;
        success?: string;
        info?: string
    },

    comment?: CommentInterface
};
