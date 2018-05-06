import * as Core from "./Core/index";
import * as Ui from "./Ui/index";
import * as Utils from "./Utils/index";
import * as R from "ramda";
export const core = Core;
export const ui = Ui;
export const utils = Utils;
export * from "./Utils/index";

// Promise.prototype.done = Promise.prototype.then;
// Promise.prototype.fail = Promise.prototype.catch;

window.utils = Object.assign({__esModule: true},utils);

// Export legacy global objects
const keys = [
    'SctpCommandType',
    'SctpResultCode',
    'SctpIteratorType',
    'SctpEventType',
    'String2ArrayBuffer',
    'ArrayBuffer2String',
    'SctpConstrIter',
    'SctpClient',
    'SctpClientCreate',
    'TripleUtils',
    'fQueue'
];

const scTypeRegExp = /^sc_type.*/;
const scTypesKeys = R.filter(scTypeRegExp.test.bind(scTypeRegExp), R.keys(utils));

const legacyKeys = scTypesKeys.concat(keys);
const legacySelectors = R.map(R.prop, legacyKeys);
const legacyValues = R.juxt(legacySelectors)(utils);
const legacy = R.zipObj(legacyKeys, legacyValues);
Object.assign(window, legacy);
