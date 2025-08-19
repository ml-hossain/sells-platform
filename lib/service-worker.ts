'use client';

declare global {
  interface Window {
    workbox: any;
  }
}

export class ServiceWorkerManager {
  private static instance: ServiceWorkerManager;
  private registration: ServiceWorkerRegistration | null = null;
  private isOnline = true;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine;
      this.setupOnlineOfflineListeners();
    }
  }

  public static getInstance(): ServiceWorkerManager {
    if (!ServiceWorkerManager.instance) {
      ServiceWorkerManager.instance = new ServiceWorkerManager();
    }
    return ServiceWorkerManager.instance;
  }

  public async register(): Promise<ServiceWorkerRegistration | null> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return null;
    }

    try {
      
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });


      // Listen for updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration?.installing;
        if (newWorker) {
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showUpdateAvailableNotification();
            }
          });
        }
      });

      // Listen for controlling worker changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Service Worker controller changed, reloading
        window.location.reload();
      });

      return this.registration;
    } catch (error) {
      return null;
    }
  }

  public async unregister(): Promise<boolean> {
    if (this.registration) {
      const result = await this.registration.unregister();
      return result;
    }
    return false;
  }

  public async update(): Promise<void> {
    if (this.registration) {
      await this.registration.update();
    }
  }

  public async skipWaiting(): Promise<void> {
    if (this.registration && this.registration.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  private setupOnlineOfflineListeners(): void {
    window.addEventListener('online', () => {
      // Browser is online
      this.isOnline = true;
      this.showOnlineNotification();
    });

    window.addEventListener('offline', () => {
      // Browser is offline
      this.isOnline = false;
      this.showOfflineNotification();
    });
  }

  private showUpdateAvailableNotification(): void {
    // Show a custom notification or toast
    const updateBanner = document.createElement('div');
    updateBanner.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem;
        text-align: center;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      ">
        <div style="max-width: 600px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <strong>🎉 New update available!</strong>
            <br>
            <small>Click "Update" to get the latest features and improvements.</small>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button onclick="window.swManager.skipWaiting(); this.parentElement.parentElement.parentElement.remove();" style="
              background: rgba(255,255,255,0.2);
              border: 1px solid rgba(255,255,255,0.3);
              color: white;
              padding: 0.5rem 1rem;
              border-radius: 4px;
              cursor: pointer;
              font-size: 0.875rem;
            ">Update</button>
            <button onclick="this.parentElement.parentElement.parentElement.remove();" style="
              background: transparent;
              border: 1px solid rgba(255,255,255,0.3);
              color: white;
              padding: 0.5rem 1rem;
              border-radius: 4px;
              cursor: pointer;
              font-size: 0.875rem;
            ">Later</button>
          </div>
        </div>
      </div>
    `;
    
    // Remove any existing update banners
    const existingBanner = document.querySelector('[data-sw-update-banner]');
    if (existingBanner) {
      existingBanner.remove();
    }
    
    updateBanner.setAttribute('data-sw-update-banner', 'true');
    document.body.appendChild(updateBanner);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (updateBanner.parentNode) {
        updateBanner.remove();
      }
    }, 10000);
  }

  private showOnlineNotification(): void {
    this.showConnectionNotification('🌐 Back online!', 'You\'re connected to the internet again.', '#10b981');
  }

  private showOfflineNotification(): void {
    this.showConnectionNotification('📶 You\'re offline', 'Some features may be limited until you\'re back online.', '#ef4444');
  }

  private showConnectionNotification(title: string, message: string, color: string): void {
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div id="connection-notification" style="
        position: fixed;
        top: 1rem;
        right: 1rem;
        background: white;
        border-left: 4px solid ${color};
        padding: 1rem;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        max-width: 300px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        transform: translateX(100%);
        transition: transform 0.3s ease;
      ">
        <div style="font-weight: 600; margin-bottom: 0.25rem; color: ${color};">${title}</div>
        <div style="font-size: 0.875rem; color: #6b7280;">${message}</div>
      </div>
    `;
    
    // Remove any existing connection notifications
    const existingNotification = document.getElementById('connection-notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      const notificationEl = document.getElementById('connection-notification');
      if (notificationEl) {
        notificationEl.style.transform = 'translateX(0)';
      }
    }, 100);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      const notificationEl = document.getElementById('connection-notification');
      if (notificationEl) {
        notificationEl.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (notificationEl.parentNode) {
            notificationEl.remove();
          }
        }, 300);
      }
    }, 5000);
  }

  public getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }

  public isServiceWorkerSupported(): boolean {
    return typeof window !== 'undefined' && 'serviceWorker' in navigator;
  }

  public getOnlineStatus(): boolean {
    return this.isOnline;
  }
}

// Global instance
let swManager: ServiceWorkerManager;

if (typeof window !== 'undefined') {
  swManager = ServiceWorkerManager.getInstance();
  // Make it globally accessible for update banner
  (window as any).swManager = swManager;
}

export { swManager };
