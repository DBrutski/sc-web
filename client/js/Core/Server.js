import EventManager from "./EventManager";
import AppCache from "../Utils/AppCache";
import {SctpConstrIter, SctpIteratorType} from "../Utils/sctp";
import * as R from "ramda";



const Server = {
    _semanticNeighborhood: {
        commandId: 'ui_menu_view_full_semantic_neighborhood',
        commandAddr: null
    },

    _listeners: [],
    _task_queue: [], // array of server tasks
    _task_active_num: 0, // number of active tasks
    _task_max_active_num: 10, // maximum number of active tasks
    _task_timeout: 0, // timer id for tasks queue
    _task_frequency: 100, // task timer frequency

    _current_language: null,
    _identifiers_cache: null,
    _sys_identifiers_cache: null,

    _initialize: function () {
        const expire = 1000 * 60 * 5; // five minutes expire
        this._identifiers_cache = new AppCache({
            expire: expire,
            max: 3000
        });

        this._sys_identifiers_cache = new AppCache({
            expire: expire,
            max: 3000
        });

        EventManager.subscribe("translation/changed_language", this, function (lang_addr) {
            Server._current_language = parseInt(lang_addr);
        });
    },

    /*!
     * Append new listener to server tasks
     * @param {Object} listener Listener object.
     * It must have such functions as:
     * - taskStarted - function that calls on new task started. No any arguments
     * - taskFinished - function that calls on new task finished. No any arguments
     */
    appendListener: function (listener) {
        if (this._listeners.indexOf(listener) === -1) {
            this._listeners.push(listener);
        }
    },

    /*!
     * Removes specified listener
     * @param {Object} listener Listener object to remove
     */
    removeListener: function (listener) {
        const idx = this._listeners.indexOf(listener);
        if (idx >= 0) {
            this._listeners.splice(idx, 1);
        }
    },

    /*!
     * Notify all registere listeners task started
     */
    _fireTaskStarted: function () {
        for (let i = 0; i < this._listeners.length; ++i) {
            $.proxy(this._listeners[i].taskStarted(), this._listeners[i]);
        }
    },

    /*!
     * Notify all registered listeners on task finished
     */
    _fireTaskFinished: function () {
        for (let i = 0; i < this._listeners.length; ++i) {
            $.proxy(this._listeners[i].taskFinished(), this._listeners[i]);
        }
    },

    /*!
     * Push new task for processing
     * @param {Object} task Object, that represents server task.
     * It contains properties such as:
     * - type - Type of ajax request (GET/POST)
     * - url - Url to call on server
     * - data - Object, that contains request parameters
     * - success - Callback function to call on success
     * - error - Callback function to call on error
     */
    _push_task: function (task) {
        this._fireTaskStarted();
        this._task_queue.push(task);

        if (!this._task_timeout) {
            const self = this;
            this._task_timeout = window.setInterval(function () {
                const tasks = self._pop_tasks();

                for (let idx in tasks) {
                    const task = tasks[idx];
                    self._task_active_num++;
                    $.ajax({
                        url: task.url,
                        data: task.data,
                        type: task.type,
                        success: task.success,
                        error: task.error,
                        complete: function () {
                            Server._fireTaskFinished();
                            self._task_active_num--;
                        }
                    });
                }

            }, this._task_frequency)
        }
    },

    /**
     * Get tasks from queue for processing.
     * It returns just tasks, that can be processed for that moment.
     * Number of returned tasks is min(_task_max_active_num - _task_active_num, _task_queue.length)
     */
    _pop_tasks: function () {
        const task_num = this._task_max_active_num - this._task_active_num;
        const res = [];
        for (let i = 0; i < Math.min(task_num, this._task_queue.length); ++i) {
            res.push(this._task_queue.shift());
        }

        if (this._task_queue.length === 0) {
            window.clearInterval(this._task_timeout);
            this._task_timeout = 0;
        }

        return res;
    },

    // ----------------------

    /*!
     * Get initial data from server
     *
     * @param {Function} callback Calls on request finished successfully. This function
     * get recieved data from server as a parameter
     */
    init: function (callback) {
        $.ajax({
            url: '/api/user/',
            data: null,
            type: 'GET',
            success: function (user) {
                window.scHelper.getMenuCommands(window.scKeynodes['ui_main_menu']).done(function (menu_commands) {
                    const data = {};
                    data['menu_commands'] = menu_commands;
                    data['user'] = user;

                    window.scHelper.getLanguages().done(function (langs) {
                        data['languages'] = langs;

                        window.scHelper.getOutputLanguages().done(function (out_langs) {
                            data['external_languages'] = out_langs;

                            window.scHelper.getMenuCommands(window.scKeynodes
                                .menu_eekb).done(function (menu_eekb) {
                                data['menu_eekb'] = menu_eekb;

                                callback(data);
                            });
                        });
                    });
                });
            }
        });
    },

    /*!
     *
     * @param {Array} objects List of sc-addrs to resolve identifiers
     * @param {Function} callback
     */
    resolveIdentifiers: function (objects, callback) {

        if (objects.length === 0) {
            callback({});
            return; // do nothing
        }

        const self = this;

        function getKey(addr) {
            return self._current_language + '/' + addr;
        }

        const result = {},
            used = {};
        let urlEncodedArguments = '';
        let idx = 1;
        for (let i in objects) {
            const id = objects[i];

            if (used[id]) continue; // skip objects, that was processed
            used[id] = true;

            const cached = this._identifiers_cache.get(getKey(id));
            if (cached) {
                if (cached !== '.') {
                    result[id] = cached;
                }
                continue;
            }

            if (idx > 1)
                urlEncodedArguments = urlEncodedArguments + '&';
            urlEncodedArguments = urlEncodedArguments + idx + '_=' + id;
            idx++;
        }

        if (urlEncodedArguments.length === 0) { // all results cached
            callback(result);
        } else {

            this._push_task({
                type: "POST",
                url: "api/idtf/resolve/",
                data: urlEncodedArguments,
                success: function (idtfs) {
                    for (let k in idtfs) {
                        if (idtfs.hasOwnProperty(k)) {
                            result[k] = idtfs[k];
                        }
                    }

                    callback(result);
                },
                error: function () {
                    callback({});
                }
            });
        }
    },

    _makeArgumentsList: function(arguments_list) {
        let urlEncodedArguments = {};
        for (let i = 0; i < arguments_list.length; i++) {
            const arg = arguments_list[i];
            urlEncodedArguments[i.toString() + '_'] = arg;
        }
        return urlEncodedArguments;
    },

    contextMenu: function (arguments_list, callback) {
        const argumentsList = this._makeArgumentsList(arguments_list);

        this._push_task({
            type: "GET",
            url: "api/context/",
            data: argumentsList,
            success: callback
        });
    },

    checkCommandArgument: function (cmd_addr, arguments_length) {
        return new Promise((resolve, reject) => {
            window.sctpClient.iterate_constr(
                SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,
                    [parseInt(cmd_addr),
                        sc_type_arc_common | sc_type_const,
                        sc_type_node | sc_type_const | sc_type_node_struct,
                        sc_type_arc_pos_const_perm,
                        window.scKeynodes['ui_nrel_command_template']
                    ],
                    {"contour": 2}),
                SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,
                    [window.scKeynodes.question,
                        sc_type_arc_access | sc_type_var | sc_type_arc_pos | sc_type_arc_perm,
                        sc_type_node | sc_type_var,
                        sc_type_arc_pos_const_perm,
                        "contour"
                    ],
                    {"instance": 2}),
                SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,
                    ["instance",
                        sc_type_var,
                        sc_type_node | sc_type_const,
                        sc_type_arc_pos_const_perm,
                        "contour"
                    ],
                    {"arg": 2})
            ).done(function (results) {
                let argsPromise = results.results.map((arg, index) => {
                    let addr = results.get(index, "arg");
                    return window.scHelper.getSystemIdentifierPromise(addr);
                });
                Promise.all(argsPromise).then(values => {
                    let commandArguments = values.filter((element) => {
                        return element.search(/^ui_arg_\d+$/i) === 0;
                    });
                    if (commandArguments.length === arguments_length) {
                        resolve();
                    } else {
                        reject("wrong commandArguments");
                    }
                });
            }).fail(function () {
                reject("fail in search");
            });
        });
    },

    /*! Function to initiate user command on server
     * @param {cmd_addr} sc-addr of command
     * @param {output_addr} sc-addr of output language
     * @param {arguments_list} List that contains sc-addrs of command arguments
     * @param {callback} Function, that will be called with recieved data
     */
    doCommand: function (cmd_addr, arguments_list, callback) {

        let length = arguments_list.length;
        const promise = this.checkCommandArgument(cmd_addr, length);
        promise.then(
            (result) => {
                const cmdArguments = this._makeArgumentsList(arguments_list);
                cmdArguments['cmd'] = cmd_addr;

                this._push_task({
                    type: "POST",
                    url: "api/cmd/do/",
                    data: cmdArguments,
                    success: callback
                });
            }, (fail) => {
                alert(fail);
            });
    },

    /*! Function to initiate natural language query on server
     * @param {String} query Natural language query
     * @param {callback} Function, that will be called with recieved data
     */
    textCommand: function (query, callback) {

        const cmdArguments = {};
        cmdArguments['query'] = query;

        this._push_task({
            type: "POST",
            url: "api/cmd/text/",
            data: cmdArguments,
            success: callback
        });
    },

    /*! Function to get answer translated into specified format
     * @param {question_addr} sc-addr of question to get answer translated
     * @param {format_addr} sc-addr of format to translate answer
     * @param {callback} Function, that will be called with received data in specified format
     */
    getAnswerTranslated: function (question_addr, format_addr, callback) {
        this._push_task({
            type: "POST",
            url: "api/question/answer/translate/",
            data: {
                "question": question_addr,
                "format": format_addr
            },
            success: callback
        });
    },


    /*!
     * Function that resolve sc-addrs for specified sc-elements by their system identifiers
     * @param {identifiers} List of system identifiers, that need to be resolved
     * @param {callback} Callback function that calls, when sc-addrs resovled. It
     * takes object that contains map of resolved sc-addrs as parameter
     */
    resolveScAddr: function (idtfList, callback) {
        const self = this;
        let urlEncodedArguments = '';
        const need_resolve = [],
            result = {},
            used = {};

        for (let i = 0; i < idtfList.length; i++) {
            const arg = idtfList[i];

            const cached = this._sys_identifiers_cache.get(arg);
            if (cached) {
                result[arg] = cached;
                continue;
            }

            if (used[arg]) continue;
            used[arg] = true;

            urlEncodedArguments += need_resolve.length.toString() + '_=' + arg + '&';
            need_resolve.push(arg);
        }

        if (need_resolve.length === 0) {
            callback(result);
        } else {
            (function (result, addresses, need_resolve, callback) {
                self._push_task({
                    type: "POST",
                    url: "api/addr/resolve/",
                    data: addresses,
                    success: function (addrs) {
                        for (let i in need_resolve) {
                            const key = need_resolve[i];
                            const addr = addrs[key];
                            if (addr) {
                                self._sys_identifiers_cache.set(key, addr);
                                result[key] = addr;
                            }
                        }
                        callback(result);
                    }
                });
            })(result, urlEncodedArguments, need_resolve, callback);
        }
    },

    /*!
     * Function that get sc-link data from server
     * @param {Array} links List of sc-link addrs to get data
     * @param {Function} success Callback function, that recieve map of
     * resolved sc-links format (key: sc-link addr, value: format addr).
     * @param {Function} error Callback function, that calls on error
     */
    getLinksFormat: function (links, success, error) {
        let urlEncodedLinks = '';
        for (let i = 0; i < links.length; i++) {
            const arg = links[i];
            urlEncodedLinks += i.toString() + '_=' + arg + '&';
        }

        this._push_task({
            type: "POST",
            url: "api/link/format/",
            data: urlEncodedLinks,
            success: success
        });
    },

    /**
     * Returns data of specified content
     * @param {String} addr sc-addr of sc-link to get data
     * @param {Function} callback Callback function, that recieve data.
     * @param {Function} error Callback function, that calls on error
     */
    getLinkContent: function (addr, success, error) {
        this._push_task({
            url: "api/link/content/",
            type: "GET",
            data: {
                "addr": addr
            },
            success: success,
            error: error
        });
    },

    /**
     * Returns list of available natural languages
     */
    getLanguages: function (callback) {
        this._push_task({
            url: "api/languages/",
            type: "GET",
            data: null,
            success: callback
        });
    },

    /**
     * Setup default natular language for user
     * @param {String} lang_addr sc-addr of new language to setup
     */
    setLanguage: function (lang_addr, callback) {
        this._push_task({
            url: "api/languages/set/",
            type: "POST",
            data: {
                "lang_addr": lang_addr
            },
            success: callback
        });
    },

    /**
     * Request identifiers that contains specified substring
     * @param str Substring to find
     */
    findIdentifiersSubStr: function (str, callback) {

        $.ajax({
            url: "api/idtf/find/",
            data: {
                "substr": str
            },
            type: "GET",
            success: callback
        });
    },

    /**
     * Request tooltip content for specified sc-elements
     */
    getTooltips: function (addrs, success, error) {
        let urlEncodedTooltips = '';
        for (let i = 0; i < addrs.length; i++) {
            const arg = addrs[i];
            urlEncodedTooltips += i.toString() + '_=' + arg + '&';
        }

        $.ajax({
            type: "POST",
            url: "api/info/tooltip/",
            data: urlEncodedTooltips,
            success: success,
            error: error
        });
    }
};
export default Server
