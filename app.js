// Данные вопросов и результатов
const questions = [
    {
        id: 1,
        text: "Какой тип велосипеда вас интересует?",
        options: [
            { text: "Городской (для повседневных поездок)", value: "city" },
            { text: "Горный (для бездорожья и трейлов)", value: "mountain" },
            { text: "Шоссейный (для скоростной езды по асфальту)", value: "road" },
            { text: "Гибридный (универсальный вариант)", value: "hybrid" }
        ]
    },
    {
        id: 2,
        text: "Как часто вы планируете кататься?",
        options: [
            { text: "Несколько раз в месяц", value: "occasional" },
            { text: "Несколько раз в неделю", value: "regular" },
            { text: "Почти каждый день", value: "daily" }
        ]
    },
    {
        id: 3,
        text: "Где вы преимущественно будете кататься?",
        options: [
            { text: "В городе по асфальту", value: "city" },
            { text: "За городом по грунтовым дорогам", value: "country" },
            { text: "По горным тропам", value: "mountains" },
            { text: "По разным типам поверхностей", value: "mixed" }
        ]
    },
    {
        id: 4,
        text: "Ваш уровень подготовки?",
        options: [
            { text: "Начинающий", value: "beginner" },
            { text: "Средний", value: "intermediate" },
            { text: "Опытный", value: "advanced" }
        ]
    },
    {
        id: 5,
        text: "Какой у вас бюджет?",
        options: [
            { text: "До 20 000 руб.", value: "low" },
            { text: "20 000 - 50 000 руб.", value: "medium" },
            { text: "Более 50 000 руб.", value: "high" }
        ]
    }
];

// Результаты подбора
const bikeResults = {
    city: {
        low: "City Bike Basic - удобный городской велосипед с базовой комплектацией",
        medium: "City Bike Pro - городской велосипед с улучшенными компонентами и амортизацией",
        high: "City Bike Premium - премиальный городской велосипед с электроникой и премиальными материалами"
    },
    mountain: {
        low: "MTB Trail 100 - начальный горный велосипед с базовой амортизацией",
        medium: "MTB Trail 300 - горный велосипед среднего уровня с хорошей амортизацией",
        high: "MTB Trail 500 - профессиональный горный велосипед с полной подвеской"
    },
    road: {
        low: "Road Speed 100 - шоссейный велосипед начального уровня",
        medium: "Road Speed 300 - шоссейный велосипед с карбоновой вилкой",
        high: "Road Speed 500 - профессиональный шоссейный велосипед с карбоновой рамой"
    },
    hybrid: {
        low: "Hybrid Comfort 100 - универсальный велосипед для города и легкого бездорожья",
        medium: "Hybrid Comfort 300 - улучшенный гибрид с амортизационной вилкой",
        high: "Hybrid Comfort 500 - премиальный гибрид с электронным переключением передач"
    }
};

// Текущее состояние приложения
let currentQuestion = 0;
const answers = {};

// DOM элементы
const questionContainer = document.getElementById('question-container');
const resultContainer = document.getElementById('result-container');
const bikeResult = document.getElementById('bike-result');
const restartBtn = document.getElementById('restart-btn');

// Инициализация приложения
function initApp() {
    showQuestion();
    setupServiceWorker();
}

// Показать текущий вопрос
function showQuestion() {
    if (currentQuestion >= questions.length) {
        showResult();
        return;
    }

    const question = questions[currentQuestion];
    let optionsHTML = '';

    question.options.forEach(option => {
        optionsHTML += `
            <div class="option" data-value="${option.value}">
                ${option.text}
            </div>
        `;
    });

    questionContainer.innerHTML = `
        <div class="question">
            <h3>${question.text}</h3>
            <div class="options">
                ${optionsHTML}
            </div>
        </div>
    `;

    // Добавляем обработчики событий для вариантов ответа
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
            selectOption(this);
        });
    });
}

// Выбор варианта ответа
function selectOption(optionElement) {
    // Убираем выделение у всех вариантов
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });

    // Выделяем выбранный вариант
    optionElement.classList.add('selected');

    // Сохраняем ответ
    const question = questions[currentQuestion];
    answers[question.id] = optionElement.dataset.value;

    // Автоматически переходим к следующему вопросу через короткую паузу
    setTimeout(() => {
        currentQuestion++;
        showQuestion();
    }, 500);
}

// Показать результат
function showResult() {
    questionContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');

    // Определяем тип велосипеда (ответ на первый вопрос)
    const bikeType = answers[1];
    // Определяем бюджет (ответ на последний вопрос)
    const budget = answers[5];

    // Получаем рекомендацию
    const recommendation = bikeResults[bikeType][budget];

    bikeResult.innerHTML = `
        <h3>На основе ваших ответов мы рекомендуем:</h3>
        <p><strong>${recommendation}</strong></p>
        <p>Этот велосипед идеально подойдет для ваших нужд!</p>
    `;
}

// Начать тест заново
restartBtn.addEventListener('click', function() {
    currentQuestion = 0;
    questionContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    showQuestion();
});

// Регистрация Service Worker
function setupServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful');
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', initApp);