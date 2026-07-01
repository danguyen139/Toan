const GLOBAL_DEFAULTS = {
    streak: 0,
    lastStreakDate: '',
    stars: 0,
    totalSecondsAllTime: 0,
    dailyLoginDate: ''
};

function loadGlobal(theme) {
    try {
        const raw = localStorage.getItem(`toan_global_${theme}`);
        if (raw) return { ...GLOBAL_DEFAULTS, ...JSON.parse(raw) };
    } catch (e) {}
    return { ...GLOBAL_DEFAULTS };
}

function saveGlobal(theme, data) {
    try {
        localStorage.setItem(`toan_global_${theme}`, JSON.stringify(data));
    } catch (e) {}
}

function checkDailyLogin(theme) {
    const global = loadGlobal(theme);
    const today = getTodayString();
    if (global.dailyLoginDate !== today) {
        global.dailyLoginDate = today;
        global.stars += 5;
        saveGlobal(theme, global);
    }
}

function checkStreakBreak(theme) {
    const global = loadGlobal(theme);
    const yesterday = getYesterdayString();
    // normDate handles old non-padded dates stored before the format fix
    if (global.lastStreakDate && normDate(global.lastStreakDate) < yesterday) {
        global.streak = 0;
        saveGlobal(theme, global);
    }
}

function compensateStreak(theme) {
    const global = loadGlobal(theme);
    global.streak = (global.streak || 0) + 1;
    const yesterday = getYesterdayString();
    // Only set lastStreakDate to yesterday if it's currently older than yesterday.
    // If it's already yesterday or today, don't overwrite — prevents compensate
    // from breaking a valid streak the child already earned today.
    if (!global.lastStreakDate || normDate(global.lastStreakDate) < yesterday) {
        global.lastStreakDate = yesterday;
    }
    saveGlobal(theme, global);
}

function addStars(theme, delta) {
    const global = loadGlobal(theme);
    global.stars = Math.max(0, global.stars + delta);
    saveGlobal(theme, global);
    return global.stars;
}

function getStreakTarget() {
    return state.currentGrade === 1 ? 25 : 50;
}

function checkStreakAchievement(theme, correctCount) {
    if (correctCount < getStreakTarget()) return false;
    if (state.streakAchievedToday) return false;
    const global = loadGlobal(theme);
    global.streak += 1;
    global.lastStreakDate = getTodayString();
    saveGlobal(theme, global);
    state.streakAchievedToday = true;
    saveStats();
    return true;
}

function getGlobalState(theme) {
    return loadGlobal(theme);
}

function renderStreakBar(theme) {
    const bar = document.getElementById('streak-bar');
    if (!bar) return;
    const global = loadGlobal(theme);
    const correct = state.stats.correctCount || 0;

    const streakEl = document.getElementById('streak-count');
    const starsEl = document.getElementById('stars-count');
    const dailyEl = document.getElementById('daily-correct-count');
    const dailyTargetEl = document.getElementById('daily-correct-target');
    const fill = document.getElementById('streak-progress-fill');
    const redeemStars = document.getElementById('redeem-stars-val');
    const redeemStreak = document.getElementById('redeem-streak-val');
    const target = getStreakTarget();

    if (streakEl) streakEl.textContent = global.streak;
    if (starsEl) starsEl.textContent = global.stars;
    if (dailyEl) dailyEl.textContent = correct;
    if (dailyTargetEl) dailyTargetEl.textContent = target;
    if (fill) fill.style.width = `${Math.min(100, (correct / target) * 100)}%`;
    if (redeemStars) redeemStars.textContent = global.stars;
    if (redeemStreak) redeemStreak.textContent = global.streak;
    if (state.streakAchievedToday) {
        const qBox = document.getElementById('question-box');
        if (qBox) qBox.classList.add('bonus-mode');
    }
    bar.classList.remove('hidden');
}
