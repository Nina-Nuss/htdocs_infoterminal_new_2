<head>
    <script src="../js/template.js"></script>
</head>

<script>
    const params = new URLSearchParams(window.location.search);
    const template = params.get('template');
    console.log(Template.list);
    async function loadTemplate(template) {
        if (template) {
            console.log("Template geladen");
            if (template.includes('img_')) {
                Template.createPic(template);
            } else if (template.includes('video_')) {
                Template.createVid(template);
            } else if (template.includes('yt_')) {
                Template.createYoutubeVid(template);
            } else if (template.includes('tempA_')) {
                debugger
                let parts = template.split('tempA_');
                console.log(parts[1]);
                await Template.getIdContent(parts[1]);
                Template.createVorlageA(parts[1]);
            } else if (template.includes('tempB_')) {
                let parts = template.split('tempB_');
                console.log(parts[1]);
                await Template.getIdContent(parts[1]);
                Template.createVorlageB(parts[1]);
            }
            return;
        }
    }
    (async () => {
        await loadTemplate(template);
        console.log(template);
    })();
</script>