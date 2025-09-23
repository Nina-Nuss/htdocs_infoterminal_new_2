<?php

if (isset($_GET['XDEBUG_TRIGGER'])) {
    setcookie('XDEBUG_TRIGGER', '1', 0, '/'); // bleibt für weitere Requests in der Session aktiv
}

echo 1;

echo 2;


xdebug_info();
