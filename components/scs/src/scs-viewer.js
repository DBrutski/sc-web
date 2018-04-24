function isTripleSystem(set, triple) {
    return set.has(triple[0].addr) || set.has(triple[1].addr) || set.has(triple[2].addr);
}
function removeSystemTriples(set, triples) {
    triples.filter((triple) => !isTripleSystem(set, triple));
}

async function getSystemSet(question) {
    const questionTuple = await new Promise((resolve, reject) => sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,
        [question, 0, 0, 0, scKeynodes.nrel_answer]).then(resolve, reject));
    if (questionTuple.length !== 1) {
        console.error("incorrect question");
        return new Set();
    }
    const answer = questionTuple[0][2];
    const systemSet = await new Promise((resolve, reject) => getElementsForRemove(answer).then(resolve, reject));
    return systemSet;
}

SCs.Viewer = function () {

    this.sandbox = null;
    this.containerId = null;
    this.getKeynode = null;
    this.tree = null;
    this.output = null;


    this.init = function (sandbox, keynode_func) {
        this.sandbox = sandbox;
        this.containerId = '#' + sandbox.container;
        this.getKeynode = keynode_func;

        this.tree = new SCs.SCnTree();
        this.tree.init(null, keynode_func);

        this.output = new SCs.SCnOutput();
        this.output.init(this.tree, sandbox.container, this.getKeynode, this.sandbox.generateWindowContainer);
    };

    this.appendData = function (data) {
        var self = this;
        data = JSON.parse(data);
        (async function () {
            try {
                const set = await getSystemSet(self.sandbox.command_state.question);
                data.triples = removeSystemTriples(set, data.triples);
            } catch (e) {
                console.error(e);
            }
            self.tree.build(data.keywords, data.triples);
            $(self.containerId).html($(self.containerId).html() + self.output.toHtml());

            $(self.containerId + ' .sc-contour > .scs-scn-view-toogle-button').click(function () {
                var button = $(this);
                var contour = button.parent();
                var contour_addr = contour.attr('sc_addr');
                var primary = contour.find('.scs-scn-view-primary');
                var external = contour.find('.scs-scn-view-external');

                var height = Math.min(Math.max(primary.height(), 600), 1024);
                var width = primary.width();

                if (primary.is(":visible") && !external.has('div').length) {
                    var wid = self.sandbox.container + '-' + contour_addr;
                    external.html('<div id="' + wid + '" style="width: ' + width + 'px; height: ' + height + 'px;"></div>');

                    var structs = {};
                    structs[wid] = {addr: contour_addr, ext_lang_addr: self.getKeynode('scg_code')};
                    self.sandbox.createViewersForScStructs(structs);
                }

                primary.toggleClass('hidden');
                external.toggleClass('hidden');
            });
        })()
    };

    this.getAddrs = function () {
        return this.tree.addrs;
    };

    this.getLinks = function () {
        return this.output.sc_links;
    };

};

