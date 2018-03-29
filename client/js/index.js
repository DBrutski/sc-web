import "./startup";

import * as Core from "./Core/index";
import * as Ui from "./Ui/index";
import * as Utils from  "./Utils/index";
export const core = Core;
export const ui = Ui;
export const utils = Utils;

import * as sctp from "./Utils/sctp"
import {TripleUtils} from "./Utils/TripleUtils"
import * as scTypes from "./Utils/ScTypes"

Object.assign(window, sctp, scTypes);
window.TripleUtils = TripleUtils;

