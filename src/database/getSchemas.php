<?php


ob_start();

// Pfad zum gewünschten Ordner
include("selectSchemas.php");
include("selectInfotherminal.php");
include("selectRelation.php");

ob_end_clean(); // Puffer leeren, um vorherige Ausgaben zu entfernen

$input = json_decode(file_get_contents("php://input"), true);

$ipGefunden = false;

$images = getAllImagesAndVideos();

$imagesContainer = array();

$resultContainer = array();

$schemaList = json_decode($schemaList); //Schemas

$infotherminalList = json_decode($infotherminalList); //Infoterminals
$relationList = json_decode($beziehungsList); //Beziehungen

$timeFormat = 'H:i';
$dateFormat = 'Y-m-d H:i';

$now = new DateTime('now', new DateTimeZone('Europe/Berlin'));

$nowTime = $now->format('H:i');
$nowDateTime = $now->format('Y-m-d H:i');

// $clientIP = $_SERVER['REMOTE_ADDR'];

$ip = $input['ip'] ?? 'Empfang';

$therminal = array();

foreach ($infotherminalList as $infotherminal) {
    if ($ip == $infotherminal[1]) {
        $ip = $infotherminal[2];
        $id = $infotherminal[0];
        //  "<br>Gefundene IP: " . $ip . "<br>";
        $ipGefunden = true;

        array_push($therminal, $id, $ip);
    }
}
if (!$ipGefunden) {
    return json_encode([]); // Rückgabe eines leeren Arrays, wenn die IP nicht gefunden wurde
}
$timeIsBetween = false;
$dateIsBetween = false;

$relevantSchemaIds = [];
foreach ($relationList as $relation) {
    if ($relation[1] == $id) { // $id ist der Terminal-ID
        $relevantSchemaIds[] = $relation[2]; // Schema-ID hinzufügen

    }
}


$relevantSchemas = [];
foreach ($schemaList as $schema) {
    if (in_array($schema[0], $relevantSchemaIds) && $schema[3] == true) { // Schema-ID in relevanten IDs und aktiv
        $relevantSchemas[] = $schema;
    }
}
foreach ($relevantSchemas as $rs) {
    if (str_starts_with($rs[1], 'yt_')) {
        array_push($imagesContainer, $rs);
    } else if (in_array($rs[1], $images)) {
        array_push($imagesContainer, $rs);
    } else if (str_starts_with($rs[1], 'temp')) {
        array_push($imagesContainer, $rs);
    }
    
}



foreach ($imagesContainer as $schema) {
    // Hier können Sie die Bilder weiterverarbeiten
    $timeIsActive = filter_var($schema[8], FILTER_VALIDATE_BOOLEAN);
    $dateIsActive = filter_var($schema[9], FILTER_VALIDATE_BOOLEAN);
    $timeIsValid = false;
    $dateIsValid = false;

    if ($dateIsActive) {
        // Wenn Zeit auch aktiv ist, müssen beide stimmen
        if ($timeIsActive) {
            $timeIsValid = checkTime($schema[4], $schema[5], $timeFormat, $nowTime);
            $dateIsValid = checkTime($schema[6], $schema[7], $dateFormat, $nowDateTime);
            if ($timeIsValid && $dateIsValid) {
                array_push($resultContainer, $schema);
            }
        } else {
            // Nur Datum zählt
            $dateIsValid = checkTime($schema[6], $schema[7], $dateFormat, $nowDateTime);
            if ($dateIsValid) {
                array_push($resultContainer, $schema);
            }
        }
    } else {
        // Wenn Datum nicht aktiv, prüfe nur Zeit
        if ($timeIsActive) {
            $timeIsValid = checkTime($schema[4], $schema[5], $timeFormat, $nowTime);
            if ($timeIsValid) {
                array_push($resultContainer, $schema);
            }
        } else {
            // Weder Zeit noch Datum aktiv: immer anzeigen
            array_push($resultContainer, $schema);
        }
    }
}
// foreach ($images as $image) {
//     foreach ($schemaList as $schema) {
//         if ($schema[1] == $image && $schema[3] == true) {
//             foreach ($relationList as $relation) {
//                 if ($relation[1] == $id && $relation[2] == $schema[0]) {
//                     //  Variablen pro Schema initialisieren
//                     $timeIsActive = filter_var($schema[8], FILTER_VALIDATE_BOOLEAN);
//                     $dateIsActive = filter_var($schema[9], FILTER_VALIDATE_BOOLEAN);

//                     $timeIsValid = false;
//                     $dateIsValid = false;

//                     if ($dateIsActive) {
//                         // Wenn Zeit auch aktiv ist, müssen beide stimmen
//                         if ($timeIsActive) {
//                             $timeIsValid = checkTime($schema[4], $schema[5], $timeFormat, $nowTime);
//                             $dateIsValid = checkTime($schema[6], $schema[7], $dateFormat, $nowDateTime);
//                             if ($timeIsValid && $dateIsValid) {
//                                 array_push($imagesContainer, $schema);
//                             }
//                         } else {
//                             // Nur Datum zählt
//                             $dateIsValid = checkTime($schema[6], $schema[7], $dateFormat, $nowDateTime);
//                             if ($dateIsValid) {
//                                 array_push($imagesContainer, $schema);
//                             }
//                         }
//                     } else {
//                         // Wenn Datum nicht aktiv, prüfe nur Zeit
//                         if ($timeIsActive) {
//                             $timeIsValid = checkTime($schema[4], $schema[5], $timeFormat, $nowTime);
//                             if ($timeIsValid) {
//                                 array_push($imagesContainer, $schema);
//                             }
//                         } else {
//                             // Weder Zeit noch Datum aktiv: immer anzeigen
//                             array_push($imagesContainer, $schema);
//                         }
//                     }
//                 }
//             }
//         } else if (str_starts_with($schema[1], 'yt_')) {
//             // Wenn das Schema nicht aktiv ist, aber das Bild vorhanden ist

//         }
//     }
// };
function checkTime($start, $end, $format, $time)
{
    // echo "  → Prüfe: '$start' bis '$end' (Format: $format), Jetzt: '$time'<br>";
    // Prüfe auf leere, NULL oder 'NULL' Werte
    $startTrim = trim($start);
    $endTrim = trim($end);
    if (empty($startTrim) || empty($endTrim) || $startTrim === 'NULL' || $endTrim === 'NULL' || $startTrim === null || $endTrim === null) {
        // echo "  → Leere/NULL Start/End-Werte gefunden → INVALID<br>";
        return false;
    }
    $result = checkDateTime($startTrim, $endTrim, $format, $time);
    // echo "  → Ergebnis: " . ($result ? 'VALID' : 'INVALID') . "<br>";
    return $result;
}



function checkDateTime($start, $end, $format, $now)
{
    $startTime = createDateTimeFormat($start, $format);
    $endTime = createDateTimeFormat($end, $format);
    $nowTime = createDateTimeFormat($now, $format);

    if ($startTime && $endTime && $nowTime) {
        return ($nowTime >= $startTime && $nowTime <= $endTime);
    }
    return false;
}

function createDateTimeFormat($dateTime, $format)
{
    $dateTime = trim($dateTime);
    if (empty($dateTime) || $dateTime === 'NULL' || $dateTime === null || $dateTime === 'null') {
        return null;
    }
    // Für Zeit-Format: Leerzeichen entfernen ist ok
    if ($format === 'H:i:s' || $format === 'H:i') {
        $dateTime = str_replace(' ', '', $dateTime);
    }
    // Unterstütze auch das ISO-Format mit T
    if ($format === 'Y-m-d H:i' && strpos($dateTime, 'T') !== false) {
        $format = 'Y-m-d\TH:i';
    }
    $dateObj = DateTime::createFromFormat($format, $dateTime);
    if ($dateObj === false) {
        return null;
    }
    return $dateObj;
}


function getAllImagesAndVideos()
{
    $ordnerImages = $_SERVER['DOCUMENT_ROOT'] . "/uploads/img/";
    $ordnerVideos = $_SERVER['DOCUMENT_ROOT'] . "/uploads/video/";

    $array = array();

    // Bilder-Ordner durchsuchen
    if (is_dir($ordnerImages)) {
        $dateienImages = scandir($ordnerImages);
        foreach ($dateienImages as $datei) {
            if ($datei !== "." && $datei !== "..") {
                array_push($array, $datei);
            }
        }
    }

    // Video-Ordner durchsuchen
    if (is_dir($ordnerVideos)) {
        $dateienVideos = scandir($ordnerVideos);
        foreach ($dateienVideos as $datei) {
            if ($datei !== "." && $datei !== "..") {
                array_push($array, $datei);
            }
        }
    }
    return $array;
}

$imageList = json_encode($resultContainer);

echo $imageList;
