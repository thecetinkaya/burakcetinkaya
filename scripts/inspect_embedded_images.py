import pymupdf as fitz
from PIL import Image
import os
import io

mat_pdf_path = r"C:\Users\burak\Desktop\mat.pdf"
tr_pdf_path = r"C:\Users\burak\Desktop\tr.pdf"

def inspect_embedded(doc, name):
    print(f"=== {name} ===")
    for i in range(len(doc)):
        page = doc[i]
        img_list = page.get_images()
        print(f"Page {i+1}: {len(img_list)} images")

doc_mat = fitz.open(mat_pdf_path)
inspect_embedded(doc_mat, "mat.pdf")

doc_tr = fitz.open(tr_pdf_path)
inspect_embedded(doc_tr, "tr.pdf")
