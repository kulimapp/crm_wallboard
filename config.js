// config.js - Глобальные настройки и конфигурация размеров

const API_URL = 'https://script.google.com/macros/s/AKfycbzHbvJO7_qk-asIHyCxlU-opZ_nyvFapnpbA3DaFP0tKlvJOs2yP8ti-QCkSb2Nv405jA/exec';

// --- Управление размерами (Энам) ---
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

// Текущий профиль размеров по умолчанию
let currentSize = 'small'; 

// Настройка мигания часов: 'COLON' (только двоеточие) или 'ALL' (все часы)
const CLOCK_BLINK_MODE = 'ALL';