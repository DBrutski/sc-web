"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var machina_1 = require("machina");
function SctpClientFSM() {
    return new machina_1.default.FSM({
        namespaces: "SctpClientFSM",
        initialState: "INIT",
        states: {
            INIT: {
                error: "ERROR",
                succ: "CONNECTED"
            },
            ERROR: {
                connect: "CONNECTION"
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
exports.SctpClientFSM = SctpClientFSM;
