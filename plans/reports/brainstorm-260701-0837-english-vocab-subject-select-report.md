# Brainstorm: Thêm môn Tiếng Anh (ôn từ vựng) song song Toán

## Bối cảnh / yêu cầu gốc
App "Ôn Luyện Toán Cùng Bé" (pure HTML/CSS/JS, GitHub Pages, no build/backend) hiện chỉ có Toán. User muốn thêm:
- Bé lớp 1 (Nhật): ôn từ vựng Cambridge Starters
- Bé lớp 4 (Bảo Ngân): ôn từ vựng Cambridge A2 Key (KET)
- Chọn Toán hay Tiếng Anh khi học; streak + sao tính gộp chung 2 môn
- Câu ôn luyện ngẫu nhiên, bài tập thú vị, cả nghĩa Anh→Việt

## Codebase hiện trạng (scout)
- Không backend/build step → vocab phải là data tĩnh nhúng JS
- 2 hồ sơ cố định: girl=Bảo Ngân/lớp4/theme `girl`, boy=Nhật/lớp1/theme `boy`
- `game-engine.js` (558L): pool-based random generator theo loại bài, `renderQuestion()`/`checkAnswer()` gắn cứng theo `state.currentGrade`
- `streak-stars.js`: streak/sao lưu `localStorage` theo **theme**, target lớp1=25/lớp4=50 câu đúng/ngày
- `stats.js`: `correctCount`/target lưu theo **grade** (`toan_stats_grade_${grade}`), KHÔNG theo môn học → điểm mấu chốt cho phép gộp streak miễn phí
- `main.js`: `startApp(grade, theme)` là entry point sau chọn bé, đi thẳng `renderQuestion()`

## Approaches đánh giá
**A. Dispatcher tái dùng UI hiện có** (chosen) — `renderQuestion`/`checkAnswer` dispatch theo `state.currentSubject`, tái dùng `#question-box`, streak-bar, stats. Pros: DRY, streak gộp tự động (correctCount vốn theo-grade không theo-môn), ít thay đổi CSS. Cons: game-engine.js cần sửa (đổi tên hàm hiện tại thành `renderMathQuestion`/`checkMathAnswer`).
**B. Màn hình/markup riêng cho English** — cô lập hoàn toàn. Pros: tách biệt rõ. Cons: duplicate CSS/DOM, không tận dụng streak-bar sẵn có, vi phạm DRY. Rejected.

## Quyết định đã chốt (qua AskUserQuestion)
1. Vocab source: **full official-equivalent list** theo chủ đề chuẩn Starters/A2 Key, nhưng **triển khai theo batch** — round này làm batch đầu ~150-200 từ/trình độ (không copy nguyên văn PDF Cambridge để tránh vấn đề bản quyền, soạn tương đương theo chủ đề công khai)
2. Dạng bài: multiple-choice EN↔VN + nghe-chọn (Web Speech API, free/built-in, không cần audio asset) cho cả 2 lớp; **spelling (điền từ) chỉ thêm cho lớp 4/A2**, lớp 1 không làm (còn nhỏ, chưa thạo gõ chính tả EN)
3. Streak/sao: **gộp chung 1 mục tiêu/ngày** (giữ nguyên target 25/50) — miễn phí vì `stats.js` đã lưu theo grade không theo môn
4. Vị trí chọn môn: màn hình mới "Chọn môn Toán/Tiếng Anh" sau khi chọn bé, trước khi vào câu hỏi; có nút "Đổi môn" trong header để chuyển giữa chừng

## Thiết kế cuối
### Luồng
`Chọn bé` → `Chọn môn (mới)` → question-box dùng chung → nút "Đổi môn" trong header

### File thay đổi/thêm
| File | Việc | Ghi chú modular |
|---|---|---|
| `js/vocab-data-starters.js` (mới) | ~150-200 từ Starters `{en, vi, pos, category}` | data-only, tách khỏi logic |
| `js/vocab-data-a2key.js` (mới) | ~150-200 từ A2 Key cùng cấu trúc | data-only |
| `js/english-engine.js` (mới, ~180L) | Pool generator `mc_en_vn`/`mc_vn_en`/`listen_choose`(cả 2 lớp)/`spelling`(chỉ lớp4); TTS qua `speechSynthesis` | nếu >200L tách `english-generators.js` |
| `js/game-engine.js` (sửa) | `renderQuestion/checkAnswer/showResultDetails` → dispatcher theo `state.currentSubject`; logic toán hiện tại đổi tên `renderMathQuestion/checkMathAnswer/showMathResultDetails`, hành vi giữ nguyên | |
| `js/state.js` (sửa) | + `currentSubject: 'math'` | |
| `js/main.js` (sửa) | Màn hình chọn môn + nút đổi môn | |
| `index.html` (sửa) | `#subject-selection-screen`, nút đổi môn header | |
| `style.css` (sửa) | Style card chọn môn, nút MC, nút loa, input spelling | |

### Vì sao streak/sao gộp "miễn phí"
`correctCount` và target lưu theo **grade** (`toan_stats_grade_${grade}`), không theo môn. English engine chỉ gọi lại `addStars`, `checkStreakAchievement`, `saveStats`, `renderStreakBar` có sẵn sau mỗi câu — không cần logic streak mới.

## Rủi ro / lưu ý
- Web Speech API: giọng đọc phụ thuộc browser/device, không phải mọi trình duyệt có giọng EN chất lượng cao — cần ẩn nút loa nếu API không khả dụng (`window.speechSynthesis` undefined)
- Nội dung vocab là content curation thủ công (không phải code) — dễ tốn effort, nên review kỹ nghĩa tiếng Việt để tránh dịch sai/lệch ngữ cảnh
- Full list (450/1500 từ) chưa làm round này — kiến trúc data sẵn sàng mở rộng dần qua nhiều batch sau

## Scope round này
- ✅ Kiến trúc dispatcher + English engine + 3-4 dạng bài + batch vocab đầu (~150-200 từ/trình độ)
- ❌ Full Cambridge list (450 Starters / 1500 A2 Key)
- ❌ Spaced repetition / lịch sử từ đã học

## Next steps
Chuyển sang `/ck:plan` để lên kế hoạch phase chi tiết (data structure, English engine, UI, tích hợp streak).

## Unresolved questions
- Không có
