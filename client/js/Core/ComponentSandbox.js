/**
 * Create new instance of component sandbox.
 * @param {String} container Id of dom object, that will contain component
 * @param {String} addr sc-addr of sc-link or sc-structure, that edit or viewed with sandbox
 * @param {Boolean} is_struct If that value is true, then addr is a sc-addr to viewed structure; otherwise the last one is a sc-link
 * @param {String} format_addr sc-addr of window format
 * @param {String} ext_lang_addr sc-addr of external language
 * @param {Object} keynodes Dictionary that contains keynode addr by system identifiers
 */
import Arguments from "./Arguments";
import Core from "../Ui/Core";
import EventManager from "./EventManager";
import Main from "./Main";
import Server from "./Server";
import Translation from "./Translation";
import WindowManager from "../Ui/WindowManager";
import * as jQuery from "jquery";
import "../Utils/ScTypes"
import {SctpIteratorType} from "../Utils/sctp";

export const scAddrsDict = {};

export const CommandState = function (command_addr, command_args, format) {
    this.command_addr = command_addr;
    this.command_args = command_args || [];
    this.format = format;
};

export const ComponentSandbox = function (options) {

    this.command_state = options.command_state;
    this.container = options.container;
    this.container_selector = "#" + Core.selectorWindowScAddr(options.window_id);
    this.wrap_selector = '#' + this.container + '_wrap';
    this.addr = parseInt(options.addr);
    this.is_struct = options.is_struct;
    this.format_addr = options.format_addr;
    this.is_editor = options.canEdit;

    this.eventGetObjectsToTranslate = null;
    this.eventApplyTranslation = null;
    this.eventArgumentsUpdate = null;
    this.eventWindowActiveChanged = null;
    this.eventDataAppend = null;

    /* function (added, element, arc)
     * - added - true, when element added; false - element removed
     * - element - sc-addr of added(removed) sc-element
     * - arc - sc-addr of arc that connect struct with element
     */
    this.eventStructUpdate = null;

    this.event_add_element = null;
    this.event_remove_element = null;

    this.listeners = [];
    this.keynodes = options.keynodes;

    const self = this;
    this.listeners = [];
    this.childs = {};

    this.createWindowControls();

    // listen arguments
    this.listeners.push(EventManager.subscribe("arguments/add", this, this.onArgumentAppended));
    this.listeners.push(EventManager.subscribe("arguments/remove", this, this.onArgumentRemoved));
    this.listeners.push(EventManager.subscribe("arguments/clear", this, this.onArgumentCleared));

    // listen translation
    this.listeners.push(EventManager.subscribe("translation/update", this, this.updateTranslation));
    this.listeners.push(EventManager.subscribe("translation/get", this, function (objects) {
        const items = self.getObjectsToTranslate();
        for (let i in items) {
            objects.push(items[i]);
        }
    }));

    // listen struct changes
    /// @todo possible need to wait event creation
    if (this.is_struct) {
        window.sctpClient.event_create(SctpEventType.SC_EVENT_ADD_OUTPUT_ARC, this.addr, function (addr, arg) {
            if (self.eventStructUpdate) {
                self.eventStructUpdate(true, addr, arg);
            }
        }).done(function (id) {
            self.event_add_element = id;
        });
        window.sctpClient.event_create(SctpEventType.SC_EVENT_REMOVE_OUTPUT_ARC, this.addr, function (addr, arg) {
            if (self.eventStructUpdate) {
                self.eventStructUpdate(false, addr, arg);
            }
        }).done(function (id) {
            self.event_remove_element = id;
        });
    }
};

ComponentSandbox.prototype = {
    constructor: ComponentSandbox
};

// ------------------ Core functions --------------------------
/**
 * Destroys component sandbox
 */
ComponentSandbox.prototype.destroy = function () {
    for (let l in this.listeners) {
        EventManager.unsubscribe(this.listeners[l]);
    }

    /// @todo possible need to wait event destroy
    if (this.event_add_element)
        window.sctpClient.event_destroy(this.event_add_element);
    if (this.event_remove_element)
        window.sctpClient.event_destroy(this.event_remove_element);
};

/**
 * Create controls for window
 */
ComponentSandbox.prototype.createWindowControls = function () {
    /*var html = '<button type="button" class="button-menu btn btn-default btn-xs" data-toggle="button"><span class="caret"></span></button>\
     <div class="btn-group-vertical btn-group-xs hidden"> \
     <button type="button" class="btn btn-success"><span class="glyphicon glyphicon-tags"></span></button> \
     </div>';
     var self = this;
     var controls = $(this.wrap_selector + ' > .sc-content-controls');
     controls.append(html).find('.button-menu').on('click', function() {
     controls.find('.btn-group-vertical').toggleClass('hidden');
     });*/

};

// ------------------ Functions to call from component --------

ComponentSandbox.prototype.canEdit = function () {
    return this.is_editor;
};

ComponentSandbox.prototype.getCurrentLanguage = function () {
    return Translation.getCurrentLanguage();
};

/*!
 * @param {Array} args Array of sc-addrs of commnad arguments.
 */
ComponentSandbox.prototype.doDefaultCommand = function (args) {
    Main.doDefaultCommand(args);
};

/*! Resolves sc-addr for all elements with attribute sc_control_sys_idtf
 */
ComponentSandbox.prototype.resolveElementsAddr = function (parentSelector) {
    Core.resolveElementsAddr(parentSelector);
};

/*!
 * Genarate html for new window container
 * @param {String} containerId ID that will be set to container
 * @param {String} classes Classes that will be added to container
 * @param {String} addr sc-addr of window
 */
ComponentSandbox.prototype.generateWindowContainer = function (containerId, containerClasses, controlClasses, addr) {

    return WindowManager.generateWindowContainer(containerId, containerClasses, controlClasses, addr);
};

/*! Returns keynode by it system identifier
 * @param {String} sys_idtf System identifier
 * @returns If keynodes exist, then returns it sc-addr; otherwise returns null
 */
ComponentSandbox.prototype.getKeynode = function (sys_idtf) {
    const res = this.keynodes[sys_idtf];
    if (res) {
        return res;
    }
    return null;
};

ComponentSandbox.prototype.getIdentifiers = function (addr_list, callback) {
    Server.resolveIdentifiers(addr_list, callback);
};

ComponentSandbox.prototype.getIdentifier = function (addr, callback) {
    Server.resolveIdentifiers([addr], function (idtfs) {
        callback(idtfs[addr]);
    });
};

ComponentSandbox.prototype.getLinkContent = function (addr, callback_success, callback_error) {
    Server.getLinkContent(addr, callback_success, callback_error);
};

ComponentSandbox.prototype.resolveAddrs = function (idtf_list, callback) {

    const addrsToResolve = [];
    const result = {};
    for (let idx in idtf_list) {
        const idtf = idtf_list[idx];
        const addr = scAddrsDict[idtf];
        if (addr)
            result[idtf] = addr;
        else
            addrsToResolve.push(idtf);
    }

    Server.resolveScAddr(addrsToResolve, function (data) {

        for (let key in data) {
            if (data.hasOwnProperty(key))
                scAddrsDict[key] = data[key];
        }
        callback(scAddrsDict);
    });
};

ComponentSandbox.prototype._appendChilds = function (windows) {
    for (let cntId in windows) {
        if (!windows.hasOwnProperty(cntId))
            continue;
        if (this.childs[cntId])
            throw "Duplicate child container " + cntId;
        this.childs[cntId] = windows[cntId];
    }
};

ComponentSandbox.prototype.removeChild = function removeChild() {
    this.childs = {};
};

ComponentSandbox.prototype.updateAnswer = function () {
    const performAnswer = jQuery.proxy(function (answer_addr) {
        this.addr = answer_addr;
        this.removeChild();
    }, this);
    return Main.getTranslatedAnswer(this.command_state)
        .then(performAnswer);
};


/**
 * Create viewers for specified sc-links
 * @param {Object} containers_map Map of viewer containers (key: sc-link addr, value: id of container)
 */
ComponentSandbox.prototype.createViewersForScLinks = function (containers_map) {
    const dfd = new jQuery.Deferred();
    const self = this;
    WindowManager.createViewersForScLinks(containers_map).done(function (windows) {
        self._appendChilds(windows);
        dfd.resolve(windows);
    }).fail(dfd.reject);

    return dfd.promise();
};

/**
 * Create viewers for specified sc-structures
 * @param {Object} containers_map Map of viewer containers (id: id of container, value: {key: sc-struct addr, ext_lang_addr: sc-addr of external language}})
 */
ComponentSandbox.prototype.createViewersForScStructs = function (containers_map) {
    const windows = WindowManager.createViewersForScStructs(containers_map);
    this._appendChilds(windows);
    return windows;
};

/*! Function takes content of sc-link or sctructure from server and call event handlers
 * {String} contentType type of content data (@see SctpClient.getLinkContent). If it's null, then
 * data will be returned as string
 */
ComponentSandbox.prototype.updateContent = function (contentType) {
    const dfd = new jQuery.Deferred();
    const self = this;

    if (this.is_struct && this.eventStructUpdate) {
        window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3F_A_A,
            [
                this.addr,
                sc_type_arc_pos_const_perm,
                0
            ])
            .done(function (res) {
                for (let idx in res)
                    self.eventStructUpdate(true, res[idx][0], res[idx][1]);

                dfd.resolve();
            });
    }
    else {
        window.sctpClient.get_link_content(this.addr, contentType)
            .done(function (data) {
                $.when(self.onDataAppend(data)).then(
                    function () {
                        dfd.resolve();
                    },
                    function () {
                        dfd.reject();
                    }
                );
            })
            .fail(function () {
                dfd.reject();
            });
    }

    return dfd.promise();
};

// ------ Translation ---------
/**
 * This function returns list of objects, that can be translated.
 * Just for internal usage in core.
 */
ComponentSandbox.prototype.getObjectsToTranslate = function () {
    if (this.eventGetObjectsToTranslate)
        return this.eventGetObjectsToTranslate();

    return [];
};

/**
 * This function apply translation to component.
 * Just for internal usage in core
 * @param {Object} translation_map Dictionary of translation
 */
ComponentSandbox.prototype.updateTranslation = function (translation_map) {
    if (this.eventApplyTranslation)
        this.eventApplyTranslation(translation_map);
};

// ----- Arguments ------
ComponentSandbox.prototype._fireArgumentsChanged = function () {
    if (this.eventArgumentsUpdate)
        this.eventArgumentsUpdate(Arguments._arguments.slice(0));
};

/**
 * Calls when new argument added
 * @param {String} argument sc-addr of argument
 * @param {Integer} idx Index of argument
 */
ComponentSandbox.prototype.onArgumentAppended = function (argument, idx) {
    this._fireArgumentsChanged();
};

/**
 * Calls when new argument removed
 * @param {String} argument sc-addr of argument
 * @param {Integer} idx Index of argument
 */
ComponentSandbox.prototype.onArgumentRemoved = function (argument, idx) {
    this._fireArgumentsChanged();
};

/**
 * Calls when arguments list cleared
 */
ComponentSandbox.prototype.onArgumentCleared = function () {
    this._fireArgumentsChanged();
};

// --------- Window -----------
ComponentSandbox.prototype.onWindowActiveChanged = function (is_active) {
    if (this.eventWindowActiveChanged)
        this.eventWindowActiveChanged(is_active);
};

// --------- Data -------------
ComponentSandbox.prototype.onDataAppend = function (data) {
    const dfd = new jQuery.Deferred();

    if (this.eventDataAppend) {
        const self = this;
        $.when(this.eventDataAppend(data)).then(
            function () {
                $.when(Translation.translate(self.getObjectsToTranslate())).done(
                    function (namesMap) {
                        self.updateTranslation(namesMap);
                        dfd.resolve();
                    });
                //dfd.resolve();
            },
            function () {
                dfd.reject();
            });

    } else {
        dfd.resolve();
    }

    return dfd.promise();
};
export default ComponentSandbox
