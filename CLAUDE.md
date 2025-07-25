# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Essential Commands

### Development Workflow

- `npm run doctor` - Runs complete code health check (lint + typecheck + test)
- `npm run lint` - ESLint code quality checks
- `npm run typecheck` - TypeScript type checking without compilation
- `npm test` - Run Jest test suite

### Building and Packaging

- `npm start` - Start development server with hot reload
- `npm run package` - Package for production (both Intel and ARM)
- `npm run make` - Create distributable packages for both architectures
- `npm run make:intel` - Build for Intel x64 only
- `npm run make:arm` - Build for Apple Silicon ARM64 only

### Utilities

- `npm run list-apps` - List all installed applications (useful for debugging
  browser detection)

## Architecture Overview

### Core Structure

Browserosaurus is an Electron-based macOS application that acts as a browser
chooser. It uses a Redux-based state management system across both main and
renderer processes.

### Key Directories

- `src/main/` - Electron main process (app lifecycle, system tray, window
  management)
- `src/renderers/picker/` - Browser selection UI (React components)
- `src/renderers/prefs/` - Preferences/settings UI (React components)
- `src/shared/` - Code shared between main and renderer processes
- `src/config/` - App configuration including browser definitions

### State Management

The application uses Redux Toolkit with a distributed architecture:

- Main process has its own Redux store
- Each renderer process has its own Redux store
- IPC communication bridges actions between processes via channels
- Middleware handles cross-process action routing

### Browser Detection

The app detects installed browsers by:

1. Checking predefined app bundle IDs in `src/config/apps.ts`
2. Using `file-icon` package for extracting app icons
3. Storing results in a LowDB database for performance

### Build System

- Uses Electron Forge for packaging and distribution
- Vite for bundling with separate configs for main/preload/renderer processes
- Supports both Intel and Apple Silicon architectures
- Code signing and notarisation configured for macOS distribution

### Key Dependencies

- Electron 33+ for desktop app framework
- React 18+ with Redux Toolkit for UI state management
- Vite for build tooling
- Jest for testing
- Tailwind CSS for styling
