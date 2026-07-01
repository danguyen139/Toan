const state = {
    currentGrade: 0,
    currentTheme: 'girl',
    currentSubject: 'math',
    stats: {
        startTime: null,
        totalQuestions: 0,
        correctCount: 0,
        wrongCount: 0,
        secondsSpent: 0
    },
    currentProblem: null,
    timerInterval: null,
    selectedCompare: null,
    streakAchievedToday: false,
    consecutiveCorrect: 0
};

const girlPraise = [
    "Đúng rồi! Meo meo!", "Con giỏi quá! Tặng con 1 chú mèo!",
    "Tuyệt vời! Cat-tastic!", "Xuất sắc luôn!", "Meo! Chính xác rồi!"
];
const boyPraise = [
    "Siêu Anh Hùng đây rồi!", "Mạnh mẽ quá! Thắng rồi!",
    "Iron Man khen con đấy!", "Spider-Web! Trúng phóc!", "Quá đỉnh luôn siêu nhân!"
];
const encouragements = [
    "Cố lên con nhé!", "Không sao, thử lại nào!",
    "Gần đúng rồi, tập trung hơn nhé!", "Bình tĩnh tính lại con nhé!"
];

const girlMascots = [
    "cat.png", "dog.png", "rabbit.png", "panda.png",
    "hamster.png", "elsa.png", "doraemon.png", "hello_kitty.png",
    "kirby.svg", "totoro.svg", "stitch.svg"
];
const boyMascots = [
    "hero_iron.png", "hero_spider.png", "hero_cap.png", "hero_bat.png",
    "hero_super.png", "hero_wonder.png", "minion.png", "pikachu.png",
    "hulk.svg", "sonic.svg", "goku.svg"
];

function formatVN(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
