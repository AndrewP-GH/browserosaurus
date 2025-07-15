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

## Handling "App is Damaged" Message

If macOS reports the app as "damaged" or prevents it from opening, this is
typically due to Gatekeeper, which blocks unsigned or unnotarized applications.
To bypass this:

**Method 1: Right-Click Open**

1.  Open your `/Applications` folder in Finder.
2.  Right-click (or Control-click) on `Browserosaurus-Custom.app`.
3.  Select "Open" from the contextual menu.
4.  You will see a dialog box stating that the app is from an unidentified
    developer. Click "Open" again.

**Method 2: Using Terminal (if Method 1 doesn't work)**

1.  Open Terminal (you can find it in `/Applications/Utilities/Terminal.app`).
2.  Paste the following command and press Enter:
    ```bash
    xattr -d com.apple.quarantine /Applications/Browserosaurus-Custom.app
    ```
    This command removes the quarantine attribute from the application, which
    often resolves the "damaged" message.
3.  After running the command, try opening the app normally from your
    Applications folder.

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
