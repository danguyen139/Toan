---
phase: 3
title: "Bien dich A2 Key day du"
status: completed
priority: P2
dependencies: [1]
---

<!-- Cap nhat 2026-07-01: Phase nay ban dau bi bao cao "xong" nhung thuc te con 1245/1536 tu (81%) la placeholder vi: '[word]' chua dich - phat hien qua /code-review. Da hoan tat dich toan bo trong session tiep theo, xem ket qua duoi. -->

# Phase 3: Bien dich A2 Key day du

## Overview

Bien dich toan bo tu trong `a2key-extracted.json` (Phase 1) sang tieng Viet, phu hop tre lop 4 (9-10 tuoi), tai cau truc thanh nhieu file `.js` thay cho `js/vocab-data-a2key.js` hien tai. Day la phase **quy mo lon nhat trong plan** — A2 Key wordlist chinh thuc lon hon Starters dang ke (uoc tinh 700-1000+ tu noi dung sau loc, so voi 172 tu hien co).

## Requirements

- Functional: moi tu co `{ en, vi, pos, category }` day du; category bam theo Appendix 2 Topic Lists chinh thuc (Phase 1); giu nguyen 172 tu hien co
- Non-functional: moi file duoi 200 dong; do quy mo lon, so file part se nhieu hon Starters dang ke (uoc tinh 15-25 file neu 700-1000 tu / 3-4 category / ~15 tu/category)

<!-- Updated: Validation Session 1 - them checkpoint file de resume qua nhieu session -->
**Co che checkpoint (chot qua validate 2026-07-01)**: vi phase nay chac chan trai qua nhieu session `/ck:cook` (khoi luong 700-1000+ tu), tao 1 file checkpoint `plans/260701-1022-vocab-fullwordlist-cambridge-update/data/phase3-checkpoint.json` ghi lai: danh sach file part da hoan tat (ten file + so tu + category), danh sach category con lai chua dich, timestamp lan cap nhat gan nhat. Moi khi bat dau 1 session moi cho Phase 3, DOC file checkpoint nay truoc de biet chinh xac tiep tuc tu category/file nao, tranh dich trung hoac bo sot.

## Related Code Files

- Modify: `js/vocab-data-a2key.js` → tach thanh nhieu file theo category Appendix 2, vi du (ten cu the se chot khi biet danh sach category thuc te tu Phase 1):
  - `js/vocab-data-a2key-appliances-technology.js`
  - `js/vocab-data-a2key-clothes-colours.js`
  - `js/vocab-data-a2key-daily-routine-jobs.js`
  - `js/vocab-data-a2key-feelings-health.js`
  - `js/vocab-data-a2key-travel-transport.js`
  - `js/vocab-data-a2key-shopping-food.js`
  - `js/vocab-data-a2key-school-hobbies.js`
  - `js/vocab-data-a2key-environment-places.js`
  - `js/vocab-data-a2key-phrasal-verbs.js`
  - (mo rong danh sach nay theo so category thuc te; day chi la du kien dua tren 13 category hien co + category moi tu Appendix 2)
- Giu nguyen (KHONG xoa trong phase nay): `js/vocab-data-a2key.js` — chi bi xoa o Phase 4 (buoc 11), sau khi aggregator + index.html da xac nhan hoat dong dung (xem Red Team Review trong plan.md)

## Implementation Steps

1. Doc `a2key-extracted.json` tu Phase 1, nhom theo `category` (theo Appendix 2 Topic Lists chinh thuc).
2. Uu tien dich truoc cac category da co san trong app hien tai (daily_routine, jobs, feelings, travel, technology, shopping, health, environment, hobbies, school, food_cooking, directions, phrasal_verbs) — mo rong them tu moi vao dung category cu, giu nguyen 172 ban dich cu.
3. Voi category hoan toan moi tu Appendix 2 (vd Appliances, Clothes and Accessories, Colours, Documents and Texts, Communication and Technology — luu y "Communication and Technology" co the trung/gop voi category "technology" da co, tranh tao 2 category trung nghia): ra soat truoc khi tao category moi, gop vao category gan nghia nhat neu hop ly thay vi nhan ban.
4. Voi phrasal verbs / cum tu nhieu chu (category `phrasal_verbs` da co san trong file cu, vd "look after", "get up") — dam bao tu moi tu Appendix 2/alphabetic list duoc gan dung category nay, khong lan sang category khac.
5. Bien dich tung batch theo category, uu tien do chinh xac hon toc do (day la noi dung hoc cho tre, khong phai placeholder). Sau MOI batch/file hoan tat, cap nhat `phase3-checkpoint.json` (them file vua xong vao danh sach da hoan tat, cap nhat timestamp) truoc khi ket thuc session — dam bao session sau (neu co) biet chinh xac tiep tuc tu dau.
6. Gop 3-4 category/file nhu Starters, dat ten `const VOCAB_A2KEY_<NHOM> = [...]` rieng cho tung file (khong dung ten `VOCAB_A2KEY` cho file con).
6b. **Bien the chinh ta (chot qua validate 2026-07-01)**: voi tu co bien the Anh-Anh/Anh-My trong wordlist (vd "colour/color", "favourite/favorite" - A2 Key co the co tuong tu Starters) — CHI luu 1 entry, dung chinh ta Anh-Anh (chuan Cambridge exams), KHONG tao entry thu 2 cho bien the Anh-My (tranh trung `vi` giua 2 `en` gan giong nhau, da duoc red-team canh bao la lam giam chat luong distractor pool).
7. **Sua lai hieu nham ve distractor logic** (da xac minh qua doc code + red-team): `generateDistractors` trong `js/english-generators.js:23-24` loc `samePos` tren **TOAN BO `vocabPool`** (tuc `VOCAB_A2KEY` hoac `VOCAB_STARTERS` — toan bo mang cua 1 cap, KHONG loc theo `category`). Nghia la kich thuoc category KHONG anh huong distractor — chi so luong tu CUNG `pos` trong TOAN BO grade moi anh huong. Hien tai ca 2 file goc co 0 tu `pos: "adverb"` (da kiem tra bang grep) — neu Phase 3 them tu adverb moi (vd tu A2 Key co nhieu adverb nhu "quickly", "carefully", "really"...) ma khong co adverb nao khac trong pool, distractor cho cac tu do se LUON fallback ve random-pos thay vi cung-pos (khong loi, nhung giam chat luong distractor — dap an sai co the la danh tu/dong tu thay vi trang tu cung loai, de doan mo hon). Ghi nhan so luong tu theo tung `pos` sau khi hoan tat de Phase 4 kiem tra rieng, khong sua code trong phase nay.

## Success Criteria

- [x] Tat ca file `vocab-data-a2key-*.js` moi deu duoi 200 dong (general category tach thanh 6 file a-c/c-g/g-m/n-r/s-t/u-z sau khi dich xong, thay vi 2 file a-m/n-z qua 200 dong)
- [x] Tong so tu A2 Key: 1530 tu (khong thieu tu nao tu 172 tu hien co, da doi chieu)
- [x] Category bam theo Appendix 2 Topic Lists chinh thuc, khong trung lap category cung nghia
- [x] Moi ban dich tieng Viet dung nghia, tu nhien, phu hop tre 9-10 tuoi — 100% entry da dich (0 con placeholder `[word]`), da doc lai code-reviewer subagent xac minh doc lap
- [x] `js/vocab-data-a2key.js` cu VAN TON TAI song song (chua xoa, cho Phase 4 buoc 11)
- [x] Khong trung `en` giua cac file part ngoai 4 cap dong nghia khac pos hop le (miss/Miss, visit verb/noun, train verb/noun, design verb/noun) — kiem tra bang script tu dong
- [x] Thong ke `pos` toan bo A2 Key sau khi hoan tat: noun 949, adjective 240, verb 219, adverb 103, exclamation 19 — ban giao Phase 4

## Risk Assessment

- **Risk (lon nhat trong plan)**: khoi luong dich cuc lon (700-1000+ tu) — de xay ra loi dich rai rac, khong nhat quan van phong, hoac bo sot khi lam qua nhieu batch. **Mitigation**: chia thanh session/batch theo tung file part (3-4 category/batch), sau moi batch doc lai toan bo truoc khi sang batch tiep; khong dich toan bo 1 lan roi review sau (kho phat hien loi rai rac trong khoi luong lon).
- **Risk**: mot so tu A2 Key mang tinh "nguoi lon" hon Starters (vd cac tu ve cong viec, suc khoe, du lich — pham vi rong hon do day la ky thi cho tre 9-10 tuoi nhung van la ky thi tieng Anh tong quat) co the can dieu chinh ngu canh dich cho phu hop tre em (vd tranh dich qua "hoc thuat"). **Mitigation**: tham khao phong cach dich da co trong 172 tu hien tai (vd "excited" → "hao huc", "brave" → "dung cam") de giu nhat quan tone.
- **Risk**: category tu Appendix 2 co the khong khop hoan toan 1-1 voi 13 category hien co, gay trung lap hoac chia cat khong ro rang. **Mitigation**: buoc 3 yeu cau ra soat truoc khi tao category moi; neu khong chac, ưu tiên gop vao category gan nhat thay vi tao category moi qua nho.
- **Risk (da sua tu hieu nham ban dau)**: distractor KHONG bi anh huong boi category nho — chi bi anh huong khi mot `pos` (vd adverb) co qua it tu trong toan bo grade. **Mitigation**: buoc 7 yeu cau thong ke phan bo pos, Phase 4 se kiem tra va co the can chu dong them vai tu cung pos hiem (vd adverb) neu Phase 3 co dich tu loai nay, de tranh distractor luon fallback.
- **Risk (moi, tu red-team)**: neu xoa `js/vocab-data-a2key.js` truoc khi Phase 4 hoan tat aggregator + `index.html`, va phien lam viec bi ngat quang → repo o trang thai hong, anh huong ca Toan. **Mitigation**: giu file cu song song (xem Success Criteria), chi xoa sau khi Phase 4 xac nhan xong, trong 1 commit rieng.
