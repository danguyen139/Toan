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
        const types = ['add', 'sub'];
        const type = types[Math.floor(Math.random() * types.length)];
        let problem = { type: type };
        
        if (type === 'add') {
            const a = Math.floor(Math.random() * 15) + 1; // 1-15
            const b = Math.floor(Math.random() * (20 - a)) + 1; // Sum <= 20
            problem.text = `${a} + ${b} = ?`;
            problem.answer = a + b;
        } else {
            const a = Math.floor(Math.random() * 15) + 5; // 5-20
            const b = Math.floor(Math.random() * a);     // Result >= 0
            problem.text = `${a} - ${b} = ?`;
            problem.answer = a - b;
        }
        return problem;
    }

    function generateGrade4Problem() {
        const pool = ['multiply', 'multiply', 'divide', 'divide_remainder', 'divide_remainder', 'divide_remainder'];
        const type = pool[Math.floor(Math.random() * pool.length)];
        let problem = { type: type };
        
        if (type === 'multiply') {
            const a = Math.floor(Math.random() * 800) + 100;
            const b = Math.floor(Math.random() * 50) + 5;
            problem.text = `${a} × ${b}`;
            problem.answer = a * b;
        } else if (type === 'divide') {
            // Difficulty Increase: Divisor (b) is 2 digits (10-99)
            const b = Math.floor(Math.random() * 90) + 10;   // 10-99
            const q = Math.floor(Math.random() * 100) + 5;   // Quotient
            const a = b * q;
            problem.text = `${a} : ${b}`;
            problem.answer = q;
        } else {
            // Difficulty Increase: Divisor (b) is 2 digits (10-99)
            const b = Math.floor(Math.random() * 90) + 10;   // 10-99
            const a = Math.floor(Math.random() * 5000) + 1000; // Larger dividend
            if (a % b === 0) return generateGrade4Problem();
            problem.text = `${a} : ${b}`;
            problem.quotient = Math.floor(a / b);
            problem.remainder = a % b;
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
        
        if (state.currentProblem.type === 'divide' || state.currentProblem.type === 'divide_remainder') {
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
        
        if (prob.type === 'divide' || prob.type === 'divide_remainder') {
            const userQ = parseInt(document.getElementById('input-q').value);
            const userR = parseInt(document.getElementById('input-r').value) || 0;
            const targetQ = prob.type === 'divide' ? prob.answer : prob.quotient;
            const targetR = prob.type === 'divide' ? 0 : prob.remainder;
            isCorrect = (userQ === targetQ && userR === targetR);
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
        if (prob.type === 'divide' || prob.type === 'divide_remainder') {
            const targetQ = prob.type === 'divide' ? prob.answer : prob.quotient;
            const targetR = prob.type === 'divide' ? 0 : prob.remainder;
            correctStr = `Đáp án đúng: Thương ${targetQ}, dư ${targetR}`;
        } else {
            correctStr = `Đáp án đúng: ${prob.answer}`;
        }
        elements.correctAnswerDisplay.textContent = correctStr;
        elements.btnNext.focus();
    }

    elements.btnCheck.addEventListener('click', checkAnswer);
    elements.btnNext.addEventListener('click', renderQuestion);
});
