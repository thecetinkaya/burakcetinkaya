import sys
import os

sys.stdout.reconfigure(encoding='utf-8')
sys.path.append(r"C:\Users\burak\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0\LocalCache\local-packages\Python313\site-packages")

import pymupdf as fitz
from PIL import Image
import easyocr
import re
import numpy as np

mat_pdf_path = r"C:\Users\burak\Desktop\mat.pdf"
doc_mat = fitz.open(mat_pdf_path)

reader = easyocr.Reader(['tr', 'en'], gpu=False)

def render_page(doc, page_num, dpi=180):
    page = doc[page_num - 1]
    zoom = dpi / 72.0
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat, alpha=False)
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    return img

def extract_modal_card(img, padding=12):
    arr = np.array(img.convert("L"))
    h, w = arr.shape
    
    non_white_rows = np.where(arr.min(axis=1) < 240)[0]
    non_white_cols = np.where(arr.min(axis=0) < 240)[0]
    
    if len(non_white_rows) == 0 or len(non_white_cols) == 0:
        return img
    
    y_min = max(0, non_white_rows[0] - padding)
    y_max = min(h, non_white_rows[-1] + padding)
    x_min = max(0, non_white_cols[0] - padding)
    x_max = min(w, non_white_cols[-1] + padding)
    
    return img.crop((x_min, y_min, x_max, y_max))

# Page 48 (Top view of Q24) and Page 47 (Bottom view of Q24)
card48 = extract_modal_card(render_page(doc_mat, 48)) # Top view
card47 = extract_modal_card(render_page(doc_mat, 47)) # Bottom view

# Let's run EasyOCR on card48 to find Y-coordinate of "A) 600" or options start
card48.save("_temp_c48.png")
res48 = reader.readtext("_temp_c48.png")
if os.path.exists("_temp_c48.png"):
    os.remove("_temp_c48.png")

opt_y_c48 = None
for (bbox, text, prob) in res48:
    if re.search(r"^A[\.\)]", text.strip(), re.IGNORECASE):
        opt_y_c48 = int(bbox[0][1])
        print(f"Card 48: Option A) found at Y={opt_y_c48} ('{text}')")
        break

# Let's run EasyOCR on card47 to find Y-coordinate of "A) 600"
card47.save("_temp_c47.png")
res47 = reader.readtext("_temp_c47.png")
if os.path.exists("_temp_c47.png"):
    os.remove("_temp_c47.png")

opt_y_c47 = None
for (bbox, text, prob) in res47:
    if re.search(r"^A[\.\)]", text.strip(), re.IGNORECASE):
        opt_y_c47 = int(bbox[0][1])
        print(f"Card 47: Option A) found at Y={opt_y_c47} ('{text}')")
        break

if opt_y_c48 and opt_y_c47:
    # Crop Card 48 from top (y=0) down to just before Option A) (opt_y_c48 - 5)
    cropped_statement = card48.crop((0, 0, card48.width, opt_y_c48 - 5))

    # Crop Card 47 from Option A) (opt_y_c47 - 5) down to bottom (y=card47.height)
    cropped_options = card47.crop((0, opt_y_c47 - 5, card47.width, card47.height))

    # Stitch cropped_statement + cropped_options vertically
    dst_w = max(cropped_statement.width, cropped_options.width)
    dst_h = cropped_statement.height + cropped_options.height

    q24_smart = Image.new("RGB", (dst_w, dst_h), (255, 255, 255))
    q24_smart.paste(cropped_statement, ((dst_w - cropped_statement.width) // 2, 0))
    q24_smart.paste(cropped_options, ((dst_w - cropped_options.width) // 2, cropped_statement.height))

    q24_smart.save(r"c:\Users\burak\Desktop\burakcetinkaya-main\scripts\q24_perfect_smart.png")
    print(f"Saved q24_perfect_smart.png! Size: {q24_smart.size}")
else:
    print("Option A) Y-coordinates not found!")
