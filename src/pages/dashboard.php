<?php
include '../php/noCache.php';
include '../php/auth.php';

?>
<?php
header('Access-Control-Allow-Origin: *');
// if (isset($_COOKIE['username'])) {
//     $username = $_COOKIE['username'];
//     echo 'Hallo ' . htmlspecialchars($username, ENT_QUOTES, 'UTF-8');
// } else {
//     echo 'Kein Cookie vorhanden';
// }
// echo '<br>';
// echo $_SESSION['login_success']f;
?>

<!DOCTYPE html>
<html lang="de">

<head>
    <?php include '../assets/links.html'; ?>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Infoterminal - Dashboard</title>
</head>

<body>
    <!-- <?php include '../assets/darkmode.html'; ?>  -->
    <?php include '../layout/header.php'; ?>
    <?php include '../layout/modal/hinzufuegen.html'; ?>
    <?php include '../layout/modal/addInfoSeite.html'; ?>
    <div class="container-fluid pt-3">
        <div class="d-flex justify-content-center" style="height:90vh;">
            <div style="width: 300px;
  min-width: 300px;
  max-width: 300px;">
                <?php include $_SERVER['DOCUMENT_ROOT'] . '/src/layout/sidebar.php'; ?>
            </div>
            <div class="text-center">
                <?php include $_SERVER['DOCUMENT_ROOT'] . '/src/layout/selectPanel.php'; ?>
                <hr>
                <div class="mt-0 d-flex justify-content-center overflow-auto " style="margin-right: 25%;">
                    <button id="btn_save_changes" type="button" onclick="Infoseite.saveChanges(null)"
                        class="btn btn-success btn-sm me-2 navbuttons">
                        <i class="fas fa-save"></i> Speichern
                    </button>
                    <!--  -->
                    <button id="btn_addInfoSeite" type="button" class="btn btn-success btn-sm me-2 navbuttons"
                        data-bs-toggle="modal" data-bs-target="#addInfoSeite">
                        <i class="fas fa-pen-to-square"></i> Erstellen
                    </button>
                    <button id="btn_deleteInfoSeite" onclick="Infoseite.deleteCardObj()" type="button"
                        class="btn btn-danger btn-sm navbuttons">
                        <i class="fas fa-trash"></i> Löschen
                    </button>
                </div>
                <div class="d-flex justify-content-center gap-2 m-3">
                    <div class="overflow-auto">
                        <div id="konfigContainer">
                            <div class="card">
                                <div class="card-header p-2">
                                    <h6 class="mb-0"><i class="fas fa-cog me-2 font-bold"></i> Infoseite konfigurieren
                                </div>
                                <div class="d-flex justify-content-around" style="min-height: 170px;">
                                    <div class="p-3" style="width: 18rem;">
                                        <div class="form-group mt-0">
                                            <div class="d-flex align-items-center justify-content-between mb-3">
                                                <i class="fas fa-file-alt me-2"></i>
                                                <div class="mb-0 me-auto">Infoseite Name:
                                                </div>
                                                <div type="text" class="w-auto fw-bolder text-break" id="websiteName" value="-" style="word-break: break-word; max-width: 200px;">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="d-flex flex-wrap align-items-center  justify-content-start mb-2 ">
                                                <i class="fas fa-hourglass-half"></i>
                                                <!-- Uhr-Icon für Sekunden -->
                                                <div for="anzeigeDauer" class="mb-0 ms-2">
                                                    Sekunden:</div>
                                                <input type="text" id="selectSekunden"
                                                    class="form-control form-control-sm ms-2 me-auto" maxlength="4"
                                                    style="width: 50px;">
                                                <div class="fw-bolder w-auto" id="anzeigeDauer"></div>
                                            </div>
                                            <div class="d-flex align-items-center justify-content-start gap-2 ">
                                                <label class="form-check-label mb-0" for="checkA">
                                                    Aktiv:
                                                </label>
                                                <input class="form-check-input" type="checkbox" id="checkA"
                                                    name="checkA">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="p-3" style="width: 35rem;  overflow-y: auto;">
                                        <div id="panelForDateTime" class="w-100">
                                            <div id="dateTimeInfoPanel ">
                                                <div class="d-flex align-items-center mb-3">
                                                    <div class="d-flex  align-items-center">
                                                        <i class="fas fa-calendar-alt me-2"></i>
                                                        <span>Datum:</span>
                                                        <div class="d-flex align-items-center ms-4">
                                                            <input type="date" class="form-control form-control-sm" style="width: 9rem; "
                                                                id="startDate" name="startDate">
                                                        </div>
                                                    </div>
                                                    <div class="d-flex align-items-center justify-content-between ms-auto">
                                                        <label for="endDate"
                                                            class="form-label mb-0 text-secondary mx-2">bis</label>
                                                        <input type="date"
                                                            class="form-control form-control-sm" style="width: 9rem; "
                                                            id="endDate" name="endDate">
                                                        <button id="btnDelDateTime"
                                                            class="btn btn-outline-danger trashBtn btn-sm ms-3"
                                                            onclick="Infoseite.deleteDateTimeRange(Infoseite.selectedID)">
                                                            <i class="fas fa-trash-alt"></i>
                                                        </button>
                                                    </div>
                                                    <div type="button" data-bs-placement="bottom"
                                                        class="btn btn-lg btn-secondary  btn-sm infobtn"
                                                        data-bs-toggle="popover" title="Information zum Datum"
                                                        data-bs-content="Zwischem welchem Datum die Infoseite angezeigt werden soll"><i class="bi bi-info-circle"></i></div>
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
                                                <!-- Uhrzeit -->
                                                <div class="d-flex align-items-center">
                                                    <div class="d-flex align-items-center">
                                                        <i class="fa fa-clock me-2"></i>
                                                        <span style="margin-right: 0.5rem;">Uhrzeit:</span>
                                                        <input type="time"
                                                            class="form-control form-control-sm flex-fill mx-2" style="width: 6rem;"
                                                            id="startTimeRange" name="startTimeRange">
                                                        <label for="endTimeRange"
                                                            class="form-label mb-0 me-2 text-secondary">Uhr</label>
                                                    </div>
                                                    <div class="d-flex align-items-center ms-auto">
                                                        <label for="endTimeRange"
                                                            class="form-label mb-0 me-2 text-secondary"
                                                            style="width: auto;">bis</label>
                                                        <input type="time" style="width: 6rem;"
                                                            class="form-control form-control-sm flex-fill"
                                                            id="endTimeRange" name="endTimeRange">
                                                        <label for="endTimeRange"
                                                            class="form-label mb-0 text-secondary me-3 mx-2"> Uhr</label>
                                                        <button id="delTimeRange"
                                                            class="btn btn-outline-danger trashBtn me-auto ms-2 btn-sm "
                                                            onclick="Infoseite.removeTimeRange(Infoseite.selectedID)">
                                                            <i class="fas fa-trash-alt"></i>
                                                        </button>
                                                    </div>
                                                    <button type="button" data-bs-placement="bottom"
                                                        class="btn btn-lg btn-secondary btn-sm infobtn"
                                                        data-bs-toggle="popover" title="Information zur Uhrzeit"
                                                        data-bs-content="Zwischen welcher Uhrzeit die Infoseite jeden Tag angezeigt werden soll"> <i class="bi bi-info-circle"></i></i></button>
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
                                                <!-- <div class="input-group input-group-sm mt-3  d-flex">
                                                            <label for="img" class="form-label me-4">
                                                                <i class="fab fa-youtube me-2"></i> Video
                                                            </label>
                                                            <span class="input-group-text input-group-sm">von</span>
                                                            <input type="text" id="startyt" class="form-control form-control-sm me-2" placeholder="Sekunden" value=""
                                                                aria-label="Sekunden" aria-describedby="addon-wrapping">
                                                            <span class="input-group-text input-group-sm">bis</span>
                                                            <input type="text" id="endyt" class="form-control form-control-sm" placeholder="Sekunden" value=""
                                                                aria-label="Sekunden" aria-describedby="addon-wrapping">
                                                        </div> -->
                                            </div>
                                            <div class="form-group mt-3">
                                                <div class="d-flex align-items-center" >
                                                    <label for="openTerminalBtn" class="form-label ">
                                                        <i class="fas fa-desktop mb-0 me-2"></i>Anzeige:
                                                    </label>
                                                    <select class="form-control form-select-sm" style="width: 140px; margin-left: 0.5rem;"
                                                        id="infotherminalSelect">
                                                        <option value="">auswählen</option>
                                                    </select>
                                                    <button id="openTerminalBtn"
                                                        class="btn start-btn btn-sm trashBtn "
                                                        style="width: 2vw;">
                                                        <i class="fas fa-external-link-alt"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div id="zeitspannePanel"
                                                class="border rounded-3 shadow-sm p-3 bg-light"
                                                style="display:none;">
                                                <div class="row d-flex g-2">
                                                    <div class="col-6">
                                                        <div class="d-flex align-items-center" style="margin-left: 1rem;">
                                                        </div>
                                                    </div>
                                                    <div class="col-6">
                                                        <div class="d-flex align-items-center" style="margin-left: 1rem;">

                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row ">
                                                    <div class="col-12 mt-2">

                                                    </div>
                                                </div>
                                            </div>
                                            <div id="uhrzeitPanel" class="border rounded-3 shadow-sm p-3 bg-light"
                                                style="display:none;">
                                                <div class="row g-2 justify-content-center">
                                                    <div class="col-6 d-flex align-items-center">
                                                    </div>
                                                    <div class="col-6 d-flex align-items-center">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="" id="bildschirmVerwaltung" style="min-height: 170px;">
                        <div class="card h-100">
                            <div class="card-header p-2">
                                <h6 class="mb-0"><i class="fas fa-tv me-2"></i>Bildschirm verwalten</h6>
                            </div>
                            <div class="card-body d-flex">
                                <div class="d-flex flex-column justify-content-center  align-content-center gap-2 me-3">
                                    <button type="button" data-bs-placement="bottom"
                                        class="btn btn-lg btn-secondary  btn-sm infobtn"
                                        data-bs-toggle="popover" title="Information zur Bildschirm verwalten"
                                        data-bs-content="Hier können die Infoseiten zu den Terminals hinzugefügt werden. Dieses Fenster dient zur übersicht,  wo die Infoseiten zu welchem Terminal zugeordnet sind."> <i class="bi bi-info-circle"></i></i></button>
                                    <script>
                                        document.querySelectorAll('[data-bs-toggle="popover"]').forEach(function(el) {
                                            new bootstrap.Popover(el, {
                                                trigger: 'hover',
                                                html: true,
                                                placement: el.getAttribute('data-bs-placement') || 'top'
                                            });
                                        });
                                    </script>
                                    <button id="btn_hinzufuegen" type="button" data-bs-toggle="modal"
                                        data-bs-target="#modal_hinzufuegen"
                                        class="btn btn-success align-items-stretch m-0 infoterminalAddbtn">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                    <button id="btn_loeschen" type="button"
                                        class="btn btn-danger align-items-stretch m-0 infoterminalAddbtn"
                                        onclick="Beziehungen.remove_generate(Infoseite.selectedID, Beziehungen.temp_list_remove, 'delete_Relation')">
                                        <i class="fas fa-minus"></i>
                                    </button>
                                </div>
                                <div class="w-100 overflow-auto border rounded-3">
                                    <div style=" width: 210px; height: 130px; overflow-y: auto;">
                                        <table class="table table-hover w-100 mb-0 p-0">
                                            <thead class="table-light"
                                                style="position: sticky; top: 0; z-index: 2;">
                                                <!-- <tr>
                                                    <th style="background: #fff;">Titel</th>
                                                    <th style="background: #fff;">auswählen</th>
                                                </tr> -->
                                            </thead>
                                            <tbody id="tabelleDelete">
                                                <!-- Tabellenzeilen hier -->
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-3"></div>

            </div>
        </div>
    </div>

    <?php include '../assets/scripts.html'; ?>
</body>

</html>