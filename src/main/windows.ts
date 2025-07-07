import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { app, BrowserWindow, screen } from 'electron'

import { database } from './database.js'
import {
  changedPickerWindowBounds,
  gotDefaultBrowserStatus,
} from './state/actions.js'
import { dispatch } from './state/store.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

declare const PREFS_WINDOW_VITE_DEV_SERVER_URL: string
declare const PICKER_WINDOW_VITE_DEV_SERVER_URL: string
declare const PREFS_WINDOW_VITE_NAME: string
declare const PICKER_WINDOW_VITE_NAME: string

// Prevents garbage collection
let pickerWindow: BrowserWindow | null | undefined
let prefsWindow: BrowserWindow | null | undefined

async function createWindows(): Promise<void> {
  prefsWindow = new BrowserWindow({
    // Only show on demand
    show: false,

    // Chrome
    center: true,
    fullscreen: false,
    fullscreenable: false,
    height: 500,
    maximizable: false,
    minimizable: false,
    resizable: false,
    titleBarStyle: 'hidden',
    transparent: true,
    vibrancy: 'window',
    width: 600,

    // Meta
    icon: path.join(__dirname, '/icon/icon.png'),
    title: 'Preferences',

    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      nodeIntegrationInSubFrames: false,
      nodeIntegrationInWorker: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  prefsWindow.on('hide', () => {
    prefsWindow?.hide()
  })

  prefsWindow.on('close', (event_) => {
    event_.preventDefault()
    prefsWindow?.hide()
  })

  prefsWindow.on('show', () => {
    // There isn't a listener for default protocol client, therefore the check
    // is made each time the window is brought into focus.
    dispatch(gotDefaultBrowserStatus(app.isDefaultProtocolClient('http')))
  })

  const height = database.get('height')

  pickerWindow = new BrowserWindow({
    alwaysOnTop: true,
    frame: true,
    fullscreen: false,
    fullscreenable: false,
    hasShadow: true,
    height,
    icon: path.join(__dirname, '/icon/icon.png'),
    maximizable: false,
    maxWidth: 250,
    minHeight: 112,
    minimizable: false,
    minWidth: 250,
    movable: false,
    resizable: true,
    show: false,
    title: 'Browserosaurus',
    titleBarStyle: 'hidden',
    transparent: true,
    vibrancy: 'popover',
    visualEffectState: 'active',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      nodeIntegrationInSubFrames: false,
      nodeIntegrationInWorker: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    width: 250,
  })

  pickerWindow.setWindowButtonVisibility(false)

  pickerWindow.setAlwaysOnTop(true, 'screen-saver')

  pickerWindow.on('hide', () => {
    pickerWindow?.hide()
  })

  pickerWindow.on('close', (event_) => {
    event_.preventDefault()
    pickerWindow?.hide()
  })

  pickerWindow.on('resize', () => {
    if (pickerWindow) {
      dispatch(changedPickerWindowBounds(pickerWindow.getBounds()))
    }
  })

  pickerWindow.on('blur', () => {
    pickerWindow?.hide()
  })

  if (PREFS_WINDOW_VITE_DEV_SERVER_URL && PICKER_WINDOW_VITE_DEV_SERVER_URL) {
    await Promise.all([
      prefsWindow.loadURL(PREFS_WINDOW_VITE_DEV_SERVER_URL),
      pickerWindow.loadURL(PICKER_WINDOW_VITE_DEV_SERVER_URL),
    ])
  } else {
    await Promise.all([
      prefsWindow.loadFile(
        path.join(
          __dirname,
          `../renderer/${PREFS_WINDOW_VITE_NAME}/index.html`,
        ),
      ),
      pickerWindow.loadFile(
        path.join(
          __dirname,
          `../renderer/${PICKER_WINDOW_VITE_NAME}/index.html`,
        ),
      ),
    ])
  }
}

function showPickerWindow(): void {
  if (pickerWindow) {
    const mousePoint = screen.getCursorScreenPoint();
    const bWindowBounds = pickerWindow.getBounds();
    const activeScreen = screen.getDisplayNearestPoint(mousePoint);

    let x = mousePoint.x - bWindowBounds.width / 2;
    let y = mousePoint.y - bWindowBounds.height / 2;

    // Ensure the window stays within the active screen bounds
    if (x < activeScreen.bounds.x) {
      x = activeScreen.bounds.x;
    } else if (x + bWindowBounds.width > activeScreen.bounds.x + activeScreen.bounds.width) {
      x = activeScreen.bounds.x + activeScreen.bounds.width - bWindowBounds.width;
    }

    if (y < activeScreen.bounds.y) {
      y = activeScreen.bounds.y;
    } else if (y + bWindowBounds.height > activeScreen.bounds.y + activeScreen.bounds.height) {
      y = activeScreen.bounds.y + activeScreen.bounds.height - bWindowBounds.height;
    }

    pickerWindow.setPosition(x, y, false);
    pickerWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    pickerWindow.focus();
    pickerWindow.show();
  }
}

function showPrefsWindow(): void {
  prefsWindow?.show()
}

export {
  createWindows,
  pickerWindow,
  prefsWindow,
  showPickerWindow,
  showPrefsWindow,
}
