import { SctpClientFsm } from "./SctpClientFsm";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { SctpClientView } from "./SctpClientView";
export class SctpClientControl {
    constructor() {
        this.error = () => {
            this.fsm.handle("error");
        };
        this.con = () => {
            this.fsm.handle("con");
        };
        this.reconnect = () => {
            this.fsm.handle("reconnect");
        };
        this.render = () => {
            ReactDOM.render(React.createElement(SctpClientView, { state: this.fsm.state, reconnect: this.reconnect }), document.getElementById("sctp-reconnection"));
        };
        this.fsm = SctpClientFsm();
        this.fsm.on("transition", this.render);
    }
    onReconnect(fun) {
        this.fsm.on("reconnect", fun);
    }
}
