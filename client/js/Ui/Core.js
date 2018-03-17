import Arguments from "../Core/Arguments";
import ArgumentsPanel from "./ArgumentsPanel";
import LanguagePanel from "./LanguagePanel";
import Main from "../Core/Main";
import Menu from "./Menu";
import SearchPanel from "./SearchPanel";
import Server from "../Core/Server";
import UserPanel from "./UserPanel";
import WindowManager from "./WindowManager";
const Core = {

    init: function(data, callback) {
        var self = this;
        var dfd = new jQuery.Deferred();

        this.tooltip_interval = null;
        this.tooltip_element = null;

        function clearTooltipInterval() {
            if (self.tooltip_interval) {
                clearInterval(self.tooltip_interval);
                self.tooltip_interval = null;
            }
        }

        function destroyTooltip() {
            if (self.tooltip_element) {
                self.tooltip_element.tooltip('destroy');
                self.tooltip_element = null;
            }
        }

        $.when(Menu.init(data),
            ArgumentsPanel.init(),
            UserPanel.init(data),
            LanguagePanel.init(data),
            WindowManager.init(data),
            SearchPanel.init(),
            new EekbPanel().init(data),
            SCWeb.ui.KeyboardHandler.init(WindowManager),
            self.resolveElementsAddr('body')
        ).done(function() {

            // listen clicks on sc-elements
            var sc_elements_cmd_selector = '[sc_addr]:not(.sc-window, .sc-no-default-cmd)';
            $('#window-container,#help-modal').delegate(sc_elements_cmd_selector, 'click', function(e) {
                if (!ArgumentsPanel.isArgumentAddState()) {
                    Main.doDefaultCommand([$(e.currentTarget).attr('sc_addr')]);
                    e.stopPropagation();
                }
            });

            var sc_elements_arg_selector = '[sc_addr]:not(.sc-window)';
            $('body').delegate(sc_elements_arg_selector, 'click', function(e) {
                if (ArgumentsPanel.isArgumentAddState() && !$(e.currentTarget).hasClass(
                        'not-argument')) {
                    Arguments.appendArgument($(this).attr('sc_addr'));
                    e.stopPropagation();
                }
            });

            var sc_elements_tooltip_selector = '[sc_addr]:not(.sc-window, .ui-no-tooltip)';
            $('body')
                .delegate(sc_elements_tooltip_selector, 'mouseover', function(e) {

                    clearTooltipInterval();
                    self.tooltip_element = $(this);
                    self.tooltip_interval = setInterval(function() {
                        clearInterval(self.tooltip_interval);
                        self.tooltip_interval = null;
                        var addr = self.tooltip_element.attr('sc_addr');
                        if (addr) {
                            Server.resolveIdentifiers([addr], function(idf) {
                                if (self.tooltip_element) { // check mouseout destroy
                                    self.tooltip_element.tooltip({
                                        placement: 'auto',
                                        title: idf[addr]
                                    }).tooltip('show');
                                }
                            }, function() {
                                destroyTooltip();
                            });
                        }
                    }, 1000);
                }).delegate(sc_elements_tooltip_selector, 'mouseout', function(e) {
                    clearTooltipInterval();
                    destroyTooltip();
                }).delegate(sc_elements_tooltip_selector, 'keydown', function(e) {
                    clearTooltipInterval();
                    destroyTooltip();
                });

            $('#help-modal').on('shown.bs.modal', function() {
                var body = $('#help-modal-body');
                if (body.hasClass('modal-empty')) {
                    body.addClass('loading');
                    // try to find content
                    Server.resolveScAddr(['ui_start_help'], function(addrs) {
                        var a = addrs['ui_start_help'];
                        if (a) {
                            body.html(
                                '<div id="help-modal-content" class="sc-window" sc_addr="' +
                                a + '"> </div>');
                            $.when(WindowManager.createViewersForScLinks({
                                    'help-modal-content': a
                                }))
                                .done(function() {
                                    body.removeClass('loading');
                                    body.removeClass('modal-empty');
                                });
                        }
                    });
                }
            });

            dfd.resolve();
        });
        return dfd.promise();
    },

    /*! Returns selector to select all elements, that has sc_addr in specified window, excluding all 
     * sc_addr elements in child windows
     */
    selectorWindowScAddr: function(windowId) {
        return windowId + ' [sc_addr]:not(' + windowId + ' .sc-content [sc_addr])';
    },

    /*! Resolve sc-addrs for elements, that has sc_control_sys_idtf attribute in specified container
     * @param {String} parentSelector String that contains selector for parent element
     */
    resolveElementsAddr: function(parentSelector) {
        var dfd = new jQuery.Deferred();

        var attr_name = 'sc_control_sys_idtf';
        var identifiers = [];
        var elements = [];
        $(parentSelector + ' [' + attr_name + ']').each(function() {
            identifiers.push($(this).attr(attr_name));
            elements.push($(this));
        });

        Server.resolveScAddr(identifiers, function(addrs) {
            for (e in elements) {
                var el = elements[e];
                var addr = addrs[el.attr(attr_name)];
                if (addr) {
                    el.attr('sc_addr', addr);
                } else {
                    el.addClass('sc-not-exist-control');
                }
            }
            dfd.resolve();
        });

        return dfd.promise();
    }
};
export default Core
