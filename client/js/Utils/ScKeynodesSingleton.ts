import {SctpClientCreate} from "./sctp";
import {ScKeynodes} from "./ScKeynodes";
import * as R from "ramda";

export const createScKeynodes: () => Promise<ScKeynodes> = R.memoize(async function () {
    const sctpClient = await new Promise((success, fail) => {
        SctpClientCreate().done(success).fail(fail)
    });
    return Promise.resolve(new ScKeynodes(sctpClient));
});
