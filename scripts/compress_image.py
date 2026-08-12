from PIL import Image
import os

img_path = r"c:\Users\burak\Desktop\burakcetinkaya-main\src\assets\profil-foto.jpeg"

if os.path.exists(img_path):
    img = Image.open(img_path)
    print("Original size:", os.path.getsize(img_path) / 1024, "KB")
    print("Original dimensions:", img.size)
    
    # Resize if larger than 800x800
    img.thumbnail((800, 800), Image.Resampling.LANCZOS)
    
    # Save optimized JPEG
    img.save(img_path, "JPEG", quality=82, optimize=True)
    print("New size:", os.path.getsize(img_path) / 1024, "KB")
else:
    print("File not found:", img_path)
