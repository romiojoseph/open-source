@echo off
setlocal enabledelayedexpansion

echo === Add Prefix or Suffix to Your File/Folder Names ===
echo This script will add a prefix and/or suffix to files and/or folders in the current directory.
echo.

:: Ask the user for the prefix and suffix
set /p prefix="Prefix (optional): "
set /p suffix="Suffix (optional): "

:: Ask the user what to rename
echo.
echo Choose what to rename:
echo 1. Files only
echo 2. Folders only
echo 3. Both files and folders
set /p choice="Enter your choice (1-3): "

:: Get the script's own filename
set "scriptName=%~nx0"

:: Rename based on user choice
if "%choice%"=="1" (
    :: Rename files only
    for %%f in (*.*) do (
        :: Skip renaming the script itself
        if /i not "%%~nxf"=="%scriptName%" (
            :: Get the file name and extension
            set "filename=%%~nf"
            set "ext=%%~xf"

            :: Rename based on user input for prefix and suffix
            if defined prefix (
                set "newName=!prefix!-!filename!"
            ) else (
                set "newName=!filename!"
            )
            if defined suffix (
                set "newName=!newName!-!suffix!!ext!"
            ) else (
                set "newName=!newName!!ext!"
            )
            ren "%%f" "!newName!"
        )
    )
) else if "%choice%"=="2" (
    :: Rename folders only
    for /d %%d in (*) do (
        :: Skip renaming the script's own directory
        if /i not "%%~nxd"=="%scriptName%" (
            :: Get the folder name
            set "folderName=%%~nxd"

            :: Rename based on user input for prefix and suffix
            if defined prefix (
                set "newName=!prefix!-!folderName!"
            ) else (
                set "newName=!folderName!"
            )
            if defined suffix (
                set "newName=!newName!-!suffix!"
            ) else (
                set "newName=!newName!"
            )
            ren "%%d" "!newName!"
        )
    )
) else if "%choice%"=="3" (
    :: Rename both files and folders
    :: Rename files
    for %%f in (*.*) do (
        :: Skip renaming the script itself
        if /i not "%%~nxf"=="%scriptName%" (
            :: Get the file name and extension
            set "filename=%%~nf"
            set "ext=%%~xf"

            :: Rename based on user input for prefix and suffix
            if defined prefix (
                set "newName=!prefix!-!filename!"
            ) else (
                set "newName=!filename!"
            )
            if defined suffix (
                set "newName=!newName!-!suffix!!ext!"
            ) else (
                set "newName=!newName!!ext!"
            )
            ren "%%f" "!newName!"
        )
    )
    :: Rename folders
    for /d %%d in (*) do (
        :: Skip renaming the script's own directory
        if /i not "%%~nxd"=="%scriptName%" (
            :: Get the folder name
            set "folderName=%%~nxd"

            :: Rename based on user input for prefix and suffix
            if defined prefix (
                set "newName=!prefix!-!folderName!"
            ) else (
                set "newName=!folderName!"
            )
            if defined suffix (
                set "newName=!newName!-!suffix!"
            ) else (
                set "newName=!newName!"
            )
            ren "%%d" "!newName!"
        )
    )
) else (
    echo Invalid choice.
)

echo Renaming completed.
pause