REM Ersetzt $serverName in connection.php durch neuen Wert
@echo off
set "file=c:\xampp\htdocs\config\php\connection.php"
REM $serverName ersetzen (egal was drinsteht)
powershell -Command "(Get-Content -Raw '%file%') -replace '\$serverName\s*=\s*\".*?\";', '$serverName = \"Nina\\SQLEXPRESS\";' | Set-Content '%file%'"
REM $UID ersetzen (egal was drinsteht)
powershell -Command "(Get-Content -Raw '%file%') -replace '\$UID\s*=\s*\".*?\";', '$UID = \"\";' | Set-Content '%file%'"
REM $PWD ersetzen (egal was drinsteht)
powershell -Command "(Get-Content -Raw '%file%') -replace '\$PWD\s*=\s*\".*?\";', '$PWD = \"\";' | Set-Content '%file%'"
echo Fertig! Die Datei wurde angepasst.
@echo off
