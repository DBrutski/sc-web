"use strict";
exports.__esModule = true;
var machina = require("machina");
function SctpClientFsm() {
    return new machina.Fsm({
        namespaces: "SctpClientFsm",
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
exports.SctpClientFsm = SctpClientFsm;
