
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Header</title>
   
   
</head>

<style>
    .clock {
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .clock h1 {
        margin: 0;
        font-size: 2rem;
        color: #ffffff;
    }

    .clock p {
        margin: 10px 0 0;
        font-size: 4.5rem;
        color: #ffffff;
    }

    .div {
        text-align: center;
    }
</style>

<div class="parallelogram" id="header">
    <div class=" text d-flex justify-content-between align-items-center gap-2" style="margin-left: 3%; margin-right: 3%;">
        <div id="headerTitle" class="clock"> Infoterminal CJD Offenburg</div>
        <div class="clock">
            <div id="time"></div>
            <div>/</div>
            <div id="date"></div>
        </div>

    </div>
</div>
<script>
    if (document.getElementById("headerTitle") ) {
        if(window.location.pathname.includes("dashboard.php") || window.location.pathname.includes("adminbereich.php")) {
            var headerTitle = document.getElementById("headerTitle")
            headerTitle.innerText = "Infoterminal CJD Dashboard"
            
        }
    }

    function updateTime() {
        const dateTime = new Date();
        const timeElement = document.getElementById('time');
        const dateElement = document.getElementById('date');

        const hours = String(dateTime.getHours()).padStart(2, '0');
        const minutes = String(dateTime.getMinutes()).padStart(2, '0');
        const seconds = String(dateTime.getSeconds()).padStart(2, '0');

        const day = String(dateTime.getDate()).padStart(2, '0');
        const month = String(dateTime.getMonth() + 1).padStart(2, '0');
        const year = dateTime.getFullYear();

        timeElement.textContent = `${hours}:${minutes}:${seconds}`;
        dateElement.textContent = `${day}.${month}.${year}`;
    }

    setInterval(updateTime, 1000);
    updateTime();
</script>