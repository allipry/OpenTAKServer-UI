# Changelog

All notable changes to this OpenTAKServer-UI fork will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.0.0-qr-functionality] - 2025-01-27

### Added
- **Custom QR Code Modal**: Enhanced iTAK QR code generation with configurable credentials
- **QR Redirect Functionality**: Custom JavaScript for improved mobile device handling
- **Custom QR Generator Page**: Standalone QR generator at `/qr-generator.html`
- **Mobile Device Detection**: Automatic detection and handling of mobile devices
- **Enhanced Container Support**: Optimized nginx configuration for containerized deployment
- **Comprehensive Test Coverage**: Added tests for QR functionality and utilities
- **TypeScript Utilities**: Type-safe QR redirect and generation utilities

### Changed
- **Build Process**: Enhanced to include custom QR components and functionality
- **Component Structure**: Improved organization of QR-related components
- **Container Configuration**: Optimized nginx setup for container deployment
- **Documentation**: Updated with comprehensive usage instructions and API documentation

### Technical Details

#### Files Added/Modified
- `src/components/ItakQRModal.tsx`: Enhanced QR code modal component
- `src/utils/qrRedirect.ts`: Custom redirect functionality for mobile devices
- `src/utils/__tests__/qrRedirect.test.ts`: Comprehensive test coverage for QR utilities
- `public/qr-generator.html`: Standalone QR generator page
- `nginx.conf`: Optimized nginx configuration for container deployment
- `package.json`: Updated dependencies for QR functionality
- `README.md`: Comprehensive documentation for fork enhancements

#### QR Code Enhancements
- **Configurable Credentials**: Support for custom server URLs and authentication
- **Mobile Optimization**: Enhanced display and interaction on mobile devices
- **Error Handling**: Robust error handling and user feedback
- **Custom Styling**: Improved visual design and branding
- **Accessibility**: Enhanced accessibility features for QR code generation

#### Container Optimizations
- **Multi-stage Build**: Optimized Docker build process
- **Nginx Configuration**: Enhanced proxy and static file serving
- **SSL Support**: Improved SSL certificate handling
- **CORS Configuration**: Better API integration support
- **Performance**: Optimized static asset delivery

#### Testing Improvements
- **Unit Tests**: Comprehensive test coverage for QR utilities
- **Component Tests**: Testing for QR modal functionality
- **Integration Tests**: End-to-end testing for QR generation workflow
- **Mobile Testing**: Specific tests for mobile device handling

### Migration Notes

This release consolidates local modifications that were previously maintained separately:

1. **From Local Containers**: All custom modifications from `containers/opentakserver-ui/` have been integrated
2. **Enhanced QR Functionality**: Custom QR code generation and redirect handling
3. **Container Ready**: Optimized for deployment through Docker and container orchestration
4. **Backward Compatible**: Maintains compatibility with existing UI configurations

### Deployment

This version is designed to be deployed through container builds:

```bash
# Build from repository
docker build -t opentakserver-ui:v1.0.0-qr-functionality \
  https://github.com/allipry/OpenTAKServer-UI.git#v1.0.0-qr-functionality

# Or use in docker-compose
services:
  opentakserver-ui:
    build:
      context: https://github.com/allipry/OpenTAKServer-UI.git#v1.0.0-qr-functionality
```

### QR Code Usage

The enhanced QR functionality can be used in several ways:

#### 1. Enhanced iTAK Modal
```typescript
// The ItakQRModal component now supports configurable credentials
<ItakQRModal 
  serverUrl="https://your-server.com"
  credentials={{ username: "user", password: "pass" }}
  onClose={() => setModalOpen(false)}
/>
```

#### 2. Standalone QR Generator
Access the standalone QR generator at `/qr-generator.html` for custom QR code generation.

#### 3. Mobile Redirect Utility
```typescript
import { handleQRRedirect } from './utils/qrRedirect';

// Automatically handle mobile device redirects
handleQRRedirect(qrCodeData, userAgent);
```

### Breaking Changes
- None. This release maintains full backward compatibility with existing UI deployments.

### Dependencies
- Node.js 18+
- Yarn package manager
- All dependencies listed in `package.json`
- Compatible with modern browsers
- Optimized for mobile devices

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile, Firefox Mobile)

---

## Repository Information

**Fork Source**: [brian7704/OpenTAKServer-UI](https://github.com/brian7704/OpenTAKServer-UI)  
**Fork Repository**: [allipry/OpenTAKServer-UI](https://github.com/allipry/OpenTAKServer-UI)  
**Release Tag**: v1.0.0-qr-functionality  
**Release Date**: 2025-01-27