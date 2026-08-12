import pymupdf as fitz
from PIL import Image, ImageChops
import easyocr
import re
import os
import numpy as np

mat_pdf_path = r"C:\Users\burak\Desktop\mat.pdf"
tr_pdf_path = r"C:\Users\burak\Desktop\tr.pdf"

out_mat_dir = r"c:\Users\burak\Desktop\burakcetinkaya-main\public\osym_deneme\mat"
out_tr_dir = r"c:\Users\burak\Desktop\burakcetinkaya-main\public\osym_deneme\tr"

os.makedirs(out_mat_dir, exist_ok=True)
os.makedirs(out_tr_dir, exist_ok=True)

print("Initializing EasyOCR reader...")
reader = easyocr.Reader(['tr', 'en'], gpu=False)

def render_pdf_page(doc, page_num, dpi=180):
    page = doc[page_num - 1]
    zoom = dpi / 72.0
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat, alpha=False)
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    return img

def scan_page_boxes(img):
    # Use EasyOCR to get bounding boxes of text elements
    img_np = np.array(img)
    results = reader.readtext(img_np)
    
    soru_no_boxes = [] # [(q_num, y_top, y_bottom)]
    cevap_boxes = []  # [(ans_letter, y_top, y_bottom)]
    
    for (bbox, text, prob) in results:
        # bbox is [[x1,y1], [x2,y1], [x2,y2], [x1,y2]]
        y1 = int(bbox[0][1])
        y2 = int(bbox[2][1])
        
        # Check for Soru No: XX
        match_soru = re.search(r"Soru\s*No[:\.]?\s*(\d+)", text, re.IGNORECASE)
        if match_soru:
            q_num = int(match_soru.group(1))
            soru_no_boxes.append((q_num, y1, y2))
            
        # Check for Cevap Anahtarı: X
        match_ans = re.search(r"Cevap\s*Anahtar[ıi][:\.]?\s*([A-E])", text, re.IGNORECASE)
        if match_ans:
            ans_letter = match_ans.group(1).upper()
            cevap_boxes.append((ans_letter, y1, y2))
            
    return soru_no_boxes, cevap_boxes

# Test run on pages 1 to 5
print("Scanning mat.pdf page 55...")
doc_mat = fitz.open(mat_pdf_path)
img55 = render_pdf_page(doc_mat, 55)
s_boxes, c_boxes = scan_page_boxes(img55)
print("Page 55 Soru No boxes:", s_boxes)
print("Page 55 Cevap boxes:", c_boxes)
