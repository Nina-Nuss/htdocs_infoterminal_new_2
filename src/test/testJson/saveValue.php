<?php
$data = json_decode(file_get_contents('php://input'), true);
$key = $data['key'] ?? "test";
$value = $data['value'] ?? "test";

echo json_encode("Key: " . $key . " Value: " . $value . "\n");

$jsonData = file_get_contents('../../../config/configTest.json');
$config = json_decode($jsonData, true);


foreach ($data as $item) {
    $key = $item['key'];
    $value = $item['value'];
}

$config['webpageSettings'][0][$key] = $value;



file_put_contents('../../../config/configTest.json', json_encode($config, JSON_PRETTY_PRINT));
