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

export function showHide() {

    c = document.querySelector('#mode-switching-checkbox');
    if (c.checked) {
        document.getElementsByClassName("mode-switching-panel")[0].style.display = "";
    } else {
        document.getElementsByClassName("mode-switching-panel")[0].style.display = "none";
    }


    //идентификатор*
    if (c.checked) {
        document.querySelectorAll('div > div > a[sc_addr="262144"]').forEach(function (element) {
            element.parentNode.parentNode.style.display = "";
            var nextElem = element.parentNode.parentNode.nextSibling;
            while (!nextElem.classList.contains("scs-scn-field")) {
                nextElem.style.display = "";
                nextElem = nextElem.nextSibling;
            }
        });
    } else {
        document.querySelectorAll('div > div > a[sc_addr="262144"]').forEach(function (element) {
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
        document.querySelectorAll('div > div > a[sc_addr="196608"]').forEach(function (element) {
            element.parentNode.parentNode.style.display = "";
        });
    } else {
        document.querySelectorAll('div > div > a[sc_addr="196608"]').forEach(function (element) {
            element.parentNode.parentNode.style.display = "none";
        });
    }


    //трансляция sc-текста*
    if (c.checked) {
        document.querySelectorAll('div > a[sc_addr="212271104"]').forEach(function (element) {
            var afterKeyScElem = element.parentNode.nextSibling.nextSibling;
            afterKeyScElem.childNodes[0].style.display = "";
            afterKeyScElem.childNodes[1].childNodes[0].style.display = "";
            afterKeyScElem.childNodes[1].childNodes[1].style.display = "";
            afterKeyScElem.childNodes[1].childNodes[2].childNodes[0].style.display = "";
            afterKeyScElem.childNodes[1].childNodes[2].childNodes[1].childNodes[0].style.display = "";
            afterKeyScElem.childNodes[1].childNodes[2].childNodes[1].childNodes[1].style.display = "";
        });
    } else {
        document.querySelectorAll('div > a[sc_addr="212271104"]').forEach(function (element) {
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

    document.querySelectorAll('div > a[sc_addr="8650752"]').forEach(function (element) {
        var langScAddr = element.parentNode.nextSibling.nextSibling.childNodes[1].childNodes[1].childNodes[0].getAttribute("sc_addr");
        if (notSelectedIds.includes(langScAddr)){
            element.parentNode.nextSibling.style.display = "none";
            element.parentNode.nextSibling.nextSibling.style.display = "none";
        }
    });



    //основной идентификатор* на другом языке
    if (c.checked) {
        document.querySelectorAll('div > a[sc_addr="8650752"]').forEach(function (element) {
            var langScAddr = element.parentNode.nextSibling.nextSibling.childNodes[1].childNodes[1].childNodes[0].getAttribute("sc_addr");
            if (notSelectedIds.includes(langScAddr)){
                element.parentNode.nextSibling.style.display = "";
                element.parentNode.nextSibling.nextSibling.style.display = "";
            }
        });
    } else {
        document.querySelectorAll('div > a[sc_addr="8650752"]').forEach(function (element) {
            var langScAddr = element.parentNode.nextSibling.nextSibling.childNodes[1].childNodes[1].childNodes[0].getAttribute("sc_addr");
            if (notSelectedIds.includes(langScAddr)){
                element.parentNode.nextSibling.style.display = "none";
                element.parentNode.nextSibling.nextSibling.style.display = "none";
            }
        });
    }

    if (c.checked) {
        document.querySelectorAll('div > a[sc_addr="8650752"]').forEach(function (element) {
            var nextElem = element.parentNode.parentNode.nextSibling;
            while (nextElem.getAttribute("style") == null || !nextElem.getAttribute("style").includes("padding-left: 40px")) {
                nextElem = nextElem.nextSibling;
            }
            nextElem.childNodes.forEach(function (element) {
                if (element.getAttribute("class") != null && element.getAttribute("class").includes("scs-scn-field")) {
                    element.childNodes.forEach(function (element) {
                        if (element.getAttribute("style") != null && element.getAttribute("style").includes("padding-left: 20px")) {
                            element.childNodes.forEach(function (element) {
                                if (notSelectedIds.indexOf(element.getAttribute("sc_addr")) !== -1) {
                                    nextElem.style.display = "";
                                    nextElem.previousSibling.childNodes.forEach(function (element) {
                                        element.style.display = "";
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
    } else {
        document.querySelectorAll('div > a[sc_addr="8650752"]').forEach(function (element) {
            var nextElem = element.parentNode.parentNode.nextSibling;
            while (nextElem.getAttribute("style") == null || !nextElem.getAttribute("style").includes("padding-left: 40px")) {
                nextElem = nextElem.nextSibling;
            }
            nextElem.childNodes.forEach(function (element) {
                if (element.getAttribute("class") != null && element.getAttribute("class").includes("scs-scn-field")) {
                    element.childNodes.forEach(function (element) {
                        if (element.getAttribute("style") != null && element.getAttribute("style").includes("padding-left: 20px")) {
                            element.childNodes.forEach(function (element) {
                                if (notSelectedIds.indexOf(element.getAttribute("sc_addr")) !== -1) {
                                    nextElem.style.display = "none";
                                    nextElem.previousSibling.childNodes.forEach(function (element) {
                                        element.style.display = "none";
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
    }
}

// button.onclick = getElementsForRemove(cont_idtf);
export async function getElementsForRemove(addr) {

    return [];


}
