self.addEventListener('fetch', (event) => {
    const requestURL = new URL(event.request.url);
    if (requestURL.pathname.startsWith('/fit-in/') || requestURL.pathname.startsWith('/vp/')) {
        event.respondWith(
            caches.open('resized-images').then(cache => {
                return cache.match(event.request.url).then(response => {
                    console.log("Found in the cache: ", event.request.url)
                    return response || fetch(event.request).then(resizedImage => {
                        console.log("Fetched from the server: ", event.request.url)
                        cache.put(event.request.url, resizedImage.clone());
                        return resizedImage;
                    }).catch(err => console.error(err))
                }).catch(err => console.error(err))
            }).catch(err => console.error(err))
        )
        return;
    }
});