import * as machina from "machina";

export function SctpClientFsm() {
    return new machina.Fsm({
        namespaces: "SctpClientFsm",
        initialState: "INIT",
        states: {
            INIT: {
                error: "ERROR",
                con: "CONNECTED"
            },
            ERROR: {
                reconnect: "CONNECTION"
            },
            CONNECTION: {
                error: "ERROR",
                con: "CONNECTED"
            },
            CONNECTED: {
                error: "ERROR"
            }
        }
    });
}
