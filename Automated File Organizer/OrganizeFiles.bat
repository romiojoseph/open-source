@echo off
setlocal enabledelayedexpansion

:: Get the script's location and name
set "script_folder=%~dp0"
set "script_name=%~nx0"

:: Initialize variables to track which folders are needed
set "folders=Images Videos Audio Documents Design Archives Code Fonts Web 3DModels Miscellaneous Executables"
for %%f in (%folders%) do set "need_%%f=0"

:: First pass: determine which folders are needed
for %%f in ("%script_folder%*.*") do (
    if not "%%~nxf"=="%script_name%" (
        set "extension=%%~xf"
        set "extension=!extension:~1!"
        if not "!extension!"=="" call :SetFolder "!extension!"
    )
)

:: Create only the necessary folders
for %%f in (%folders%) do (
    if !need_%%f!==1 if not exist "%script_folder%%%f" mkdir "%script_folder%%%f"
)

:: Second pass: move files
for %%f in ("%script_folder%*.*") do (
    if not "%%~nxf"=="%script_name%" (
        set "extension=%%~xf"
        set "extension=!extension:~1!"
        if not "!extension!"=="" (
            call :SetFolder "!extension!"
            if defined folder (
                set "destination_file=%%~nxf"
                set "count=1"
                :loop
                if exist "!script_folder!!folder!\!destination_file!" (
                    set "destination_file=%%~nf_!count!%%~xf"
                    set /a count+=1
                    goto loop
                ) else (
                    echo Moving "%%f" to "!script_folder!!folder!\!destination_file!"
                    move "%%f" "!script_folder!!folder!\!destination_file!"
                )
            )
        ) else (
            echo Skipping file without extension: %%f
        )
    )
)

echo Done sorting files!
pause
exit /b

:SetFolder
set "ext=%~1"
set "folder="

:: Images
set "image_extensions=jpg jpeg png gif bmp tiff svg webp avif raw cr2 nef orf heic icns ico cur"
for %%i in (%image_extensions%) do if /i "%ext%"=="%%i" set "folder=Images" & set "need_Images=1"

:: Videos
set "video_extensions=mp4 avi mkv mov wmv flv webm mpeg mpg 3gp mts srt"
for %%i in (%video_extensions%) do if /i "%ext%"=="%%i" set "folder=Videos" & set "need_Videos=1"

:: Audio
set "audio_extensions=mp3 wav aac flac ogg wma m4a ac3 dts mid"
for %%i in (%audio_extensions%) do if /i "%ext%"=="%%i" set "folder=Audio" & set "need_Audio=1"

:: Documents
set "doc_extensions=pdf doc docx xls xlsx ppt pptx txt rtf md csv ods odp epub mobi azw djvu"
for %%i in (%doc_extensions%) do if /i "%ext%"=="%%i" set "folder=Documents" & set "need_Documents=1"

:: Design
set "design_extensions=psd ai fig sketch free indd xd cdr afdesign afphoto xcf kra lottie"
for %%i in (%design_extensions%) do if /i "%ext%"=="%%i" set "folder=Design" & set "need_Design=1"

:: Archives
set "archive_extensions=zip rar 7z tar gz bz2 lz zst"
for %%i in (%archive_extensions%) do if /i "%ext%"=="%%i" set "folder=Archives" & set "need_Archives=1"

:: Code
set "code_extensions=py rb php swift go c cpp h hpp java rs"
for %%i in (%code_extensions%) do if /i "%ext%"=="%%i" set "folder=Code" & set "need_Code=1"

:: Executables
set "exe_extensions=exe bat sh jar class msi"
for %%i in (%exe_extensions%) do if /i "%ext%"=="%%i" set "folder=Executables" & set "need_Executables=1"

:: Fonts
set "font_extensions=ttf otf woff woff2 eot"
for %%i in (%font_extensions%) do if /i "%ext%"=="%%i" set "folder=Fonts" & set "need_Fonts=1"

:: Web
set "web_extensions=html css js xml json yaml ts"
for %%i in (%web_extensions%) do if /i "%ext%"=="%%i" set "folder=Web" & set "need_Web=1"

:: 3D Models
set "model_extensions=obj stl fbx dae gltf ply 3ds usdz blend ma"
for %%i in (%model_extensions%) do if /i "%ext%"=="%%i" set "folder=3DModels" & set "need_3DModels=1"

:: Miscellaneous
set "misc_extensions=torrent iso img"
for %%i in (%misc_extensions%) do if /i "%ext%"=="%%i" set "folder=Miscellaneous" & set "need_Miscellaneous=1"

exit /b
