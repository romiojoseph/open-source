@echo off
setlocal enabledelayedexpansion

echo === Add Prefix or Suffix to Your File Names ===
echo This script will add a prefix and/or suffix to all files in the current directory. You can enter a prefix, suffix, or both. The script will add a hyphen (-) before the suffix and after the prefix.
echo.

:: Ask the user for the prefix and suffix
set /p prefix="Prefix (optional): "
set /p suffix="Suffix (optional): "

:: Get the script's own filename
set "scriptName=%~nx0"

:: Loop through all files in the current directory
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

echo Files renamed successfully.
pause