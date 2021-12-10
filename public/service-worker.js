const APP_PREFIX = 'Click-Pocket';
const VERSION = 'v1';
const CACHE_NAME = APP_PREFIX + VERSION;
const DATA_CACHE_NAME = "data-cache" + VERSION;

const FILES_TO_CACHE = [
 "./index.html",
 "./css/styles.css",
 "./js/idb.js",
 "./js/index.js",
 "./manifest.json",
 "./icons/icon-72x72.png",
 "./icons/icon-96x96.png",
 "./icons/icon-128x128.png",
 "./icons/icon-144x144.png",
 "./icons/icon-152x152.png",
 "./icons/icon-192x192.png",
 "./icons/icon-384x384.png",
 "./icons/icon-512x512.png"

]

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})


// clear out old data from cache and tell service worker how to manage caches
self.addEventListener('active', function(e) {
    e.waitUntil(
        // keys function returns array of all cache names called keyList
        caches.keys().then(function (keyList) {
        // keyList is a parameter that contains all cache names under this.git
            let cacheKeepList = keyList.filter(function (key) {
        // filter out caches tht have the same URL, stored in APP_PREFIX and save them to array cacheKeepList
                return key.indexOf(APP_PREFIX);
            })
        // cache name is global constant that keeps track of what cache to use
            cacheKeepList.push(CACHE_NAME);
        })
    )
    // resolves once old versions of cache have been deleted
    return Promise.all(keyList.map(function (key, i) {
        if (cacheKeepList.indexOf(key) === -1) {
            console.log('deleting cache : ' + keyList[i] );
            return caches.delete(keyList[i]);
        }
    }));
});

self.addEventListener('fetch', function(e) {
    console.log('fetch request : ' + e.request.url)
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) {
                console.log('responding with cache : ' + e.request.url)
                return request
            } else {
                console.log('file is not cached, fetching : ' + e.request.url)
                return fetch(e.request)
            }
        })
    )
})