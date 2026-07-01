---
phase: 4
title: "Wire aggregator va kiem tra engine"
status: completed
priority: P1
dependencies: [2, 3]
---

<!-- Cap nhat 2026-07-01: hoan tat. node --check pass toan bo file, khong SyntaxError/ReferenceError khi load qua Playwright (screenshot xac nhan), VOCAB_STARTERS=383 VOCAB_A2KEY=1530, 0 con placeholder. general category tach thanh 6 file, hobbies-tech-phrasal tach thanh 2 file (hobbies.js + tech-phrasal.js) de dam bao duoi 200 dong. File cu vocab-data-starters.js/vocab-data-a2key.js da xoa (buoc 11). -->

# Phase 4: Wire aggregator va kiem tra engine

## Overview

Gop cac file part tu Phase 2 va 3 thanh 2 bien global `VOCAB_STARTERS`/`VOCAB_A2KEY` (giu nguyen ten de khong phai sua `english-generators.js`), cap nhat thu tu script trong `index.html`, va xac minh generator/distractor logic van hoat dong dung voi vocab pool lon hon nhieu lan.

## Requirements

- Functional: `VOCAB_STARTERS` va `VOCAB_A2KEY` van la 1 mang phang (flat array) nhu hien tai — cac module khac (`english-generators.js`, co the ca code khac) truy cap khong doi
- Non-functional: khong file nao vuot 200 dong; khong dung `const` trung ten giua cac script tag (se gay `SyntaxError: Identifier has already been declared`)

## Related Code Files

- Create: 1 file aggregator nho cho moi cap, vd `js/vocab-data-starters-index.js` va `js/vocab-data-a2key-index.js` — moi file chi lam 1 viec: `const VOCAB_STARTERS = [].concat(VOCAB_STARTERS_ANIMALS_COLOURS, VOCAB_STARTERS_FAMILY_FOOD, ...);` (duoi 20 dong, khong can gioi han 200 dong nhung van nen ngan gon)
- Modify: `index.html` (dòng 187-196 hien tai) — them script tag cho tat ca file part MOI TRUOC 2 file aggregator, aggregator phai load SAU cung (truoc `game-engine.js`)
- Xoa (chi o CUOI phase nay, sau khi da xac nhan xong toan bo, xem buoc 11): `js/vocab-data-starters.js`, `js/vocab-data-a2key.js` (ban cu, da duoc Phase 2/3 giu lai song song de tranh trang thai vo hong)
- Khong sua: `js/english-generators.js`, `js/english-engine.js`, `js/game-engine.js` (tru khi Phase nay phat hien bug thuc su can fix — khong ky vong co)

## Implementation Steps

1. Sau khi Phase 2 va 3 hoan tat, liet ke toan bo file part da tao (vd `js/vocab-data-starters-animals-colours.js`, ...).
2. Tao 2 file aggregator: doc lai ten bien `const` da khai bao trong tung file part (vd `VOCAB_STARTERS_ANIMALS_COLOURS`), viet `[].concat(...)` gop tat ca thanh `VOCAB_STARTERS` / `VOCAB_A2KEY`.
3. **Truoc khi sua `index.html`**: chay syntax-check tinh tren TUNG file part moi bang `node --check js/vocab-data-starters-xxx.js` (Node co san tren may — da dung cho `ck` CLI — `node --check` chi kiem tra cu phap, khong can chay code) de bat loi cu phap (thieu dau phay, dau ngoac...) TRUOC khi wire vao index.html. Day la buoc bat buoc theo finding tu red-team: sai cu phap 1 file part se lam browser throw `SyntaxError` ngay khi load trang, hong CA phan Toan (vi `game-engine.js` dung chung 1 `index.html`, load sau tat ca vocab data script).
4. Sau khi tat ca file part qua duoc `node --check`, cap nhat `index.html`: **THEM** script tag cho toan bo file part MOI + 2 file aggregator (dat sau cung, truoc `game-engine.js`) — **CHUA XOA** 2 dong script cu (`vocab-data-starters.js`/`vocab-data-a2key.js`) o buoc nay, de co the rollback nhanh (comment lai script moi) neu phat hien loi ngay sau khi mo app.
5. Mo app trong browser (hoac dung Live Server neu co san trong repo), kiem tra Console khong co loi `SyntaxError`/`ReferenceError` khi load trang. Neu co loi, sua ngay truoc khi tiep tuc — KHONG chuyen sang buoc sau khi console con loi.
6. Kiem tra `window.VOCAB_STARTERS.length` va `window.VOCAB_A2KEY.length` qua DevTools console khop voi tong so tu du kien tu Phase 2/3.
7. Chay thu sinh 30-50 cau hoi lien tiep moi loai (MC_EN_VN, MC_VN_EN, LISTEN_CHOOSE, SPELLING lop 4) qua UI that (khong phai unit test — repo khong co test suite) de xac minh distractor luon du 4 option, khong bi trung, khong bi lap tu chinh no lam distractor.
8. Kiem tra field `pos` cua tu moi dung format string nhu cac tu cu (`"noun"`, `"verb"`, `"adjective"`, `"adverb"` — khong dung viet tat "n"/"v" tu PDF goc, vi generator so sanh string `pos` truc tiep) — **BAT BUOC** (khong phai tuy chon): doc toan bo `VOCAB_STARTERS`/`VOCAB_A2KEY` qua console, liet ke cac gia tri `pos` unique, doi chieu dung 4 gia tri chuan.
9. Doi chieu thong ke phan bo `pos` tu Phase 3 (buoc 7 cua Phase 3) — neu co `pos` moi (vd `adverb`) voi so luong qua it (<4-5 tu) trong toan bo grade, ghi nhan la known-limitation (distractor se fallback random cho nhung tu do) thay vi coi la bug — khong bat buoc sua trong plan nay.
10. **Audit trung `vi` toan cuc (finding tu red-team)**: `generateDistractors` (`js/english-generators.js:29-40`) loai tru distractor neu TRUNG `en` **HOAC** `vi` voi dap an dung. Da co xung dot thuc te trong data hien tai: `js/vocab-data-a2key.js` co "wake up" va "get up" cung dich la "thức dậy" (2 `en` khac nhau, cung `vi`). O quy mo 700-1000+ tu, cac cap tu dong nghia (vd "big"/"large", "look"/"watch", "happy"/"glad") se lam tang so cap trung `vi` — moi cap trung se khong bao gio xuat hien cung luc trong 1 cau hoi trac nghiem, giam pool distractor kha dung doc lap voi rui ro `pos` da biet o buoc 9. Viet 1 script doc toan bo `VOCAB_STARTERS`/`VOCAB_A2KEY` sau khi gop, dem so `vi` trung nhau (group theo `vi`, loc nhom co >1 `en` khac nhau) — day khong phai loi can sua (dong nghia la binh thuong), nhung ghi nhan lai danh sach de biet nhung tu nao co pool distractor bi thu hep, dac biet neu 1 tu nao do trung `vi` voi qua nhieu tu khac cung luc.
11. **Chi sau khi buoc 5-10 deu PASS va da commit rieng cho toan bo file part + index.html moi**: xoa `js/vocab-data-starters.js` va `js/vocab-data-a2key.js` cu trong 1 commit rieng biet (de co the revert doc lap neu can).

## Success Criteria

- [ ] Tat ca file part moi qua `node --check` khong loi cu phap TRUOC khi wire vao `index.html`
- [ ] App mo khong loi console, ca 2 cap Toan/Tieng Anh hoat dong binh thuong
- [ ] `VOCAB_STARTERS`/`VOCAB_A2KEY` la 1 mang phang chua toan bo tu tu tat ca file part
- [ ] Sinh cau hoi 30-50 lan moi loai (ca 2 cap) khong loi, distractor luon co du 3 lua chon sai + 1 dung, khong trung nhau
- [ ] Khong file `.js` nao (ke ca file aggregator) vuot 200 dong
- [ ] Khong co bien `const` trung ten giua cac script tag khac nhau
- [ ] Da doi chieu toan bo gia tri `pos` unique voi 4 gia tri chuan (khong con "n"/"v" viet tat sot lai)
- [ ] Da chay audit trung `vi` toan cuc, co danh sach cac nhom tu dong nghia/trung `vi` de tham khao (khong bat buoc sua, chi can biet ro)
- [ ] File `vocab-data-starters.js`/`vocab-data-a2key.js` cu CHI bi xoa SAU KHI tat ca kiem tra o tren da PASS, trong 1 commit rieng

## Risk Assessment

- **Risk (Critical, tu red-team)**: neu wire file part loi cu phap truc tiep vao `index.html` ma khong syntax-check truoc, browser se throw `SyntaxError` ngay khi load trang — hong CA phan Toan vi dung chung 1 trang HTML va `game-engine.js` load sau vocab data. **Mitigation**: buoc 3 (`node --check` cho tung file truoc khi dung vao index.html) la buoc bat buoc, khong duoc bo qua de tiet kiem thoi gian.
- **Risk**: neu 2 file part vo tinh dat trung ten bien `const` (vd ca 2 deu ten `VOCAB_STARTERS_MISC`), browser se throw `SyntaxError` tuong tu. **Mitigation**: dat ten bien theo dung ten file (kebab-case → SCREAMING_SNAKE_CASE) de tranh trung, kiem tra danh sach ten bien truoc khi ghep vao index.html.
- **Risk**: thu tu script trong index.html sai (file part load sau aggregator) se lam aggregator nhan `undefined` khi concat, gay `TypeError`. **Mitigation**: buoc 4 quy dinh ro thu tu, kiem tra bang cach doc lai index.html sau khi sua.
- **Risk**: field `pos` neu vo tinh dung format khac (vd "n" thay vi "noun") se lam distractor mat hoan toan uu tien cung-pos (so sanh string that bai am tham, khong throw loi) — kho phat hien neu chi nhin UI thoang qua. **Mitigation**: buoc 8 la kiem tra BAT BUOC (khong con la "tuy chon" nhu ban truoc), lam qua console truoc khi coi phase hoan tat.
- **Risk (High, tu red-team)**: distractor bi loai tru theo CA `vi` trung, khong chi `pos` — o quy mo lon, cac cap tu dong nghia (da co vi du thuc te trong data hien tai) se lam giam pool distractor doc lap voi van de pos. **Mitigation**: buoc 10 audit va ghi nhan danh sach, chap nhan la dac tinh binh thuong cua tu dong nghia, khong phai bug can sua code.
- **Risk (moi, tu red-team)**: xoa file cu qua som (truoc khi xac nhan xong) co the de lai repo o trang thai hong neu phien lam viec bi ngat quang giua chung. **Mitigation**: buoc 11 doi den cuoi cung, sau khi tat ca kiem tra PASS, moi xoa trong 1 commit rieng — Phase 2/3 da duoc sua de KHONG xoa file cu som.
