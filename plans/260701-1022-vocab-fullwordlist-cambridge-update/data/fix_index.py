"""Fix index.html: remove old vocab script tags."""
p = r'C:\DATA\Family\Toan\index.html'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()

# Remove the old lines
old1 = '<script src="js/vocab-data-starters.js"></script>'
old2 = '<script src="js/vocab-data-a2key.js"></script>'
c = c.replace('\n    ' + old1 + '\n    ' + old2, '')
# Handle any leftover whitespace
c = c.replace(old1 + '\n', '').replace(old2 + '\n', '')

with open(p, 'w', encoding='utf-8') as f:
    f.write(c)
print("Fixed index.html")
