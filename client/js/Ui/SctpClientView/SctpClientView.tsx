import * as React from "react";
import {CSSProperties, MouseEventHandler} from "react";

interface SctpClientViewProps {
    state: string;
    reconnect: MouseEventHandler<any>;
}

export class SctpClientView extends React.Component<SctpClientViewProps, any> {
    render() {
        return (
            <div style={this.styles()}>
                Reconect
                {this.props.state === "ERROR" && <button onClick={this.props.reconnect}>Reconnect</button>}
            </div>
        )
    }

    private isVisible() {
        if (this.props.state === "INIT") return false;
        if (this.props.state === "CONNECTED") return false;
        if (this.props.state === "ERROR") return true;
        if (this.props.state === "CONNECTION") return true;

    }

    private styles(): CSSProperties {
        return {
            display: this.isVisible() ? "block" : "none",
            position: "fixed",
            bottom: "10%",
            right: "5%",
            zIndex: 1000
        };
    }
}
