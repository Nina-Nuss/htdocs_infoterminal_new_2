<?php include '../php/noCache.php'; ?>
<?php include '../php/auth.php'; ?>

<?php

if (isset($_COOKIE['isAdmin'])) {
    // Admin-Bereich anzeigen
} else if ($_SESSION['is_admin'] != 1) {
    header('Location: ../pages/dashboard.php');
    exit;
} else {
    header('Location: ../pages/dashboard.php');
    exit;
}
?>

<!DOCTYPE html>
<html lang="de">

</html>

<head>
    <?php include '../assets/links.html'; ?>
    <?php include '../assets/scripts.html'; ?>
    <title>Adminbereich</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<html>

<body>
    <?php include '../layout/header.php'; ?>
    <div class="container-fluid pt-3">
        <div class="col-md-12 text-center">
            <?php include $_SERVER['DOCUMENT_ROOT'] . '/src/layout/selectPanel.php'; ?>
        </div>
        <hr>
        <div class="row mt-3 mb-3">
            <div class="col-12 d-flex justify-content-center">
                <select id="adminSectionSelector" class="form-select w-auto">
                    <option value="infoterminal" selected>Infoterminal verwalten</option>
                    <option value="user">Benutzer verwalten</option>
                </select>
            </div>
        </div>
        <div>
            <div class="row mt-3" id="infoterminalVerwaltung" style="display: none;">
                <div class="col-12">
                    <!-- <div class="col-12">
                    <div class="card shadow-sm">
                        <div class="card-header bg-light text-dark border-bottom text-center">
                            <h5 class="card-title mb-0">
                                <i class="fas fa-info-circle me-2"></i> Infoterminal Verwaltung
                            </h5>
                        </div>
                    </div>
                </div> -->
                    <div class="card-body mt-3">
                        <div class="row d-flex justify-content-center">
                            <div class="card h-100 col-md-2 flex-column p-0">
                                    <div class="card-header">
                                        <h6 class="card-title mb-0 d-flex justify-content-center">
                                            <i class="fas fa-tv me-2"></i> Infoterminals hinzufügen
                                        </h6>
                                    </div>
                                    <form id="formID" action="../php/bereitsVorhanden.php" method="post">
                                        <div class="card-body position-relative">
                                            <div class="d-flex flex-column " style="height: 280px;">
                                                <div class="form-group mb-3">
                                                    <label for="infotherminalIp" class="form-label">
                                                        <i class="fas fa-network-wired me-2"></i> IP-Adresse:
                                                    </label>
                                                    <input class="form-control" type="text" id="infotherminalIp"
                                                        name="infotherminalIp" placeholder="z.B. 10.5.0.100" required>
                                                </div>
                                                <div class="form-group mb-3">
                                                    <label for="infotherminalName" class="form-label">
                                                        <i class="fas fa-tag me-2"></i> Name:
                                                    </label>
                                                    <input class="form-control" type="text" id="infotherminalName"
                                                        name="infotherminalName" placeholder="z.B. Terminal Empfang" required>
                                                </div>
                                            </div>

                                        </div>
                                        <div class="d-flex justify-content-center card-bottom p-3" style="border-top: none;">
                                            <button type="submit" class="btn  btn-sm btn-success shadow-sm" style="width: 150px;">
                                                <i class="fas fa-plus me-2"></i> Hinzufügen
                                            </button>
                                            <button type="button" data-bs-placement="top"
                                                class="btn btn-lg btn-secondary  btn-sm" style="width: 40px;"
                                                data-bs-toggle="popover" title="Popover title"
                                                data-bs-content="IP-Adresse soll dem Format 000.000.000.000 entsprechen">i</button>
                                            <script>
                                                document.querySelectorAll('[data-bs-toggle="popover"]').forEach(function(el) {
                                                    new bootstrap.Popover(el, {
                                                        trigger: 'hover',
                                                        html: true,
                                                        placement: el.getAttribute('data-bs-placement') || 'top'
                                                    });
                                                });
                                            </script>
                                        </div>
                                    </form>
                            </div>
                            <div class="col-md-3">
                                <div class="card h-100">
                                    <div class="card-header">
                                        <h6 class="card-title mb-0 d-flex justify-content-center">
                                            <i class="fas fa-tv me-2"></i> Infoterminals löschen
                                        </h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="form-group mb-3">
                                            <label for="infotherminalSelect" class="form-label">
                                                <i class="fas fa-list me-2"></i> Infoterminal auswählen:
                                            </label>
                                        </div>
                                        <div class="mb-3" style="height: 200px; overflow-y: auto;">
                                            <table class="table table-hover mb-0">
                                                <thead class="" style="position: sticky; top: 0; z-index: 1;">
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>IP-Adresse</th>
                                                        <th>Name</th>
                                                        <th>Auswahl</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="deleteInfotherminal">
                                                    <!-- Infoterminal-Liste wird hier dynamisch geladen -->
                                                </tbody>
                                            </table>
                                        </div>

                                    </div>
                                    <div class="card-bottom  d-flex justify-content-center p-3" style="border-top: none;">
                                        <button type="button" class="btn btn-sm btn-danger shadow-sm" style="width: 150px;" onclick="Infoterminal.remove_generate()">
                                            <i class="fas fa-trash me-2"></i> Löschen
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="card h-100">
                                    <div class="card-header">
                                        <h6 class="card-title mb-0">
                                            <i class="fas fa-cogs me-2"></i> Einstellungen
                                        </h6>
                                    </div>
                                    <div class="card-body">
                                        <!-- <div class="form-group mb-3">
                                        <label for="refreshSelect" class="form-label">
                                            <i class="fas fa-clock me-2"></i> Refresh-Zeit:
                                        </label>
                                        <select id="refreshSelect" class="form-select" style="padding: 5px;">
                                            <!-- Optionen werden per JS aus config.json befüllt -->
                                        <!-- </select> -->
                                        <!-- </div> -->
                                        <div>
                                            <div class="form-group ">
                                                <label for="cardCounterLimit" class="form-label">
                                                    <i class="fas fa-hashtag me-2"></i> Infoterminal-Limit:
                                                </label>
                                                <select id="cardCounterLimit" class="form-select" style="padding: 5px;">
                                                    <!-- Optionen werden per JS aus config.json befüllt -->
                                                </select>
                                            </div>
                                            <div class="form-group mb-3">
                                                <label for="infoCounterLimit" class="form-label">
                                                    <i class="fas fa-hashtag me-2"></i> Infoseiten-Limit:
                                                </label>
                                                <select id="infoCounterLimit" class="form-select" style="padding: 5px;">
                                                    <!-- Optionen werden per JS aus config.json befüllt -->
                                                </select>
                                            </div>
                                        </div>


                                    </div>
                                    <div class="card-bottom  d-flex justify-content-center p-3" style="border-top: none;">
                                        <button type="button" class="btn btn-sm btn-danger" style="width: 150px;"
                                            onclick="bereinigeDatenbankUndFolder()">
                                            <i class="fas fa-broom me-2"></i> Daten bereinigen
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <!-- </div> -->
                </div>
            </div>

            <div class="row mt-3" id="userVerwaltung" style="display: none;">
                <!-- <div class="col-12">
                <div class="card shadow-sm">
                    <div class="card-header bg-light text-dark border-bottom text-center">
                        <h5 class="card-title mb-0">
                            <i class="fas fa-info-circle me-2"></i> Nutzerverwaltung
                        </h5>
                    </div>
                </div>
            </div> -->
                <div class="col-12 mt-3">
                    <div class="row d-flex justify-content-center">
                        <div class="col-md-2">
                            <div class="card h-100">
                                <div class="card-header">
                                    <h6 class="card-title mb-0 d-flex justify-content-center">
                                        <i class="fas fa-user-plus me-2"></i> Benutzer hinzufügen
                                    </h6>
                                </div>
                                <div class="card-body">
                                    <div id="formUser">
                                        <div class="form-group mb-3" style="height: 260px;">
                                            <div class="form-group mb-3">
                                                <label for="username" class="form-label">
                                                    <i class="fas fa-user me-2"></i> Benutzername:
                                                </label>
                                                <input class="form-control" type="text" id="username"
                                                    name="username" placeholder="z.B. MaxMustermann" required>
                                            </div>
                                            <!-- <div class="form-group mb-3">
                                        <label for="email" class="form-label">
                                            <i class="fas fa-envelope me-2"></i> E-Mail:
                                        </label>
                                        <input class="form-control" type="email" id="email"
                                            name="email" placeholder="z.B. max@mustermann.de" required>
                                         </div> -->
                                            <div class="form-group mb-3">
                                                <label for="password" class="form-label">
                                                    <i class="fas fa-lock me-2"></i> Passwort:
                                                </label>
                                                <input type="password" class="form-control" id="password"
                                                    name="password" placeholder="Passwort" required>
                                            </div>
                                            <div class="form-group mb-3">
                                                <label for="isAdmin" class="form-label">
                                                    <i class="fas fa-user-shield me-2"></i> Administrator:
                                                </label>
                                                <select class="form-select" id="isAdmin" name="isAdmin" required>

                                                    <option value="1">Ja</option>
                                                    <option value="0" selected>Nein</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div class="card-bottom d-flex justify-content-center p-3">
                                    <button class="btn btn-sm btn-success shadow-sm" onclick="Crud.add_user()" style="width: 150px;">
                                        <i class="fas fa-user-plus me-2"></i> Hinzufügen
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card h-100 ">
                                <div class="card-header">
                                    <h6 class="card-title mb-0 d-flex justify-content-center">
                                        <i class="fas fa-user-minus me-2"></i> Benutzer löschen
                                    </h6>
                                </div>
                                <div class="card-body flex-column">
                                    <div class="form-group
                                    mb-3">
                                        <label  class="form-label">
                                            <i class="fas fa-list me-2"></i> Benutzer auswählen:
                                        </label>
                                    </div>
                                    <div style="height: 200px; overflow-y: auto;">
                                        <table class="table table-hover position-relative ">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Benutzername</th>
                                                    <th>Admin</th>
                                                    <th>Auswahl</th>
                                                </tr>
                                            </thead>
                                            <tbody id="deleteUser">
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                                <div class="card-bottom p-3" style="border-top: none;">
                                    <div class="d-flex justify-content-center">
                                        <button type="button" class="btn btn-sm btn-danger shadow-sm" style="width: 150px;"
                                            onclick="Crud.remove_generate(User.temp_remove, User.list)">
                                            <i class="fas fa-user-minus me-2"></i> löschen
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card h-100">
                                <div class="card-header">
                                    <h6 class="card-title mb-0">
                                        <i class="fas fa-cogs me-2"></i> Einstellungen
                                    </h6>

                                </div>
                                <div class="card-body">
                                    <div class="form-group mb-3">
                                        <label for="userCounterLimit" class="form-label">
                                            <i class="fas fa-hashtag me-2"></i> Benutzer-Limit:
                                        </label>
                                        <input type="number" id="userCounterLimit" class="form-control" min="1" value="10">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const selector = document.getElementById('adminSectionSelector');
            const infoterminalSection = document.getElementById('infoterminalVerwaltung');
            const userSection = document.getElementById('userVerwaltung');

            function updateSections() {
                if (selector.value === 'infoterminal') {
                    infoterminalSection.style.display = 'block';
                    userSection.style.display = 'none';
                } else if (selector.value === 'user') {
                    infoterminalSection.style.display = 'none';
                    userSection.style.display = 'block';
                }
            }
            selector.addEventListener('change', updateSections);
            updateSections();
        });
    </script>
    <script src="../js/user.js"></script>

    <script src="../js/crud.js"></script>

</body>

</html>