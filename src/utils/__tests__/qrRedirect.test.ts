import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { QRRedirectManager, initializeQRRedirect, destroyQRRedirect } from '../qrRedirect';

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true,
});

describe('QRRedirectManager', () => {
  let manager: QRRedirectManager;

  beforeEach(() => {
    mockWindowOpen.mockClear();
    manager = new QRRedirectManager();
  });

  afterEach(() => {
    if (manager) {
      manager.destroy();
    }
  });

  it('creates instance with default options', () => {
    expect(manager).toBeInstanceOf(QRRedirectManager);
  });

  it('creates instance with custom options', () => {
    const customManager = new QRRedirectManager({
      enableRedirect: false,
      redirectUrl: '/custom-qr.html'
    });
    
    expect(customManager).toBeInstanceOf(QRRedirectManager);
    customManager.destroy();
  });

  it('initializes and destroys correctly', () => {
    expect(() => {
      manager.initialize();
      manager.destroy();
    }).not.toThrow();
  });
});

describe('Global QR redirect functions', () => {
  afterEach(() => {
    destroyQRRedirect();
  });

  it('initializes global redirect manager', () => {
    expect(() => {
      initializeQRRedirect();
    }).not.toThrow();
  });

  it('destroys global redirect manager', () => {
    initializeQRRedirect();
    expect(() => {
      destroyQRRedirect();
    }).not.toThrow();
  });
});