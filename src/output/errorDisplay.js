var params = new URLSearchParams(window.location.search);
var ort = params.get('ip');
function insertErrorLogDisplay(message) {
    fetch('../database/insertError.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message })
    }).then(response => response.json()
    ).then(data => {
        if (data.success) {
            console.log('Fehler erfolgreich protokolliert:', data.message);
        } else {
            console.error('Fehler beim Protokollieren des Fehlers:', data.message);
        }
    }).catch(error => {
        console.error('Fetch-Fehler:', error);
    });
}
window.addEventListener('error', function (event) {

    console.error(event.error, 'in', event.filename, 'Zeile', event.lineno);
    insertErrorLog(event.message, 'in', event.filename, 'Zeile', event.lineno);

    window.location.href = "errorInfoterminal.php?ip=" + ort;

    event.preventDefault();
});

// Für unhandled Promise-Rejections (z.B. bei fetch-Fehlern)
window.addEventListener('unhandledrejection', function (event) {

    console.error('Unhandled Promise Rejection:', event.reason);
    // Hier deinen Code ausführen, z.B. Seite neu laden
    console.error('Kritischer Fehler aufgetreten:', event.error, 'in', event.filename, 'Zeile', event.lineno);
    // setTimeout(() => {
    //     location.reload(); // Seite neu laden nach 5 Sekunden
    window.location.href = "errorInfoterminal.php?ip=" + ort;
    // }, 10000);
    insertErrorLog(event.message, 'in', event.filename, 'Zeile', event.lineno);
    // window.location.href = "../../errorInfoterminal.php";
    event.preventDefault();
});


function insertErrorLog(message) {
    fetch('../database/insertError.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message })
    }).then(response => response.json()
    ).then(data => {
        if (data.success) {
            console.log('Fehler erfolgreich protokolliert:', data.message);
        } else {
            console.error('Fehler beim Protokollieren des Fehlers:', data.message);
        }
    }).catch(error => {
        console.error('Fetch-Fehler:', error);
    });
}