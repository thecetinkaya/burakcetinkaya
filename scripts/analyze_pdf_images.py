import pymupdf as fitz
import os

mat_pdf = r"C:\Users\burak\Desktop\mat.pdf"
tr_pdf = r"C:\Users\burak\Desktop\tr.pdf"

doc_mat = fitz.open(mat_pdf)
print("mat.pdf page count:", len(doc_mat))
page0 = doc_mat[0]
image_list = page0.get_images()
print("Page 1 images count:", len(image_list))
for img in image_list:
    xref = img[0]
    base_image = doc_mat.extract_image(xref)
    print("Image ext:", base_image["ext"], "dimensions:", base_image["width"], "x", base_image["height"])

doc_tr = fitz.open(tr_pdf)
print("tr.pdf page count:", len(doc_tr))
page0_tr = doc_tr[0]
image_list_tr = page0_tr.get_images()
print("TR Page 1 images count:", len(image_list_tr))
for img in image_list_tr:
    xref = img[0]
    base_image = doc_tr.extract_image(xref)
    print("Image ext:", base_image["ext"], "dimensions:", base_image["width"], "x", base_image["height"])
