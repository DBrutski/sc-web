var SctpClientStates;
(function (SctpClientStates) {
    SctpClientStates[SctpClientStates["INIT"] = 1] = "INIT";
    SctpClientStates[SctpClientStates["CONNECTED"] = 2] = "CONNECTED";
    SctpClientStates[SctpClientStates["CONNECTION"] = 3] = "CONNECTION";
    SctpClientStates[SctpClientStates["ERROR"] = 4] = "ERROR";
})(SctpClientStates || (SctpClientStates = {}));
export default SctpClientStates;
