# OpenTAKServer-UI - Enhanced Fork

![GitHub Release Date](https://img.shields.io/github/release-date/allipry/OpenTAKServer-UI)
![GitHub Tag](https://img.shields.io/github/v/tag/allipry/OpenTAKServer-UI)

This is an enhanced fork of the OpenTAKServer Web UI with integrated custom QR code functionality and container optimizations. This repository serves as the source of truth for the UI container builds.

**Original Project**: [brian7704/OpenTAKServer-UI](https://github.com/brian7704/OpenTAKServer-UI)  
**Join the community**: [Discord server](https://discord.gg/6uaVHjtfXN)

## Fork Enhancements

This fork includes the following enhancements over the original:

- **Custom QR Code Generation**: Integrated QR code modal with configurable credentials
- **Enhanced QR Redirect**: Custom JavaScript for improved QR code handling
- **Container-Ready**: Optimized nginx configuration for containerized deployment
- **Build Optimizations**: Enhanced build process for custom components

## Features

This UI application includes:

- [PostCSS](https://postcss.org/) with [mantine-postcss-preset](https://mantine.dev/styles/postcss-preset)
- [TypeScript](https://www.typescriptlang.org/)
- [Storybook](https://storybook.js.org/)
- [Vitest](https://vitest.dev/) setup with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- ESLint setup with [eslint-config-mantine](https://github.com/mantinedev/eslint-config-mantine)
- **Custom QR Code Modal**: Enhanced iTAK QR code generation with configurable credentials
- **QR Redirect Functionality**: Custom redirect handling for mobile devices

## Container Usage

This repository is designed to be used as a source for Docker container builds. The recommended way to use this fork is through the consolidated deployment project.

### Docker Build

```bash
# Build the container directly from this repository
docker build -t opentakserver-ui:latest .

# Or use in docker-compose.yml
services:
  opentakserver-ui:
    build:
      context: https://github.com/allipry/OpenTAKServer-UI.git#v1.0.0-qr-functionality
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./config/nginx:/etc/nginx/conf.d
```

### QR Code Functionality

The enhanced UI includes custom QR code generation features:

- **iTAK QR Modal**: Enhanced modal with configurable server credentials
- **Custom QR Generator**: Standalone QR generator page at `/qr-generator.html`
- **Mobile Redirect**: Automatic redirect handling for mobile devices
- **Configurable Credentials**: Support for custom server URLs and authentication

### Environment Configuration

The UI can be configured through nginx environment variables and configuration files:

- Custom nginx configuration for proxy settings
- SSL certificate support
- CORS configuration for API integration
- Static file serving optimization

## Development

### npm scripts

#### Build and dev scripts

- `dev` – start development server
- `build` – build production version of the app
- `preview` – locally preview production build

#### Testing scripts

- `typecheck` – checks TypeScript types
- `lint` – runs ESLint
- `prettier:check` – checks files with Prettier
- `vitest` – runs vitest tests
- `vitest:watch` – starts vitest watch
- `test` – runs `vitest`, `prettier:check`, `lint` and `typecheck` scripts

#### Other scripts

- `storybook` – starts storybook dev server
- `storybook:build` – build production storybook bundle to `storybook-static`
- `prettier:write` – formats all files with Prettier

### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/allipry/OpenTAKServer-UI.git
cd OpenTAKServer-UI

# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build
```

### Container Development

```bash
# Build development container
docker build -t opentakserver-ui:dev .

# Run with development settings
docker run -it --rm \
  -p 80:80 \
  opentakserver-ui:dev
```

## Custom Components

### QR Code Modal (`src/components/ItakQRModal.tsx`)

Enhanced QR code modal component with:
- Configurable server credentials
- Custom styling and branding
- Mobile-optimized display
- Error handling and validation

### QR Redirect Utility (`src/utils/qrRedirect.ts`)

Custom redirect functionality for:
- Mobile device detection
- App store redirects
- Custom URL scheme handling
- Fallback behavior

## Contributing

This fork maintains compatibility with the upstream OpenTAKServer-UI project. When contributing:

1. Ensure changes don't break container deployment
2. Test custom QR functionality thoroughly
3. Update tests for any new components
4. Follow the existing TypeScript and React patterns
5. Test with the consolidated deployment project

## Changelog

### v1.0.0-qr-functionality
- Integrated custom QR code generation modal
- Added QR redirect functionality for mobile devices
- Enhanced container build process
- Added custom QR generator page
- Improved nginx configuration for container deployment
- Added comprehensive test coverage for QR functionality

## License

This project maintains the same license as the original OpenTAKServer-UI project.
