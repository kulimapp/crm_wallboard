// --- НАСТРОЙКИ ---
const API_URL = 'https://script.google.com/macros/s/AKfycbwoLh6RBh_nTl7N6P85ND02oTqiWYb220Ry9P6utFFEG1Uy--94w3MTwHytDQMNmDLaaw/exec';
const UPDATE_INTERVAL = 5000; // 5 секунд

// --- Управление размерами (Энам) ---
// Базовые размеры увеличены на 20% от предыдущей версии
const SIZES = {
    regular: {
        containerMaxWidth: 1350, 
        logoMaxWidth: 390, logoMarginBottom: 46, logoMarginTop: 23, logoShadowBlur: 12,
        gridGap: 34, gridMarginBottom: 67,
        cardPaddingY: 46, cardPaddingX: 23, cardBorderRadius: 23, cardBackdropBlur: 12,
        valueFontSize: 5.1, valueMarginBottom: 12,
        labelFontSize: 1.32, labelLetterSpacing: 2.3,
        officesGapY: 58, officesGapX: 34, officesPaddingTop: 46,
        officeCardPaddingX: 23, officeCardMinWidth: 286,
        officeNameFontSize: 1.5, officeNameMarginBottom: 6,
        officeAddrFontSize: 1.2, officeAddrMarginBottom: 5,
        officePhoneFontSize: 1.08,
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

async function refresh() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // Анимация логотипа
        const logo = document.querySelector('.logo');
        logo.classList.remove('logo-anim');
        void logo.offsetWidth; 
        logo.classList.add('logo-anim');

        // Обновляем метрики
        animateNumber("m1-val", 0, data.metrics.teeth.val, 2000);
        animateNumber("m2-val", 0, data.metrics.clients.val, 2000);
        animateNumber("m3-val", 0, data.metrics.cities.val, 1500);
        
        document.getElementById('m1-lab').innerText = data.metrics.teeth.label;
        document.getElementById('m2-lab').innerText = data.metrics.clients.label;
        document.getElementById('m3-lab').innerText = data.metrics.cities.label;

        // Обновляем филиалы
        const offContainer = document.getElementById('offices-container');
        offContainer.innerHTML = data.offices.map(off => `
            <div class="office-card">
                <div class="off-name">${off?.addr || '—'}</div>
                <div class="off-addr">${off?.name || '—'}</div>
                <div class="off-phone">${off?.phone || ''}</div>
            </div>
        `).join('');

    } catch (err) {
        console.error("Ошибка обновления:", err);
    }
}

setInterval(refresh, UPDATE_INTERVAL);
applySize(currentSize);
refresh();