import "./startup";

import * as Core from "core";
import * as Ui from "ui";
import * as Utils from "utils";
import * as R from "ramda";
export const core = Core;
export const ui = Ui;
export const utils = Utils;

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
    'TripleUtils'
];

const scTypeRegExp = /^sc_type.*/;
const scTypesKeys = R.filter(scTypeRegExp.test.bind(scTypeRegExp), R.keys(utils));

const legacyKeys = scTypesKeys.concat(keys);
const legacySelectors = R.map(R.prop, legacyKeys);
const legacyValues = R.juxt(legacySelectors)(utils);
const legacy = R.zipObj(scTypesKeys, legacyValues);
Object.assign(window, legacy);
