import {SctpClientFsm} from "./SctpClientFsm";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {SctpClientView} from "./SctpClientView";

export class SctpClientControl {

    fsm;
    emit;

    constructor() {
        this.fsm = SctpClientFsm();
        this.emit = this.fsm.emit.bind(this.fsm, "reconnect");
        this.fsm.on("*", this.render);
    }

    error = () => {
        this.fsm.emit("error")
    };

    onReconnect(fun) {
        this.fsm.on("reconnect", fun)
    }

    con = () => {
        this.fsm.emit("con")
    };

    render = () => {
        ReactDOM.render(<SctpClientView state={this.fsm.state}
                                       reconnect={this.emit}/>,
            document.getElementById("sctp-reconnection"))
    }
}
