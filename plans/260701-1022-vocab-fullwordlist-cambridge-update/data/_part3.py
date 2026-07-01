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
