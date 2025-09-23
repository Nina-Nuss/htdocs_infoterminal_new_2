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
        try {
            if (template) {
                console.log("Template geladen");
                if (template.includes('img_')) {
                    createPic(template);
                } else if (template.includes('video_')) {
                    createVid(template);
                } else if (template.includes('yt_')) {
                    createYoutubeVid(template);
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
                    if (element[1].includes('img_')) {
                        createPic(element[1])

                        await sleep(element[2]);
                    } else if (element[1].includes('video_')) {
                        createVid(element[1])
                        await sleep(element[2]);
                    } else if (element[1].includes('yt_')) {
                        createYoutubeVid(element[1])
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

    function createPic(element) {
        const img = document.createElement('img');
        img.src = "../../uploads/img/" + element;
        img.className = "fullscreen";
        img.alt = "Image";

        document.body.innerHTML = ''; // Clear the body content
        document.body.appendChild(img); // Add the new image to the body
    }


    function createYoutubeVid(element) {
        var start; // Standard Startzeit
        var end; // Standard Endzeit
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
            isYouTube = true;
            let videoId = '';
            if (element.includes("v=")) {
                videoId = element.split("v=")[1];
                console.log(videoId);

                if (videoId.includes('&start=')) {
                    start = videoId.split('&start=')[1].split('&')[0];
                }
                if (videoId.includes('&end=')) {
                    end = videoId.split('&end=')[1].split('&')[0];
                }
                console.log(start);
                console.log(end);
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
        iframe.frameBorder = "0";
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

    function createVid(element) {
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
</script>


</html>