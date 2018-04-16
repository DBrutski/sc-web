import machina from "machina";

new machina.FSM({
    namespaces: "SctpClientFSM",
    initialState: "INIT",
    states: {
        INIT: {
            onError: function () {
                this.transition("ERROR")
            }
        }
    }
})
