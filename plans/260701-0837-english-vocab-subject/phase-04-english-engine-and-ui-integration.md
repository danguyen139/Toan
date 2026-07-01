---
phase: 4
title: "English Engine and UI Integration"
status: pending
priority: P1
dependencies: [1, 2, 3]
---

# Phase 4: English Engine and UI Integration

## Overview

Xây `js/english-engine.js` — pool-based generator cho bài ôn từ vựng (mirror pattern của `game-engine.js`), cắm vào dispatcher đã tạo ở Phase 1, dùng data từ Phase 2/3. Thêm CSS cho các dạng bài mới. Đây là phase tích hợp cuối cùng, phụ thuộc cả 3 phase trước.

## Requirements
- Functional:
  - 4 dạng bài: `mc_en_vn` (trắc nghiệm EN→VN), `mc_vn_en` (trắc nghiệm VN→EN), `listen_choose` (nghe TTS rồi chọn nghĩa), `spelling` (gõ từ tiếng Anh — chỉ lớp 4)
  - Pool theo lớp: lớp 1 chỉ 3 dạng đầu; lớp 4 có cả 4 dạng
  - Distractor cho trắc nghiệm: chọn 3 từ ngẫu nhiên khác trong cùng bộ data, ưu tiên cùng `pos`; nếu không đủ 3 từ cùng `pos`, fallback lấy thêm từ random toàn bộ pool (trừ đáp án đúng) cho đủ 3 distractor — shuffle 4 lựa chọn
  - TTS: dùng `window.speechSynthesis` + `SpeechSynthesisUtterance(word.en)`, `lang='en-US'`, `rate=0.85`; ẩn nút loa nếu API không tồn tại
  - Tích hợp đúng vào `checkEnglishAnswer()` gọi lại `addStars`/`checkStreakAchievement`/`saveStats`/`renderStreakBar` y hệt flow Toán
- Non-functional: file `english-engine.js` mục tiêu <200 dòng. Viết trước, đo dòng sau khi implement xong (YAGNI — không tách trước khi biết ranh giới tự nhiên); nếu vượt 200 dòng thực tế, tách `js/english-generators.js` (logic sinh câu hỏi thuần, không DOM) khỏi phần render/DOM trong `english-engine.js`

## Architecture

```js
// js/english-engine.js
function getVocabPool() {
    return state.currentGrade === 1 ? VOCAB_STARTERS : VOCAB_A2KEY;
}

function generateEnglishProblem() {
    const pool = state.currentGrade === 1
        ? ['mc_en_vn','mc_en_vn','mc_vn_en','mc_vn_en','listen_choose','listen_choose']
        : ['mc_en_vn','mc_en_vn','mc_vn_en','mc_vn_en','listen_choose','listen_choose','spelling','spelling'];
    const type = randFrom(pool);
    const vocab = getVocabPool();
    const word = randFrom(vocab);
    // build p = { subject:'english', type, word, options?, answer }
    ...
}

function renderEnglishQuestion() { /* dispatch by prob.type, render #math-question + #answer-inputs (tái dùng element có sẵn) */ }
function checkEnglishAnswer() { /* so sánh đáp án theo type, gọi addStars/checkStreakAchievement/saveStats như checkMathAnswer */ }
function showEnglishResultDetails(isCorrect) { /* hiện đáp án đúng EN + VN, lock input, giống showMathResultDetails */ }
function speakWord(en) { if (!window.speechSynthesis) return; const u = new SpeechSynthesisUtterance(en); u.lang='en-US'; u.rate=0.85; speechSynthesis.speak(u); }
```

Tái dùng nguyên vẹn `#math-question`/`#answer-inputs`/`#result-feedback`/`#btn-check`/`#btn-next` (không tạo DOM riêng cho English) — đúng theo Approach A đã chốt ở brainstorm.

## Related Code Files
- Create: `js/english-engine.js` (và `js/english-generators.js` nếu vượt 200 dòng sau khi viết xong — quyết định tại thời điểm implement, không tách trước)
- Modify: `index.html` — thêm `<script src="js/vocab-data-starters.js">`, `<script src="js/vocab-data-a2key.js">`, `<script src="js/english-engine.js">` trước `main.js` (thứ tự không còn bắt buộc phải sau `game-engine.js` nhờ dispatcher dùng `typeof` guard ở Phase 1, nhưng vẫn giữ nhóm cùng các file logic khác cho dễ đọc)
- Modify: `style.css` — thêm class cho: `.mc-option-grid` (nút trắc nghiệm 4 ô), `.btn-speak` (nút loa), `.spelling-input` (ô gõ từ)

## Implementation Steps
1. Viết `generateEnglishProblem()`: chọn pool theo `state.currentGrade`, random `type`, random `word` từ đúng bộ vocab; với `mc_en_vn`/`mc_vn_en` sinh 3 distractor + đáp án đúng, shuffle
2. Viết `renderEnglishQuestion()`:
   - `mc_en_vn`: hiện `word.en` (chữ Anh lớn), 4 nút đáp án là nghĩa tiếng Việt
   - `mc_vn_en`: hiện `word.vi`, 4 nút đáp án là từ tiếng Anh
   - `listen_choose`: hiện nút loa to (không hiện chữ EN), bấm phát âm qua `speakWord()`, 4 nút đáp án là nghĩa tiếng Việt; tự phát 1 lần khi render xong
   - `spelling`: hiện `word.vi` + nút loa gợi ý phát âm, input text để gõ từ tiếng Anh
   - Reset `#result-feedback`, `#btn-next` hidden, `#btn-check` visible — giống `renderMathQuestion` đã làm
3. Wire click handler cho 4 nút trắc nghiệm gọi `checkAnswer()` (dispatcher Phase 1 sẽ route đúng `checkEnglishAnswer`), giống pattern `wireCompareButtons` trong `game-engine.js`
4. Viết `checkEnglishAnswer()`:
   - MC/listen: so `state.selectedEnglishOption === prob.answer`
   - spelling: so `input.value.trim().toLowerCase() === prob.word.en.toLowerCase()`
   - `state.stats.totalQuestions++`; đúng → `correctCount++`, gọi `addStars`/`checkStreakAchievement`/milestone y hệt `checkMathAnswer`; sai → `wrongCount++`, `addStars(theme, -1)`
   - gọi `saveStats(); updateStatsUI(); renderStreakBar(theme); showResultDetails(isCorrect);` (dùng dispatcher, không gọi trực tiếp hàm math)
5. Viết `showEnglishResultDetails(isCorrect)`: hiện đáp án đúng dạng "apple = quả táo", lock input/nút giống `showMathResultDetails`
6. Viết `speakWord(en)` với guard `if (!window.speechSynthesis) return` — ẩn hẳn nút loa (không render) nếu API không có thay vì render nút chết
7. `index.html`: thêm 3 script tag mới (data trước engine), đặt trước `main.js`
8. `style.css`: thêm style `.mc-option-grid` (grid 2x2 nút bấm, giống `.compare-buttons` pattern có sẵn), `.btn-speak` (icon loa tròn, có hover/active state), `.spelling-input` (input text lớn, giống `.input-ans-styled` có sẵn)
9. Sau khi viết xong `english-engine.js`, đếm dòng — nếu >200, tách phần generator thuần (`generateEnglishProblem` + helper chọn distractor) sang `js/english-generators.js`, thêm script tag tương ứng vào `index.html`
10. Test thủ công đầy đủ: cả 2 bé, cả 4 dạng bài (lớp 1 chỉ 3 dạng), TTS phát đúng từ, đáp án đúng/sai chấm chính xác, streak/sao cộng dồn đúng khi trộn Toán + Tiếng Anh trong cùng ngày, milestone sao vẫn trigger đúng khi đạt qua các mốc trong `STAR_MILESTONES`
11. Test trên trình duyệt/thiết bị không có `speechSynthesis` (hoặc giả lập bằng cách xoá `window.speechSynthesis` trong devtools console) — xác nhận nút loa không hiện, không lỗi console

## Success Criteria
- [ ] Cả 4 dạng bài render và chấm đúng; lớp 1 chỉ thấy 3 dạng (không có spelling)
- [ ] TTS phát đúng từ tiếng Anh khi bấm nút loa; ẩn gọn nếu API không khả dụng, không lỗi console
- [ ] Trộn Toán + Tiếng Anh trong cùng phiên: `correctCount` cộng dồn đúng, đạt target (25/50) thì streak tăng đúng 1 lần, không tăng trùng
- [ ] Sao +2/+3/-1 và milestone hoạt động giống hệt khi trả lời câu Tiếng Anh
- [ ] 3 hàm `renderEnglishQuestion`/`checkEnglishAnswer`/`showEnglishResultDetails` được dispatcher Phase 1 gọi đúng qua `typeof` guard, không cần sửa lại dispatcher
- [ ] File `english-engine.js` (hoặc sau khi tách) mỗi file <200 dòng
- [ ] Regression check: toàn bộ luồng Toán (Phase 1 đã test) vẫn hoạt động đúng sau khi thêm Phase 4

## Risk Assessment
- **Risk:** Trùng đáp án đúng bị lọt vào danh sách distractor (2 nút hiện cùng nghĩa/cùng từ).
  **Mitigation:** Lọc distractor loại trừ từ trùng `en`/`vi` với đáp án đúng trước khi random chọn 3 distractor (kể cả nhánh fallback random toàn pool).
- **Risk:** TTS đọc sai giọng/không đọc được với `pos` là cụm động từ dài (phrasal verb A2).
  **Mitigation:** Chấp nhận giới hạn — browser TTS đọc được câu, không cần xử lý đặc biệt; nếu phát âm nghe lạ vẫn không ảnh hưởng chức năng chấm điểm (chỉ là hỗ trợ nghe thêm).
- **Risk:** Fallback distractor (khi thiếu từ cùng `pos`) vô tình chọn trùng từ đã có trong danh sách distractor.
  **Mitigation:** Dùng chung 1 tập loại trừ (Set các `en` đã chọn + đáp án đúng) xuyên suốt cả nhánh ưu tiên `pos` và nhánh fallback.
