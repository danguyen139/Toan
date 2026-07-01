"""Phase 2 verification: fidelity check + duplicate check."""
import re, os, json

JS_DIR = r'C:\DATA\Family\Toan\js'

# Load original 172 entries
orig_path = os.path.join(JS_DIR, 'vocab-data-starters.js')
with open(orig_path,'r',encoding='utf-8') as f:
    orig = f.read()
old_entries = {}
for m in re.finditer(r"en:\s*'(.+?)',\s*vi:\s*'(.+?)'", orig):
    old_entries[m.group(1).lower()] = m.group(2)

# Load new files
new_entries = {}
new_files = sorted([f for f in os.listdir(JS_DIR) if f.startswith('vocab-data-starters-')])
for fn in new_files:
    with open(os.path.join(JS_DIR, fn), 'r', encoding='utf-8') as f:
        content = f.read()
    for m in re.finditer(r"en:\s*'(.+?)',\s*vi:\s*'(.+?)'", content):
        en = m.group(1).lower()
        vi = m.group(2)
        if en in new_entries:
            print(f"DUPLICATE en='{en}' in files!")
        new_entries[en] = {'vi': vi, 'file': fn}

# Fidelity check
diffs = []
for en, old_vi in old_entries.items():
    if en in new_entries:
        new_vi = new_entries[en]['vi']
        if old_vi != new_vi:
            diffs.append(f"  CHANGED: '{en}': '{old_vi}' -> '{new_vi}' (in {new_entries[en]['file']})")
    else:
        diffs.append(f"  MISSING: '{en}' (was in original, not in new)")

if diffs:
    print(f"\n{len(diffs)} fidelity issues:")
    for d in diffs[:30]:
        print(d)
    if len(diffs) > 30:
        print(f"  ... and {len(diffs)-30} more")
else:
    print("Fidelity check: ALL 172 existing words present and unchanged")

# Duplicate check
from collections import Counter
en_counts = Counter()
vi_counts = Counter()
for en, info in new_entries.items():
    en_counts[en] += 1
    vi_counts[info['vi']] += 1

dup_en = {k:v for k,v in en_counts.items() if v > 1}
dup_vi = {k:v for k,v in vi_counts.items() if v > 1}
if dup_en:
    print(f"\n{len(dup_en)} duplicate en (BAD): {list(dup_en.keys())[:10]}")
else:
    print("No duplicate en (OK)")
if dup_vi:
    print(f"{len(dup_vi)} duplicate vi pairs (noted but not errors): {list(dup_vi.keys())[:10]}")
else:
    print("No duplicate vi")

print(f"\nNew files: {len(new_files)}")
print(f"Total words: {len(new_entries)}")
