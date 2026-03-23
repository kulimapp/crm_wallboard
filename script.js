// --- НАСТРОЙКИ ---
const API_URL = 'https://script.google.com/macros/s/AKfycbwdhvmION8Mpd4jr_aHQTPY_vwwwwrrr31uKkorPBtoXTijjm0YYMLDOOK1U0nh2LRhOA/exec';
const ANIMATION_INTERVAL   = 30000;   // 30 секунд (перезапуск анимаций)

let cachedData = null;

// --- Управление размерами (Энам) ---
// Базовые размеры увеличены на 20% от предыдущей версии
const SIZES = {
    regular: {
        containerMaxWidth: 1920, 
        logoMaxWidth: 281, logoMarginBottom: 12, logoMarginTop: 17, logoShadowBlur: 9,
        gridGap: 25, gridMarginBottom: 32,
        cardPaddingY: 16, cardPaddingX: 17, cardBorderRadius: 17, cardBackdropBlur: 9,
        valueFontSize: 3.68, valueMarginBottom: 9,
        labelFontSize: 0.96, labelLetterSpacing: 1.7,
        officesGapY: 42, officesGapX: 25, officesPaddingTop: 33,
        officeCardPaddingX: 17, officeCardMinWidth: 206,
        officeNameFontSize: 1.08, officeNameMarginBottom: 4,
        officeAddrFontSize: 0.86, officeAddrMarginBottom: 4,
        officePhoneFontSize: 0.78,
        clockFontSize: 3, clockMarginBottom: 16,
    }
};

function createScaledSize(baseSize, factor) {
    const newSize = {};
    for (const key in baseSize) {
        if (typeof baseSize[key] === 'number') {
            newSize[key] = baseSize[key] * factor;
        } else {
            newSize[key] = baseSize[key];
        }
    }
    return newSize;
}

SIZES.large = createScaledSize(SIZES.regular, 1.2);  // +20%
SIZES.xlarge = createScaledSize(SIZES.regular, 1.4); // +40%

let currentSize = 'regular'; 

function applySize(sizeProfileName) {
    const profile = SIZES[sizeProfileName];
    if (!profile) return;

    const root = document.documentElement.style;
    const setProp = (prop, value, unit) => root.setProperty(`--${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value + unit);

    setProp('containerMaxWidth', profile.containerMaxWidth, 'px');
    setProp('logoMaxWidth', profile.logoMaxWidth, 'px');
    setProp('logoMarginBottom', profile.logoMarginBottom, 'px');
    setProp('logoMarginTop', profile.logoMarginTop, 'px');
    setProp('logoShadowBlur', profile.logoShadowBlur, 'px');
    setProp('gridGap', profile.gridGap, 'px');
    setProp('gridMarginBottom', profile.gridMarginBottom, 'px');
    setProp('cardPaddingY', profile.cardPaddingY, 'px');
    setProp('cardPaddingX', profile.cardPaddingX, 'px');
    setProp('cardBorderRadius', profile.cardBorderRadius, 'px');
    setProp('cardBackdropBlur', profile.cardBackdropBlur, 'px');
    setProp('valueFontSize', profile.valueFontSize, 'rem');
    setProp('valueMarginBottom', profile.valueMarginBottom, 'px');
    setProp('labelFontSize', profile.labelFontSize, 'rem');
    setProp('labelLetterSpacing', profile.labelLetterSpacing, 'px');
    setProp('officesGapY', profile.officesGapY, 'px');
    setProp('officesGapX', profile.officesGapX, 'px');
    setProp('officesPaddingTop', profile.officesPaddingTop, 'px');
    setProp('officeCardPaddingX', profile.officeCardPaddingX, 'px');
    setProp('officeCardMinWidth', profile.officeCardMinWidth, 'px');
    setProp('officeNameFontSize', profile.officeNameFontSize, 'rem');
    setProp('officeNameMarginBottom', profile.officeNameMarginBottom, 'px');
    setProp('officeAddrFontSize', profile.officeAddrFontSize, 'rem');
    setProp('officeAddrMarginBottom', profile.officeAddrMarginBottom, 'px');
    setProp('officePhoneFontSize', profile.officePhoneFontSize, 'rem');
    setProp('clockFontSize', profile.clockFontSize, 'rem');
    setProp('clockMarginBottom', profile.clockMarginBottom, 'px');
}

function animateNumber(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (start === end) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        obj.innerHTML = current.toLocaleString('ru-RU');
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

async function fetchData() {
    try {
        const response = await fetch(API_URL);
        cachedData = await response.json();
        renderWallboard();
    } catch (err) {
        console.error("Ошибка загрузки данных:", err);
    }
}

function renderWallboard() {
    if (!cachedData) return;
    const data = cachedData;

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

// --- Часы (Время Алматы) ---
function updateClock() {
    let clockEl = document.getElementById('wall-clock');
    if (!clockEl) {
        clockEl = document.createElement('div');
        clockEl.id = 'wall-clock';
        const logo = document.querySelector('.logo');
        if (logo && logo.parentNode) {
            logo.parentNode.insertBefore(clockEl, logo.nextSibling);
        } else {
            document.body.appendChild(clockEl);
        }
    }
    clockEl.innerText = new Date().toLocaleTimeString('ru-RU', { 
        timeZone: 'Asia/Almaty', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Инициализация интервала анимации (данные загружаются только при старте)
setInterval(renderWallboard, ANIMATION_INTERVAL);
setInterval(updateClock, 1000); // Обновление часов каждую секунду

applySize(currentSize);
updateClock();
fetchData();
