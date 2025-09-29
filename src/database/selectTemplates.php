<?php
ob_start();
include '../../config/php/connection.php';
ob_clean();
$schema_id = $_GET['schema_id'] ?? 53;
$sql2 = "SELECT templates.* FROM schemas 
            RIGHT JOIN templates ON templates.fk_schema_id = schemas.id
            WHERE templates.fk_schema_id = $schema_id
           ";
$result2 = sqlsrv_query($conn, $sql2);
if ($result2 === false) {
    die("Abfragefehler: " . print_r(sqlsrv_errors(), true));
}
$templatesList = array();
while ($row2 = sqlsrv_fetch_array($result2, SQLSRV_FETCH_ASSOC)) {
    array_push($templatesList, array(
        $row2["id"],
        $row2["fk_schema_id"],
        $row2["templateName"],
        $row2["typ"],
        $row2["inhalt"],
    ));
}
sqlsrv_free_stmt($result2);
$templatesListJson = json_encode($templatesList);
echo $templatesListJson;
