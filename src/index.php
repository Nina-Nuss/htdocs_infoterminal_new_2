<?php
ob_start();

include __DIR__ . '/src/database/selectInfotherminal.php';
include __DIR__ . '/src/database/selectSchemas.php';

ob_clean();

// echo "<h1>------------</h1>";

$clientIP = trim(strval($_SERVER['REMOTE_ADDR']));

// $clientIP = "10.1.1.7";



echo "Die IP-Adresse des Clients ist: " . $clientIP;

$listePics = array();

$ipAdressFound = false;

foreach ($infotherminalList1 as $datensatz) {
    // Überprüfen, ob die IP-Adresse im Datensatz vorhanden ist und nicht null ist
    if (isset($datensatz[2]) && $clientIP === $datensatz[2] && $datensatz[2] !== null) {
        $idDatensatz = $datensatz[0];
        echo "<h1>Gefundene Ip adresse: </h1>" . $datensatz[2];
        $ipAdressFound = true;
        header("Location: /src/output/index.php?ip=" . urlencode($datensatz[1]));
    }
} 
if($ipAdressFound != true){
    header("Location: /src/output/error.php?error=ipNotFound");
}
?>
