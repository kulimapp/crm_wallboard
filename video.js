// video.js - Логика работы с промо-видео

let promoVideoTimer = null;
let videoList = [];
let currentVideoIndex = 0;
let videoIntervalMs = 5 * 60 * 1000;
let settingsHash = ''; // Используется для отслеживания изменений настроек

function handlePromoVideo(settings) {
    const listStr = settings?.promo_video_list || '';
    const intervalMin = settings?.promo_video_interval || 5; 
    
    console.log("[Video Debug] Сырая строка из таблицы:", listStr);

    // Проверяем, изменились ли настройки, чтобы не сбрасывать таймер без нужды
    const newHash = listStr + '_' + intervalMin;
    if (newHash !== settingsHash) {
        settingsHash = newHash;
        
        // Парсим список видео из строки (убираем пробелы)
        videoList = listStr.split(',').map(s => s.trim()).filter(s => s);
        console.log("[Video Debug] Распарсенный массив видео:", videoList);
        
        videoIntervalMs = intervalMin * 60 * 1000;
        
        currentVideoIndex = 0;

        if (promoVideoTimer) clearInterval(promoVideoTimer);

        if (videoList.length > 0) {
            setupVideoDOM();
            scheduleNextVideo();
        }
    }
}

function setupVideoDOM() {
    let container = document.getElementById('promo-video-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'promo-video-container';
        // src не задаем сразу, он будет подставляться перед воспроизведением
        container.innerHTML = `<video id="promo-video" muted playsinline></video>`;
        document.body.appendChild(container);

        const video = document.getElementById('promo-video');
        
        // Когда видео заканчивается, прячем его и планируем следующее через X минут
        video.addEventListener('ended', hideAndScheduleNext);
        
        // Если файл не найден (например, флешку вытащили), пропускаем и ждем дальше
        video.addEventListener('error', (e) => {
            const err = video.error;
            console.error("[Video Debug] Ошибка на элементе <video>!");
            console.error(" - Установленный src:", video.src);
            console.error(" - Код ошибки (MediaError):", err ? err.code : 'N/A');
            console.error(" - Детали:", err ? err.message : 'N/A');
            hideAndScheduleNext();
        });
    }
}

function hideAndScheduleNext() {
    const container = document.getElementById('promo-video-container');
    container.style.opacity = '0';
    setTimeout(() => {
        container.style.display = 'none';
        scheduleNextVideo(); // Запускаем отсчет 5 минут ДО следующего видео
    }, 1000);
}

function scheduleNextVideo() {
    if (promoVideoTimer) clearTimeout(promoVideoTimer);
    if (videoList.length === 0) return;

    // Запускаем ожидание перед показом
    console.log(`[Video Debug] Ждем ${videoIntervalMs} мс до показа следующего видео...`);
    promoVideoTimer = setTimeout(playNextVideo, videoIntervalMs);
}

function playNextVideo() {
    if (videoList.length === 0) return;

    const container = document.getElementById('promo-video-container');
    const video = document.getElementById('promo-video');

    const nextSrc = videoList[currentVideoIndex];
    console.log(`[Video Debug] Пытаемся запустить видео: [${currentVideoIndex}] ->`, nextSrc);
    // Устанавливаем текущее видео из списка
    video.src = nextSrc;
    
    // Передвигаем индекс для следующего раза, зацикливаем при достижении конца
    currentVideoIndex = (currentVideoIndex + 1) % videoList.length;

    container.style.display = 'block';
    setTimeout(() => {
        container.style.opacity = '1';

        video.muted = true;
        video.currentTime = 0;
        video.play().then(() => {
            console.log("[Video Debug] Успешный старт воспроизведения!");
        }).catch(err => {
            console.error("[Video Debug] Ошибка запуска play():", err.name, err.message);
        });
    }, 50);
}