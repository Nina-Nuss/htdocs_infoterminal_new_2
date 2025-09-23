<?php
// include("connection.php");
include("../database/selectInfotherminal.php");
include("../database/selectSchemas.php");

ob_end_clean();


$infoterminalListLength = count($infotherminalList1);
$schemalistLength = count($schemaList1);



$jsonFile = '../../config/config.json'; // Pfad zur JSON-Datei
$jsonData = json_decode(file_get_contents($jsonFile), true); // In ein PHP-Array umwandeln

global $listelengthValue;
$listelengthValue = array();


foreach ($jsonData as $key => $value) {
    if ($key === 'defaultMaxCountForInfoTerminals') {
        array_push($listelengthValue, [$value, $infoterminalListLength]);
    }
    if ($key === 'defaultMaxCountForInfoPages') {
        array_push($listelengthValue, [$value, $schemalistLength]);
    }

}

return $listelengthValue;