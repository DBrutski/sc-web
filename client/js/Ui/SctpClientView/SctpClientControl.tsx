import {SctpClientFsm} from "./SctpClientFsm";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {SctpClientView} from "./SctpClientView";

export class SctpClientControl {

    fsm;
    emit;

    constructor() {
        this.fsm = SctpClientFsm();
        this.fsm.on("transition", this.render);
    }

    error = () => {
        this.fsm.handle("error")
    };

    onReconnect(fun) {
        this.fsm.on("reconnect", fun)
    }

    con = () => {
        this.fsm.handle("con")
    };

    reconnect = () => {
        this.fsm.handle("reconnect");
    };

    render = () => {
        ReactDOM.render(<SctpClientView state={this.fsm.state}
                                        reconnect={this.reconnect}/>,
            document.getElementById("sctp-reconnection"))
    }
}
