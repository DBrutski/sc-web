import {Main} from "../Core/Main";
import {Server} from "../Core/Server";
import * as jQuery from "jquery";

export const SearchPanel = {

    init: function () {
        const dfd = new jQuery.Deferred();
        const self = this;

        let keynode_nrel_main_idtf = null;
        let keynode_nrel_idtf = null;
        let keynode_nrel_system_idtf = null;

        $('.typeahead').typeahead({
                minLength: 3,
                highlight: true,
            },
            {
                name: 'idtf',
                source: function (query, cb) {
                    $('#search-input').addClass('search-processing');
                    Server.findIdentifiersSubStr(query, function (data) {
                        let keys = [];

                        const addValues = function (key) {
                            const list = data[key];
                            if (list) {
                                for (let idx in list) {
                                    const value = list[idx];
                                    keys.push({name: value[1], addr: value[0], group: key});
                                }
                            }
                        };

                        addValues('sys');
                        addValues('main');
                        addValues('common');

                        cb(keys);
                        $('#search-input').removeClass('search-processing');
                    });
                },
                displayKey: 'name',
                templates: {
                    suggestion: function (item) {

                        //glyphicon glyphicon-globe
                        const html = '';
                        if (item.group === 'common') {
                            return '<p class="sc-content">' + item.name + '</p>';
                        } else {
                            let cl = 'glyphicon glyphicon-user';
                            if (item.group === 'sys') {
                                cl = 'glyphicon glyphicon-globe';
                            }
                            return '<p><span class="tt-suggestion-icon ' + cl + '"></span>' + item.name + '</p>';
                        }
                        return '<p>' + item.name + '</p>';
                    }
                }
            }
        ).bind('typeahead:selected', function (evt, item, dataset) {
            if (item && item.addr) {
                Main.doDefaultCommand([item.addr]);
            }
            evt.stopPropagation();
            $('.typeahead').val('');
        }).keypress(function (event) {
            if (event.which === 13) {
                Main.doTextCommand($(this).val());
                $('#search-input').val('');
            }
        });

        Server.resolveScAddr(['nrel_main_idtf', 'nrel_idtf', 'nrel_system_identifier'], function (addrs) {
            keynode_nrel_main_idtf = addrs['nrel_main_idtf'];
            keynode_nrel_idtf = addrs['nrel_idtf'];
            keynode_nrel_system_idtf = addrs['nrel_system_identifier'];

            dfd.resolve();
        });

        return dfd.promise();
    },

};
