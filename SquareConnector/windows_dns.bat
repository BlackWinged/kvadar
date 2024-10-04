@echo off
SETLOCAL

:: Define the addresses you want to add
SET "ADDRESS1=127.0.0.1 example1.com"
SET "ADDRESS2=127.0.0.1 example2.com"

:: Define the path to the hosts file
SET "HOSTS_FILE=C:\Windows\System32\drivers\etc\hosts"

:: Check if the script is run as Administrator
NET SESSION >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    ECHO Please run this script as Administrator.
    EXIT /B
)

:: Add the addresses to the hosts file if they don't already exist
FINDSTR /C:"%ADDRESS1%" "%HOSTS_FILE%" >nul
IF %ERRORLEVEL% NEQ 0 (
    ECHO Adding %ADDRESS1% to the hosts file...
    ECHO %ADDRESS1% >> "%HOSTS_FILE%"
)

FINDSTR /C:"%ADDRESS2%" "%HOSTS_FILE%" >nul
IF %ERRORLEVEL% NEQ 0 (
    ECHO Adding %ADDRESS2% to the hosts file...
    ECHO %ADDRESS2% >> "%HOSTS_FILE%"
)

ECHO Done.
ENDLOCAL
PAUSE