---
title: "English Vocab Subject Alongside Math"
description: "Thêm môn Tiếng Anh (ôn từ vựng Cambridge Starters/A2 Key) chọn song song Toán, streak/sao gộp chung"
status: done
priority: P2
branch: "main"
tags: ["feature", "english-vocab", "gamification"]
blockedBy: []
blocks: []
created: "2026-07-01T01:46:09.972Z"
completed: "2026-07-01T08:45:00.000Z"
createdBy: "ck:plan"
source: skill
---

# English Vocab Subject Alongside Math

## Overview

Thêm môn "Tiếng Anh" (ôn từ vựng) chọn song song với Toán trong app luyện tập của 2 bé (pure HTML/CSS/JS, GitHub Pages, không backend/build). Bé lớp 1 ôn Cambridge Starters, bé lớp 4 ôn Cambridge A2 Key (KET). Sau khi chọn bé, thêm màn hình chọn môn; streak/sao tính gộp chung 2 môn (miễn phí vì `stats.js` đã lưu counter theo grade, không theo môn). Dạng bài: trắc nghiệm EN↔VN + nghe-chọn (Web Speech API) cho cả 2 lớp, thêm điền-từ (spelling) riêng cho lớp 4.

Nguồn: `plans/reports/brainstorm-260701-0837-english-vocab-subject-select-report.md`

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [State and Dispatcher Foundation](./phase-01-state-and-dispatcher-foundation.md) | Done |
| 2 | [Vocab Data Starters](./phase-02-vocab-data-starters.md) | Done |
| 3 | [Vocab Data A2 Key](./phase-03-vocab-data-a2-key.md) | Done |
| 4 | [English Engine and UI Integration](./phase-04-english-engine-and-ui-integration.md) | Done |

## Dependencies

- Phase 2 & 3 (data) không phụ thuộc Phase 1 — có thể làm song song
- Phase 4 phụ thuộc Phase 1 (dispatcher/state) VÀ Phase 2+3 (cần data để wire generator)
- Không có cross-plan dependencies. Plan trước đó (`260623-0740-streak-stars-curriculum`) đã `status: done`, không overlap file gây xung đột — chỉ là nền tảng streak/stars mà phase này tái sử dụng nguyên vẹn.

## Acceptance Criteria

- [ ] Sau khi chọn bé, hiện màn hình chọn môn Toán/Tiếng Anh; có nút "Đổi môn" trong header để chuyển giữa chừng
- [ ] Hành vi Toán hiện tại không đổi (regression-free) — mọi loại bài toán cũ vẫn render/chấm đúng
- [ ] Bé lớp 1 ôn từ vựng Starters, bé lớp 4 ôn từ vựng A2 Key, đúng dữ liệu theo `state.currentGrade`
- [ ] 3 dạng bài cho cả 2 lớp: trắc nghiệm EN→VN, trắc nghiệm VN→EN, nghe-chọn (TTS); dạng điền-từ (spelling) chỉ xuất hiện ở lớp 4
- [ ] Câu đúng Tiếng Anh cộng vào cùng `correctCount`/target streak với Toán (không có counter riêng)
- [ ] Sao (+2/+3 đúng, -1 sai) và milestone hoạt động giống hệt luồng Toán khi trả lời câu Tiếng Anh
- [ ] Nút loa (TTS) tự ẩn nếu `window.speechSynthesis` không khả dụng, không throw lỗi
- [ ] Không tạo file/module nào vượt 200 dòng mà không có lý do tách hợp lý

## Validation Log

### Session 1 — 2026-07-01
**Trigger:** `/ck:plan validate` sau khi tạo plan
**Questions asked:** 4

#### Verification Results (Standard tier, 4 phases)
- Claims checked: ~15 (đối chiếu trực tiếp qua Read trong quá trình scout/brainstorm — tên hàm, DOM id, key localStorage)
- Verified: 15 | Failed: 0 | Unverified: 0
- Evidence: `js/game-engine.js:374,442,452,463,470` (`renderQuestion`/`checkAnswer`/keypress/`wireCompareButtons`); `js/stats.js:32,48` (`toan_stats_grade_${grade}` — counter theo grade, không theo môn, nền tảng cho "gộp streak miễn phí"); `js/streak-stars.js:11,19` (`toan_global_${theme}`); `js/main.js:44-65` (`startApp`); `index.html:165-170` (thứ tự script hiện tại)
- Tier: Standard

#### Questions & Answers
1. **[Architecture]** Kỹ thuật dispatcher cho 3 hàm English chưa tồn tại ở Phase 1 (stub-override-theo-thứ-tự-script vs typeof-guard)
   - Options: Giữ stub + comment cảnh báo | Dùng typeof-guard
   - **Answer:** Để tôi quyết định phương án ổn nhất → chọn **typeof-guard** (an toàn hơn, không phụ thuộc thứ tự `<script>`, không cần Phase 4 dọn dẹp)
2. **[Risk]** Distractor fallback khi không đủ từ cùng `pos`
   - Options: Fallback random toàn pool | Bỏ ràng buộc pos hoàn toàn
   - **Answer:** Fallback random toàn pool (giữ ưu tiên cùng `pos` khi đủ, fallback khi thiếu)
3. **[Scope]** Tách `english-engine.js`/`english-generators.js` sớm hay chờ implement
   - Options: Chờ implement xong mới quyết | Tách sẵn 2 file ngay từ đầu
   - **Answer:** Chờ implement xong mới quyết (YAGNI)
4. **[Risk]** Repo không có test suite tự động — verify bằng manual browser test
   - Options: Chấp nhận manual test | Thêm basic test trước khi implement
   - **Answer:** Chấp nhận manual browser test

#### Confirmed Decisions
- Dispatcher Phase 1 dùng `typeof` guard, KHÔNG dùng kỹ thuật stub-override — loại bỏ hoàn toàn rủi ro thứ tự `<script>`
- Phase 4 không còn bước "xoá stub" — chỉ cần định nghĩa 3 hàm English, dispatcher tự nhận diện qua `typeof`
- Distractor: ưu tiên cùng `pos`, fallback random toàn pool nếu thiếu, loại trừ trùng qua 1 Set chung
- Không tách file engine trước — quyết định sau khi đo số dòng thực tế
- Success Criteria giữ nguyên dạng manual browser test, không thêm test infra

#### Action Items
- [x] Cập nhật phase-01: dispatcher dùng typeof-guard thay vì stub
- [x] Cập nhật phase-04: bỏ bước xoá stub, thêm bước đo dòng quyết định tách file, cập nhật distractor fallback + risk mitigation

### Whole-Plan Consistency Sweep
- plan.md acceptance criteria: không nhắc kỹ thuật stub cụ thể → không cần sửa
- phase-01: đã cập nhật dispatcher + success criteria khớp typeof-guard
- phase-02, phase-03: không bị ảnh hưởng bởi các quyết định trên → không cần sửa
- phase-04: đã cập nhật Related Code Files, Implementation Steps, Success Criteria, Risk Assessment khớp typeof-guard + distractor fallback + file-split-deferred
- Không còn tham chiếu "stub" nào sai lệch giữa các phase file
- Kết quả: 0 mâu thuẫn chưa giải quyết
