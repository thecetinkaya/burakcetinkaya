import pymupdf as fitz
from PIL import Image
import os

mat_pdf = r"C:\Users\burak\Desktop\mat.pdf"
tr_pdf = r"C:\Users\burak\Desktop\tr.pdf"

doc_mat = fitz.open(mat_pdf)
print(f"mat.pdf has {len(doc_mat)} pages.")

# Let's inspect page 55 of mat.pdf (which has Soru 17 and Soru 16)
page55 = doc_mat[54] # 0-indexed -> 55
pix = page55.get_pixmap(dpi=150)
img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
print("Page 55 dimensions:", img.size)

# Let's check where black lines / headers appear on page 55
img.save(r"c:\Users\burak\Desktop\burakcetinkaya-main\scripts\page55.png")
print("Saved page55.png")
