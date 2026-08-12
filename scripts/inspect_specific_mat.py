import pymupdf as fitz
import os

mat_pdf = r"C:\Users\burak\Desktop\mat.pdf"
doc = fitz.open(mat_pdf)

print(f"mat.pdf has {len(doc)} pages.")

# Let's check text / content on pages 5 to 65
for i in range(len(doc)):
    page_num = i + 1
    # Check if page has embedded image and dimensions
    imgs = doc[i].get_images()
    rect = doc[i].rect
    print(f"Page {page_num:02d}: rect={rect}, images={len(imgs)}")
