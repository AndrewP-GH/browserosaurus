import { getUpdateUrl } from './get-update-url.js'

export async function isUpdateAvailable(): Promise<boolean> {
  let isNewVersionAvailable: boolean

  try {
    const response = await fetch(getUpdateUrl())
    const data = await response.text()
    isNewVersionAvailable = Boolean(data)
  } catch {
    isNewVersionAvailable = false
  }

  return isNewVersionAvailable
}
