import Arguments from "../Core/Arguments";
import EventManager from "../Core/EventManager";
import Main from "../Core/Main";
import Server from "../Core/Server";
import * as jQuery from "jquery";
const Menu = {
    _items: null,

    /*!
     * Initialize menu in user interface
     * @param {Object} params Parameters for menu initialization.
     * There are required parameters:
     * - menu_container_id - id of dom element that will contains menu items
     * - menu_commands - object, that represent menu command hierachy (in format returned from server)
     */
    init: function (params) {
        const dfd = new jQuery.Deferred();
        const self = this;

        this.menu_container_id = '#' + params.menu_container_id;

        // register for translation updates
        EventManager.subscribe("translation/get", this, function (objects) {
            const items = self.getObjectsToTranslate();
            for (let i in items) {
                objects.push(items[i]);
            }
        });
        EventManager.subscribe("translation/update", this, function (names) {
            self.updateTranslation(names);
        });

        context.init({
            //fadeSpeed: 100,
            //filter: null,
            //above: 'auto',
            preventDoubleContext: true,
            //compress: false,
            container: '#main-container'
        });
        context.attach('[sc_addr]', this._contextMenu);

        this._build(params.menu_commands);
        dfd.resolve();
        return dfd.promise();
    },

    _build: function (menuData) {

        this._items = [];

        let menuHtml = '<ul class="nav navbar-nav">';

        //TODO: change to children, remove intermediate 'childs'
        if (menuData.hasOwnProperty('childs')) {
            for (let i in menuData.childs) {
                const subMenu = menuData.childs[i];
                menuHtml += this._parseMenuItem(subMenu);
            }
        }

        menuHtml += '</ul>';

        $(this.menu_container_id).append(menuHtml);

        this._registerMenuHandler();
    },

    _parseMenuItem: function (item) {

        this._items.push(item.id);

        let itemHtml = '';
        if (item.cmd_type === 'cmd_noatom') {
            itemHtml = '<li class="dropdown"><a sc_addr="' + item.id + '" id="' + item.id + '" class="menu-item menu-cmd-noatom dropdown-toggle" data-toggle="dropdown" href="#" ><span clas="text">' + item.id + '</span><b class="caret"></b></a>';
        } else if (item.cmd_type === 'cmd_atom') {
            itemHtml = '<li><a id="' + item.id + '"sc_addr="' + item.id + '" class="menu-item menu-cmd-atom" >' + item.id + '</a>';
        } else {
            itemHtml = '<li><a id="' + item.id + '"sc_addr="' + item.id + '" class="menu-item menu-cmd-keynode" >' + item.id + '</a>';
        }

        if (item.hasOwnProperty('childs')) {
            itemHtml += '<ul class="dropdown-menu">';
            for (let i in item.childs) {
                const subMenu = item.childs[i];
                itemHtml += this._parseMenuItem(subMenu);
            }
            itemHtml += '</ul>';
        }
        return itemHtml + '</li>';
    },

    _registerMenuHandler: function () {

        $('.menu-item').click(function () {
            const sc_addr = $(this).attr('sc_addr');
            if ($(this).hasClass('menu-cmd-atom')) {
                SCWeb.core.Main.doCommand(sc_addr, Arguments._arguments);
            } else if ($(this).hasClass('menu-cmd-keynode')) {
                Main.doDefaultCommand([sc_addr]);
            }
        });
    },

    _sort: function () {

    },

    _contextMenu: function (target) {
        const dfd = new jQuery.Deferred();
        const args = Arguments._arguments.slice();
        args.push(target.attr('sc_addr'));
        Server.contextMenu(args, function (data) {

            const parseMenuItem = function (item, parentSubmenu) {
                const menu_item = {};
                menu_item.action = function (e) {
                    Main.doCommand(item, args);
                };

                menu_item.text = item;
                parentSubmenu.push(menu_item);
            };

            const menu = [];
            for (let i in data) {
                parseMenuItem(data[i], menu);
            }

            const applyTranslation = function (item, id, text) {
                if (item.text === id) {
                    item.text = text;
                }
                if (item.subMenu) {
                    for (let i in item.subMenu) {
                        applyTranslation(item.subMenu[i], id, text);
                    }
                }
            };

            Server.resolveIdentifiers(data, function (namesMap) {

                for (let itemId in namesMap) {
                    if (namesMap.hasOwnProperty(itemId)) {
                        for (let i in menu) {
                            applyTranslation(menu[i], itemId, namesMap[itemId]);
                        }
                    }
                }

                // sort menu
                menu.sort(function (a, b) {
                    if (a.text > b.text)
                        return 1;
                    if (a.text < b.text)
                        return -1;
                    return 0;
                });

                menu.unshift({
                    text: '<span class="glyphicon glyphicon-pushpin" aria-hidden="true"></span>',
                    action: function (e) {
                        Arguments.appendArgument(target.attr('sc_addr'));
                    }
                });

                dfd.resolve(menu);
            });
        });

        return dfd.promise();
    },

    // ---------- Translation listener interface ------------
    updateTranslation: function (namesMap) {
        // apply translation
        $(this.menu_container_id + ' [sc_addr]').each(function (index, element) {
            const addr = $(element).attr('sc_addr');
            if (namesMap[addr]) {
                $(element).text(namesMap[addr]);
            }
        });

    },

    /**
     * @return Returns list obj sc-elements that need to be translated
     */
    getObjectsToTranslate: function () {
        return this._items;
    }
};
export default Menu
