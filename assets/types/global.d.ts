export {};

declare global {
    interface Window {
        config: {
            app: {
                host: string,
                websocket: string
            }
        };
    }
}
