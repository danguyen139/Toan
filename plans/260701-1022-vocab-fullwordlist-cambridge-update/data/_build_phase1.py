"""Builder: generates phase1_extract.py from parts."""
import os
D = os.path.dirname(os.path.abspath(__file__))
p1 = os.path.join(D, '_part1.py')
p2 = os.path.join(D, '_part2.py')
p3 = os.path.join(D, '_part3.py')
out = os.path.join(D, 'phase1_extract.py')
with open(out, 'w', encoding='utf-8') as f:
    for p in [p1, p2, p3]:
        with open(p, 'r', encoding='utf-8') as fp:
            f.write(fp.read())
print(f"Built {out} from 3 parts")
