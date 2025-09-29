<?php

session_start();

ob_start();
include 'selectUser.php';
include("../../config/php/connection.php");
ob_clean();
// if($_SERVER["REQUEST_METHOD"] != "POST"){
//     echo json_encode(['success' => false, 'message' => 'Nur POST erlaubt.']);
//     exit;
// }
$file = file_get_contents('php://input');

// Abrufen der JSON-Daten aus der Anfrage
$data = json_decode($file, true);
// Beispiel-Werte (ersetze mit echten Daten aus POST oder Form)
$username = $data['username'] ?? 'admin'; // Beispiel-Username
$password = $data['password'] ?? '0000'; // Beispiel-Password
$role = $data['is_admin'] ?? 1; // Beispiel-Rolle
$isActive = $data['is_active'] ?? 1; // Beispiel-Aktivstatus (1 = aktiv, 0 = inaktiv)


if (strpos($username, ' ') !== false) {
    echo false;
    exit;
}
foreach ($userList as $row) {
    if (isset($row['username']) && $row['username'] === $username) {
        echo false;
        exit;
    }
}
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
// INSERT mit Prepared Statement
$insertSql = "INSERT INTO user_login (username, password, is_admin) VALUES (?, ?, ?)";
$insertParams = array($username, $hashedPassword, $role);
$insertResult = sqlsrv_query($conn, $insertSql, $insertParams);
if ($insertResult === false) {
    die(print_r(sqlsrv_errors(), true));
} else {
    echo true;
}
sqlsrv_free_stmt($insertResult);

sqlsrv_close($conn);
?>
