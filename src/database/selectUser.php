<?php
// ...existing code...



include '../../config/php/connection.php';

$sql = "SELECT * FROM user_login";
$result = sqlsrv_query($conn, $sql);

if ($result === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Abfragefehler']);
    exit;
}

$userList = [];
while ($row = sqlsrv_fetch_array($result, SQLSRV_FETCH_ASSOC)) {
    array_push($userList, [
        'id' => $row['id'],
        'username' => $row['username'],
        'is_active' => $row['is_active'],
        'is_admin' => $row['is_admin'],
        'created_at' => $row['created_at'],
        'password' => $row['password'],
        'last_login' => $row['last_login'],
        'remember_me' => $row['remember_me'],
        'email' => $row['email'],
        'is_admin' => $row['is_admin'],
        'verification_code' => $row['verification_code'],
        'verification_expires' => $row['verification_expires'],
        'lockout_until' => $row['lockout_until'],
        'failed_attempts' => $row['failed_attempts'],
        'created_at' => $row['created_at'],
    ]);
}
sqlsrv_free_stmt($result);

sqlsrv_close($conn);


echo json_encode($userList);
