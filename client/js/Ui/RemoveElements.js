var c;

var button;

$(document).ready(function () {
    c = document.querySelector('#mode-switching-checkbox');
    c.onclick = function () {
        // ComponentSandbox.prototype.resolveAddrs(['nrel_system_identifier', 'nrel_main_idtf', 'nrel_sc_text_translation', 'nrel_idtf', 'rrel_key_sc_element'], function(addrs){
        //     showHide(addrs);
        // });
        showHide();
    };
    if (c.checked) {
        document.getElementsByClassName("mode-switching-panel")[0].style.display = "";
    } else {
        document.getElementsByClassName("mode-switching-panel")[0].style.display = "none";
    }
});

export async function showHide(/*addrs*/) {
    // console.log(addrs);
    await scKeynodes.resolveKeynode('rrel_key_sc_element');

    // системный идентификатор
    var nrel_system_identifier = window.scKeynodes['nrel_system_identifier'];
    scKeynodes.resolveKeynode('nrel_system_identifier', nrel_system_identifier);
    // основной идентификатор
    var nrel_main_idtf = window.scKeynodes['nrel_main_idtf'];
    scKeynodes.resolveKeynode('nrel_system_identifier', nrel_system_identifier);
    // трансляция sc-текста
    var nrel_sc_text_translation = window.scKeynodes['nrel_sc_text_translation'];
    // идентификатор
    var nrel_idtf = window.scKeynodes['nrel_idtf'];
    // ключевой sc-элемент
    await scKeynodes.resolveKeynode('rrel_key_sc_element');
    var rrel_key_sc_element = scKeynodes['rrel_key_sc_element'];
    // scKeynodes.resolveKeynode('rrel_key_sc_element', rrel_key_sc_element);

    // const dfd = new jQuery.Deferred();

    // Server.resolveScAddr(['nrel_system_identifier', 'nrel_main_idtf', 'nrel_sc_text_translation', 'nrel_idtf', 'rrel_key_sc_element'], function (addrs) {
    //     var nrel_system_identifier = addrs['nrel_system_identifier'];
    //     var nrel_main_idtf = addrs['nrel_main_idtf'];
    //     var nrel_sc_text_translation = addrs['nrel_sc_text_translation'];
    //     var nrel_idtf = addrs['nrel_idtf'];
    //     var rrel_key_sc_element = addrs['rrel_key_sc_element'];
    //     // dfd.resolve();
    // });

    // console.log(nrel_system_identifier);
    // console.log("\n");
    // console.log(nrel_main_idtf);
    // console.log("\n");
    // console.log(nrel_sc_text_translation );
    // console.log("\n");
    // console.log(nrel_idtf);
    // console.log("\n");
    // console.log(rrel_key_sc_element);
    // console.log("\n");

    // if (dfd.isResolved)



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


    //трансляция sc-текста*

    if (c.checked) {
        document.querySelectorAll('div > a[sc_addr="'+nrel_sc_text_translation+'"]').forEach(function (element) {
            element.parentNode.parentNode.previousSibling.style.display = "";
            element.parentNode.previousSibling.style.display = "";
            element.parentNode.nextSibling.childNodes[0] = "";
            element.parentNode.nextSibling.childNodes[1].childNodes[0] = "";
            element.parentNode.nextSibling.childNodes[1].childNodes[1] = "";
            //
            // var afterKeyScElem = element.parentNode.nextSibling.nextSibling;
            // afterKeyScElem.childNodes[0].style.display = "";
            // afterKeyScElem.childNodes[1].childNodes[0].style.display = "";
            // afterKeyScElem.childNodes[1].childNodes[1].style.display = "";
            // afterKeyScElem.childNodes[1].childNodes[2].childNodes[0].style.display = "";
            // afterKeyScElem.childNodes[1].childNodes[2].childNodes[1].childNodes[0].style.display = "";
            // afterKeyScElem.childNodes[1].childNodes[2].childNodes[1].childNodes[1].style.display = "";
        });
    } else {
        document.querySelectorAll('div > a[sc_addr="'+nrel_sc_text_translation+'"]').forEach(function (element) {
            element.parentNode.parentNode.previousSibling.style.display = "none";
            element.parentNode.previousSibling.style.display = "none";
            element.parentNode.nextSibling.childNodes[0] = "none";
            element.parentNode.nextSibling.childNodes[1].childNodes[0] = "none";
            element.parentNode.nextSibling.childNodes[1].childNodes[1] = "none";
            // var afterKeyScElem = element.parentNode.nextSibling.nextSibling;
            // afterKeyScElem.childNodes[0].style.display = "none";
            // afterKeyScElem.childNodes[1].childNodes[0].style.display = "none";
            // afterKeyScElem.childNodes[1].childNodes[1].style.display = "none";
            // afterKeyScElem.childNodes[1].childNodes[2].childNodes[0].style.display = "none";
            // afterKeyScElem.childNodes[1].childNodes[2].childNodes[1].childNodes[0].style.display = "none";
            // afterKeyScElem.childNodes[1].childNodes[2].childNodes[1].childNodes[1].style.display = "none";
        });
    }

    if (c.checked) {
        document.querySelectorAll('div > a[sc_addr="'+rrel_key_sc_element+'"]').forEach(function (element) {
            var afterKeyScElem = element.parentNode.nextSibling.nextSibling;
            afterKeyScElem.childNodes[0].style.display = "";
            afterKeyScElem.childNodes[1].childNodes[0].style.display = "";
            afterKeyScElem.childNodes[1].childNodes[1].style.display = "";
            afterKeyScElem.childNodes[1].childNodes[2].childNodes[0].style.display = "";
            afterKeyScElem.childNodes[1].childNodes[2].childNodes[1].childNodes[0].style.display = "";
            afterKeyScElem.childNodes[1].childNodes[2].childNodes[1].childNodes[1].style.display = "";
        });
    } else {
        document.querySelectorAll('div > a[sc_addr="'+rrel_key_sc_element+'"]').forEach(function (element) {
            var afterKeyScElem = element.parentNode.nextSibling.nextSibling;
            afterKeyScElem.childNodes[0].style.display = "none";
            afterKeyScElem.childNodes[1].childNodes[0].style.display = "none";
            afterKeyScElem.childNodes[1].childNodes[1].style.display = "none";
            afterKeyScElem.childNodes[1].childNodes[2].childNodes[0].style.display = "none";
            afterKeyScElem.childNodes[1].childNodes[2].childNodes[1].childNodes[0].style.display = "none";
            afterKeyScElem.childNodes[1].childNodes[2].childNodes[1].childNodes[1].style.display = "none";
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
