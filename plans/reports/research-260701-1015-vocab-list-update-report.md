# Research Report: Cập nhật Vocabulary List cho 2 cấp độ Tiếng Anh (Starters / A2 Key)

Thời điểm nghiên cứu: 2026-07-01

## Tóm tắt

App hiện có 2 file data từ vựng: `js/vocab-data-starters.js` (bé lớp 1, Cambridge Starters, ~172 từ, 13 category, 209 dòng) và `js/vocab-data-a2key.js` (bé lớp 4, Cambridge A2 Key/KET, ~172 từ, 13 category, 209 dòng). Cả 2 file đều ở sát ngưỡng 200 dòng modularization trong CLAUDE.md — nếu thêm từ sẽ vượt ngưỡng, cần tách file theo category trước khi mở rộng.

Wordlist chính thức Cambridge lớn hơn nhiều: Starters (Pre A1) chính thức ~400-500 từ; A2 Key wordlist chính thức cũng cỡ tương đương hoặc lớn hơn (không xác nhận được số chính xác — web block). Vậy list hiện tại trong app mới phủ ~35-40% wordlist chính thức, đây là gap chính cho việc "cập nhật".

## Trạng thái hiện tại trong repo

**Starters** (`js/vocab-data-starters.js`, lớp 1, 6-7 tuổi) — 13 category: animals(20), colours(10), family(8), food_drink(20), house(12), body_parts(12), clothes(10), school(12), numbers(20), days_weather(12), toys(6), transport(8), verbs(15), adjectives(15).

**A2 Key** (`js/vocab-data-a2key.js`, lớp 4, 9-10 tuổi) — 13 category: daily_routine(15), jobs(15), feelings(15), travel(15), technology(12), shopping(12), health(12), environment(12), hobbies(15), school(15), food_cooking(15), directions(15), phrasal_verbs(16).

Format record: `{ en, vi, pos, category }`. Được `english-generators.js`/`english-engine.js` dùng để sinh câu hỏi trắc nghiệm EN↔VN, nghe-chọn (TTS), và spelling (lớp 4).

## Đối chiếu với wordlist chính thức Cambridge

- **Pre A1 Starters / A1 Movers / A2 Flyers Wordlist 2025** (nguồn chính thức cambridgeenglish.org, PDF `506166-starters-movers-flyers-word-list-2025.pdf`): wordlist tổng hợp 3 cấp, ước tính **400-500 từ** riêng phần Starters — bao gồm cả từ receptive (nghe hiểu) lẫn productive (dùng được). Không lấy được danh sách topic chi tiết do trang flyer.us chặn fetch (403).
- **A2 Key / A2 Key for Schools Vocabulary List** (bản cập nhật tháng 8/2025, PDF `506886-a2-key-2020-vocabulary-list.pdf`): dựa trên Council of Europe Waystage (1990) + dữ liệu corpus tần suất cao. Bản 2025 mới thêm "days of the week" vào alphabetical list, và tất cả từ trong Topic List headings giờ đều xuất hiện trong wordlist chính (trước đây các heading không tính là "từ vựng thi"). Chủ đề điển hình: Food and drink, House and home, Sport, Free time, Personal feelings/opinions/experiences, Health and exercise, Entertainment and media, Shopping, Places and buildings, Clothes, Weather, Travel and holidays, Transport, Daily life, Personal details, People, Language — **không verify được số lượng từ/category chính xác** (PDF là ảnh scan/binary, không parse được text qua công cụ hiện có).

**Nhận xét đối chiếu:**
- Category hiện tại của app đã bám khá sát chủ đề chính thức (food, house, clothes, travel, health, shopping, feelings, jobs... đều có).
- Category app đang **thiếu** so với danh sách chủ đề A2 Key phổ biến: Personal details/details cá nhân, Weather (A2 Key có riêng, Starters gộp chung "days_weather"), Places and buildings, Entertainment and media, Language.
- Starters chính thức có nhóm "Personal information", "The world around us", "Weekend and holiday activities" mà app chưa tách riêng.
- Số từ mỗi category trong app (10-20 từ) nhỏ hơn nhiều so với wordlist gốc — đây là bộ từ đã được **chọn lọc sư phạm** (phù hợp game trắc nghiệm/spelling), không phải bám 1:1 wordlist đầy đủ, nên việc "cập nhật" nhiều khả năng là **mở rộng có chọn lọc**, không phải copy nguyên wordlist gốc (dễ quá tải cho trẻ 6-10 tuổi và app không phải flashcard toàn diện).

## Ràng buộc kỹ thuật cần tính khi lên plan

1. **Giới hạn 200 dòng/file** (CLAUDE.md): cả 2 file vocab đã ở 209 dòng — đã vượt nhẹ. Thêm từ mới bắt buộc phải tách file (ví dụ theo category, hoặc theo nhóm category) trước/song song khi mở rộng.
2. **Format nhất quán**: mọi record cần đủ 4 field `en/vi/pos/category`; generator dựa vào `pos` để chọn distractor cùng loại từ (ưu tiên cùng `pos`, fallback random toàn pool nếu thiếu) — nếu thêm category mới quá nhỏ (<3-4 từ) sẽ dễ thiếu distractor cùng `pos`.
3. **Trùng lặp EN cần tránh** giữa Starters và A2 Key nếu có ý định cho phép "ôn nâng cao" — hiện 2 bé học tách biệt theo `state.currentGrade` nên trùng từ giữa 2 file không phải vấn đề, nhưng nên rà nếu sau này gộp.
4. Không có test tự động cho phần data — mọi thay đổi phải verify thủ công qua browser (game render đúng câu hỏi, TTS đọc được từ mới, spelling chấm đúng với cụm từ có khoảng trắng như "get up", "have lunch").

## Đề xuất hướng lên kế hoạch

1. **Xác định phạm vi mở rộng**: quyết định số từ mục tiêu mỗi cấp (vd Starters → 250-300, A2 Key → 250-300) thay vì cố match 100% wordlist chính thức — giữ tính sư phạm/game hơn là học thuật.
2. **Bổ sung category còn thiếu** theo gợi ý ở trên (personal info, weather riêng, places/buildings, entertainment...) để bám sát hơn wordlist chính thức mà không cần copy toàn bộ.
3. **Kế hoạch tách file trước khi thêm data** — ví dụ tách `vocab-data-starters-animals.js`, `vocab-data-starters-food.js`... hoặc gộp theo nhóm 3-4 category/file để giữ dưới 200 dòng, cần quyết định chiến lược tách (theo category lẻ hay theo nhóm) — đây là quyết định kiến trúc nên hỏi user hoặc để planner quyết theo YAGNI.
4. **Không cần thêm nguồn dữ liệu bên ngoài lúc runtime** — vẫn giữ mô hình tĩnh (hardcoded JS array), đúng constraint "pure HTML/CSS/JS, không backend".
5. Khi viết plan chính thức, nên tải trực tiếp 2 PDF chính thức (`506166-starters-movers-flyers-word-list-2025.pdf` và `506886-a2-key-2020-vocabulary-list.pdf`) bằng trình duyệt/tool khác có khả năng đọc PDF ảnh (công cụ research hiện tại không parse được nội dung 2 file này) để lấy danh sách từ đầy đủ, chính xác trước khi soạn data — tránh phải đoán từ qua tóm tắt web.

## Nguồn

- [Pre A1 Starters, A1 Movers and A2 Flyers Wordlists 2025 (PDF)](https://www.cambridgeenglish.org/Images/506166-starters-movers-flyers-word-list-2025.pdf)
- [Pre A1 Starters Wordlist picture book](https://www.cambridgeenglish.org/images/351849-pre-a1-starters-wordlist-picture-book.pdf)
- [12 Cambridge Starters Vocabulary Topics (Updated 2025)](https://flyer.us/cambridge-starters-vocabulary/) — không fetch được nội dung (403), chỉ có tiêu đề từ search snippet
- [A2 Key and A2 Key for Schools vocabulary list (August 2025, PDF)](https://www.cambridgeenglish.org/images/506886-a2-key-2020-vocabulary-list.pdf) — không parse được nội dung (PDF ảnh/binary)
- [A2 Key Vocabulary List — studylib](https://studylib.net/doc/27938111/a2-key-2025-vocabulary-list)
- Repo hiện tại: `js/vocab-data-starters.js`, `js/vocab-data-a2key.js`, `plans/260701-0837-english-vocab-subject/plan.md`

## Câu hỏi chưa giải quyết

1. Mục tiêu số từ cụ thể mỗi cấp độ sau khi cập nhật là bao nhiêu? (đề xuất 250-300/cấp nhưng cần user chốt)
2. Có cần bám sát 100% wordlist chính thức Cambridge hay chỉ dùng làm tham khảo chọn lọc? (khuyến nghị: chọn lọc, vì wordlist gốc dùng cho thi cử, không tối ưu cho game)
3. Chiến lược tách file khi vượt 200 dòng: tách theo từng category hay gộp nhóm category/file?
4. Không lấy được nội dung đầy đủ 2 PDF wordlist chính thức (bị chặn/không parse được) — cần công cụ đọc PDF ảnh hoặc tải thủ công trước khi soạn data chi tiết ở bước plan.
