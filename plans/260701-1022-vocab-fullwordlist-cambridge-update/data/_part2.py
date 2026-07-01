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
