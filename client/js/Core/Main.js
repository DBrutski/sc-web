import "../Utils/sctp";
import {ScKeynodes} from "../Utils/ScKeynodes";
import {Arguments} from "./Arguments";
import {CommandState} from "./ComponentSandbox";
import {ComponentManager} from "./ComponentManager";
import {Core} from "../Ui/Core";
import {Server} from "./Server";
import {TaskPanel} from "../Ui/TaskPanel";
import {Translation} from "./Translation";
import {WindowManager} from "../Ui/WindowManager";
import {ScHelper} from "../Utils/ScHelper";
import * as jQuery from "jquery";
import {SctpClientCreate, SctpIteratorType} from "../Utils/sctp";
import "../Utils/ScTypes"
import {parseURL} from "../Utils/parseURL";

export const Main = {

    window_types: [],
    idtf_modes: [],
    menu_commands: {},

    /**
     * Initialize sc-web core and ui
     * @param {Object} params Initializetion parameters.
     * There are required parameters:
     * - menu_container_id - id of dom element, that will contains menu items
     */
    init: function (params) {
        const dfd = new jQuery.Deferred();

        const self = this;
        //Locker.show();

        Server._initialize();
        SctpClientCreate().done(function (client) {

            window.sctpClient = client;
            window.scHelper = new ScHelper(window.sctpClient);
            window.scKeynodes = new ScKeynodes(window.sctpClient);

            window.scKeynodes.init().done(function () {
                window.scHelper.init().done(function () {

                    if (window._unit_tests)
                        window._unit_tests();

                    $.when(TaskPanel.init()).done(function () {
                        Server.init(function (data) {
                            self.menu_commands = data.menu_commands;
                            self.user = data.user;

                            data.menu_container_id = params.menu_container_id;
                            data.menu_container_eekb_id = params.menu_container_eekb_id;

                            Translation.fireLanguageChanged(self.user.current_lang);

                            $.when(Core.init(data),
                                ComponentManager.init(),
                                Translation.update()
                            )
                                .done(function () {
                                    dfd.resolve();

                                    const url = parseURL(window.location.href);

                                    if (url.searchObject) {
                                        const question = url.searchObject['question'];
                                        if (question) {
                                            /// @todo Check question is realy a question
                                            const commandState = new CommandState(question, null, null);
                                            WindowManager.appendHistoryItem(question, commandState);
                                            return;
                                        }
                                    }

                                    Server.resolveScAddr(['ui_start_sc_element'], function (addrs) {

                                        function start(a) {
                                            Main.doDefaultCommand([a]);
                                            if (params.first_time)
                                                $('#help-modal').modal({"keyboard": true});
                                        }

                                        const argumentAddr = addrs['ui_start_sc_element'];
                                        window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3F_A_A, [argumentAddr, sc_type_arc_pos_const_perm, 0])
                                            .done(function (res) {
                                                start(res[0][2]);
                                            }).fail(function () {
                                            start(argumentAddr);
                                        });

                                    });
                                });
                        });
                    });
                });

            });
        });


        return dfd.promise();
    },

    _initUI: function () {

    },

    /**
     * Returns sc-addr of preffered output language for current user
     */
    getDefaultExternalLang: function () {
        return this.user['default_ext_lang'];
    },

    /**
     * Initiate user interface command
     * @param {String} cmd_addr sc-addr of user command
     * @param {Array} cmd_args Array of sc-addrs with command arguments
     */
    doCommand: function (cmd_addr, cmd_args) {
        Arguments.clear();
        Server.doCommand(cmd_addr, cmd_args, function (result) {
            if (result.question) {
                const commandState = new CommandState(cmd_addr, cmd_args);
                WindowManager.appendHistoryItem(result.question, commandState);
            } else if (result.command !== undefined) {

            } else {
                alert("There are no any answer. Try another request");
            }
        });
    },

    doCommandWithPromise: function (command_state) {
        return new Promise(function (resolve, reject) {
            Server.doCommand(command_state.command_addr, command_state.command_args, function (result) {
                if (result.question) {
                    resolve(result.question)
                } else if (result.command !== undefined) {

                } else {
                    reject("There are no any answer. Try another request");
                }
            })
        });
    },

    getTranslatedAnswer: function (command_state) {
        return new Promise(function (resolve, reject) {
            Main.doCommandWithPromise(command_state).then(function (question_addr) {
                Server.getAnswerTranslated(question_addr, command_state.format, function (answer) {
                    resolve(answer.link);
                })
            })
        })
    },

    /**
     * Initiate user natural language command
     * @param {String} query Natural language query
     */

    doTextCommand: function (query) {
        Server.textCommand(query, function (result) {
            if (result.question !== undefined) {
                const commandState = new CommandState(null, null, null);
                WindowManager.appendHistoryItem(result.question, commandState);
            } else if (result.command !== undefined) {

            } else {
                alert("There are no any answer. Try another request");
            }
        });
    },

    /**
     * Initiate default user interface command
     * @param {Array} cmd_args Array of sc-addrs with command arguments
     */
    doDefaultCommand: function (cmd_args) {
        this.doCommand(this.default_cmd(), cmd_args);
    },

    default_cmd: function () {
        if (this.user.is_authenticated) {
            return window.scKeynodes['ui_menu_view_full_semantic_neighborhood'];
        } else {
            return window.scKeynodes['ui_menu_view_full_semantic_neighborhood_in_the_agreed_part_of_kb'];
        }
    }

};
