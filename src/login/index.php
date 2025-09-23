<!DOCTYPE html>
<html lang="en">

<!-- <?php

        // session_start();

        // echo $_SESSION['user_id'];
        ?> -->

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <?php include '../assets/links.html'; ?>
</head>

<body>

    <div class="d-flex justify-content-center flex-column align-items-center vh-100">


        <div class="card mx-auto shadow p-4" style="width: 30rem;">
            <div class="d-flex justify-content-center mt-3 align-items-center ">
                <img src="../images/logo.png" alt="Logo" style="max-width: 200px;">
            </div>
            <div class="card-body p-4 pb-0">
                <form class="d-flex flex-column justify-content-center" method="POST" action="login.php">
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Benutzername</label>
                        <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                            autocomplete="username">
                        <!-- <div id="emailHelp" class="form-text">bite Benutzername eingeben.</div> -->
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Password</label>
                        <input type="password" class="form-control" id="exampleInputPassword1"
                            autocomplete="current-password">
                    </div>
                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="exampleCheck1">
                        <label class="form-check-label" for="exampleCheck1">Angemeldet bleiben</label>
                    </div>
                    <div class="d-flex justify-content-center">
                        <button type="submit" id="loginForm" class="btn btn-primary" style="background-color: #006c99;">Einloggen</button>
                    </div>

                </form>
                <div id="message" class="mt-3"></div>
            </div>
        </div>
    </div>
</body>
<script>
    document.getElementById('loginForm').addEventListener('click', async function(event) {
        event.preventDefault();
        console.log("wurde geklickt");

        var username = document.getElementById('exampleInputEmail1').value;
        var password = document.getElementById('exampleInputPassword1').value;
        var remember = document.getElementById('exampleCheck1').checked;
        const messageDiv = document.getElementById('message');

        console.log(username);
        console.log(password);
        console.log(remember);

        if (username === '' || password === '') {
            alert('Bitte füllen Sie alle Felder aus.');
            event.preventDefault();
        }
        debugger
        try {
            const result = await fetch('login.php', {
                method: 'POST',
                credentials: 'same-origin', // WICHTIG
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password,
                    remember
                })
            });
            const response = await result.json();
            console.log(response);
            if (response['success'] === true) {
                window.location.href = "../pages/dashboard.php";
            } else {
                messageDiv.innerHTML = '<div class="alert alert-danger">Falscher Benutzername oder Passwort.</div>';
            }

        } catch (error) {
            console.error('Fehler:', error);
            messageDiv.innerHTML = '<div class="alert alert-danger">Netzwerkfehler. Versuchen Sie es später.</div>';
        }

    });
</script>

</html>

<head>

</head>