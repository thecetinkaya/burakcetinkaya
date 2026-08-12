import sys
import pymupdf as fitz
from PIL import Image
import os

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

# ─────────────────────────────────────────────────────────────────────────────
# 1. MATEMATİK & GEOMETRİ (50 QUESTIONS) MAPPING
# ─────────────────────────────────────────────────────────────────────────────
mat_mapping = {
    1: [(64, "bottom")],
    2: [(64, "top")],
    3: [(63, "full")],
    4: [(62, "bottom")],
    5: [(62, "top")],
    6: [(61, "bottom")],
    7: [(61, "top")],
    8: [(60, "full"), (59, "bottom")],
    9: [(59, "top")],
    10: [(58, "bottom")],
    11: [(58, "top")],
    12: [(57, "bottom")],
    13: [(57, "top")],
    14: [(56, "bottom")],
    15: [(56, "top")],
    16: [(55, "bottom")],
    17: [(55, "top")],
    18: [(54, "full")],
    19: [(53, "full")],
    20: [(52, "full")],
    21: [(51, "full")],
    22: [(50, "full")],
    23: [(49, "full")],
    24: [(48, "full"), (47, "full")],
    25: [(46, "full"), (45, "full"), (44, "full")],
    26: [(43, "full"), (42, "full"), (41, "full")],
    27: [(40, "full"), (39, "full"), (38, "full")],
    28: [(37, "full"), (36, "full")],
    29: [(35, "bottom")],
    30: [(35, "top")],
    31: [(34, "full")],
    32: [(33, "full")],
    33: [(32, "full")],
    34: [(31, "full"), (30, "full")],
    35: [(29, "full"), (28, "full")],
    36: [(27, "full"), (26, "full")],
    37: [(25, "full"), (24, "full")],
    38: [(23, "full"), (22, "full")],
    39: [(21, "full"), (20, "full"), (19, "full")],
    40: [(18, "full"), (17, "full")],
    41: [(16, "full"), (15, "full")],
    42: [(14, "full"), (13, "full")],
    43: [(12, "full"), (11, "full")],
    44: [(10, "full")],
    45: [(9, "full")],
    46: [(8, "full")],
    47: [(7, "full"), (6, "full")],
    48: [(5, "full")],
    49: [(4, "full"), (3, "full"), (2, "full")],
    50: [(1, "full"), (65, "full")]
}

# ─────────────────────────────────────────────────────────────────────────────
# 2. TÜRKÇE & SÖZEL MANTIK (50 QUESTIONS) MAPPING
# ─────────────────────────────────────────────────────────────────────────────
tr_mapping = {
    1: [(77, "top")],
    2: [(76, "bottom")],
    3: [(76, "top")],
    4: [(75, "full")],
    5: [(74, "full")],
    6: [(73, "full")],
    7: [(72, "full")],
    8: [(71, "full"), (70, "full")],
    9: [(69, "full"), (68, "full")],
    10: [(67, "full"), (66, "full")],
    11: [(65, "full"), (64, "full")],
    12: [(63, "full"), (62, "full")],
    13: [(61, "full"), (60, "full")],
    14: [(59, "full"), (58, "full")],
    15: [(57, "full"), (56, "full")],
    16: [(55, "full"), (54, "full")],
    17: [(53, "full")],
    18: [(52, "full")],
    19: [(51, "full"), (50, "full")],
    20: [(49, "full"), (48, "full")],
    21: [(47, "full")],
    22: [(46, "full"), (45, "full")],
    23: [(44, "full"), (43, "full")],
    24: [(42, "full"), (41, "full")],
    25: [(40, "full"), (39, "full")],
    26: [(38, "full"), (37, "full")],
    27: [(36, "full"), (35, "full")],
    28: [(34, "full")],
    29: [(33, "full"), (32, "full")],
    30: [(31, "full"), (30, "full")],
    31: [(29, "full"), (28, "full")],
    32: [(27, "full"), (26, "full")],
    33: [(25, "full"), (24, "full"), (23, "full")],
    34: [(22, "full"), (21, "full"), (20, "full")],
    35: [(19, "full"), (18, "full"), (17, "full")],
    36: [(16, "full"), (15, "full"), (14, "full")],
    37: [(13, "full"), (12, "full"), (11, "full")],
    38: [(10, "full"), (9, "full"), (8, "full")],
    39: [(10, "full"), (9, "full")],
    40: [(7, "top")],
    41: [(7, "middle")],
    42: [(7, "bottom")],
    43: [(6, "full"), (5, "full")],
    44: [(4, "bottom")],
    45: [(4, "top")],
    46: [(4, "middle")],
    47: [(3, "full"), (2, "full")],
    48: [(1, "bottom")],
    49: [(1, "top")],
    50: [(77, "bottom")]
}

def crop_smart(img, region):
    w, h = img.size
    if region == "top":
        return img.crop((0, 0, w, int(h * 0.50)))
    elif region == "bottom":
        return img.crop((0, int(h * 0.48), w, h))
    elif region == "middle":
        return img.crop((0, int(h * 0.30), w, int(h * 0.70)))
    return img

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

doc_mat = fitz.open(mat_pdf_path)
doc_tr = fitz.open(tr_pdf_path)

def process_and_save(doc, mapping, out_dir, prefix):
    for q_id, parts in mapping.items():
        img_parts = []
        for page_num, region in parts:
            if page_num > len(doc):
                continue
            raw_img = render_page(doc, page_num)
            cropped_img = crop_smart(raw_img, region)
            img_parts.append(cropped_img)
        
        stitched = stitch_images(img_parts)
        if stitched:
            save_path = os.path.join(out_dir, f"{prefix}_{q_id}.png")
            stitched.save(save_path, "PNG", optimize=True)
            print(f"Stitched & Saved: {prefix}_{q_id}.png ({stitched.width}x{stitched.height})")

print("Processing Matematik questions...")
process_and_save(doc_mat, mat_mapping, out_mat_dir, "mat")

print("Processing Türkçe questions...")
process_and_save(doc_tr, tr_mapping, out_tr_dir, "tr")

print("Done processing all 100 questions!")
