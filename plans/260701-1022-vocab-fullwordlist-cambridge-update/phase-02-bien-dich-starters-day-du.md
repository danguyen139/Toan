---
phase: 2
title: "Bien dich Starters day du"
status: completed
priority: P2
dependencies: [1]
---

<!-- Cap nhat 2026-07-01: Da hoan tat 383 tu, 0 placeholder. Fix bo sung: toan bo `en` bi viet hoa chu dau (vd 'Animal', 'Cat') khong nhat quan voi quy uoc lowercase - da sua ve lowercase toan bo trong session code-review/cook tiep theo. -->

# Phase 2: Bien dich Starters day du

## Overview

Tai cau truc `starters-extracted.json` (Phase 1) thanh nhieu file `.js` (moi file duoi 200 dong) thay cho `js/vocab-data-starters.js` hien tai. **Cap nhat 2026-07-01**: da co ban dich san tu `Starters Vocab.docx` (user cung cap) cho toan bo A-N, R-Z — phase nay chu yeu la CHUYEN DOI DINH DANG + KIEM CHUNG ban dich co san, khong phai dich moi tu dau. Chi can dich moi ~28 tu bo sung O/P/Q (khong co trong docx). Dieu nay giam manh rui ro dich thuat so voi uoc tinh ban dau (350-420 tu can dich moi → con lai chi ~28 tu can dich moi + kiem chung ~400 tu co san).

## Requirements

- Functional: moi tu co `{ en, vi, pos, category }` day du, giu nguyen 172 tu hien co (khong doi ban dich da co tru khi phat hien sai), them tu moi tu wordlist chinh thuc
- Non-functional: moi file duoi 200 dong; ten file kebab-case mo ta noi dung (vd `vocab-data-starters-animals-colours.js`)

## Related Code Files

- Modify: `js/vocab-data-starters.js` → tach thanh nhieu file, vd:
  - `js/vocab-data-starters-animals-colours.js`
  - `js/vocab-data-starters-family-food.js`
  - `js/vocab-data-starters-house-body-clothes.js`
  - `js/vocab-data-starters-school-numbers.js`
  - `js/vocab-data-starters-days-toys-transport.js`
  - `js/vocab-data-starters-verbs-adjectives.js`
  - (them file moi neu category moi tu Phase 1 lam vuot nguong 200 dong/file — muc tieu 3-4 category/file nhu da chot voi user, so file cu the phu thuoc tong so tu thuc te sau Phase 1)
- Giu nguyen (KHONG xoa trong phase nay): `js/vocab-data-starters.js` — chi bi xoa o Phase 4 (buoc 11), sau khi aggregator + index.html da xac nhan hoat dong dung (xem Red Team Review trong plan.md)

## Implementation Steps

1. Doc `starters-extracted.json` tu Phase 1 (da co `vi` cho phan lon entry tu docx, thieu `vi` cho 28 tu O/P/Q), nhom theo `category`.
2. Voi 28 tu O/P/Q chua co ban dich: bien dich moi sang tieng Viet — bam sat phong cach da co trong docx/172 tu hien tai (don gian, tu vung doi song hang ngay tre lop 1 da biet, tranh Han-Viet kho — vd xem cach docx dich "onion" nen la "cu hanh tay", "pineapple" → "trai thom/trai dua", "polar bear" → "gau bac cuc").
3. Voi tu da co `vi` tu docx: **KIEM CHUNG khong sua tuy tien** — chi sua neu phat hien loi chinh ta ro rang hoac sai nghia (vd "Zoo: sở th" trong docx bi cat cut do loi extract/danh may goc, can sua thanh "sở thú"; "Example: buổi tối" trong docx dich sai — tu "example" nghia la "vi du" chu khong phai "buổi tối", day la loi co san trong docx can sua khi doi chieu).
4. Xu ly cac dang dac biet tu docx (theo Phase 1 buoc 1): bien the chinh ta ("Apartment = Flat", "Colour = color") → **CHI giu 1 entry `en` chinh, dung chinh ta Anh-Anh** (vd "colour" khong phai "color", "apartment" hoac "flat" - chon 1, uu tien tu pho bien hon trong ngu canh Cambridge Starters) — **KHONG tao entry thu 2 cho bien the Anh-My** (quyet dinh chot qua validate 2026-07-01, tranh trung `vi` giua 2 `en` gan giong nhau lam giam distractor pool, da duoc red-team canh bao); dang so it/nhieu ("Child/children", "Foot/feet", "Man/men", "Mouse/mice", "Woman/women") → giu 1 entry dang so it (khop cach dung pho bien trong quiz).
5. Doi chieu 172 tu da co trong `js/vocab-data-starters.js` hien tai (ban dich da qua plan truoc, tin cay hon docx neu co xung dot) — giu ban dich cua 172 tu nay lam uu tien cao nhat neu khac voi docx.
6. Gop category thanh nhom 3-4 category/file theo thu tu logic (vd chu de gan nhau: animals+colours, family+food_drink...), moi file khai bao 1 const rieng vd `const VOCAB_STARTERS_ANIMALS_COLOURS = [...]` — **KHONG dung ten `VOCAB_STARTERS` cho tung file con** (se conflict khi Phase 4 gop lai).
7. Dam bao moi file duoi 200 dong; neu 1 nhom category qua nhieu tu vuot 200 dong, tach nho hon (uu tien giu nhom category lien quan nhau trong cung 1 file, chi tach khi bat buoc).
8. Format record giu nguyen 4 field hien co `{ en, vi, pos, category }` — khong doi schema (english-generators.js dang doc truc tiep field nay).
9. Voi cum tu nhieu chu (vd "polar bear", "baseball cap", "pick up") — dam bao dung format string co khoang trang, giong cach `js/vocab-data-a2key.js` da lam voi "wake up", "get dressed".
10. **QUAN TRONG (theo finding tu red-team, xem `plan.md` → Red Team Review)**: KHONG xoa `js/vocab-data-starters.js` cu trong buoc nay — giu file cu song song voi file part moi cho den khi Phase 4 xac nhan aggregator hoat dong dung, tranh trang thai vo repo bi hong giua chung neu phien lam viec bi ngat quang giua Phase 2/3 va Phase 4.
11. Sau khi hoan tat tung file part, chay script kiem tra trung lap `en`/`vi` trong toan bo cac file part da tao (vd doc tat ca file, gop mang, dung `Set` de phat hien trung) truoc khi coi Phase nay xong — khong dua vao doc lai bang mat.
12. **Doi chieu fidelity cho 172 tu goc (finding tu red-team)**: sau khi hoan tat tat ca file part, viet 1 script nho doc lai `js/vocab-data-starters.js` cu (van con ton tai, xem buoc 10) VA toan bo file part moi, loc ra 172 tu co trong file cu, so sanh tung bo `{en, vi, pos, category}` giua 2 nguon — yeu cau diff RONG (khong khac biet) cho 172 tu nay. Neu co khac biet, phai la thay doi CHU Y (vd sua loi phat hien), khong phai loi go/copy-paste tinh co lam sai lech ban dich da duoc kiem chung truoc do.

## Success Criteria

- [ ] Tat ca file `vocab-data-starters-*.js` moi deu duoi 200 dong
- [ ] Tong so tu Starters bam sat danh sach da loc trong Phase 1 (tru grammar words), khong thieu tu nao tu 172 tu hien co
- [ ] Moi ban dich tieng Viet tu nhien, dung nghia, phu hop tre 6-7 tuoi; cac loi dich co san trong docx (vd "Example: buổi tối", "Zoo: sở th") da duoc phat hien va sua
- [ ] `js/vocab-data-starters.js` cu VAN TON TAI song song voi file part moi cho den khi Phase 4 hoan tat va xac nhan (khong xoa som)
- [ ] Khong trung `en` giua cac file part (da chay kiem tra tu dong bang script, khong chi doc lai bang mat)
- [ ] Da chay doi chieu fidelity 172 tu goc — diff rong hoac moi thay doi deu co ly do ro rang (khong phai loi vo tinh)

## Risk Assessment

- **Risk**: docx co san giam manh khoi luong dich nhung van co the chua loi dich san (da phat hien it nhat 2 loi ro rang: "Example: buổi tối" sai nghia, "Zoo: sở th" bi cat cut) — neu khong ra soat ky se mang loi co san vao san pham cuoi. **Mitigation**: buoc 3 bat buoc doi chieu tung dong voi nghia tieng Anh that su, khong copy nguyen ban docx.
- **Risk**: cac dang bien the/so it-so nhieu trong docx neu xu ly sai se tao entry `en` trung hoac thieu, gay loi distractor (2 tu cung nghia lam distractor cho nhau — logic loai trung trong `generateDistractors` dung ca `en` lan `vi` nen se tu dong loai, nhung se lam giam so distractor kha dung). **Mitigation**: buoc 4 quy dinh ro cach xu ly, buoc 11 kiem tra trung lap bang script thay vi doc bang mat.
- **Risk**: mot so tu Starters chinh thuc kha truu tuong voi tre lop 1 that. **Mitigation**: Phase 1 da dam bao chi lay tu tu cot Starters trong A-Z list chinh thuc; neu phat hien tu la trong qua trinh xu ly, doi chieu lai voi wordlist goc truoc khi loai bo.
- **Risk (moi, tu red-team)**: neu xoa `js/vocab-data-starters.js` truoc khi Phase 4 hoan tat aggregator + cap nhat `index.html`, va phien lam viec bi ngat giua chung (vd het context, mat ket noi) → repo o trang thai hong (khong con file cu, chua co file moi duoc wire dung), Toan CUNG bi anh huong vi cung mon nhap qua 1 `index.html`. **Mitigation**: buoc 10 — giu file cu song song, chi xoa sau khi Phase 4 xac nhan xong toan bo (commit rieng cho buoc xoa, sau khi da test).
