# Electron App Build and Publish Instructions for ARM Mac (Smallest Size)

This document outlines the steps to build and publish the Electron application
for ARM Mac, ensuring the smallest possible application size.

## Build Process

1.  **Clean the `out` directory:**

    ```bash
    rm -rf out
    ```

    This ensures a fresh build and prevents any cached or old artifacts from
    interfering.

2.  **Build the application for ARM Mac:**
    ```bash
    npm run make:arm
    ```
    This command, defined in `package.json`, uses Electron Forge to build the
    application specifically for the `arm64` architecture. It also sets
    `NODE_ENV=production` to ensure development dependencies are not bundled.

## Publishing/Copying the Application

To copy the built application to the `/Applications` folder:

1.  **Remove any existing custom application (optional, but recommended for
    fresh installs):**

    ```bash
    rm -rf /Applications/Browserosaurus-Custom.app
    ```

2.  **Copy the built application:**
    ```bash
    cp -R /Users/andrejparamonov/RiderProjects/browserosaurus/out/Browserosaurus-darwin-arm64/Browserosaurus.app /Applications/Browserosaurus-Custom.app
    ```

## Verifying Application Size

After copying, you can verify the size of the installed application using:

```bash
du -sh /Applications/Browserosaurus-Custom.app
```

The expected size for an ARM64 build of this application is approximately 250MB.

## Key Considerations for Smallest Size

- **Target Specific Architecture:** Always build for a single architecture
  (`arm64` for Apple Silicon) unless a universal binary is explicitly required.
- **Production Environment:** Ensure `NODE_ENV=production` is set during the
  build to prune development dependencies.
- **Asset Optimization:** Compress images and other assets.
- **Code Minification/Uglification:** Ensure JavaScript, CSS, and HTML are
  minified.
- **Prune Unused Code:** Utilize code splitting and tree-shaking.
- **Copy Method:** Use `cp -R` for copying the application bundle.
