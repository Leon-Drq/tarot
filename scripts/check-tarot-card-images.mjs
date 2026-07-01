import { existsSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()
const source = readFileSync(join(root, "lib/tarot-cards.ts"), "utf8")

function fail(message) {
  throw new Error(message)
}

function assert(condition, message) {
  if (!condition) fail(message)
}

function parseCards() {
  return [
    ...source.matchAll(
      /\{\s*id:\s*(\d+),[\s\S]*?name:\s*"([^"]+)",[\s\S]*?nameEn:\s*"([^"]+)",[\s\S]*?image:\s*"([^"]+)"[\s\S]*?\n\s*\},/g,
    ),
  ].map((match) => ({
    id: Number(match[1]),
    name: match[2],
    nameEn: match[3],
    image: match[4],
  }))
}

function readPngDimensions(path) {
  const buffer = readFileSync(path)
  const isPng =
    buffer.length > 24 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47

  if (!isPng) return null
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  }
}

async function checkRemoteImage(card) {
  const response = await fetch(card.image, {
    method: "GET",
    headers: { Range: "bytes=0-31" },
  })
  const body = await response.arrayBuffer().catch(() => new ArrayBuffer(0))
  const contentType = response.headers.get("content-type") || ""

  assert(
    response.ok || response.status === 206,
    `${card.id} ${card.nameEn} image returned HTTP ${response.status}: ${card.image}`,
  )
  assert(
    contentType.startsWith("image/"),
    `${card.id} ${card.nameEn} image is not an image response: ${contentType || "unknown"} ${card.image}`,
  )
  assert(body.byteLength > 0, `${card.id} ${card.nameEn} image returned an empty body: ${card.image}`)
}

function checkLocalImage(card) {
  const path = join(root, "public", card.image)
  assert(existsSync(path), `${card.id} ${card.nameEn} local image is missing: ${card.image}`)
  assert(statSync(path).size > 1024, `${card.id} ${card.nameEn} local image is unexpectedly tiny: ${card.image}`)

  if (card.image.endsWith(".png")) {
    const dimensions = readPngDimensions(path)
    assert(dimensions, `${card.id} ${card.nameEn} local image is not a valid PNG: ${card.image}`)
    assert(
      dimensions.width >= 240 && dimensions.height >= 420,
      `${card.id} ${card.nameEn} local image dimensions are too small: ${dimensions.width}x${dimensions.height}`,
    )
  }
}

const cards = parseCards()
const ids = cards.map((card) => card.id)
const missingIds = Array.from({ length: 78 }, (_, id) => id).filter((id) => !ids.includes(id))
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index)
const placeholderCards = cards.filter((card) => /back|placeholder/i.test(card.image))

assert(cards.length === 78, `Expected 78 tarot cards, found ${cards.length}`)
assert(missingIds.length === 0, `Missing tarot card IDs: ${missingIds.join(", ")}`)
assert(duplicateIds.length === 0, `Duplicate tarot card IDs: ${duplicateIds.join(", ")}`)
assert(
  placeholderCards.length === 0,
  `Tarot cards still using placeholder/back images: ${placeholderCards
    .map((card) => `${card.id} ${card.nameEn} -> ${card.image}`)
    .join("; ")}`,
)

for (const card of cards) {
  if (/^https?:\/\//.test(card.image)) {
    await checkRemoteImage(card)
  } else {
    checkLocalImage(card)
  }
}

console.log("Tarot card image checks passed.")
