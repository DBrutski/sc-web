"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SctpClientFSM_1 = require("./SctpClientFSM");
describe("Sctp FSM", function () {
    it("init FSM", function () {
        var machine = SctpClientFSM_1.SctpClientFSM();
        machine.handle("error");
        expect(machine.state).toBe("ERROR");
    });
});
