document.addEventListener('DOMContentLoaded', () => {
    // State management
    const state = {
        currentGrade: 0, // 1 or 4
        currentTheme: 'girl',
        stats: {
            startTime: null,
            totalQuestions: 0,
            correctCount: 0,
            wrongCount: 0,
            minutesSpent: 0
        },
        currentProblem: null,
        timerInterval: null
    };

    const girlPraise = ["Đúng rồi! Meo meo!", "Con giỏi quá! Tặng con 1 chú mèo!", "Tuyệt vời! Cat-tastic!", "Xuất sắc luôn!", "Meo! Chính xác rồi!"];
    const boyPraise = ["Siêu Anh Hùng đây rồi!", "Mạnh mẽ quá! Thắng rồi!", "Iron Man khen con đấy!", "Spider-Web! Trúng phóc!", "Quá đỉnh luôn siêu nhân!"];
    const encouragements = ["Cố lên con nhé!", "Không sao, thử lại nào!", "Gần đúng rồi, tập trung hơn nhé!", "Bình tĩnh tính lại con nhé!"];

    // DOM Elements
    const elements = {
        appBody: document.getElementById('app-body'),
        selectionScreen: document.getElementById('selection-screen'),
        mainContainer: document.getElementById('main-container'),
        selectGirl: document.getElementById('select-girl'),
        selectBoy: document.getElementById('select-boy'),
        btnBack: document.getElementById('btn-back'),
        
        startTime: document.getElementById('start-time'),
        totalMinutes: document.getElementById('total-minutes'),
        totalQuestions: document.getElementById('total-questions'),
        correctCount: document.getElementById('correct-count'),
        wrongCount: document.getElementById('wrong-count'),
        accuracyRate: document.getElementById('accuracy-rate'),
        
        mathQuestion: document.getElementById('math-question'),
        answerInputs: document.getElementById('answer-inputs'),
        btnCheck: document.getElementById('btn-check'),
        btnNext: document.getElementById('btn-next'),
        praiseMessage: document.getElementById('praise-message'),
        resultFeedback: document.getElementById('result-feedback'),
        feedbackText: document.getElementById('feedback-text'),
        correctAnswerDisplay: document.getElementById('correct-answer-display'),
        
        mascotCompanion: document.getElementById('mascot-companion'),
        mascotIcon: document.getElementById('mascot-icon')
    };

    // Selection Handlers
    if (elements.selectGirl) {
        elements.selectGirl.onclick = () => {
            console.log("Selected Grade 4");
            startApp(4, 'girl');
        };
    }
    if (elements.selectBoy) {
        elements.selectBoy.onclick = () => {
            console.log("Selected Grade 1");
            startApp(1, 'boy');
        };
    }
    if (elements.btnBack) {
        elements.btnBack.onclick = resetToSelection;
    }

    function startApp(grade, theme) {
        state.currentGrade = grade;
        state.currentTheme = theme;
        elements.appBody.setAttribute('data-theme', theme);
        
        elements.selectionScreen.classList.add('hidden');
        elements.mainContainer.classList.remove('hidden');
        
        // Show companion mascot
        elements.mascotIcon.src = (theme === 'girl') ? "assets/cat.png" : "assets/hero_iron.png";
        
        resetStats();
        initTimer();
        renderQuestion();
    }

    function resetToSelection() {
        if (state.timerInterval) clearInterval(state.timerInterval);
        elements.mainContainer.classList.add('hidden');
        elements.selectionScreen.classList.remove('hidden');
        state.appBody.removeAttribute('data-theme');
    }

    function resetStats() {
        state.stats = {
            startTime: new Date(),
            totalQuestions: 0,
            correctCount: 0,
            wrongCount: 0,
            minutesSpent: 0
        };
        updateStatsUI();
        elements.startTime.textContent = state.stats.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function initTimer() {
        if (state.timerInterval) clearInterval(state.timerInterval);
        state.timerInterval = setInterval(() => {
            const now = new Date();
            const diffMs = now - state.stats.startTime;
            state.stats.minutesSpent = Math.floor(diffMs / 60000);
            elements.totalMinutes.textContent = state.stats.minutesSpent;
        }, 1000);
    }

    function updateStatsUI() {
        elements.totalQuestions.textContent = state.stats.totalQuestions;
        elements.correctCount.textContent = state.stats.correctCount;
        elements.wrongCount.textContent = state.stats.wrongCount;
        
        const rate = state.stats.totalQuestions === 0 ? 0 : Math.round((state.stats.correctCount / state.stats.totalQuestions) * 100);
        elements.accuracyRate.textContent = `${rate}%`;
    }

    // Problem Generators
    function generateGrade1Problem() {
        const types = ['add', 'sub', 'compare', 'missing'];
        const type = types[Math.floor(Math.random() * types.length)];
        let problem = { type: type };
        
        if (type === 'add') {
            // Addition within 100 with carrying
            const a = Math.floor(Math.random() * 80) + 10; // 10-89
            const b = Math.floor(Math.random() * (100 - a)) + 1; // Sum <= 100
            problem.text = `${a} + ${b} = ?`;
            problem.answer = a + b;
        } else if (type === 'sub') {
            // Subtraction within 100 with borrowing
            const a = Math.floor(Math.random() * 80) + 20; // 20-99
            const b = Math.floor(Math.random() * (a - 5)) + 1; // Result >= 5
            problem.text = `${a} - ${b} = ?`;
            problem.answer = a - b;
        } else if (type === 'compare') {
            const a = Math.floor(Math.random() * 90) + 10;
            const b = Math.floor(Math.random() * 90) + 10;
            problem.text = `${a} ... ${b}`;
            problem.answer = a > b ? '>' : (a < b ? '<' : '=');
            problem.isCompare = true;
        } else {
            // Missing number: a + ? = c
            const c = Math.floor(Math.random() * 80) + 20; // Sum 20-99
            const a = Math.floor(Math.random() * (c - 5)) + 5; // Part 5-(c-5)
            const pos = Math.random() > 0.5 ? 'first' : 'second';
            problem.text = pos === 'first' ? `? + ${a} = ${c}` : `${a} + ? = ${c}`;
            problem.answer = c - a;
        }
        return problem;
    }

    function generateGrade4Problem() {
        const pool = ['multiply', 'divide', 'fraction', 'expression', 'find_x', 'geometry'];
        const type = pool[Math.floor(Math.random() * pool.length)];
        let problem = { type: type };
        
        if (type === 'multiply') {
            const a = Math.floor(Math.random() * 800) + 100;
            const b = Math.floor(Math.random() * 90) + 10; // 2-digit multiplier
            problem.text = `${a} × ${b}`;
            problem.answer = a * b;
        } else if (type === 'divide') {
            const b = Math.floor(Math.random() * 90) + 10;
            const q = Math.floor(Math.random() * 200) + 10;
            const a = b * q + (Math.random() > 0.5 ? 0 : Math.floor(Math.random() * (b - 1)));
            problem.text = `${a} : ${b}`;
            problem.quotient = Math.floor(a / b);
            problem.remainder = a % b;
            problem.isDivide = true;
        } else if (type === 'fraction') {
            // Simple fractions with common denominators or multiples
            const d = [2, 3, 4, 5, 6, 8, 10][Math.floor(Math.random() * 7)];
            const n1 = Math.floor(Math.random() * 10) + 1;
            const n2 = Math.floor(Math.random() * 10) + 1;
            const op = Math.random() > 0.5 ? '+' : '-';
            
            if (op === '-') {
                const maxN = Math.max(n1, n2);
                const minN = Math.min(n1, n2);
                problem.text = `${maxN}/${d} - ${minN}/${d}`;
                problem.num = maxN - minN;
            } else {
                problem.text = `${n1}/${d} + ${n2}/${d}`;
                problem.num = n1 + n2;
            }
            problem.den = d;
            problem.isFraction = true;
        } else if (type === 'expression') {
            const a = Math.floor(Math.random() * 500) + 100;
            const b = Math.floor(Math.random() * 50) + 10;
            const c = Math.floor(Math.random() * 9) + 2;
            const variant = Math.floor(Math.random() * 2);
            if (variant === 0) {
                problem.text = `(${a} + ${b}) × ${c}`;
                problem.answer = (a + b) * c;
            } else {
                problem.text = `${a} - ${b} × ${c}`;
                problem.answer = a - b * c;
            }
        } else if (type === 'find_x') {
            const a = Math.floor(Math.random() * 500) + 100;
            const b = Math.floor(Math.random() * 1000) + 500;
            const variant = Math.floor(Math.random() * 2);
            if (variant === 0) {
                problem.text = `x + ${a} = ${b}`;
                problem.answer = b - a;
            } else {
                problem.text = `x - ${a} = ${b}`;
                problem.answer = b + a;
            }
        } else {
            // Geometry: Perimeter or Area
            const w = Math.floor(Math.random() * 20) + 5;
            const h = Math.floor(Math.random() * 15) + 5;
            const isArea = Math.random() > 0.5;
            if (isArea) {
                problem.text = `Diện tích hình chữ nhật có cạnh ${w}cm và ${h}cm: ? cm²`;
                problem.answer = w * h;
            } else {
                problem.text = `Chu vi hình chữ nhật có cạnh ${w}cm và ${h}cm: ? cm`;
                problem.answer = (w + h) * 2;
            }
        }
        return problem;
    }

    function renderQuestion() {
        state.currentProblem = state.currentGrade === 1 ? generateGrade1Problem() : generateGrade4Problem();
        
        elements.mathQuestion.textContent = state.currentProblem.text.includes('=') ? 
            state.currentProblem.text.split('=')[0] : state.currentProblem.text;
        
        elements.answerInputs.innerHTML = '';
        elements.resultFeedback.classList.add('hidden');
        elements.btnNext.classList.add('hidden');
        elements.btnCheck.classList.remove('hidden');
        elements.praiseMessage.textContent = '';
        elements.mascotCompanion.classList.remove('mascot-happy');
        
        if (state.currentProblem.isDivide) {
            elements.answerInputs.innerHTML = `
                <div class="input-group">
                    <label class="input-label">Thương</label>
                    <input type="number" id="input-q" placeholder="?">
                </div>
                <div class="input-group">
                    <label class="input-label">Số dư</label>
                    <input type="number" id="input-r" placeholder="?">
                </div>
            `;
            document.getElementById('input-q').focus();
        } else if (state.currentProblem.isFraction) {
            elements.answerInputs.innerHTML = `
                <div class="fraction-input">
                    <input type="number" id="input-num" placeholder="?">
                    <div class="fraction-line"></div>
                    <input type="number" id="input-den" placeholder="?">
                </div>
            `;
            document.getElementById('input-num').focus();
        } else if (state.currentProblem.isCompare) {
            elements.answerInputs.innerHTML = `
                <div class="compare-buttons">
                    <button class="btn-compare" data-val="<">&lt;</button>
                    <button class="btn-compare" data-val="=">=</button>
                    <button class="btn-compare" data-val=">">&gt;</button>
                </div>
            `;
            const btns = elements.answerInputs.querySelectorAll('.btn-compare');
            btns.forEach(btn => {
                btn.onclick = () => {
                    btns.forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    state.selectedCompare = btn.getAttribute('data-val');
                    checkAnswer();
                };
            });
        } else {
            elements.answerInputs.innerHTML = `
                <div class="input-group">
                    <label class="input-label">Đáp án</label>
                    <input type="number" id="input-ans" placeholder="?">
                </div>
            `;
            document.getElementById('input-ans').focus();
        }

        // Add Tab/Enter listener
        const inputs = elements.answerInputs.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') checkAnswer();
            });
        });
    }

    function checkAnswer() {
        let isCorrect = false;
        const prob = state.currentProblem;
        
        if (prob.isDivide) {
            const userQ = parseInt(document.getElementById('input-q').value);
            const userR = parseInt(document.getElementById('input-r').value) || 0;
            isCorrect = (userQ === prob.quotient && userR === prob.remainder);
        } else if (prob.isFraction) {
            const userNum = parseInt(document.getElementById('input-num').value);
            const userDen = parseInt(document.getElementById('input-den').value);
            isCorrect = (userNum === prob.num && userDen === prob.den);
        } else if (prob.isCompare) {
            isCorrect = (state.selectedCompare === prob.answer);
            state.selectedCompare = null; // Reset
        } else {
            const userAns = parseInt(document.getElementById('input-ans').value);
            isCorrect = (userAns === prob.answer);
        }

        state.stats.totalQuestions++;
        if (isCorrect) {
            state.stats.correctCount++;
            showSuccess();
        } else {
            state.stats.wrongCount++;
            showError();
        }

        updateStatsUI();
        showResultDetails(isCorrect);
    }

    function showSuccess() {
        // Confetti
        const colors = state.currentTheme === 'girl' ? ['#d946ef', '#f472b6', '#ffffff'] : ['#2563eb', '#dc2626', '#fcd34d'];
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.75 }, colors: colors });

        // Praise Text
        const pool = state.currentTheme === 'girl' ? girlPraise : boyPraise;
        const msg = pool[Math.floor(Math.random() * pool.length)];
        elements.praiseMessage.textContent = msg;
        elements.praiseMessage.style.color = 'var(--primary)';
        
        // Mascot Animation
        elements.mascotCompanion.classList.add('mascot-happy');
        if (state.currentTheme === 'boy') {
             // Randomly switch hero for boy on success
             elements.mascotIcon.src = Math.random() > 0.5 ? "assets/hero_iron.png" : "assets/hero_spider.png";
        }

        elements.feedbackText.textContent = "Chính xác tuyệt đối!";
        elements.resultFeedback.className = "result-feedback feedback-correct";
    }

    function showError() {
        const msg = encouragements[Math.floor(Math.random() * encouragements.length)];
        elements.praiseMessage.textContent = msg;
        elements.praiseMessage.style.color = 'var(--error)';
        
        const card = document.querySelector('.question-container');
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 600);

        elements.feedbackText.textContent = "Chưa đúng rồi con ơi!";
        elements.resultFeedback.className = "result-feedback feedback-wrong";
    }

    function showResultDetails(isCorrect) {
        elements.resultFeedback.classList.remove('hidden');
        elements.btnCheck.classList.add('hidden');
        elements.btnNext.classList.remove('hidden');
        
        const prob = state.currentProblem;
        let correctStr = "";
        if (prob.isDivide) {
            correctStr = `Đáp án đúng: Thương ${prob.quotient}, dư ${prob.remainder}`;
        } else if (prob.isFraction) {
            correctStr = `Đáp án đúng: ${prob.num}/${prob.den}`;
        } else if (prob.isCompare) {
            correctStr = `Đáp án đúng: ${prob.answer}`;
        } else {
            correctStr = `Đáp án đúng: ${prob.answer}`;
        }
        elements.correctAnswerDisplay.textContent = correctStr;
        elements.btnNext.focus();
    }

    elements.btnCheck.addEventListener('click', checkAnswer);
    elements.btnNext.addEventListener('click', renderQuestion);
});
