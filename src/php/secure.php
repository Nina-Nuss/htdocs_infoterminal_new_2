<?php
function checkInput($input) {
    // Erlaube nur Buchstaben, Zahlen, Unterstriche und Leerzeichen
    return preg_match('/^[A-Za-z0-9_ \r\n]+$/', $input);
}

