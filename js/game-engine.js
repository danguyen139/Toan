
const STAR_MILESTONES = [50, 100, 200, 500, 1000];

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
const fVN = formatVN;

// --- Clock SVG ---

function drawClockSVG(h, m) {
    const hAngle = (h % 12 + m / 60) * 30;
    const mAngle = m * 6;
    let numbers = '';
    for (let i = 1; i <= 12; i++) {
        const angle = i * 30 * (Math.PI / 180);
        const x = 100 + 75 * Math.sin(angle);
        const y = 100 - 75 * Math.cos(angle);
        numbers += `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-size="14" font-weight="700" fill="var(--text-main)">${i}</text>`;
    }
    return `<svg viewBox="0 0 200 200" class="clock-svg">
        <circle cx="100" cy="100" r="95" fill="white" stroke="var(--text-main)" stroke-width="4"/>
        <circle cx="100" cy="100" r="4" fill="var(--text-main)"/>
        ${numbers}
        <line x1="100" y1="100" x2="100" y2="55" stroke="var(--text-main)" stroke-width="6" stroke-linecap="round" transform="rotate(${hAngle},100,100)"/>
        <line x1="100" y1="100" x2="100" y2="25" stroke="var(--primary)" stroke-width="4" stroke-linecap="round" transform="rotate(${mAngle},100,100)"/>
    </svg>`;
}

// --- Grade 1 Generators ---

function generateGrade1Problem() {
    const pool = [
        'add','add','add',
        'sub','sub','sub',
        'two_step','two_step','two_step',
        'compare','compare',
        'missing','missing',
        'clock','clock',
        'sequence','sequence',
        'simple_word','simple_word',
        'odd_even'
    ];
    const type = randFrom(pool);
    let p = { type };

    if (type === 'add') {
        const a = rand(100, 900);
        const b = rand(100, 900);
        p.text = `${fVN(a)} + ${fVN(b)} = ?`;
        p.answer = a + b;
    } else if (type === 'sub') {
        const a = rand(200, 999);
        const b = rand(100, a - 1);
        p.text = `${fVN(a)} - ${fVN(b)} = ?`;
        p.answer = a - b;
    } else if (type === 'compare') {
        const a = rand(100, 999), b = rand(100, 999);
        p.text = `${fVN(a)} ... ${fVN(b)}`;
        p.answer = a > b ? '>' : (a < b ? '<' : '=');
        p.isCompare = true;
    } else if (type === 'missing') {
        const c = rand(200, 999);
        const a = rand(100, c - 100);
        const pos = Math.random() > 0.5 ? 'first' : 'second';
        p.text = pos === 'first' ? `? + ${fVN(a)} = ${fVN(c)}` : `${fVN(a)} + ? = ${fVN(c)}`;
        p.answer = c - a;
        p.isMissing = true;
    } else if (type === 'clock') {
        p.h = rand(1, 12);
        p.m = rand(0, 11) * 5;
        p.isClock = true;
        p.text = 'Bé hãy xem đồng hồ và cho biết mấy giờ nhé!';
    } else if (type === 'two_step') {
        const a = rand(200, 500);
        const op1 = Math.random() > 0.5 ? '+' : '-';
        let b, mid;
        if (op1 === '+') { b = rand(100, Math.min(400, 800 - a)); mid = a + b; }
        else { b = rand(50, a - 100); mid = a - b; }
        const op2 = Math.random() > 0.5 ? '+' : '-';
        let c, answer;
        if (op2 === '+') { c = rand(50, Math.min(400, 999 - mid)); answer = mid + c; }
        else { c = rand(10, mid - 1); answer = mid - c; }
        p.text = `${fVN(a)} ${op1} ${fVN(b)} ${op2} ${fVN(c)} = ?`;
        p.answer = answer;
    } else if (type === 'sequence') {
        const step = randFrom([2, 5, 10, 25, 50, 100, 250, 500, 1000]);
        const maxMult = Math.floor((9999 - 4 * step) / step);
        const start = rand(0, Math.max(0, maxMult)) * step;
        const nums = [0, 1, 2, 3, 4].map(i => start + i * step);
        const blankIdx = rand(1, 3);
        p.answer = nums[blankIdx];
        p.text = nums.map((n, i) => i === blankIdx ? '?' : fVN(n)).join(', ');
        p.isSequence = true;
    } else if (type === 'odd_even') {
        const n = rand(1, 5000);
        p.text = `Số ${fVN(n)} là số chẵn hay lẻ?`;
        p.answer = n % 2 === 0 ? 'chẵn' : 'lẻ';
        p.isOddEven = true;
    } else { // simple_word
        const templates = [
            () => { const a = rand(100, 700), b = rand(100, 500); return { text: `Có ${fVN(a)} quả táo, thêm ${fVN(b)} quả nữa. Tất cả có mấy quả?`, answer: a + b }; },
            () => { const a = rand(300, 900), b = rand(100, a - 100); return { text: `Có ${fVN(a)} viên bi, cho bạn ${fVN(b)} viên. Còn mấy viên?`, answer: a - b }; },
            () => { const a = rand(100, 700), b = rand(100, 500); return { text: `Lớp có ${fVN(a)} học sinh, thêm ${fVN(b)} bạn chuyển đến. Lớp có bao nhiêu bạn?`, answer: a + b }; },
            () => { const a = rand(300, 900), b = rand(100, a - 100); return { text: `Mẹ có ${fVN(a)} đồng, mua đồ hết ${fVN(b)} đồng. Mẹ còn mấy đồng?`, answer: a - b }; },
        ];
        Object.assign(p, randFrom(templates)());
    }
    return p;
}

// --- Grade 4 Generators ---

function generateGrade4Problem() {
    const pool = [
        'multiply', 'multiply',
        'divide', 'divide',
        'fraction', 'fraction', 'fraction',
        'simplify_fraction', 'simplify_fraction',
        'expression', 'expression',
        'find_x', 'find_x',
        'geometry',
        'large_add_sub', 'large_add_sub', 'large_add_sub',
        'decimal', 'decimal',
        'fraction_compare', 'fraction_compare',
        'square_geometry',
        'word_problem4', 'word_problem4', 'word_problem4'
    ];
    const type = randFrom(pool);
    let p = { type };

    if (type === 'multiply') {
        const a = rand(100, 900), b = rand(10, 99);
        p.text = `${a} × ${b}`;
        p.answer = a * b;
    } else if (type === 'divide') {
        const b = rand(10, 90), q = rand(10, 200);
        const a = b * q + (Math.random() > 0.5 ? 0 : rand(1, b - 1));
        p.text = `${a} : ${b}`;
        p.quotient = Math.floor(a / b);
        p.remainder = a % b;
        p.isDivide = true;
    } else if (type === 'simplify_fraction') {
        let n, d;
        do { n = rand(1, 9); d = rand(2, 9); } while (n >= d || gcd(n, d) > 1);
        const f = rand(2, 5);
        p.text = `Rút gọn phân số: ${n * f}/${d * f}`;
        p.num = n; p.den = d; p.isFraction = true;
    } else if (type === 'fraction') {
        const d = randFrom([2, 3, 4, 5, 6, 8, 10]);
        const n1 = rand(1, 10), n2 = rand(1, 10);
        const op = Math.random() > 0.5 ? '+' : '-';
        if (op === '-') {
            const hi = Math.max(n1, n2), lo = Math.min(n1, n2);
            p.text = `${hi}/${d} - ${lo}/${d}`; p.num = hi - lo;
        } else {
            p.text = `${n1}/${d} + ${n2}/${d}`; p.num = n1 + n2;
        }
        p.den = d; p.isFraction = true;
    } else if (type === 'expression') {
        const a = rand(100, 500), b = rand(10, 50), c = rand(2, 9);
        if (Math.random() > 0.5) { p.text = `(${a} + ${b}) × ${c}`; p.answer = (a + b) * c; }
        else { p.text = `${a} - ${b} × ${c}`; p.answer = a - b * c; }
    } else if (type === 'find_x') {
        const a = rand(100, 500), b = rand(500, 1500);
        if (Math.random() > 0.5) { p.text = `x + ${a} = ${b}`; p.answer = b - a; }
        else { p.text = `x - ${a} = ${b}`; p.answer = b + a; }
        p.isFindX = true;
    } else if (type === 'geometry') {
        const w = rand(5, 20), h = rand(5, 15);
        const isArea = Math.random() > 0.5;
        p.text = isArea ? `Diện tích hình chữ nhật có cạnh ${w}cm và ${h}cm: ? cm²` : `Chu vi hình chữ nhật có cạnh ${w}cm và ${h}cm: ? cm`;
        p.answer = isArea ? w * h : (w + h) * 2;
    } else if (type === 'large_add_sub') {
        const op = Math.random() > 0.5 ? '+' : '-';
        let a, b;
        if (op === '+') { a = rand(100000, 499999); b = rand(10000, Math.min(499999, 999999 - a)); }
        else { a = rand(200000, 999999); b = rand(10000, a - 10000); }
        p.text = `${fVN(a)} ${op} ${fVN(b)} = ?`;
        p.answer = op === '+' ? a + b : a - b;
    } else if (type === 'decimal') {
        const a1 = rand(1, 20), a2 = rand(1, 9);
        const b1 = rand(1, 15), b2 = rand(1, 9);
        const aInt = a1 * 10 + a2, bInt = b1 * 10 + b2;
        const op = Math.random() > 0.5 ? '+' : '-';
        if (op === '-') {
            const hi = Math.max(aInt, bInt), lo = Math.min(aInt, bInt);
            p.text = `${(hi / 10).toFixed(1)} - ${(lo / 10).toFixed(1)} = ?`;
            p.answer = ((hi - lo) / 10).toFixed(1);
        } else {
            p.text = `${(aInt / 10).toFixed(1)} + ${(bInt / 10).toFixed(1)} = ?`;
            p.answer = ((aInt + bInt) / 10).toFixed(1);
        }
        p.isDecimal = true;
    } else if (type === 'fraction_compare') {
        const DENOMS = [2, 3, 4, 5, 6, 8, 10];
        const d1 = randFrom(DENOMS), d2 = randFrom(DENOMS);
        const n1 = rand(1, d1 - 1), n2 = rand(1, d2 - 1);
        p.n1 = n1; p.d1 = d1; p.n2 = n2; p.d2 = d2;
        p.text = `${n1}/${d1} ... ${n2}/${d2}`;
        p.answer = n1 * d2 > n2 * d1 ? '>' : (n1 * d2 < n2 * d1 ? '<' : '=');
        p.isFractionCompare = true;
        p.isCompare = true;
    } else if (type === 'square_geometry') {
        const side = rand(5, 30);
        const isArea = Math.random() > 0.5;
        p.text = isArea ? `Diện tích hình vuông cạnh ${side}cm: ? cm²` : `Chu vi hình vuông cạnh ${side}cm: ? cm`;
        p.answer = isArea ? side * side : side * 4;
    } else { // word_problem4
        const templates = [
            () => { const pr = rand(1, 9) * 1000 + 500, q = rand(2, 9); return { text: `Mua ${q} quyển vở, mỗi quyển ${fVN(pr)}đ. Tổng tiền phải trả?`, answer: pr * q }; },
            () => { const tot = rand(5, 20) * 10000, sp = rand(1, 4) * 10000; return { text: `Có ${fVN(tot)}đ, mua đồ hết ${fVN(sp)}đ. Còn lại bao nhiêu?`, answer: tot - sp }; },
            () => { const pd = rand(10, 50), dy = rand(2, 6); return { text: `Mỗi ngày đọc ${pd} trang. ${dy} ngày đọc bao nhiêu trang?`, answer: pd * dy }; },
            () => {
                const groups = rand(2, 5), q = rand(10, 50), r = rand(0, groups - 1);
                const total = groups * q + r;
                const text = r > 0
                    ? `${fVN(total)} cái kẹo chia cho ${groups} bạn. Mỗi bạn được mấy cái, còn dư mấy cái?`
                    : `${fVN(total)} cái kẹo chia đều ${groups} bạn. Mỗi bạn được mấy cái?`;
                return { text, quotient: q, remainder: r, isDivide: true };
            },
            () => { const w = rand(5, 30), h = rand(5, 25); return { text: `Vườn hình chữ nhật dài ${w}m, rộng ${h}m. Diện tích là bao nhiêu m²?`, answer: w * h }; },
            () => { const a = rand(100, 500), b = rand(10, 50); return { text: `Một hộp có ${a} cái. ${b} hộp có bao nhiêu cái?`, answer: a * b }; },
        ];
        Object.assign(p, randFrom(templates)());
    }
    return p;
}

// --- Render Question ---

function renderQuestion() {
    state.currentProblem = state.currentGrade === 1 ? generateGrade1Problem() : generateGrade4Problem();
    const prob = state.currentProblem;
    const qText = document.getElementById('math-question');
    const answerInputs = document.getElementById('answer-inputs');

    // Display question text
    if (prob.isClock) {
        qText.innerHTML = `<div class="clock-display">${drawClockSVG(prob.h, prob.m)}<p style="font-size:1.2rem;margin-top:10px">Bé hãy xem đồng hồ:</p></div>`;
    } else if (prob.isFractionCompare) {
        qText.innerHTML = `<div class="fraction-compare-display">
            <span class="frac"><sup>${prob.n1}</sup><span></span><sub>${prob.d1}</sub></span>
            <span style="font-size:2rem;padding:0 12px"> ... </span>
            <span class="frac"><sup>${prob.n2}</sup><span></span><sub>${prob.d2}</sub></span>
        </div>`;
    } else if (prob.isMissing || prob.isFindX || prob.isOddEven || prob.isSequence) {
        qText.textContent = prob.text;
    } else {
        qText.textContent = prob.text.includes('=') ? prob.text.split('=')[0].trim() : prob.text;
    }

    answerInputs.innerHTML = '';
    document.getElementById('result-feedback').classList.add('hidden');
    document.getElementById('btn-next').classList.add('hidden');
    document.getElementById('btn-check').classList.remove('hidden');
    document.getElementById('praise-message').textContent = '';
    document.getElementById('mascot-companion').classList.remove('mascot-happy');

    // Render inputs
    if (prob.isDivide) {
        answerInputs.innerHTML = `
            <div class="input-group"><label class="input-label">Thương</label><input type="number" id="input-q" placeholder="?"></div>
            <div class="input-group"><label class="input-label">Số dư</label><input type="number" id="input-r" placeholder="?"></div>`;
        document.getElementById('input-q').focus();
    } else if (prob.isFraction) {
        answerInputs.innerHTML = `<div class="fraction-input">
            <input type="number" id="input-num" placeholder="?">
            <div class="fraction-line"></div>
            <input type="number" id="input-den" placeholder="?">
        </div>`;
        document.getElementById('input-num').focus();
    } else if (prob.isClock) {
        answerInputs.innerHTML = `<div class="time-input-layout">
            <input type="number" id="input-h" placeholder="giờ" min="1" max="12">
            <span class="time-separator">:</span>
            <input type="number" id="input-m" placeholder="phút" min="0" max="59">
        </div>`;
        document.getElementById('input-h').focus();
    } else if (prob.isFractionCompare || prob.isCompare) {
        answerInputs.innerHTML = `<div class="compare-buttons">
            <button class="btn-compare" data-val="<">&lt;</button>
            <button class="btn-compare" data-val="=">=</button>
            <button class="btn-compare" data-val=">">&gt;</button>
        </div>`;
        wireCompareButtons(answerInputs);
    } else if (prob.isOddEven) {
        answerInputs.innerHTML = `<div class="compare-buttons">
            <button class="btn-compare" data-val="chẵn">Chẵn</button>
            <button class="btn-compare" data-val="lẻ">Lẻ</button>
        </div>`;
        wireCompareButtons(answerInputs);
    } else if (prob.isDecimal) {
        answerInputs.innerHTML = `<div class="input-group">
            <label class="input-label">Đáp án</label>
            <input type="text" id="input-ans" placeholder="?" inputmode="decimal" class="input-ans-styled">
        </div>`;
        const inp = document.getElementById('input-ans');
        inp.focus();
        inp.addEventListener('keypress', e => { if (e.key === 'Enter') checkAnswer(); });
    } else {
        answerInputs.innerHTML = `<div class="input-group">
            <label class="input-label">Đáp án</label>
            <input type="number" id="input-ans" placeholder="?">
        </div>`;
        document.getElementById('input-ans').focus();
    }

    answerInputs.querySelectorAll('input[type="number"]').forEach(inp => {
        inp.addEventListener('keypress', e => { if (e.key === 'Enter') checkAnswer(); });
    });
}

function wireCompareButtons(container) {
    const btns = container.querySelectorAll('.btn-compare');
    btns.forEach(btn => {
        btn.onclick = () => {
            btns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            state.selectedCompare = btn.getAttribute('data-val');
            checkAnswer();
        };
    });
}

// --- Check Answer ---

function checkAnswer() {
    const prob = state.currentProblem;
    let isCorrect = false;

    if (prob.isDivide) {
        const q = parseInt(document.getElementById('input-q')?.value);
        const r = parseInt(document.getElementById('input-r')?.value) || 0;
        isCorrect = (q === prob.quotient && r === prob.remainder);
    } else if (prob.isFraction) {
        const n = parseInt(document.getElementById('input-num')?.value);
        const d = parseInt(document.getElementById('input-den')?.value);
        isCorrect = (n === prob.num && d === prob.den);
    } else if (prob.isClock) {
        const h = parseInt(document.getElementById('input-h')?.value);
        const m = parseInt(document.getElementById('input-m')?.value) || 0;
        isCorrect = (h === prob.h && m === prob.m);
    } else if (prob.isCompare || prob.isOddEven) {
        isCorrect = (state.selectedCompare === prob.answer);
        state.selectedCompare = null;
    } else if (prob.isDecimal) {
        const raw = (document.getElementById('input-ans')?.value || '').replace(',', '.');
        isCorrect = (parseFloat(raw).toFixed(1) === prob.answer);
    } else {
        const v = parseInt(document.getElementById('input-ans')?.value);
        isCorrect = (v === prob.answer);
    }

    state.stats.totalQuestions++;
    const theme = state.currentTheme;

    if (isCorrect) {
        state.stats.correctCount++;
        const delta = state.streakAchievedToday ? 3 : 2;
        const newStars = addStars(theme, delta);
        const prevStars = newStars - delta;
        const crossed = STAR_MILESTONES.find(m => prevStars < m && newStars >= m);
        if (crossed) triggerStarMilestone(crossed);

        const justAchieved = checkStreakAchievement(theme, state.stats.correctCount);
        if (justAchieved) {
            triggerStreakCelebration(getGlobalState(theme).streak);
            const qBox = document.getElementById('question-box');
            if (qBox) qBox.classList.add('bonus-mode');
        }
        showSuccess();
    } else {
        state.stats.wrongCount++;
        addStars(theme, -1);
        showError();
    }

    saveStats();
    updateStatsUI();
    renderStreakBar(theme);
    showResultDetails(isCorrect);
}

// --- Result Details ---

function showResultDetails(isCorrect) {
    document.getElementById('result-feedback').classList.remove('hidden');
    document.getElementById('btn-check').classList.add('hidden');
    const btnNext = document.getElementById('btn-next');
    btnNext.classList.remove('hidden');

    const prob = state.currentProblem;
    let correctStr = '';
    if (prob.isDivide) {
        correctStr = `Đáp án đúng: Thương ${prob.quotient}, dư ${prob.remainder}`;
    } else if (prob.isFraction) {
        correctStr = `Đáp án đúng: ${prob.num}/${prob.den}`;
    } else if (prob.isClock) {
        correctStr = `Đáp án đúng: ${prob.h} giờ ${prob.m} phút`;
    } else if (prob.isDecimal || prob.isCompare || prob.isOddEven) {
        correctStr = `Đáp án đúng: ${prob.answer}`;
    } else {
        correctStr = `Đáp án đúng: ${fVN(prob.answer)}`;
    }
    document.getElementById('correct-answer-display').textContent = correctStr;
    btnNext.focus();
}
