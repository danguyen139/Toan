---
phase: 4
title: "Curriculum Expansion"
status: pending
priority: P1
dependencies: [phase-01-bug-fix-mobile-ux]
---

# Phase 4: Curriculum Expansion

## Overview

Mở rộng ngân hàng câu hỏi để bao phủ đầy đủ chương trình ôn tập hè. Lớp 1: tăng phạm vi số lên 9.999, thêm bài toán 2 phép tính cộng/trừ, dãy số, chẵn/lẻ, lời văn. Lớp 4: thêm số lớn, thập phân, so sánh phân số, hình vuông, bài toán lời văn.

## Requirements

**Lớp 1:**
- Tất cả dạng cũ (add, sub, compare, missing, clock) tăng phạm vi số lên 9.999
- Thêm `two_step`: 2 phép tính cộng/trừ kết hợp trong 1 biểu thức (`1.250 + 340 - 180 = ?`)
- Thêm `sequence`: dãy số tăng đều, điền 1 ô trống
- Thêm `odd_even`: nhận biết số chẵn/lẻ (button UI giống compare)
- Thêm `simple_word`: bài toán lời văn 1 phép tính (cộng hoặc trừ) trong 9.999

**Lớp 4:**
- Thêm `large_add_sub`: cộng/trừ số 5-6 chữ số
- Thêm `decimal`: cộng/trừ số thập phân 1 chữ số sau dấu phẩy
- Thêm `fraction_compare`: so sánh 2 phân số (dùng lại UI compare buttons)
- Thêm `square_geometry`: chu vi/diện tích hình vuông
- Thêm `word_problem4`: bài toán lời văn 1-2 bước (nhân, chia, cộng, trừ)

## Architecture

### Lớp 1 — Generators Mới

#### `two_step`
```js
// a OP b OP c, đảm bảo kết quả dương và trong 9999
const a = Math.floor(Math.random() * 5000) + 1000;
const b = Math.floor(Math.random() * 3000) + 100;
const op1 = Math.random() > 0.5 ? '+' : '-';
const maxC = op1 === '+' ? Math.min(a + b - 1, 9999) : a - b - 1;
const c = Math.floor(Math.random() * Math.min(maxC, 2000)) + 100;
const op2 = Math.random() > 0.5 ? '+' : '-';
// Tính answer tuỳ op1, op2
// Hiển thị: "1.250 + 340 - 180 = ?"
// Format số với dấu chấm hàng nghìn (helper formatVN)
```

#### `sequence`
```js
const steps = [2, 5, 10, 25, 50, 100, 250, 500, 1000];
const step = steps[Math.floor(Math.random() * steps.length)];
const start = Math.floor(Math.random() * 20) * step; // bắt đầu từ bội của step
// Tạo 5 số liên tiếp, che 1 vị trí ngẫu nhiên (không phải đầu/cuối)
// Hiển thị: "500, 1.000, ?, 2.000, 2.500"
// Input: number field bình thường
```

#### `odd_even`
```js
const n = Math.floor(Math.random() * 5000) + 1;
problem.text = `Số ${formatVN(n)} là số chẵn hay lẻ?`;
problem.answer = n % 2 === 0 ? 'chẵn' : 'lẻ';
problem.isOddEven = true;
// UI: 2 buttons "Chẵn" / "Lẻ" (tương tự compare buttons)
```

#### `simple_word`
```js
const WORD_TEMPLATES_1 = [
  (a, b) => ({ text: `Có ${fVN(a)} quả táo, thêm ${fVN(b)} quả nữa. Tất cả có mấy quả?`, answer: a + b }),
  (a, b) => ({ text: `Có ${fVN(a)} viên bi, cho bạn ${fVN(b)} viên. Còn mấy viên?`, answer: a - b }),
  (a, b) => ({ text: `Lớp có ${fVN(a)} học sinh, thêm ${fVN(b)} bạn chuyển đến. Lớp có bao nhiêu bạn?`, answer: a + b }),
  (a, b) => ({ text: `Mẹ có ${fVN(a)} đồng, mua đồ hết ${fVN(b)} đồng. Mẹ còn mấy đồng?`, answer: a - b }),
];
// a trong 1000-9000, b trong 100-a (nếu trừ)
```

### Lớp 4 — Generators Mới

#### `large_add_sub`
```js
const op = Math.random() > 0.5 ? '+' : '-';
if (op === '+') {
    const a = rand(100000, 999999);
    const b = rand(10000, 999999 - a);
    problem.text = `${fVN(a)} + ${fVN(b)} = ?`;
    problem.answer = a + b;
} else {
    const a = rand(200000, 999999);
    const b = rand(10000, a - 10000);
    problem.text = `${fVN(a)} - ${fVN(b)} = ?`;
    problem.answer = a - b;
}
// fVN: format 1.234.567 dùng regex replace
```

#### `decimal`
```js
// Tránh floating point error: dùng integer math × 10
const a1 = rand(1, 20), a2 = rand(1, 9);  // a = a1.a2
const b1 = rand(1, 15), b2 = rand(1, 9);  // b = b1.b2
const op = Math.random() > 0.5 ? '+' : '-';
const aInt = a1 * 10 + a2, bInt = b1 * 10 + b2;
if (op === '-') {
    const bigInt = Math.max(aInt, bInt), smallInt = Math.min(aInt, bInt);
    problem.text = `${(bigInt/10).toFixed(1)} - ${(smallInt/10).toFixed(1)} = ?`;
    problem.answer = ((bigInt - smallInt) / 10).toFixed(1);  // string "2.3"
} else {
    problem.text = `${(aInt/10).toFixed(1)} + ${(bInt/10).toFixed(1)} = ?`;
    problem.answer = ((aInt + bInt) / 10).toFixed(1);
}
problem.isDecimal = true;
// Input: type="text" với pattern validation (chấp nhận dấu phẩy hoặc chấm)
// Normalize input: replace ',' → '.' trước khi compare
```

#### `fraction_compare`
```js
const DENOMS = [2, 3, 4, 5, 6, 8, 10];
const d1 = randFrom(DENOMS), d2 = randFrom(DENOMS);
const n1 = rand(1, d1 - 1), n2 = rand(1, d2 - 1);
problem.text = `${n1}/${d1} ... ${n2}/${d2}`;
problem.answer = n1 * d2 > n2 * d1 ? '>' : (n1 * d2 < n2 * d1 ? '<' : '=');
problem.isCompare = true;  // tái dùng UI compare buttons
// Hiển thị đặc biệt: render dạng phân số (tử/mẫu) thay vì "1/2"
```

#### `square_geometry`
```js
const side = rand(5, 30);
const isArea = Math.random() > 0.5;
if (isArea) {
    problem.text = `Diện tích hình vuông cạnh ${side}cm: ? cm²`;
    problem.answer = side * side;
} else {
    problem.text = `Chu vi hình vuông cạnh ${side}cm: ? cm`;
    problem.answer = side * 4;
}
```

#### `word_problem4`
```js
const WORD_TEMPLATES_4 = [
    () => { const p = rand(1,9)*1000+500, q = rand(2,9);
            return { text: `Mua ${q} quyển vở, mỗi quyển ${fVN(p)}đ. Tổng tiền phải trả?`, answer: p * q }; },
    () => { const total = rand(5,20)*10000, spent = rand(1,4)*10000;
            return { text: `Có ${fVN(total)}đ, mua đồ hết ${fVN(spent)}đ. Còn lại bao nhiêu?`, answer: total - spent }; },
    () => { const perDay = rand(10,50), days = rand(2,6);
            return { text: `Mỗi ngày đọc ${perDay} trang. ${days} ngày đọc bao nhiêu trang?`, answer: perDay * days }; },
    () => { const groups = rand(2,5), q = rand(10,50), r = rand(0, groups-1);
            const total = groups * q + r;
            const hasRem = r > 0;
            const text = hasRem
                ? `${fVN(total)} cái kẹo chia cho ${groups} bạn. Mỗi bạn được mấy cái, còn dư mấy cái?`
                : `${fVN(total)} cái kẹo chia đều ${groups} bạn. Mỗi bạn được mấy cái?`;
            return { text, quotient: q, remainder: r, isDivide: true }; },
    () => { const w = rand(5,30), h = rand(5,25);
            return { text: `Vườn hình chữ nhật dài ${w}m, rộng ${h}m. Diện tích là bao nhiêu m²?`, answer: w * h }; },
    () => { const a = rand(100,500), b = rand(10,50), c = rand(2,8);
            return { text: `Một hộp có ${a} cái. ${b} hộp có bao nhiêu cái?`, answer: a * b }; },
];
```

### Helper `formatVN(n)`

Thêm vào `js/state.js` (export):
```js
export function formatVN(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
```

Dùng `fVN` là alias ngắn trong generators.

### Tái phân bổ xác suất

**Lớp 1:**
```js
const types1 = [
  'add','add','add',           // 15%
  'sub','sub','sub',           // 15%
  'two_step','two_step','two_step', // 15%
  'compare','compare',         // 10%
  'missing','missing',         // 10%
  'clock','clock',             // 10%
  'sequence','sequence',       // 10%
  'simple_word','simple_word', // 10%
  'odd_even',                  // 5%
];
```

**Lớp 4:**
```js
const pool4 = [
  'multiply','multiply',
  'divide','divide',
  'fraction','fraction','fraction',
  'simplify_fraction','simplify_fraction',
  'expression','expression',
  'find_x','find_x',
  'geometry',
  'large_add_sub','large_add_sub','large_add_sub',
  'decimal','decimal',
  'fraction_compare','fraction_compare',
  'square_geometry',
  'word_problem4','word_problem4','word_problem4',
];
```

### UI cho `two_step` và `decimal`

- `two_step`: dùng input `type="number"` bình thường (answer là integer)
- `decimal`: dùng input `type="text"` — normalize `,` → `.` khi check; so sánh `parseFloat(userInput).toFixed(1) === problem.answer`
- `odd_even`: 2 buttons "Chẵn" / "Lẻ" (thêm `isOddEven` flag, tương tự `isCompare`)
- `fraction_compare`: tái dùng compare buttons hiện có
- `word_problem4` có remainder: tái dùng divide input (thương + số dư) khi `isDivide: true`

### Hiển thị câu hỏi `two_step` và `fraction_compare`

`renderQuestion()` trong `game-engine.js`:
- `two_step`: hiển thị biểu thức đầy đủ trong `qText` (không cắt theo `=`)
- `fraction_compare`: render mỗi phân số dạng HTML:
  ```html
  <span class="frac"><sup>3</sup><span>/</span><sub>4</sub></span>
  <span class="ellipsis"> ... </span>
  <span class="frac"><sup>5</sup><span>/</span><sub>8</sub></span>
  ```

## Related Code Files

- Modify: `js/game-engine.js` — thêm generators, cập nhật `renderQuestion` (cases mới), cập nhật `checkAnswer` (cases mới), cập nhật pools tỷ lệ
- Modify: `js/state.js` — thêm `formatVN()` export
- Modify: `index.html` — không cần thay đổi HTML structure (tái dùng existing input layouts)
- Modify: `style.css` — thêm `.frac` style cho fraction_compare display

## CSS cho fraction display

```css
.frac {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.1;
  vertical-align: middle;
}
.frac sup, .frac sub { font-size: inherit; }
.frac span { width: 100%; height: 3px; background: var(--text-main); display: block; margin: 2px 0; }
```

## Implementation Steps

1. Thêm `formatVN(n)` vào `js/state.js`
2. **Lớp 1 — cập nhật ranges**: Sửa `generateGrade1Problem()`:
   - `add`: a ≤ 7000, b ≤ 2999, tổng ≤ 9999
   - `sub`: a ≤ 9999, b < a
   - `compare`: a,b trong 100-9999
   - `missing`: trong 9999
3. **Lớp 1 — thêm generators**: `two_step`, `sequence`, `odd_even`, `simple_word`
4. **Lớp 1 — cập nhật pool** xác suất
5. **Lớp 1 — cập nhật `renderQuestion`**: thêm case `isOddEven` (2 buttons Chẵn/Lẻ)
6. **Lớp 1 — cập nhật `checkAnswer`**: thêm case `isOddEven`
7. **Lớp 4 — thêm generators**: `large_add_sub`, `decimal`, `fraction_compare`, `square_geometry`, `word_problem4`
8. **Lớp 4 — cập nhật pool** xác suất
9. **Lớp 4 — cập nhật `renderQuestion`**:
   - `isDecimal`: input type="text"
   - `fraction_compare`: HTML frac display + compare buttons
10. **Lớp 4 — cập nhật `checkAnswer`**:
    - `isDecimal`: normalize input, so sánh `toFixed(1)`
    - `word_problem4` với `isDivide`: tái dùng divide check logic
11. **Cập nhật `showResultDetails`**: thêm hiển thị đáp án đúng cho `isDecimal`, `isOddEven`, `two_step`, `fraction_compare`
12. Kiểm tra tất cả 16 question types không bị lỗi

## Success Criteria

- [ ] Lớp 1: `two_step` sinh bài đúng, không âm, answer chính xác
- [ ] Lớp 1: `sequence` hiển thị dãy 5 số, ô trống đúng vị trí
- [ ] Lớp 1: `odd_even` buttons hoạt động, chấm điểm đúng
- [ ] Lớp 1: `simple_word` text rõ ràng, phù hợp lứa tuổi
- [ ] Lớp 1: add/sub với số hàng ngàn không bị overflow
- [ ] Lớp 4: `decimal` input chấp nhận cả dấu phẩy và chấm
- [ ] Lớp 4: `fraction_compare` render phân số đẹp, compare buttons hoạt động
- [ ] Lớp 4: `word_problem4` tất cả 6 templates sinh được câu hỏi hợp lệ
- [ ] Lớp 4: `large_add_sub` số format đúng (dấu chấm hàng nghìn)
- [ ] Không có NaN, Infinity, hoặc kết quả âm trong bất kỳ generator nào
- [ ] Tỷ lệ phân bổ dạng bài đúng với pool mới

## Risk Assessment

- **Floating point decimal**: Giải quyết bằng integer math × 10 — không dùng `0.1 + 0.2` trực tiếp
- **`two_step` kết quả âm**: Thêm guard — nếu op2 là `-`, đảm bảo phần còn lại dương trước khi gen
- **`word_problem4` template với remainder**: Generator tự quyết định có dư hay không, đề bài nói rõ "còn dư mấy cái?" khi có dư; UI luôn show 2 input (thương + số dư, dư=0 nếu chia hết) <!-- Updated: Validation Session 1 -->
- **`sequence` ô trống ở đầu/cuối**: Chỉ chọn index 1-3 (không chọn index 0 hoặc 4) để không quá dễ
