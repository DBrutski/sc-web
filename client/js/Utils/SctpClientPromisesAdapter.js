var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SctpClientCreate } from "./sctp";
export function createSctpClientAdapter() {
    const sctpClientPromise = new Promise((success, fail) => {
        SctpClientCreate().done(success).fail(fail);
    });
    return new SctpClientOnPromises(sctpClientPromise);
}
export default class SctpClientOnPromises {
    constructor(sctpClientPromise) {
        this.sctpClientPromise = sctpClientPromise;
    }
    check_element() {
        return __awaiter(this, arguments, void 0, function* () {
            const sctpClient = yield this.sctpClientPromise;
            const args = arguments;
            return new Promise((success, fail) => sctpClient.check_element.apply(sctpClient, args).then(success, fail));
        });
    }
    create_node() {
        return __awaiter(this, arguments, void 0, function* () {
            const sctpClient = yield this.sctpClientPromise;
            const args = arguments;
            return new Promise((success, fail) => sctpClient.create_node.apply(sctpClient, args).then(success, fail));
        });
    }
    create_arc() {
        return __awaiter(this, arguments, void 0, function* () {
            const sctpClient = yield this.sctpClientPromise;
            const args = arguments;
            return new Promise((success, fail) => sctpClient.create_arc.apply(sctpClient, args).then(success, fail));
        });
    }
    create_link() {
        return __awaiter(this, arguments, void 0, function* () {
            const sctpClient = yield this.sctpClientPromise;
            const args = arguments;
            return new Promise((success, fail) => sctpClient.create_link.apply(sctpClient, args).then(success, fail));
        });
    }
    set_link_content() {
        return __awaiter(this, arguments, void 0, function* () {
            const sctpClient = yield this.sctpClientPromise;
            const args = arguments;
            return new Promise((success, fail) => sctpClient.set_link_content.apply(sctpClient, args).then(success, fail));
        });
    }
    get_link_content() {
        return __awaiter(this, arguments, void 0, function* () {
            const sctpClient = yield this.sctpClientPromise;
            const args = arguments;
            return new Promise((success, fail) => sctpClient.get_link_content.apply(sctpClient, args).then(success, fail));
        });
    }
    event_emit() {
        return __awaiter(this, arguments, void 0, function* () {
            const sctpClient = yield this.sctpClientPromise;
            const args = arguments;
            return new Promise((success, fail) => sctpClient.event_emit.apply(sctpClient, args).then(success, fail))
                .then(console.log.bind(undefined, "Event "));
        });
    }
    iterate_elements(iterator_type, args) {
        return __awaiter(this, arguments, void 0, function* () {
            const sctpClient = yield this.sctpClientPromise;
            const args = arguments;
            return new Promise((success, fail) => sctpClient.iterate_elements.apply(sctpClient, args).then(success, fail));
        });
    }
    iterate_constr() {
        return __awaiter(this, arguments, void 0, function* () {
            const sctpClient = yield this.sctpClientPromise;
            const args = arguments;
            return new Promise((success, fail) => sctpClient.iterate_constr.apply(sctpClient, args).then(success, fail));
        });
    }
    find_element_by_system_identifier() {
        return __awaiter(this, arguments, void 0, function* () {
            const sctpClient = yield this.sctpClientPromise;
            const args = arguments;
            return new Promise((success, fail) => sctpClient.find_element_by_system_identifier.apply(sctpClient, args).then(success, fail));
        });
    }
    event_create() {
        return __awaiter(this, arguments, void 0, function* () {
            const sctpClient = yield this.sctpClientPromise;
            const args = arguments;
            return new Promise((success, fail) => sctpClient.event_create.apply(sctpClient, args).then(success, fail));
        });
    }
    event_destro() {
        return __awaiter(this, arguments, void 0, function* () {
            const sctpClient = yield this.sctpClientPromise;
            const args = arguments;
            return new Promise((success, fail) => sctpClient.event_destro.apply(sctpClient, args).then(success, fail));
        });
    }
    erase_element() {
        return __awaiter(this, arguments, void 0, function* () {
            const sctpClient = yield this.sctpClientPromise;
            const args = arguments;
            return new Promise((success, fail) => sctpClient.erase_element.apply(sctpClient, args).then(success, fail));
        });
    }
    ;
    get_element_type() {
        return __awaiter(this, arguments, void 0, function* () {
            const sctpClient = yield this.sctpClientPromise;
            const args = arguments;
            return new Promise((success, fail) => sctpClient.get_element_type.apply(sctpClient, args).then(success, fail));
        });
    }
    get_arc() {
        return __awaiter(this, arguments, void 0, function* () {
            const sctpClient = yield this.sctpClientPromise;
            const args = arguments;
            return new Promise((success, fail) => sctpClient.get_arc.apply(sctpClient, args).then(success, fail));
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            const sctpClient = yield this.sctpClientPromise;
            return sctpClient.socket.close();
        });
    }
}
