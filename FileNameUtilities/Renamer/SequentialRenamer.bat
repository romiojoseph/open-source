@echo off
setlocal enabledelayedexpansion

echo === Sequential File Renamer ===
echo This script will rename all files in the current directory with a sequential number.
echo.

:: Get the script's own filename
set "scriptName=%~nx0"

:: Ask the user for the base name
set /p baseName="Enter the base name for files: "

:: Initialize counter
set count=1

:: Loop through all files in the current directory
for %%f in (*.*) do (
    :: Skip renaming the script itself
    if /i not "%%~nxf"=="%scriptName%" (
        :: Get the file extension
        set "ext=%%~xf"
        
        :: Format the count with leading zeros (e.g., 01, 02, ...)
        set formattedCount=00!count!
        set formattedCount=!formattedCount:~-2!
        
        :: Rename the file with the user input base name, formatted count, and original extension
        ren "%%f" "!baseName!-!formattedCount!!ext!"
        
        :: Increment the counter
        set /a count+=1
    )
)

echo Files renamed successfully.
pause
