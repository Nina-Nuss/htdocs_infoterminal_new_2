<?php

ob_start();
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
$errorMessange = $data['message'] ?? ''; // Beispiel-Username




// INSERT mit Prepared Statement
$insertSql = "INSERT INTO error_logs (message) VALUES (?)";
$insertParams = array($errorMessange);
$insertResult = sqlsrv_query($conn, $insertSql, $insertParams);

if ($insertResult === false) {
    die(print_r(sqlsrv_errors(), true));
    
} else {
    echo json_encode(['success' => true, 'message' => 'error erfolgreich eingefügt.']);
}
sqlsrv_free_stmt($insertResult);

sqlsrv_close($conn);
?>
