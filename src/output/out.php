<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bootstrap Site</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/css/bootstrap.min.css"
        integrity="sha384-r4NyP46KrjDleawBgD5tp8Y7UzmLA05oM1iAEQ17CSuDqnUK2+k9luXQOfXJCJ4I" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"
        integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
        crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/js/bootstrap.min.js"
        integrity="sha384-oesi62hOLfzrys4LxRF63OJCXdXDipiYWBnvTl9Y9/TRlw5xlKIEHpNyvvDShgf/"
        crossorigin="anonymous"></script>
    <!-- <meta http-equiv="Permissions-Policy" content="compute-pressure=()"> -->
    <script src="../js/template.js"></script>


</head>
<style>
    html,
    body {
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
        /* Verhindert Scrolling */
    }

    .fullscreenYoutube {
        width: 100vw;
        height: 100vh;
        /* Volle Höhe */
        display: block;
        object-fit: contain;
        position: relative;
        /* Für absoluten Text */
    }

    .textYoutube {
        position: absolute;
        top: 1px;
        left: 1px;
        font-size: 2vh;
        padding: 1px;
        font-weight: bold;
        background-color: rgba(228, 215, 215, 0.48);
        /* transparenter */
        color: black;
        border-radius: 10px;
        z-index: 10;
        max-width: 100vw;
        max-height: 10vh;
        overflow-y: auto;
        overflow-x: auto;
        white-space: pre-line;
        scrollbar-width: thin;
        scroll-behavior: smooth;
    }



    .fullscreen {
        width: 100vw;
        height: 100vh;
        /* Volle Höhe für Bilder/Videos */
        display: block;
        object-fit: contain;
    }

    /* Scrollbar ausblenden (bereits vorhanden) */
    ::-webkit-scrollbar {
        display: none;
    }

    * {
        scrollbar-width: none;
    }

    /* iframe::-webkit-media-controls {
        display: none !important;
    } */
</style>

<body>




</body>

<script>
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function errorAnzeige() {
        document.body.innerHTML = '<h5 class="text-danger d-flex justify-content-center align-items-center vh-100">Fehler beim Laden der Inhalte, versuche es erneut...</h5>';
        setTimeout(() => location.reload(), 10000);
    }
    async function carousel() {
        const params = new URLSearchParams(window.location.search);
        const ort = params.get('ip');
        const template = params.get('template');
        let akutellesTemp = null;

        try {
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
            const response = await fetch("../database/getSchemas.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ip: ort
                }), // Beispieldaten
            });
            if (!response.ok) {
                if (response.status === 404) {
                    console.error('404 Not Found: URL nicht gefunden');
                    // Hier deinen Code ausführen, z.B. Reload
                    errorAnzeige();
                    return;
                }
                console.error('Error fetching data:', response.status, response.statusText);
                return;
            }
            let data = await response.json();
            Template.list = [];
            for (const element of data) {
                console.log(element[0]);
                const inhalt = await fetch("../database/selectTemplates.php?schema_id=" + element[0]);
                const response = await inhalt.json();
                console.log(response);
                for (const key of response) {
                    console.log(key[2]);
                    new Template(key[1], key[2], key[3], key[4]);
                }
            }
            console.log(Template.list);
            console.log(data);
            while (data.length === 0) {
                console.error('No data received or data is null/undefined');
                document.body.innerHTML = '<h5 class="text-danger d-flex justify-content-center align-items-center vh-100">Kein Inhalt verfügbar, bitte haben Sie Geduld...</h5>';
                await sleep(10000); // Warte 10 Sekunden, bevor du es erneut versuchst
                const retryResponse = await fetch("../database/getSchemas.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ip: ort
                    }), // Beispieldaten
                });
                if (!retryResponse.ok) {
                    console.error('Error fetching data:', retryResponse.statusText);
                    return;
                }
                const retryData = await retryResponse.json();
                console.log('Retry data:', retryData);
                if (retryData.length > 0) {
                    data = retryData; // Aktualisiere die Daten, wenn sie jetzt verfügbar sind
                }
            }
            console.log('Received data:', data);
            while (true) {
                for (const element of data) {
                    if (element[1].startsWith('img_')) {
                        Template.createPic(element[1])
                        await sleep(element[2]);
                    } else if (element[1].startsWith('video_')) {
                        Template.createVid(element[1])
                        await sleep(element[2]);
                    } else if (element[1].startsWith('yt_')) {
                        Template.createYoutubeVid(element[1])
                        await sleep(element[2]);
                    } else if (element[1].startsWith('tempA_')) {
                        Template.createVorlageA(element[0])
                        await sleep(element[2]);
                    } else if (element[1].startsWith('tempB_')) {
                        Template.createVorlageB(element[0])
                        await sleep(element[2]);
                    }
                    if (data.length === 0) {
                        console.error('Daten sind leer, versuche Seite neu zu laden');
                        location.reload();
                    }
                }
                location.reload();
            }
        } catch (error) {
            console.error('Fetch error:', error);
            errorAnzeige();
        }
    }
    window.addEventListener('DOMContentLoaded', async () => {
        try {
            carousel();
        } catch (error) {
            console.error('Fetch error:', error);
            errorAnzeige();
        }

    });
</script>


</html>