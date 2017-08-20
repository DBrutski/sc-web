var SCWeb = {
    core: {
        ComponentManager: {
            appendComponentInitialize: function(SCgComponent) {

            }
        }
    }
};
$(document).ready(function() {

    var sandbox = {
        container: "scg-viewer",
        addr: 0,
        is_struct: false,
        format_addr: "format_scg_json",
        createViewersForScLinks: function(v) {}
    };

    var editor = new SCg.Editor();
    editor.init({
        sandbox: sandbox,
        containerId: "scg-viewer",
        canEdit: true,
    });

    $(window)
        .on('keydown', function(d3_event) {
            editor.keyboardCallbacks.onkeydown(d3_event);
        })
        .on('keyup', function(d3_event) {
            editor.keyboardCallbacks.onkeyup(d3_event);
        })
        .on('keypress', function(d3_event) {

        });

    editor.render.update();
    editor.scene.layout();
});