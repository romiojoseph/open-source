@echo off
setlocal enabledelayedexpansion

:: Display script action overview
echo This script will rename files in the current folder by changing their extensions.
echo You can convert .txt files to .md and vice versa.
echo.

:: Prompt the user to select a conversion option
echo Select the extension conversion you want to perform:
echo 1. .txt to .md
echo 2. .md to .txt
echo.
set /p option="Enter your choice (1-2): "
echo You entered: %option%

:: Initialize a flag to check if any files were renamed
set "filesRenamed=0"

:: Execute the selected option
if "%option%"=="1" (
    echo Renaming .txt to .md...
    :: Change .txt to .md
    for %%f in (*.txt) do (
        echo Renaming "%%f" to "%%~nf.md"
        ren "%%f" "%%~nf.md"
        set /a filesRenamed+=1
    )
) else if "%option%"=="2" (
    echo Renaming .md to .txt...
    :: Change .md to .txt
    for %%f in (*.md) do (
        echo Renaming "%%f" to "%%~nf.txt"
        ren "%%f" "%%~nf.txt"
        set /a filesRenamed+=1
    )
) else (
    echo Invalid option selected. Please run the script again and choose a valid option.
)

:: Display result
if !filesRenamed! GTR 0 (
    echo Renamed !filesRenamed! file(s) successfully.
) else (
    echo No files found to rename.
)

echo.
echo Script completed.
echo Please press a key to exit...
pause
