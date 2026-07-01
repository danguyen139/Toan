"""Phase 1: Extract & structure - part 1"""
import re, json, os

D = os.path.dirname(os.path.abspath(__file__))
AR = re.compile(r"^[a-zA-Z\u00C0-\u1EF90-9 '\.\-/()]+$")

def vt(t,f,w):
    if not AR.match(t):
        b=set(c for c in t if not AR.match(c))
        return[f"{f}={t!r} for {w!r}:{b}"]
    return []

def ld(fn):
    with open(os.path.join(D,fn),'r',encoding='utf-8') as f:
        return f.read()

PM={'n':'noun','v':'verb','adj':'adjective','adv':'adverb',
    'prep':'preposition','pron':'pronoun','conj':'conjunction',
    'det':'determiner','excl':'exclamation','dis':'discourse_marker',
    'int':'interrogative','poss':'possessive'}

GE={'a','an','the','and','but','or','so','because','he','she','it',
    'they','we','you','i','me','him','her','us','them','my','your',
    'his','its','our','their','mine','yours','hers','ours','theirs',
    'this','that','these','those','at','of','for','to','from','with',
    'by','about','in','on','what','where','when','who','which','whose',
    'how','can','must','will','would','could','should','may','not','no',
    'yes','please','sorry','thank you','thanks','bye','goodbye','hello',
    'hi','wow','oh','then','now','there','here','mr','mrs','miss',
    "don't worry",'see you','me too'}

with open(os.path.join(D,'category_map.json'),'r',encoding='utf-8') as f:
    M=json.load(f)

def ac(el):
    for c,w in M.items():
        if el in w: return c
    return 'general'

def ip(en,vi):
    el=en.lower()
    if ' ' not in en and any(el.endswith(s) for s in ['ing','ed']):
        return 'verb'
    if any(vi.startswith(w) for w in ['lam','di','chay','nhay','an','uong','ngu',
        'hat','doc','viet','ve','boi','mo','dong','dem','nem']):
        return 'verb'
    if el in {'pink','purple','orange','grey','gray'}:
        return 'adjective'
    return 'noun'

KF={'example':'ví dụ','zoo':'sở thú','correct':'đúng, chính xác'}

GW=[
('onion','củ hành tây','noun','food_drink'),
('open','mở','adjective','verbs'),
('page','trang sách','noun','school'),
('paint','sơn, tô màu','verb','school'),
('painting','bức tranh','noun','school'),
('park','công viên','noun','places'),
('pea','đậu hạt tròn','noun','food_drink'),
('pear','trái lê','noun','food_drink'),
('pen','bút mực','noun','school'),
('pencil','bút chì','noun','school'),
('person','người','noun','family'),
('people','mọi người','noun','family'),
('pet','thú cưng','noun','animals'),
('phone','điện thoại','noun','house'),
('photo','bức ảnh','noun','house'),
('piano','đàn piano','noun','school'),
('pick up','nhặt lên','verb','verbs'),
('picture','bức tranh, bức ảnh','noun','school'),
('pie','bánh nướng','noun','food_drink'),
('pineapple','trái thơm','noun','food_drink'),
('pink','màu hồng','adjective','colours'),
('plane','máy bay','noun','transport'),
('play','chơi','verb','verbs'),
('playground','sân chơi','noun','places'),
('polar bear','gấu bắc cực','noun','animals'),
('poster','áp phích','noun','school'),
('potato','khoai tây','noun','food_drink'),
('purple','màu tím','adjective','colours'),
('put','đặt, để','verb','verbs'),
('question','câu hỏi','noun','school'),
]
