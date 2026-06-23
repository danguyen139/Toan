let milestoneQueue = [];
let milestoneActive = false;

// ── Reaction sticker popup on correct answer ──
function showReactionSticker() {
    const pool = state.currentTheme === 'girl' ? girlMascots : boyMascots;
    const src = `assets/${pool[Math.floor(Math.random() * pool.length)]}`;
    const el = document.createElement('img');
    el.src = src;
    el.alt = '';
    el.className = 'reaction-sticker';
    // Slight random x offset so it doesn't always centre-dead
    const offsetX = (Math.random() - 0.5) * 120;
    el.style.marginLeft = `${offsetX}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1900);
}

// ── Floating "+2⭐" / "+3⭐" score badge ──
function showScorePopup() {
    const container = document.querySelector('.question-container');
    if (!container) return;
    const delta = state.streakAchievedToday ? 3 : 2;
    const el = document.createElement('div');
    el.className = 'score-popup';
    el.textContent = `+${delta}⭐`;
    container.appendChild(el);
    setTimeout(() => el.remove(), 1300);
}

// ── Combo announcement at 5 / 10 / 15 / 20 ──
function showComboEffect(count) {
    const milestones = {
        5:  { emoji: '🔥', msg: 'COMBO x5! Không thể dừng!' },
        10: { emoji: '⚡', msg: 'COMBO x10! Siêu đỉnh luôn!' },
        15: { emoji: '💫', msg: 'COMBO x15! Vô địch rồi!' },
        20: { emoji: '🌟', msg: 'COMBO x20! Huyền thoại!!' }
    };
    const hit = milestones[count];
    if (hit) playMilestoneOverlay(hit.emoji, hit.msg);
}

// ── Card pulse glow on correct ──
function pulseCard() {
    const card = document.querySelector('.question-container');
    if (!card) return;
    card.classList.add('correct-flash');
    setTimeout(() => card.classList.remove('correct-flash'), 700);
}

// ── Multi-emoji particles ──
function spawnParticles(emojiPool, count = 10) {
    const container = document.querySelector('.question-container');
    if (!container) return;
    const pool = Array.isArray(emojiPool) ? emojiPool : [emojiPool];
    for (let i = 0; i < count; i++) {
        const el = document.createElement('span');
        el.className = 'particle';
        el.textContent = pool[Math.floor(Math.random() * pool.length)];
        el.style.setProperty('--x', `${Math.random() * 80 + 10}%`);
        el.style.setProperty('--delay', `${Math.random() * 0.4}s`);
        container.appendChild(el);
        setTimeout(() => el.remove(), 1500);
    }
}

function showSuccess() {
    // Combo tracking
    state.consecutiveCorrect = (state.consecutiveCorrect || 0) + 1;

    showReactionSticker();
    showScorePopup();
    pulseCard();
    showComboEffect(state.consecutiveCorrect);

    const isGirl = state.currentTheme === 'girl';
    const colors = isGirl
        ? ['#d946ef', '#f472b6', '#ffffff', '#fbbf24', '#a78bfa']
        : ['#2563eb', '#dc2626', '#fcd34d', '#10b981', '#f97316'];

    // Main centre burst
    confetti({
        particleCount: 130,
        spread: 90,
        origin: { y: 0.72 },
        colors,
        shapes: ['star', 'circle'],
        scalar: 1.25,
        disableForReducedMotion: true
    });

    // Side cannon bursts 220ms later
    setTimeout(() => {
        confetti({ particleCount: 45, angle: 60,  spread: 55, origin: { x: 0 },   colors, scalar: 1.1, disableForReducedMotion: true });
        confetti({ particleCount: 45, angle: 120, spread: 55, origin: { x: 1 },   colors, scalar: 1.1, disableForReducedMotion: true });
    }, 220);

    const emojiPool = isGirl ? ['⭐', '💖', '🌸', '✨', '🦋'] : ['💥', '⚡', '🔥', '💫', '⭐'];
    spawnParticles(emojiPool, state.streakAchievedToday ? 16 : 12);

    const pool = isGirl ? girlPraise : boyPraise;
    const msg = pool[Math.floor(Math.random() * pool.length)];
    const praiseEl = document.getElementById('praise-message');
    if (praiseEl) { praiseEl.textContent = msg; praiseEl.style.color = 'var(--primary)'; }

    const companion = document.getElementById('mascot-companion');
    const icon = document.getElementById('mascot-icon');
    if (companion && icon) {
        companion.classList.remove('mascot-happy', 'pop-in');
        void companion.offsetWidth;
        companion.classList.add('mascot-happy');
        const mascotPool = isGirl ? girlMascots : boyMascots;
        icon.src = `assets/${mascotPool[Math.floor(Math.random() * mascotPool.length)]}`;
        companion.classList.add('pop-in');
        setTimeout(() => companion.classList.remove('pop-in'), 600);
    }

    const fbEl = document.getElementById('feedback-text');
    const rfEl = document.getElementById('result-feedback');
    if (fbEl) fbEl.textContent = 'Chính xác tuyệt đối!';
    if (rfEl) rfEl.className = 'result-feedback feedback-correct';
}

function showError() {
    state.consecutiveCorrect = 0;

    const msg = encouragements[Math.floor(Math.random() * encouragements.length)];
    const praiseEl = document.getElementById('praise-message');
    if (praiseEl) { praiseEl.textContent = msg; praiseEl.style.color = 'var(--error)'; }

    const card = document.querySelector('.question-container');
    if (card) {
        card.classList.add('shake', 'error-flash');
        setTimeout(() => card.classList.remove('shake', 'error-flash'), 700);
    }

    const fbEl = document.getElementById('feedback-text');
    const rfEl = document.getElementById('result-feedback');
    if (fbEl) fbEl.textContent = 'Chưa đúng rồi con ơi!';
    if (rfEl) rfEl.className = 'result-feedback feedback-wrong';
}

function playMilestoneOverlay(emoji, message) {
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

function triggerStreakCelebration(streakCount) {
    playMilestoneOverlay('🔥', `${streakCount} ngày liên tục! Tuyệt vời!`);
}

function triggerStarMilestone(stars) {
    playMilestoneOverlay('⭐', `Đạt ${stars} sao! Xuất sắc!`);
}
