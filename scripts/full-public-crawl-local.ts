import { spawn } from 'node:child_process'
import { rm } from 'node:fs/promises'
import path from 'node:path'

const rootDir = process.cwd()
const nextBuildDir = path.join(rootDir, '.next')
let port = Number(process.env.FULL_CRAWL_LOCAL_PORT ?? '0')
let baseUrl = ''

function assignServerAddress() {
  if (port > 0) {
    baseUrl = `http://127.0.0.1:${port}`
    return
  }

  port = 3321 + Math.floor(Math.random() * 200)
  baseUrl = `http://127.0.0.1:${port}`
}

async function waitForServer(url: string) {
  for (let attempt = 0; attempt < 180; attempt += 1) {
    try {
      const response = await fetch(url, { cache: 'no-store' })
      if (response.status > 0) {
        return
      }
    } catch {}

    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  throw new Error(`Local server did not become ready in time at ${url}.`)
}

async function waitForExit(child: ReturnType<typeof spawn>) {
  return await new Promise<number>((resolve, reject) => {
    child.once('error', reject)
    child.once('exit', (code) => resolve(code ?? 0))
  })
}

async function runCommand(command: string, extraEnv?: NodeJS.ProcessEnv) {
  const child = spawn('cmd.exe', ['/c', command], {
    cwd: rootDir,
    env: {
      ...process.env,
      ...extraEnv,
    },
    stdio: 'inherit',
    windowsHide: true,
  })

  const exitCode = await waitForExit(child)
  if (exitCode !== 0) {
    throw new Error(`${command} exited with code ${exitCode}.`)
  }
}

async function stopServer(server: ReturnType<typeof spawn> | null) {
  if (!server) {
    return
  }

  const pid = server.pid

  await new Promise<void>((resolve) => {
    let settled = false

    const finish = () => {
      if (!settled) {
        settled = true
        resolve()
      }
    }

    server.once('exit', finish)
    server.kill()
    setTimeout(finish, 5000)
  })

  if (!pid) {
    return
  }

  const killer = spawn('taskkill.exe', ['/PID', String(pid), '/T', '/F'], {
    cwd: rootDir,
    stdio: 'ignore',
    windowsHide: true,
  })

  await new Promise<void>((resolve) => {
    killer.once('exit', () => resolve())
    killer.once('error', () => resolve())
  })
}

async function main() {
  let server: ReturnType<typeof spawn> | null = null

  try {
    assignServerAddress()
    await rm(nextBuildDir, { recursive: true, force: true })

    await runCommand('npm run build', {
      NEXT_PUBLIC_APP_URL: baseUrl,
    })

    server = spawn('cmd.exe', ['/c', 'npm', 'run', 'start', '--', '--hostname', '127.0.0.1', '--port', String(port)], {
      cwd: rootDir,
      env: {
        ...process.env,
        NEXT_PUBLIC_APP_URL: baseUrl,
      },
      stdio: 'ignore',
      windowsHide: true,
    })

    await waitForServer(baseUrl)

    const crawl = spawn(process.execPath, ['--import', 'tsx', 'scripts/full-public-crawl.ts'], {
      cwd: rootDir,
      env: {
        ...process.env,
        FULL_CRAWL_BASE_URL: baseUrl,
        NEXT_PUBLIC_APP_URL: baseUrl,
      },
      stdio: 'inherit',
      windowsHide: true,
    })

    const exitCode = await waitForExit(crawl)
    if (exitCode !== 0) {
      throw new Error(`full-public-crawl exited with code ${exitCode}.`)
    }
  } finally {
    await stopServer(server)
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : String(error))
  process.exitCode = 1
})
