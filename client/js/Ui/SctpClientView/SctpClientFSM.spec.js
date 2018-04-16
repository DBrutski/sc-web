"use strict";
exports.__esModule = true;
var SctpClientFsm_1 = require("./SctpClientFsm");
describe("Sctp FSM", function () {
    it("init FSM", function () {
        var machine = SctpClientFsm_1.SctpClientFsm();
        machine.handle("error");
        expect(machine.state).toBe("ERROR");
    });
});
