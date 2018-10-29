var c;

$(document).ready(function () {
    c = document.querySelector('#mode-switching-checkbox');
    c.onclick = async function () {
        await showHide();
    };
});


async function doAction(option){
    // системный идентификатор
    await scKeynodes.resolveKeynode('nrel_system_identifier');
    var nrel_system_identifier = scKeynodes['nrel_system_identifier'];
    // основной идентификатор
    await scKeynodes.resolveKeynode('nrel_main_idtf');
    var nrel_main_idtf = scKeynodes['nrel_main_idtf'];
    // трансляция sc-текста
    await scKeynodes.resolveKeynode('nrel_sc_text_translation');
    var nrel_sc_text_translation = scKeynodes['nrel_sc_text_translation'];
    // идентификатор
    await scKeynodes.resolveKeynode('nrel_idtf');
    var nrel_idtf = scKeynodes['nrel_idtf'];
    // ключевой sc-элемент
    await scKeynodes.resolveKeynode('rrel_key_sc_element');
    var rrel_key_sc_element = scKeynodes['rrel_key_sc_element'];

    document.getElementsByClassName("mode-switching-panel")[0].style.display = option;

    //идентификатор*
    document.querySelectorAll('div > div > a[sc_addr="'+nrel_idtf+'"]').forEach(function (element) {
        element.parentNode.parentNode.style.display = option;
        var nextElem = element.parentNode.parentNode.nextSibling;
        while (!nextElem.classList.contains("scs-scn-field")) {
            nextElem.style.display = option;
            nextElem = nextElem.nextSibling;
        }
    });

    //системный идентификатор*
    document.querySelectorAll('div > div > a[sc_addr="'+nrel_system_identifier+'"]').forEach(function (element) {
        element.parentNode.parentNode.style.display = option;
    });

    //трансляция sc-текста*
    document.querySelectorAll('div > a[sc_addr="'+nrel_sc_text_translation+'"]').forEach(function (element) {
        if (element.parentNode.parentNode.parentNode != null &&
            element.parentNode.parentNode.previousSibling != null &&
            element.parentNode.previousSibling != null &&
            element.parentNode != null &&
            element.parentNode.nextSibling != null &&
            element.parentNode.nextSibling.childNodes[0] != null &&
            element.parentNode.nextSibling.childNodes[1].childNodes[0] != null &&
            element.parentNode.nextSibling.childNodes[1].childNodes[1] != null &&
            element.parentNode.nextSibling.childNodes[1].childNodes[2] != null) {
            element.parentNode.parentNode.parentNode.style.paddingLeft = option.includes("none") ? "20px" : "40px";
            element.parentNode.parentNode.previousSibling.style.display = option;
            element.parentNode.previousSibling.style.display = option;
            element.parentNode.style.display = option;
            element.parentNode.nextSibling.style.paddingLeft = option.includes("none") ? "0px" : "20px";
            element.parentNode.nextSibling.childNodes[0].style.display = option;
            element.parentNode.nextSibling.childNodes[1].childNodes[0].style.display = option;
            element.parentNode.nextSibling.childNodes[1].childNodes[1].style.display = option;
            element.parentNode.nextSibling.childNodes[1].childNodes[2].style.paddingLeft = option.includes("none") ? "0px" : "20px";
        }
    });

    var select = document.getElementById("language-select");
    var selectedLangId = select.options[select.selectedIndex].getAttribute("sc_addr");
    var notSelectedIds = [];

    for(var i = 0; i < select.length; i++){
        if (!select.options[i].getAttribute("sc_addr").includes(selectedLangId)){
            notSelectedIds.push(select.options[i].getAttribute("sc_addr"));
        }
    }
    //все языки
    for(var i = 0; i < select.length; i++){
        document.querySelectorAll('div > div > a[sc_addr="' + select.options[i].getAttribute("sc_addr") + '"]').forEach(function (element) {
            element.parentNode.parentNode.style.display = option;
        });
    }

    //основной идентификатор* на другом языке
    document.querySelectorAll('div > a[sc_addr="'+nrel_main_idtf+'"]').forEach(function (element) {
        var langScAddr = element.parentNode.nextSibling.nextSibling.childNodes[1].childNodes[1].childNodes[0].getAttribute("sc_addr");
        element.parentNode.nextSibling.style.display = "";
        element.parentNode.nextSibling.nextSibling.style.display = "";
        if (notSelectedIds.includes(langScAddr)){
            element.parentNode.nextSibling.style.display = option;
            element.parentNode.nextSibling.nextSibling.style.display = option;
        }
        var langScAddr2 = element.parentNode.parentNode.nextSibling.nextSibling.childNodes[1].childNodes[1].childNodes[0].getAttribute("sc_addr");
        element.parentNode.parentNode.nextSibling.style.display = "";
        element.parentNode.parentNode.nextSibling.nextSibling.style.display = "";
        if (notSelectedIds.includes(langScAddr2)){
            element.parentNode.parentNode.nextSibling.style.display = option;
            element.parentNode.parentNode.nextSibling.nextSibling.style.display = option;
        }
    });
}

export async function showHide() {
    if (c.checked){
        await doAction("");
    } else{
        await doAction("");
        await doAction("none");
    }
}

export async function getElementsForRemove(addr) {

    return [];


}
