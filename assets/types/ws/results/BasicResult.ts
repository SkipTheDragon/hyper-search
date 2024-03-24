import {MessageTypes} from "../messages/MessageTypes";

export interface BasicResult {
    status: "success" | "error",
    type: MessageTypes,
    message?: string,
    extra: {
        executionTime: {
            took: string,
            tookRaw: number
        },
        total?: number
    },
}
