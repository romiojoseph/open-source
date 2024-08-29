@echo off
setlocal enabledelayedexpansion

:: Set the directory to search in (current directory in this case)
set "searchDir=%~dp0"

:: Set the output file name
set "outputFile=%searchDir%HashValue.txt"

:: Create a temporary file to store results
set "tempFile=%temp%\hash_results_temp.txt"
if exist "%tempFile%" del "%tempFile%"

:: Add a separator with current date and time to the temp file
for /f "usebackq delims=" %%A in (`powershell -Command "Get-Date -Format 'dd MMMM yyyy'"`) do (
    echo. >> "%tempFile%"
    echo ===== Hash Check Run on %%A ===== >> "%tempFile%"
    echo. >> "%tempFile%"
)

:: Loop through all files in the directory
for %%F in ("%searchDir%*.*") do (
    :: Get the full path of the file
    set "filePath=%%~fF"
    
    :: Get just the filename with extension
    set "fileName=%%~nxF"
    
    :: Skip the script file itself and the HashValue.txt file
    if /I not "!fileName!"=="%~nx0" if /I not "!fileName!"=="HashValue.txt" (
        :: Calculate and display the hash with custom formatted timestamp
        echo Calculating hash for: !fileName!
        for /f "usebackq delims=" %%A in (`powershell -Command "$hash = Get-FileHash -Path '!filePath!' -Algorithm SHA256; $date = Get-Date -Format 'dd MMMM yyyy hh:mm:ss tt'; Write-Output ('Algorithm : ' + $hash.Algorithm); Write-Output ('Hash      : ' + $hash.Hash); Write-Output ('Path      : ' + $hash.Path); Write-Output $date"`) do (
            echo %%A
            echo %%A>> "%tempFile%"
        )
        echo.
        echo.>> "%tempFile%"
    )
)

echo Hash calculation complete.
echo Press any key to append this info to HashValue.txt and close.
pause > nul

:: Append the temp file to the final output file
type "%tempFile%" >> "%outputFile%"

echo Results appended to %outputFile%
del "%tempFile%"
pause
