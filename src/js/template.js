class Template {
    static list = []
    constructor(templateName, typ, inhalt) { 
        this.templateName = templateName
        this.typ = typ
        this.inhalt = inhalt
        Template.list.push(this);
    }

    static selectTemplate(template) {
        var fileInput = document.getElementById('img');
        var inputGroupSelect01 = document.getElementById('inputGroupSelect01');
        var ytInput = document.getElementById('youtubeUrl');
        var datai = document.getElementById('datai');
        if (!inputGroupSelect01) return;
        inputGroupSelect01.value = template; // Setze den Wert des Select-Elements
        var selectedValue = template;
        var Youtube = document.getElementById('YoutubeContainer');
        var datai = document.getElementById('dataiContainer');
        if (selectedValue === 'yt') {
            this.resetAll();
            Youtube.classList.remove('hidden');
            datai.classList.add('hidden');
            if (fileInput) {
                fileInput.disabled = true;
                fileInput.value = '';
            } if (ytInput) ytInput.disabled = false;
            inputGroupSelect01.dispatchEvent(new Event('change')); // Trigger das Change-Event
        } else if (selectedValue === 'img') {
            this.resetAll();
            Youtube.classList.add('hidden');
            datai.classList.remove('hidden');
            if (fileInput) fileInput.disabled = false;
            fileInput.value = '';
            if (ytInput) {
                ytInput.disabled = true; // optional
            }
            inputGroupSelect01.dispatchEvent(new Event('change')); // Trigger das Change-Event
        }
    }
    static resetAll() {
        let previewContainer = document.getElementById('previewContainer');
        let idsTwo = ["imgPreview", "videoPreview"];
        let idsOne = ["img", "youtubeUrl", "start", "end", "title", "description"];
        idsOne.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.value = ''; // Setze den Wert jedes Elements zurück
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
(Source: socialmediaone.de)`;
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
    static createVorlageA(inhalt) {
        debugger
        const container = document.createElement('div');
        new Template(inhalt[0], inhalt[1], inhalt[2]);
        container.className = "vorlageA";
        container.innerHTML = `
            <h2>:</h2>
            <p>Inhalt für Vorlage A</p>
        `;
        document.body.innerHTML = ''; // Clear the body content
        document.body.appendChild(container);
        this.list = [];
    }
    static createVorlageB(element) {
        const container = document.createElement('div');
        container.className = "vorlageB";
        container.innerHTML = `
           <h2>Vorlage B</h2>
           <p>Inhalt für Vorlage B</p>
       `;
        document.body.appendChild(container);
    }

}
Template.selectTemplate("img");