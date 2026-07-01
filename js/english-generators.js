// English Generators - pure exercise generation logic (no DOM), split out of
// english-engine.js to keep each file under the ~200 line project convention.
// Provides: window.EnglishGenerators { EXERCISE_TYPES, generateEnglishQuestion }

(function() {
    'use strict';

    var EXERCISE_TYPES = {
        MC_EN_VN: 'mc_en_vn',
        MC_VN_EN: 'mc_vn_en',
        LISTEN_CHOOSE: 'listen_choose',
        SPELLING: 'spelling'
    };

    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = array[i]; array[i] = array[j]; array[j] = tmp;
        }
        return array;
    }

    function generateDistractors(correctWord, vocabPool, count) {
        var samePos = vocabPool.filter(function(w) {
            return w.pos === correctWord.pos && w.en !== correctWord.en;
        });
        // Exclude by both en AND vi so two entries with the same translation
        // (e.g. "wake up"/"get up" → "thức dậy") never both land as visible options.
        var usedEn = {};
        var usedVi = {};
        usedEn[correctWord.en] = true;
        usedVi[correctWord.vi] = true;
        var result = [];
        function tryAdd(w) {
            if (result.length >= count) return;
            if (usedEn[w.en] || usedVi[w.vi]) return;
            result.push(w);
            usedEn[w.en] = true;
            usedVi[w.vi] = true;
        }
        // Prefer same POS first
        var shuffled = shuffleArray(samePos.slice());
        for (var i = 0; i < shuffled.length && result.length < count; i++) tryAdd(shuffled[i]);
        // Fallback: random from full pool
        if (result.length < count) {
            var others = shuffleArray(vocabPool.slice());
            for (var j = 0; j < others.length && result.length < count; j++) tryAdd(others[j]);
        }
        return result;
    }

    function generateEnglishQuestion() {
        var vocabPool = state.currentGrade === 1 ? VOCAB_STARTERS : VOCAB_A2KEY;
        var availableTypes = [
            EXERCISE_TYPES.MC_EN_VN,
            EXERCISE_TYPES.MC_VN_EN,
            EXERCISE_TYPES.LISTEN_CHOOSE
        ];
        if (state.currentGrade === 4) {
            availableTypes.push(EXERCISE_TYPES.SPELLING);
        }
        var exerciseType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        var correctWord = vocabPool[Math.floor(Math.random() * vocabPool.length)];
        var exercise = { type: exerciseType, correctWord: correctWord };

        if (exerciseType === EXERCISE_TYPES.MC_EN_VN) {
            var wrongs = generateDistractors(correctWord, vocabPool, 3);
            var options = shuffleArray([correctWord].concat(wrongs));
            exercise.question = correctWord.en;
            exercise.options = options.map(function(w) { return w.vi; });
            exercise.correctAnswer = correctWord.vi;
        } else if (exerciseType === EXERCISE_TYPES.MC_VN_EN) {
            var wrongs2 = generateDistractors(correctWord, vocabPool, 3);
            var options2 = shuffleArray([correctWord].concat(wrongs2));
            exercise.question = correctWord.vi;
            exercise.options = options2.map(function(w) { return w.en; });
            exercise.correctAnswer = correctWord.en;
        } else if (exerciseType === EXERCISE_TYPES.LISTEN_CHOOSE) {
            var wrongs3 = generateDistractors(correctWord, vocabPool, 3);
            var options3 = shuffleArray([correctWord].concat(wrongs3));
            exercise.wordToSpeak = correctWord.en;
            exercise.options = options3.map(function(w) { return w.vi; });
            exercise.correctAnswer = correctWord.vi;
        } else if (exerciseType === EXERCISE_TYPES.SPELLING) {
            exercise.question = correctWord.vi;
            exercise.correctAnswer = correctWord.en;
            exercise.hint = correctWord.en.length;
        }

        return exercise;
    }

    window.EnglishGenerators = {
        EXERCISE_TYPES: EXERCISE_TYPES,
        generateEnglishQuestion: generateEnglishQuestion
    };

})();
