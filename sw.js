/**
 * Service Worker for Landing Page
 * Provides caching, offline functionality, and performance optimizations
 */

const CACHE_NAME = 'juliana-levita-v1.0.0';
const STATIC_CACHE = `${CACHE_NAME}-static`;
const DYNAMIC_CACHE = `${CACHE_NAME}-dynamic`;
const MAX_DYNAMIC_CACHE_SIZE = 50;

// Resources to cache immediately
const STATIC_RESOURCES = [
    '/',
    '/index.html',
    '/css/critical.css',
    '/css/main.css',
    '/js/main.js',
    '/img/juliana.webp',
    '/img/juliana.jpg',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap',
    'https://unpkg.com/aos@2.3.1/dist/aos.css',
    'https://unpkg.com/aos@2.3.1/dist/aos.js'
];

// Resources to cache on demand
const DYNAMIC_RESOURCES = [
    /^https:\/\/fonts\.googleapis\.com/,
    /^https:\/\/fonts\.gstatic\.com/,
    /^https:\/\/unpkg\.com/
];

// Install event - cache static resources
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static resources');
                return cache.addAll(STATIC_RESOURCES);
            })
            .then(() => {
                console.log('Service Worker: Static resources cached');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Failed to cache static resources', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve cached resources or fetch from network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http requests
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    event.respondWith(
        handleFetchRequest(request)
    );
});

async function handleFetchRequest(request) {
    const url = new URL(request.url);
    
    try {
        // Strategy 1: Cache First for static resources
        if (isStaticResource(request)) {
            return await cacheFirst(request);
        }
        
        // Strategy 2: Network First for dynamic content
        if (isDynamicResource(request)) {
            return await networkFirst(request);
        }
        
        // Strategy 3: Stale While Revalidate for other resources
        return await staleWhileRevalidate(request);
        
    } catch (error) {
        console.error('Service Worker: Fetch failed', error);
        
        // Return offline fallback if available
        return await getOfflineFallback(request);
    }
}

// Cache First Strategy
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
        const cache = await caches.open(STATIC_CACHE);
        cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
}

// Network First Strategy
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            
            // Limit dynamic cache size
            await limitCacheSize(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE_SIZE);
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

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request) {
    const cachedResponse = await caches.match(request);
    
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
            const cache = caches.open(DYNAMIC_CACHE);
            cache.then(c => c.put(request, networkResponse.clone()));
        }
        return networkResponse;
    }).catch(() => {
        // Network failed, return cached version if available
        return cachedResponse;
    });
    
    return cachedResponse || fetchPromise;
}

// Helper functions
function isStaticResource(request) {
    const url = new URL(request.url);
    
    // Check if it's a static file
    return STATIC_RESOURCES.some(resource => {
        if (typeof resource === 'string') {
            return url.pathname === resource || url.href === resource;
        }
        return false;
    });
}

function isDynamicResource(request) {
    const url = new URL(request.url);
    
    return DYNAMIC_RESOURCES.some(pattern => {
        if (pattern instanceof RegExp) {
            return pattern.test(url.href);
        }
        return false;
    });
}

async function limitCacheSize(cacheName, maxSize) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    if (keys.length > maxSize) {
        const keysToDelete = keys.slice(0, keys.length - maxSize);
        await Promise.all(keysToDelete.map(key => cache.delete(key)));
    }
}

async function getOfflineFallback(request) {
    const url = new URL(request.url);
    
    // Return cached main page for navigation requests
    if (request.mode === 'navigate') {
        const cachedPage = await caches.match('/index.html');
        if (cachedPage) {
            return cachedPage;
        }
    }
    
    // Return cached version if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // Return offline page or error response
    return new Response(
        JSON.stringify({
            error: 'Offline',
            message: 'Você está offline. Verifique sua conexão com a internet.'
        }),
        {
            status: 503,
            statusText: 'Service Unavailable',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
}

// Background sync for form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'contact-form') {
        event.waitUntil(syncContactForm());
    }
});

async function syncContactForm() {
    try {
        // Get pending form data from IndexedDB
        const pendingForms = await getPendingForms();
        
        for (const formData of pendingForms) {
            try {
                // Process form submission
                await processFormSubmission(formData);
                
                // Remove from pending queue
                await removePendingForm(formData.id);
                
            } catch (error) {
                console.error('Failed to sync form:', error);
            }
        }
        
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Push notifications (if needed in the future)
self.addEventListener('push', event => {
    if (!event.data) return;
    
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/img/icon-192x192.png',
        badge: '/img/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: data.data,
        actions: data.actions
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow(event.notification.data.url || '/')
    );
});

// Message handler for communication with main thread
self.addEventListener('message', event => {
    const { type, payload } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_CACHE_SIZE':
            getCacheSize().then(size => {
                event.ports[0].postMessage({ type: 'CACHE_SIZE', payload: size });
            });
            break;
            
        case 'CLEAR_CACHE':
            clearAllCaches().then(() => {
                event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
            });
            break;
            
        default:
            console.log('Unknown message type:', type);
    }
});

async function getCacheSize() {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        totalSize += keys.length;
    }
    
    return totalSize;
}

async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
}

// Placeholder functions for IndexedDB operations
async function getPendingForms() {
    // Implementation would use IndexedDB to store pending forms
    return [];
}

async function removePendingForm(id) {
    // Implementation would remove form from IndexedDB
    console.log('Removing pending form:', id);
}

async function processFormSubmission(formData) {
    // Implementation would process the form submission
    console.log('Processing form:', formData);
}

console.log('Service Worker: Loaded');

