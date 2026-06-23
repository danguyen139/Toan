import { state, girlPraise, boyPraise, encouragements, girlMascots, boyMascots } from './state.js';

let milestoneQueue = [];
let milestoneActive = false;

export function showSuccess() {
    const colors = state.currentTheme === 'girl'
        ? ['#d946ef', '#f472b6', '#ffffff']
        : ['#2563eb', '#dc2626', '#fcd34d'];
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.75 }, colors });

    const emoji = state.currentTheme === 'girl' ? '⭐' : '💥';
    spawnParticles(emoji, state.streakAchievedToday ? 12 : 8);

    const pool = state.currentTheme === 'girl' ? girlPraise : boyPraise;
    const msg = pool[Math.floor(Math.random() * pool.length)];
    const praiseEl = document.getElementById('praise-message');
    if (praiseEl) { praiseEl.textContent = msg; praiseEl.style.color = 'var(--primary)'; }

    const companion = document.getElementById('mascot-companion');
    const icon = document.getElementById('mascot-icon');
    if (companion && icon) {
        companion.classList.remove('mascot-happy', 'pop-in');
        void companion.offsetWidth;
        companion.classList.add('mascot-happy');
        const mascotPool = state.currentTheme === 'girl' ? girlMascots : boyMascots;
        icon.src = `assets/${mascotPool[Math.floor(Math.random() * mascotPool.length)]}`;
        companion.classList.add('pop-in');
        setTimeout(() => companion.classList.remove('pop-in'), 600);
    }

    const fbEl = document.getElementById('feedback-text');
    const rfEl = document.getElementById('result-feedback');
    if (fbEl) fbEl.textContent = 'Chính xác tuyệt đối!';
    if (rfEl) rfEl.className = 'result-feedback feedback-correct';
}

export function showError() {
    const msg = encouragements[Math.floor(Math.random() * encouragements.length)];
    const praiseEl = document.getElementById('praise-message');
    if (praiseEl) { praiseEl.textContent = msg; praiseEl.style.color = 'var(--error)'; }

    const card = document.querySelector('.question-container');
    if (card) {
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 600);
    }

    const fbEl = document.getElementById('feedback-text');
    const rfEl = document.getElementById('result-feedback');
    if (fbEl) fbEl.textContent = 'Chưa đúng rồi con ơi!';
    if (rfEl) rfEl.className = 'result-feedback feedback-wrong';
}

export function spawnParticles(emoji, count = 8) {
    const container = document.querySelector('.question-container');
    if (!container) return;
    for (let i = 0; i < count; i++) {
        const el = document.createElement('span');
        el.className = 'particle';
        el.textContent = emoji;
        el.style.setProperty('--x', `${Math.random() * 80 + 10}%`);
        el.style.setProperty('--delay', `${Math.random() * 0.3}s`);
        container.appendChild(el);
        setTimeout(() => el.remove(), 1400);
    }
}

export function playMilestoneOverlay(emoji, message) {
    milestoneQueue.push({ emoji, message });
    if (!milestoneActive) processNextMilestone();
}

function processNextMilestone() {
    if (milestoneQueue.length === 0) { milestoneActive = false; return; }
    milestoneActive = true;
    const { emoji, message } = milestoneQueue.shift();
    const overlay = document.getElementById('milestone-overlay');
    if (!overlay) { milestoneActive = false; return; }
    document.getElementById('milestone-emoji').textContent = emoji;
    document.getElementById('milestone-message').textContent = message;
    overlay.classList.remove('hidden');
    overlay.classList.add('milestone-show');
    setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.classList.remove('milestone-show');
        setTimeout(processNextMilestone, 100);
    }, 2500);
}

export function triggerStreakCelebration(streakCount) {
    playMilestoneOverlay('🔥', `${streakCount} ngày liên tục! Tuyệt vời!`);
}

export function triggerStarMilestone(stars) {
    playMilestoneOverlay('⭐', `Đạt ${stars} sao! Xuất sắc!`);
}
