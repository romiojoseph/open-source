import os
import shutil

# Define the script's location and name
script_folder = os.path.dirname(os.path.abspath(__file__))
script_name = os.path.basename(__file__)

# Initialize variables to track which folders are needed
folders = ["Images", "Videos", "Audio", "Documents", "Design", "Archives", "Code", "Fonts", "Web", "3DModels", "Miscellaneous", "Executables"]
need_folders = {folder: False for folder in folders}

# Define the extensions for each folder
extensions = {
    "Images": ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "svg", "webp", "avif", "raw", "cr2", "nef", "orf", "heic", "icns", "ico", "cur"],
    "Videos": ["mp4", "avi", "mkv", "mov", "wmv", "flv", "webm", "mpeg", "mpg", "3gp", "mts", "srt"],
    "Audio": ["mp3", "wav", "aac", "flac", "ogg", "wma", "m4a", "ac3", "dts", "mid"],
    "Documents": ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "rtf", "md", "csv", "ods", "odp", "epub", "mobi", "azw", "djvu"],
    "Design": ["psd", "ai", "fig", "sketch", "free", "indd", "xd", "cdr", "afdesign", "afphoto", "xcf", "kra", "lottie"],
    "Archives": ["zip", "rar", "7z", "tar", "gz", "bz2", "lz", "zst"],
    "Code": ["py", "rb", "php", "swift", "go", "c", "cpp", "h", "hpp", "java", "rs"],
    "Executables": ["exe", "bat", "sh", "jar", "class", "msi"],
    "Fonts": ["ttf", "otf", "woff", "woff2", "eot"],
    "Web": ["html", "css", "js", "xml", "json", "yaml", "ts"],
    "3DModels": ["obj", "stl", "fbx", "dae", "gltf", "ply", "3ds", "usdz", "blend", "ma"],
    "Miscellaneous": ["torrent", "iso", "img"]
}

# First pass: determine which folders are needed
for file in os.listdir(script_folder):
    if file != script_name:
        extension = os.path.splitext(file)[1][1:].lower()
        if extension:
            for folder, exts in extensions.items():
                if extension in exts:
                    need_folders[folder] = True
                    break

# Create only the necessary folders
for folder in folders:
    if need_folders[folder]:
        folder_path = os.path.join(script_folder, folder)
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)

# Second pass: move files
for file in os.listdir(script_folder):
    if file != script_name:
        extension = os.path.splitext(file)[1][1:].lower()
        if extension:
            for folder, exts in extensions.items():
                if extension in exts:
                    destination_folder = os.path.join(script_folder, folder)
                    destination_file = os.path.join(destination_folder, file)
                    count = 1
                    while os.path.exists(destination_file):
                        name, ext = os.path.splitext(file)
                        destination_file = os.path.join(destination_folder, f"{name}_{count}{ext}")
                        count += 1
                    print(f"Moving {file} to {destination_file}")
                    shutil.move(os.path.join(script_folder, file), destination_file)
                    break
        else:
            print(f"Skipping file without extension: {file}")

print("Done sorting files!")