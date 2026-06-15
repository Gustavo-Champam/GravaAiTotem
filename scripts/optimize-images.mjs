// One-off: downscale + recompress product photos in place (same paths).
// Run with: node scripts/optimize-images.mjs
import sharp from "sharp"
import { readdir, stat, rename, unlink } from "node:fs/promises"
import { join, extname } from "node:path"

const ROOT = new URL("../public/products/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")
const MAX = 1400 // longest side in px

async function* walk(dir) {
  for (const name of await readdir(dir)) {
    const full = join(dir, name)
    const s = await stat(full)
    if (s.isDirectory()) yield* walk(full)
    else yield full
  }
}

let before = 0
let after = 0
for await (const file of walk(ROOT)) {
  const ext = extname(file).toLowerCase()
  if (![".jpg", ".jpeg", ".png"].includes(ext)) continue
  const orig = (await stat(file)).size
  before += orig
  const tmp = file + ".tmp"
  const img = sharp(file).resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
  if (ext === ".png") {
    await img.png({ quality: 82, compressionLevel: 9, palette: true }).toFile(tmp)
  } else {
    await img.jpeg({ quality: 82, mozjpeg: true }).toFile(tmp)
  }
  await unlink(file)
  await rename(tmp, file)
  const now = (await stat(file)).size
  after += now
  console.log(`${file.split("products/")[1]}  ${(orig / 1024).toFixed(0)}KB -> ${(now / 1024).toFixed(0)}KB`)
}
console.log(`\nTOTAL: ${(before / 1024 / 1024).toFixed(1)}MB -> ${(after / 1024 / 1024).toFixed(1)}MB`)
