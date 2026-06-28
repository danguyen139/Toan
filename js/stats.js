function padDate(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Normalize old non-padded dates ("2026-6-5") to padded ("2026-06-05") for safe string comparison
function normDate(s) {
    if (!s) return s;
    const p = s.split('-');
    if (p.length !== 3) return s;
    return `${p[0]}-${p[1].padStart(2, '0')}-${p[2].padStart(2, '0')}`;
}

function getTodayString() {
    return padDate(new Date());
}

function getYesterdayString() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return padDate(d);
}

function formatTime(totalSeconds) {
    if (!totalSeconds) totalSeconds = 0;
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
}

function saveStats() {
    if (!state.currentGrade) return;
    localStorage.setItem(`toan_stats_grade_${state.currentGrade}`, JSON.stringify({
        date: getTodayString(),
        stats: {
            startTime: state.stats.startTime,
            totalQuestions: state.stats.totalQuestions,
            correctCount: state.stats.correctCount,
            wrongCount: state.stats.wrongCount,
            secondsSpent: state.stats.secondsSpent,
            streakAchievedToday: state.streakAchievedToday
        }
    }));
}

function loadStats() {
    if (!state.currentGrade) return null;
    try {
        const raw = localStorage.getItem(`toan_stats_grade_${state.currentGrade}`);
        if (raw) {
            const data = JSON.parse(raw);
            if (normDate(data.date) === getTodayString()) return data.stats;
        }
    } catch (e) {
        console.error(e);
    }
    return null;
}

function resetStats() {
    const saved = loadStats();
    if (saved) {
        state.streakAchievedToday = saved.streakAchievedToday || false;
        state.stats = {
            startTime: saved.startTime ? new Date(saved.startTime) : new Date(),
            totalQuestions: saved.totalQuestions || 0,
            correctCount: saved.correctCount || 0,
            wrongCount: saved.wrongCount || 0,
            secondsSpent: saved.secondsSpent || 0
        };
    } else {
        state.streakAchievedToday = false;
        state.stats = {
            startTime: new Date(),
            totalQuestions: 0,
            correctCount: 0,
            wrongCount: 0,
            secondsSpent: 0
        };
    }
    state.consecutiveCorrect = 0;
    updateStatsUI();
    const startEl = document.getElementById('start-time');
    if (startEl) {
        startEl.textContent = state.stats.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}

function initTimer() {
    if (state.timerInterval) clearInterval(state.timerInterval);
    const el = document.getElementById('total-minutes');
    if (el) el.textContent = formatTime(state.stats.secondsSpent);
    state.timerInterval = setInterval(() => {
        if (!document.hidden) {
            state.stats.secondsSpent = (state.stats.secondsSpent || 0) + 1;
            if (el) el.textContent = formatTime(state.stats.secondsSpent);
            if (state.stats.secondsSpent % 5 === 0) saveStats();
        }
    }, 1000);
}

function updateStatsUI() {
    const get = (id) => document.getElementById(id);
    const tq = get('total-questions');
    const cc = get('correct-count');
    const wc = get('wrong-count');
    const ar = get('accuracy-rate');
    const tm = get('total-minutes');
    if (tq) tq.textContent = state.stats.totalQuestions;
    if (cc) cc.textContent = state.stats.correctCount;
    if (wc) wc.textContent = state.stats.wrongCount;
    const rate = state.stats.totalQuestions === 0
        ? 0
        : Math.round((state.stats.correctCount / state.stats.totalQuestions) * 100);
    if (ar) ar.textContent = `${rate}%`;
    if (tm) tm.textContent = formatTime(state.stats.secondsSpent);
}
