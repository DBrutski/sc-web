"use strict";
exports.__esModule = true;
var SctpClientStates;
(function (SctpClientStates) {
    SctpClientStates[SctpClientStates["INIT"] = 1] = "INIT";
    SctpClientStates[SctpClientStates["CONNECTED"] = 2] = "CONNECTED";
    SctpClientStates[SctpClientStates["CONNECTION"] = 3] = "CONNECTION";
    SctpClientStates[SctpClientStates["ERROR"] = 4] = "ERROR";
})(SctpClientStates || (SctpClientStates = {}));
exports["default"] = SctpClientStates;
