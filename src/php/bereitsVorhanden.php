<?php
ob_start(); // Start output buffering

include "../database/selectInfotherminal.php";
// echo "<br>";
ob_end_clean(); // Uncomment if you want to clear the output buffer

$ip = $_POST["infotherminalIp"] ?? '';
$name = $_POST["infotherminalName"] ?? '';

$patternIp = '/^[A-Za-z0-9\._@\-\s]+$/';// Leerzeichen (\s) hinzugefügt

// ...existing code...
$patternIpFormat = '/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/';
// ...existing code...

global $ip;
global $name;

$ip = $_POST["infotherminalIp"] ?? '';
$name = $_POST["infotherminalName"] ?? '';

global $arrayNameIp;

$arrayNameIp = array();
function checkZeichen($patternIp, $ip)
{
    if (!preg_match($patternIp, $ip)) {
        echo "ungültiges Zeichen";
        echo "Regex-Fehler: " . preg_last_error();
        exit;
    }
}
function checkIpFormat($patternIpFormat, $ip)
{
    if (!preg_match($patternIpFormat, $ip)) {
        echo "IP-Adresse entspricht nicht dem Format 00.0.0.000!";
        exit;
    }
}
checkZeichen($patternIp, $ip);
checkZeichen($patternIp, $name);
checkIpFormat($patternIpFormat, $ip);

if (isset($ip) && isset($name)) {
    if ($ip !== "0.0.0.0") {
        foreach ($infotherminalList1 as $datensatz) {
            if ($datensatz[2] === $ip || $datensatz[1] === $name) {
                echo "IP bereits vorhanden: " . $datensatz[2];
                exit;
            }
        }
    }
    array_push($arrayNameIp, [$name, $ip]);
    include '../database/insertInfotherminal.php';
    exit;
}
