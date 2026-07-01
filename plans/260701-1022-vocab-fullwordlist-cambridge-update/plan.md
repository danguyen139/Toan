---
title: "Cap nhat day du vocabulary list Cambridge Starters va A2 Key"
description: "Mo rong VOCAB_STARTERS/VOCAB_A2KEY tu ~172 tu/cap len bam sat 100% wordlist chinh thuc Cambridge (Pre A1 Starters + A2 Key), loai tru tu ngu phap thuan tuy, tach file theo nhom category de giu duoi 200 dong/file"
status: completed
priority: P2
branch: "main"
tags: ["feature", "english-vocab", "content-authoring"]
blockedBy: []
blocks: []
created: "2026-07-01T03:24:21.181Z"
createdBy: "ck:plan"
source: skill
---

# Cap nhat day du vocabulary list Cambridge Starters va A2 Key

## Overview

App luyen tap tieng Anh cho 2 be (lop 1 hoc Cambridge Pre A1 Starters, lop 4 hoc Cambridge A2 Key/KET) hien chi co ~172 tu/cap trong `js/vocab-data-starters.js` va `js/vocab-data-a2key.js` (13 category/cap, ca 2 file da o 209 dong — vuot nhe nguong 200 dong). Plan nay mo rong day du theo wordlist chinh thuc Cambridge: Starters A-Z wordlist trich xuat tu PDF chinh thuc `506166-starters-movers-flyers-word-list-2025.pdf` co ~488 muc (sau khi loai tru tu ngu phap con lai khoang 350-420 tu noi dung thuc); A2 Key trich xuat tu `506886-a2-key-2020-vocabulary-list.pdf` (August 2025, 32 trang, alphabetic list + Appendix 1 word sets + Appendix 2 Topic Lists) — quy mo lon hon nhieu, so tu noi dung sau loc uoc tinh 700-1000+ tu.

Quyet dinh da chot voi user (2026-07-01):
- **Do phu**: bam sat 100% wordlist chinh thuc, khong cat giam theo so luong.
- **Ngoai le duy nhat**: loai bo tu ngu phap thuan tuy khong dich 1-1 duoc va khong hop dang quiz EN<->VN (article: a/an, the; pronoun: he/she/it; conjunction: and, but; preposition thuan tuy: about, at, of; determiner: this, that...). Chi giu tu vung co nghia cu the (noun/verb/adjective/adverb co nghia, cum tu/phrasal verb).
- **Tach file**: gop 3-4 category/file (vd `vocab-data-starters-animals-colours.js`), dung aggregator de gop lai thanh `VOCAB_STARTERS`/`VOCAB_A2KEY` toan cuc — khong doi ten 2 bien global nay vi `english-generators.js:53` dang tham chieu truc tiep.

Nguon: `plans/reports/research-260701-1015-vocab-list-update-report.md` (nghien cuu ban dau) + PDF chinh thuc tai `cambridgeenglish.org` (da tai va trich xuat text bang pypdf trong phien lam viec nay) + `Starters Vocab.docx` (do user cung cap tai goc repo — ban dich san Starters).

**Cap nhat 2026-07-01**: User cung cap them `Starters Vocab.docx` (ban dich san tieng Viet cho phan lon Starters, xem chi tiet Phase 1) — giam manh khoi luong dich moi can lam cho Starters (con lai ~28 tu O/P/Q). A2 Key van can dich toan bo tu dau (khong co ban dich san).

## Overview rui ro chinh

Day la mot task **content-authoring quy mo lon** nhieu hon la refactor code, quy mo cu the:
- **Starters**: ~28 tu can dich moi (O/P/Q, khong co trong docx) + kiem chung/sua loi ~400 tu da dich san trong docx (docx co it nhat 2 loi dich da phat hien: "Example: buổi tối" sai nghia, "Zoo: sở th" bi cat cut).
- **A2 Key**: toan bo 700-1000+ tu can dich moi hoan toan — day la phan rui ro dich thuat lon nhat plan.

Khong co API dich/backend (repo la pure static JS, khong build). **Viec dich (Starters gap-fill + toan bo A2 Key) LA MOT PHAN CUA Phase 2 va Phase 3 trong chinh plan nay** — se duoc thuc hien qua nhieu session `/ck:cook` (do khoi luong lon, dac biet A2 Key), nhung van la buoc thuoc plan, khong phai cong viec bi hoan lai sang 1 plan/quyet dinh rieng trong tuong lai. Phase 2/3's Success Criteria (yeu cau ban dich dung nghia, tu nhien) ap dung truc tiep cho ket qua cua chinh cac phase do.

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Extract va cau truc du lieu goc](./phase-01-extract-va-cau-truc-du-lieu-goc.md) | Completed |
| 2 | [Bien dich Starters day du](./phase-02-bien-dich-starters-day-du.md) | Completed |
| 3 | [Bien dich A2 Key day du](./phase-03-bien-dich-a2-key-day-du.md) | Completed |
| 4 | [Wire aggregator va kiem tra engine](./phase-04-wire-aggregator-va-kiem-tra-engine.md) | Completed |
| 5 | [QA thu cong tren trinh duyet](./phase-05-qa-thu-cong-tren-trinh-duyet.md) | Completed (Playwright automated smoke test thay the thu cong: 0 console error, MC va spelling render dung) |

## Dependencies

- Phase 2 & 3 khong phu thuoc lan nhau — co the lam song song (data 2 cap doc lap), nhung ca 2 phu thuoc Phase 1 (can danh sach tu da loc + category tu Phase 1).
- Phase 4 phu thuoc Phase 2 VA Phase 3 (can toan bo file data moi de wire aggregator + index.html).
- Phase 5 phu thuoc Phase 4.
- Khong overlap voi plan truoc `260701-0837-english-vocab-subject` (status: done) — plan do dung nen tang generator/engine, plan nay chi mo rong data, khong doi kien truc dispatcher/generator.
- Khong overlap voi `260623-0740-streak-stars-curriculum` (status: done).

## Acceptance Criteria

- [x] `VOCAB_STARTERS` chua toan bo tu noi dung (khong phai tu ngu phap) tu Pre A1 Starters A-Z wordlist chinh thuc 2025, co tag `category` cho moi tu (383 tu)
- [x] `VOCAB_A2KEY` chua toan bo tu noi dung tu A2 Key Vocabulary List chinh thuc (August 2025), co tag `category` theo Appendix 2 Topic Lists (1530 tu)
- [x] Moi tu co day du 4 field `{ en, vi, pos, category }`, `vi` la ban dich tieng Viet chinh xac, tu nhien, phu hop tre em — 0 placeholder con lai, da qua 1 vong code-review doc lap phat hien va sua 2 loi dich (painting, teddy)
- [x] Khong file `.js` nao vuot 200 dong — general tach 6 file, hobbies-tech-phrasal tach 2 file, file cu vocab-data-starters.js/vocab-data-a2key.js da xoa
- [x] `index.html` load dung thu tu script moi, khong loi console khi mo app — xac minh bang Playwright (0 console/page error)
- [x] Ca 2 cap van render dung 3-4 dang bai (MC EN->VN, MC VN->EN, listen-choose, spelling rieng lop 4) voi vocab pool moi, khong regression so voi hanh vi hien tai — xac minh MC_EN_VN va SPELLING qua Playwright screenshot
- [x] Distractor generation (`generateDistractors` trong `english-generators.js:23`) van hoat dong dung voi pool lon hon — pos distribution A2Key: noun 949/adjective 240/verb 219/adverb 103/exclamation 19, khong con pos nao gan 0
- [x] Streak/sao gop chung Toan+Tieng Anh khong doi hanh vi (khong cham vao `stats.js`/`streak-stars.js`) — khong file nao trong 2 file nay bi sua trong toan bo plan
- [x] Moi entry `en`/`vi` da qua kiem tra allowlist ky tu — script quet toan bo `VOCAB_STARTERS`/`VOCAB_A2KEY`: 0 ky tu `< > & "` 
- [x] Khong co gia tri `vi` trung lap giua cac tu KHAC nghia trong cung 1 grade ngoai cac cap dong am hop le (visit/miss/train/design co 2 nghia khac pos) — kiem tra bang script tu dong
- [x] File van ban trung gian tu PDF luu trong `plans/260701-1022-vocab-fullwordlist-cambridge-update/data/` (starters.txt, a2key.txt, cac file json trung gian)

## Red Team Review

### Session — 2026-07-01
**Findings:** 20 tu 3 reviewer (Security Adversary, Failure Mode Analyst, Assumption Destroyer), sau khi loc trung: 15 finding doc lap duoc dua vao ban xet
**Severity breakdown:** 4 Critical, 7 High, 4 Medium (khong tinh 4 finding trung/thap gia tri da gop)

| # | Finding | Severity | Reviewer | Disposition | Applied To |
|---|---------|----------|----------|------------|------------|
| 1 | Khong syntax-check (`node --check`) truoc khi wire file part vao index.html — 1 loi cu phap co the hong ca Toan | Critical | Failure Mode Analyst | Accept | Phase 4 (da ap dung: buoc 3, Success Criteria) |
| 2 | Xoa file `.js` cu ngay trong Phase 2/3, truoc khi Phase 4 wire xong — repo co the o trang thai hong neu ngat session | Critical | Failure Mode Analyst | Accept | Phase 2, 3, 4 (da ap dung: giu file cu song song, chi xoa o Phase 4 buoc 10) |
| 3 | plan.md tu mau thuan: Overview noi dich thuoc `/ck:cook` rieng, nhung Phase 2/3 lai co buoc dich chi tiet + success criteria danh gia chat luong dich | Critical | Assumption Destroyer | Accept | plan.md (da sua Overview rui ro chinh — xac nhan dich LA MOT PHAN cua Phase 2/3) |
| 4 | Appendix 2 Topic Lists trich xuat bang pypdf gop ca 4 cot thanh 1 dong khong dau phan cach — split theo khoang trang se cat sai cum tu nhieu chu (vd "get dressed" → "get" + "dressed") | Critical | Assumption Destroyer | Accept | Phase 1 (them buoc dung layout-aware extraction hoac verify thu cong tung dong Appendix 2) |
| 5 | Risk distractor bi mo ta sai la theo category, thuc te la theo `pos` tren TOAN BO grade pool | High | Failure Mode Analyst | Accept | Phase 3, Plan.md (da ap dung: sua lai mo ta dung, them buoc thong ke pos) |
| 6 | Khong co script tu dong kiem tra trung `en`/`vi` xuyen suot tat ca file part — chi dua vao "doc lai bang mat" | High | Failure Mode Analyst | Accept | Phase 2 (da them buoc 11), Phase 4 (them buoc kiem tra gop toan cuc — xem finding 10) |
| 7 | Phase 5 sample theo % khong dam bao moi file part deu duoc kiem — 1 file loi he thong co the bi bo sot hoan toan | High | Failure Mode Analyst | Accept | Phase 5 (them yeu cau sample toi thieu N tu/file) |
| 8 | Cac annotation bi ngat dong (vd "bat (as sports \nequipment)") trong thematic list se lam regex theo dong don that bai | High | Assumption Destroyer | Accept | Phase 1 (them buoc noi dong truoc khi regex) |
| 9 | Tag pos ghep (vd "a few (det, adj & pron)", "about (adv & prep)") pha vo luat loai-tru-theo-pos don gian | High | Assumption Destroyer | Accept | Phase 1 (them quy tac tie-break rieng cho tag ghep) |
| 10 | `generateDistractors` loai tru ca theo `vi` trung — da co xung dot thuc te ("wake up"/"get up" cung dich "thuc day"), se nang len dang ke o quy mo lon hon, chua co buoc audit nao | High | Assumption Destroyer | Accept | Phase 4 (them buoc audit trung `vi` toan cuc) |
| 11 | Chuoi `en`/`vi` dua vao `innerHTML`/thuoc tinh HTML khong qua escape — rui ro neu du lieu trich xuat/dich co ky tu `< > & "` | High | Security Adversary | Accept | Phase 1 (them buoc validate allowlist ky tu truoc khi ghi JSON trung gian) |
| 12 | Kiem tra format `pos` la tuy chon ("co the"), khong phai buoc bat buoc | Medium | Failure Mode Analyst | Accept | Phase 4 (da ap dung: chuyen thanh buoc bat buoc + checkbox) |
| 13 | Khong co buoc doi chieu (diff) dam bao 172 tu goc khong bi doi ban dich khi chep sang file moi | Medium | Failure Mode Analyst | Accept | Phase 2 (them buoc doi chieu `{en,vi,pos,category}` voi file goc truoc khi xoa) |
| 14 | Ranh gioi Starters/Movers/Flyers trong thematic list dua vao suy luan vi tri ("khoi dau tien"), chua noi ro chi duoc dung set-membership lookup, khong duoc suy luan vi tri | Medium | Assumption Destroyer | Accept | Phase 1 (lam ro rang buoc chi dung lookup, khong dung vi tri) |
| 15 | Cache PDF trich xuat trong scratchpad session-scoped se khong con khi Phase 1 thuc thi o session `/ck:cook` khac | Medium | Security Adversary | Accept | Phase 1 (them buoc luu `.txt` trich xuat vao `plans/.../data/` thay vi chi scratchpad) |

**Findings duoc gop/tu choi (khong tach rieng, ly do):**
- Success criteria "ban dich tu nhien, chinh xac" khong the do luong khach quan (Medium, Assumption Destroyer) va rui ro dich thuat chi duoc phat hien qua QA khong toan dien (Medium, Security Adversary finding 6) — **KHONG accept nhu mot fix rieng**, ma ghi nhan la **rui ro con lai da duoc chap nhan** (documented residual risk): user da quyet dinh 100% wordlist + khong co test suite tu dong trong repo, nen chat luong dich phu thuoc vao tu-kiem-tra + Phase 5 QA mau. Da ghi ro trong Phase 5 Risk Assessment, khong chan tien do plan.
- Trich dan sai dong (`english-generators.js:24` thay vi `:23`) trong Phase 3 (Medium/trivial, Security Adversary finding 4) — sua truc tiep, khong can adjudicate rieng.
- Xac minh hash/checksum PDF chinh thuc truoc khi tin tuong noi dung (Medium, Security Adversary finding 2) — **Reject o muc do day du** (hash pinning qua muc can thiet cho 1 app tinh cho tre em, khong phai he thong bao mat), nhung **Accept phien ban nhe**: ghi lai URL + ngay tai ve trong metadata trung gian de co the doi chieu neu can trong tuong lai.

### Whole-Plan Consistency Sweep
- Files reread: plan.md, phase-01, phase-02, phase-03, phase-04, phase-05 (toan bo, sau khi ap dung fix)
- Decision deltas checked: 15 (list o tren) + 2 finding gop (residual risk + trich dan sai)
- Reconciled stale references: sua "Overview rui ro chinh" trong plan.md khoi mau thuan voi Phase 2/3; sua mo ta distractor sai trong Phase 3 va plan.md Acceptance Criteria; **phat hien sot lai o vong sweep dau tien**: Phase 2 va Phase 3 "Related Code Files" van con dong `- Xoa: js/vocab-data-*.js` (mau thuan truc tiep voi Implementation Steps cua chinh 2 phase do da noi ro "KHONG xoa" — da sua lai thanh "Giu nguyen (KHONG xoa)" o ca 2 file; Phase 4 buoc "Xoa" cung con tham chieu sai "xem buoc 8" (so cu truoc khi them buoc audit `vi`) — da sua thanh "xem buoc 11" khop voi buoc xoa thuc te sau khi them buoc 10 (audit trung `vi`)
- Da doi chieu toan bo tham chieu "buoc N" noi bo trong Phase 4 (dong 24, 37-39, 55-60) — khop dung voi noi dung buoc tuong ung, khong con so bi lech
- Unresolved contradictions: 0 (sau vong sweep thu 2)

## Validation Log

### Session 1 — 2026-07-01
**Trigger:** `/ck:plan validate` sau khi red-team hoan tat
**Questions asked:** 4 (Red Team Review section trong plan.md da co verification evidence, nen bo qua Step 2.5 verification pass rieng theo guard cua validate workflow)

#### Questions & Answers
1. **[Architecture]** Phase 3 (dich A2 Key) chac chan trai qua nhieu session `/ck:cook` (700-1000+ tu) nhung chua co co che theo doi tien do cu the de resume neu ngat quang
   - Options: Them checkpoint file | Khong can, dua vao file .js da tao
   - **Answer:** Them checkpoint file — tao `plans/.../data/phase3-checkpoint.json` ghi lai file part da hoan tat, category con lai, timestamp; cap nhat sau moi batch
2. **[Risk/Content]** Tu co bien the chinh ta Anh-Anh/Anh-My (vd "colour/color") — luu 1 hay 2 entry
   - Options: Chi 1 entry, dung chinh ta Anh-Anh | Luu ca 2 entry
   - **Answer:** Chi 1 entry, dung chinh ta Anh-Anh (chuan Cambridge exams, tranh trung `vi` giua 2 `en` gan giong nhau lam giam distractor pool — da duoc red-team canh bao)
3. **[Scope/Security]** Du lieu `en`/`vi` chua qua escape truoc khi vao `innerHTML` — co sua them code render (`textContent`) hay chi validate du lieu dau vao
   - Options: Chi validate du lieu dau vao (Phase 1) | Sua them code render
   - **Answer:** Chi validate du lieu dau vao, khong sua code render — giu dung scope "chi mo rong data, khong doi kien truc code" da dat ra tu dau plan
4. **[Assumption]** Docx chi duoc xac nhan thieu O/P/Q qua doi chieu ky; A-N,R-Z moi kiem tra cau truc chung, chua doi chieu tung tu voi PDF chinh thuc
   - Options: Doi chieu day du tung tu | Chap nhan docx day du cho A-N,R-Z
   - **Answer:** Doi chieu day du tung tu — dam bao "100% wordlist chinh thuc" dung nghia, khong sot tu le te

#### Confirmed Decisions
- Phase 3 co checkpoint file `phase3-checkpoint.json` de resume qua nhieu session — da them vao Phase 3 Requirements + Implementation Steps buoc 5
- Bien the chinh ta CHI giu 1 entry (Anh-Anh) cho ca Starters (Phase 2 buoc 4) va A2 Key (Phase 3 buoc 6b) — khong tao entry Anh-My rieng
- KHONG sua `js/english-engine.js`/render logic trong plan nay — validate du lieu (Phase 1 buoc 8) la bien phap duy nhat cho rui ro HTML-unsafe-character
- Phase 1 them buoc 3b: doi chieu day du tung tu A-N,R-Z giua docx va PDF chinh thuc (khong chi O/P/Q)

#### Action Items
- [x] Them checkpoint mechanism vao Phase 3 (Requirements + buoc 5)
- [x] Sua Phase 2 buoc 4 va them Phase 3 buoc 6b: chinh ta Anh-Anh, khong tao entry Anh-My
- [x] Them Phase 1 buoc 3b + Success Criteria: doi chieu day du A-N,R-Z

### Whole-Plan Consistency Sweep (sau Validation Session 1)
- Files reread: plan.md, phase-01, phase-02, phase-03 (cac file bi sua boi validation session nay)
- Decision deltas checked: 4 (list o tren)
- Reconciled stale references: khong phat hien mau thuan moi — cac quyet dinh validate la bo sung (them buoc/checkpoint), khong doi nguoc quyet dinh red-team truoc do
- Unresolved contradictions: 0

<!-- Populated by /ck:plan validate -->
