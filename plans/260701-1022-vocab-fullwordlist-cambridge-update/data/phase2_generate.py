"""Phase 2: Generate Starters JS files from extracted JSON."""
import json, os, re

D = os.path.dirname(os.path.abspath(__file__))
JS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(D))), 'js')

with open(os.path.join(D,'starters-extracted.json'),'r',encoding='utf-8') as f:
    data = json.load(f)
entries = data['entries']
print(f"Loaded {len(entries)} entries")

# Group by category
cats = {}
for e in entries:
    c = e['category']
    if c not in cats: cats[c] = []
    cats[c].append(e)

print(f"Categories: {list(cats.keys())}")
for c, items in cats.items():
    print(f"  {c}: {len(items)}")

# Group categories into files (3-4 categories per file, <200 lines)
# Group logically: small cats together, large cats split
FILE_GROUPS = [
    (['animals','colours'], 'animals-colours'),
    (['family','body','clothes'], 'family-body-clothes'),
    (['food_drink'], 'food-drink'),
    (['house','places','days_weather'], 'house-places-days'),
    (['school','toys','sports'], 'school-toys-sports'),
    (['transport','verbs','adjectives','general'], 'transport-verbs-adjectives'),
]

def escape_js_str(s):
    """Escape a string for JS single-quoted string literal."""
    return s.replace('\\','\\\\').replace("'","\\'")

def generate_file(group_cats, filename):
    lines = []
    const_name = 'VOCAB_STARTERS_' + filename.upper().replace('-','_')
    lines.append(f"// Cambridge Starters: {filename.replace('-',' ')}")
    lines.append(f"const {const_name} = [")
    
    count = 0
    for cat in group_cats:
        if cat not in cats: continue
        cat_label = cat.replace('_',' ').title()
        lines.append(f"    // {cat_label}")
        for e in cats[cat]:
            en = escape_js_str(e['en'])
            vi = escape_js_str(e['vi'])
            pos = e['pos']
            cat_name = e['category']
            lines.append(f"    {{ en: '{en}', vi: '{vi}', pos: '{pos}', category: '{cat_name}' }},")
            count += 1
        lines.append("")
    
    # Remove trailing comma from last entry
    # Find last line with a data entry and remove its comma
    for i in range(len(lines)-1, -1, -1):
        if lines[i].strip().endswith('},'):
            lines[i] = lines[i].rstrip()[:-1]  # remove trailing comma
            break
    
    lines.append("];")
    
    # Write file
    path = os.path.join(JS_DIR, f'vocab-data-starters-{filename}.js')
    content = '\n'.join(lines) + '\n'
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    line_count = len(lines)
    status = "OK" if line_count <= 200 else f"OVER {line_count}"
    print(f"  {filename}: {count} words, {line_count} lines [{status}] -> {path}")
    return count, line_count

print("\nGenerating Starters JS files:")
total_words = 0
for group_cats, fname in FILE_GROUPS:
    wc, lc = generate_file(group_cats, fname)
    total_words += wc

print(f"\nTotal: {total_words} words across {len(FILE_GROUPS)} files")

# Verify no words dropped
all_added = set()
for group_cats, fname in FILE_GROUPS:
    for cat in group_cats:
        if cat in cats:
            for e in cats[cat]:
                all_added.add(e['en'].lower())

original = {e['en'].lower() for e in entries}
missing = original - all_added
if missing:
    print(f"\nWARNING: {len(missing)} words not written to any file: {sorted(missing)}")
else:
    print("All words accounted for across files")
