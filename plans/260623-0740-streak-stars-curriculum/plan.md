---
title: "Streak Stars Curriculum Upgrade"
description: "Streak, Stars, Redeem, Lottie animations, mobile keyboard fix, mở rộng bài tập lớp 1 & 4"
status: done
priority: P2
branch: "main"
tags: ["feature", "gamification", "ux", "curriculum"]
blockedBy: []
blocks: []
created: "2026-06-23T00:41:58.727Z"
createdBy: "ck:plan"
source: skill
---

# Streak Stars Curriculum Upgrade

## Overview

Nâng cấp toàn diện ứng dụng luyện toán "Ôn Luyện Toán Cùng Bé" (pure HTML/CSS/JS, GitHub Pages) gồm 4 phase:

1. **Bug Fix & Mobile UX** — Sửa lỗi state.appBody, tách thành ES modules, fix bàn phím ảo che câu hỏi
2. **Streak & Stars System** — Hệ thống điểm thưởng + chuỗi ngày học, streak bar UI, redeem modal
3. **Animations & Visual Effects** — Lottie Web cho milestone, nâng cấp CSS animations
4. **Curriculum Expansion** — Bổ sung dạng bài mới lớp 1 (two_step, dãy số, chẵn/lẻ, lời văn) và lớp 4 (số lớn, thập phân, phân số so sánh, hình vuông, lời văn)

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Bug Fix & Mobile UX](./phase-01-bug-fix-mobile-ux.md) | Done |
| 2 | [Streak & Stars System](./phase-02-streak-stars-system.md) | Done |
| 3 | [Animations & Visual Effects](./phase-03-animations-visual-effects.md) | Done |
| 4 | [Curriculum Expansion](./phase-04-curriculum-expansion.md) | Done |

## Dependencies

- Phase 2 → cần Phase 1 hoàn thành (modular state object sẵn sàng)
- Phase 3 & 4 → chạy song song sau Phase 1 & 2
- Không có cross-plan dependencies

## File Structure Sau Khi Hoàn Thành

```
/
├── index.html           (modified)
├── style.css            (modified)
├── js/
│   ├── main.js          (~120 lines — entry point, event wiring, startApp)
│   ├── state.js         (~60 lines  — state object, constants, mascot pools)
│   ├── stats.js         (~90 lines  — timer, updateStatsUI, saveStats, loadStats)
│   ├── game-engine.js   (~300 lines — generators, renderQuestion, checkAnswer)
│   ├── streak-stars.js  (~160 lines — global localStorage, streak/stars logic)
│   └── effects.js       (~110 lines — Lottie init, showSuccess, showError)
└── assets/
    └── [existing PNGs — không đổi]
```

## Validation Log

### Session 1 — 2026-06-23
**Trigger:** User requested validate trước khi implement
**Questions asked:** 4

#### Questions & Answers

1. **[Assumption]** Mục tiêu ngày để đạt streak — giống nhau hay khác nhau?
   - Options: 30 cho cả 2 | Lớp 1=20, Lớp 4=30
   - **Answer:** 30 câu cho cả 2 bé

2. **[Architecture]** Lottie JSON source
   - Options: User tự download | lottie-player CDN URL | CSS only
   - **Answer:** Chọn cách tự động đơn giản → **CSS-only animations** (không cần JSON files, không phụ thuộc external assets)

3. **[Scope]** word_problem4 chia có dư
   - Options: Chỉ chia hết | Cho phép dư, show 2 input
   - **Answer:** Cho phép có dư, show thương + số dư (tái dùng divide UI)

4. **[Risk]** Data migration cho existing localStorage
   - Options: Default về 0/false | Xóa localStorage cũ
   - **Answer:** Default về 0/false nếu thiếu field

#### Confirmed Decisions
- Streak target: 30 cho cả Grade 1 và Grade 4
- Phase 3: Bỏ Lottie, dùng CSS-only milestone animation overlay
- word_problem4 chia: generator sinh cả số có và không có dư, UI show 2 input
- loadGlobal(): luôn merge defaults `{streak:0, stars:0, ...}` với existing data

#### Action Items
- [x] Sửa stale content plan.md (nhân/chia → two_step)
- [ ] Cập nhật phase-03: bỏ Lottie, dùng CSS milestone overlay
- [ ] Cập nhật phase-04: word_problem4 chia có thể có dư

#### Verification Results
- Claims checked: 10
- Verified: 8 | Failed: 1 (stale "nhân/chia" — đã sửa) | Unverified: 1 (lottie JSON — resolved: không dùng)
- Tier: Standard

### Whole-Plan Consistency Sweep
- plan.md overview ✅ cập nhật
- plan.md acceptance criteria ✅ cập nhật
- phase-01: không ảnh hưởng
- phase-02: streak target 30 đã đúng, loadGlobal defaults cần ghi rõ
- phase-03: cần cập nhật — bỏ Lottie CDN, bỏ JSON files, dùng CSS overlay
- phase-04: word_problem4 chia cần cập nhật — allow remainder

## Acceptance Criteria

- [ ] Bug `state.appBody` được sửa — nút "Đổi bạn học" hoạt động đúng
- [ ] Trên mobile, câu hỏi không bị bàn phím che
- [ ] Streak đếm đúng: tăng 1 khi đạt 30 câu đúng trong ngày, reset nếu bỏ ngày
- [ ] Stars tích luỹ đúng: +5 login, +2/+3 correct, -1 wrong
- [ ] Bonus mode bật khi ≥30 câu đúng trong ngày
- [ ] Redeem modal: trừ stars đúng, streak chỉ hiển thị không trừ
- [ ] Tất cả data lưu localStorage, persist qua session
- [ ] Lottie animation chạy khi streak achieved và star milestone
- [ ] Lớp 1: two_step (cộng/trừ 2 bước), dãy số, chẵn/lẻ, bài toán lời văn hoạt động
- [ ] Lớp 4: số lớn, thập phân, so sánh phân số, hình vuông, bài toán lời văn hoạt động
- [ ] Không có regression trên các question types hiện có
