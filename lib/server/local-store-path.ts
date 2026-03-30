import path from 'path'

export function getLocalStoreDataDir(rootDir = process.cwd()) {
  const configured = process.env.APP_LOCAL_DATA_DIR?.trim()

  if (!configured) {
    return path.join(rootDir, 'data')
  }

  return path.isAbsolute(configured) ? configured : path.join(rootDir, configured)
}
