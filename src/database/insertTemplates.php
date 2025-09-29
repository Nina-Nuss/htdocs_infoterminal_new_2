<?php
include("../../config/php/connection.php");
$data = json_decode(file_get_contents("php://input"), true);
$templates = $data['templates'] ?? [];

$sql = "INSERT INTO templates (fk_schema_id, templateName, typ, inhalt) VALUES (?, ?, ?, ?)";
foreach ($templates as $template) {
    $schema_id = $template['fk_schema_id'];
    $templateName = $template['templateName'] ?? 'meow';
    $typ = $template['typ'] ?? 'meow';
    $inhalt = $template['inhalt'] ?? 'meow';
    $params = [$schema_id, $templateName, $typ, $inhalt];
    $stmt = sqlsrv_prepare($conn, $sql, $params);
    if ($stmt === false) {
        error_log("sqlsrv_prepare error: " . print_r(sqlsrv_errors(), true));
        continue;
    }
    if (sqlsrv_execute($stmt)) {
        echo "Datensatz erfolgreich eingefügt";
        echo json_encode(['status' => 'success']);
    } else {
        // echo "Fehler beim Einfügen: ";
        print_r(sqlsrv_errors());
    }
    // Statement schließen
    sqlsrv_free_stmt($stmt);
}
sqlsrv_close($conn);
exit;