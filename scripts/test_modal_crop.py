from PIL import Image
import os
import numpy as np
import pymupdf as fitz

mat_pdf_path = r"C:\Users\burak\Desktop\mat.pdf"
tr_pdf_path = r"C:\Users\burak\Desktop\tr.pdf"

doc_mat = fitz.open(mat_pdf_path)

def extract_modal_card(img, padding=10):
    # Convert to grayscale numpy array
    arr = np.array(img.convert("L"))
    h, w = arr.shape
    
    # Find rows and cols that are not white (pixel < 240)
    non_white_rows = np.where(arr.min(axis=1) < 240)[0]
    non_white_cols = np.where(arr.min(axis=0) < 240)[0]
    
    if len(non_white_rows) == 0 or len(non_white_cols) == 0:
        return img
    
    y_min = max(0, non_white_rows[0] - padding)
    y_max = min(h, non_white_rows[-1] + padding)
    x_min = max(0, non_white_cols[0] - padding)
    x_max = min(w, non_white_cols[-1] + padding)
    
    return img.crop((x_min, y_min, x_max, y_max))

# Test on pages 1 to 10 of mat.pdf
for i in range(10):
    page = doc_mat[i]
    pix = page.get_pixmap(dpi=180)
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    card = extract_modal_card(img)
    print(f"Page {i+1}: original {img.size} -> modal card {card.size}")
