from PIL import Image
import os
import numpy as np

mat_dir = r"c:\Users\burak\Desktop\burakcetinkaya-main\scripts\pdf_pages_mat"

def analyze_page_lines(img_path):
    img = Image.open(img_path).convert("L")
    arr = np.array(img)
    h, w = arr.shape
    
    # Horizontal lines often have dark pixels spanning across x = 200 to w-200
    # Let's find rows with high variance or dark pixel patterns
    row_means = arr.mean(axis=1)
    row_mins = arr.min(axis=1)
    
    # Look for rows where minimum pixel is < 100 (dark) and mean is light
    dark_rows = np.where((row_mins < 80) & (row_means > 180))[0]
    
    print(f"{os.path.basename(img_path)} ({w}x{h}): Dark rows count = {len(dark_rows)}")
    if len(dark_rows) > 0:
        print(f"  First dark row: {dark_rows[0]}, Last dark row: {dark_rows[-1]}")

files = sorted(os.listdir(mat_dir))[:15]
for f in files:
    analyze_page_lines(os.path.join(mat_dir, f))
