var c;

var button;

$(document).ready(function () {
    c = document.querySelector('#mode-switching-checkbox');
    c.onclick = function () {
        if (c.checked) {
            document.getElementsByClassName("mode-switching-panel")[0].style.display = "";
        } else {
            document.getElementsByClassName("mode-switching-panel")[0].style.display = "none";
        }
        var div = document.getElementsByClassName('scs-scn-field-root')[0];
        if (div != null){
            div.remove();
        }

        window.SCsViewer(window.sandbox).updateComponent();
    };
    if (c.checked) {
        document.getElementsByClassName("mode-switching-panel")[0].style.display = "";
    } else {
        document.getElementsByClassName("mode-switching-panel")[0].style.display = "none";
    }
});

// button.onclick = getElementsForRemove(cont_idtf);
export async function getElementsForRemove(addr) {

    //checkbox allow all scn constructions
    if (c.checked) return [];

    var for_remove = []; //удаляемые элементы
    var cont = addr;
    //заносим в множестов for_remove отношение nrel_system_identifier
    for_remove.push(scKeynodes.nrel_system_identifier);
    try {
        var systemIdtfConstrs = await new Promise((success, faild) => window.sctpClient.iterate_constr(
            //итератор для элементов контура
            SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_3F_A_A,
                [cont,
                    sc_type_arc_pos_const_perm,
                    0
                ], {
                    "contour_elem": 2
                }),
            //итератор для поиска nrel_system_identifier
            SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,
                ["contour_elem",
                    sc_type_arc_common | sc_type_const,
                    0,
                    sc_type_arc_pos_const_perm,
                    window.scKeynodes.nrel_system_identifier
                ], {
                    "idtf_arc": 1,
                    "idtf_node": 2,
                    "idtf_relation": 3
                })
        ).then(success, faild));
        for (let idx in systemIdtfConstrs.results) {
            for_remove.push(systemIdtfConstrs.get(idx, "idtf_arc"));
            for_remove.push(systemIdtfConstrs.get(idx, "idtf_node"));
            for_remove.push(systemIdtfConstrs.get(idx, "idtf_relation"));
        }
    } catch (e) {
        console.error("Cannot find system_idtf in contour", e);
    }

    //текущий язык
    var current_lang = SCWeb.core.ComponentSandbox.prototype.getCurrentLanguage();

    try {
        //итератор для поиска nrel_main_idtf
        var mainIdtfConstr = await
            new Promise((success, faild) => window.sctpClient.iterate_constr(
                SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_3F_A_A,
                    [cont,
                        sc_type_arc_pos_const_perm,
                        0
                    ], {"contour_elem": 2}),
                SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,
                    ["contour_elem",
                        sc_type_arc_common | sc_type_const,
                        0,
                        sc_type_arc_pos_const_perm,
                        window.scKeynodes.nrel_main_idtf
                    ], {
                        "idtf_arc": 1,
                        "idtf_node": 2,
                        "idtf_relation": 3
                    }),
                SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_3A_A_F,
                    [0,
                        sc_type_arc_pos_const_perm,
                        "idtf_node"
                    ], {
                        "language": 0,
                        "language_arc": 1
                    }),
                SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_3F_A_F,
                    [window.scKeynodes.languages,
                        sc_type_arc_pos_const_perm,
                        "language"
                    ])
            ).then(success, faild));

        for (let idx in mainIdtfConstr.results) {
            if (mainIdtfConstr.get(idx, "language") !== current_lang) {
                for_remove.push(mainIdtfConstr.get(idx, "idtf_arc"));
                for_remove.push(mainIdtfConstr.get(idx, "idtf_node"));
                for_remove.push(mainIdtfConstr.get(idx, "idtf_relation"));
                for_remove.push(mainIdtfConstr.get(idx, "language"));
                for_remove.push(mainIdtfConstr.get(idx, "language_arc"));
            }
        }
    } catch (e) {
        console.error("Cannot find main_idtf in contour", e);
    }
    return for_remove;

}
