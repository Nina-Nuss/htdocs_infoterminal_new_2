<?php

ob_start();
include '../../config/php/connection.php';

include '../database/selectTemplates.php';
include '../database/selectSchemas.php';

ob_clean();


foreach ($schemaList1 as &$schema) {
    foreach ($templatesList as $template) {
        if ($template[1] === $schema[0]) {
           array_push($schema,  $template[2], $template[3], $template[4]);
        }
    }
}
unset($schema); 

echo json_encode($schemaList1);