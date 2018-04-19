import * as React from "react";
export class SctpClientView extends React.Component {
    render() {
        return (React.createElement("div", { style: this.styles() },
            "Reconect",
            this.props.state === "ERROR" && React.createElement("button", { onClick: this.props.reconnect }, "Reconnect")));
    }
    isVisible() {
        if (this.props.state === "INIT")
            return false;
        if (this.props.state === "CONNECTED")
            return false;
        if (this.props.state === "ERROR")
            return true;
        if (this.props.state === "CONNECTION")
            return true;
    }
    styles() {
        return {
            display: this.isVisible() ? "block" : "none",
            position: "fixed",
            bottom: "10%",
            right: "5%",
            zIndex: 1000
        };
    }
}
