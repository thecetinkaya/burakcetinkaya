import pymupdf as fitz
from PIL import Image
import os
import numpy as np

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

def find_header_footer_bounds(card_img):
    # Analyze card_img to locate the top dashed line (after Soru No:) and bottom dashed line (before Cevap Anahtarı:)
    arr = np.array(card_img.convert("L"))
    h, w = arr.shape
    
    row_means = arr.mean(axis=1)
    row_mins = arr.min(axis=1)
    
    # Top header line is usually in top 20% of card height (y from 30 to 120)
    top_region = row_mins[20:140]
    top_line_y = 70 # fallback
    if len(top_region) > 0:
        # Find row with lowest min pixel in top region
        min_idx = np.argmin(top_region)
        top_line_y = 20 + min_idx
        
    # Bottom footer line is usually in bottom 20% of card height (y from h-140 to h-20)
    bottom_region = row_mins[h-140:h-20]
    bottom_line_y = h - 70 # fallback
    if len(bottom_region) > 0:
        min_idx = np.argmin(bottom_region)
        bottom_line_y = (h - 140) + min_idx
        
    return top_line_y, bottom_line_y

def stitch_seamless(card_list):
    if not card_list:
        return None
    if len(card_list) == 1:
        return card_list[0]
    
    # card_list[0] is Top View (Page A)
    # card_list[-1] is Bottom View (Page B)
    # Intermediate cards if 3-part question
    
    cropped_parts = []
    
    for idx, card in enumerate(card_list):
        w, h = card.size
        top_y, bot_y = find_header_footer_bounds(card)
        
        if idx == 0:
            # First card: Keep header (y=0) down to just above footer/bottom
            # We crop from y=0 to bot_y (or near bottom)
            cropped = card.crop((0, 0, w, bot_y - 5))
        elif idx == len(card_list) - 1:
            # Last card: Crop out repeated top header (skip from 0 to top_y + 10) down to bottom (y=h)
            cropped = card.crop((0, top_y + 10, w, h))
        else:
            # Middle card: Crop out repeated top header AND bottom footer
            cropped = card.crop((0, top_y + 10, w, bot_y - 5))
            
        cropped_parts.append(cropped)
        
    # Combine cropped_parts vertically into ONE single card frame
    max_w = max(c.width for c in cropped_parts)
    total_h = sum(c.height for c in cropped_parts)
    
    dst = Image.new('RGB', (max_w, total_h), (255, 255, 255))
    curr_y = 0
    for c in cropped_parts:
        off_x = (max_w - c.width) // 2
        dst.paste(c, (off_x, curr_y))
        curr_y += c.height
        
    return dst

# Test on Question 8 (Page 60 & 59 of mat.pdf)
card60 = extract_modal_card(render_page(doc_mat, 60))
card59 = extract_modal_card(render_page(doc_mat, 59))
q8_seamless = stitch_seamless([card60, card59])
q8_seamless.save(r"c:\Users\burak\Desktop\burakcetinkaya-main\scripts\q8_seamless.png")
print(f"Q8 Seamless Saved! Size: {q8_seamless.size}")

# Test on Question 14 (Page 56 & 55 of mat.pdf)
card56 = extract_modal_card(render_page(doc_mat, 56))
card55 = extract_modal_card(render_page(doc_mat, 55))
q14_seamless = stitch_seamless([card56, card55])
q14_seamless.save(r"c:\Users\burak\Desktop\burakcetinkaya-main\scripts\q14_seamless.png")
print(f"Q14 Seamless Saved! Size: {q14_seamless.size}")
