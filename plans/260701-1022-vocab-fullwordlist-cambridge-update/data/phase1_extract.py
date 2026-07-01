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
# === PART 2: Starters parsing & merge ===

def pdx(t):
    e=[]
    for l in t.split('\n'):
        l=l.strip()
        if not l:continue
        if re.match(r'^[A-Z]$',l):continue
        if'STARTERS'in l or'Thuộc bảng'in l:continue
        m=re.match(r'^(.+?):\s*(.+)$',l)
        if not m:continue
        re_en=m.group(1).strip();re_vi=m.group(2).strip()
        me=re.split(r'\s*=\s*',re_en)[0].strip()
        me=re.sub(r'\s*\([^)]*(?:s\u1ed1 \u00edt|s\u1ed1 nhi\u1ec1u|Object|\u0111\u1ee9ng tr\u01b0\u1edbc)[^)]*\)','',me).strip()
        if'/'in me:me=me.split('/')[0].strip()
        if','in me and any(w in me.lower()for w in['s\u1ed1 ','nhi\u1ec1u']):me=me.split(',')[0].strip()
        e.append({'en':me,'vi':re_vi,'source':'docx'})
    return e

dx=pdx(ld('starters-docx.txt'))
print(f"S1:{len(dx)} docx entries")

def paz(t):
    az={}
    for ps in t.split('=== PAGE '):
        m=re.match(r'(\d+) ===',ps)
        if not m or int(m.group(1))not in(4,5,6,7):continue
        for l in ps.split('\n'):
            l=l.strip()
            if not l or'Pre A1'in l or'Grammatical'in l:continue
            if re.match(r'^[A-Z]$',l):continue
            if re.match(r'^(adj|adv|conj|det|dis|excl|int|n|poss|prep|pron|v)\s',l):continue
            m=re.match(r'^(.+?)\s+(n|v|adj|adv|pron|prep|conj|det|excl|dis|int|poss)(?:\s*\+\s*(n|v|adj|adv))?\s*$',l)
            if not m:continue
            er=m.group(1).strip()
            en=re.sub(r'\s*\([^)]*\)','',er).strip()
            en=re.sub(r'/\s*\w+','',en).strip()
            az[en.lower()]={'en':en,'raw_pos':f"{m.group(2)} + {m.group(3)}"if m.group(3)else m.group(2),'pos_tag':m.group(2)}
    return az

azl=paz(ld('starters.txt'))
print(f"S2:{len(azl)} A-Z entries")

def ig(el,pt):
    return el in GE or pt in{'det','pron','conj','dis','int','poss'}

def ms(dxe,azl):
    mg,sn,vl=[],set(),[]
    for e in dxe:
        en=e['en'];vi=e['vi'].strip();el=en.lower().strip()
        az=azl.get(el,{});pt=az.get('pos_tag','')
        if ig(el,pt):continue
        if az:
            rp=az.get('raw_pos','')
            if' + 'in rp:
                ps=rp.split(' + ');ch=ps[0]
                for p in ps:
                    if p.strip()in('n','v','adj','adv'):ch=p.strip();break
                pos=PM.get(ch,'noun')
            else:
                pos=PM.get(pt,'noun')
        else:
            pos=ip(en,vi)
        cat=ac(el)
        if el in sn:continue
        sn.add(el)
        if el in KF:vi=KF[el]
        for f,v in[('en',en),('vi',vi)]:vl.extend(vt(v,f,en))
        mg.append({'en':en,'vi':vi,'pos':pos,'category':cat,'source':e['source']})
    for en,vi,pos,cat in GW:
        if en.lower()in sn:continue
        sn.add(en.lower())
        mg.append({'en':en,'vi':vi,'pos':pos,'category':cat,'source':'pdf-gap-fill'})
    return mg,vl

sm,sv=ms(dx,azl)
print(f"S3:{len(sm)} Starters merged")
# === PART 3: A2 Key + cross-check + export ===

def pa2z(t):
    e=[];cp={'n','v','adj','adv','exclam','num','modal v'}
    gp={'det','pron','conj','prep'}
    am={'n':'noun','v':'verb','adj':'adjective','adv':'adverb','prep':'preposition',
        'pron':'pronoun','conj':'conjunction','det':'determiner',
        'exclam':'exclamation','num':'number','modal v':'verb'}
    for ps in t.split('=== PAGE '):
        m=re.match(r'(\d+) ===',ps)
        if not m or int(m.group(1))not in range(4,24):continue
        for l in ps.split('\n'):
            l=l.strip()
            if not l or l.startswith('\u2022'):continue
            if re.match(r'^[A-Z]$',l):continue
            m=re.match(r'^(.+?)\s+\(([^)]+)\)$',l)
            if not m:continue
            en=m.group(1).strip();pstr=m.group(2).strip()
            ps2=[p.strip()for p in re.split(r'[,&]',pstr)if p.strip()]
            hc=any(p.lower()in cp for p in ps2)
            ag=all(p.lower()in gp for p in ps2)
            if ag and not hc:continue
            pr=['n','v','adj','adv','exclam','num','modal v']
            pm2=ps2[0]if ps2 else'n'
            for p in ps2:
                if p.lower()in pr:pm2=p.lower();break
            e.append({'en':en,'pos':am.get(pm2,'noun'),'raw_pos':pstr,'source':'a2key-az-list'})
    return e

a2=pa2z(ld('a2key.txt'))
print(f"S4:{len(a2)} A2 Key entries")

ATS={'appliance':'technology','clothes':'daily_routine','colour':'general',
    'communication':'technology','document':'school','education':'school',
    'entertainment':'hobbies','environment':'environment','food':'food_cooking',
    'health':'health','hobbies':'hobbies','house':'general','language':'school',
    'feeling':'feelings','place':'directions','service':'directions',
    'shopping':'shopping','social':'feelings','sport':'hobbies','travel':'travel',
    'weather':'general','work':'jobs','job':'jobs'}

def pap2(t):
    tw={}
    for ps in t.split('=== PAGE '):
        m=re.match(r'(\d+) ===',ps)
        if not m or int(m.group(1))not in range(24,32):continue
        cur=None
        for l in ps.split('\n'):
            l=l.strip()
            if not l or l.startswith('\u00a9')or('A2 Key'in l and'Page'in l):continue
            for sk in ATS:
                if sk in l.lower()and len(l)<80:cur=sk;break
            if cur is None:continue
            if cur not in tw:tw[cur]=set()
            for w in l.split():
                wc=w.strip(' ,;.!?()').lower()
                if len(wc)>=2:tw[cur].add(wc)
    return tw

ap2=pap2(ld('a2key.txt'))
print(f"S5:{len(ap2)} topics,{sum(len(v)for v in ap2.values())} words")

def a2c(en,tw):
    el=en.lower()
    for ts,words in tw.items():
        if el in words:return ATS.get(ts,'general')
    if' 'in en and len(en.split())==2:
        if en.split()[1]in{'up','down','on','off','out','in','for',
            'after','at','back','away','over','around','through'}:
            return'phrasal_verbs'
    return'general'

for e in a2:e['category']=a2c(e['en'],ap2)
cc={}
for e in a2:cc[e['category']]=cc.get(e['category'],0)+1
print(f"  Top cats:{sorted(cc.items(),key=lambda x:-x[1])[:12]}")

# --- Cross-check ---
def cc2(mg,ef,lb):
    rr=os.path.dirname(os.path.dirname(os.path.dirname(D)))
    p=os.path.join(rr,'js',ef)
    if not os.path.exists(p):print(f"  WARN:{ef} missing");return
    with open(p,'r',encoding='utf-8')as f:c=f.read()
    ew=set()
    for m in re.finditer(r"en:\s*['\"](.+?)['\"]",c):ew.add(m.group(1).lower())
    nw={e['en'].lower()for e in mg}
    ms2=ew-nw
    if ms2:print(f"  MISSING {lb}:{sorted(ms2)}")
    else:print(f"  OK:All {len(ew)} {lb} present")
    print(f"  New:+{len(nw-ew)}")

print()
cc2(sm,'vocab-data-starters.js','Starters')
cc2(a2,'vocab-data-a2key.js','A2 Key')

# --- Validate chars ---
av=list(sv)
for e in a2:av.extend(vt(e['en'],'en',e['en']))
print(f"\nChar violations:{len(av)}")
try:
    for v in av[:15]:
        print(f"  {repr(v)[:100]}")
except:pass

# --- Export ---
def xp(entries,fn):
    out={'sourceUrl':'https://www.cambridgeenglish.org/Images/506166-starters-movers-flyers-word-list-2025.pdf',
         'a2keySourceUrl':'https://www.cambridgeenglish.org/images/506886-a2-key-2020-vocabulary-list.pdf',
         'retrievedAt':'2026-07-01','totalEntries':len(entries),'entries':entries}
    with open(os.path.join(D,fn),'w',encoding='utf-8')as f:
        json.dump(out,f,indent=2,ensure_ascii=False)
    print(f"[OK] Exported {len(entries)} entries -> {fn}")

xp(sm,'starters-extracted.json')
xp(a2,'a2key-extracted.json')
print(f"\n{'='*50}")
print(f"PHASE 1 COMPLETE")
print(f"  starters-extracted.json: {len(sm)} words")
print(f"  a2key-extracted.json:   {len(a2)} words")
print(f"{'='*50}")
