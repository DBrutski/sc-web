SCsComponent = {
    ext_lang: 'scs_code',
    formats: ['format_scs_json'],
    factory: function (sandbox) {
        window.sandbox=sandbox;
        return new SCsViewer(sandbox);
    },
    getRequestKeynodes: function () {
        var keynodes = ['nrel_section_base_order', 'rrel_key_sc_element', 'nrel_key_sc_element_base_order', 'scg_code'];
        return keynodes.concat(SCs.SCnSortOrder);
    }
};

var SCsViewer = function (sandbox) {
    this.objects = new Array();
    this.addrs = new Array();
    this.sc_links = {}; // map of sc-link objects key:addr, value: object
    this.data = null;

    this.container = '#' + sandbox.container;
    this.sandbox = sandbox;

    // ---- window interface -----
    this.receiveData = function (data) {
        this.data = data;

        var dfd = new jQuery.Deferred();

        this.viewer.appendData(data)
            .then(() => {
                $.when(this.sandbox.createViewersForScLinks(this.viewer.getLinks())).then(
                    function () {
                        dfd.resolve();
                    },
                    function () {
                        dfd.reject();
                    });
            });

        return dfd.promise();
    };

    this.updateContent = jQuery.proxy(function () {
        var self = this;
        SCWeb.core.Main.getTranslatedAnswer(this.sandbox.command_state)
            .then(function (answer_addr) {
                sandbox.addr = answer_addr;
                sandbox.eventStructUpdate = true;
                self.viewer = new SCs.Viewer();
                sandbox.removeChild();
                self.viewer.init(sandbox, articleContainer, jQuery.proxy(sandbox.getKeynode, sandbox),
                    sandbox.generateWindowContainer);
                self.sandbox.eventGetObjectsToTranslate = jQuery.proxy(viewObjectsToTranslate, self);
                self.sandbox.eventApplyTranslation = viewUpdateTranslation;
                self.sandbox.eventDataAppend = viewerReceiveData;
                self.sandbox.updateContent();
            });
    }, this);


    this.updateTranslation = function (namesMap) {
        // apply translation
        $(this.sandbox.container_selector).each(function (index, element) {
            var addr = $(element).attr('sc_addr');
            if (!$(element).hasClass('sc-content') && !$(element).hasClass('sc-contour') &&
                !$(element).hasClass('scs-scn-connector') && ($(element).hasClass('scs-scn-element'))) {
                $(element).removeClass('resolve-idtf-anim');
                if (namesMap[addr]) {
                    $(element).text(namesMap[addr]);
                } else {
                    $(element).html('<b>...</b>');
                }
            }
        });
    };

    this.getObjectsToTranslate = function () {
        return this.viewer.getAddrs();
    };

    this.sandbox.eventDataAppend = this.receiveData.bind(this);
    this.sandbox.eventGetObjectsToTranslate = this.getObjectsToTranslate.bind(this);
    this.sandbox.eventApplyTranslation = $.proxy(this.updateTranslation, this);

    this.viewer = new SCs.Viewer();
    this.viewer.init(sandbox, $.proxy(sandbox.getKeynode, sandbox));

    this.sandbox.updateContent();
};

var SCsConnectors = {};

$(document).ready(function () {

    SCsConnectors[sc_type_arc_pos_const_perm] = "->";
    SCsConnectors[sc_type_edge_common | sc_type_const] = "==";
    SCsConnectors[sc_type_edge_common | sc_type_var] = "_==";
    SCsConnectors[sc_type_arc_common | sc_type_const] = "=>";
    SCsConnectors[sc_type_arc_common | sc_type_var] = "_=>";
    SCsConnectors[sc_type_arc_access | sc_type_var | sc_type_arc_pos | sc_type_arc_perm] = "_->";
});


SCWeb.core.ComponentManager.appendComponentInitialize(SCsComponent);