let cachedData = null;
let animationIntervalId = null;
let currentAnimationInterval = 30000;

async function fetchData() {
    try {
        const response = await fetch(API_URL);
        cachedData = await response.json();
        console.log("Данные с сервера:", cachedData);
        renderWallboard();
    } catch (err) {
        console.error("Ошибка загрузки данных:", err);
    }
}

function renderWallboard() {
    if (!cachedData) return;
    const data = cachedData;

    // Устанавливаем интервал анимации из Google Sheets
    console.log("Полученные настройки (settings):", data.settings);
    // Берем значение в секундах из таблицы и переводим в миллисекунды
    const newInterval = data.settings?.interval_odometer ? (data.settings.interval_odometer * 1000) : currentAnimationInterval;
    console.log("Применяемый интервал (newInterval):", newInterval);
    if (newInterval !== currentAnimationInterval || !animationIntervalId) {
        currentAnimationInterval = newInterval;
        if (animationIntervalId) clearInterval(animationIntervalId);
        animationIntervalId = setInterval(renderWallboard, currentAnimationInterval);
    }

    // Делегируем логику видео в отдельный модуль
    if (typeof handlePromoVideo === 'function') handlePromoVideo(data.settings);

    // Анимация логотипа
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.classList.remove('logo-anim');
        void logo.offsetWidth; 
        logo.classList.add('logo-anim');
    }

        // Обновляем метрики
        const grid = document.querySelector('.grid');
        if (grid && data.metrics) {
            data.metrics.forEach(metric => {
                let card = document.getElementById(`card-${metric.id}`);
                if (!card) {
                    card = document.createElement('div');
                    card.id = `card-${metric.id}`;
                    card.className = `card ${metric.isMain ? 'main-card' : ''}`;
                    card.innerHTML = `
                        <span class="value" id="val-${metric.id}">0</span>
                        <span class="label" id="lab-${metric.id}">${metric.label}</span>
                    `;
                    grid.appendChild(card);
                } else {
                    document.getElementById(`lab-${metric.id}`).innerText = metric.label;
                    card.className = `card ${metric.isMain ? 'main-card' : ''}`;
                }
                
                // Всегда запускаем счетчик с нуля для визуального эффекта
                animateNumber(`val-${metric.id}`, 0, metric.val, 2000);
            });
            
            // Удаляем карточки, которых больше нет
            const currentIds = data.metrics.map(m => `card-${m.id}`);
            Array.from(grid.children).forEach(child => {
                if (!currentIds.includes(child.id)) {
                    grid.removeChild(child);
                }
            });
        }

        // Обновляем филиалы
        const offContainer = document.getElementById('offices-container');
        if (offContainer && data.offices) {
            offContainer.innerHTML = data.offices.map(off => `
                <div class="office-card">
                    <div class="off-name">${off?.addr || '—'}</div>
                    <div class="off-addr">${off?.name || '—'}</div>
                    <div class="off-phone">${off?.phone || ''}</div>
                </div>
            `).join('');
        }
}

setInterval(updateClock, 1000); // Обновление часов каждую секунду

applySize(currentSize);
updateClock();
fetchData();