@echo off
setlocal enabledelayedexpansion

echo === Sequential File/Folder Renamer ===
echo This script will rename all files/folders in the current directory with a sequential number.
echo.

:: Get the script's own filename
set "scriptName=%~nx0"

:: Ask the user for the base name
set /p baseName="Enter the base name for files/folders: "

:: Ask the user what to rename
echo.
echo Choose what to rename:
echo 1. Files only
echo 2. Folders only
echo 3. Both files and folders
set /p choice="Enter your choice (1-3): "

:: Initialize counter
set count=1

:: Rename based on user choice
if "%choice%"=="1" (
    :: Rename files only
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
) else if "%choice%"=="2" (
    :: Rename folders only
    for /d %%d in (*) do (
        :: Skip renaming the script's own directory
        if /i not "%%~nxd"=="%scriptName%" (
            :: Format the count with leading zeros (e.g., 01, 02, ...)
            set formattedCount=00!count!
            set formattedCount=!formattedCount:~-2!

            :: Rename the folder with the user input base name and formatted count
            ren "%%d" "!baseName!-!formattedCount!"

            :: Increment the counter
            set /a count+=1
        )
    )
) else if "%choice%"=="3" (
    :: Rename both files and folders
    :: Rename files
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
    :: Rename folders
    for /d %%d in (*) do (
        :: Skip renaming the script's own directory
        if /i not "%%~nxd"=="%scriptName%" (
            :: Format the count with leading zeros (e.g., 01, 02, ...)
            set formattedCount=00!count!
            set formattedCount=!formattedCount:~-2!

            :: Rename the folder with the user input base name and formatted count
            ren "%%d" "!baseName!-!formattedCount!"

            :: Increment the counter
            set /a count+=1
        )
    )
) else (
    echo Invalid choice.
)

echo Renaming completed.
pause