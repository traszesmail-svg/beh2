import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const inputDir = path.join(root, 'pedeefy', 'nowe')
const outputDir = path.join(root, 'tmp-pdf-cover-previews')

const crop = {
  left: 304,
  top: 57,
  width: 596,
  height: 843,
}

await fs.mkdir(outputDir, { recursive: true })

const files = (await fs.readdir(inputDir)).filter((file) => file.toLowerCase().endsWith('.pdf')).sort()
const browser = await puppeteer.launch({
  headless: true,
  args: ['--allow-file-access-from-files', '--disable-pdf-extension=false'],
})

try {
  for (const file of files) {
    const inputPath = path.join(inputDir, file)
    const base = path.basename(file, '.pdf').replace(/[^a-z0-9-]+/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase()
    const rawPath = path.join(outputDir, `${base}-raw.png`)
    const coverPath = path.join(outputDir, `${base}.png`)

    const page = await browser.newPage()
    await page.setViewport({ width: 900, height: 1200, deviceScaleFactor: 1 })
    await page.goto(`file:///${inputPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle2', timeout: 30000 })
    await new Promise((resolve) => setTimeout(resolve, 1800))
    await page.screenshot({ path: rawPath, fullPage: false })
    await page.close()

    await sharp(rawPath)
      .extract(crop)
      .resize({ width: 900 })
      .png({ compressionLevel: 9, quality: 92 })
      .toFile(coverPath)

    console.log(`${file} -> ${path.relative(root, coverPath)}`)
  }
} finally {
  await browser.close()
}
