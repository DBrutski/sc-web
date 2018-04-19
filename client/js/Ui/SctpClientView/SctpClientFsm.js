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
                reconnect: function () {
                    this.emit("reconnect");
                    this.transition("CONNECTION");
                }
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
