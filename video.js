// video.js - Логика работы с промо-видео

let promoVideoTimer = null;
let currentVideoUrl = null;
let currentVideoInterval = null;

function handlePromoVideo(settings) {
    const videoUrl = settings?.promo_video_url || 'https://www.w3schools.com/html/mov_bbb.mp4';
    const videoIntervalMin = settings?.promo_video_interval || 30; // По умолчанию 30 минут

    if (videoUrl && (videoUrl !== currentVideoUrl || videoIntervalMin !== currentVideoInterval)) {
        currentVideoUrl = videoUrl;
        currentVideoInterval = videoIntervalMin;

        if (promoVideoTimer) clearInterval(promoVideoTimer);

        let container = document.getElementById('promo-video-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'promo-video-container';
            container.innerHTML = `<video id="promo-video" src="${videoUrl}" muted playsinline></video>`;
            document.body.appendChild(container);

            const video = document.getElementById('promo-video');
            video.addEventListener('ended', () => {
                container.style.opacity = '0';
                setTimeout(() => container.style.display = 'none', 1000); 
            });
        }

        promoVideoTimer = setInterval(() => {
            const container = document.getElementById('promo-video-container');
            const video = document.getElementById('promo-video');
            container.style.display = 'block';
            setTimeout(() => {
                container.style.opacity = '1';
                video.currentTime = 0;
                video.play().catch(err => console.error("Autoplay blocked by browser:", err));
            }, 50);
        }, 10000); // MOCK: Запускаем каждые 10 секунд (10000 мс) для тестирования
    }
}