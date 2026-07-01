---
phase: 1
title: "State and Dispatcher Foundation"
status: pending
priority: P1
dependencies: []
---

# Phase 1: State and Dispatcher Foundation

## Overview

Chuyển `renderQuestion()`/`checkAnswer()`/`showResultDetails()` trong `game-engine.js` từ logic-toán-gắn-cứng sang dispatcher theo `state.currentSubject`, thêm màn hình chọn môn sau màn hình chọn bé, và nút "Đổi môn" trong header. Đây là nền tảng — English engine (Phase 4) sẽ cắm vào dispatcher này. Hành vi Toán phải giữ nguyên 100% sau khi rename.

## Requirements
- Functional: dispatcher route đúng theo `state.currentSubject` ('math'|'english'); màn hình chọn môn hiện sau chọn bé, trước question-box; nút đổi môn hoạt động không cần quay lại chọn bé
- Non-functional: không phá vỡ hành vi Toán hiện có; giữ nguyên tất cả DOM id đang dùng bởi `game-engine.js`/`streak-stars.js`/`stats.js`

## Architecture

```
startApp(grade, theme)
  → hiện #subject-selection-screen (mới) thay vì render câu hỏi ngay
  → chọn "Toán" hoặc "Tiếng Anh" → set state.currentSubject → renderQuestion()

renderQuestion() [dispatcher]
  currentSubject === 'math'    → renderMathQuestion()   (đổi tên từ renderQuestion() cũ)
  currentSubject === 'english' → renderEnglishQuestion() (Phase 4, stub no-op ở phase này)

checkAnswer() [dispatcher] → checkMathAnswer() | checkEnglishAnswer() (stub Phase 4)
showResultDetails(isCorrect) [dispatcher] → showMathResultDetails() | showEnglishResultDetails() (stub Phase 4)
```

Nút "Đổi môn" trong header gọi lại màn hình chọn môn (không reset stats/streak, vì counter theo grade không theo môn).

## Related Code Files
- Modify: `js/state.js` — thêm `currentSubject: 'math'`
- Modify: `js/game-engine.js` — đổi tên `renderQuestion`→`renderMathQuestion`, `checkAnswer`→`checkMathAnswer`, `showResultDetails`→`showMathResultDetails`; thêm 3 hàm dispatcher mới cùng tên cũ (`renderQuestion`, `checkAnswer`, `showResultDetails`) gọi English stub nếu `currentSubject==='english'`
- Modify: `js/main.js` — sửa `startApp()` để dừng ở màn hình chọn môn thay vì gọi `renderQuestion()` ngay; thêm hàm `selectSubject(subject)` set state rồi mới gọi `resetStats()/initTimer()/renderStreakBar()/renderQuestion()`; wire nút "Đổi môn"
- Modify: `index.html` — thêm `<div id="subject-selection-screen">` (2 card: "Toán" / "Tiếng Anh", tái dùng class `.selection-card`) giữa `#selection-screen` và `#main-container`; thêm nút `#btn-switch-subject` trong header cạnh `#btn-back`
- Modify: `style.css` — style tối thiểu cho subject-selection-screen (tái dùng `.selection-grid`/`.selection-card` sẵn có, không cần class mới nếu tái dùng được)

## Implementation Steps
1. `state.js`: thêm field `currentSubject: 'math'` vào object `state`
2. `game-engine.js`: đổi tên 3 hàm (`renderQuestion`→`renderMathQuestion`, `checkAnswer`→`checkMathAnswer`, `showResultDetails`→`showMathResultDetails`); mọi lời gọi nội bộ tới 3 hàm này trong cùng file cũng phải đổi theo (ví dụ `checkAnswer()` gọi trong `wireCompareButtons`, keypress handlers)
3. Thêm 3 hàm dispatcher mới cuối `game-engine.js`, dùng **typeof-guard** (an toàn hơn kỹ thuật "stub bị override theo thứ tự script" — không phụ thuộc thứ tự load `<script>`, không cần Phase 4 dọn dẹp gì):
   ```js
   function renderQuestion() {
       if (state.currentSubject === 'english' && typeof renderEnglishQuestion === 'function') return renderEnglishQuestion();
       return renderMathQuestion();
   }
   function checkAnswer() {
       if (state.currentSubject === 'english' && typeof checkEnglishAnswer === 'function') return checkEnglishAnswer();
       return checkMathAnswer();
   }
   function showResultDetails(isCorrect) {
       if (state.currentSubject === 'english' && typeof showEnglishResultDetails === 'function') return showEnglishResultDetails(isCorrect);
       return showMathResultDetails(isCorrect);
   }
   ```
   (Ở Phase 1, `js/english-engine.js` chưa tồn tại nên nhánh English chưa gọi được gì — chấp nhận được vì Phase 1 test bằng subject Toán; Phase 4 chỉ cần định nghĩa 3 hàm `renderEnglishQuestion`/`checkEnglishAnswer`/`showEnglishResultDetails`, không cần sửa lại dispatcher này)
4. `index.html`: thêm markup `#subject-selection-screen` (hidden mặc định) với 2 card Toán/Tiếng Anh, đặt sau `#selection-screen`, trước `#main-container`; thêm nút `#btn-switch-subject` trong `.stats-card` header cạnh `#btn-back`
5. `main.js`: sửa `startApp(grade, theme)` — set grade/theme/theme-attr/sticker như cũ, nhưng thay vì `resetStats(); initTimer(); renderStreakBar(theme); renderQuestion();` thì ẩn `#selection-screen`, hiện `#subject-selection-screen`
6. `main.js`: thêm hàm `startSubject(subject)`: set `state.currentSubject = subject`, ẩn `#subject-selection-screen`, hiện `#main-container`, rồi mới chạy `resetStats(); initTimer(); renderStreakBar(theme); renderQuestion();`
7. Wire event listener 2 card môn học gọi `startSubject('math')`/`startSubject('english')`
8. Wire `#btn-switch-subject` → ẩn `#main-container`, hiện lại `#subject-selection-screen` (không đụng `#selection-screen`, không reset stats)
9. Test thủ công: chọn bé → chọn Toán → làm vài câu đúng/sai → bấm "Đổi môn" → chọn lại Toán → xác nhận counter/streak/stars không bị reset, hành vi y hệt trước khi có phase này

## Success Criteria
- [ ] Toàn bộ luồng Toán cũ chạy đúng như trước (regression check thủ công trên cả lớp 1 và lớp 4)
- [ ] Màn hình chọn môn hiện đúng lúc, đúng vị trí trong luồng
- [ ] Nút "Đổi môn" chuyển qua lại không làm mất stats/streak/stars đang có trong ngày
- [ ] `state.currentSubject` mặc định `'math'`, không làm vỡ code cũ nào đọc `state` object trước đó
- [ ] Dispatcher không throw lỗi khi `currentSubject==='english'` dù English engine chưa cài — nhờ `typeof` guard, không phụ thuộc thứ tự `<script>` load

## Risk Assessment
- **Risk:** Rename hàm sót 1 lời gọi nội bộ (vd trong `wireCompareButtons`, keypress handlers) → lỗi runtime khi bấm nút so sánh/Enter.
  **Mitigation:** Grep toàn bộ `game-engine.js` cho `checkAnswer(` sau khi đổi tên để đảm bảo mọi lời gọi nội bộ đã cập nhật đúng thành `checkMathAnswer()` (nếu gọi từ trong hàm math) hoặc giữ `checkAnswer()` (nếu gọi từ ngoài/dispatcher).
- **Risk:** Đổi luồng `startApp()` phá góc nhìn "Đổi bạn học" (`resetToSelection`) đang ẩn/hiện `#main-container`/`#selection-screen`.
  **Mitigation:** `resetToSelection()` cần ẩn cả `#subject-selection-screen` nếu đang mở, để tránh trạng thái kẹt màn hình khi bấm "Đổi bạn học" giữa lúc đang ở màn chọn môn.
