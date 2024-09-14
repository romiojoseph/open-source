@echo off
setlocal enabledelayedexpansion

echo === List file and folder names ===
echo This script will list file and folder names, giving the user the option to include or exclude extensions.
echo.

:menu
echo Choose an option:
echo 1. Include file extensions
echo 2. Exclude file extensions

set /p choice=Enter your choice (1/2):

if "%choice%"=="1" (
    goto include_extensions
) else if "%choice%"=="2" (
    goto exclude_extensions
) else (
    echo Invalid choice. Exiting.
    goto end
)

:include_extensions
for %%f in (*) do (
    echo %%f
)
goto end

:exclude_extensions
for %%f in (*) do (
    set "filename=%%~nf"
    echo !filename!
)
goto end

:end
pause