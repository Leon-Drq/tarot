import { ImageResponse } from "next/og"
import { appUrl, siteName } from "@/lib/site"
import { TAROT_CARDS } from "@/lib/tarot-cards"
import type { SeoPage } from "@/lib/seo-pages"

export const seoOgSize = {
  width: 1200,
  height: 630,
}

export const seoOgContentType = "image/png"

function absoluteAssetUrl(src: string) {
  if (src.startsWith("http://") || src.startsWith("https://")) return src
  return `${appUrl}${src.startsWith("/") ? src : `/${src}`}`
}

function compactText(value: string, maxLength: number) {
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength - 1).trim()}…`
}

function cardImageUrl(cardId: number) {
  return absoluteAssetUrl(`/images/${cardId}.png`)
}

export function renderSeoOgImage(page: SeoPage) {
  const cards = page.cards
    .map((id) => TAROT_CARDS.find((card) => card.id === id))
    .filter(Boolean)
    .slice(0, 3)

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#080310",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(circle at 72% 42%, rgba(191,182,255,0.42), transparent 30%), radial-gradient(circle at 18% 12%, rgba(130,88,202,0.32), transparent 34%), linear-gradient(135deg, #160b2e 0%, #080310 58%, #030108 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            top: 64,
            bottom: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 48,
          }}
        >
          <div style={{ width: 610, display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                color: "#d8d0ff",
                fontSize: 24,
                letterSpacing: 5,
                textTransform: "uppercase",
              }}
            >
              <img
                src={absoluteAssetUrl("/icon-192x192.png")}
                width={52}
                height={52}
                alt=""
                style={{ borderRadius: 14 }}
              />
              {siteName}
            </div>
            <div
              style={{
                marginTop: 44,
                display: "flex",
                fontSize: page.title.length > 34 ? 58 : 66,
                lineHeight: 1.04,
                fontFamily: "Georgia, serif",
                letterSpacing: 0,
                color: "#fffaff",
              }}
            >
              {compactText(page.title, 62)}
            </div>
            <div
              style={{
                marginTop: 28,
                display: "flex",
                fontSize: 25,
                lineHeight: 1.45,
                color: "rgba(255,255,255,0.72)",
              }}
            >
              {compactText(page.description, 128)}
            </div>
            <div
              style={{
                marginTop: 38,
                display: "flex",
                alignItems: "center",
                gap: 14,
                color: "#130d24",
                background: "linear-gradient(135deg,#f4f0ff 0%,#c9c0ff 52%,#9182ef 100%)",
                borderRadius: 18,
                padding: "18px 26px",
                alignSelf: "flex-start",
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              Free AI Tarot Reading
            </div>
          </div>

          <div style={{ width: 380, height: 450, position: "relative", display: "flex" }}>
            <div
              style={{
                position: "absolute",
                inset: 6,
                display: "flex",
                background: "radial-gradient(ellipse, rgba(191,182,255,0.42), transparent 68%)",
              }}
            />
            {cards.map((card, index) => (
              <div
                key={card?.id || index}
                style={{
                  position: "absolute",
                  display: "flex",
                  left: 42 + index * 92,
                  top: index === 1 ? 18 : 72,
                  width: 142,
                  height: 244,
                  borderRadius: 18,
                  overflow: "hidden",
                  border: "2px solid rgba(232,227,255,0.45)",
                  boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
                  transform: `rotate(${index === 0 ? -12 : index === 2 ? 12 : 0}deg)`,
                }}
              >
                {card && (
                  <img
                    src={cardImageUrl(card.id)}
                    width={142}
                    height={244}
                    alt=""
                    style={{ width: 142, height: 244, objectFit: "cover" }}
                  />
                )}
              </div>
            ))}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 28,
                display: "flex",
                justifyContent: "center",
                color: "rgba(255,255,255,0.7)",
                fontSize: 24,
                letterSpacing: 2,
              }}
            >
              poptarot.com
            </div>
          </div>
        </div>
      </div>
    ),
    seoOgSize,
  )
}
