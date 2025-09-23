<?

// Hash einmal generieren und speichern (z.B. in Variable oder DB)
$password = 'meinPasswort123';
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
echo "SASDFSDF";
// Später verifizieren
$eingabePasswort = 'meinPasswort123';
if (password_verify($eingabePasswort, $hashedPassword)) {
    echo 'Passwort ist korrekt!';
} else {
    echo 'Ungültiges Passwort.';
}

