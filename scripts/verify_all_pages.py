import sys
sys.path.append(r"C:\Users\burak\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0\LocalCache\local-packages\Python313\site-packages")

import pymupdf as fitz
from PIL import Image
import easyocr
import re
import os

print("Initializing EasyOCR...")
reader = easyocr.Reader(['tr', 'en'], gpu=False)

def analyze_pdf_full(pdf_path, name):
    doc = fitz.open(pdf_path)
    print(f"\n=======================================================")
    print(f"   FULL AUDIT OF {name} ({len(doc)} pages)")
    print(f"=======================================================\n")
    
    page_data = {}
    q_to_pages = {}
    
    for i in range(len(doc)):
        page_num = i + 1
        page = doc[i]
        pix = page.get_pixmap(dpi=150)
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        
        # Save temp image for easyocr
        temp_path = f"_temp_audit_{name}_{page_num}.png"
        img.save(temp_path)
        
        results = reader.readtext(temp_path)
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        found_soru = []
        found_ans = []
        
        for (bbox, text, prob) in results:
            y1 = int(bbox[0][1])
            m_soru = re.search(r"Soru\s*No[:\.]?\s*(\d+)", text, re.IGNORECASE)
            if m_soru:
                q_num = int(m_soru.group(1))
                found_soru.append((q_num, y1))
                if q_num not in q_to_pages:
                    q_to_pages[q_num] = []
                q_to_pages[q_num].append((page_num, y1, "SoruNo"))
                
            m_ans = re.search(r"Cevap\s*Anahtar[ıi][:\.]?\s*([A-E])", text, re.IGNORECASE)
            if m_ans:
                ans_let = m_ans.group(1).upper()
                found_ans.append((ans_let, y1))
                
        print(f"Page {page_num:02d}: Questions found -> {[q for q,_ in found_soru]}, Answers -> {[a for a,_ in found_ans]}")
        page_data[page_num] = {"soru": found_soru, "ans": found_ans}

    print("\n--- Question Page Mapping Summary ---")
    for q_num in sorted(q_to_pages.keys()):
        pages = q_to_pages[q_num]
        print(f"Question {q_num:02d}: Pages -> {pages}")
        
    return page_data, q_to_pages

mat_pdf_path = r"C:\Users\burak\Desktop\mat.pdf"
tr_pdf_path = r"C:\Users\burak\Desktop\tr.pdf"

print("Auditing mat.pdf...")
analyze_pdf_full(mat_pdf_path, "mat.pdf")

print("Auditing tr.pdf...")
analyze_pdf_full(tr_pdf_path, "tr.pdf")
