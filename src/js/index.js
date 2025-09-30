let cancelUplaod = false
var zeitEingegeben = false
let pushDelete = false
let json;
let selectedCard = "";
var anzeigebereichV = document.getElementById("anzeigebereichV");

window.onload = async function () {
    console.log("window.onload von index.js läuft!");
    const ipAdress = await getSystemPath();
    console.log("IP-Adresse:", ipAdress);
    if (document.getElementById("dokumente")) {
        try {

            await Infoseite.update();

        } catch (error) {
            console.error("Fehler beim Erstellen der CardObjekte oder umgebungen:", error);
        }
    }
    try {
        await Infoterminal.update();
        Infoterminal.erstelleSelector();
        Infoterminal.erstelleSelectorForCardObj();

    } catch (error) {
        console.error("Fehler beim Aktualisieren der Infoterminal:", error);
    }
    // Modal Focus-Management hinzufügen
    setupModalFocusManagement();
    // Hier wird die startseite ausgewählt
    erstelleNavigation();
    try {
        wähleErstesInfoseite();

    } catch (error) {
        console.error("Fehler beim Klicken auf das Kontrollkästchen:", error);
    }

}

function getSekMin(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes} Min,  ${seconds} Sek`;
}

function deakNavbarbtns() {
    try {
        const startBtnsContainer = document.getElementById("startBtns");
        const buttonsInContainer = startBtnsContainer.querySelectorAll("button");

        buttonsInContainer.forEach(button => {
            button.addEventListener("click", function () {
                console.log(`Button mit ID ${button.id} wurde geklickt`);
                // Alle Buttons aktivieren
                buttonsInContainer.forEach(btn => {
                    btn.disabled = false;
                });

                // Nur den geklickten Button deaktivieren
                button.disabled = true;
            });
        });

    } catch (error) {
        console.error("Fehler beim Laden der Seite:", error);
    }

}
function erstelleNavigation() {
    const infoterminalBereich = document.getElementById("infotherminalBereich");
    const homeBereich = document.getElementById("homeBereich");
    if (infoterminalBereich) {
        infoterminalBereich.addEventListener("click", async function (event) {
            window.location.href = 'dashboard.php';
        });
    }

    if (homeBereich) {
        homeBereich.addEventListener("click", async function (event) {
            window.location.href = 'index.php';
        });
    }
}

async function logout() {
    try {
        await fetch('../login/logout.php').then(response => {
            if (response.ok) {
                window.location.href = '../login/index.php';
            }
        });

    } catch (error) {
        console.error("Fehler beim Logout:", error);
    }
}



function warten(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getSystemPath() {
    let path = null;
    try {
        const response = await fetch("../php/getSystemPath.php");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        path = await response.text();
        console.log("System Path erhalten:", path);
    } catch (error) {
        console.error("Fehler beim Abrufen des Systempfads:", error);
        path = "/html_infoterminal/"; // Fallback-Pfad
    }
    return path;
}



function checkAnzahl() {
    const anzahlInfo = Infoterminal.list.length;
    const anzahlCardObj = Infoseite.list.length;
    console.log("Anzahl der Umgebungen:", anzahlInfo);
    console.log("Anzahl der CardObjekte:", anzahlCardObj);
    if (anzahlInfo > 0) {
        document.getElementById("selectUmgebung").disabled = false;
    } else {
        document.getElementById("selectUmgebung").disabled = true;
    }

}

function bereinigeDatenbankUndFolder() {
    if (confirm("Möchten Sie wirklich die Datenbank und den Upload-Ordner bereinigen? Diese Aktion kann nicht rückgängig gemacht werden.")) {
        fetch('../database/deleteFileFolder.php', {
            method: 'POST'
        })
            .then(response => response.text())
            .then(data => {
                console.log('Erfolg:', data);
                alert("Datenbank und Upload-Ordner wurden erfolgreich bereinigt.");
                location.reload(); // Seite neu laden, um Änderungen anzuzeigen
            })
            .catch((error) => {
                console.error('Fehler:', error);
                alert("Fehler beim Bereinigen der Datenbank und des Upload-Ordners.");
            });
    } else {
        console.log("Bereinigung abgebrochen.");
    }
}



function extractNumberFromString(str) {
    const match = str.match(/\d+$/);
    return match ? match[0] : null;
}


async function readDatabase(databaseUrl) {
    const listUmgebung = await selectObj(`../database/${databaseUrl}.php`)
    return listUmgebung;
}


console.log("index_new.js wurde geladen");
function saveToLocalStorage(key, jsonData) {
    const jsonString = JSON.stringify(jsonData, null, 2); // Formatierung für bessere Lesbarkeit
    localStorage.setItem(key, jsonString);
}
function getJsonData(key) {
    const jsonData = localStorage.getItem(key);
    const obj = JSON.parse(jsonData);
    return obj
}


function showDateTime(type) {
    const zeitspannePanel = document.getElementById("zeitspannePanel");
    const uhrzeitPanel = document.getElementById("uhrzeitPanel");
    const dateTimeInfoPanel = document.getElementById("dateTimeInfoPanel");

    if (type === 'zeitspanne') {
        zeitspannePanel.style.display = "block";
        uhrzeitPanel.style.display = "none";
        dateTimeInfoPanel.style.display = "none";
    } else if (type === 'uhrzeit') {
        zeitspannePanel.style.display = "none";
        uhrzeitPanel.style.display = "block";
        dateTimeInfoPanel.style.display = "none";
    } else if (type === 'dateTimeInfoPanel') {
        dateTimeInfoPanel.style.display = "block";
        zeitspannePanel.style.display = "none";
        uhrzeitPanel.style.display = "none";
    }
}
function findObj(list, id) {

    if (typeof id === "string") {
        var number = extractNumberFromString(id);
    } else {
        var number = id; // Falls id bereits eine Zeichenkette ist
    }

    if (!Array.isArray(list)) {
        console.warn('findObj: list ist kein Array');
        return null;
    }
    const found = list.find(cardObj => String(cardObj.id) === String(number));
    if (found) {
        found.update = true; // Optional: nur wenn du das Flag wirklich brauchst
        return found;
    }
    console.warn(`Objekt mit ID ${id} nicht gefunden.`);
    return null;
}

function convertCardObjForDataBase(cardObjListe) {
    objListe = []
    cardObjListe.forEach(cardObj => {
        var obj = {
            id: cardObj[0],
            imagePath: cardObj[1],
            selectedTime: cardObj[2], //True or false
            isAktiv: cardObj[3], //True or false
            startTime: cardObj[4],
            endTime: cardObj[5],
            startDate: cardObj[6],
            endDate: cardObj[7],
            timeAktiv: cardObj[8], //True or false
            dateAktiv: cardObj[9], //True or false
            titel: cardObj[10],
            beschreibung: cardObj[11]
        };
        objListe.push(obj)
    });
    return objListe
}


// Aufruf der Funktion

async function selectObj(select) {
    try {
        const response = await fetch(select, { // .php Extension hinzugefügt
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("Fehler beim Laden der Infoterminal:", error);
        return null;
    }
}

function saveTempAddDatabase() {
    Infoterminal.tempListForSaveCards.forEach(cardObj => {
        insertDatabase(cardObj)
        console.log(cardObj.imagePath);
    });
    Infoterminal.tempListForSaveCards = []
}

function saveCardObj() {
    Infoterminal.allCardList.forEach(cardObjlist => {
        cardObjlist.forEach(cardObj => {
            console.log(cardObj);
        });
    });
}


function isParseableNumber(str) {
    for (const ch of str) {
        if (ch.trim() === "") continue; // Leerzeichen überspringen
        if (!Number.isNaN(Number(ch))) {
            console.log("parseable number:", ch);
        } else {
            console.log("not parseable:", ch);
            return false;
        }
    }
    return true;
};

async function updateDataBase(cardObj, databaseUrl) {
    // Erstellen eines FormData-Objekts
    try {
        console.log("updateDataBase wurde aufgerufen");
        const createJsObj = JSON.stringify(cardObj)
        var result = await fetch(`../database/${databaseUrl}.php`, {
            method: "POST",
            body: createJsObj
        });
        const responseText = await result.text();
        console.log("Antwort vom Server:", responseText);
    } catch (error) {
        console.error("Fehler in updateDataBase:", error);
    }
}



// Neue Funktion für Modal Focus-Management
function setupModalFocusManagement() {
    const modals = document.querySelectorAll('.modal');

    modals.forEach(modal => {
        // Beim Öffnen des Modals
        modal.addEventListener('show.bs.modal', function () {
            // Entferne aria-hidden vor dem Öffnen
            modal.removeAttribute('aria-hidden');
        });

        // Beim Schließen des Modals
        modal.addEventListener('hide.bs.modal', function () {
            // Blur alle fokussierten Elemente im Modal
            const focusedElement = modal.querySelector(':focus');
            if (focusedElement) {
                focusedElement.blur();
            }
        });

        // Nach dem Schließen des Modals
        modal.addEventListener('hidden.bs.modal', function () {
            // Setze aria-hidden erst nach dem vollständigen Schließen
            modal.setAttribute('aria-hidden', 'true');
        });
    });
}


function uncheckAllTableCheckboxes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reset auch die temp_remove Liste
    if (Infoterminal.temp_remove) {
        Infoterminal.temp_remove = [];
    }
    if (Infoseite.temp_remove) {
        Infoseite.temp_remove = [];
    }
    console.log(`${checkboxes.length} Tabellen-Checkboxes wurden ausgeschaltet`);
}
async function startProgressBar(ms, idbar) {
    ms = ms || 10000; // ms → bestimmt Ladegeschwindigkeit (hier 20s)
    const bar = document.createElement('div');
    bar.classList.add('progress-bar');
    bar.id = 'progress' + idbar;
    const progress = document.createElement("div");
    progress.classList.add('progress');
    progress.appendChild(bar);
    document.body.appendChild(progress);
    const params = new URLSearchParams(window.location.search);
    const timeParam = params.get('time');
    if (timeParam && !isNaN(timeParam)) {
        ms = parseInt(timeParam, 10);

    }
    bar.classList.remove('run');
    bar.textContent = '';
    bar.style.setProperty('--dur', ms + 'ms');
    // Nächsten Frame starten
    requestAnimationFrame(() => {
        bar.classList.add('run');
        setTimeout(() => {
            bar.textContent = 'DFDF';
        }, ms);
    });
}
(function () {
    try {
        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.setAttribute('data-bs-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-bs-theme', 'light');
        }
    } catch (e) { }
})();
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('themeToggle')) {
        document.getElementById('themeToggle').addEventListener('click', () => {
            const root = document.documentElement;
            if (root.getAttribute('dark') || root.getAttribute('data-bs-theme') === 'dark') {
                root.setAttribute('data-bs-theme', 'light');
                root.removeAttribute('data-bs-theme');
                localStorage.removeItem('theme');
            } else {
                root.setAttribute('data-bs-theme', 'dark'); // oder: root.setAttribute('data-bs-theme','dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

});


// if (document.getElementById('addInfoSeite')) {
//     document.addEventListener('DOMContentLoaded', function () {
//         const modalElement = document.getElementById('addInfoSeite');
//         if (modalElement) {
//             const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
//             modalInstance.show(); // Öffnet das Modal automatisch
//         } else {
//             console.error('Modal-Element nicht gefunden.');
//         }
//     });
// }

