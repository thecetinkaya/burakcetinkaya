import pymupdf as fitz
from PIL import Image
import os

mat_pdf_path = r"C:\Users\burak\Desktop\mat.pdf"
tr_pdf_path = r"C:\Users\burak\Desktop\tr.pdf"

mat_dump_dir = r"c:\Users\burak\Desktop\burakcetinkaya-main\scripts\pdf_pages_mat"
tr_dump_dir = r"c:\Users\burak\Desktop\burakcetinkaya-main\scripts\pdf_pages_tr"

os.makedirs(mat_dump_dir, exist_ok=True)
os.makedirs(tr_dump_dir, exist_ok=True)

def dump_pdf_pages(pdf_path, out_dir, prefix):
    doc = fitz.open(pdf_path)
    print(f"Dumping {prefix} ({len(doc)} pages)...")
    for i in range(len(doc)):
        page = doc[i]
        pix = page.get_pixmap(dpi=150)
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        img.save(os.path.join(out_dir, f"{prefix}_page_{i+1:02d}.png"))

dump_pdf_pages(mat_pdf_path, mat_dump_dir, "mat")
dump_pdf_pages(tr_pdf_path, tr_dump_dir, "tr")
print("Dump completed!")
