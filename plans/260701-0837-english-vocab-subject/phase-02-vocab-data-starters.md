---
phase: 2
title: "Vocab Data Starters"
status: pending
priority: P2
dependencies: []
---

# Phase 2: Vocab Data Starters

## Overview

Soạn file data tĩnh `js/vocab-data-starters.js` chứa ~150-200 từ vựng tương đương chủ đề Cambridge Starters (bé lớp 1, 6-7 tuổi), kèm nghĩa tiếng Việt. Không copy nguyên văn danh sách PDF của Cambridge — soạn tương đương theo các chủ đề công khai đã biết của Starters để tránh vấn đề bản quyền. Phase này độc lập, không phụ thuộc phase khác, có thể làm song song Phase 1/3.

## Requirements
- Functional: mỗi từ có đủ `{en, vi, pos, category}`; từ đơn giản, quen thuộc với trẻ 6-7 tuổi (không dùng từ trừu tượng/phrasal verb)
- Non-functional: file thuần data (không logic), dễ đọc, dễ bổ sung sau này; nghĩa tiếng Việt tự nhiên, đúng ngữ cảnh trẻ em (vd "cat" → "con mèo" chứ không phải chỉ "mèo" cụt)

## Architecture

```js
// js/vocab-data-starters.js
const VOCAB_STARTERS = [
    { en: "cat", vi: "con mèo", pos: "noun", category: "animals" },
    { en: "apple", vi: "quả táo", pos: "noun", category: "food" },
    // ...
];
```
`pos` (part of speech): `noun | verb | adjective | number | color` — dùng để tránh distractor cùng category nhưng khác loại từ gây khó hiểu vô lý (English engine ở Phase 4 sẽ lọc distractor ưu tiên cùng `pos`).

## Related Code Files
- Create: `js/vocab-data-starters.js`

## Implementation Steps
1. Liệt kê danh sách chủ đề chuẩn Starters: animals, colours, family, food & drink, house & furniture, body parts, clothes, school things, numbers (1-20), days of week, weather, toys, transport, basic verbs (run, jump, eat, drink, sleep, play, read, write, sing, swim), basic adjectives (big, small, happy, sad, hot, cold, new, old)
2. Soạn 150-200 từ trải đều các chủ đề trên, mỗi chủ đề ~10-20 từ tuỳ độ phổ biến (animals/food/school things nhiều hơn, weather/days ít hơn vì số từ tự nhiên ít)
3. Với mỗi từ, ghi nghĩa tiếng Việt tự nhiên, phù hợp trẻ nhỏ (dùng "con" cho động vật, "quả/cái/chiếc" cho danh từ đếm được khi phù hợp)
4. Gắn `category` nhất quán (dùng đúng 1 trong các category liệt kê bước 1, viết thường, không dấu cách — vd `body_parts`)
5. Review lại toàn bộ danh sách 1 lượt: không trùng từ, không sai chính tả tiếng Anh, nghĩa tiếng Việt không bị lệch nghĩa/quá sát nghĩa đen
6. Export biến `VOCAB_STARTERS` ở global scope (file không dùng ES modules, giống các file `.js` khác trong `js/` — load qua `<script>` tag thường)

## Success Criteria
- [ ] File có 150-200 entry, mỗi entry đủ 4 field `{en, vi, pos, category}`
- [ ] Không có từ trùng lặp (kiểm bằng cách liệt kê tất cả `en` và check unique)
- [ ] Phủ đủ tối thiểu 10 category chủ đề khác nhau
- [ ] Không có lỗi chính tả tiếng Anh (spot-check vài chục từ ngẫu nhiên)
- [ ] Biến `VOCAB_STARTERS` global, load được qua `<script src="js/vocab-data-starters.js">` không lỗi cú pháp

## Risk Assessment
- **Risk:** Nghĩa tiếng Việt dịch sai hoặc quá máy móc (vd dịch "watch" thành "xem" thay vì "đồng hồ đeo tay" tuỳ ngữ cảnh câu hỏi).
  **Mitigation:** Ưu tiên nghĩa phổ biến nhất, đơn nghĩa cho trẻ nhỏ; tránh chọn từ đa nghĩa dễ gây nhầm ở trình độ Starters.
- **Risk:** Danh sách không đại diện đúng phổ Starters thật (thiếu/thừa chủ đề so với bộ đề Cambridge thật).
  **Mitigation:** Đây là batch đầu, chấp nhận không hoàn hảo 100% — kiến trúc data cho phép bổ sung dần ở các phase/plan sau.
