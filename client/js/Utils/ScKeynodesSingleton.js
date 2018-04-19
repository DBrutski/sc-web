var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SctpClientCreate } from "./sctp";
import { ScKeynodes } from "./ScKeynodes";
export function createScKeynodes() {
    return __awaiter(this, void 0, void 0, function* () {
        const sctpClient = yield new Promise((success, fail) => {
            SctpClientCreate().done(success).fail(fail);
        });
        return Promise.resolve(new ScKeynodes(sctpClient));
    });
}
