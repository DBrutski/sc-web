import "./startup";

import * as Core from "./Core/index";
import * as Ui from "./Utils/index";
import * as Utils from  "./Utils/index";
export const core = Core;
export const ui = Ui;
export const utils = Utils;

import * as sctp from "./Utils/sctp"

Object.assign(window, sctp);

