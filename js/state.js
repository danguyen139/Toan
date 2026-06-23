export const state = {
    currentGrade: 0,
    currentTheme: 'girl',
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
    streakAchievedToday: false
};

export const girlPraise = [
    "Đúng rồi! Meo meo!", "Con giỏi quá! Tặng con 1 chú mèo!",
    "Tuyệt vời! Cat-tastic!", "Xuất sắc luôn!", "Meo! Chính xác rồi!"
];
export const boyPraise = [
    "Siêu Anh Hùng đây rồi!", "Mạnh mẽ quá! Thắng rồi!",
    "Iron Man khen con đấy!", "Spider-Web! Trúng phóc!", "Quá đỉnh luôn siêu nhân!"
];
export const encouragements = [
    "Cố lên con nhé!", "Không sao, thử lại nào!",
    "Gần đúng rồi, tập trung hơn nhé!", "Bình tĩnh tính lại con nhé!"
];

export const girlMascots = [
    "cat.png", "dog.png", "rabbit.png", "panda.png",
    "hamster.png", "elsa.png", "doraemon.png", "hello_kitty.png"
];
export const boyMascots = [
    "hero_iron.png", "hero_spider.png", "hero_cap.png", "hero_bat.png",
    "hero_super.png", "hero_wonder.png", "minion.png", "pikachu.png"
];

export function formatVN(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
