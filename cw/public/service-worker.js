const cacheName = 'alicw3-cache';
const cacheFiles = [
    '/index.html',
    '/images/ArabicLanguage.jpg',
    '/images/ArtsCraft.jpg',
    '/images/ChessClub.jpg',
    '/images/DanceClub.jpg',
    '/images/EnvironmentalScience.jpg',
    '/images/ScienceClub.jpg',
    '/images/Maths.jpg',
    '/images/MusicClass.jpg',
    '/images/ProgrammingKids.jpg',
    '/images/RoboticsWorkshop.jpg',
    '/images/iconcat1.png',
    '/images/iconcat2.png',
    '/favicon.ico',
    '/manifestfile.json'
];

self.addEventListener('install', (event) => {
    console.log('(Service Worker) Installed');
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('(Service Worker) Caching all the files present');
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener('fetch', (event) => {
    // Exclude requests for hot-update.json
    if (event.request.url.includes('hot-update.json')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            // If the cached response is found then return it otherwise no
            if (response) {
                return response;
            }
            // If not found in cache, fetch from the files in network
            return fetch(event.request);
        })
    );
});
