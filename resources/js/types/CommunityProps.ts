import { Community } from "./Community";
import { User } from "./User";

export interface CommunityProps {
    community: Community,
    isMyCommunity?: boolean,
    members: User[]
}