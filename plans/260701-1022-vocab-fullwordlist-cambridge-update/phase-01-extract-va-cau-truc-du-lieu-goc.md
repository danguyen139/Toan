---
phase: 1
title: "Extract va cau truc du lieu goc"
status: completed
priority: P1
dependencies: []
---

# Phase 1: Extract va cau truc du lieu goc

## Overview

Tai va trich xuat text tu 2 PDF wordlist chinh thuc Cambridge, loc bo tu ngu phap thuan tuy, doi chieu 2 nguon (alphabetic list + thematic/topic list) de gan category cho tung tu, xuat ra 2 file trung gian (JSON hoac CSV, khong phai code san pham) lam nguon "ground truth" cho Phase 2 va 3. Day la phase bat buoc phai lam truoc — khong the bien dich chinh xac neu chua co danh sach tu + category da duoc xac nhan.

**Cap nhat 2026-07-01**: User da cung cap 2 file nguon co san tai goc repo — `Starters Vocab.docx` va `506886-a2-key-2020-vocabulary-list.pdf` (trung voi PDF A2 Key da xac dinh o duoi). File docx la nguon **uu tien hang dau** cho Starters (xem chi tiet ben duoi) vi da co san ban dich tieng Viet do con nguoi lam, giam dang ke rui ro dich thuat cua Phase 2.

## Requirements

- Functional: co danh sach day du tu (EN + pos + category) cho ca 2 cap, da loai bo tu ngu phap
- Non-functional: nguon du lieu phai co the trace nguoc ve PDF/docx nguon (giu ten file + url PDF chinh thuc trong metadata trung gian) de kiem chung khi can

## Nguon du lieu da xac nhan

### Starters — uu tien dung `Starters Vocab.docx` (do user cung cap, tai `C:\DATA\Family\Toan\Starters Vocab.docx`)

Da trich xuat va kiem tra truc tiep (`plans/260701-1022-vocab-fullwordlist-cambridge-update/data/starters-docx.txt`): day la danh sach **da dich san** dang `Word: nghia tieng Viet`, sap xep A-Z, ~430 dong tu A den Z (bo qua X). Day la nguon dang tin cay hon PDF chinh thuc vi ban dich da duoc con nguoi lam san (co the la giao trinh gia dinh/gia su dang dung), giam manh khoi luong dich moi can lam o Phase 2.

**Gap da xac nhan bang doi chieu voi PDF chinh thuc** (`starters.txt` trich xuat tu PDF, trang 4-7): file docx **thieu hoan toan section P va Q**, va **section O gan nhu trong** (chi co 1 dong "Question" bi dat nham duoi header O). Doi chieu voi A-Z wordlist chinh thuc, cac tu con thieu (sau khi loai tru tu ngu phap nhu quyet dinh da chot):
- **O**: `onion (n)`, `open (adj)`, `orange (adj+n — nghia mau cam, da co "orange" duoi dang tu khac trong docx can kiem tra trung lap)` — cac tu con lai trong O (of/oh/OK/on/one/or/our/ours) la ngu phap, loai theo quyet dinh chung.
- **P**: `page, paint, painting, park, pea, pear, pen, pencil, person/people, pet, phone, photo, piano, pick up (v), picture, pie, pineapple, pink, plane, play, playground, polar bear, poster, potato, purple, put (v)` — 26 tu noi dung (da loai pardon/please/point neu xac dinh la grammar/discourse, giu lai neu Phase 2 danh gia co nghia du de day).
- **Q**: `question (n)` — 1 tu.

→ Chien luoc: dung docx lam nguon chinh cho toan bo A-N, R-Z; dung PDF chinh thuc CHI de bien dich bo sung ~28 tu con thieu (O/P/Q).

### A2 Key — `https://www.cambridgeenglish.org/images/506886-a2-key-2020-vocabulary-list.pdf` (trung voi file user cung cap tai goc repo)

32 trang (August 2025, "Additions in green"). Trang 4-23 la alphabetic wordlist (co vi du cau xen ke, can loc bo cau vi du chi giu tu+tag). Trang 24 la Appendix 1 (word sets: ngay trong tuan, thang, so...). Trang 25-32 la Appendix 2 Topic Lists (vd Appliances, Clothes and Accessories, Colours, Communication and Technology, Documents and Texts, ...) — day la nguon category chinh thuc, uu tien dung truc tiep thay vi tu nghi category moi. **Khong co ban dich san cho A2 Key** — toan bo A2 Key van can dich moi hoan toan o Phase 3 (rui ro dich thuat lon nhat plan van nam o day, khong doi so voi ban dau).

### Starters — PDF du phong (chi dung cho gap O/P/Q)

`https://www.cambridgeenglish.org/Images/506166-starters-movers-flyers-word-list-2025.pdf` — 44 trang. Trang 4-7 la "Pre A1 Starters A-Z wordlist" (grammatical key: n/v/adj/adv/prep/conj/det/pron/excl/int/dis/poss). Trang 38-44 la "Pre A1 Starters, A1 Movers and A2 Flyers thematic vocabulary list" (bang 3 cot Starters|Movers|Flyers theo topic) — van dung de gan `category` cho tu Starters (ca tu tu docx lan tu bo sung O/P/Q), vi docx khong co thong tin category/chu de.

## Related Code Files

- Create (trung gian, KHONG phai san pham cuoi, dat trong `plans/260701-1022-vocab-fullwordlist-cambridge-update/data/`):
  - `starters-docx.txt` — DA CO SAN (trich xuat trong phien nay tu `Starters Vocab.docx`)
  - `starters.txt`, `a2key.txt` — text trich xuat tu 2 PDF chinh thuc (theo trang) — **PHAI luu vao thu muc nay, KHONG chi dua vao scratchpad session-scoped** (scratchpad gan voi 1 session cu the, se khong con khi Phase 1 thuc thi o session `/ck:cook` khac — finding tu red-team)
  - `starters-extracted.json` — moi tu: `{ en, vi, pos, category, source: "docx"|"pdf-gap-fill", sourceUrl, retrievedAt }` — luu y field `vi` DA CO GIA TRI cho phan lon entry (lay tu docx), khac voi A2 Key. `sourceUrl`+`retrievedAt` ghi lai URL PDF chinh thuc + ngay tai ve, de co the doi chieu neu can trong tuong lai (khong can hash cryptographic, chi can truy vet duoc)
  - `a2key-extracted.json` — moi tu: `{ en, pos, category, sourcePage, sourceUrl, retrievedAt }` — KHONG co `vi` (chua dich, Phase 3 xu ly)
- Khong sua file san pham (`js/vocab-data-*.js`) trong phase nay

## Implementation Steps

0. Neu chua co, tai lai 2 PDF chinh thuc, trich xuat text bang `pypdf` (`python3 -c "import pypdf..."`), luu ket qua vao `plans/260701-1022-vocab-fullwordlist-cambridge-update/data/starters.txt` va `a2key.txt` (KHONG chi luu vao scratchpad) — ghi lai URL nguon + ngay tai ve.
1. **Starters**: parse `starters-docx.txt` (da trich xuat) — moi dong dang `Word: nghia` hoac `Word1 = Word2: nghia` (bien the chinh ta) → tach thanh `{ en, vi }`. Xu ly cac dang dac biet trong docx: `"Apartment = Flat: can ho"` (co bien the chinh ta, tao 1 entry cho tu chinh, ghi chu bien the neu can), `"Child (so it), children (so nhieu): ..."` (2 dang so it/nhieu cua cung 1 tu — quyet dinh giu 1 entry hay 2, uu tien giu 1 entry dung dang co ban vi generator so sanh string `en` truc tiep, dang khac se khong khop).
2. Gan `pos` cho tung tu tu docx bang suy luan ngu nghia (docx KHONG co grammatical tag nhu PDF) — doi chieu voi PDF chinh thuc (`starters.txt` trang 4-7) de lay pos chinh xac cho nhung tu trung ten, tranh doan sai.
3. Bo sung 28 tu con thieu (O/P/Q, liet ke o phan "Nguon du lieu" o tren) — CAN DICH MOI cac tu nay sang tieng Viet (docx khong co), lay `pos` tu PDF chinh thuc.
3b. **Doi chieu day du A-N, R-Z (chot qua validate 2026-07-01)**: ngoai gap O/P/Q da xac nhan, so sanh TUNG TU trong `starters-docx.txt` (~430 tu) voi toan bo danh sach A-Z chinh thuc trong `starters.txt` (trang 4-7, tru O/P/Q) de dam bao docx khong thieu tu le te o giua cac chu cai khac (vd 1-2 tu bi bo sot khi go tay docx). Neu phat hien thieu, dich bo sung tuong tu buoc 3 (lay `pos` tu PDF, dich `vi` moi theo phong cach docx).
4. Parse trang 38-44 cua `starters.txt` (thematic list): **truoc khi regex tung dong, phai noi lai cac dong bi ngat** (pypdf lam vo mot so annotation trong ngoac thanh 2 dong, vd `"bat (as sports"` + `"equipment)"` — noi lai neu dong hien tai khong ket thuc bang tag pos va dong ke tiep bat dau bang `(` hoac chu thuong tiep dien). Sau khi noi dong, lay `category` cho tung topic bang **set-membership lookup thuan tuy**: 1 tu duoc gan category X neu no vua co mat trong danh sach Starters A-Z (docx + bo sung O/P/Q) VA vua xuat hien o dau do trong khoi text cua topic X — **KHONG duoc suy luan theo vi tri/thu tu xuat hien trong dong** (vd "tu dau tien truoc Movers/Flyers") vi ranh gioi 3 cot Starters|Movers|Flyers bi gop phang khi trich xuat, vi tri khong dang tin cay. Tu khong xuat hien trong thematic list gan category `general` hoac suy luan theo nghia.
5. Loai bo entry co pos thuan ngu phap (det/pron/conj/prep-thuan-chuc-nang/poss/dis/int) khoi danh sach Starters — ap dung cho ca tu tu docx (vd "A", "About", "And", "At", "But", "For", "From", "He", "Her", "Him", "His", "I", "In", "It", "Its"... da thay xuat hien trong docx) va tu bo sung O/P/Q.
6. **A2 Key**: parse trang 4-23 cua PDF, dung regex loai bo dong vi du (dong bat dau bang `•` hoac khong khop pattern `tu (tag)`), giu `{en, pos}`. Loai tu ngu phap tuong tu buoc 5 — **luu y tag pos GHEP** (vd `a/an (det)`, `a few (det, adj & pron)`, `about (adv & prep)`, `across (adv & prep)` — xac nhan qua doc thuc te trang 4 cua PDF): ap dung quy tac tie-break ro rang thay vi loai/giu mu quang theo 1 tag don — **loai bo neu TAT CA tag deu la ngu phap thuan tuy** (vd `a/an (det)` → loai); **giu lai neu co it nhat 1 tag la noi dung cu the VA tu co nghia day duoc cho tre** (vd `a few (det, adj & pron)` → giu, vi la cum luong tu huu ich); voi cac tu "adv & prep" thuan chuc nang (about, above, across, after, again, against...) van loai vi ca 2 nghia deu la ngu phap. Giu lai modal verb co nghia ro nhu "must", "should"; loai "shall" neu qua hiem gap voi tre.
7. Parse Appendix 2 (trang 25-32) de lay category chinh thuc cho A2 Key. **QUAN TRONG (finding tu red-team)**: pypdf extract Appendix 2 gop CA 4 COT cua bang thanh 1 dong text lien tuc, khong co dau phan cach — vd dong thuc te `"bag get dressed raincoat tie"` la 4 tu rieng biet (bag | get dressed | raincoat | tie) nhung split theo khoang trang don gian se cat sai thanh 5 token gia ("get", "dressed" tach roi). **KHONG duoc dung whitespace-split don gian.** Dung 1 trong 2 cach: (a) trich xuat lai bang `pypdf` voi `extraction_mode="layout"` hoac `pdfplumber` (dua vao toa do x cua tung tu de nhom lai theo cot), hoac (b) doi chieu thu cong tung dong Appendix 2 voi hinh anh/bang goc trong PDF truoc khi tin tuong ket qua split — dac biet voi cac cum tu nhieu chu da biet co trong Appendix 2 (get dressed, washing machine, mobile phone, swimming costume, cell phone...). Moi topic heading (Appliances, Clothes and Accessories, Colours, ...) tro thanh 1 `category` slug. Doi chieu voi danh sach A-Z buoc 6 de gan category; tu khong xuat hien trong Appendix 2 giu category dua theo 13 category hien co trong `js/vocab-data-a2key.js` neu phu hop, hoac category moi hop ly.
8. **Validate ky tu an toan** (finding tu red-team ve XSS-adjacent risk): voi MOI entry `en`/`vi` sap ghi vao JSON trung gian, kiem tra bang allowlist regex — chi cho phep chu cai (bao gom dau tieng Viet), khoang trang, dau nhay don `'`, dau gach ngang `-`, dau cham `.`, dau gach cheo `/` (can cho "mouse/mice"), dau ngoac don `()` (can cho chu thich nhu "person/people"). Neu entry co ky tu `< > & "` hoac ky tu la khac, FLAG lai (khong tu dong loai bo, ghi vao danh sach can xem xet thu cong) — vi `js/english-engine.js` dung `innerHTML`/noi chuoi truc tiep vao thuoc tinh HTML (`qText.innerHTML`, `data-answer="' + opt + '"`), du lieu khong duoc validate co the pha vo render hoac (ly thuyet) inject markup.
9. Xuat `starters-extracted.json` (co san `vi` cho phan lon entry) va `a2key-extracted.json` (khong co `vi`, de Phase 3 dich toan bo).
10. Doi chieu nhanh: so sanh danh sach moi voi 172 tu hien co trong `js/vocab-data-starters.js`/`vocab-data-a2key.js` — dam bao khong tu nao bi mat (tru khi thuc su ngoai wordlist chinh thuc — ghi chu lai de hoi user o Phase 2/3 thay vi tu y xoa).

## Success Criteria

- [ ] `starters.txt`/`a2key.txt` da luu trong `plans/.../data/` (khong chi scratchpad), co ghi URL nguon + ngay tai ve
- [ ] `starters-extracted.json` co du `en/vi/pos/category/source` cho tat ca entry tu A-N, R-Z (tu docx) — `vi` khop voi ban dich trong docx goc, khong bi doi nghia khi parse
- [ ] `starters-extracted.json` co du 28 tu bo sung O/P/Q, da dich `vi` moi, co `pos` tu PDF chinh thuc
- [ ] Da doi chieu day du tung tu A-N,R-Z trong docx voi PDF chinh thuc (khong chi kiem tra cau truc chung) — moi tu thieu ngoai O/P/Q (neu co) da duoc phat hien va dich bo sung
- [ ] `a2key-extracted.json` ton tai, moi entry co du `en/pos/category/sourcePage` (chua co `vi`)
- [ ] Khong con entry nao co pos thuan ngu phap (det/pron/conj/prep-thuan-chuc-nang) trong 2 file trung gian; tag pos ghep (vd "adv & prep") da qua tie-break ro rang, khong loai/giu mu quang
- [ ] Appendix 2 Topic Lists da duoc parse bang phuong phap layout-aware hoac doi chieu thu cong — spot-check rieng cac cum tu nhieu chu da biet (get dressed, washing machine, mobile phone...) dam bao khong bi cat sai thanh tu don
- [ ] Moi entry `en`/`vi` da qua allowlist ky tu, khong con ky tu `< > & "` chua qua xem xet
- [ ] Tat ca 172 tu hien co trong `vocab-data-starters.js` va 172 tu trong `vocab-data-a2key.js` deu xuat hien trong danh sach moi (hoac duoc ghi chu ro ly do loai tru)
- [ ] Category cua A2 Key bam theo Appendix 2 Topic Lists chinh thuc, khong tu nghi category tuy tien
- [ ] Category cua Starters duoc gan bang set-membership lookup thuan tuy, khong dua vao suy luan vi tri/thu tu trong thematic list
- [ ] Cac dang "A = B: nghia" (bien the chinh ta) va "so it/so nhieu" trong docx duoc xu ly nhat quan, khong tao entry `en` trung lap gay loi distractor

## Risk Assessment

- **Risk (Critical, tu red-team)**: pypdf extract Appendix 2 gop 4 cot thanh 1 dong khong dau phan cach — whitespace-split don gian se cat sai cum tu nhieu chu thanh cac tu rieng le gia mao (vd "get dressed" → "get" + "dressed" nhu 2 tu doc lap). **Mitigation**: buoc 7 bat buoc dung layout-aware extraction (`extraction_mode="layout"` hoac `pdfplumber`) hoac doi chieu thu cong tung dong, khong dung whitespace-split thuan tuy.
- **Risk (High, tu red-team)**: mot so annotation trong A-Z/thematic list bi pypdf ngat dong giua chung (vd "bat (as sports" + "equipment)"), lam regex theo dong don that bai hoac bo sot tu. **Mitigation**: buoc 4 them logic noi dong truoc khi regex.
- **Risk (High, tu red-team)**: tag pos ghep trong A2 Key (vd "a few (det, adj & pron)") pha vo luat loai-tru-theo-pos don gian neu ap dung mu quang. **Mitigation**: buoc 6 dinh nghia quy tac tie-break ro rang (loai neu TAT CA tag la ngu phap, giu neu co it nhat 1 tag noi dung + nghia huu ich).
- **Risk (High, tu red-team)**: chuoi `en`/`vi` chua qua validate co the chua ky tu HTML khong an toan, anh huong render (`innerHTML`/thuoc tinh HTML trong `js/english-engine.js`). **Mitigation**: buoc 8 — validate allowlist tai diem trich xuat duy nhat (Phase 1), truoc khi du lieu di qua Phase 2/3/4, tranh phai kiem tra rai rac o nhieu file sau nay.
- **Risk (Medium, tu red-team)**: cache PDF/txt trich xuat trong scratchpad la session-scoped, se khong ton tai khi Phase 1 thuc thi trong session `/ck:cook` khac. **Mitigation**: buoc 0 bat buoc luu vao `plans/.../data/` thay vi chi dua vao scratchpad.
- **Risk**: mot so tu grammar an trong dang khong ro (vd modal verb "can", "must" co the coi la ngu phap hoac tu vung tuy ngu canh). **Mitigation**: neu khong chac, giu lai va de Phase 2/3 quyet dinh tung truong hop khi bien dich (an toan hon la xoa nham).
