<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8">
    <title>Wetter Offenburg</title>
    <style>
        .weather-card {
            background: white;
            font-family: Arial, sans-serif;
            overflow: hidden;
        }

        .temp {
            font-size: 4vh;
            font-weight: bold;
        }

        .details {
            margin-top: 15px;
            font-size: 0.9em;
            color: #555;
        }
        .icon {
            width: 15vh;
           ;
        }

        button {
            margin-top: 15px;
            padding: 8px 15px;
            border: none;
            border-radius: 8px;
            background: #4a90e2;
            color: white;
            font-weight: bold;
            cursor: pointer;
        }

        button:hover {
            background: #357ABD;
        }
    </style>
</head>


<div class="weather-card d-flex align-items-center mx-4 p-0 " style="height: 11vh;">
    <div id="weather" class="">
    </div>
    <!-- <button onclick="getWeather()">Aktualisieren</button> -->
</div>
<script>
    const API_KEY = "9e9be1c97a607ed9ca56bb68082c172e";
    const CITY = "Offenburg,de";
    let inflight = false;
    async function getWeather() {
        console.log("Rufe Wetterdaten ab...");
        if (inflight) return; // verhindert Überlappungen
        inflight = true;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&lang=de&appid=${API_KEY}`;
        try {
            const res = await fetch(url, {
                cache: 'no-store'
            });
            if (!res.ok) throw new Error("Fehler beim Abrufen der Wetterdaten");
            const data = await res.json();
            showWeather(data);
        } catch (err) {
            document.getElementById("weather").innerHTML = ``;
        } finally {
            inflight = false;
        }
    }

    function showWeather(data) {
        const weatherDiv = document.getElementById("weather");
        const icon = data.weather[0].icon;
        const desc = data.weather[0].description;
        const temp = Math.round(data.main.temp);

        weatherDiv.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center;">
          <img class="icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">
          <div class="temp">${temp}°C</div>
        </div>
      `;
    }

    // Initial laden + alle 5 Minuten aktualisieren (5 * 60 * 1000 ms)
    getWeather();
    setInterval(getWeather, 0.1 * 60 * 1000);
</script>


</html>