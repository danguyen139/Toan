---
phase: 1
title: "Bug Fix & Mobile UX"
status: pending
priority: P1
dependencies: []
---

# Phase 1: Bug Fix & Mobile UX

## Overview

Sửa bug hiện có, tách `script.js` (537 dòng) thành ES modules để các phase sau dễ mở rộng, và fix vấn đề bàn phím ảo che câu hỏi trên mobile.

## Requirements

- Fix bug `state.appBody` → `elements.appBody` (script.js:94)
- Tách thành 5 ES module files, mỗi file ≤ 200 dòng
- `index.html` dùng `<script type="module" src="js/main.js">`
- Mobile: bàn phím ảo xuất hiện không che câu hỏi
- CSS: dùng `100dvh` thay `100vh`

## Architecture

Tách `script.js` theo ranh giới trách nhiệm:

```
js/state.js        — state object, constants, mascot pools, praise lists
js/stats.js        — timer, updateStatsUI, saveStats, loadStats, formatTime
js/game-engine.js  — generateGrade1Problem, generateGrade4Problem,
                     renderQuestion, checkAnswer, showResultDetails
js/effects.js      — showSuccess, showError (confetti + DOM feedback)
js/main.js         — startApp, resetToSelection, event wiring, DOM elements
```

`main.js` dùng `import` từ các module khác. Tất cả export named, không dùng default export.

Mobile keyboard fix dùng `visualViewport` API:
```js
window.visualViewport?.addEventListener('resize', () => {
    document.getElementById('question-box')
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
```

## Related Code Files

- Modify: `index.html` — thay `<script src="script.js">` thành `<script type="module" src="js/main.js">`; thêm `overflow: hidden` trên body
- Delete: `script.js` (sau khi tách xong)
- Create: `js/state.js`, `js/stats.js`, `js/game-engine.js`, `js/effects.js`, `js/main.js`
- Modify: `style.css` — đổi `min-height: 100vh` → `min-height: 100dvh`; thêm `scroll-margin-top` cho `.question-box`; thêm `overflow-y: auto` trên `.container`

## Implementation Steps

1. **Tạo thư mục** `js/`
2. **Tạo `js/state.js`**: Export `state` object (currentGrade, currentTheme, stats, currentProblem, timerInterval, selectedCompare), constants (girlPraise, boyPraise, encouragements, girlMascots, boyMascots)
3. **Tạo `js/stats.js`**: Export `getTodayString`, `formatTime`, `saveStats`, `loadStats`, `resetStats`, `initTimer`, `updateStatsUI` — import `state` từ state.js
4. **Tạo `js/effects.js`**: Export `showSuccess`, `showError` — import `state`, confetti từ window global
5. **Tạo `js/game-engine.js`**: Export `drawClockSVG`, `generateGrade1Problem`, `generateGrade4Problem`, `renderQuestion`, `checkAnswer`, `showResultDetails` — import `state`, `effects`, `stats`
6. **Tạo `js/main.js`**: Query DOM elements vào `elements` object (export), startApp, resetToSelection, event listeners — import tất cả modules
7. **Sửa bug**: Trong `resetToSelection` (nay ở main.js), dùng `elements.appBody.removeAttribute('data-theme')` thay vì `state.appBody`
8. **Cập nhật `index.html`**: Đổi script tag, giữ nguyên confetti CDN script (Lottie sẽ thêm ở Phase 3)
9. **Mobile CSS fix**: `style.css` — `body { min-height: 100dvh; }`, thêm `.question-box { scroll-margin-top: 20px; }`
10. **Mobile JS fix**: Trong `main.js` sau khi DOM ready, đăng ký `visualViewport resize` listener
11. **Kiểm tra**: Mở app trên Chrome DevTools mobile simulator — bấm input, kiểm tra câu hỏi còn nhìn thấy

## Success Criteria

- [ ] Bấm "Đổi bạn học" → quay về màn hình chọn không bị lỗi JS
- [ ] App hoạt động bình thường sau khi tách modules (tất cả question types)
- [ ] Trên mobile (DevTools 390×844), focus input → câu hỏi vẫn thấy được
- [ ] Không có `script.js` trong repo (đã được thay bằng `js/` folder)
- [ ] Mỗi file trong `js/` ≤ 200 dòng

## Risk Assessment

- **ES module circular import**: `game-engine` import `effects`, `effects` không import `game-engine` — không có vòng tròn
- **GitHub Pages ES module**: Hoạt động bình thường trên HTTP — đã xác nhận app chạy trên GitHub Pages
- **`confetti` global**: Vẫn load từ CDN script trước `main.js` module → window.confetti available trong effects.js
