const elements = {
    appBody: document.getElementById('app-body'),
    selectionScreen: document.getElementById('selection-screen'),
    mainContainer: document.getElementById('main-container'),
    selectGirl: document.getElementById('select-girl'),
    selectBoy: document.getElementById('select-boy'),
    btnBack: document.getElementById('btn-back'),
    btnCheck: document.getElementById('btn-check'),
    btnNext: document.getElementById('btn-next'),
    mascotCompanion: document.getElementById('mascot-companion'),
    mascotIcon: document.getElementById('mascot-icon'),
    streakBar: document.getElementById('streak-bar'),
    btnRedeem: document.getElementById('btn-redeem'),
    redeemModal: document.getElementById('redeem-modal'),
    redeemAmount: document.getElementById('redeem-amount'),
    redeemRemainingVal: document.getElementById('redeem-remaining-val'),
    btnRedeemConfirm: document.getElementById('btn-redeem-confirm'),
    btnRedeemClose: document.getElementById('btn-redeem-close')
};

function startApp(grade, theme) {
    state.currentGrade = grade;
    state.currentTheme = theme;
    elements.appBody.setAttribute('data-theme', theme);

    elements.selectionScreen.classList.add('hidden');
    elements.mainContainer.classList.remove('hidden');

    const pool = theme === 'girl' ? girlMascots : boyMascots;
    elements.mascotIcon.src = `assets/${pool[Math.floor(Math.random() * pool.length)]}`;
    elements.mascotCompanion.classList.add('pop-in');
    setTimeout(() => elements.mascotCompanion.classList.remove('pop-in'), 600);

    checkStreakBreak(theme);
    checkDailyLogin(theme);

    resetStats();
    initTimer();
    renderStreakBar(theme);
    renderQuestion();
}

function resetToSelection() {
    if (state.timerInterval) clearInterval(state.timerInterval);
    elements.mainContainer.classList.add('hidden');
    elements.selectionScreen.classList.remove('hidden');
    elements.appBody.removeAttribute('data-theme');
    elements.streakBar?.classList.add('hidden');
}

function openRedeemModal() {
    const global = loadGlobal(state.currentTheme);
    const starsEl = document.getElementById('redeem-stars-val');
    const streakEl = document.getElementById('redeem-streak-val');
    if (starsEl) starsEl.textContent = global.stars;
    if (streakEl) streakEl.textContent = global.streak;
    if (elements.redeemRemainingVal) elements.redeemRemainingVal.textContent = global.stars;
    if (elements.redeemAmount) elements.redeemAmount.value = '';
    elements.redeemModal?.classList.remove('hidden');
}

function handleRedeem() {
    const amount = parseInt(elements.redeemAmount?.value) || 0;
    if (amount <= 0) return;
    const newStars = addStars(state.currentTheme, -amount);
    if (elements.redeemRemainingVal) elements.redeemRemainingVal.textContent = newStars;
    const starsEl = document.getElementById('redeem-stars-val');
    if (starsEl) starsEl.textContent = newStars;
    renderStreakBar(state.currentTheme);
    const btn = elements.btnRedeemConfirm;
    if (btn) {
        const orig = btn.textContent;
        btn.textContent = '✓ Đã đổi!';
        setTimeout(() => { btn.textContent = orig; }, 1500);
    }
}

// Mobile keyboard: scroll question into view when virtual keyboard appears
window.visualViewport?.addEventListener('resize', () => {
    document.getElementById('question-box')
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// Live update remaining stars as user types redeem amount
elements.redeemAmount?.addEventListener('input', () => {
    const global = loadGlobal(state.currentTheme);
    const amount = parseInt(elements.redeemAmount.value) || 0;
    const remaining = Math.max(0, global.stars - amount);
    if (elements.redeemRemainingVal) elements.redeemRemainingVal.textContent = remaining;
});

elements.selectGirl?.addEventListener('click', () => startApp(4, 'girl'));
elements.selectBoy?.addEventListener('click', () => startApp(1, 'boy'));
elements.btnBack?.addEventListener('click', resetToSelection);
elements.btnCheck?.addEventListener('click', checkAnswer);
elements.btnNext?.addEventListener('click', renderQuestion);
elements.btnRedeem?.addEventListener('click', openRedeemModal);
elements.btnRedeemConfirm?.addEventListener('click', handleRedeem);
elements.btnRedeemClose?.addEventListener('click', () => elements.redeemModal?.classList.add('hidden'));
