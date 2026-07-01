// English Engine - Vocabulary exercises for Cambridge Starters & A2 Key
// Provides: renderEnglishQuestion (dispatcher), checkEnglishAnswer, showEnglishResultDetails
// Pure question generation lives in english-generators.js (window.EnglishGenerators).

(function() {
    'use strict';

    var EXERCISE_TYPES = window.EnglishGenerators.EXERCISE_TYPES;
    var currentExercise = null;

    function speakWord(word) {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(word);
        u.lang = 'en-US';
        u.rate = 0.85;
        window.speechSynthesis.speak(u);
    }

    function checkEnglishAnswer(userAnswer) {
        if (!currentExercise || !userAnswer) return false;
        return userAnswer.toLowerCase().trim() === currentExercise.correctAnswer.toLowerCase().trim()
    }


    // ── Render helpers ──
    // IMPORTANT: Only touch #math-question (qText) and #answer-inputs.
    // Do NOT clear #question-box — it contains #btn-check, #btn-next, #result-feedback.

    function renderEnglishQuestionUI(exercise) {
        var qText = document.getElementById('math-question');
        var answerInputs = document.getElementById('answer-inputs');
        if (!qText || !answerInputs) return;

        qText.innerHTML = '';
        answerInputs.innerHTML = '';

        // Remove stale result-detail from previous question
        var oldDetail = document.querySelector('.result-details');
        if (oldDetail) oldDetail.remove();

        // Reset feedback + buttons (same as renderMathQuestion)
        var feedbackEl = document.getElementById('result-feedback');
        if (feedbackEl) feedbackEl.classList.add('hidden');
        var btnNext = document.getElementById('btn-next');
        if (btnNext) btnNext.classList.add('hidden');
        var btnCheck = document.getElementById('btn-check');
        if (btnCheck) { btnCheck.classList.add('hidden'); btnCheck.style.display = ''; }
        var praise = document.getElementById('praise-message');
        if (praise) praise.textContent = '';

        var type = exercise.type;
        if (type === EXERCISE_TYPES.MC_EN_VN || type === EXERCISE_TYPES.MC_VN_EN) {
            renderMultipleChoice(exercise, qText, answerInputs);
        } else if (type === EXERCISE_TYPES.LISTEN_CHOOSE) {
            renderListenChoose(exercise, qText, answerInputs);
        } else if (type === EXERCISE_TYPES.SPELLING) {
            renderSpelling(exercise, qText, answerInputs);
        }
    }

    function renderMultipleChoice(exercise, qText, answerInputs) {
        qText.innerHTML = '<div class="question-text">' + exercise.question + '</div>';
        var html = '<div class="options-grid">';
        exercise.options.forEach(function(opt) {
            html += '<button class="btn btn-option" data-answer="' + opt + '">' + opt + '</button>';
        });
        html += '</div>';
        answerInputs.innerHTML = html;
        answerInputs.querySelectorAll('.btn-option').forEach(function(btn) {
            btn.addEventListener('click', function() {
                handleEnglishAnswer(this.getAttribute('data-answer'));
            });
        });
    }

    function renderListenChoose(exercise, qText, answerInputs) {
        var html = '<div class="question-text">Nghe v\xE0 chọn nghĩa \u0111\xFAng</div>';
        if (window.speechSynthesis) {
            html += '<button id="btn-speak-question" class="btn btn-speak btn-speak-large">'
                  + '\uD83D\uDD0A Nghe t\u1EEB</button>';
        }
        qText.innerHTML = html;

        var optHtml = '<div class="options-grid">';
        exercise.options.forEach(function(opt) {
            optHtml += '<button class="btn btn-option" data-answer="' + opt + '">' + opt + '</button>';
        });
        optHtml += '</div>';
        answerInputs.innerHTML = optHtml;

        var speakBtn = document.getElementById('btn-speak-question');
        if (speakBtn) {
            speakBtn.addEventListener('click', function() { speakWord(exercise.wordToSpeak); });
            setTimeout(function() { speakWord(exercise.wordToSpeak); }, 500);
        }
        answerInputs.querySelectorAll('.btn-option').forEach(function(btn) {
            btn.addEventListener('click', function() {
                handleEnglishAnswer(this.getAttribute('data-answer'));
            });
        });
    }

    function renderSpelling(exercise, qText, answerInputs) {
        qText.innerHTML = '<div class="question-text">' + exercise.question + '</div>'
            + '<div class="hint-text">(' + exercise.hint + ' ch\u1EEF c\xE1i)</div>';
        answerInputs.innerHTML =
            '<input type="text" id="spelling-input" class="input-spelling" '
            + 'placeholder="Nh\u1EADp t\u1EEB ti\u1EBFng Anh..." autocomplete="off" autocapitalize="off" />'
            + '<button id="btn-submit-spelling" class="btn btn-primary">Ki\u1EC3m tra</button>';
        // #btn-check stays hidden (reset by renderEnglishQuestionUI) - submit is handled by
        // #btn-submit-spelling above, since the dispatcher's checkAnswer() takes no argument.

        var input = document.getElementById('spelling-input');
        if (input) {
            input.focus();
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') handleEnglishAnswer(input.value);
            });
        }
        var submitBtn = document.getElementById('btn-submit-spelling');
        if (submitBtn) {
            submitBtn.addEventListener('click', function() {
                handleEnglishAnswer(input.value);
            });
        }
    }


    // ── Answer handling (mirrors checkMathAnswer flow) ──

    function handleEnglishAnswer(answer) {
        if (!answer) return;
        var isCorrect = checkEnglishAnswer(answer);

        // Disable all option buttons / inputs
        var answerInputs = document.getElementById('answer-inputs');
        if (answerInputs) {
            answerInputs.querySelectorAll('button, input').forEach(function(el) {
                el.disabled = true;
            });
        }

        // ── Update stats (same flow as checkMathAnswer) ──
        state.stats.totalQuestions++;
        var theme = state.currentTheme;

        if (isCorrect) {
            state.stats.correctCount++;
            var delta = state.streakAchievedToday ? 3 : 2;
            if (typeof addStars === 'function') {
                var newStars = addStars(theme, delta);
                var prevStars = newStars - delta;
                if (typeof STAR_MILESTONES !== 'undefined') {
                    var crossed = STAR_MILESTONES.find(function(m) { return prevStars < m && newStars >= m; });
                    if (crossed && typeof triggerStarMilestone === 'function') triggerStarMilestone(crossed);
                }
            }
            var justAchieved = false;
            if (typeof checkStreakAchievement === 'function') {
                justAchieved = checkStreakAchievement(theme, state.stats.correctCount);
            }
            if (justAchieved && typeof triggerStreakCelebration === 'function') {
                triggerStreakCelebration(getGlobalState(theme).streak);
            }
            if (typeof showSuccess === 'function') showSuccess();
        } else {
            state.stats.wrongCount++;
            if (typeof addStars === 'function') addStars(theme, -1);
            if (typeof showError === 'function') showError();
        }

        if (typeof saveStats === 'function') saveStats();
        if (typeof updateStatsUI === 'function') updateStatsUI();
        if (typeof renderStreakBar === 'function') renderStreakBar(theme);

        showEnglishResultDetails(isCorrect);

        // Show next button
        var btnNext = document.getElementById('btn-next');
        if (btnNext) btnNext.classList.remove('hidden');
    }

    function showEnglishResultDetails(isCorrect) {
        // Show feedback in existing #result-feedback area
        var feedbackEl = document.getElementById('result-feedback');
        if (feedbackEl) feedbackEl.classList.remove('hidden');
        var feedbackText = document.getElementById('feedback-text');
        if (feedbackText) {
            var prefix = isCorrect ? '\u2705 Ch\xEDnh x\xE1c!' : '\u274C Sai r\u1ED3i!';
            feedbackText.textContent = prefix + ' '
                + currentExercise.correctWord.en + ' = ' + currentExercise.correctWord.vi;
        }

        // Hide check button
        var btnCheck = document.getElementById('btn-check');
        if (btnCheck) btnCheck.classList.add('hidden');

        // Lock all inputs/buttons in answer area
        var answerInputs = document.getElementById('answer-inputs');
        if (answerInputs) {
            answerInputs.querySelectorAll('input').forEach(function(inp) { inp.disabled = true; });
            answerInputs.querySelectorAll('button').forEach(function(btn) { btn.disabled = true; });
        }

        // Add word detail card + speak button
        if (!currentExercise) return;
        var oldDetail = document.querySelector('.result-details');
        if (oldDetail) oldDetail.remove();

        var html = '<div class="result-details">'
            + '<div class="result-word">'
            + '<div class="word-en">' + currentExercise.correctWord.en + '</div>'
            + '<div class="word-vi">' + currentExercise.correctWord.vi + '</div>'
            + '</div>';
        if (window.speechSynthesis) {
            html += '<button id="btn-speak-result" class="btn btn-speak">'
                  + '\uD83D\uDD0A Nghe ph\xE1t \xE2m</button>';
        }
        html += '</div>';
        if (answerInputs) answerInputs.insertAdjacentHTML('afterend', html);

        var speakBtn = document.getElementById('btn-speak-result');
        if (speakBtn) {
            speakBtn.addEventListener('click', function() {
                speakWord(currentExercise.correctWord.en);
            });
        }
    }

    // ── Dispatcher wrapper ──
    // Called by renderQuestion() dispatcher in game-engine.js
    function renderEnglishQuestion() {
        var exercise = window.EnglishGenerators.generateEnglishQuestion();
        currentExercise = exercise;
        renderEnglishQuestionUI(exercise);
    }

    // ── Exports ──
    window.renderEnglishQuestion = renderEnglishQuestion;
    window.checkEnglishAnswer = checkEnglishAnswer;
    window.showEnglishResultDetails = showEnglishResultDetails;
    window.speakWord = speakWord;

})();
