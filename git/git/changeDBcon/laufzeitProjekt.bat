REM Ersetzt $serverName in connection.php durch neuen Wert
@echo off
set "file=c:\xampp\htdocs\html_Infoterminal\config\php\connection.php"
REM $serverName ersetzen (egal was drinsteht)
powershell -Command "(Get-Content -Raw '%file%') -replace '\$serverName\s*=\s*\".*?\";', '$serverName = \"10.1.6.3\";' | Set-Content '%file%'"
REM $UID ersetzen (egal was drinsteht)
powershell -Command "(Get-Content -Raw '%file%') -replace '\$UID\s*=\s*\".*?\";', '$UID = \"sa\";' | Set-Content '%file%'"
REM $PWD ersetzen (egal was drinsteht)
powershell -Command "(Get-Content -Raw '%file%') -replace '\$PWD\s*=\s*\".*?\";', '$PWD = \"A%%00000p^&\";' | Set-Content '%file%'"
REM $Database ersetzen (egal was drinsteht)
powershell -Command "(Get-Content -Raw '%file%') -replace '\$Database\s*=\s*\".*?\";', '$database = \"dbTerminal\";' | Set-Content '%file%'"
echo Fertig! Die Datei wurde angepasst.
@echo off

