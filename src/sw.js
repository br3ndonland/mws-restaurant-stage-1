// ~~~~~~~~~~~~~~~~~~~~~~~~~ Service Worker for restaurant reviews app ~~~~~~~~~~~~~~~~~~~~~~~~~ //
/* eslint-env serviceworker */
// Set up cache ID variable
const cacheID = 'udacity-google-mws-v1'

// Install: Open a cache, cache files, return any errors
self.addEventListener('install', event => {
  const filesToCache = [
    '/',
    '/index.html',
    '/restaurant.html',
    '/sw.js',
    '/assets/css/styles.css',
    '/assets/img/',
    '/assets/img/1.jpg',
    '/assets/img/2.jpg',
    '/assets/img/3.jpg',
    '/assets/img/4.jpg',
    '/assets/img/5.jpg',
    '/assets/img/6.jpg',
    '/assets/img/7.jpg',
    '/assets/img/8.jpg',
    '/assets/img/9.jpg',
    '/assets/img/10.jpg',
    '/assets/img/favicon.ico',
    '/assets/img/icons-192.jpg',
    '/assets/img/icons-512.jpg',
    '/assets/js/dbhelper.js',
    '/assets/js/index.js',
    '/assets/js/restaurant.js'
  ]
  event.waitUntil(caches.open(cacheID).then(cache => {
    return cache.addAll(filesToCache).catch(error => {
      console.log(`Caching failed: ${error}.`)
    })
  }))
})
// Fetch: Intercept network fetch request and return resources from cache
self.addEventListener('fetch', event => {
  let cacheRequest = event.request
  let cacheUrlObj = new URL(event.request.url)
  if (cacheUrlObj.hostname !== 'localhost') { event.request.mode = 'no-cors' }
  if (event.request.url.indexOf('restaurant.html') > -1) {
    const cacheURL = 'restaurant.html'
    cacheRequest = new Request(cacheURL)
  }
  event.respondWith(caches.match(cacheRequest).then(response => {
    return (response || fetch(event.request).then(fetchResponse => {
      return caches.open(cacheID).then(() => { return fetchResponse })
    }).catch(error => { throw (error) })
    )
  })
  )
})
