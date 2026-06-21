import MysticBackground from "@/components/mystic-background"

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poptarot.com"

const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${appUrl}/#organization`,
      name: "POPTarot",
      url: appUrl,
      logo: `${appUrl}/icon-512x512.png`,
    },
    {
      "@type": "WebSite",
      "@id": `${appUrl}/#website`,
      name: "POPTarot",
      alternateName: ["POPTarot AI Tarot", "Pop Tarot AI"],
      url: appUrl,
      description:
        "Free AI tarot readings for love, career, daily guidance, and personal decisions.",
      publisher: {
        "@id": `${appUrl}/#organization`,
      },
      inLanguage: ["en", "zh-CN", "ja-JP", "ko-KR"],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${appUrl}/#app`,
      name: "POPTarot",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      url: appUrl,
      image: `${appUrl}/og-image.jpg`,
      description:
        "Draw tarot cards online and receive personalized AI interpretations for daily guidance, love, career, and life decisions.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        category: "Free trial",
      },
      publisher: {
        "@id": `${appUrl}/#organization`,
      },
    },
  ],
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeStructuredData).replace(/</g, "\\u003c"),
        }}
      />
      <MysticBackground />
    </>
  )
}
