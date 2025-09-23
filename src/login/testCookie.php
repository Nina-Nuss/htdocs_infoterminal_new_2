<?php
if (isset($_COOKIE['username'])) {
    $username = $_COOKIE['username'];
    echo 'Hallo ' . htmlspecialchars($username, ENT_QUOTES, 'UTF-8');
} else {
    echo 'Kein Cookie vorhanden';
}
