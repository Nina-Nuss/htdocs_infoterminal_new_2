class Infoterminal {
    ipAdresse = ""
    static id = 1;
    static InfoterminalsListe = [];
    static allCardList = [];
    static currentSelect = 0;
    check = false;
    static temp_remove = []
    static list = [];
    static ipList = [];
    static eleListe = []
    static responseText = ""
    constructor(id, titel, ipAdresse) {
        this.id = id;
        this.cardCounter = 0;
        //HTMLOBJEKTE-------------------------
        //-------------------------------------
        //AB hier kommt alles in die Datenbank rein:
        this.ipAdresse = ipAdresse;
        this.titel = titel
        //-------------------------------------
        //Listen-------------------------------
        this.cardObjList = [];
        this.tempListForDeleteCards = [];
        this.htmlCardObjList = [];
        this.listAnzeige = [];
        this.InfoterminalsBodyList = [];
        //-------------------------------------
        this.htmlInfoterminalsBody = `InfoterminalsBody${this.id}`;
        // this.ladeInfoterminal(this.htmlInfoterminalsBody);
        Infoterminal.ipList.push(this.ipAdresse);
        Infoterminal.allCardList.push(this.cardObjList);
        Infoterminal.list.push(this);
    }
    addCardObjs(cardObj) {
        this.cardObjList.push(cardObj);
    }
    addCardObjToAnzeige(cardObj) {
        if (!this.listAnzeige.some(e => e.id == cardObj.id)) {
            this.listAnzeige.push(cardObj);
        }
    }
    removeObjFromList(list, obj) {
        var index = list.findIndex(item => item.id === obj.id);
        if (index > -1) {
            list.splice(index, 1);
        }
    }
    ladeInfoterminal(htmlInfoterminalsBody) {
        rowForCards = document.getElementById("rowForCards");
        rowForCards.innerHTML += `
            <div id="${htmlInfoterminalsBody}"></div>  
        `
    }
    lengthListCardObj() {
        var length = this.cardObjList.length
        return length
    }

    static showCardObjList() {
        this.cardObjList.forEach(cardObj => {
            console.log(cardObj);
        });
    }
    static addObjToList(list, obj) {
        if (!list.some(e => e.id == obj.id)) {
            list.push(obj);
            console.log(`Object with id ${obj.id} added to list.`);
        }
    }
    static async update() {
        const delInfo = document.getElementById("deleteInfotherminal");
        const selector = document.getElementById('infotherminalSelect');
        const selectorForCards = document.getElementById('selectorInfoterminalForCards');
        let delInfoRows = ""; // String für Tabellenzeilen
        let selectorOptions = "";
        let selectorOptionsForCards = '<option value="alle">-- wähle Infoterminal --</option>';
        this.list = [];
        this.temp_remove = [];
        console.log("Update wird aufgerufen von Infoterminal.js");
        const result = await readDatabase("selectInfotherminal");
        console.log("result: ", result);
        // Performance: Normale forEach statt await forEach
        result.forEach(listInfo => {
            // Neue Infoterminal-Objekte erzeugen
            new Infoterminal(listInfo[0], listInfo[1], listInfo[2]);
            // Tabellencontent sammeln
            delInfoRows += `<tr class="border-bottom">
                    <td class="p-2">${listInfo[0]}</td>
                    <td class="p-2">${listInfo[2]}</td>
                    <td class="p-2">${listInfo[1]}</td>
                    <td class="p-2"><input type="checkbox" name="${listInfo[0]}" id="checkDelInfo${listInfo[0]}" onchange="Infoterminal.event_remove(${listInfo[0]})"></td>
                </tr>`;
            // Selector-Optionen sammeln
            selectorOptions += `<option value="${listInfo[1]}">${listInfo[1]}</option>`
            selectorOptionsForCards += `<option value="${listInfo[0]}">${listInfo[1]}</option>`;
        });
        if (delInfo != null) {
            delInfo.innerHTML = "";
            delInfo.innerHTML = delInfoRows;
        }
        if (selector) {
            selector.innerHTML = selectorOptions;
            let testOption = document.createElement("option");
            testOption.value = "Test Anzeige";
            testOption.text = "Test Anzeige";
            selector.add(testOption);
            Array.from(selector.options).forEach(option => {
                if (option.value.toLowerCase().trim() === "Test Anzeige".toLowerCase().trim()) {
                    option.selected = true;
                    option.innerHTML = "Test Anzeige";
                }
            });
        }
        if (selectorForCards) {
            selectorForCards.innerHTML = selectorOptionsForCards;
        }
        console.log(this.list);
    }
    static removeFromListViaID(id, list) {
        var temp = [];
        console.log(list);
        list.forEach(element => {
            if (element.id != id) {
                //ID muss aus Liste gelöscht werden
                temp.push(element);
            } else {
                this.deletee(element.id, "deleteInfotherminal");
                console.log("Das Element wurde gefunden und wird gelöscht! " + element.id);
            }
        });
        return temp;
    }
    static event_remove(id) {
        var element = document.getElementById(`checkDelInfo${id}`);
        if (element.checked && !this.temp_remove.includes(id)) {
            this.list.forEach(checkID => {
                if (checkID.id == id) {
                    checkID.check = true
                    // console.log(checkID)
                }
            });
            this.temp_remove.push(id);
        }
        else {
            this.list.forEach(checkID => {
                if (checkID.id == id) {
                    checkID.check = false
                    // console.log(checkID)
                }
            });
            this.temp_remove.forEach(idd => {
                if (id != idd) {
                    this.eleListe.push(idd)
                }
            });
            this.temp_remove = this.eleListe
            this.eleListe = []
        }
        console.log(this.temp_remove);
    };
    static async deletee(idDelete, databaseUrl) {
        console.log("deletee wurde aufgerufen");
        try {
            const prepare = "?idDelete=" + idDelete;
            console.log(prepare);
            const response = await fetch(`../database/${databaseUrl}.php` + prepare);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseText = await response.text();
            console.log("Delete Response:", responseText);
            // Versuche JSON zu parsen, falls möglich
            try {
                const jsonResponse = JSON.parse(responseText);
                console.log("Delete Result:", jsonResponse);
                return jsonResponse;
            } catch (jsonError) {
                // Falls kein JSON, gib Text zurück
                console.log("Non-JSON Response:", responseText);
                return { message: responseText };
            }
        } catch (error) {
            console.error("Fehler beim Löschen:", error);
            return { error: error.message };
        }
    }
    static async removeFromListLogik() {
        // DIese Methode wird aufgerufen sobald wir auf Minus (-) klicken
        // Hier benötigen wir die Aktuellen IDS der Datenbank zum löschen
        console.log(this.list);
        this.temp_remove.forEach(id => {
            this.list = this.removeFromListViaID(id, this.list);

        });
        this.temp_remove = []
        console.log(this.list);
    }
    static async remove_generate() {
        if (this.temp_remove.length == 0) {
            alert("Bitte wählen Sie mindestens ein Infotherminal aus, um es zu löschen.");
            return;
        }
        const confirmed = confirm(`Sind Sie sicher, dass Sie ${this.temp_remove.length} Infoterminal(s) löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.`);
        if (!confirmed) {
            console.log("Löschvorgang vom Benutzer abgebrochen");
            return; // Benutzer hat abgebrochen
        }
        await this.removeFromListLogik();
        await warten(100);
        await this.update();
    }
    static erstelleSelector() {
        const selector = document.getElementById('infotherminalSelect');
        const button = document.getElementById('openTerminalBtn');
        if (!selector || !button) {

            return;
        }
        // Event-Listener nur einmal hinzufügen (außerhalb der forEach-Schleife)
        button.addEventListener('click', function () {
            console.log("Button zum Öffnen des Terminals wurde geklickt");
            const selectedTerminal = selector.value;
            console.log("Ausgewähltes Infoterminal:", selectedTerminal);
            if (selectedTerminal.toLowerCase().trim() === "localhost" || selectedTerminal.toLowerCase().trim() === "test anzeige") {
                var obj = findObj(Infoseite.list, Infoseite.selectedID);
                const url = `../output/index.php?template=${encodeURIComponent(obj.imagePath)}`;
                window.open(url, '_blank');
            }

            if (selectedTerminal !== '') {
                const url = `../output/index.php?ip=${encodeURIComponent(selectedTerminal)}`;
                window.open(url, '_blank');
            }
        });
    }
    static erstelleSelectorForCardObj() {
        var selectorInfoterminal = document.getElementById("selectorInfoterminal");
        if (selectorInfoterminal != null) {
            selectorInfoterminal.innerHTML = ""
            selectorInfoterminal.innerHTML = `<option value="">Alle Infoterminals</option>`;
            console.log(Infoterminal.list.length);
            console.log("Infoterminals vorhanden:", Infoterminal.list);
            Infoterminal.list.forEach(Infoterminal => {
                selectorInfoterminal.innerHTML += `<option value="${Infoterminal.id}">${Infoterminal.name}</option>`;
            });
            selectorInfoterminal.addEventListener("change", function (event) {
                console.log("ruby chaaaaaaaaany haaay");
                console.log(event.target.value);
            });
        }
    }
}
window.addEventListener("load", async function () {
    Infoterminal.temp_remove = [];
    // Sende POST-Request zu php/sendingToPage.php
    try {
        const adminBereich = document.getElementById("adminBereich");
        adminBereich.addEventListener('click', async function () {
            window.location.href = 'adminbereich.php';

        });
    } catch (error) {
        console.error("Fehler beim Senden der Anfrage:", error);
    }
    var formID = document.getElementById('formID');
    if (formID) {
        formID.addEventListener('submit', function (event) {
            event.preventDefault(); // Standard-Submit verhindern
            const form = event.target;
            const formData = new FormData(form);
            console.log(form);
            console.log(formData);
            fetch(form.action, {
                method: 'POST',
                body: formData
            })
                .then(response => response.text())
                .then(result => {
                    // Optional: Rückmeldung anzeigen
                    alert(result); // Hier können Sie eine Erfolgsmeldung anzeigen
                    // z.B. Erfolgsmeldung anzeigen oder UI aktualisieren
                    Infoterminal.update();
                    document.querySelectorAll(".addInfotherminal input[type='text']").forEach(input => {
                        input.value = ""; // Eingabefelder leeren
                    });
                })
                .catch(error => {
                    console.error('Fehler beim Hinzufügen:', error);
                });
            form.reset(); // Formular zurücksetzen
        });
    }
});
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function cutAndCreate(responseText) {
    var obj = responseText.split("],[");
    for (let i = 0; i < obj.length; i++) {
        var zeile = obj[i].replace("[[", "").replace("]]", "").replace("[", "").replace("]", "").replace(/"/g, '')
        const inZeile = zeile.split(",");
        // new Infoterminal(inZeile[0], inZeile[1], inZeile[2])
    }
}
document.addEventListener('DOMContentLoaded', async () => {
    if (document.getElementById('infoCounterLimit') && document.getElementById('cardCounterLimit')) {
        const infoCounterLimit = document.getElementById('infoCounterLimit');
        const cardCounterLimit = document.getElementById('cardCounterLimit');
    } else {
        return;
    }
    try {
        console.log("Config wird geladen");
        const res = await fetch('../../config/config.json');
        if (!res.ok) throw new Error(`Config nicht gefunden (Status ${res.status})`);
        const cfg = await res.json();
        // Dropdown befüllen
        // createList(cfg.intervals, select, cfg.default + " " + "minuten"); // falls du einen Default-Wert hast
        createList(cfg.maxCountForInfoPages, infoCounterLimit, cfg.defaultMaxCountForInfoPages + " " + "Info-Seiten");
        createList(cfg.maxCountForInfoTerminals, cardCounterLimit, cfg.defaultMaxCountForInfoTerminals + " " + "Terminals");
        console.log(cfg);
        // saveList(select, "default");
        saveList(infoCounterLimit, "defaultMaxCountForInfoPages");
        saveList(cardCounterLimit, "defaultMaxCountForInfoTerminals");
    } catch (err) {
        console.error('Fehler beim Laden der Config:', err);
        return;
    }
});
function createList(cfg, select, defaultValue) {
    select.innerHTML = ""; // Vorher leeren
    const bitteWaehlen = document.createElement('option');
    bitteWaehlen.value = "bitte wählen";
    bitteWaehlen.textContent = defaultValue;
    select.appendChild(bitteWaehlen);
    cfg.forEach(i => {
        const opt = document.createElement('option');
        opt.value = i.value;
        opt.textContent = i.name;
        select.appendChild(opt);
    });
}
function saveList(select, name) {
    select.addEventListener('change', async () => {
        const newDefault = parseFloat(select.value);
        console.log(`Neuer Default-Wert: ${newDefault}`);
        console.log(`Name: ${name}`);
        if (!newDefault) {
            return;
        }
        try {
            const res = await fetch('../php/config.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name, value: newDefault })
            });
            if (!res.ok) throw new Error(`Speichern fehlgeschlagen (Status ${res.status})`);
            const result = await res.json();
            if (result.success) {
                alert('Default-Intervall gespeichert');
            } else {
                alert('Fehler: ' + result.error);
            }
        } catch (err) {
            console.error('Fehler beim Speichern der Config:', err);
            alert('Speicher-Fehler');
        }
    });
}
async function getData() {
    const result = await fetch('../../config/configTest.json')
    return await result.json();
}
async function setData() {
    try {
        var data = await getData();
        document.getElementById("val1").value = data.webpageSettings[0].maxCountForInfoPages
        document.getElementById("val3").value = data.webpageSettings[0].maxUsers
        document.getElementById("val2").value = data.webpageSettings[0].darkMode
    } catch (err) {
        console.error("Error fetching data:", err);
    }
}
async function update(key, value) {
    console.log(value);
    const result = await fetch("saveValue.php", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
            "key": key,
            "value": value
        }])
    });
    const res = await result.json();
    console.log(res);
}