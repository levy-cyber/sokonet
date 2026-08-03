const SERVICE_WORKER_FILE = '/sw.js';

export function registerServiceWorker() {
  if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    window.addEventListener('load', async () => {
      try {
        await unregisterServiceWorker();
        const registration = await navigator.serviceWorker.register(SERVICE_WORKER_FILE);
        console.log('Service Worker registered:', registration.scope);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    });
  }
}

export async function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
    console.log('Service Worker unregistered:', registrations.length);
  }
}
