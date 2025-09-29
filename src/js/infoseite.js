class Infoseite {
    static idCounter = 0;
    static selectedID = null;
    static lastSelectedID = null;
    static temp_remove = [];
    static eleListe = []
    static list = [];
    static selectedHistorys = [];
    static checkAllowed = false; // Variable to control checkbox behavior
    constructor(id, imagePath, selectedTime, aktiv, startTime, endTime, startDate, endDate, timeAktiv, dateAktiv, titel, beschreibung) {

        this.id = id;
        this.update = false;
        //AB hier kommt alles in die Datenbank rein:
        this.imagePath = imagePath //Der Pfad zum Bild
        this.startTime = startTime //Startzeit des Zeitplans
        this.endTime = endTime //Endzeit des Zeitplans
        this.startDate = startDate //Startdatum des Zeitplans
        this.endDate = endDate //Enddatum des Zeitplans
        this.selectedTime = selectedTime // Der aktuelle ausgewählte Wert
        this.timeAktiv = timeAktiv //True or false
        this.dateAktiv = dateAktiv //True or false
        this.aktiv = aktiv //true or false
        this.titel = titel //Der Titel des Objektes
        this.beschreibung = beschreibung == null ? "" : beschreibung //Die Beschreibung des Objektes
        //-------------------------------------
        //HTMLOBJEKTE-------------------------
        this.changed = false;
        this.deleteBtn = `deleteBtn${this.id}`
        this.timeLabel = `timeLabel${this.id}`;
        this.dateLabel = `dateLabel${this.id}`;
        this.isAktiv = `isAktiv${this.id}`;
        this.imageInputId = `imageInput${this.id}`;
        this.modalImageId = `modalImageID${this.id}`;
        this.dateRangeInputId = `daterange${this.id}`;
        this.dateRangeContainerId = `selected-daterange${this.id}`;
        this.infoBtn = `infoBtn${this.id}`;
        this.selectedTimerLabel = `selectedTime${this.id}`
        this.cardObjekte = `cardObjekt${this.id}`
        this.infoCard = `infoCard${this.id}`

        this.checkSelect = `checkSelect${this.id}`
        //-------------------------------------    

        Infoseite.list.push(this)

    }
    htmlBody(umgebung) {
        let placeHolder;
        let icon;

        // Bestimme den korrekten Bildpfad basierend auf dem imagePath
        placeHolder = Infoseite.preparePlaceHolder(this.imagePath);
        icon = Infoseite.iconHTML(this.aktiv);
        const body = `
            <div class="card mb-2 text-center border-2" id="${this.cardObjekte}"  onclick="handleCardClick(${this.id})" onmouseover="handleCardMouseOver(${this.id})" onmouseout="handleCardMouseOut(${this.id})">
                <div id="cardHeader${this.id}" class="card-header p-1">
                </div>
                ${placeHolder}
                <div class="card-body p-2 overflow-hidden">
                    <h5 class="card-title m-0 p-0">${this.titel} <span id="isAktiv${this.id}">${icon}</span></h5> 
                    <p class="card-text m-0">${this.beschreibung}</p>
                    <div class="form-check d-none d-flex justify-content-center align-items-center">
                        <input class="form-check-input single-active-checkbox me-2" type="checkbox" value="" id="flexCheck${this.id}" onclick="erstelleFunktionForCardObj(${this.id})">
                        <label class="form-check-label mb-0" id="label${this.id}" name="label${this.id}" for="flexCheck${this.id}"></label>
                       
                    </div>
                    <div class="form-check">
                        <small id="${this.selectedTimerLabel}" class="text-muted">Dauer: ${getSekMin(this.selectedTime)}</small>
                    </div>
                </div>
                <div class="card-footer p-0 d-flex flex-column">
                    <small class="text-muted" id="${this.dateLabel}">Datum: ${formatDateToDayMonth(this.startDate)} - ${formatDateToDayMonth(this.endDate)}</small>
                     <small class="text-muted" id="${this.timeLabel}">Uhrzeit: ${this.startTime} - ${this.endTime}</small>
                </div>
            </div>
    `;
        document.getElementById(umgebung).innerHTML += body;
    }
    removeHtmlElement() {
        const element = document.getElementById(this.cardObjekte);
        if (element) {
            element.remove();
        }
    }
    checkboxAktiv() {
        const cbAktiv = document.querySelectorAll('[id^="cbAktiv"]')
        cbAktiv.forEach(cb => {
            cb.addEventListener("change", (event) => {
                this.aktiv = event.target.checked;
            });
        });
    }

    static preparePlaceHolder(imagePath) {
        let placeHolder = '';
        let ext = [];
        let videoExts = [];
        let imageExts = [];

        // Prüfe, ob es eine unterstützte URL ist (YouTube, TikTok, Instagram usw.)
        let embedUrl = Infoseite.getEmbedUrl(imagePath);
        if (embedUrl) {
            return placeHolder = `<iframe class="w-100 card-img-small"  src="${embedUrl}" title="Embedded content" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        }
        // Prüfe, ob es ein Bild oder Video ist
        if (imagePath.startsWith('img_') || imagePath.startsWith('video_')) {
            ext = imagePath.split('.').pop().toLowerCase();
            imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'html', 'php', 'docx', 'pdf'];
            videoExts = ['mp4', 'webm'];
        }


        if (imagePath.startsWith('temp')) {

            console.log(imagePath);

            return placeHolder = `<iframe class="card-img-small" src="../output/outTest.php?template=${imagePath}"  alt="Bild" onerror="this.onerror=null; this.src=''"></iframe>`;
        }

        let src = `../../uploads/${imageExts.includes(ext) ? 'img' : 'video'}/${imagePath}`;
        console.log(src);

        if (imageExts.includes(ext)) {
            return placeHolder = `<img class="card-img-small" src="${src}" alt="Bild" onerror="this.onerror=null; this.src=''">`;
        } else if (videoExts.includes(ext)) {
            return placeHolder = `
                <video class="card-img-small w-100" autoplay muted loop>
                  <source src="${src}">
                  Ihr Browser unterstützt das Video-Tag nicht.
                </video>`;
        } else {
            // Fallback für andere Webseiten
            return placeHolder = `
            <div class="card-img-small d-flex align-items-center justify-content-center bg-light text-center p-3">
                <div>
                    <i class="fas fa-link fa-2x text-secondary mb-2"></i>
                    <p class="mb-1">Webseite: <a href="${imagePath}" target="_blank">${imagePath}</a></p>
                    <p class="text-muted small">Hinweis: Einbetten in iframe blockiert (X-Frame-Options).</p>
                </div>
            </div>`;
        }
    }


    static getEmbedUrl(url) {
        if (url.includes("youtube.com")) {
            // Unterstützt auch youtu.be Kurzlinks
            const match = url.match(/(?:v=|\/embed\/|\/v\/|\/shorts\/|youtu\.be\/)([A-Za-z0-9_-]{11})/);
            if (match) {
                return `https://www.youtube.com/embed/${match[1]}`;
            }
        }
        // TikTok: prüfe auf tiktok.com
        if (url.includes("tiktok.com")) {
            const match = url.match(/(?:video\/|embed\/v2\/)([0-9]+)/);
            if (match) {
                return `https://www.tiktok.com/embed/v2/${match[1]}`;
            }
        }
        if (url.includes("youtube"))
            return null;
    }
    static event_remove(id) {
        var element = document.getElementById(`checkDelSchema${id}`);
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
    static iconHTML(aktiv) {
        return aktiv
            ? `<span class="text-success ms-2" id="aktivIcon${this.id}"><i class="fas fa-check-circle"></i></span>`
            : `<span class="text-danger ms-2" id="inaktivIcon${this.id}"><i class="fas fa-times-circle"></i></span>`;
    }
    static async remove_generate() {
        if (this.temp_remove.length == 0) {
            alert("Bitte wählen Sie mindestens ein Schema aus, um es zu löschen.");
            return;
        }

        // Bestätigungsdialog anzeigen
        const confirmed = confirm(`Sind Sie sicher, dass Sie ${this.temp_remove.length} Schema(s) löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.`);

        if (!confirmed) {
            console.log("Löschvorgang vom Benutzer abgebrochen");
            return; // Benutzer hat abgebrochen
        }

        await this.removeFromListLogik();
        await this.update();
    }

    static deaktiviereAllElements(aktiv) {
        const konfigContainer = document.getElementById("konfigContainer");
        const bildschirmVerwaltung = document.getElementById("bildschirmVerwaltung");
        const deleteInfoSeite = document.getElementById("btn_deleteInfoSeite")
        const tabelleDelete = document.getElementById("tabelleDelete")
        const checkbox = document.getElementById("checkA");
        console.log(bildschirmVerwaltung);
        if (aktiv == true) {
            this.removeChanges()
        }
        if (konfigContainer) {
            console.log("DSAGFLKDSAFJLKDSFJLKSJFLKDSFLKJDSLK");
            let buttons = konfigContainer.querySelectorAll('button');
            let inputs = konfigContainer.querySelectorAll('input');

            let selects = konfigContainer.querySelectorAll('select');

            buttons.forEach(button => {
                button.disabled = aktiv;
            });
            inputs.forEach(input => {
                input.disabled = aktiv;

            });
            selects.forEach(select => {
                select.disabled = aktiv;
            });
            if (checkbox.checked) {
                checkbox.checked = false;
            }
        }

        if (bildschirmVerwaltung) {
            var buttons = bildschirmVerwaltung.querySelectorAll('button');
            buttons.forEach(button => {
                button.disabled = aktiv;
            });
        }
        if (deleteInfoSeite) {
            deleteInfoSeite.disabled = aktiv
        }
        if (tabelleDelete) {
            tabelleDelete.innerHTML = "";
        }
        if (aktiv) {
            Infoseite.selectedID = null; // Update the checkAllowed state
        }

    }


    static async deleteCardObj() {
        const confirmed = confirm("Sind Sie sicher, dass Sie die Infoseite löschen möchten?");
        if (!confirmed) {
            console.log("Löschvorgang vom Benutzer abgebrochen");
            return; // Benutzer hat abgebrochen
        }
        await this.deleteCardObjDataBase(this.selectedID);
        await this.update();

        wähleErstesInfoseite();
    }

    static async removeFromListLogik() {
        // DIese Methode wird aufgerufen sobald wir auf Minus (-) klicken
        // Hier benötigen wir die Aktuellen IDS der Datenbank zum löschen
        console.log(this.list);

        // Warte auf alle Löschvorgänge bevor die Liste aktualisiert wird
        for (const id of this.temp_remove) {
            this.list = await this.removeFromListViaID(id, this.list);
        }
        this.temp_remove = []
        console.log(this.list);
    }

    static async removeFromListViaID(id, list) {
        var temp = [];
        console.log(list);

        for (const element of list) {
            if (element.id != id) {
                //ID muss aus Liste gelöscht werden
                temp.push(element);

            } else {
                await this.deleteCardObjDataBase(element.id);
                console.log("Das Element wurde gefunden und wird gelöscht! " + element.id);
                // Nicht sofort return, sondern weiter iterieren um alle anderen Elemente zu behalten
            }
        }
        return temp;
    }
    static async überprüfenÄnderungen() {

        var zuletztAusgewählteObj = "";
        var obj = ""
        if (Infoseite.selectedHistorys.length === 0) {
            return;
        }
        if (Infoseite.selectedHistorys.length > 20) {
            Infoseite.selectedHistorys = [];
            return;
        }
        if (Infoseite.selectedHistorys.length > 2) {
            zuletztAusgewählteObj = Infoseite.selectedHistorys[Infoseite.selectedHistorys.length - 2];
            Infoseite.lastSelectedID = zuletztAusgewählteObj;
            obj = findObj(Infoseite.list, zuletztAusgewählteObj);


        } else {
            zuletztAusgewählteObj = Infoseite.selectedHistorys[0];
            obj = findObj(Infoseite.list, zuletztAusgewählteObj);

        }
        if (!obj) return;
        const konfigContainer = document.getElementById('konfigContainer');
        if (konfigContainer) {
            const inputs = konfigContainer.querySelectorAll('input');
            inputs.forEach(input => {
                input.oninput = null;
                input.addEventListener('input', function (event) {
                    obj.changed = true;
                });
            });
            if (obj.changed && Infoseite.selectedID) {
                var confirmed = confirm("Konfigurationen von Infoseite " + obj.titel + " wurden geändert. Wollen Sie die änderungen speichern?");
                if (confirmed) {
                    // Hier deine Methode aufrufen, z.B. speichern:
                    await Infoseite.saveChanges(obj);
                } else {
                    alert("änderungen wurden nicht gespeichert");
                }
                obj.changed = false;
            }
        }
    }

    static async deleteCardObjDataBase(cardObjId) {
        try {
            // Erst ALLE Beziehungen für dieses Schema löschen
            const relationResponse = await fetch("../database/delete_All_Relations_For_Schema.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    cardObjektID: cardObjId
                })
            });

            const relationResult = await relationResponse.text();
            console.log("Beziehungen gelöscht:", relationResult);

            // Dann das Schema löschen
            const response = await fetch("../database/deleteCardObj.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: cardObjId
                })
            });
            if (!response.ok) {
                throw new Error(`Fehler beim Löschen: ${response.statusText}`);
            }
            const result = await response.text();
            console.log("Schema gelöscht:", result);
        } catch (error) {
            console.error("Fehler:", error);
        }
    }
    static async update() {

        var delSchema = document.getElementById("deleteSchema")
        console.log("bin in delschema drin");
        if (delSchema != null) {
            delSchema.innerHTML = "";
        }
        this.list = [];
        this.temp_remove = [];
        await Infoseite.createCardObj();
        console.log(this.list);
    }
    static async createCardObj() {

        console.log("createCardObj wurde aufgerufen");
        var delSchema = document.getElementById("deleteSchema")
        const response = await readDatabase("selectSchemas");
        console.log(response);
        let objList = convertCardObjForDataBase(response)
        objList.forEach(cardObj => {
            if (cardObj.imagePath == null || cardObj.imagePath == "null" || cardObj.imagePath == "") {
                cardObj.imagePath = ""; // Setze einen Standardwert,
            } else {
                new Infoseite(
                    cardObj.id,
                    cardObj.imagePath,
                    cardObj.selectedTime,
                    cardObj.isAktiv,
                    cardObj.startTime,
                    cardObj.endTime,
                    cardObj.startDate,
                    cardObj.endDate,
                    cardObj.timeAktiv,
                    cardObj.dateAktiv,
                    cardObj.titel,
                    cardObj.beschreibung
                )
                if (delSchema != null) {
                    delSchema.innerHTML += `<tr class="border-bottom">
                    <td class="p-2">${cardObj.id}</td>
                    <td class="p-2">${cardObj.titel}</td>
                    <td class="p-2">${cardObj.beschreibung}</td>
                    <td class="p-2"><input type="checkbox" name="${cardObj.id}" id="checkDelSchema${cardObj.id}" onchange="Infoseite.event_remove(${cardObj.id})"></td>
                </tr>`;
                }
            }
        });
        createBodyCardObj();
        Infoseite.deaktiviereAllElements(true);
        console.log(Infoseite.list);
    }
    static checkAktiv(obj) {
        if (!obj) return;
        var checkA = document.getElementById("checkA");
        if (checkA.checked && obj !== null) {
            console.log("Checkbox ist aktiviert");
            obj.aktiv = true;
            console.log("Checkbox aktiviert für CardObjektID:", obj.id);

        } else {
            if (obj === null) {
                console.warn("Objekt nicht gefunden für ID:", obj.id);
                return;
            }
            obj.aktiv = false;
            console.log("Checkbox deaktiviert für CardObjektID:", obj.id);
        }
    }
    static async saveChanges(obj) {
        if (obj != null) {
            obj = findObj(Infoseite.list, obj.id);
            Infoseite.prepareSelectedTimer(obj);
        } else {
            obj = findObj(Infoseite.list, Infoseite.selectedID);
            Infoseite.prepareSelectedTimer(obj);
        }
        if (obj === null) {
            console.warn("Objekt nicht gefunden für ID:", Infoseite.selectedID);
            return;
        }
        try {
            Infoseite.checkAktiv(obj);
            Infoseite.DateTimeHandler(obj); // Aktualisiere die Datums- und Zeitfelder
            var preCardObj = Infoseite.prepareObjForUpdate(obj); // Bereite das Objekt für die Aktualisierung vor
            await updateDataBase(preCardObj, "updateSchema");
            alert("Änderungen erfolgreich gespeichert!");
            Infoseite.loadChanges(obj); // Lade die Änderungen für das ausgewählte Infoseite
        } catch (error) {
            console.error("Fehler beim Speichern der Änderungen:", error);
            alert("Fehler beim Speichern der Änderungen. Bitte versuchen Sie es erneut.");
        }
    }

    static prepareSelectedTimer(obj) {
        const selectSekunden = document.getElementById("selectSekunden");
        let selectMinuten = null;
        let selectMinutenInt = null;
        if (document.getElementById("selectMinuten")) {
            selectMinuten = document.getElementById("selectMinuten");
        } else {
            selectMinuten = null; // Wenn selectMinuten nicht existiert, setze es auf null
        }
        if (selectMinuten != null) {
            if (selectSekunden.value == "" && selectMinuten.value == "") {
                return; //keine Eingabe, also nichts tun
            }
        } else {
            if (selectSekunden.value == "") {
                return; //keine Eingabe, also nichts tun
            }
        }
        if (selectMinuten) {
            var resultMinuteBool = isParseableNumber(selectMinuten.value)
        } else {
            var resultMinuteBool = true; // Wenn selectMinuten nicht existiert, ist es gültig
        }
        var resultSekundenBool = isParseableNumber(selectSekunden.value)
        if (!resultMinuteBool || !resultSekundenBool) {
            alert("Bitte geben Sie gültige Werte für Minuten und Sekunden ein.");
            selectSekunden.value = "";
            if (selectMinuten) {
                selectMinuten.value = "";
            }
            return;
        }
        let selectSekundenInt = parseInt(selectSekunden.value)
        if (selectMinuten) {
            selectMinutenInt = parseInt(selectMinuten.value)
            console.log("Minuten:", selectMinuten);
        } else {
            selectMinutenInt = null; // Wenn selectMinuten nicht existiert, setze es auf 0
        }
        console.log("Sekunden:", selectSekundenInt);

        if (selectMinutenInt > 59 || selectSekundenInt > 3599) {
            alert("Maximal 3599 Sekunden (59 Minuten) erlaubt.");
            selectSekunden.value = "";
            if (selectMinuten) {
                selectMinuten.value = "";
            }
            return;
        }
        // if (min != 0 && sek) {
        //     obj.selectedTime = (min * 60 + sek) * 1000; // Minuten und Sekunden in Millisekunden umrechnen
        //     console.log("Selected Time in Millisekunden: ", obj.selectedTime);
        //     console.log("sekunden und minuten vorhanden");
        //     return;
        // } else if (min) {
        //     obj.selectedTime = selectMinuten * 60 * 1000; // Minuten in Millisekunden umrechnen
        //     console.log("minuten vorhanden:", obj.selectMinuten);
        //     return;
        // } else if (sek) {
        //     obj.selectedTime = sek * 1000; // Sekunden in Millisekunden umrechnen
        //     console.log("sekunden vorhanden:", obj.selectSekunden);
        //     return;
        // }

        if (selectMinutenInt && selectSekundenInt) {
            obj.selectedTime = (selectMinutenInt * 60 + selectSekundenInt) * 1000; // Minuten und Sekunden in Millisekunden umrechnen
            console.log("Selected Time in Millisekunden: ", obj.selectedTime);
            console.log("sekunden und minuten vorhanden");

        } else if (selectMinuten) {
            obj.selectedTime = selectMinuten * 60 * 1000; // Minuten in Millisekunden umrechnen
            console.log("minuten vorhanden:", obj.selectMinuten);
        } else if (selectSekundenInt) {
            obj.selectedTime = selectSekundenInt * 1000; // Sekunden in Millisekunden umrechnen
            console.log("sekunden vorhanden:", obj.selectSekunden);

        } else {
            obj.selectedTime = 0; // Setze auf 0, wenn keine Eingabe vorhanden ist
            console.log("Keine Zeit ausgewählt, setze auf 0");
        }
    }

    static prepareObjForUpdate(obj) {
        // Hier können Sie das Objekt in den Zustand für die Aktualisierung versetzen
        console.log(obj.selectedTime);
        // var timerSelect = document.getElementById("timerSelectRange");
        // obj.selectedTime = timerSelect.value;
        var preObj = {
            id: obj.id,
            imagePath: obj.imagePath,
            selectedTime: obj.selectedTime,
            isAktiv: obj.aktiv,
            startTime: obj.startTime,
            endTime: obj.endTime,
            startDateTime: obj.startDate,
            endDateTime: obj.endDate,
            timeAktiv: obj.timeAktiv,
            dateAktiv: obj.dateAktiv,
            titel: obj.titel,
            beschreibung: obj.beschreibung
        }; // Erstellen Sie eine Kopie des Objekts
        preObj.update = true; // Setzen Sie das Update-Flag
        console.log("CardObjekt vorbereitet für Update:", preObj.id);
        return preObj;
    }

    static loadChanges(cardObj) {
        if (cardObj === undefined || cardObj === null || Infoseite.selectedID === null) {
            return; // Keine ID ausgewählt, also nichts tun
        }

        console.log("loadChanges aufgerufen für CardObjektID:", cardObj.id);
        var cardtimerLabel = document.getElementById(cardObj.selectedTimerLabel);
        // var timerbereich = document.getElementById("timerSelectRange");
        var titel = document.getElementById("websiteName");
        var anzeigeDauer = document.getElementById("anzeigeDauer");
        var checkA = document.getElementById("checkA");
        var selectSekunden = document.getElementById("selectSekunden");
        var timeLabel = document.getElementById(cardObj.timeLabel);
        var dateLabel = document.getElementById(cardObj.dateLabel);
        var isAktiv = document.getElementById(`isAktiv${cardObj.id}`);
        var startDate = document.getElementById("startDate");
        var endDate = document.getElementById("endDate");
        var startTimeRange = document.getElementById("startTimeRange");
        var endTimeRange = document.getElementById("endTimeRange");
        var ytStart = document.getElementById("startyt");
        var ytEnd = document.getElementById("endyt");

        Infoseite.removeChanges()
        console.log("Startzeit:", cardObj.startTime);
        console.log("Endzeit:", cardObj.endTime);
        console.log("Startdatum:", cardObj.startDate);
        console.log("Enddatum:", cardObj.endDate);
        checkA.checked = cardObj.aktiv; // Set the checkbox state
        titel.innerHTML = cardObj.titel; // Set the title to the checkbox's title
        // timerbereich.value = cardObj.selectedTime; // Set the time range
        var selectedTime = cardObj.selectedTime / 1000; // Convert milliseconds to seconds
        var restSekunden = selectedTime % 60;
        var restMinuten = Math.floor(selectedTime / 60);

        anzeigeDauer.innerHTML = restMinuten + " Min " + restSekunden + " Sek"; // Set the display duration

        let startDateStr = String(cardObj.startDate);
        let endDateStr = String(cardObj.endDate);

        if (cardObj.imagePath.includes("&start=") || cardObj.imagePath.includes("&end=")) {
            var start = cardObj.imagePath.split("&start=")[1].split("&")[0];
            var end = cardObj.imagePath.split("&end=")[1].split("&")[0];
            if (ytStart) ytStart.value = start;
            if (ytEnd) ytEnd.value = end;
        }
        if (startDateStr.includes("T")) {
            // Es ist ein "T" im String enthalten
            console.log('"T" ist in startDate enthalten:', startDateStr);
            var startDateSplit = startDateStr.split("T")[0]; // Get the date part before "T"
        } else {
            var startDateSplit = startDateStr.split(" ")[0]; // Get the date part before "T"
            // Kein "T" im String
            console.log('"T" ist NICHT in startDate enthalten:', startDateStr);
        }
        if (endDateStr.includes("T")) {
            // Es ist ein "T" im String enthalten
            console.log('"T" ist in endDate enthalten:', endDateStr);
            var endDateSplit = endDateStr.split("T")[0]; // Get the date part before "T"
        } else {
            var endDateSplit = endDateStr.split(" ")[0]; // Get the date part before "T"
            // Kein "T" im String
            console.log('"T" ist NICHT in endDate enthalten:', endDateStr);
        }
        console.log("Startdatum:", startDateSplit);
        console.log("Enddatum:", endDateSplit);
        console.log("Startdatum:", startDateStr);
        console.log("Enddatum:", endDateStr);
        startDate.value = startDateSplit // Set the start date
        endDate.value = endDateSplit; // Set the end date

        if (dateLabel && timeLabel && cardtimerLabel && isAktiv != null) {
            dateLabel.innerHTML = `Datum: ${formatDateToDayMonth(startDateStr)} - ${formatDateToDayMonth(endDateStr)}`;
            timeLabel.innerHTML = `Uhrzeit: ${cardObj.startTime} - ${cardObj.endTime}`;
            cardtimerLabel.innerHTML = `Dauer: ${anzeigeDauer.innerHTML}`; // Update the label with the selected time
            var aktiv = `<span class="text-success ms-2" id="aktivIcon${cardObj.id}"><i class="fas fa-check-circle"></i></span>`;
            var inaktiv = `<span class="text-danger ms-2" id="inaktivIcon${cardObj.id}"><i class="fas fa-times-circle"></i></span>`;
            isAktiv.innerHTML = ""; // Clear previous content
            if (cardObj.aktiv) {
                isAktiv.innerHTML = aktiv;
            } else {
                isAktiv.innerHTML = inaktiv;
            }
        }
        startTimeRange.value = cardObj.startTime;
        endTimeRange.value = cardObj.endTime;

        checkA.checked = cardObj.aktiv; // Set the checkbox state
        cardObj.changed = false; // Reset the changed flag

    }
    static removeChanges() {

        // var timerbereich = document.getElementById("timerSelectRange");
        let titel = document.getElementById("websiteName");
        let anzeigeDauer = document.getElementById("anzeigeDauer");
        let checkA = document.getElementById("checkA");
        let selectSekunden = document.getElementById("selectSekunden");
        let startDate = document.getElementById("startDate");
        let endDate = document.getElementById("endDate");
        let startTimeRange = document.getElementById("startTimeRange");
        let endTimeRange = document.getElementById("endTimeRange");

        titel.innerHTML = ""
        checkA.checked = false
        anzeigeDauer.innerHTML = ""
        startDate.value = ""
        endDate.value = ""
        startTimeRange.value = ""
        endTimeRange.value = ""
        selectSekunden.value = ""

    }
    static setTimerRange(value) {
        console.log("Timer Range gesetzt auf:", value);
        var timerbereich = document.getElementById("timerSelectRange");
        if (timerbereich) {
            timerbereich.value = value; // Set the time range
        } else {
            console.error("Timer Select Range Element nicht gefunden");
        }
    }
    static DateTimeHandler(cardObj) {
        console.log("DateTimeHandler aufgerufen für CardObjektID:", cardObj.id);
        let startDateID = document.getElementById("startDate");
        let endDateID = document.getElementById("endDate");
        let startTimeRange = document.getElementById("startTimeRange");
        let endTimeRange = document.getElementById("endTimeRange");

        console.log(startTimeRange.value);
        console.log(endTimeRange.value);
        console.log(startDateID.value);
        console.log(endDateID.value);


        let startTime = "00:00";
        let endTime = "23:59";

        var startDate = startDateID.value;
        var endDate = endDateID.value;
        ;

        if (startDate && endDate && startTime && endTime) {
            let startDateTime = combineDateTime(startDate, startTime);
            let endDateTime = combineDateTime(endDate, endTime);
            console.log("Start DateTime:", startDateTime);
            console.log("End DateTime:", endDateTime);
            if (startDateTime > endDateTime) {
                console.error("Ungültige Eingabe: Startdatum ist größer oder gleich dem Enddatum.");
                // cardObj.startDate = new Date().toISOString();
                // cardObj.endDate = "9999-12-31" + " 00:00";
                return;
            }
            if (startDateTime < new Date(getTodayDate() + "T" + startTime)) {

                return;
            }
            console.log(new Date(getTodayDate() + "T" + startTime));
            console.log(startDateTime);
            cardObj.startDate = startDate + " " + startTime; // Setze das heutige Datum mit der Startzeit
            cardObj.endDate = endDate + " " + endTime; // Setze das heutige Datum mit der Endzeit
            cardObj.dateAktiv = true;
            console.log("alles klar, Datum und Zeit wurden gesetzt");
            console.log("Startdatum:", cardObj.startDate);
            console.log("Enddatum:", cardObj.endDate);
        } else if (endDate && endTime) {
            alert("Nur Enddatum und Endzeit gesetzt");
            var endDateTime = new Date(endDate + " " + endTime);
            if (endDateTime < new Date()) {
                alert("Ungültige Eingabe: Das Enddatum und die Endzeit müssen in der Zukunft liegen.");
                console.error("Ungültige Eingabe: Enddatum ist in der Vergangenheit.");
                return;
            }
            cardObj.endDate = endDate + " " + endTime;
            cardObj.startDate = getTodayDate() + " " + getCurrentTime(); // Setze ein Standard-Startdatum
            cardObj.dateAktiv = true;
            console.log("Enddatum wurde gesetzt");
            console.log("Startdatum:", cardObj.startDate);
            console.log("Enddatum:", cardObj.endDate);
        }
        else if (startTime && startDate) {
            let startDateTime = new Date(startDate + " " + startTime);
            if (startDateTime < new Date(getTodayDate() + "T" + startTime)) {
                alert("Ungültige Eingabe: Das Startdatum muss in der Zukunft liegen.");
                console.error("Ungültige Eingabe: Startdatum ist in der Vergangenheit.");
                cardObj.startDate = new Date().toISOString();
                cardObj.endDate = "9999-12-31" + " 00:00";
                return;
            }
            cardObj.endDate = "9999-12-31" + " 00:00";
            cardObj.startDate = startDate + " " + startTime; // Setze ein Standard-Startdatum
            cardObj.dateAktiv = true;
            console.log("Enddatum wurde gesetzt");
            console.log("Startdatum:", cardObj.startDate);
            console.log("Enddatum:", cardObj.endDate);
        }
        else {
            cardObj.startDate = "";
            cardObj.endDate = "";
            cardObj.dateAktiv = false;
        }
        // Zeitbereich prüfen
        if (startTimeRange || endTimeRange) {
            if (startTimeRange.value && endTimeRange.value) {
                const startTimeOnly = combineDateTime("1970-01-01", startTimeRange.value);
                const endTimeOnly = combineDateTime("1970-01-01", endTimeRange.value);

                if (startTimeOnly > endTimeOnly) {
                    alert("Ungültige Eingabe: Die Startzeit muss vor der Endzeit liegen.");
                    console.error("Ungültige Eingabe: Startzeit ist größer oder gleich der Endzeit.");
                    insertErrorLog("Ungültige Eingabe: Startzeit ist größer oder gleich der Endzeit.");
                    return;
                } else {
                    cardObj.startTime = startTimeRange.value;
                    cardObj.endTime = endTimeRange.value;
                    cardObj.timeAktiv = true;
                    console.log("Zeitbereich wurde gesetzt");
                }
            } else if (startTimeRange.value) {
                cardObj.startTime = startTimeRange.value;
                cardObj.endTime = "23:59"; // Setze einen Standardwert, wenn nur Startzeit gesetzt ist
                cardObj.timeAktiv = true;
                console.log("Startzeit wurde gesetzt");
            } else if (endTimeRange.value) {
                cardObj.endTime = endTimeRange.value;
                cardObj.startTime = "00:00"; // Setze einen Standardwert, wenn nur Endzeit gesetzt ist
                cardObj.timeAktiv = true;
                console.log("Endzeit wurde gesetzt");
            } else {
                cardObj.startTime = "";
                cardObj.endTime = "";
                cardObj.timeAktiv = false;

            }
        } else {
            cardObj.startTime = "";
            cardObj.endTime = "";
            cardObj.timeAktiv = false;

        }
        console.log("Startzeit:", cardObj.startTime);
        console.log("Endzeit:", cardObj.endTime);
        console.log("Startdatum:", cardObj.startDate);
        console.log("Enddatum:", cardObj.endDate);

    }

    static removeDateRange(objID) {
        var btnDelDateTime = document.getElementById('btnDelDateTime');
        var startDate = document.getElementById("startDate");
        var endDate = document.getElementById("endDate");
        if (btnDelDateTime && objID !== null) {
            startDate.value = "";
            endDate.value = "";
        }
    }

    static removeTimeRangeFromDate(objID) {
        var startTime = document.getElementById("startTime");
        var endTime = document.getElementById("endTime");
        var btnDelDateTime = document.getElementById('btnDelDateTime');
        if (btnDelDateTime && startTime && endTime && objID !== null) {
            startTime.value = "";
            endTime.value = "";
        }
    }

    static removeTimeRange(objID) {
        var btnDelTime = document.getElementById('delTimeRange');
        var startTimeRange = document.getElementById("startTimeRange");
        var endTimeRange = document.getElementById("endTimeRange");
        if (btnDelTime && objID !== null) {
            startTimeRange.value = '';
            endTimeRange.value = '';
        }
    }
    static deleteDateTimeRange(objID) {
        console.log("deleteDateTimeRange aufgerufen für CardObjektID:", objID);

        var btnDelDateTime = document.getElementById('btnDelDateTime');
        if (btnDelDateTime && objID !== null) {
            Infoseite.removeDateRange(objID);
            Infoseite.removeTimeRangeFromDate(objID);
            console.log("Datum und Zeitbereich wurden gelöscht");
        } else {
            console.error("Button oder Objekt-ID nicht gefunden");
        }
    }

}


function combineDateTime(date, time) {
    return new Date(`${date}T${time}`);
}

function formatDateToDayMonth(dateTimeStr) {
    // Erwartetes Format: "YYYY-MM-DD HH:MM"
    if (!dateTimeStr || typeof dateTimeStr !== "string") return "";
    if (dateTimeStr === "9999-12-31 00:00") return "";
    if (dateTimeStr.includes("T")) {
        const [datePart] = dateTimeStr.split("T");
        if (!datePart) return "";
        const [year, month, day] = datePart.split("-");
        if (!day || !month) return "";
        return `${day}.${month}`;
    }
    if (dateTimeStr.includes(" ")) {
        const [datePart] = dateTimeStr.split(" ");
        if (!datePart) return "";
        const [year, month, day] = datePart.split("-");
        if (!day || !month) return "";
        return `${day}.${month}`;
    }
}

if (document.querySelectorAll('input[type="date"]') || document.querySelectorAll('input[type="time"]')) {
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('input[type="date"]').forEach(function (input) {
            input.addEventListener('keydown', function (e) {
                e.preventDefault();
            });
        });
    });
}

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Monat von 0-11, daher +1
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}
function previewFile(type, input, event, container) {
    const imgPreview = document.getElementById('imgPreview');
    const videoPreview = document.getElementById('videoPreview');
    const previewContainer = document.getElementById('previewContainer');
    if (type == null) {
        return;
    }
    else if (type == 'single') {
        const file = input.files[0];
        if (file) {
            const fileType = file.type;
            const reader = new FileReader();
            reader.onload = function (e) {

                if (fileType.startsWith('image/')) {
                    imgPreview.src = e.target.result;
                    imgPreview.style.display = 'block';
                    videoPreview.style.display = 'none';
                } else if (fileType.startsWith('video/')) {
                    videoPreview.src = e.target.result;
                    videoPreview.style.display = 'block';
                    imgPreview.style.display = 'none';
                }
                previewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            previewContainer.style.display = 'none';
        }
    } else if (type == 'multiple') {
        for (let i = 0; i < event.target.files.length; i++) {
            const cont = document.getElementById(container);
            const count = cont.querySelectorAll('img').length;
            if (count >= 5) {
                alert("Maximal 5 Bilder erlaubt.");
                return;
            }
            var image = document.createElement('img');
            image.src = URL.createObjectURL(event.target.files[i]);
            image.id = "output";
            image.width = "50";
            document.querySelector(`#${container}`).appendChild(image);
        }
    } else {
        previewContainer.style.display = 'none';
    }
}
function detectLinkType(link) {
    if (checkYoutubeUrl(link)) return "yt";
    if (checkTikTokUrl(link)) return "tiktok";
    return null; // Unbekannter Typ
}
async function meow(event, selectedValue, link, start, end) {
    event.preventDefault(); // Verhindert das Standardverhalten des Formulars
    // Improved file upload handling for multiple images
    let validLink = "";
    let prefix = "";
    if (selectedValue === "img") {
        const result = await sendDatei(event);
        if (result) {
            console.log("Infoseite wurde erfolgreich erstellt.");
        } else {
            console.log("Fehler beim Erstellen der Infoseite.");
        }
        return; // Für Bilder ist es anders, daher return
    } else if (selectedValue === "yt") {
        var { datai, selectedTime, aktiv, titel, description } = prepareFormData(event);
        console.log("Selected Value:", selectedValue);
        console.log("Link:", link);
        console.log("Start:", start);
        console.log("End:", end);
        var start = Number(start);
        var end = Number(end);
        if (isNaN(start) || isNaN(end)) {
            alert("Start- und Endzeit müssen Zahlen sein.");
            return;
        }
        if (start > end) {
            alert("Die Startzeit darf nicht größer als die Endzeit sein.");
            return;
        }
        if (!datai || titel === "" || selectedTime === null || aktiv === null) {
            alert("Bitte füllen Sie alle pflicht Felder aus, inklusive Bild.");
            return;
        }
        console.log("Externe Video-Quelle ausgewählt");
        const linkType = detectLinkType(link);
        if (linkType) {
            if (start || end) {
                validLink = link + `&start=${start}&end=${end}`;
            } else {
                validLink = link;
            }
            prefix = linkType + "_"; // z.B. "yt_", "tiktok_"
            console.log("Valid Link:", validLink);

        } else {
            alert("Ungültiger Link. Unterstützt: YouTube, TikTok, Instagram, ZDF, Tagesschau.");
            return;
        }
    } else if (selectedValue === "temp1") {
        const result = await sendDatei(event);
        alert("diese Option ist noch in Arbeit.");
        return;
    } else if (selectedValue === "tempTest") {
        const result = await sendDatei(event);
        alert("diese Option ist noch in Arbeit.");
    } else {
        const result = await sendDatei(event);
        alert("Unbekannter Typ ausgewählt.");
        return;
    }
    // Gemeinsame Logik für Links
    const prefixedLink = prefix + validLink;
    console.log("Prefixed Link:", prefixedLink);
    try {
        await createInfoseiteObj(prefixedLink, selectedTime, aktiv, titel, description);
        
        Template.resetForm("infoSeiteForm");
        console.log("Infoseite wurde erfolgreich erstellt.");
    } catch (error) {
        console.error("Fehler beim Erstellen der Infoseite:", error);
        alert("Fehler beim Erstellen der Infoseite. Bitte versuchen Sie es erneut.");
    }
}
async function createInfoseiteObj(serverImageName, selectedTime, aktiv, titel, description) {
    debugger
    try {
        const obj1 = new Infoseite(
            "",
            serverImageName, // Nur Bildname, kein Pfad
            selectedTime,
            aktiv,
            "",
            "",
            "",
            "",
            "",
            "",
            titel,
            description
        )
        console.log(obj1.selectedTime);
        const result = await insertDatabase(obj1);
        alert("Infoseite erfolgreich erstellt!");
        await Infoseite.update();
        console.log(result);
        selectNewInfoseite();
    } catch (error) {
        console.error("Fehler beim erstellen des Infoseite:", error);
    }
}
function checkYoutubeUrl(url) {
    const harmfulChars = /[<>"';]/;
    if (harmfulChars.test(url)) {
        return false;
    }
    // Erlaubt normale YouTube-Links (watch, embed, shorts, youtu.be)
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(\S*)?$/;
    return pattern.test(url);
}

function checkTikTokUrl(url) {
    const harmfulChars = /[<>"';]/;
    if (harmfulChars.test(url)) {
        return false;
    }
    // Erlaubt normale TikTok-Links und vm.tiktok.com-Links
    const pattern = /^(https?:\/\/)?(www\.)?(tiktok\.com\/(@[\w.-]+\/video\/|embed\/v2\/)|vm\.tiktok\.com\/)[A-Za-z0-9_-]{19}(\S*)?$/;
    return pattern.test(url);
}
function prepareFormData(event) {
    event.preventDefault(); // Verhindert das Standardverhalten des Formulars
    debugger
    let formData = null;
    let datai = null;
    const form = event.target.form;
    formData = new FormData(form);
    var inputContainer = document.getElementById('inputContainer');
    console.log(formData.get('youtubeUrl'));
    if (formData.get('files[]')) {
        datai = formData.get('files[]');
        const files = Array.from(inputContainer.querySelectorAll('input[type="file"]')).flatMap(inp => Array.from(inp.files || []));
        console.log(files);
        if (!files) {
            alert("Kein Datei-Input für Bilder gefunden.");
            return;
        }
        if (!files || files.length === 0) {
            alert("Bitte wählen Sie mindestens ein Bild aus.");
            return;
        }
        alert(`Anzahl ausgewählter Bilder: ${files.length}`);
        for (let i = 0; i < files.length; i++) {
            formData.append('files[]', files[i]);
        }
    } else if (formData.get('youtubeUrl')) {
        datai = formData.get('youtubeUrl');
    }
    const selectedTime = String(formData.get('selectedTime')); // Wert als Zahl
    const aktiv = formData.get('aktiv'); // Wert der ausgewählten Option
    const titel = formData.get('title');
    const description = formData.get('description');
    return { formData, datai, selectedTime, aktiv, titel, description };
}
async function sendDatei(event) {
    let { formData, selectedTime, aktiv, titel, description } = prepareFormData(event); // Formulardaten vorbereiten
    const form = event.target.form;
    console.log("Selected Time:", selectedTime);
    if (!datai || selectedTime === "" || aktiv === null || titel === "") {
        alert("Bitte füllen Sie alle pflicht Felder aus, inklusive Bild.");
        return false;
    }
    if (datai.size > 7.8 * 1024 * 1024) { // 8 MB in Bytes
        alert("Die Datei ist zu groß. Bitte wählen Sie eine Datei unter 8 MB.");
        return false;
    }
    // Bild hochladen und vom Server den Dateinamen erhalten
    console.log("image: ", datai.name);
    if (datai.name == "") {
        alert("Bitte wählen Sie eine Datei aus.");
        return false;
    }
    const serverImageName = await sendPicture(formData);
    console.log("Server Image Name:", serverImageName);
    // Infoseite mit dem vom Server erhaltenen Bildnamen erstellen
    if (serverImageName === "") {
        console.error("Bild konnte nicht hochgeladen werden.");
        alert("Fehler beim Hochladen des Bildes. Bitte versuchen Sie es erneut. Bitte keine ungültigen Zeichen verwenden.");
        return false;
    }
    await createInfoseiteObj(serverImageName, selectedTime, aktiv, titel, description);
    form.reset(); // Formular zurücksetzen
    Template.resetForm("infoSeiteForm");
    return true;
}
async function sendPicture(datai) {
    try {
        const response = await fetch("../php/movePic.php", {
            method: 'POST',
            body: datai
        });
        let imageName = await response.text();
        console.log("Bildname vom Server:", imageName);
        // Falls der Server einen Pfad zurückgibt, extrahiere nur den Dateinamen
        if (imageName.includes('../../uploads/img/')) {
            imageName = imageName.split('/').pop(); // Extrahiere nur den Dateinamen

        } else if (imageName.includes('../../uploads/video/')) {
            imageName = imageName.split('/').pop(); // Extrahiere nur den Dateinamen
        }
        return imageName;
    } catch (error) {
        console.error('Error:', error);

        return "";
    }
}
async function insertDatabase(cardObj) {
    // Erstellen eines JSON-Objekts
    const jsonData = {
        titel: cardObj.titel,
        beschreibung: cardObj.beschreibung,
        imagePath: cardObj.imagePath,
        selectedTime: cardObj.selectedTime,
        aktiv: cardObj.aktiv,
        startTime: cardObj.startTime,
        endTime: cardObj.endTime,
        startDateTime: cardObj.startDate,
        endDateTime: cardObj.endDate,
        timeAktiv: cardObj.timeAktiv,
        dateAktiv: cardObj.dateAktiv
    };
    console.log(jsonData.selectedTime);
    // Senden der POST-Anfrage mit JSON-Daten
    const response = await fetch("../database/insertSchema.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonData)
    });
    if (!response.ok) {
        console.error("Fehler beim Einfügen:", response.statusText);
    } else {
        const result = await response.json();
        console.log(result);

        return result; // Rückgabe der neuen ID
    }
}
function selectNewInfoseite() {
    if (Infoseite.list.length > 0) {
        const lastObj = Infoseite.list[Infoseite.list.length - 1]; // Letztes Objekt in der Liste
        document.getElementById(`cardObjekt${lastObj.id}`).click(); // Simuliere einen Klick auf das letzte Objekt
        console.log("Letztes Objekt ausgewählt:", lastObj.id);
    } else {
        console.warn("Keine Objekte in der Liste vorhanden.");
    }
}

function createBodyCardObj() {
    var cardContainer = document.getElementById("cardContainer");
    if (!cardContainer) {
        console.error("Card container not found");
        return;
    }
    cardContainer.innerHTML = ""; // Clear existing content
    Infoseite.list.forEach(cardObj => {
        const cardContainer = "cardContainer"
        cardObj.htmlBody(cardContainer);

    });
    console.log(Infoseite.list);
    // Alle Checkboxen mit ID, die mit "flexCheck" beginnt, auswählen und loopen
};

if (document.getElementById("selectSekunden")) {
    const input = document.getElementById("selectSekunden");
    const anzeigeDauer = document.getElementById("anzeigeDauer");
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            // Deine Aktion hier
            var sekunden = input.value
            var minuten = 0;
            console.log(sekunden);
            var intParse = isParseableNumber(sekunden)
            if (!intParse) {
                alert("Bitte Zahlen eingeben")
                return
            }
            if (sekunden < 0 || sekunden > 3599) {
                alert("Maximal 3599 Sekunden (59 Minuten) erlaubt.");
                return;
            }
            if (sekunden > 59) {
                var minuten = Math.floor(sekunden / 60);
                sekunden = sekunden % 60;
                var restSekunden = sekunden % 60;
                console.log("Minuten:", minuten);
                console.log("Sekunden:", restSekunden);
                anzeigeDauer.innerHTML = "Min " + minuten + " Sek: " + restSekunden; // Set the display duration

            } else {
                anzeigeDauer.innerHTML = "0 Min " + sekunden + " Sek"; // Set the display duration
            }
        }
    });
}
function erstelleFunktionForCardObj(objID) {
    if (!objID) return;
    Infoseite.selectedHistorys.push(objID);
    Infoseite.lastSelectedID = objID;
    const checkbox = document.getElementById(`flexCheck${objID}`);
    const label = document.getElementById(`label${objID}`);
    const cardObj = document.getElementById(`cardObjekt${objID}`);
    const cbForSelectSchema = document.querySelectorAll('[id^="flexCheck"]');
    const labelForSelectSchema = document.querySelectorAll('[id^="label"]');
    const allCardObj = document.querySelectorAll(`[id^="cardObjekt"]`)
    Infoseite.überprüfenÄnderungen();
    if (checkbox.checked) {
        console.log("moew uwu kabum omi");
        const id = extractNumberFromString(checkbox.id);
        var obj = findObj(Infoseite.list, id);
        Infoseite.selectedID = id; // Set the selected ID
        Infoseite.deaktiviereAllElements(false)
        Infoseite.loadChanges(obj); // Load changes for the selected Infoseite
        // Infoseite.DateTimeHandler(obj);
        cardObj.style.border = "2px solid #006c99";
        cardObj.style.transition = "border 0.2s ease-in-out";
        cardObj.style.borderRadius = "8px";
        const cardHeader = document.getElementById("cardHeader" + id);
        cardHeader.style.backgroundColor = "#006c99";
        cbForSelectSchema.forEach(cb => {
            if (id !== extractNumberFromString(cb.id)) {
                cb.checked = false;
            }
        });
        allCardObj.forEach(cardObj => {
            const cardHeader = document.getElementById("cardHeader" + extractNumberFromString(cardObj.id));
            if (id !== extractNumberFromString(cardObj.id)) {
                cardObj.style.border = "1px solid rgba(0,0,0,.125)";
                cardHeader.style.backgroundColor = "";

            }
        });
        console.log("Checkbox mit ID " + id + " wurde aktiviert.");
        console.log(Infoseite.selectedID);
        if (objID == Infoseite.selectedID) {
            label.innerHTML = "Ausgewählt"; // Set the label text to "checked" when checked
            labelForSelectSchema.forEach(label => {
                if (id !== extractNumberFromString(label.id)) {
                    label.innerHTML = ""; // Clear the label text for unchecked checkboxes
                }
            });
        } else {
            label.innerHTML = ""; // Clear the label text for unchecked checkboxes
            console.log("Checkbox mit ID " + labelId + " wurde deaktiviert.");
        }
    } else {
        cardObj.style.border = "none";
        cardObj.style.transition = "border 0.2s ease-in-out";
        const cardHeader = document.getElementById("cardHeader" + objID);
        cardHeader.style.backgroundColor = "";
        console.log("Checkbox mit ID " + objID + " wurde deaktiviert.");
        Infoseite.deaktiviereAllElements(true)
        // labelForSelectSchema.forEach(label => {
        //     label.innerHTML = ""; // Clear the label text for unchecked checkboxes
        // });
        allCardObj.forEach(cardObj => {
            cardObj.style.border = "1px solid rgba(0,0,0,.125)";
        });
        Infoseite.selectedID = null; // Reset the selected ID
    }
    Beziehungen.update(Infoseite.selectedID);
}

function handleCardClick(id) {
    const cardObj = document.getElementById("cardObjekt" + id);
    const flexCheck = document.getElementById("flexCheck" + id);
    flexCheck.checked = !flexCheck.checked;
    erstelleFunktionForCardObj(id)

    // cardObj.style.border = checkbox.checked ? "2px solid #006c99" : "none";
}
function handleCardMouseOver(id) {
    const cardObj = document.getElementById("cardObjekt" + id);
    cardObj.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    cardObj.style.cursor = "pointer";
}

function handleCardMouseOut(id) {
    const cardObj = document.getElementById("cardObjekt" + id);
    cardObj.style.boxShadow = "none";
}

function wähleErstesInfoseite() {
    if (Infoseite.list.length > 0) {
        var titelUmgebung = document.getElementById("titelUmgebung");
        const erstesObjekt = Infoseite.list[0];
        try {
            document.getElementById(`cardObjekt${erstesObjekt.id}`).click(); // Simuliere einen Klick auf das erste Objekt
            titelUmgebung.innerHTML = "";
        } catch (error) {
            console.error("Erstes Objekt konnte nicht ausgewählt werden.", error);
            titelUmgebung.innerHTML = "<div style='font-weight: bold; font-size: 0.8rem;'>Keine Infoseiten vorhanden</div>";
        }

    }
}

window.addEventListener("DOMContentLoaded", function () {
    const btnAddInfoSeite = document.getElementById("btn_addInfoSeite");
    if (btnAddInfoSeite) {
        btnAddInfoSeite.click();
    }
});