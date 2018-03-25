self.addEventListener('fetch', (event) => {
    const requestURL = new URL(event.request.url);
    if (requestURL.pathname.startsWith('/fit-in/') || requestURL.pathname.startsWith('/vp/')) {
        event.respondWith(
            caches.open('resized-images').then(cache => {
                return cache.match(event.request.url).then(response => {
                    return response || fetch(event.request).then(resizedImage => {
                        cache.put(event.request.url, resizedImage.clone());
                        return resizedImage;
                    }).catch(err => console.error(err))
                }).catch(err => console.error(err))
            }).catch(err => console.error(err))
        )
        return;
    }
});