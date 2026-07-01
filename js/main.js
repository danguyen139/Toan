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
    btnRedeemClose: document.getElementById('btn-redeem-close'),
    btnCompensate: document.getElementById('btn-compensate'),
    compensateModal: document.getElementById('compensate-modal'),
    compensatePassword: document.getElementById('compensate-password'),
    compensateError: document.getElementById('compensate-error'),
    btnCompensateConfirm: document.getElementById('btn-compensate-confirm'),
    btnCompensateClose: document.getElementById('btn-compensate-close'),
    subjectSelectionScreen: document.getElementById('subject-selection-screen'),
    btnSwitchSubject: document.getElementById('btn-switch-subject'),
};

function updateStickerField(theme) {
    const girlPool = [
        'cat.png', 'elsa.png', 'rabbit.png', 'hello_kitty.png',
        'panda.png', 'doraemon.png', 'kirby.svg', 'totoro.svg', 'stitch.svg'
    ];
    const boyPool = [
        'hero_iron.png', 'hero_spider.png', 'hero_cap.png', 'minion.png',
        'pikachu.png', 'hero_bat.png', 'hulk.svg', 'sonic.svg', 'goku.svg'
    ];
    const pool = (theme === 'girl' ? girlPool : boyPool)
        .sort(() => Math.random() - 0.5)
        .slice(0, 6);
    document.querySelectorAll('#sticker-field .sticker').forEach((el, i) => {
        if (pool[i]) el.src = `assets/${pool[i]}`;
    });
}

function startApp(grade, theme) {
    state.currentGrade = grade;
    state.currentTheme = theme;
    elements.appBody.setAttribute('data-theme', theme);
    updateStickerField(theme);

    elements.selectionScreen.classList.add('hidden');
    elements.subjectSelectionScreen.classList.remove('hidden');

    const pool = theme === 'girl' ? girlMascots : boyMascots;
    elements.mascotIcon.src = `assets/${pool[Math.floor(Math.random() * pool.length)]}`;
    elements.mascotCompanion.classList.add('pop-in');
    setTimeout(() => elements.mascotCompanion.classList.remove('pop-in'), 600);

    checkStreakBreak(theme);
    checkDailyLogin(theme);
}

function startSubject(subject) {
    state.currentSubject = subject;
    elements.subjectSelectionScreen.classList.add('hidden');
    elements.mainContainer.classList.remove('hidden');

    const theme = state.currentTheme;
    resetStats();
    initTimer();
    renderStreakBar(theme);
    renderQuestion();
}

function resetToSelection() {
    if (state.timerInterval) clearInterval(state.timerInterval);
    elements.mainContainer.classList.add('hidden');
    elements.subjectSelectionScreen?.classList.add('hidden');
    elements.selectionScreen.classList.remove('hidden');
    elements.appBody.removeAttribute('data-theme');
    elements.streakBar?.classList.add('hidden');
    const mixed = ['kirby.svg', 'pikachu.png', 'hello_kitty.png', 'sonic.svg', 'totoro.svg', 'goku.svg'];
    document.querySelectorAll('#sticker-field .sticker').forEach((el, i) => {
        if (mixed[i]) el.src = `assets/${mixed[i]}`;
    });
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
document.getElementById('select-math')?.addEventListener('click', () => startSubject('math'));
document.getElementById('select-english')?.addEventListener('click', () => startSubject('english'));
elements.btnSwitchSubject?.addEventListener('click', () => {
    elements.mainContainer.classList.add('hidden');
    elements.subjectSelectionScreen.classList.remove('hidden');
});
elements.btnBack?.addEventListener('click', resetToSelection);
elements.btnCheck?.addEventListener('click', checkAnswer);
elements.btnNext?.addEventListener('click', renderQuestion);
elements.btnRedeem?.addEventListener('click', openRedeemModal);
elements.btnRedeemConfirm?.addEventListener('click', handleRedeem);
elements.btnRedeemClose?.addEventListener('click', () => elements.redeemModal?.classList.add('hidden'));

elements.btnCompensate?.addEventListener('click', () => {
    if (elements.compensatePassword) elements.compensatePassword.value = '';
    elements.compensateError?.classList.add('hidden');
    elements.compensateModal?.classList.remove('hidden');
    setTimeout(() => elements.compensatePassword?.focus(), 100);
});

function handleCompensate() {
    const pwd = elements.compensatePassword?.value || '';
    if (pwd === 'MeoGau') {
        compensateStreak(state.currentTheme);
        renderStreakBar(state.currentTheme);
        elements.compensateModal?.classList.add('hidden');
    } else {
        elements.compensateError?.classList.remove('hidden');
        if (elements.compensatePassword) elements.compensatePassword.value = '';
        elements.compensatePassword?.focus();
    }
}

elements.btnCompensateConfirm?.addEventListener('click', handleCompensate);
elements.compensatePassword?.addEventListener('keypress', e => { if (e.key === 'Enter') handleCompensate(); });
elements.btnCompensateClose?.addEventListener('click', () => elements.compensateModal?.classList.add('hidden'));
