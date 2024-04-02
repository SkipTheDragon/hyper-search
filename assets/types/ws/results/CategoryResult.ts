import {BasicResult} from "./BasicResult";

export interface CategoryResult extends BasicResult {
    items: {
        name: string,
        bgColor: string,
        icon: string
    }[]
}
