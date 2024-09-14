@echo off
setlocal enabledelayedexpansion

echo === Replace Word in File/Folder Names ===
echo This script will replace a specific word in file and/or folder names with a new word.
echo.

:: Ask the user for the word to replace
set /p oldWord="Enter the word you want to replace: "

:: Ask the user for the replacement word
set /p newWord="Replace '%oldWord%' with: "

:: Ask the user what to rename
echo.
echo Choose what to rename:
echo 1. Files only
echo 2. Folders only
echo 3. Both files and folders
choice /c 123 /n /m "Enter your choice: "
set choice=%errorlevel%

:: Get the script's own filename to exclude it from renaming
set "scriptName=%~nx0"

:: Initialize a success flag
set "success=0"

:: Rename based on user choice
if %choice% EQU 1 (
    :: Rename files only
    for %%f in (*.*) do (
        :: Skip renaming the script itself
        if /i not "%%~nxf"=="%scriptName%" (
            :: Get the file name and extension
            set "filename=%%~nf"
            set "ext=%%~xf"

            :: Check if the filename contains the old word (case-insensitive)
            echo "!filename!" | findstr /i "%oldWord%" >nul
            if !errorlevel! equ 0 (
                :: Replace the old word with the new word in the filename (case-insensitive)
                set "newFilename=!filename:%oldWord%=%newWord%!"

                :: Rename the file with the updated filename and original extension
                ren "%%f" "!newFilename!!ext!"
                set "success=1"
            )
        )
    )
) else if %choice% EQU 2 (
    :: Rename folders only
    pushd .
    for /f "delims=" %%d in ('dir /b /ad') do ( 
        :: Skip renaming the script's own directory
        if /i not "%%d"=="%scriptName%" (
            :: Get the folder name
            set "folderName=%%d"

            :: Check if the folder name contains the old word (case-insensitive)
            echo "!folderName!" | findstr /i "%oldWord%" >nul
            if !errorlevel! equ 0 (
                :: Replace the old word with the new word in the folder name (case-insensitive)
                set "newFolderName=!folderName:%oldWord%=%newWord%!"

                :: Rename the folder with the updated folder name
                ren "%%d" "!newFolderName!"
                set "success=1"
            )
        )
    )
    popd
) else if %choice% EQU 3 (
    :: Rename both files and folders
    :: Rename files (same as choice 1)
    for %%f in (*.*) do (
        :: Skip renaming the script itself
        if /i not "%%~nxf"=="%scriptName%" (
            :: Get the file name and extension
            set "filename=%%~nf"
            set "ext=%%~xf"

            :: Check if the filename contains the old word (case-insensitive)
            echo "!filename!" | findstr /i "%oldWord%" >nul
            if !errorlevel! equ 0 (
                :: Replace the old word with the new word in the filename (case-insensitive)
                set "newFilename=!filename:%oldWord%=%newWord%!"

                :: Rename the file with the updated filename and original extension
                ren "%%f" "!newFilename!!ext!"
                set "success=1"
            )
        )
    )
    :: Rename folders (similar to choice 2 with pushd/popd)
    pushd .
    for /f "delims=" %%d in ('dir /b /ad') do (
        :: Skip renaming the script's own directory
        if /i not "%%d"=="%scriptName%" (
            :: Get the folder name
            set "folderName=%%d"

            :: Check if the folder name contains the old word (case-insensitive)
            echo "!folderName!" | findstr /i "%oldWord%" >nul
            if !errorlevel! equ 0 (
                :: Replace the old word with the new word in the folder name (case-insensitive)
                set "newFolderName=!folderName:%oldWord%=%newWord%!"

                :: Rename the folder with the updated folder name
                ren "%%d" "!newFolderName!"
                set "success=1"
            )
        )
    ) 
    popd
) else (
    echo Invalid choice.
)

:: Display the result
if %success% equ 1 (
    echo Renaming completed.
) else (
    echo No files or folders found with the specified word.
)

pause