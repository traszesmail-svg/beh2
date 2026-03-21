export const BUILD_MARKER_KEY = 'CLEAN_START_REPO_V1'

function readBuildEnv(name: string): string | null {
  const value = process.env[name]?.trim()
  return value ? value : null
}

export function getBuildMarkerSnapshot() {
  const branch =
    readBuildEnv('VERCEL_GIT_COMMIT_REF') ??
    readBuildEnv('NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF') ??
    'local'

  const commitSource =
    readBuildEnv('VERCEL_GIT_COMMIT_SHA') ??
    readBuildEnv('NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA') ??
    'local'

  const commit = commitSource === 'local' ? commitSource : commitSource.slice(0, 7)
  const value = `${BUILD_MARKER_KEY}:${branch}:${commit}`

  return {
    key: BUILD_MARKER_KEY,
    branch,
    commit,
    value,
  }
}
