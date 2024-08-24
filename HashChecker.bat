@echo off
setlocal enabledelayedexpansion

:: Set the directory to search in (current directory in this case)
set "searchDir=%~dp0"

:: Loop through all files in the directory
for %%F in ("%searchDir%*.*") do (
    :: Get the full path of the file
    set "filePath=%%~fF"
    
    :: Get just the filename with extension
    set "fileName=%%~nxF"
    
    :: Skip the batch file itself
    if not "!fileName!"=="%~nx0" (
        :: Calculate and display the hash
        echo Calculating hash for: !fileName!
        powershell -Command "Get-FileHash -Path '!filePath!' -Algorithm SHA256 | Format-List"
        echo.
    )
)

echo Hash calculation complete.
pause
