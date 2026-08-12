from PIL import Image
import pymupdf as fitz
import numpy as np
import os

mat_pdf_path = r"C:\Users\burak\Desktop\mat.pdf"
doc_mat = fitz.open(mat_pdf_path)

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

def find_option_a_row(card_img):
    # Option A) is located near left margin (x from 40 to 140)
    arr = np.array(card_img.convert("L"))
    h, w = arr.shape
    
    # Crop left strip where A), B), C), D), E) appear
    left_strip = arr[:, 30:120]
    
    # Find rows where dark text appears (pixel < 120)
    dark_rows = np.where(left_strip.min(axis=1) < 120)[0]
    
    # We look for option A) which appears in the bottom half of the card (y > h * 0.3)
    candidates = [r for r in dark_rows if r > h * 0.25]
    if len(candidates) > 0:
        # Group contiguous rows
        groups = []
        curr = [candidates[0]]
        for r in candidates[1:]:
            if r == curr[-1] + 1:
                curr.append(r)
            else:
                groups.append(curr)
                curr = [r]
        groups.append(curr)
        
        # Return top of the first text block in bottom half (Option A)
        return groups[0][0]
        
    return int(h * 0.6)

# Test on Q24 (Page 48 & Page 47)
card48 = extract_modal_card(render_page(doc_mat, 48))
card47 = extract_modal_card(render_page(doc_mat, 47))

y48 = find_option_a_row(card48)
y47 = find_option_a_row(card47)

print("Q24 Card 48 Option A row:", y48)
print("Q24 Card 47 Option A row:", y47)

crop48 = card48.crop((0, 0, card48.width, max(0, y48 - 15)))
crop47 = card47.crop((0, max(0, y47 - 15), card47.width, card47.height))

dst_w = max(crop48.width, crop47.width)
dst_h = crop48.height + crop47.height

dst = Image.new("RGB", (dst_w, dst_h), (255, 255, 255))
dst.paste(crop48, ((dst_w - crop48.width) // 2, 0))
dst.paste(crop47, ((dst_w - crop47.width) // 2, crop48.height))

dst.save(r"c:\Users\burak\Desktop\burakcetinkaya-main\scripts\q24_pixel_perfect.png")
print("Saved q24_pixel_perfect.png!")
