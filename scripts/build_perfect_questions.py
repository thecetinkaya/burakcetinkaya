import pymupdf as fitz
from PIL import Image
import os
import numpy as np

mat_pdf_path = r"C:\Users\burak\Desktop\mat.pdf"
tr_pdf_path = r"C:\Users\burak\Desktop\tr.pdf"

out_mat_dir = r"c:\Users\burak\Desktop\burakcetinkaya-main\public\osym_deneme\mat"
out_tr_dir = r"c:\Users\burak\Desktop\burakcetinkaya-main\public\osym_deneme\tr"

os.makedirs(out_mat_dir, exist_ok=True)
os.makedirs(out_tr_dir, exist_ok=True)

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

def stitch_images(img_list):
    if not img_list:
        return None
    if len(img_list) == 1:
        return img_list[0]
    
    total_height = sum(img.height for img in img_list)
    max_width = max(img.width for img in img_list)
    
    dst = Image.new('RGB', (max_width, total_height), (255, 255, 255))
    current_y = 0
    for img in img_list:
        offset_x = (max_width - img.width) // 2
        dst.paste(img, (offset_x, current_y))
        current_y += img.height
    return dst

# ─────────────────────────────────────────────────────────────────────────────
# 1. MATEMATİK & GEOMETRİ (50 QUESTIONS) COMPLETE MAPPING
# ─────────────────────────────────────────────────────────────────────────────
mat_mapping = {
    1: [64],
    2: [64],
    3: [63],
    4: [62],
    5: [62],
    6: [61],
    7: [61],
    8: [60, 59],
    9: [59],
    10: [58],
    11: [58],
    12: [57],
    13: [57],
    14: [56, 55],
    15: [56],
    16: [55],
    17: [55, 54],
    18: [54],
    19: [53],
    20: [52],
    21: [51],
    22: [50],
    23: [49],
    24: [48, 47],
    25: [46, 45, 44],
    26: [43, 42, 41],
    27: [40, 39, 38],
    28: [37, 36],
    29: [35],
    30: [35],
    31: [34],
    32: [33],
    33: [32],
    34: [31, 30],
    35: [29, 28],
    36: [27, 26],
    37: [25, 24],
    38: [23, 22],
    39: [21, 20, 19],
    40: [18, 17],
    41: [16, 15],
    42: [14, 13],
    43: [12, 11],
    44: [10],
    45: [9],
    46: [8],
    47: [7, 6],
    48: [5],
    49: [4, 3, 2],
    50: [1, 65]
}

# ─────────────────────────────────────────────────────────────────────────────
# 2. TÜRKÇE & SÖZEL MANTIK (50 QUESTIONS) COMPLETE MAPPING
# ─────────────────────────────────────────────────────────────────────────────
tr_mapping = {
    1: [77],
    2: [76],
    3: [76],
    4: [75],
    5: [74],
    6: [73],
    7: [72],
    8: [71, 70],
    9: [69, 68],
    10: [67, 66],
    11: [65, 64],
    12: [63, 62],
    13: [61, 60],
    14: [59, 58],
    15: [57, 56],
    16: [55, 54],
    17: [53],
    18: [52],
    19: [51, 50],
    20: [49, 48],
    21: [47],
    22: [46, 45],
    23: [44, 43],
    24: [42, 41],
    25: [40, 39],
    26: [38, 37],
    27: [36, 35],
    28: [34],
    29: [33, 32],
    30: [31, 30],
    31: [29, 28],
    32: [27, 26],
    33: [25, 24, 23],
    34: [22, 21, 20],
    35: [19, 18, 17],
    36: [16, 15, 14],
    37: [13, 12, 11],
    38: [10, 9, 8],
    39: [10, 9],
    40: [7],
    41: [7],
    42: [7],
    43: [6, 5],
    44: [4],
    45: [4],
    46: [4],
    47: [3, 2],
    48: [1],
    49: [1],
    50: [77]
}

doc_mat = fitz.open(mat_pdf_path)
doc_tr = fitz.open(tr_pdf_path)

def process_and_save_perfect(doc, mapping, out_dir, prefix):
    for q_id, pages in mapping.items():
        img_parts = []
        for p in pages:
            if p > len(doc):
                continue
            raw = render_page(doc, p)
            card = extract_modal_card(raw)
            img_parts.append(card)
            
        stitched = stitch_images(img_parts)
        if stitched:
            save_path = os.path.join(out_dir, f"{prefix}_{q_id}.png")
            stitched.save(save_path, "PNG", optimize=True)
            print(f"Perfect Saved: {prefix}_{q_id}.png ({stitched.width}x{stitched.height})")

print("Processing ALL 50 Matematik questions with FULL modal cards...")
process_and_save_perfect(doc_mat, mat_mapping, out_mat_dir, "mat")

print("\nProcessing ALL 50 Türkçe questions with FULL modal cards...")
process_and_save_perfect(doc_tr, tr_mapping, out_tr_dir, "tr")

print("\nFinished building ALL 100 PERFECT question images!")
