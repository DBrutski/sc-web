import EventManager from "../Core/EventManager";
import Locker from "./Locker";
import Server from "../Core/Server";
import Translation from "../Core/Translation";
import * as jQuery from "jquery";
const LanguagePanel = {

    /*!
     * Initialize settings panel.
     * @param {Object} params Parameters for panel initialization.
     * There are required parameters:
     * - languages - list of available natural languages
     */
    init: function (params) {
        const dfd = new jQuery.Deferred();
        this.languages = params.languages;

        let html = '';
        for (let i in this.languages) {
            const addr = this.languages[i];

            html += '<option sc_addr="' + addr + '">' + addr + '</option>';
        }

        // append languages to select
        $('#language-select').html(html)
            .val(params.user.current_lang)
            .change(function () {
                Locker.show();
                const addr = $('#language-select option:selected').attr("sc_addr");
                $('#language-select').attr('disabled', true);
                Translation.setLanguage(addr, function () {
                    $('#language-select').removeAttr('disabled', true);
                    Locker.hide();
                });
            });

        // listen translation events
        EventManager.subscribe("translation/update", this, this.updateTranslation);
        EventManager.subscribe("translation/get", this, function (objects) {
            $('#language-select [sc_addr]').each(function (index, element) {
                objects.push($(element).attr('sc_addr'));
            });
        });

        dfd.resolve();
        return dfd.promise();
    },


    // ---------- Translation listener interface ------------
    updateTranslation: function (namesMap) {
        // apply translation
        this.updateSearchInput();
        $('#language-select [sc_addr]').each(function (index, element) {
            const addr = $(element).attr('sc_addr');
            if (namesMap[addr]) {
                $(element).text(namesMap[addr].replace('user::', '').replace('session::', ''));
            }
        });

    },

    updateSearchInput: function () {
        const keynodes = ['ui_control_search'];
        Server.resolveScAddr(keynodes, function (keynodes) {
            Server.resolveIdentifiers(keynodes, function (idf) {
                $("#search-input").attr('placeholder', idf[keynodes['ui_control_search']]);
            });
        })
    }

};
export default LanguagePanel
