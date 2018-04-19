import {SctpClientCreate} from "./sctp";


export function createSctpClientAdapter() {
    const sctpClientPromise = new Promise((success, fail) => {
        SctpClientCreate().done(success).fail(fail)
    });
    return new SctpClientOnPromises(sctpClientPromise);
}

export default class SctpClientOnPromises {
    private sctpClientPromise;

    constructor(sctpClientPromise) {

        this.sctpClientPromise = sctpClientPromise;
    }

    async check_element() {
        const sctpClient = await this.sctpClientPromise;
        const args = arguments;
        return new Promise((success, fail) => sctpClient.check_element.apply(sctpClient, args).then(success, fail));
    }

    async create_node(type: number) {
        const sctpClient = await this.sctpClientPromise;
        const args = arguments;
        return new Promise((success, fail) => sctpClient.create_node(type).then(success, fail));
    }

    async create_arc(type: number, src: number, trg: number): Promise<any> {
        const sctpClient = await this.sctpClientPromise;
        const args = arguments;
        return new Promise((success, fail) => sctpClient.create_arc.apply(sctpClient, args).then(success, fail));
    }

    async create_link() {
        const sctpClient = await this.sctpClientPromise;
        const args = arguments;
        return new Promise((success, fail) => sctpClient.create_link.apply(sctpClient, args).then(success, fail));
    }

    async set_link_content() {
        const sctpClient = await this.sctpClientPromise;
        const args = arguments;
        return new Promise((success, fail) => sctpClient.set_link_content.apply(sctpClient, args).then(success, fail));
    }

    async get_link_content() {
        const sctpClient = await this.sctpClientPromise;
        const args = arguments;
        return new Promise((success, fail) => sctpClient.get_link_content.apply(sctpClient, args).then(success, fail));
    }

    async event_emit() {
        const sctpClient = await this.sctpClientPromise;
        const args = arguments;
        return new Promise((success, fail) => sctpClient.event_emit.apply(sctpClient, args).then(success, fail))
            .then(console.log.bind(undefined, "Event "));
    }

    async iterate_elements(iterator_type: number, args: Array<number>) {
        const sctpClient = await this.sctpClientPromise;
        return new Promise((success, fail) => sctpClient.iterate_elements(iterator_type, args).then(success, fail));
    }

    async iterate_constr(iterators: Array<any>) {
        const sctpClient = await this.sctpClientPromise;
        const args = arguments;
        return new Promise((success, fail) => sctpClient.iterate_constr.apply(sctpClient, args).then(success, fail));
    }

    async find_element_by_system_identifier() {
        const sctpClient = await this.sctpClientPromise;
        const args = arguments;
        return new Promise((success, fail) => sctpClient.find_element_by_system_identifier.apply(sctpClient, args).then(success, fail));
    }

    async event_create() {
        const sctpClient = await this.sctpClientPromise;
        const args = arguments;
        return new Promise((success, fail) => sctpClient.event_create.apply(sctpClient, args).then(success, fail));
    }

    async event_destro() {
        const sctpClient = await this.sctpClientPromise;
        const args = arguments;
        return new Promise((success, fail) => sctpClient.event_destro.apply(sctpClient, args).then(success, fail));
    }

    async erase_element(addr: number) {
        const sctpClient = await this.sctpClientPromise;
        const args = arguments;
        return new Promise((success, fail) => sctpClient.erase_element.apply(sctpClient, args).then(success, fail))
    };

    async get_element_type() {
        const sctpClient = await this.sctpClientPromise;
        const args = arguments;
        return new Promise((success, fail) => sctpClient.get_element_type.apply(sctpClient, args).then(success, fail));
    }

    async get_arc(arc: number): Promise<any> {
        const sctpClient = await this.sctpClientPromise;
        return new Promise((success, fail) => sctpClient.get_arc(arc).then(success, fail));
    }

    async close() {
        const sctpClient = await this.sctpClientPromise;
        return sctpClient.socket.close();
    }
}
