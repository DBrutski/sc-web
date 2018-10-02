var c;

var button;

$(document).ready(function () {
    c = document.querySelector('#mode-switching-checkbox');
    c.onclick = function () {
        showHide();
    };
    if (c.checked) {
        document.getElementsByClassName("mode-switching-panel")[0].style.display = "";
    } else {
        document.getElementsByClassName("mode-switching-panel")[0].style.display = "none";
    }
});

export async function showHide() {

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



    c = document.querySelector('#mode-switching-checkbox');
    if (c.checked) {
        document.getElementsByClassName("mode-switching-panel")[0].style.display = "";
    } else {
        document.getElementsByClassName("mode-switching-panel")[0].style.display = "none";
    }


    //идентификатор*
    if (c.checked) {
        document.querySelectorAll('div > div > a[sc_addr="'+nrel_idtf+'"]').forEach(function (element) {
            element.parentNode.parentNode.style.display = "";
            var nextElem = element.parentNode.parentNode.nextSibling;
            while (!nextElem.classList.contains("scs-scn-field")) {
                nextElem.style.display = "";
                nextElem = nextElem.nextSibling;
            }
        });
    } else {
        document.querySelectorAll('div > div > a[sc_addr="'+nrel_idtf+'"]').forEach(function (element) {
            element.parentNode.parentNode.style.display = "none";
            var nextElem = element.parentNode.parentNode.nextSibling;
            while (!nextElem.classList.contains("scs-scn-field")) {
                nextElem.style.display = "none";
                nextElem = nextElem.nextSibling;
            }
        });
    }


    //системный идентификатор*
    if (c.checked) {
        document.querySelectorAll('div > div > a[sc_addr="'+nrel_system_identifier+'"]').forEach(function (element) {
            element.parentNode.parentNode.style.display = "";
        });
    } else {
        document.querySelectorAll('div > div > a[sc_addr="'+nrel_system_identifier+'"]').forEach(function (element) {
            element.parentNode.parentNode.style.display = "none";
        });
    }

    // element.parentNode.parentNode.parentNode.style.paddingLeft = "20px";

    //трансляция sc-текста*
    if (c.checked) {
        document.querySelectorAll('div > a[sc_addr="'+nrel_sc_text_translation+'"]').forEach(function (element) {
            element.parentNode.parentNode.parentNode.style.paddingLeft = "40px";
            element.parentNode.parentNode.previousSibling.style.display = "";
            element.parentNode.previousSibling.style.display = "";
            element.parentNode.style.display = "";
            element.parentNode.nextSibling.style.paddingLeft = "20px";
            element.parentNode.nextSibling.childNodes[0].style.display  = "";
            element.parentNode.nextSibling.childNodes[1].childNodes[0].style.display  = "";
            element.parentNode.nextSibling.childNodes[1].childNodes[1].style.display  = "";
            element.parentNode.nextSibling.childNodes[1].childNodes[2].style.paddingLeft = "20px";
        });
    } else {
        document.querySelectorAll('div > a[sc_addr="'+nrel_sc_text_translation+'"]').forEach(function (element) {
            element.parentNode.parentNode.parentNode.style.paddingLeft = "20px";
            element.parentNode.parentNode.previousSibling.style.display = "none";
            element.parentNode.previousSibling.style.display = "none";
            element.parentNode.style.display = "none";
            element.parentNode.nextSibling.style.paddingLeft = "0px";
            element.parentNode.nextSibling.childNodes[0].style.display  = "none";
            element.parentNode.nextSibling.childNodes[1].childNodes[0].style.display  = "none";
            element.parentNode.nextSibling.childNodes[1].childNodes[1].style.display  = "none";
            element.parentNode.nextSibling.childNodes[1].childNodes[2].style.paddingLeft = "0px";
        });
    }

    var select = document.getElementById("language-select");
    var selectedLangId = select.options[select.selectedIndex].getAttribute("sc_addr");
    var notSelectedIds = [];

    for(var i = 0; i < select.length; i++){
        if (!select.options[i].getAttribute("sc_addr").includes(selectedLangId)){
            notSelectedIds.push(select.options[i].getAttribute("sc_addr"));
        }
    }


    //текущий язык
    if(c.checked){
        document.querySelectorAll('div > div > a[sc_addr="'+selectedLangId+'"]').forEach(function (element) {
            element.parentNode.parentNode.style.display = "";
        });
    } else {
        document.querySelectorAll('div > div > a[sc_addr="'+selectedLangId+'"]').forEach(function (element) {
            element.parentNode.parentNode.style.display = "none";
        });
    }


    //основной идентификатор* на другом языке
    if (c.checked) {
        document.querySelectorAll('div > a[sc_addr="'+nrel_main_idtf+'"]').forEach(function (element) {
            var langScAddr = element.parentNode.nextSibling.nextSibling.childNodes[1].childNodes[1].childNodes[0].getAttribute("sc_addr");
            if (notSelectedIds.includes(langScAddr)){
                element.parentNode.nextSibling.style.display = "";
                element.parentNode.nextSibling.nextSibling.style.display = "";
            }
        });
    } else {
        document.querySelectorAll('div > a[sc_addr="'+nrel_main_idtf+'"]').forEach(function (element) {
            var langScAddr = element.parentNode.nextSibling.nextSibling.childNodes[1].childNodes[1].childNodes[0].getAttribute("sc_addr");
            if (notSelectedIds.includes(langScAddr)){
                element.parentNode.nextSibling.style.display = "none";
                element.parentNode.nextSibling.nextSibling.style.display = "none";
            }
        });
    }

    if (c.checked) {
        document.querySelectorAll('div > a[sc_addr="'+nrel_main_idtf+'"]').forEach(function (element) {
            var langScAddr = element.parentNode.parentNode.nextSibling.nextSibling.childNodes[1].childNodes[1].childNodes[0].getAttribute("sc_addr");
            if (notSelectedIds.includes(langScAddr)){
                element.parentNode.parentNode.nextSibling.style.display = "";
                element.parentNode.parentNode.nextSibling.nextSibling.style.display = "";
            }
        });
    } else {
        document.querySelectorAll('div > a[sc_addr="'+nrel_main_idtf+'"]').forEach(function (element) {
            var langScAddr = element.parentNode.parentNode.nextSibling.nextSibling.childNodes[1].childNodes[1].childNodes[0].getAttribute("sc_addr");
            if (notSelectedIds.includes(langScAddr)){
                element.parentNode.parentNode.nextSibling.style.display = "none";
                element.parentNode.parentNode.nextSibling.nextSibling.style.display = "none";
            }
        });
    }
}

// button.onclick = getElementsForRemove(cont_idtf);
export async function getElementsForRemove(addr) {

    return [];


}
