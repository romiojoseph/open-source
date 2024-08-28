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
        :: Calculate and display the hash with custom formatted timestamp
        echo Calculating hash for: !fileName!
        for /f "usebackq tokens=*" %%A in (`powershell -Command "Get-FileHash -Path '!filePath!' -Algorithm SHA256 | Format-List; Get-Date -Format 'dd MMMM yyyy HH:mm:ss'"`) do (
            echo %%A
        )
        echo.
    )
)

echo Hash calculation complete.
pause
