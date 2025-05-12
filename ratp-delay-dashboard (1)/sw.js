// Nom du cache
const CACHE_NAME = "ratp-info-cache-v1"

// Fichiers à mettre en cache
const urlsToCache = [
  "/",
  "/index.php",
  "/style.css",
  "/app.js",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
]

// Installation du service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache ouvert")
      return cache.addAll(urlsToCache)
    }),
  )
  // Activation immédiate
  self.skipWaiting()
})

// Activation du service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Supprimer les anciens caches
            return cacheName !== CACHE_NAME
          })
          .map((cacheName) => caches.delete(cacheName)),
      ),
    ),
  )
  // Prendre le contrôle immédiatement
  self.clients.claim()
})

// Interception des requêtes
self.addEventListener("fetch", (event) => {
  // Stratégie : network first, puis cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la requête réussit, mettre en cache la réponse
        if (response && response.status === 200) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
        }
        return response
      })
      .catch(() => {
        // Si la requête échoue, essayer de récupérer depuis le cache
        return caches.match(event.request).then((response) => {
          if (response) {
            return response
          }

          // Si la requête est pour la page principale, retourner la version en cache
          if (event.request.url.includes("/index.php") || event.request.url.endsWith("/")) {
            return caches.match("/index.php")
          }
        })
      }),
  )
})
