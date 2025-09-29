<?php

include "../../config/php/connection.php";

$sql = "SELECT TOP 1 * FROM dbo.schemas ORDER BY id DESC";
$stmt = sqlsrv_query($conn, $sql);
if ($stmt === false) {
    $err = sqlsrv_errors();
    echo json_encode(['success' => false, 'message' => 'Query failed', 'errors' => $err]);
    sqlsrv_close($conn);
    exit;
}
$row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);
sqlsrv_free_stmt($stmt);
sqlsrv_close($conn);

if ($row === null) {
    echo json_encode(['success' => true, 'message' => 'Keine Zeilen gefunden', 'row' => null]);
} else {
    echo json_encode( $row["id"] );

}
exit;
