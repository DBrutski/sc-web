import {SctpClientFsm} from "./SctpClientFsm";
describe("Sctp FSM", function () {
   it("init FSM", function () {
       const machine = SctpClientFsm();
       machine.handle("error");
       expect(machine.state).toBe("ERROR");
   }) 
});