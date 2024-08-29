@echo off
setlocal enabledelayedexpansion

echo === Replace Word in Filenames ===
echo This script will replace a specific word in all file names with a new word.
echo.

:: Ask the user for the word to replace
set /p oldWord="Enter the word you want to replace in filenames: "

:: Ask the user for the replacement word
set /p newWord="Replace '%oldWord%' with: "

:: Get the script's own filename to exclude it from renaming
set "scriptName=%~nx0"

:: Initialize a success flag
set "success=0"

:: Loop through all files in the current directory
for %%f in (*.*) do (
    :: Skip renaming the script itself
    if /i not "%%~nxf"=="%scriptName%" (
        :: Get the file name and extension
        set "filename=%%~nf"
        set "ext=%%~xf"

        :: Check if the filename contains the old word
        echo "!filename!" | findstr /i "%oldWord%" >nul
        if !errorlevel! equ 0 (
            :: Replace the old word with the new word in the filename
            set "newFilename=!filename:%oldWord%=%newWord%!"

            :: Rename the file with the updated filename and original extension
            ren "%%f" "!newFilename!!ext!"
            set "success=1"
        )
    )
)

:: Display the result
if %success% equ 1 (
    echo Files renamed successfully.
) else (
    echo No files found with the specified word.
)

pause
