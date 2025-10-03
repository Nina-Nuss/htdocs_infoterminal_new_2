class Template {
    static list = []
    static testAnzeige = []
    static imgContainerCount = 0;
    static youtubeContainerCount = 0;
    static ccText = 0;
    constructor(id, templateName, typ, inhalt) {
        this.id = id;
        this.templateName = templateName
        this.typ = typ
        this.inhalt = inhalt
        Template.list.push(this);
    }
    static selectTemplate(template) {
        var templatesContainer = document.getElementById("templatesContainer");
        var fileInput = document.getElementById('img');
        var inputGroupSelect01 = document.getElementById('inputGroupSelect01');
        var ytInput = document.getElementById('youtubeUrl');
        var Youtube = document.getElementById('YoutubeContainer');
        if (!inputGroupSelect01) return;
        var selectedValue = template;

        if (selectedValue === 'yt') {
            this.resetAll();
            templatesContainer.innerHTML = Template.youtubeContainer();
                if(fileInput) {
                fileInput.disabled = true;
                fileInput.value = '';
            } if (ytInput) ytInput.disabled = false;
        } else if (selectedValue === 'img') {
            this.resetAll();
            debugger
            templatesContainer.innerHTML = Template.imgContainer();
            if (fileInput) {
                fileInput.disabled = false;
                fileInput.value = '';
            }
            if (ytInput) {
                ytInput.disabled = true; // optional
            }

        } else if (selectedValue === 'tempSnackbar') {
            this.resetAll();
        }
        else if (selectedValue === 'tempTest') {
            this.resetAll();
        }
    }
    static resetAll() {
        let previewContainer = document.getElementById('previewContainer');

        let idsTwo = ["imgPreview", "videoPreview"];
        let idsOne = ["img", "youtubeUrl", "start", "end", "title", "description", "inputContainer", "imageContainer"];
        idsOne.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = ''; // Setze den Wert jedes Elements zurück
            }
        });
        idsTwo.forEach(element => {
            const el = document.getElementById(element);
            if (el) {
                el.src = '#';
                el.style.display = 'none';
                el.alt = 'Bildvorschau';
            }
        });
        if (previewContainer) {
            previewContainer.style.display = 'none';
        }
        idsOne = null;
        idsTwo = null;
        previewContainer = null;
    }
    static resetForm(formType) {
        if (formType === "infoSeiteForm") {
            this.resetAll(); // Alle Formularfelder zurücksetzen
            const modalElement = document.getElementById('addInfoSeite');
            const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
            modalInstance.hide();
        }
    }
<<<<<<< Updated upstream
    static imgContainer() {
        debugger
        Template.imgContainerCount += 1;
        let form = `<form id="dataiContainer" class="form-group">
                    <label for="img" class="form-label">
                        <i class="fas fa-image me-2"></i> Bild auswählen <span style="color:red">*</span>
                    </label>
                    <div id="previewContainer" style="display:none; margin-bottom:10px;">
                        <img id="imgPreview" src="#" alt="Bild-Vorschau" name="imgPreview"
                            style="max-width:100%; max-height:200px;">
                        <video id="videoPreview" controls muted name="videoPreview"
                            style="max-width:100%; max-height:200px;">
                            <source src="#" type="video/mp4">
                            Ihr Browser unterstützt das Video-Element nicht.
                        </video>
                    </div>
                    <input type="file" class="form-control" id="img" name="files[]" accept="image/*,video/*"
                        onchange="Template.previewFile('single', this, event, document.getElementById('previewContainer'), document.getElementById('imgPreview'), document.getElementById('videoPreview'));" >
                    <input type="file" class="form-control" id="img2" name="files[]" accept="image/*,video/*"
                        onchange="Template.previewFile('single', this, event, document.getElementById('previewContainer'), document.getElementById('imgPreview'), document.getElementById('videoPreview'));" >
                    </form>
                    `
                    ;
        return form;
=======
    static singleContainer() {

        Template.ccImage += 1;
        let fileInput = ` <div id="previewContainer${Template.ccImage}" style="display:none; margin:10px;">
                <img id="imgPreview${Template.ccImage}" src="#" alt="Bild-Vorschau" style="max-width:100%; max-height:200px;">
                <video id="videoPreview${Template.ccImage}" controls muted style="max-width:100%; max-height:200px;">
                    <source src="#" type="video/mp4">
                    Ihr Browser unterstützt das Video-Element nicht.
                </video>
            </div>`
        let previewContainer = `<input type="file" class="form-control" id="img${Template.ccImage}" name="files[]" accept="image/*,video/*"
                                onchange="Template.previewFile('single', this, event, document.getElementById('previewContainer${Template.ccImage}'), document.getElementById('imgPreview${Template.ccImage}'), document.getElementById('videoPreview${Template.ccImage}'));" >`
        return { previewContainer, fileInput };
>>>>>>> Stashed changes
    }

    static youtubeContainer() {
        Template.youtubeContainerCount += 1;
        let youtubeForm = `
        <div id="YoutubeContainer">
                        <label for="img" class="form-label">
                            <i class="fab fa-youtube me-2"></i> Link auswählen <span style="color:red">*</span>
                        </label>
                        <div class="input-group mb-3">
                            <span class="input-group-text" id="inputGroup-sizing-default">URL:</span>
                            <input type="text" class="form-control" id="youtubeUrl" name="youtubeUrl"
                                placeholder="Youtube Link eingeben" aria-describedby="inputGroup-sizing-default">
                        </div>
                        <label for="img" class="form-label">
                            <i class="fab fa-youtube me-2"></i> Video Timestamp in Sekunden (optional)
                        </label>
                        <div class="input-group flex-nowrap">
                            <span class="input-group-text">von</span>
                            <input type="text" id="start" class="form-control" placeholder="Sekunden" value=""
                                aria-label="Sekunden" aria-describedby="addon-wrapping">
                            <span class="input-group-text">bis</span>
                            <input type="text" id="end" class="form-control" placeholder="Sekunden" value=""
                                aria-label="Sekunden" aria-describedby="addon-wrapping">
                        </div>
                    </div>`;
        return youtubeForm;
    }


    static createPic(element) {
        const img = document.createElement('img');
        img.src = "../../uploads/img/" + element;
        img.className = "fullscreen";
        img.alt = "Image";
        document.body.innerHTML = ''; // Clear the body content
        document.body.appendChild(img); // Add the new image to the body
    }
    static createYoutubeVid(element) {
        var start; // Standard Startzeit
        var end; // Standard Endzeit
        let embedSrc = '';
        let videoId = '';
        let sourceText = '';
        if (element.includes('tiktok') || element.includes('vm.tiktok.com')) {
            isTikTok = true;
            let videoId = '';
            if (element.includes('/video/')) {
                videoId = element.split('/video/')[1].split('?')[0];
            } else if (element.includes('vm.tiktok.com/')) {
                videoId = element.split('vm.tiktok.com/')[1].split('/')[0];
            }
            embedSrc = `https://www.tiktok.com/embed/v2/${videoId}`;
            sourceText = "Quelle: " + element;
        } else {
            if (element.includes("v=")) {
                videoId = element.split("v=")[1];
                console.log(videoId);

                if (videoId.includes('&start=')) {
                    start = videoId.split('&start=')[1].split('&')[0];
                }
                if (videoId.includes('&end=')) {
                    end = videoId.split('&end=')[1].split('&')[0];
                }
            } else if (element.includes("shorts/")) {
                videoId = element.split("shorts/")[1].split('&')[0];
            }
            embedSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&start=${start}&end=${end}&rel=0&controls=0&loop=1&playlist=${videoId}&cc_load_policy=1&cc_lang_pref=de
(Quelle: socialmediaone.de)`;
            sourceText = "Quelle: https://www.youtube.com/watch?v=" + videoId.split('&')[0];
        }
        const iframe = document.createElement("iframe");
        iframe.src = embedSrc;
        iframe.className = "fullscreenYoutube";
        iframe.style.border = "none";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        document.body.innerHTML = ''; // Clear the body content
        document.body.appendChild(iframe);
        const text = document.createElement("div");
        text.classList = "textYoutube";
        text.innerHTML = sourceText;
        iframe.parentNode.appendChild(text);
    }
    static createVid(element) {
        const video = document.createElement('video');
        video.src = "../../uploads/video/" + element;
        video.className = "fullscreen";
        video.controls = true; // Video Controls hinzufügen
        video.autoplay = true; // Video automatisch starten
        video.loop = true; // Video in einer Schleife abspielen
        video.playsInline = true; // Für mobile Geräte
        video.muted = false; // Meistens erforderlich für Autoplay in Browsern
        document.body.innerHTML = ''; // Clear the body content
        document.body.appendChild(video); // Add the new video to the body
    }
    static createVorlageA(id) {
        let listInhalt = [];
        let container = document.createElement('div');
        container.className = "d-flex justify-content-between align-items-center";
        for (let index = 0; index < Template.list.length; index++) {
            if (Template.list[index].id == id) {
                listInhalt.push(Template.list[index]);
            };
        }
        for (let index = 0; index < listInhalt.length; index++) {
            let element = listInhalt[index];
            if (element.typ == "text") {
                container.innerHTML += `
                    <h1>${element.typ}</h1>
            `;
            } else if (element.typ == "text") {
                container.innerHTML += `
                    <h1>${element.typ}</h1>
            `;
            }
        }
        document.body.innerHTML = '';  // Body leeren
        document.body.appendChild(container); // zum Body hinzufügen
    }
    static createVorlageB(id) {
        let listInhalt = [];
        let container = document.createElement('div');
        container.className = "d-flex justify-content-center align-items-center";
        for (let index = 0; index < Template.list.length; index++) {
            if (Template.list[index].id != id) continue;
            listInhalt.push(Template.list[index]);
        }
        for (let element of listInhalt) {
            container.innerHTML += `
                <h1>${element.inhalt}</h1>
            `;
        }
        console.log(container);
        document.body.innerHTML = ''; // Body leeren
        document.body.appendChild(container);
    }
    static async getIdContent(id) {

        console.log(id);
        let inhalt = await fetch("../database/selectTemplates.php?schema_id=" + id);
        console.log(inhalt);

        let response = await inhalt.json();
        console.log("Response:", response);

        console.log(response);
        for (const key of response) {
            console.log(key[2]);
            new Template(key[1], key[2], key[3], key[4]);
        }
    }
    static async insertTemplateDatas(templateListen) {
        fetch('../database/insertTemplates.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                templates: templateListen
            })
        }).then(async result => {
            var res = await result.text();
            console.log("Templates erfolgreich eingefügt:", res);
        }).catch(error => {
            console.error("Fehler beim Einfügen der Templates:", error);
        });
    }
    static previewFile(type, input, event, previewContainer, imagePreview, videoPreview) {
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
                        imagePreview.src = e.target.result;
                        imagePreview.style.display = 'block';
                        videoPreview.style.display = 'none';
                    } else if (fileType.startsWith('video/')) {
                        videoPreview.src = e.target.result;
                        videoPreview.style.display = 'block';
                        imagePreview.style.display = 'none';
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
}
if (document.getElementById('inputGroupSelect01')) {
    Template.selectTemplate("img")
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM vollständig geladen und analysiert");
    var lastUploaded = await Infoseite.getLastUploadedInfoseite();
    console.log(lastUploaded);

    // var cardObj = { imagePath: 'default.jpg', selectedTime: 10000, isAktiv: 1, startTime: null, endTime: null, startDateTime: null, endDateTime: null, timeAktiv: 0, dateAktiv: 0, titel: 'Beispiel Titel', beschreibung: 'Beispiel Beschreibung' };
    // Infoseite.insertDatabase(cardObj)

    templateListen = [{ fk_schema_id: parseInt(lastUploaded), templateName: 't1', typ: 'x', inhalt: '...' }, { fk_schema_id: parseInt(lastUploaded), templateName: 't2', typ: 'y', inhalt: '...' }];
    Template.insertTemplateDatas(templateListen);
});

