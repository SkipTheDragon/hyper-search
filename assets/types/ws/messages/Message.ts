import {Payloads} from "./payloads/Payloads";
import {MessageTypes} from "./MessageTypes";

export interface Message<T extends Payloads> {
    type: MessageTypes
    payload: T
}
