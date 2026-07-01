const GLOBAL_DEFAULTS = {
    streak: 0,
    lastStreakDate: '',
    stars: 0,
    totalSecondsAllTime: 0,
    dailyLoginDate: '',
    dailyTargetsDate: '',
    mathDone: false,
    englishDone: false
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
    resetDailyTargetsIfNewDay(theme);
}

// Both math and english targets must be met the same day for a streak to count.
// Reset the per-subject "done today" flags whenever the stored date isn't today.
function resetDailyTargetsIfNewDay(theme) {
    const global = loadGlobal(theme);
    const today = getTodayString();
    if (normDate(global.dailyTargetsDate) !== today) {
        global.dailyTargetsDate = today;
        global.mathDone = false;
        global.englishDone = false;
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

function getStreakTarget(subject) {
    // English targets mirror Math targets (same grade-based thresholds).
    return state.currentGrade === 1 ? 25 : 50;
}

function checkStreakAchievement(theme, subject, correctCount) {
    if (correctCount < getStreakTarget(subject)) return false;
    if (state.streakAchievedToday) return false;

    resetDailyTargetsIfNewDay(theme);
    const global = loadGlobal(theme);
    const doneKey = subject === 'english' ? 'englishDone' : 'mathDone';
    global[doneKey] = true;
    saveGlobal(theme, global);

    if (!global.mathDone || !global.englishDone) return false;

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
    resetDailyTargetsIfNewDay(theme);
    const global = loadGlobal(theme);
    const correct = state.stats.correctCount || 0;
    const subject = state.currentSubject;
    const otherSubject = subject === 'english' ? 'math' : 'english';
    const otherDone = subject === 'english' ? global.mathDone : global.englishDone;

    const streakEl = document.getElementById('streak-count');
    const starsEl = document.getElementById('stars-count');
    const dailyEl = document.getElementById('daily-correct-count');
    const dailyTargetEl = document.getElementById('daily-correct-target');
    const fill = document.getElementById('streak-progress-fill');
    const redeemStars = document.getElementById('redeem-stars-val');
    const redeemStreak = document.getElementById('redeem-streak-val');
    const otherStatusEl = document.getElementById('other-subject-status');
    const target = getStreakTarget(subject);

    if (streakEl) streakEl.textContent = global.streak;
    if (starsEl) starsEl.textContent = global.stars;
    if (dailyEl) dailyEl.textContent = correct;
    if (dailyTargetEl) dailyTargetEl.textContent = target;
    if (fill) fill.style.width = `${Math.min(100, (correct / target) * 100)}%`;
    if (redeemStars) redeemStars.textContent = global.stars;
    if (redeemStreak) redeemStreak.textContent = global.streak;
    if (otherStatusEl) {
        const label = otherSubject === 'english' ? 'Tiếng Anh' : 'Toán';
        otherStatusEl.textContent = otherDone ? `${label} ✅` : `${label} ⏳`;
    }
    if (state.streakAchievedToday) {
        const qBox = document.getElementById('question-box');
        if (qBox) qBox.classList.add('bonus-mode');
    }
    bar.classList.remove('hidden');
}
