import $ from "jquery";
import {Locker} from "./Ui/Locker";
import {Main} from "./Core/Main";
import "../css/core.css";

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
