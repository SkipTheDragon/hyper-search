import {Payloads} from "./payloads/Payloads";
import {MessageTypes} from "./MessageTypes";

export interface Message<T extends Payloads> {
    id?: number
    type: MessageTypes
    payload?: T
}
