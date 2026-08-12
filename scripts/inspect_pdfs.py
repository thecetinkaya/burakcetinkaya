import fitz  # PyMuPDF
import re
import os

mat_pdf = r"C:\Users\burak\Desktop\mat.pdf"
tr_pdf = r"C:\Users\burak\Desktop\tr.pdf"

def inspect_pdf(pdf_path, name):
    doc = fitz.open(pdf_path)
    print(f"=== {name} ({len(doc)} pages) ===")
    questions_found = {}
    for i, page in enumerate(doc):
        text = page.get_text()
        matches = re.findall(r"Soru\s+No:\s*(\d+)", text, re.IGNORECASE)
        ans_match = re.search(r"Cevap\s+Anahtarı:\s*([A-E])", text, re.IGNORECASE)
        ans = ans_match.group(1) if ans_match else ""
        print(f"Page {i+1}: Questions={matches}, Ans={ans}")
        for q in matches:
            q_num = int(q)
            if q_num not in questions_found:
                questions_found[q_num] = []
            questions_found[q_num].append((i+1, ans))
    
    print(f"\nTotal unique question numbers found in {name}: {sorted(questions_found.keys())}")
    return questions_found

print("Inspecting PDFs...")
mat_q = inspect_pdf(mat_pdf, "mat.pdf")
tr_q = inspect_pdf(tr_pdf, "tr.pdf")
