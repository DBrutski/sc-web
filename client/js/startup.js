import {core, ui} from "SCWeb";
const {Locker} = ui;
const {Main} = core;

import "./Ui/RemoveElements";

$(document).ready(function() {

    $('#windows-list').click(function () {
        $('#static-window-container').toggle();
    });

    Locker.show();
    const params = {
        menu_container_id: 'menu_container',
        menu_container_eekb_id: 'menu_container_eekb'
    };
    $.when(Main.init(params)).done(function() {
        Locker.hide();
    });
});
