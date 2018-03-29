import {Arguments} from "../Core/Arguments";
import {EventManager} from "../Core/EventManager";
import {Translation} from "../Core/Translation";
import * as jQuery from "jquery";

export const ArgumentsPanel = {
    _container: '#arguments_buttons',

    init: function() {
        this.argument_add_state = false;
        const dfd = new jQuery.Deferred();

        const self = this;
        // listen events from arguments
        EventManager.subscribe("arguments/add", this, this.onArgumentAppended);
        EventManager.subscribe("arguments/remove", this, this.onArgumentRemoved);
        EventManager.subscribe("arguments/clear", this, this.onArgumentsCleared);


        // listen events from translation
        EventManager.subscribe("translation/update", this, this.updateTranslation);
        EventManager.subscribe("translation/get", this, function(objects) {
            const items = self.getObjectsToTranslate();
            for (let i in items) {
                objects.push(items[i]);
            }
        });

        $('#arguments_clear_button').click(function() {
            if (self.isArgumentAddState())
                return;
            Arguments.clear();
        });
        $('#arguments_add_button').click(function() {
            self.argument_add_state = !self.argument_add_state;
            self.updateArgumentAddState();
        });

        $(document).on("click", ".argument-item", function(event) {
            const idx = $(this).attr('arg_idx');
            Arguments.removeArgumentByIndex(parseInt(idx));
        });

        dfd.resolve();
        return dfd.promise();
    },

    isArgumentAddState: function() {
        return this.argument_add_state;
    },

    setArgumentAddState: function() {
        this.argument_add_state = true;
    },

    removeArgumentAddState: function() {
        this.argument_add_state = false;
    },

    updateArgumentAddState: function() {
        const add_button = $("#arguments_add_button");
        if (this.argument_add_state) {
            add_button.addClass('argument-wait');
        } else {
            add_button.removeClass('argument-wait');
        }
    },

    // ------- Arguments listener interface -----------
    onArgumentAppended: function(argument, idx) {

        const idx_str = idx.toString();
        const self = this;

        const new_button =
            '<button class="btn btn-primary argument-item argument-translate-state not-argument" sc_addr="' +
            argument +
            '" arg_idx="' +
            idx_str +
            '" id="argument_' +
            idx_str +
            '"></button>';
        $(this._container).append(new_button);

        // translate added argument
        $.when(Translation.translate([argument])).done(function(namesMap) {

            let value = argument;
            if (namesMap[argument]) {
                value = namesMap[argument];
            }

            $(self._container + " [sc_addr='" + argument + "']").text(value).removeClass(
                'argument-translate-state');
        });

    },

    onArgumentRemoved: function(argument, idx) {

        $('#argument_' + idx.toString()).remove();
        // update indicies
        $(this._container + ' [arg_idx]').each(function(index, element) {

            let v = parseInt($(this).attr('arg_idx'));

            if (v > idx) {
                v = v - 1;
                $(this).attr('arg_idx', v.toString());
                $(this).attr('id', 'argument_' + v.toString());
            }
        });
    },

    onArgumentsCleared: function() {

        $(this._container).empty();
    },

    // ------- Translation listener interface ---------
    updateTranslation: function(namesMap) {

        // apply translation
        $('#arguments_buttons [sc_addr]').each(function(index, element) {

            const addr = $(element).attr('sc_addr');
            if (namesMap[addr]) {
                $(element).text(namesMap[addr]);
            }
        });
    },

    getObjectsToTranslate: function() {

        return Arguments._arguments;
    }

};
