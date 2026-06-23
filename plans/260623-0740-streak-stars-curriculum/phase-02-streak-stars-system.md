---
phase: 2
title: "Streak & Stars System"
status: pending
priority: P1
dependencies: [phase-01-bug-fix-mobile-ux]
---

# Phase 2: Streak & Stars System

## Overview

Thêm hệ thống gamification: streak ngày học liên tục, sao điểm thưởng tích luỹ vĩnh viễn, streak bar UI, và redeem modal để đổi sao lấy quà thực tế.

## Requirements

- Streak per-child (girl/boy riêng biệt), tăng 1 khi ngày đó ≥30 câu đúng lần đầu
- Streak reset về 0 nếu bỏ ngày (lastStreakDate < hôm qua - 1)
- Stars: +5 login mỗi ngày (1 lần), +2 correct (normal), +3 correct (bonus), -1 wrong (min 0)
- Bonus mode: bật sau khi đạt 30 câu đúng trong ngày, hiển thị badge + viền vàng
- Streak bar hiển thị giữa header và question card
- Redeem modal: trừ stars (min 0), streak chỉ hiển thị không trừ
- Tất cả global data persist vĩnh viễn trong localStorage

## Architecture

### Data Model

**`toan_global_{theme}`** (localStorage, vĩnh viễn):
```json
{
  "streak": 5,
  "lastStreakDate": "2026-6-23",
  "stars": 142,
  "totalSecondsAllTime": 72000,
  "dailyLoginDate": "2026-6-23"
}
```

**`toan_stats_grade_{grade}`** (localStorage, reset theo ngày — đã có, thêm field):
```json
{
  "date": "2026-6-23",
  "stats": {
    "startTime": "...",
    "totalQuestions": 0,
    "correctCount": 0,
    "wrongCount": 0,
    "secondsSpent": 0,
    "streakAchievedToday": false
  }
}
```

### New Module: `js/streak-stars.js`

```js
// Default shape — merge with stored data để handle missing fields gracefully
const GLOBAL_DEFAULTS = { streak: 0, lastStreakDate: '', stars: 0, totalSecondsAllTime: 0, dailyLoginDate: '' };

// Exports:
export function loadGlobal(theme)          // load toan_global_{theme}, merge với GLOBAL_DEFAULTS
export function saveGlobal(theme, data)    // save to localStorage
export function checkDailyLogin(theme)     // cấp +5 sao nếu chưa login hôm nay
export function checkStreakBreak(theme)    // reset streak nếu bỏ ngày
export function addStars(theme, delta)     // cộng/trừ sao, clamp ≥0, saveGlobal
export function checkStreakAchievement(theme, correctCount)
  // Trả về true nếu vừa đạt 30 lần đầu hôm nay
  // Side effects: streak++, lastStreakDate=today, saveGlobal
export function getGlobalState(theme)      // getter tiện lợi
```

### Streak Logic Chi Tiết

```
checkStreakBreak(theme):
  global = loadGlobal(theme)
  today = getTodayString()          // "2026-6-23"
  yesterday = getYesterdayString()
  if global.lastStreakDate < yesterday AND global.lastStreakDate !== "":
      global.streak = 0
      saveGlobal(theme, global)

checkStreakAchievement(theme, correctCount):
  if correctCount < 30: return false
  stats = loadStats()               // daily stats
  if stats.streakAchievedToday: return false   // đã đạt rồi
  global = loadGlobal(theme)
  global.streak += 1
  global.lastStreakDate = today
  saveGlobal(theme, global)
  stats.streakAchievedToday = true
  saveStats()
  return true                        // caller triggers celebration
```

### Bonus Mode

- `state.streakAchievedToday` = mirror của `stats.streakAchievedToday`
- Khi `checkAnswer()` và correct: delta = `state.streakAchievedToday ? 3 : 2`
- Question card thêm class `bonus-mode` khi `streakAchievedToday = true`

### HTML Additions (index.html)

```html
<!-- Thêm giữa <header> và <main> -->
<div id="streak-bar" class="streak-bar hidden">
  <div class="streak-info">
    <span class="streak-item">🔥 <strong id="streak-count">0</strong> ngày</span>
    <span class="streak-item">⭐ <strong id="stars-count">0</strong> sao</span>
    <span class="streak-item">🎯 <strong id="daily-correct-count">0</strong>/30</span>
  </div>
  <div class="streak-progress-wrap">
    <div id="streak-progress-fill" class="streak-progress-fill"></div>
  </div>
  <button id="btn-redeem" class="btn-redeem">🎁 Đổi quà</button>
</div>

<!-- Trước </body> -->
<div id="redeem-modal" class="modal-overlay hidden">
  <div class="modal-card">
    <h2>🎁 Đổi Quà</h2>
    <p>🔥 Streak: <strong id="redeem-streak-val">0</strong> ngày liên tục</p>
    <p>⭐ Sao tích luỹ: <strong id="redeem-stars-val">0</strong> sao</p>
    <div class="redeem-input-row">
      <label>Đổi bao nhiêu sao?</label>
      <input type="number" id="redeem-amount" min="1" placeholder="0">
    </div>
    <p class="redeem-remaining">Còn lại: <span id="redeem-remaining-val">0</span> sao</p>
    <div class="modal-actions">
      <button id="btn-redeem-confirm" class="btn btn-primary">Xác nhận</button>
      <button id="btn-redeem-close" class="btn btn-secondary">Đóng</button>
    </div>
  </div>
</div>
```

## Related Code Files

- Create: `js/streak-stars.js`
- Modify: `js/main.js` — gọi `checkDailyLogin`, `checkStreakBreak` trong `startApp`; thêm DOM elements cho streak-bar và modal; wire redeem button
- Modify: `js/game-engine.js` — `checkAnswer()` gọi `addStars()` và `checkStreakAchievement()`; trigger bonus mode
- Modify: `js/stats.js` — `resetStats()` đọc `streakAchievedToday` từ daily stats; `saveStats()` ghi `streakAchievedToday`; `initTimer()` cộng `secondsSpent` vào `totalSecondsAllTime` trước khi reset ngày
- Modify: `index.html` — thêm streak-bar HTML, redeem-modal HTML
- Modify: `style.css` — streak-bar styles, bonus-mode card, modal overlay/card, redeem button

## Implementation Steps

1. **Tạo `js/streak-stars.js`** với tất cả exports ở trên
2. **Thêm helper** `getYesterdayString()` vào `js/stats.js`
3. **Cập nhật `js/stats.js`**:
   - `resetStats()`: load `streakAchievedToday` từ daily stats → set vào `state`
   - `saveStats()`: ghi `state.streakAchievedToday` vào daily stats object
   - `initTimer()`: khi load ngày mới, cộng `secondsSpent` cũ vào `global.totalSecondsAllTime`
4. **Thêm HTML** streak-bar và redeem-modal vào `index.html`
5. **Cập nhật `js/main.js`**:
   - `startApp()`: gọi `checkStreakBreak(theme)`, `checkDailyLogin(theme)`, `renderStreakBar()`
   - Thêm `renderStreakBar()`: cập nhật DOM của streak-bar từ global state + daily correctCount
   - Wire `btn-redeem` → `openRedeemModal()`, `btn-redeem-confirm` → `handleRedeem()`, `btn-redeem-close` → đóng modal
   - `handleRedeem()`: đọc input amount, gọi `addStars(theme, -amount)`, cập nhật UI, show confirmation toast
6. **Cập nhật `js/game-engine.js`**:
   - `checkAnswer()` khi correct: `const delta = state.streakAchievedToday ? 3 : 2; addStars(theme, delta)`
   - `checkAnswer()` khi wrong: `addStars(theme, -1)`
   - Sau `state.stats.correctCount++`: gọi `checkStreakAchievement(theme, state.stats.correctCount)` → nếu true, gọi `triggerStreakCelebration()` (Phase 3 fill in)
   - Khi `streakAchievedToday` vừa = true: add class `bonus-mode` lên question-box
   - Gọi `renderStreakBar()` sau mỗi checkAnswer
7. **CSS** cho streak-bar, bonus-mode, modal (xem spec bên dưới)
8. **Kiểm tra edge cases**: bỏ 1 ngày → streak reset; redeem nhiều hơn số sao có → clamp 0; login 2 lần trong ngày → không cộng thêm +5

## CSS Spec

```css
.streak-bar {
  background: var(--glass-bg);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 20px;
  padding: 14px 20px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.streak-info { display: flex; gap: 20px; flex: 1; }
.streak-item { color: white; font-weight: 700; font-size: 1.1rem; }
.streak-progress-wrap { flex: 1; min-width: 120px; height: 10px; background: rgba(255,255,255,0.2); border-radius: 5px; overflow: hidden; }
.streak-progress-fill { height: 100%; background: var(--primary); border-radius: 5px; transition: width 0.4s ease; }
.btn-redeem { background: white; border: none; border-radius: 12px; padding: 8px 16px; font-weight: 700; cursor: pointer; font-family: inherit; }

/* Bonus mode */
.question-box.bonus-mode { border: 3px solid gold; box-shadow: 0 0 30px rgba(255,215,0,0.4); }
.bonus-badge { background: gold; color: #7a5c00; font-weight: 800; font-size: 0.9rem; padding: 4px 12px; border-radius: 20px; display: inline-block; margin-bottom: 10px; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-card { background: white; border-radius: 24px; padding: 32px; max-width: 400px; width: 90%; text-align: center; }
.modal-actions { display: flex; gap: 12px; justify-content: center; margin-top: 20px; }
.redeem-input-row { display: flex; flex-direction: column; gap: 8px; margin: 16px 0; }
.redeem-remaining { color: var(--text-muted); font-size: 0.9rem; }
```

## Success Criteria

- [ ] Streak tăng đúng khi correctCount đạt 30 lần đầu trong ngày
- [ ] Streak reset về 0 khi bỏ ngày học
- [ ] Không cộng streak quá 1 lần/ngày
- [ ] +5 sao chỉ cộng 1 lần/ngày kể cả switch giữa 2 bé
- [ ] Stars không xuống dưới 0
- [ ] Bonus mode (+3 sao) bật đúng sau khi đạt 30 câu đúng
- [ ] Redeem: nhập 50 sao, confirm → stars giảm 50, hiển thị số còn lại
- [ ] Streak bar hiển thị đúng streak, stars, tiến độ ngày
- [ ] `totalSecondsAllTime` tích luỹ qua nhiều ngày học

## Risk Assessment

- **Floating point date compare**: Dùng string "YYYY-M-D" format nhất quán, không dùng Date object để so sánh
- **Streak race condition** (correct câu 29 và 30 cùng lúc): Không xảy ra vì JS single-threaded
- **`totalSecondsAllTime` bị double-count**: Chỉ cộng vào khi detect ngày mới (date thay đổi), không phải mỗi lần load
