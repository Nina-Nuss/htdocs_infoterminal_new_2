<?php
session_start();
session_destroy();
$_SESSION['user_id'] = null;
$_COOKIE['username'] = null;
setcookie('username', '', time() - 3600, '/'); // Cookie löschen


exit;
?>