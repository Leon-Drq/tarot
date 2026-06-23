import { readFileSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()

function read(path) {
  return readFileSync(join(root, path), "utf8")
}

function assertIncludes(file, needle, label) {
  if (!file.source.includes(needle)) {
    throw new Error(`${file.path} is missing ${label}: ${needle}`)
  }
}

function assertMatches(file, pattern, label) {
  if (!pattern.test(file.source)) {
    throw new Error(`${file.path} is missing ${label}: ${pattern}`)
  }
}

const files = {
  tarotCardSeo: { path: "lib/tarot-card-seo.ts", source: read("lib/tarot-card-seo.ts") },
  cardMeaningPage: {
    path: "components/seo/tarot-card-meaning-page.tsx",
    source: read("components/seo/tarot-card-meaning-page.tsx"),
  },
  seoPages: { path: "lib/seo-pages.ts", source: read("lib/seo-pages.ts") },
  site: { path: "lib/site.ts", source: read("lib/site.ts") },
  tarotQuestions: {
    path: "components/seo/tarot-questions-page.tsx",
    source: read("components/seo/tarot-questions-page.tsx"),
  },
  seoLanding: {
    path: "components/seo/seo-landing-page.tsx",
    source: read("components/seo/seo-landing-page.tsx"),
  },
}

const cardCoverage = [
  ["Upright meaning", "${englishName} Upright Meaning"],
  ["Reversed meaning", "${englishName} Reversed Meaning"],
  ["Love context", "${englishName} in Love"],
  ["Career context", "${englishName} in Career"],
  ["Money context", "${englishName} for Money"],
  ["Yes/no context", "${englishName} Yes or No"],
  ["Advice context", "Advice from ${englishName}"],
  ["Common combinations", "Common Card Combinations"],
  ["FAQ", "faqLabel: \"FAQ\""],
]

for (const [label, needle] of cardCoverage) {
  assertIncludes(files.tarotCardSeo, needle, `card SEO ${label}`)
}

for (const anchor of ["love", "career", "money", "yes-or-no", "advice"]) {
  assertIncludes(files.cardMeaningPage, `"${anchor}"`, `card page anchor ${anchor}`)
}

for (const section of ["#combinations", "#faq", "#question-paths", "#daily-practice"]) {
  assertIncludes(files.cardMeaningPage, section, `card page section ${section}`)
}

const longTailSlugs = [
  "will-my-ex-come-back-tarot",
  "does-he-love-me-tarot",
  "yes-or-no-tarot-love",
  "career-tarot-reading",
  "should-i-quit-my-job-tarot",
  "how-does-he-feel-about-me-tarot",
  "does-my-ex-miss-me-tarot",
  "will-he-come-back-tarot",
  "future-spouse-tarot-reading",
]

for (const slug of longTailSlugs) {
  assertIncludes(files.seoPages, `slug: "${slug}"`, `SEO page ${slug}`)
  assertIncludes(files.site, `href: "/${slug}"`, `high-intent site link ${slug}`)
  assertIncludes(files.tarotQuestions, `slug: "${slug}"`, `tarot question hub entry ${slug}`)
}

for (const slug of [
  "how-does-he-feel-about-me-tarot",
  "does-my-ex-miss-me-tarot",
  "will-he-come-back-tarot",
  "future-spouse-tarot-reading",
]) {
  assertMatches(
    files.seoLanding,
    new RegExp(`"${slug}"\\s*:\\s*\\[`),
    `related question cluster for ${slug}`,
  )
}

for (const localizedSlug of [
  "que-siente-por-mi-tarot",
  "mi-ex-me-extrana-tarot",
  "el-volvera-tarot",
  "lectura-tarot-futuro-esposo",
  "o-que-ele-sente-por-mim-tarot",
  "meu-ex-sente-minha-falta-tarot",
  "ele-vai-voltar-tarot",
  "leitura-tarot-futuro-conjuge",
]) {
  assertIncludes(files.seoPages, localizedSlug, `localized long-tail slug ${localizedSlug}`)
}

console.log("SEO coverage checks passed.")
