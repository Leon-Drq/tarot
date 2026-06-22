import MysticBackground from "@/components/mystic-background"
import { organizationJsonLd, softwareApplicationJsonLd, websiteJsonLd } from "@/lib/site"

const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      ...organizationJsonLd(),
    },
    {
      ...websiteJsonLd(),
    },
    {
      ...softwareApplicationJsonLd(),
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
