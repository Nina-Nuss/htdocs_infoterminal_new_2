<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}
// Erlaubt nur Buchstaben, Zahlen und Unterstrich


// Überprüfen, ob eine Datei hochgeladen wurde
if (isset($_FILES['files'])) {
    // Dateien wurden hochgeladen
} else {
    echo "Fehler: Keine Datei hochgeladen oder Upload-Fehler.";
    return;
}

$all_files = count($_FILES['files']['tmp_name']);
$destPathList = [];
for ($i = 0; $i < $all_files; $i++) {
    $file_name = $_FILES['files']['name'][$i];
    $file_tmp  = $_FILES['files']['tmp_name'][$i];
    $file_type = $_FILES['files']['type'][$i];
    $file_size = $_FILES['files']['size'][$i];
    if (!is_uploaded_file($file_tmp)) {
        echo "Fehler: Datei wurde nicht korrekt hochgeladen.";
        continue;
    }
    // CORRECT: explode in Variable speichern, dann end()
    $parts = explode('.', $file_name);
    $fileExtension = strtolower(end($parts));
    $fileNames[] = $file_name;
    // Erlaubte Dateierweiterungen (KEINE .php/.html!)

    $allowedImageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    $allowedVideoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
    $allowedTypes = array_merge($allowedImageTypes, $allowedVideoTypes);
    // Prüfen ob Dateierweiterung erlaubt ist
    if (!in_array($fileExtension, $allowedTypes)) {
        echo "Dateityp nicht erlaubt! Erlaubt: " . implode(', ', $allowedTypes);
        exit;
    }
    // Zielordner je nach Dateityp
    if (in_array($fileExtension, $allowedImageTypes)) {
        $uploadFolder =  '../../uploads/img/';
        $randomName = uniqid('img_', true) . '.' . $fileExtension;
    } else {
        $uploadFolder = '../../uploads/video/';
        $randomName = uniqid('video_', true) . '.' . $fileExtension;
    }
    if (!is_dir($uploadFolder)) {
        mkdir($uploadFolder, 0755, true);
    }
    // Neuer Pfad (inkl. Zielname)
    $destPath = $uploadFolder . $randomName;
    // WICHTIG: move_uploaded_file muss die tmp-Datei verwenden
    if (is_uploaded_file($file_tmp) && move_uploaded_file($file_tmp, $destPath)) {
        $destPathList[] = $destPath; // Vollständiger Pfad zurückgeben
    } else {
        echo "Fehler beim Verschieben der Datei.";
    }
}
echo json_encode($destPathList);

    // ...existing code...
