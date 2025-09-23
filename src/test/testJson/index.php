<!DOCTYPE html>
<html lang="en">

<head>
    <meta chrset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <h1>Test Page</h1>
    <div id="form">
        <select id="val1" value=""></select>
        <button id="submit" onclick="update('maxCountForInfoPages', document.getElementById('val1').value)">Submit</button>
        <select id="val2" value=""></select>
        <button id="submit" onclick="update('maxCountForInfoTerminals', document.getElementById('val2').value)">Submit</button>
        <select id="val3" value=""></select>
        <button id="submit" onclick="update('maxUsers', document.getElementById('val3').value)">Submit</button>

    </div>


</body>
<script>
    async function getData() {
        const result = await fetch('../../../config/configTest.json')
        return await result.json();

    }

    function setValue(val1) {
        var val1 = document.getElementById(val1)
        for (var i = 0; i < 20; i++) {
            val = i * 10;
            ele = document.createElement("option");
            ele.text = val;
            ele.value = val;
            val1.appendChild(ele);
        }
    }

    async function setData() {

        setValue("val1")
        setValue("val2")
        setValue("val3")

        var val1 = document.getElementById("val1")
        var val2 = document.getElementById("val2")
        var val3 = document.getElementById("val3")


        val1.appendChild(ele);

        try {
            var data = await getData();
            val1.value = data.webpageSettings[0].maxCountForInfoPages
            val3.value = data.webpageSettings[0].maxUsers
            val2.value = data.webpageSettings[0].darkMode
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    }

    async function update(key, value) {
        console.log(value);
        const result = await fetch("saveValue.php", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([{
                "key": key,
                "value": value
            }])
        });
        const res = await result.json();
        console.log(res);
    }


    setData()

    // console.log(dat
</script>

</html>