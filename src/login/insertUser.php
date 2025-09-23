<?php

session_start();

ob_start();
include '../database/selectUser.php';
include("../../config/php/connection.php");
ob_clean();
// if($_SERVER["REQUEST_METHOD"] != "POST"){
//     echo json_encode(['success' => false, 'message' => 'Nur POST erlaubt.']);
//     exit;
// }

// Beispiel-Werte (ersetze mit echten Daten aus POST oder Form)
$username = $_POST['username'] ?? 'admin'; // Beispiel-Username
$password = $_POST['password'] ?? '0000'; // Beispiel-Password
$role = $_POST['is_admin'] ?? 1; // Beispiel-Rolle
$isActive = $_POST['is_active'] ?? 1; // Beispiel-Aktivstatus (1 = aktiv, 0 = inaktiv)

$username = trim($username);
if (strpos($username, ' ') !== false) {
    echo "Im Benutzernamen befindet sich ein Leerzeichen.";
    exit;
}
foreach ($userList as $row) {
    if (isset($row['username']) && $row['username'] === $username) {
        echo json_encode(['success' => false, 'message' => 'Benutzername existiert bereits.']);
        exit;
    }
}

// Validierung

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// INSERT mit Prepared Statement
$insertSql = "INSERT INTO user_login (username, password, is_active) VALUES (?, ?, ?)";
$insertParams = array($username, $hashedPassword, $isActive);
$insertResult = sqlsrv_query($conn, $insertSql, $insertParams);

if ($insertResult === false) {
    die(print_r(sqlsrv_errors(), true));
} else {
    echo json_encode(['success' => true, 'message' => 'User erfolgreich eingefügt.']);
}

sqlsrv_close($conn);
?>