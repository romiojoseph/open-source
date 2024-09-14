@echo off
setlocal enabledelayedexpansion

:: Print a heading and description
echo === File Renaming Script ===
echo This script will remove a specified word from the filenames in the current directory.
echo Note: The removal is case-sensitive. If you want to remove a word followed by a space, include the space in the word to remove.
echo.

:: Get the word to remove from file names
set /p word_to_remove=Enter the word to remove:

:: Ask the user what to rename
echo Choose what to rename:
echo 1. Files only
echo 2. Folders only
echo 3. Both files and folders
set /p choice=Enter your choice (1/2/3):

:: Function to rename items based on choice
if "%choice%"=="1" (
    for %%f in (*) do (
        if exist "%%f" (
            set "new_filename=%%~nxf"
            set "new_filename=!new_filename:%word_to_remove%=!"
            ren "%%f" "!new_filename!"
        )
    )
) else if "%choice%"=="2" (
    for /d %%d in (*) do (
        if exist "%%d" (
            set "new_dirname=%%~nxd"
            set "new_dirname=!new_dirname:%word_to_remove%=!"
            ren "%%d" "!new_dirname!"
        )
    )
) else if "%choice%"=="3" (
    for %%i in (*) do (
        if exist "%%i" (
            set "new_name=%%~nxi"
            set "new_name=!new_name:%word_to_remove%=!"
            ren "%%i" "!new_name!"
        )
    )
    for /d %%d in (*) do (
        if exist "%%d" (
            set "new_dirname=%%~nxd"
            set "new_dirname=!new_dirname:%word_to_remove%=!"
            ren "%%d" "!new_dirname!"
        )
    )
) else (
    echo Invalid choice. Exiting.
    goto end
)

echo Items renamed successfully!

:end
pause