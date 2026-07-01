"""Phase 3: Generate A2 Key JS files with Vietnamese translations."""
import json, os, re

D = os.path.dirname(os.path.abspath(__file__))
JS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(D))), 'js')

# Load existing 172 translations as seed
orig_path = os.path.join(JS_DIR, 'vocab-data-a2key.js')
existing = {}
if os.path.exists(orig_path):
    with open(orig_path,'r',encoding='utf-8') as f:
        orig = f.read()
    for m in re.finditer(r'''en:\s*["'](.+?)["'],\s*vi:\s*["'](.+?)["']''', orig):
        existing[m.group(1).lower()] = m.group(2)
    print(f"Loaded {len(existing)} existing A2 Key translations")

# Load extracted entries
with open(os.path.join(D,'a2key-extracted.json'),'r',encoding='utf-8') as f:
    data = json.load(f)
entries = data['entries']
print(f"Loaded {len(entries)} A2 Key extracted entries")

# Map existing translations
matched = 0
new_count = 0
for e in entries:
    el = e['en'].lower()
    if el in existing:
        e['vi'] = existing[el]
        matched += 1
    else:
        e['vi'] = None  # needs translation
        new_count += 1

print(f"Matched: {matched}, Needs translation: {new_count}")

# A2 Key category mapping for file grouping
cats = {}
for e in entries:
    c = e['category']
    if c not in cats: cats[c] = []
    cats[c].append(e)

print(f"\nCategories ({len(cats)}):")
for c, items in sorted(cats.items(), key=lambda x: -len(x[1])):
    untrans = sum(1 for e in items if e['vi'] is None)
    print(f"  {c}: {len(items)} words ({untrans} untranslated)")

# Count untranslated
total_untrans = sum(1 for e in entries if e['vi'] is None)
print(f"\nTotal untranslated: {total_untrans}")
