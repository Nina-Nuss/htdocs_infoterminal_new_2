<?php
session_start();

setcookie("username", "Alice", time() + 3600, "/");

// Cookie auslesen
if (isset($_COOKIE['username'])) {
    echo "Hallo, " . htmlspecialchars($_COOKIE['username']);
}
?>