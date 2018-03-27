import * as jQuery from "jquery";

/**
 * Resolve sc-keynodes via sys-id and save it in this
 * @param sctpClient - already initialized sctp client
 * @param keynodesToResolve - array of sys-id.
 * sys-id: string | [sys-id: string, property: string]
 * property - key for saving in keynodes object
 * @constructor
 */
export function ScKeynodes(sctpClient, keynodesToResolve) {
    this.sctpClient = sctpClient;
    this.keynodes = keynodesToResolve ||
        ['ui_nrel_command_template',
            'question',
            'ui_menu_view_full_semantic_neighborhood_in_the_agreed_part_of_kb',
            'ui_menu_view_full_semantic_neighborhood',
            'nrel_system_identifier',
            'nrel_main_idtf',
            'nrel_idtf',
            'nrel_answer',
            'ui_user',
            'ui_user_registered',
            'ui_main_menu',
            'ui_user_command_class_atom',
            'ui_user_command_class_noatom',
            'ui_external_languages',
            'ui_rrel_command_arguments',
            'ui_rrel_command',
            'ui_nrel_command_result',
            'ui_nrel_user_answer_formats',
            'nrel_ui_commands_decomposition',
            'ui_command_initiated',
            'ui_command_finished',
            'ui_nrel_user_used_language',
            'ui_nrel_user_default_ext_language',
            'languages',
            'lang_ru',
            'binary_types',
            'binary_float',
            'binary_int8',
            'binary_int16',
            'binary_int32',
            'binary_int64',
            'format_pdf',
            'format_png',
            'format_html',
            'nrel_format',
            'nrel_command_order',
            'nrel_command_access',
            'nrel_authorised_user',
            'nrel_registered_user',
            'nrel_administrator',
            'nrel_manager',
            'nrel_expert',
            'ui_user_command_with_context']
};

ScKeynodes.prototype.init = function () {
    return this.resolveArrayOfKeynodes(this.keynodes);
};

/**
 * Resolve sc-addr using sys-id and save it in object using property as a key
 * (default: property = sys-id)
 * @param sysIdtf - sys-id
 * @param property - key for saving
 * @returns {*}
 */
ScKeynodes.prototype.resolveKeynode = function (sysIdtf, property) {
    const dfd = new jQuery.Deferred();
    const self = this;

    this.sctpClient.find_element_by_system_identifier(sysIdtf).done(function (res) {

        console.log('Resolved keynode: ' + sysIdtf + ' = ' + res);
        if (property) {
            self[property] = res;
        } else {
            self[sysIdtf] = res;
        }

        dfd.resolve(res);
    }).fail(function () {
        console.error("Can't resolve keynode ",sysIdtf);
        dfd.reject();
    });

    return dfd.promise();
};

/**
 * Resolve array of sc-addr
 * @param sysIdtfs - array of sys-id.
 * sys-id: string | [sys-id: string, property: string]
 * @returns {*}
 */
ScKeynodes.prototype.resolveArrayOfKeynodes = function (sysIdtfs) {
    if (!sysIdtfs || !Array.isArray(sysIdtfs))
        throw new Error(`incorect type of argumet. expected: array, actual ${sysIdtfs}`);
    const dfd = new jQuery.Deferred();
    const self = this;
    let promises = sysIdtfs.map((val) => this._executeSysIdtf(val));
    $.when.apply($, promises
    ).done(function () {
        dfd.resolve(self);
    }).fail(function () {
        throw "Can't resolve keynode";
    });

    return dfd.promise();
};

ScKeynodes.prototype._executeSysIdtf = function (val) {
    if (Array.isArray(val)) {
        if (val.length !== 2)
            throw new Error("incorrect keynode");
        return this.resolveKeynode(val[0], val[1])
    } else if (typeof (val) === "string") {
        return this.resolveKeynode(val);
    } else
        throw new Error(`illegal argument. expected array | string. actual ${val}`)
};

ScKeynodes.prototype.getSysIdtfByAddress = function (scAddr) {
    let sysIdtf = Object.keys(this).map((key) => [key, this[key]]).find((tuple) => tuple[1] === scAddr);
    if (sysIdtf) {
        return sysIdtf[0];
    } else {
        console.log(`Address of ${scAddr} is not resolved`);
        return undefined;
    }
};

export default ScKeynodes;
