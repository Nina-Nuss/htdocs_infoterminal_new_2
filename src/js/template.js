class Template {
    constructor(name) {
        this.name = name;
        this.text1 = "text1";
        this.text2 = "text2";
        this.text3 = "text3";
        this.text4 = "text4";
        this.video = "text5";
        this.text6 = "text6";
        this.text7 = "text7";
        this.text8 = "text8";
        this.text9 = "text9";
        this.text10 = "text10";
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
    
}


if (Template) {
    Template.selectTemplate("img");
}