import { tmpdir } from 'os'
import path from 'path'

const VERCEL_LOCAL_DATA_DIR = 'behawior15-local-store'

export function getLocalStoreDataDir(rootDir = process.cwd()) {
  const configured = process.env.APP_LOCAL_DATA_DIR?.trim()

  if (configured) {
    return path.isAbsolute(configured) ? configured : path.join(rootDir, configured)
  }

  // Vercel Functions can only write to temporary storage at runtime.
  if (process.env.VERCEL === '1' || process.env.VERCEL_ENV) {
    return path.join(tmpdir(), VERCEL_LOCAL_DATA_DIR)
  }

  return path.join(rootDir, 'data')
}
