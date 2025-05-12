// Service Worker pour RATP Info PWA
const CACHE_NAME = "ratp-info-cache-v2" // Incrémenté pour forcer la mise à jour
const API_KEY = "J0f8pdg37O8gU9WBtx4ktGrQPtbuSZJe"

// Fichiers à mettre en cache
const urlsToCache = ["/", "/icons/icon-192x192.png", "/icons/icon-512x512.png"]

// Installation - mise en cache des ressources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache ouvert")
      return cache.addAll(urlsToCache)
    }),
  )
  // Force l'activation immédiate
  self.skipWaiting()
})

// Activation - nettoyage des anciens caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  // Prendre le contrôle immédiatement
  self.clients.claim()
})

// Stratégie de mise en cache : stale-while-revalidate
self.addEventListener("fetch", (event) => {
  // Ne pas intercepter les requêtes API pour éviter les problèmes
  if (event.request.url.includes("/api/")) {
    return
  }

  // Pour les autres ressources, utiliser stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Même si nous avons une réponse en cache, nous lançons une requête réseau
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // Mettre à jour le cache avec la nouvelle réponse
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
            const responseToCache = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })
          }
          return networkResponse
        })
        .catch(() => {
          // Si le réseau échoue, on ne fait rien de spécial ici
          // car on retourne déjà la réponse en cache si elle existe
        })

      // Retourner la réponse en cache ou attendre la réponse réseau
      return cachedResponse || fetchPromise
    }),
  )
})
