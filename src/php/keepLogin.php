<?php

session_start();
ob_start();
include '../database/selectUser.php';
include '../php/auth.php';
ob_clean();

foreach ($userList as $row) {
    if (isset($row['remember_me']) && $row['remember_me'] == 1) {
        // User gefunden, Session verlängern
        echo "user gefunden";
        $row['last_login'] = time(); // Aktuelle Zeit als letzte Aktivität setzen
        echo json_encode(['success' => true, 'message' => 'Session verlängert.']);
        exit;
    }
}
