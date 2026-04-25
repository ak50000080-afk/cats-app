// 🌐 Адрес твоего сервера на Railway
const API_URL = 'https://cattttt-production.up.railway.app';

// 🐱 Эмодзи котов для разнообразия карточек
const catEmojis = ['🐱', '😺', '😸', '😻', '🐈', '🐈‍⬛', '🙀', '😽'];

// 🚀 Запускаем загрузку котов при открытии страницы
document.addEventListener('DOMContentLoaded', loadCats);

// 📥 Функция загрузки котов с сервера
async function loadCats() {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const container = document.getElementById('cats-container');

    // Показываем загрузку, прячем остальное
    loading.classList.remove('hidden');
    error.classList.add('hidden');
    container.classList.add('hidden');

    try {
        console.log('Загружаем котов с:', API_URL);
        
        // Пробуем разные эндпоинты
        let cats = await tryFetch(API_URL + '/cats');
        if (!cats) cats = await tryFetch(API_URL + '/api/cats');
        if (!cats) cats = await tryFetch(API_URL + '/');
        
        if (!cats || cats.length === 0) {
            throw new Error('Коты не найдены');
        }

        console.log('Получено котов:', cats.length);
        displayCats(cats);

    } catch (err) {
        console.error('Ошибка:', err);
        loading.classList.add('hidden');
        error.classList.remove('hidden');
    }
}

// 🔍 Пробуем загрузить с разных адресов
async function tryFetch(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const data = await response.json();
        // Если данные внутри объекта (например, {cats: [...]})
        if (Array.isArray(data)) return data;
        if (data.cats && Array.isArray(data.cats)) return data.cats;
        if (data.data && Array.isArray(data.data)) return data.data;
        return null;
    } catch (e) {
        return null;
    }
}

// 🎨 Функция отображения котов на экране
function displayCats(cats) {
    const loading = document.getElementById('loading');
    const container = document.getElementById('cats-container');

    container.innerHTML = '';

    cats.forEach((cat, index) => {
        const card = createCatCard(cat, index);
        container.appendChild(card);
    });

    loading.classList.add('hidden');
    container.classList.remove('hidden');
}

// 🃏 Создаём карточку одного кота
function createCatCard(cat, index) {
    const card = document.createElement('div');
    card.className = 'cat-card';
    card.style.animationDelay = (index * 0.1) + 's';

    // Берём случайный эмодзи кота
    const emoji = catEmojis[index % catEmojis.length];

    // Получаем данные кота (с защитой от отсутствующих полей)
    const name = cat.name || cat.имя || 'Безымянный котик';
    const breed = cat.breed || cat.порода || 'Неизвестная порода';
    const age = cat.age || cat.возраст || '?';
    const color = cat.color || cat.цвет || '';
    const description = cat.description || cat.описание || '';

    // Если есть картинка кота — используем её, иначе эмодзи
    const imageHTML = cat.image || cat.photo 
        ? `<img src="${cat.image || cat.photo}" alt="${name}" style="width:100%;height:100%;object-fit:cover;">`
        : emoji;

    card.innerHTML = `
        <div class="cat-image">${imageHTML}</div>
        <div class="cat-info">
            <div class="cat-name">${name}</div>
            ${breed !== 'Неизвестная порода' ? `<div class="cat-detail"><strong>Порода:</strong> ${breed}</div>` : ''}
            ${age !== '?' ? `<div class="cat-detail"><strong>Возраст:</strong> ${age}</div>` : ''}
            ${color ? `<div class="cat-detail"><strong>Цвет:</strong> ${color}</div>` : ''}
            ${description ? `<div class="cat-detail">${description}</div>` : ''}
        </div>
    `;

    return card;
}
