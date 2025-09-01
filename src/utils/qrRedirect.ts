// QR Code Redirect Utility
// This utility provides functionality to redirect QR code requests to custom generators

export interface QRRedirectOptions {
  enableRedirect?: boolean;
  redirectUrl?: string;
}

export class QRRedirectManager {
  private originalFetch: typeof window.fetch;
  private originalXMLHttpRequest: typeof window.XMLHttpRequest;
  private isInitialized = false;
  private options: QRRedirectOptions;

  constructor(options: QRRedirectOptions = {}) {
    this.options = {
      enableRedirect: true,
      redirectUrl: '/qr-generator.html',
      ...options
    };
    
    this.originalFetch = window.fetch;
    this.originalXMLHttpRequest = window.XMLHttpRequest;
  }

  public initialize(): void {
    if (this.isInitialized || !this.options.enableRedirect) {
      return;
    }

    this.setupFetchInterception();
    this.setupXHRInterception();
    this.isInitialized = true;
    
    console.log('QR Code redirect manager initialized');
  }

  public destroy(): void {
    if (!this.isInitialized) {
      return;
    }

    window.fetch = this.originalFetch;
    window.XMLHttpRequest = this.originalXMLHttpRequest;
    this.isInitialized = false;
    
    console.log('QR Code redirect manager destroyed');
  }

  private setupFetchInterception(): void {
    const self = this;
    
    window.fetch = function(...args: Parameters<typeof fetch>) {
      const url = args[0];
      
      // Intercept iTAK and ATAK QR string requests
      if (typeof url === 'string' && self.shouldRedirect(url)) {
        console.log('Intercepting QR request, redirecting to custom generator');
        
        // Open custom QR generator in new tab
        if (self.options.redirectUrl) {
          window.open(self.options.redirectUrl, '_blank');
        }
        
        // Return a resolved promise to prevent errors
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            qr_string: 'redirected',
            message: 'Redirected to custom QR generator'
          }),
          text: () => Promise.resolve('{"qr_string": "redirected", "message": "Redirected to custom QR generator"}'),
          blob: () => Promise.resolve(new Blob()),
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
          formData: () => Promise.resolve(new FormData()),
          clone: function() { return this; },
          body: null,
          bodyUsed: false,
          headers: new Headers(),
          redirected: false,
          type: 'basic' as ResponseType,
          url: typeof url === 'string' ? url : ''
        } as Response);
      }
      
      // For all other requests, use the original fetch
      return self.originalFetch.apply(this, args);
    };
  }

  private setupXHRInterception(): void {
    const self = this;
    
    function CustomXMLHttpRequest() {
      const xhr = new self.originalXMLHttpRequest();
      const originalOpen = xhr.open;
      
      xhr.open = function(method: string, url: string | URL, ...args: any[]) {
        if (typeof url === 'string' && self.shouldRedirect(url)) {
          console.log('Intercepting QR XHR request, redirecting to custom generator');
          
          // Open custom QR generator in new tab
          if (self.options.redirectUrl) {
            window.open(self.options.redirectUrl, '_blank');
          }
          
          // Create a mock successful response
          setTimeout(() => {
            Object.defineProperty(xhr, 'status', { value: 200, writable: false });
            Object.defineProperty(xhr, 'responseText', { 
              value: JSON.stringify({
                qr_string: 'redirected',
                message: 'Redirected to custom QR generator'
              }), 
              writable: false 
            });
            Object.defineProperty(xhr, 'readyState', { value: 4, writable: false });
            if (xhr.onreadystatechange) xhr.onreadystatechange();
          }, 100);
          return;
        }
        return originalOpen.apply(this, [method, url, ...args]);
      };
      
      return xhr;
    }
    
    // Copy properties from original constructor
    Object.setPrototypeOf(CustomXMLHttpRequest.prototype, self.originalXMLHttpRequest.prototype);
    Object.setPrototypeOf(CustomXMLHttpRequest, self.originalXMLHttpRequest);
    
    window.XMLHttpRequest = CustomXMLHttpRequest as any;
  }

  private shouldRedirect(url: string): boolean {
    return url.includes('/api/itak_qr_string') || url.includes('/api/atak_qr_string');
  }
}

// Global instance for easy access
let globalRedirectManager: QRRedirectManager | null = null;

export function initializeQRRedirect(options?: QRRedirectOptions): void {
  if (globalRedirectManager) {
    globalRedirectManager.destroy();
  }
  
  globalRedirectManager = new QRRedirectManager(options);
  globalRedirectManager.initialize();
}

export function destroyQRRedirect(): void {
  if (globalRedirectManager) {
    globalRedirectManager.destroy();
    globalRedirectManager = null;
  }
}

// Auto-initialize when DOM is ready (optional)
export function autoInitializeQRRedirect(options?: QRRedirectOptions): void {
  function init() {
    initializeQRRedirect(options);
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}