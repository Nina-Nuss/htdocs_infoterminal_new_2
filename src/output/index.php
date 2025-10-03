<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bootstrap Site</title>
    <script src="errorDisplay.js"></script>
    <meta http-equiv="Permissions-Policy" content="compute-pressure=()">
</head>
<style>
    html,
    body {
        height: 100%;
        margin: 0;
        padding: 0;
    }

    body {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    header,
    footer {
        display: flex;
        flex-direction: column;
        padding: 0%;
        z-index: 1;

    }

    .iframe-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 77vw;
        height: 77vh;
        /* border: 1px solid black; */

        box-sizing: border-box;
        /* <- verhinder Überlauf */
    }

   

    .iframe-container iframe {
        height: 77vh;
        width: 77vw;
        border: none;
        object-fit: cover;
        display: block;

    }

    /* 
    @media screen and (max-width: 1920px) {
        .iframe-container {
            border: 8px solid pink;
        }
    } */


    @media screen and (max-width: 1920px) {
        .iframe-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 77vh;
            width: 77vw;
            /* border: 1px solid black; */

            box-sizing: border-box;
            /* <- verhinder Überlauf */
        }


    }

    @media screen and (min-width: 3840px) {
        .iframe-container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 77vw;
            height: 77vh;

            /* border: 1px solid black; */

            box-sizing: border-box;
            /* <- verhinder Überlauf */
        }
    }
</style>
</head>
<?php include '../assets/links.html'; ?>


<header>
    <?php include '../layout/logo.php'; ?>
    
    <?php include '../layout/header.php'; ?> 
</header>

<body>
    <div style="display: flex; justify-content: center;">
        <div class="iframe-container" id="container"></div>
    </div>
</body>

<footer class="p-0">
    <?php include '../layout/footer.php'; ?>
</footer>


<script>
    window.addEventListener('DOMContentLoaded', async () => {
        const params = new URLSearchParams(window.location.search);
        const ort = params.get('ip');
        const template = params.get('template');
        const container = document.getElementById('container');
        const ip = await checkIP(ort);
        console.log(ip);
        if (template) {
            console.log("Template geladen");
            showTestTemplate(template);
            return;
        }
        if (ort && container != null && ip != false) {
            startCarousel(ort);
        } else {
            container.innerHTML = `<p class="text-danger">name ${ort} ist keiner gültigen IP-Adresse zugeordnet</p>`;
            setTimeout(() => {
                location.reload();
            }, 10000);
        }
    });

    function startCarousel(ort) {
        const iframe = document.createElement('iframe');
        iframe.src = `out.php?ip=${encodeURIComponent(ort)}`;
        container.appendChild(iframe);
        iframe.onload = () => {
            try {
                // Prüfe, ob der Inhalt des iframes eine 404-Seite ist
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (iframeDoc && iframeDoc.body && iframeDoc.body.innerText.includes('Not Found')) {
                    console.error('404: Script gelöscht, versuche ort neu zu laden');
                    // Entferne den alten iframe und versuche neu
                    container.removeChild(iframe);
                    setTimeout(() => startCarousel(ort), 10000); // Nach 10 Sekunden neu versuchen
                }
            } catch (error) {
                console.error('Fehler beim Prüfen des iframe-Inhalts:', error);
                // Bei Fehler auch neu versuchen
                container.removeChild(iframe);
                setTimeout(() => startCarousel(ort), 10000);
            }
        };

    }


    function showTestTemplate(template) {
        const iframe = document.createElement('iframe');
        // Variablen als Query-Parameter anhängen
        let data = `out.php?template=${encodeURIComponent(template)}`;
        // Wenn du weitere Variablen hast, einfach anhängen:
        // data += `&foo=${encodeURIComponent(foo)}`;
        iframe.src = data;
        container.appendChild(iframe);
    }

    async function checkIP(ort) {
        const response = await fetch("../php/checkURL.php?ip=" + ort);
        const clientIP = await response.text();
        return clientIP; // Rückgabe der IP-Adresse für weitere Verwendung
    }

    // Seite nach 60 Minuten automatisch neu laden
    setTimeout(function() {
        window.location.reload();
    }, 3600000); // 3600000 ms = 60 Minuten
</script>

</html>