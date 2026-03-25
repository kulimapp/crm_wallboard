// utils.js - Вспомогательные функции, размеры, анимации и часы

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

SIZES.small = createScaledSize(SIZES.regular, 0.8);  // -20%
SIZES.large = createScaledSize(SIZES.regular, 1.2);  // +20%
SIZES.xlarge = createScaledSize(SIZES.regular, 1.4); // +40%

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
    if (!obj || start === end) return;
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
    const timeString = new Date().toLocaleTimeString('ru-RU', { 
        timeZone: 'Asia/Almaty', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    // Предотвращаем сброс CSS-анимации каждую секунду:
    // Обновляем HTML только когда время реально изменилось (сменилась минута)
    if (clockEl.dataset.time === timeString) return;
    clockEl.dataset.time = timeString;

    if (typeof CLOCK_BLINK_MODE !== 'undefined' && CLOCK_BLINK_MODE === 'ALL') {
        clockEl.innerHTML = timeString;
        clockEl.classList.add('blink');
    } else {
        clockEl.classList.remove('blink');
        clockEl.innerHTML = timeString.replace(':', '<span class="blink">:</span>');
    }
}