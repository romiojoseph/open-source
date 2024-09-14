@echo off
setlocal enabledelayedexpansion

:input
set /p "text=Enter your text: "
if "%text%"=="" goto input

echo.
echo Original text: %text%
echo.

:: Uppercase
echo 1. Uppercase:
echo %text% | powershell -command "$input | ForEach-Object { $_.ToUpper() }"
echo.

:: Lowercase
echo 2. Lowercase:
echo %text% | powershell -command "$input | ForEach-Object { $_.ToLower() }"
echo.

:: Title Case (with exceptions)
echo 3. Title Case:
echo %text% | powershell -command "$exceptions = @('a', 'an', 'the', 'and', 'but', 'or', 'nor', 'for', 'so', 'yet', 'in', 'on', 'at', 'by', 'with', 'from', 'under', 'above', 'over', 'through', 'during', 'including', 'he', 'she', 'it', 'they', 'them', 'their', 'its', 'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being', 'as', 'at', 'to', 'into', 'onto', 'of', 'up', 'down', 'out', 'on', 'off', 'via'); $words = $input -split '\s+'; for ($i = 0; $i -lt $words.Count; $i++) { if ($i -eq 0 -or $exceptions -notcontains $words[$i].ToLower()) { $words[$i] = (Get-Culture).TextInfo.ToTitleCase($words[$i].ToLower()) } else { $words[$i] = $words[$i].ToLower() } }; $words -join ' '"
echo.

:: Absolute Title Case
echo 4. Absolute Title Case:
echo %text% | powershell -command "$input | ForEach-Object { (Get-Culture).TextInfo.ToTitleCase($_.ToLower()) }"
echo.

:: Sentence Case
echo 5. Sentence Case:
echo %text% | powershell -command "$sentences = $input -split '[.!?]'; for ($i = 0; $i -lt $sentences.Count; $i++) { $sentences[$i] = $sentences[$i].Trim(); if ($sentences[$i].Length -gt 0) { $sentences[$i] = $sentences[$i].Substring(0,1).ToUpper() + $sentences[$i].Substring(1).ToLower() } }; $sentences -join '. '"
echo.

:: Camel Case
echo 6. Camel Case:
echo %text% | powershell -command "$words = $input -replace '[^a-zA-Z0-9\s]', '' -split '\s+'; $firstWord = $words[0].ToLower(); $remainingWords = $words[1..$words.Length] | ForEach-Object {if ($_.Length -gt 0) {$_.Substring(0,1).ToUpper() + $_.Substring(1).ToLower()} else {''}}; $firstWord + ($remainingWords -join '')"
echo.

:: Pascal Case
echo 7. Pascal Case:
echo %text% | powershell -command "$words = $input -replace '[^a-zA-Z0-9\s]', '' -split '\s+'; ($words | ForEach-Object {if ($_.Length -gt 0) {$_.Substring(0,1).ToUpper() + $_.Substring(1).ToLower()} else {''}}) -join ''"
echo.

:: Snake Case
echo 8. Snake Case:
echo %text% | powershell -command "($input -replace '[^\w\s]', '').Trim().ToLower() -replace '\s+', '_'"
echo.

:: Kebab Case
echo 9. Kebab Case:
echo %text% | powershell -command "($input -replace '[^\w\s]', '').Trim().ToLower() -replace '\s+', '-'"
echo.

echo Press any key to convert another text or close the window to exit.
pause >nul
goto input