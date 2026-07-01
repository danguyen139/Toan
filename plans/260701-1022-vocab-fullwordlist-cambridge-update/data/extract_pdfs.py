"""Phase 1 Step 0: Extract text from Cambridge PDFs using pypdf."""
import pypdf
import os
import json

DATA_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(DATA_DIR)))

def extract_pdf(pdf_path, output_path):
    """Extract all text from a PDF, page by page."""
    reader = pypdf.PdfReader(pdf_path)
    lines = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        lines.append(f"=== PAGE {i+1} ===")
        if text:
            lines.append(text)
        else:
            lines.append("(no text extracted)")
        lines.append("")
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print(f"Extracted {len(reader.pages)} pages -> {output_path}")
    return len(reader.pages)

# Extract Starters PDF (506166)
starters_pdf = os.path.join(REPO_ROOT, "506166-starters-movers-flyers-word-list-2025.pdf")
starters_txt = os.path.join(DATA_DIR, "starters.txt")
# Check if PDF exists; if not, note it
if os.path.exists(starters_pdf):
    pages = extract_pdf(starters_pdf, starters_txt)
    print(f"Starters: {pages} pages extracted")
else:
    print(f"Starters PDF not found at: {starters_pdf}")
    print("Will need to download from: https://www.cambridgeenglish.org/Images/506166-starters-movers-flyers-word-list-2025.pdf")

# Extract A2 Key PDF (506886)
a2key_pdf = os.path.join(REPO_ROOT, "506886-a2-key-2020-vocabulary-list.pdf")
a2key_txt = os.path.join(DATA_DIR, "a2key.txt")
if os.path.exists(a2key_pdf):
    pages = extract_pdf(a2key_pdf, a2key_txt)
    print(f"A2 Key: {pages} pages extracted")
else:
    print(f"A2 Key PDF not found at: {a2key_pdf}")

# Save metadata about sources
metadata = {
    "starters_pdf_url": "https://www.cambridgeenglish.org/Images/506166-starters-movers-flyers-word-list-2025.pdf",
    "a2key_pdf_url": "https://www.cambridgeenglish.org/images/506886-a2-key-2020-vocabulary-list.pdf",
    "extracted_at": "2026-07-01",
    "starters_pdf_exists": os.path.exists(starters_pdf),
    "a2key_pdf_exists": os.path.exists(a2key_pdf)
}
with open(os.path.join(DATA_DIR, "metadata.json"), 'w', encoding='utf-8') as f:
    json.dump(metadata, f, indent=2, ensure_ascii=False)
print("Metadata saved to metadata.json")
