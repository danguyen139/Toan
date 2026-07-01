---
phase: 3
title: "Vocab Data A2 Key"
status: pending
priority: P2
dependencies: []
---

# Phase 3: Vocab Data A2 Key

## Overview

Soạn file data tĩnh `js/vocab-data-a2key.js` chứa ~150-200 từ vựng tương đương chủ đề Cambridge A2 Key/KET (bé lớp 4), kèm nghĩa tiếng Việt. Cùng nguyên tắc với Phase 2 (không copy nguyên văn PDF Cambridge, soạn tương đương theo chủ đề công khai). Độc lập, có thể làm song song Phase 1/2.

## Requirements
- Functional: mỗi từ có đủ `{en, vi, pos, category}`; độ khó cao hơn Starters — cho phép cụm động từ đơn giản (phrasal verb cơ bản như "get up", "look after"), tính từ trừu tượng hơn (nghĩa là ...), danh từ chủ đề rộng hơn
- Non-functional: cùng format với `vocab-data-starters.js` để `english-engine.js` (Phase 4) dùng chung logic đọc data

## Architecture

```js
// js/vocab-data-a2key.js
const VOCAB_A2KEY = [
    { en: "get up", vi: "thức dậy", pos: "verb", category: "daily_routine" },
    { en: "helpful", vi: "hay giúp đỡ", pos: "adjective", category: "personality" },
    // ...
];
```
Cùng cấu trúc field với `VOCAB_STARTERS`, khác biến global (`VOCAB_A2KEY`) để English engine chọn đúng bộ theo `state.currentGrade === 4`.

## Related Code Files
- Create: `js/vocab-data-a2key.js`

## Implementation Steps
1. Liệt kê chủ đề chuẩn A2 Key: daily routine, jobs & occupations, feelings & personality, travel & holidays, technology & communication, shopping & money, health & body, environment & weather, hobbies & free time, school & education (nâng cao hơn Starters), food & cooking, directions & places in town
2. Soạn 150-200 từ/cụm từ trải đều chủ đề trên, ưu tiên từ tần suất cao trong đề thi A2 Key thật (job names, feeling adjectives, phrasal verb thường gặp)
3. Ghi nghĩa tiếng Việt chính xác theo ngữ cảnh A2 (không dịch word-by-word với phrasal verb — dịch theo nghĩa cụm, vd "look after" → "chăm sóc" không phải "nhìn sau")
4. Gắn `category` nhất quán theo danh sách bước 1 (snake_case)
5. Review lại: không trùng, không sai chính tả, nghĩa Việt tự nhiên và đúng cấp độ A2 (không dùng từ Hán Việt khó với học sinh lớp 4)
6. Export biến `VOCAB_A2KEY` global scope, cùng convention với `vocab-data-starters.js`

## Success Criteria
- [ ] File có 150-200 entry, mỗi entry đủ 4 field `{en, vi, pos, category}`
- [ ] Không trùng lặp `en`
- [ ] Phủ tối thiểu 10 category chủ đề A2 Key
- [ ] Bao gồm ít nhất 10-15 phrasal verb/cụm từ cơ bản (đặc trưng A2 so với Starters)
- [ ] Biến `VOCAB_A2KEY` global, load được qua `<script>` không lỗi cú pháp

## Risk Assessment
- **Risk:** Phrasal verb dịch nghĩa đen sai hoàn toàn (đây là lỗi phổ biến nhất khi soạn vocab A2).
  **Mitigation:** Review riêng nhóm phrasal verb, đối chiếu nghĩa cụm chứ không dịch từng từ.
- **Risk:** Độ khó không đồng đều — lẫn từ quá dễ (trùng Starters) hoặc quá khó (vượt A2 lên B1).
  **Mitigation:** Loại bỏ từ đã có trong `VOCAB_STARTERS` (check chéo 2 file sau khi cả 2 xong) để tránh trùng lặp giữa 2 trình độ; ưu tiên độ khó vừa phải, tránh từ học thuật.
