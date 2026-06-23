---
phase: 3
title: "Animations & Visual Effects"
status: pending
priority: P2
dependencies: [phase-01-bug-fix-mobile-ux, phase-02-streak-stars-system]
---

# Phase 3: Animations & Visual Effects

## Overview

Thêm Lottie Web animation cho các milestone quan trọng (streak achieved, star milestone) và nâng cấp CSS animations cho gameplay thường ngày (floating particles, glow effects).

## Requirements

- **Không dùng Lottie** — CSS-only, không phụ thuộc JSON files hay CDN ngoài
- Milestone overlay: full-screen CSS animation, tự đóng sau 2.5s — trigger khi đạt 30 câu đúng và khi vượt mốc sao
- Star milestones: 50, 100, 200, 500, 1000 sao
- Gameplay thường: floating emoji particles khi đúng, glow pulse cho bonus mode
- Không ảnh hưởng performance — animation chỉ play khi triggered, không loop idle

<!-- Updated: Validation Session 1 - Removed Lottie; CSS-only approach -->

## Architecture

### CSS Milestone Overlay (không cần Lottie)

Không cần CDN Lottie hay JSON files. Dùng CSS animation thuần + DOM manipulation.

### Overlay Container (index.html)

```html
<!-- Milestone overlay — thêm trước </body> -->
<div id="milestone-overlay" class="milestone-overlay hidden">
  <div class="milestone-content">
    <div class="milestone-emoji" id="milestone-emoji">🔥</div>
    <p class="milestone-message" id="milestone-message"></p>
  </div>
</div>
```

### Module: `js/effects.js` (cập nhật từ Phase 1)

```js
export function playMilestoneOverlay(emoji, message) {
    const overlay = document.getElementById('milestone-overlay');
    document.getElementById('milestone-emoji').textContent = emoji;
    document.getElementById('milestone-message').textContent = message;
    overlay.classList.remove('hidden');
    overlay.classList.add('milestone-show');
    setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.classList.remove('milestone-show');
    }, 2500);
}

// Floating emoji particles (thuần CSS + JS)
export function spawnParticles(emoji, count = 8) {
    const container = document.querySelector('.question-container');
    for (let i = 0; i < count; i++) {
        const el = document.createElement('span');
        el.className = 'particle';
        el.textContent = emoji;
        el.style.setProperty('--x', `${Math.random() * 100}%`);
        el.style.setProperty('--delay', `${Math.random() * 0.3}s`);
        container.appendChild(el);
        setTimeout(() => el.remove(), 1200);
    }
}

export function showSuccess(theme, streakAchievedToday) {
    // confetti (giữ từ Phase 1)
    const colors = theme === 'girl'
        ? ['#d946ef', '#f472b6', '#ffffff']
        : ['#2563eb', '#dc2626', '#fcd34d'];
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.75 }, colors });

    // Particles emoji theo theme
    const emoji = theme === 'girl' ? '⭐' : '💥';
    spawnParticles(emoji, streakAchievedToday ? 12 : 8);

    // ... rest of praise logic
}

export function triggerStreakCelebration(streakCount) {
    playMilestoneOverlay('🔥', `${streakCount} ngày liên tục! Tuyệt vời!`);
}

export function triggerStarMilestone(stars) {
    playMilestoneOverlay('⭐', `Đạt ${stars} sao! Xuất sắc!`);
}
```

### Star Milestone Check

Trong `game-engine.js`, sau khi `addStars()`:
```js
const STAR_MILESTONES = [50, 100, 200, 500, 1000];
const newStars = getGlobalState(theme).stars;
const prevStars = newStars - delta;
const crossed = STAR_MILESTONES.find(m => prevStars < m && newStars >= m);
if (crossed) triggerStarMilestone(crossed);
```

## Related Code Files

- Modify: `index.html` — thêm milestone-overlay div (không cần CDN mới)
- Modify: `js/effects.js` — thêm `playMilestoneOverlay`, `spawnParticles`, `triggerStreakCelebration`, `triggerStarMilestone`
- Modify: `js/game-engine.js` — gọi `triggerStreakCelebration` và star milestone check
- Modify: `style.css` — milestone-overlay CSS, particle animation, bonus-mode glow pulse

## CSS Additions

```css
/* Milestone overlay — CSS only, no Lottie */
.milestone-overlay {
  position: fixed; inset: 0; z-index: 2000;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  animation: milestone-fade 2.5s ease forwards;
}
.milestone-content { text-align: center; }
.milestone-emoji {
  font-size: 8rem; display: block;
  animation: milestone-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.milestone-message {
  color: white; font-size: 1.8rem; font-weight: 800;
  text-align: center; margin-top: 16px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
}

@keyframes milestone-fade {
  0%   { opacity: 1; }
  80%  { opacity: 1; }
  100% { opacity: 0; pointer-events: none; }
}
@keyframes milestone-pop {
  0%   { transform: scale(0) rotate(-20deg); }
  70%  { transform: scale(1.3) rotate(10deg); }
  100% { transform: scale(1) rotate(0deg); }
}

/* Floating particles */
.particle {
  position: absolute;
  left: var(--x);
  bottom: 20%;
  font-size: 1.5rem;
  animation: particle-float 1.2s ease-out var(--delay) forwards;
  pointer-events: none;
  z-index: 100;
}
@keyframes particle-float {
  0%   { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-120px) scale(0.5); opacity: 0; }
}

/* Bonus mode glow pulse */
.question-box.bonus-mode {
  animation: bonus-glow 2s ease-in-out infinite;
}
@keyframes bonus-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.3); }
  50%       { box-shadow: 0 0 40px rgba(255,215,0,0.7); }
}
```

## Implementation Steps

1. Thêm `#milestone-overlay` div vào `index.html` (không cần CDN mới)
2. Cập nhật `js/effects.js`: thêm `playMilestoneOverlay`, `spawnParticles`, `triggerStreakCelebration`, `triggerStarMilestone`; cập nhật `showSuccess` gọi `spawnParticles`
3. Cập nhật `js/game-engine.js`: sau `checkStreakAchievement` trả true → `triggerStreakCelebration(streakCount)`; sau `addStars` → check star milestones
4. Thêm CSS vào `style.css`: `@keyframes milestone-fade`, `@keyframes milestone-pop`, `.particle` float, bonus-mode glow pulse
5. Test: gọi `triggerStreakCelebration(5)` qua DevTools console để kiểm tra overlay

## Success Criteria

- [ ] Milestone overlay xuất hiện và tự đóng sau 2.5s khi đạt 30 câu đúng
- [ ] Milestone overlay xuất hiện khi vượt mốc sao (50, 100, 200, 500, 1000)
- [ ] Emoji milestone animate pop-in đẹp
- [ ] Particles nổi lên khi trả lời đúng
- [ ] Bonus mode card có glow pulse animation
- [ ] Overlay không block input sau khi đóng
- [ ] Không cần download file hay CDN ngoài

## Risk Assessment

- **Animation lag trên mobile cũ**: Thêm `@media (prefers-reduced-motion: reduce)` để tắt animation nếu cần
- **Overlay bị hiện nhiều lần** (star milestone + streak cùng lúc): Dùng queue đơn giản — nếu overlay đang show, delay cái sau 2.6s
