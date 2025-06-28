import { Pagination } from "./Pagination";
import { Topic } from "./Topic";

export interface CreateUserInterestsProps {
    list: TopicData,
    user_interests: Topic[]
}

interface TopicData extends Pagination {
    data: Topic[]
}