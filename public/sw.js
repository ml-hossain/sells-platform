const CACHE_NAME = 'nextgen-edumigrate-v1';
const STATIC_CACHE_NAME = 'nextgen-static-v1';
const DYNAMIC_CACHE_NAME = 'nextgen-dynamic-v1';

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/about',
  '/contact',
  '/universities',
  '/travel',
  '/offline.html',
  // Add your critical CSS and JS files here
  '/_next/static/css/',
  '/_next/static/js/',
];

// API endpoints to cache with different strategies
const API_ENDPOINTS = [
  '/api/universities',
  '/api/settings',
  '/api/team',
  '/api/success-stories',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        // Failed to cache static assets
      })
  );
  
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE_NAME &&
              cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Skip POST requests and other non-GET requests for forms
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle different types of requests with appropriate caching strategies
  
  // 1. Static assets - Cache First
  if (isStaticAsset(request.url)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE_NAME));
    return;
  }
  
  // 2. API requests - Network First with fallback
  if (isApiRequest(request.url)) {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE_NAME));
    return;
  }
  
  // 3. Navigation requests - Network First with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      networkFirstStrategy(request, DYNAMIC_CACHE_NAME)
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }
  
  // 4. Other requests - Stale While Revalidate
  event.respondWith(staleWhileRevalidateStrategy(request, DYNAMIC_CACHE_NAME));
});

// Caching Strategies

// Cache First - Good for static assets
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    return new Response('Network error', { status: 408 });
  }
}

// Network First - Good for API requests and dynamic content
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Stale While Revalidate - Good for frequently updated content
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Fetch fresh version in background
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });
  
  // Return cached version immediately if available
  return cachedResponse || fetchPromise;
}

// Helper functions
function isStaticAsset(url) {
  return url.includes('/_next/static/') ||
         url.includes('.css') ||
         url.includes('.js') ||
         url.includes('.woff') ||
         url.includes('.woff2') ||
         url.includes('.png') ||
         url.includes('.jpg') ||
         url.includes('.jpeg') ||
         url.includes('.svg') ||
         url.includes('.ico');
}

function isApiRequest(url) {
  return url.includes('/api/') || API_ENDPOINTS.some(endpoint => url.includes(endpoint));
}

// Background sync for form submissions (when online)
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForms());
  }
  
  if (event.tag === 'consultation-form-sync') {
    event.waitUntil(syncConsultationForms());
  }
});

// Sync functions for offline form submissions
async function syncContactForms() {
  // Implementation for syncing offline contact form submissions
}

async function syncConsultationForms() {
  // Implementation for syncing offline consultation form submissions
}

// Push notification handling
self.addEventListener('push', (event) => {
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from NextGen EduMigrate',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: 'nextgen-notification',
    renotify: true,
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/action-dismiss.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('NextGen EduMigrate', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
