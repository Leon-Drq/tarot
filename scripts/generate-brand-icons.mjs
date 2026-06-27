import { copyFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
import sharp from "sharp"

const root = process.cwd()
const publicDir = join(root, "public")
const source = join(publicDir, "icon.svg")

async function png(size, fileName) {
  const buffer = await sharp(source)
    .resize(size, size, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toBuffer()

  await writeFile(join(publicDir, fileName), buffer)
  return buffer
}

function icoEntry(buffer, size, offset) {
  const entry = Buffer.alloc(16)
  entry.writeUInt8(size >= 256 ? 0 : size, 0)
  entry.writeUInt8(size >= 256 ? 0 : size, 1)
  entry.writeUInt8(0, 2)
  entry.writeUInt8(0, 3)
  entry.writeUInt16LE(1, 4)
  entry.writeUInt16LE(32, 6)
  entry.writeUInt32LE(buffer.length, 8)
  entry.writeUInt32LE(offset, 12)
  return entry
}

function makeIco(images) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)

  let offset = header.length + images.length * 16
  const entries = images.map((image) => {
    const entry = icoEntry(image.buffer, image.size, offset)
    offset += image.buffer.length
    return entry
  })

  return Buffer.concat([header, ...entries, ...images.map((image) => image.buffer)])
}

const favicon16 = await png(16, "favicon-16x16.png")
const favicon32 = await png(32, "favicon-32x32.png")
const favicon48 = await png(48, "favicon-48x48.png")
const favicon96 = await png(96, "favicon-96x96.png")
const icon192 = await png(192, "icon-192x192.png")
const icon512 = await png(512, "icon-512x512.png")
await writeFile(join(publicDir, "favicon.png"), favicon96)
await writeFile(join(publicDir, "search-favicon.png"), favicon48)
await writeFile(join(publicDir, "icon.png"), icon512)
await writeFile(join(publicDir, "logo.png"), icon512)
await copyFile(source, join(publicDir, "logo.svg"))
await png(180, "apple-touch-icon.png")
await png(180, "apple-icon.png")
await png(32, "icon-light-32x32.png")
await png(32, "icon-dark-32x32.png")

await writeFile(
  join(publicDir, "favicon.ico"),
  makeIco([
    { size: 16, buffer: favicon16 },
    { size: 32, buffer: favicon32 },
    { size: 48, buffer: favicon48 },
    { size: 96, buffer: favicon96 },
  ]),
)

console.log("Generated POPTarot favicon and app icon assets.")
