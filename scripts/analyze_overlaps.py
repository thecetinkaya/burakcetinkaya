import sys
import os

# Reconfigure stdout to UTF-8
sys.stdout.reconfigure(encoding='utf-8')
sys.path.append(r"C:\Users\burak\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0\LocalCache\local-packages\Python313\site-packages")

import pymupdf as fitz
from PIL import Image
import easyocr
import re
import numpy as np

mat_pdf_path = r"C:\Users\burak\Desktop\mat.pdf"
tr_pdf_path = r"C:\Users\burak\Desktop\tr.pdf"

print("Initializing EasyOCR for text overlap analysis...")
reader = easyocr.Reader(['tr', 'en'], gpu=False)

def analyze_pdf_texts(pdf_path, name):
    doc = fitz.open(pdf_path)
    print(f"\n=======================================================")
    print(f"   TEXT OVERLAP AUDIT OF {name} ({len(doc)} pages)")
    print(f"=======================================================\n")
    
    pages_ocr = {}
    
    for i in range(len(doc)):
        p_num = i + 1
        page = doc[i]
        pix = page.get_pixmap(dpi=150)
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        
        temp_file = f"_temp_ocr_{p_num}.png"
        img.save(temp_file)
        
        results = reader.readtext(temp_file)
        if os.path.exists(temp_file):
            os.remove(temp_file)
            
        lines = []
        for (bbox, text, prob) in results:
            y1 = int(bbox[0][1])
            y2 = int(bbox[2][1])
            lines.append((y1, y2, text.strip()))
            
        lines.sort(key=lambda item: item[0])
        pages_ocr[p_num] = lines
        
        soru_headers = [t for _,_,t in lines if "soru no" in t.lower()]
        options_found = [t for _,_,t in lines if re.match(r"^[A-E][\.\)]", t)]
        print(f"Page {p_num:02d}: Headers={soru_headers}, Options={options_found}")
        
    return pages_ocr

print("Analyzing mat.pdf text...")
mat_ocr = analyze_pdf_texts(mat_pdf_path, "mat.pdf")

print("\nAnalyzing tr.pdf text...")
tr_ocr = analyze_pdf_texts(tr_pdf_path, "tr.pdf")
