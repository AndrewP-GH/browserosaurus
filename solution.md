# macOS Fullscreen App Popup Window Solution

## Problem Description

The Browserosaurus popup window was experiencing a critical issue on macOS where
it would flicker and disappear when triggered from fullscreen applications. The
window would:

1. Appear briefly on Desktop 1
2. Disappear instantly when another app was in fullscreen mode
3. Cause desktop switching without returning to the original space
4. Become "immortal" - unable to be closed with ESC or click-outside

## Root Cause Analysis

Through extensive research with multiple AI experts, we identified the
fundamental issue: **macOS WindowServer protection mechanisms for fullscreen
applications**.

### Technical Details

1. **Fullscreen Space Isolation**: macOS creates dedicated "Spaces" for
   fullscreen apps, isolated from normal desktop interactions
2. **Window Level Conflicts**: Using `'screen-saver'` level creates immortal
   windows that can't lose focus
3. **Focus Stealing Prevention**: macOS actively prevents background apps from
   disrupting fullscreen contexts
4. **Electron API Limitations**: Standard Electron APIs cannot bypass these
   macOS security boundaries

## Solution Architecture

### Native Module Approach

We implemented a native Node.js addon that directly manipulates macOS NSWindow
properties:

```objc
// Set proper collection behavior for fullscreen compatibility
[window setCollectionBehavior:NSWindowCollectionBehaviorCanJoinAllSpaces | NSWindowCollectionBehaviorFullScreenAuxiliary];

// Use floating level instead of screen-saver for interactive windows
[window setLevel:kCGFloatingWindowLevel];

// Ensure proper window properties
[window setCanHide:NO];
[window setHasShadow:YES];
```

### Key Technical Decisions

1. **`NSWindowCollectionBehaviorCanJoinAllSpaces`**: Allows window to appear on
   any Space, including fullscreen
2. **`NSWindowCollectionBehaviorFullScreenAuxiliary`**: Marks window as
   auxiliary panel for fullscreen apps
3. **`kCGFloatingWindowLevel`**: High enough to appear above apps, low enough to
   remain interactive
4. **Removed conflicting Electron settings**: Eliminated problematic
   `setVisibleOnAllWorkspaces` and `setAlwaysOnTop` calls

## Implementation Details

### Files Modified

1. **`native/macos-window-utils.mm`**: Native C++/Objective-C code for NSWindow
   manipulation (macOS only)
2. **`native/stub.cpp`**: Cross-platform stub implementation for non-macOS
   platforms
3. **`binding.gyp`**: Node.js native addon build configuration with platform
   conditions
4. **`src/main/windows.ts`**: Integration of native module into Electron main
   process with platform guards
5. **`package.json`**: Dependencies and build scripts

### Build Process

```bash
npm install node-addon-api @electron/rebuild
npx electron-rebuild
```

### Integration

```typescript
// Load native module with platform guard
let macosWindowUtils: any = null
if (process.platform === 'darwin') {
  try {
    macosWindowUtils = require('../../build/Release/macos_window_utils.node')
  } catch (error) {
    console.warn('Failed to load macOS window utils:', error)
  }
}

// Apply native properties after window creation (macOS only)
if (macosWindowUtils) {
  macosWindowUtils.setWindowProperties(pickerWindow.getNativeWindowHandle())
}

// Simple show without conflicting Electron APIs
pickerWindow.setPosition(finalX, finalY, false)
pickerWindow.show()
```

## Why This Solution Works

1. **Respects macOS Architecture**: Works with WindowServer instead of fighting
   it
2. **Proper Window Level**: Uses `kCGFloatingWindowLevel` for interactive panels
3. **Correct Collection Behavior**: Explicitly tells macOS this is a fullscreen
   auxiliary window
4. **Bypasses Electron Limitations**: Direct NSWindow manipulation via native
   code
5. **Cross-Platform Compatible**: Platform guards and stub implementation
   prevent crashes on Linux/Windows

## Alternative Solutions Considered

1. **Screen-saver Level**: Creates immortal windows that can't be dismissed
2. **App.focus() stealing**: Causes jarring desktop switching
3. **Global shortcuts**: Fails due to macOS security restrictions
4. **Fake fullscreen**: Would require significant app architecture changes

## References

- [macOS Window Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/WinPanel/Introduction.html)
- [CGWindowLevel Documentation](https://developer.apple.com/documentation/coregraphics/cgwindowlevel)
- [NSWindow Collection Behavior](https://developer.apple.com/documentation/appkit/nswindow/collectionbehavior)
- [Electron Native Node Modules](https://www.electronjs.org/docs/latest/tutorial/using-native-node-modules)
- [Node.js Native Addons](https://nodejs.org/api/addons.html)

## Testing

The solution should be tested with:

1. Various fullscreen applications (Safari, Chrome, VLC, etc.)
2. Different macOS versions
3. Multiple monitor setups
4. ESC key dismissal
5. Click-outside dismissal

## Maintenance Notes

- Native module requires rebuilding when Electron version changes
- macOS API changes may require updates to native code
- Keep `@electron/rebuild` updated for compatibility
