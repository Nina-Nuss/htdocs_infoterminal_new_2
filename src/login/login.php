<?php
session_start();
ob_start();

require("../database/selectUser.php");
include("../../config/php/connection.php");


ob_end_clean();

$file = file_get_contents('php://input');
// Abrufen der JSON-Daten aus der Anfrage
$data = json_decode($file, true);

$userExist = false;
// if($_SERVER["REQUEST_METHOD"] != "POST"){
//     echo json_encode(['success' => false, 'message' => 'Nur POST erlaubt.']);
//     exit;
// }
$username = trim($data['username'] ?? 'user'); // Leerzeichen entfernen, Default leer
// $email = trim($data['email'] ?? ''); // Leerzeichen entfernen
$password = $data['password'] ?? '0000'; // Leerzeichen entfernen, Default leer
$remember = $data['remember'] ?? false; // Boolean konvertieren
// if (!filter_var($username, FILTER_VALIDATE_EMAIL)) {
//     echo "Ungültige Email-Adresse.";
//     exit();
// }
// if (strlen($password) < 4) {
//     echo "Passwort muss mindestens 4 Zeichen haben.";
//     exit();
// // }
foreach ($userList as $row) {
    if (isset($row['username']) && isset($row['password'])) {
        if ($row['username'] == $username) {
            $userExist = true;
            if (password_verify($password, $row['password']) && $row['is_active'] == 1) {
                $_SESSION['remember'] = $row['remember_me'];
                $_SESSION['user_id'] = $row['id'];
                $_SESSION['is_admin'] = $row['is_admin'];
                $_SESSION['is_active'] = $row['is_active'];
                $_SESSION['username'] = $row['username'];
                $_SESSION['last_login'] = $row['last_login'];
                $_SESSION['login_success'] = true; // Setze den Login-Erfolgsstatus
                if ($row['remember_me'] != $remember) {
                    $updateSql = "UPDATE user_login SET remember_me = ? WHERE id = ?";
                    $params = [$remember, $row['id']];
                    $updateResult = sqlsrv_query($conn, $updateSql, $params);
                    if ($updateResult === false) {
                        die(print_r(sqlsrv_errors(), true));
                    }
                    sqlsrv_free_stmt($updateResult);
                    $updateSql = null;
                }
                if ($remember) {
                    setcookie('username', $username, time() + 86400 * 30, "/");
                    $_COOKIE['username'] = $username; // optional für aktuelle Anfrage
                } else {
                    setcookie('username', '', time() - 3600, "/"); // Cookie löschen
                    unset($_COOKIE['username']);
                }
                if ($row['is_admin'] == 1) {
                    setcookie('isAdmin', $row['is_admin'], time() + 86400 * 30, "/");
                    $_COOKIE['isAdmin'] = $row['is_admin']; // optional für aktuelle Anfrage
                }else{
                    setcookie('isAdmin', '', time() - 3600, "/"); // Cookie löschen
                    unset($_COOKIE['isAdmin']);
                }
                // Erfolgreicher Login: Fehlversuche zurücksetzen
                $now = new DateTime();
                $updateSql = "UPDATE user_login SET failed_attempts = 0, lockout_until = NULL, last_login = ? WHERE id = ?";
                $params = [$now->format('Y-m-d H:i:s'), $row['id']];
                $updateResult = sqlsrv_query($conn, $updateSql, $params);

                if ($updateResult === false) {
                    die(print_r(sqlsrv_errors(), true));
                }
                sqlsrv_free_stmt($updateResult);
                $updateSql = null;
                echo json_encode([
                    'success' => $userExist,
                    'message' => 'Login erfolgreich'
                ]);
            
                // Setze last_login auf aktuelle Zeit
            }
            if ($row['username'] == $username && !password_verify($password, $row['password'])) {
                $updateSql = "UPDATE user_login SET failed_attempts += 1, last_failed_attempt = ? WHERE id = ?";
                $params = [date('Y-m-d H:i:s'), $row['id']];
                $updateResult = sqlsrv_query($conn, $updateSql, $params);

                if ($updateResult === false) {
                    die(print_r(sqlsrv_errors(), true));
                }
                sqlsrv_free_stmt($updateResult);
                $updateSql = null;
                if ($row['failed_attempts'] + 1 >= 5) {
                    $lockoutMinutes = 5;
                    $dt = new DateTime();
                    $dt->modify("+{$lockoutMinutes} minutes");
                    $lockoutUntilStr = $dt->format('Y-m-d H:i:s');
                    $lockSql = "UPDATE user_login SET lockout_until = ?, failed_attempts = '0' WHERE id = ?";
                    $params = [$lockoutUntilStr, $row['id']];
                    $lockRes = sqlsrv_query($conn, $lockSql, $params);
                    if ($lockRes === false) {
                        echo json_encode(['success' => false, 'message' => 'DB-Fehler beim Sperren des Kontos']);
                        exit;
                    }
                    sqlsrv_free_stmt($lockRes);

                    echo json_encode([
                        'success' => false,
                        'message' => 'Zu viele Fehlversuche. Konto gesperrt bis ' . $dt->format('d.m.Y H:i')
                    ]);
                    exit;
                }
                echo json_encode([
                    'success' => false,
                    'message' => 'Falsches Passwort. Fehlversuche: ' . ($row['failed_attempts'] + 1)
                ]);
            }
        }
    }
}
if (!$userExist) {
    echo json_encode(['success' => false, 'message' => 'Benutzername existiert nicht oder Konto deaktiviert.']);
    exit;
}
