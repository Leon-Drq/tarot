import { localePath, type Locale, type SeoLocale } from "@/lib/locales"
import { getCardName, TAROT_CARDS, type TarotCard } from "@/lib/tarot-cards"

export type TarotCardSeoPage = {
  card: TarotCard
  slug: string
  locale: SeoLocale
  path: string
  title: string
  description: string
  eyebrow: string
  h1: string
  intro: string
  uprightLabel: string
  reversedLabel: string
  tryQuestion: string
  ctaLabel: string
  backLabel: string
  sections: Array<{
    heading: string
    body: string
  }>
  deepSections: Array<{
    heading: string
    body: string
  }>
  positionLabel: string
  positionIntro: string
  positionSections: Array<{
    position: string
    heading: string
    body: string
  }>
  exampleLabel: string
  exampleIntro: string
  exampleReadings: Array<{
    label: string
    question: string
    cards: string
    interpretation: string
    nextStep: string
    hrefSlug: string
  }>
  combinationsLabel: string
  combinations: Array<{
    heading: string
    body: string
    hrefSlug?: string
  }>
  faqLabel: string
  faqs: Array<{
    question: string
    answer: string
  }>
}

const suitThemes = {
  zh: {
    major: "人生主题、精神成长和关键转折",
    wands: "行动力、热情、创意和事业推进",
    cups: "情感、关系、直觉和内在满足",
    pentacles: "金钱、身体、工作和现实资源",
    swords: "思考、沟通、冲突和清晰判断",
  },
  en: {
    major: "life lessons, spiritual growth, and turning points",
    wands: "action, ambition, creativity, and momentum",
    cups: "emotion, relationships, intuition, and inner fulfillment",
    pentacles: "money, work, body, and material resources",
    swords: "thought, communication, conflict, and clear judgment",
  },
  ja: {
    major: "人生のテーマ、精神的成長、重要な転機",
    wands: "行動力、情熱、創造性、仕事の前進",
    cups: "感情、関係性、直感、内面の満足",
    pentacles: "お金、仕事、身体、現実的な資源",
    swords: "思考、コミュニケーション、葛藤、明晰な判断",
  },
  ko: {
    major: "삶의 주제, 영적 성장, 중요한 전환점",
    wands: "행동력, 열정, 창의성, 추진력",
    cups: "감정, 관계, 직관, 내면의 충족",
    pentacles: "돈, 일, 몸, 현실 자원",
    swords: "생각, 소통, 갈등, 명확한 판단",
  },
  es: {
    major: "lecciones de vida, crecimiento espiritual y puntos de giro",
    wands: "acción, ambición, creatividad e impulso",
    cups: "emociones, relaciones, intuición y plenitud interior",
    pentacles: "dinero, trabajo, cuerpo y recursos materiales",
    swords: "pensamiento, comunicación, conflicto y juicio claro",
  },
  "pt-br": {
    major: "lições de vida, crescimento espiritual e pontos de virada",
    wands: "ação, ambição, criatividade e movimento",
    cups: "emoções, relacionamentos, intuição e realização interior",
    pentacles: "dinheiro, trabalho, corpo e recursos materiais",
    swords: "pensamento, comunicação, conflito e julgamento claro",
  },
} satisfies Record<SeoLocale, Record<CardSuit, string>>

type CardSuit = "major" | "wands" | "cups" | "pentacles" | "swords"

export function getCardSlug(card: TarotCard) {
  return card.nameEn
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export function getCardBySlug(slug: string) {
  return TAROT_CARDS.find((card) => getCardSlug(card) === slug)
}

export function getCardSuit(card: TarotCard): CardSuit {
  if (card.id <= 21) return "major"
  if (card.id >= 22 && card.id <= 35) return "wands"
  if (card.id >= 36 && card.id <= 49) return "cups"
  if (card.id >= 50 && card.id <= 63) return "pentacles"
  return "swords"
}

function cleanKeywords(value: string) {
  return value.replace(/、/g, " / ")
}

type KeywordLocale = "en" | "es" | "pt-br"
type KeywordOrientation = "upright" | "reversed"
type RegionalCardLocale = Extract<SeoLocale, "es" | "pt-br">

const regionalCardNames: Record<RegionalCardLocale, string[]> = {
  es: [
    "El Loco",
    "El Mago",
    "La Sacerdotisa",
    "La Emperatriz",
    "El Emperador",
    "El Hierofante",
    "Los Enamorados",
    "El Carro",
    "La Fuerza",
    "El Ermitano",
    "La Rueda de la Fortuna",
    "La Justicia",
    "El Colgado",
    "La Muerte",
    "La Templanza",
    "El Diablo",
    "La Torre",
    "La Estrella",
    "La Luna",
    "El Sol",
    "El Juicio",
    "El Mundo",
    "As de Bastos",
    "Dos de Bastos",
    "Tres de Bastos",
    "Cuatro de Bastos",
    "Cinco de Bastos",
    "Seis de Bastos",
    "Siete de Bastos",
    "Ocho de Bastos",
    "Nueve de Bastos",
    "Diez de Bastos",
    "Sota de Bastos",
    "Caballero de Bastos",
    "Reina de Bastos",
    "Rey de Bastos",
    "As de Copas",
    "Dos de Copas",
    "Tres de Copas",
    "Cuatro de Copas",
    "Cinco de Copas",
    "Seis de Copas",
    "Siete de Copas",
    "Ocho de Copas",
    "Nueve de Copas",
    "Diez de Copas",
    "Sota de Copas",
    "Caballero de Copas",
    "Reina de Copas",
    "Rey de Copas",
    "As de Oros",
    "Dos de Oros",
    "Tres de Oros",
    "Cuatro de Oros",
    "Cinco de Oros",
    "Seis de Oros",
    "Siete de Oros",
    "Ocho de Oros",
    "Nueve de Oros",
    "Diez de Oros",
    "Sota de Oros",
    "Caballero de Oros",
    "Reina de Oros",
    "Rey de Oros",
    "As de Espadas",
    "Dos de Espadas",
    "Tres de Espadas",
    "Cuatro de Espadas",
    "Cinco de Espadas",
    "Seis de Espadas",
    "Siete de Espadas",
    "Ocho de Espadas",
    "Nueve de Espadas",
    "Diez de Espadas",
    "Sota de Espadas",
    "Caballero de Espadas",
    "Reina de Espadas",
    "Rey de Espadas",
  ],
  "pt-br": [
    "O Louco",
    "O Mago",
    "A Sacerdotisa",
    "A Imperatriz",
    "O Imperador",
    "O Hierofante",
    "Os Enamorados",
    "O Carro",
    "A Forca",
    "O Eremita",
    "A Roda da Fortuna",
    "A Justica",
    "O Enforcado",
    "A Morte",
    "A Temperanca",
    "O Diabo",
    "A Torre",
    "A Estrela",
    "A Lua",
    "O Sol",
    "O Julgamento",
    "O Mundo",
    "As de Paus",
    "Dois de Paus",
    "Tres de Paus",
    "Quatro de Paus",
    "Cinco de Paus",
    "Seis de Paus",
    "Sete de Paus",
    "Oito de Paus",
    "Nove de Paus",
    "Dez de Paus",
    "Pajem de Paus",
    "Cavaleiro de Paus",
    "Rainha de Paus",
    "Rei de Paus",
    "As de Copas",
    "Dois de Copas",
    "Tres de Copas",
    "Quatro de Copas",
    "Cinco de Copas",
    "Seis de Copas",
    "Sete de Copas",
    "Oito de Copas",
    "Nove de Copas",
    "Dez de Copas",
    "Pajem de Copas",
    "Cavaleiro de Copas",
    "Rainha de Copas",
    "Rei de Copas",
    "As de Ouros",
    "Dois de Ouros",
    "Tres de Ouros",
    "Quatro de Ouros",
    "Cinco de Ouros",
    "Seis de Ouros",
    "Sete de Ouros",
    "Oito de Ouros",
    "Nove de Ouros",
    "Dez de Ouros",
    "Pajem de Ouros",
    "Cavaleiro de Ouros",
    "Rainha de Ouros",
    "Rei de Ouros",
    "As de Espadas",
    "Dois de Espadas",
    "Tres de Espadas",
    "Quatro de Espadas",
    "Cinco de Espadas",
    "Seis de Espadas",
    "Sete de Espadas",
    "Oito de Espadas",
    "Nove de Espadas",
    "Dez de Espadas",
    "Pajem de Espadas",
    "Cavaleiro de Espadas",
    "Rainha de Espadas",
    "Rei de Espadas",
  ],
}

const majorKeywordSets: Partial<Record<number, Record<KeywordLocale, Record<KeywordOrientation, string>>>> = {
  0: {
    en: { upright: "new beginnings / freedom / trust / adventure", reversed: "recklessness / naivety / poor planning / hesitation" },
    es: { upright: "nuevos comienzos / libertad / confianza / aventura", reversed: "imprudencia / ingenuidad / mala planificacion / duda" },
    "pt-br": { upright: "novos comecos / liberdade / confianca / aventura", reversed: "imprudencia / ingenuidade / planejamento fraco / hesitacao" },
  },
  1: {
    en: { upright: "manifestation / willpower / skill / focus", reversed: "manipulation / scattered energy / untapped skill / poor direction" },
    es: { upright: "manifestacion / voluntad / habilidad / enfoque", reversed: "manipulacion / energia dispersa / habilidad bloqueada / falta de direccion" },
    "pt-br": { upright: "manifestacao / forca de vontade / habilidade / foco", reversed: "manipulacao / energia dispersa / habilidade bloqueada / falta de direcao" },
  },
  2: {
    en: { upright: "intuition / mystery / inner wisdom / subconscious", reversed: "hidden motives / surface answers / ignored intuition / secrecy" },
    es: { upright: "intuicion / misterio / sabiduria interior / subconsciente", reversed: "motivos ocultos / respuestas superficiales / intuicion ignorada / secreto" },
    "pt-br": { upright: "intuicao / misterio / sabedoria interior / subconsciente", reversed: "motivos ocultos / respostas superficiais / intuicao ignorada / segredo" },
  },
  3: {
    en: { upright: "abundance / nurture / creativity / beauty", reversed: "dependency / emptiness / blocked creativity / overprotection" },
    es: { upright: "abundancia / cuidado / creatividad / belleza", reversed: "dependencia / vacio / creatividad bloqueada / sobreproteccion" },
    "pt-br": { upright: "abundancia / cuidado / criatividade / beleza", reversed: "dependencia / vazio / criatividade bloqueada / superprotecao" },
  },
  4: {
    en: { upright: "authority / structure / stability / leadership", reversed: "rigidity / control issues / weak discipline / misuse of power" },
    es: { upright: "autoridad / estructura / estabilidad / liderazgo", reversed: "rigidez / control excesivo / poca disciplina / abuso de poder" },
    "pt-br": { upright: "autoridade / estrutura / estabilidade / lideranca", reversed: "rigidez / controle excessivo / pouca disciplina / abuso de poder" },
  },
  5: {
    en: { upright: "tradition / belief / teaching / guidance", reversed: "rebellion / personal belief / unconventional path / questioning rules" },
    es: { upright: "tradicion / creencia / ensenanza / guia", reversed: "rebeldia / creencia personal / camino no convencional / cuestionar reglas" },
    "pt-br": { upright: "tradicao / crenca / ensino / orientacao", reversed: "rebeldia / crenca pessoal / caminho nao convencional / questionar regras" },
  },
  6: {
    en: { upright: "love / harmony / choice / shared values", reversed: "imbalance / disharmony / difficult choice / value conflict" },
    es: { upright: "amor / armonia / eleccion / valores compartidos", reversed: "desequilibrio / desarmonia / eleccion dificil / conflicto de valores" },
    "pt-br": { upright: "amor / harmonia / escolha / valores compartilhados", reversed: "desequilibrio / desarmonia / escolha dificil / conflito de valores" },
  },
  7: {
    en: { upright: "willpower / victory / control / decisive action", reversed: "loss of control / aggression / lack of direction / frustration" },
    es: { upright: "voluntad / victoria / control / accion decidida", reversed: "perdida de control / agresividad / falta de direccion / frustracion" },
    "pt-br": { upright: "forca de vontade / vitoria / controle / acao decidida", reversed: "perda de controle / agressividade / falta de direcao / frustracao" },
  },
  8: {
    en: { upright: "courage / patience / inner strength / compassion", reversed: "self-doubt / weakness / insecurity / lost courage" },
    es: { upright: "valor / paciencia / fuerza interior / compasion", reversed: "duda personal / debilidad / inseguridad / falta de valor" },
    "pt-br": { upright: "coragem / paciencia / forca interior / compaixao", reversed: "duvida de si / fraqueza / inseguranca / falta de coragem" },
  },
  9: {
    en: { upright: "introspection / solitude / guidance / wisdom", reversed: "isolation / loneliness / withdrawal / lost direction" },
    es: { upright: "introspeccion / soledad elegida / guia / sabiduria", reversed: "aislamiento / soledad / retraimiento / direccion perdida" },
    "pt-br": { upright: "introspeccao / solitude / orientacao / sabedoria", reversed: "isolamento / solidao / retraimento / direcao perdida" },
  },
  10: {
    en: { upright: "fate / cycles / change / turning point", reversed: "bad luck / resistance to change / repeated pattern / delay" },
    es: { upright: "destino / ciclos / cambio / punto de giro", reversed: "mala suerte / resistencia al cambio / patron repetido / demora" },
    "pt-br": { upright: "destino / ciclos / mudanca / ponto de virada", reversed: "ma sorte / resistencia a mudanca / padrao repetido / atraso" },
  },
  11: {
    en: { upright: "justice / truth / cause and effect / balance", reversed: "unfairness / avoidance / dishonesty / imbalance" },
    es: { upright: "justicia / verdad / causa y efecto / equilibrio", reversed: "injusticia / evitacion / deshonestidad / desequilibrio" },
    "pt-br": { upright: "justica / verdade / causa e efeito / equilibrio", reversed: "injustica / evitacao / desonestidade / desequilibrio" },
  },
  12: {
    en: { upright: "surrender / pause / new perspective / letting go", reversed: "delay / resistance / stubbornness / pointless sacrifice" },
    es: { upright: "rendicion / pausa / nueva perspectiva / soltar", reversed: "demora / resistencia / terquedad / sacrificio inutil" },
    "pt-br": { upright: "entrega / pausa / nova perspectiva / deixar ir", reversed: "atraso / resistencia / teimosia / sacrificio inutil" },
  },
  13: {
    en: { upright: "ending / transformation / transition / renewal", reversed: "resistance to change / stagnation / inability to let go / delay" },
    es: { upright: "final / transformacion / transicion / renovacion", reversed: "resistencia al cambio / estancamiento / dificultad para soltar / demora" },
    "pt-br": { upright: "fim / transformacao / transicao / renovacao", reversed: "resistencia a mudanca / estagnacao / dificuldade de soltar / atraso" },
  },
  14: {
    en: { upright: "balance / moderation / patience / harmony", reversed: "imbalance / excess / impatience / conflict" },
    es: { upright: "equilibrio / moderacion / paciencia / armonia", reversed: "desequilibrio / exceso / impaciencia / conflicto" },
    "pt-br": { upright: "equilibrio / moderacao / paciencia / harmonia", reversed: "desequilibrio / excesso / impaciencia / conflito" },
  },
  15: {
    en: { upright: "attachment / temptation / materialism / shadow", reversed: "release / breaking bonds / reclaiming freedom / recovery" },
    es: { upright: "apego / tentacion / materialismo / sombra", reversed: "liberacion / romper ataduras / recuperar libertad / recuperacion" },
    "pt-br": { upright: "apego / tentacao / materialismo / sombra", reversed: "libertacao / romper amarras / recuperar liberdade / recuperacao" },
  },
  16: {
    en: { upright: "sudden change / collapse / revelation / awakening", reversed: "avoiding disaster / fear of change / delayed collapse / resistance" },
    es: { upright: "cambio repentino / derrumbe / revelacion / despertar", reversed: "evitar crisis / miedo al cambio / derrumbe demorado / resistencia" },
    "pt-br": { upright: "mudanca repentina / colapso / revelacao / despertar", reversed: "evitar crise / medo da mudanca / colapso adiado / resistencia" },
  },
  17: {
    en: { upright: "hope / inspiration / peace / healing", reversed: "despair / lost faith / disconnection / discouragement" },
    es: { upright: "esperanza / inspiracion / paz / sanacion", reversed: "desesperanza / fe perdida / desconexion / desaliento" },
    "pt-br": { upright: "esperanca / inspiracao / paz / cura", reversed: "desespero / fe perdida / desconexao / desanimo" },
  },
  18: {
    en: { upright: "illusion / intuition / subconscious / fear", reversed: "released fear / truth revealed / inner clarity / confusion fading" },
    es: { upright: "ilusion / intuicion / subconsciente / miedo", reversed: "miedo liberado / verdad revelada / claridad interior / confusion que cede" },
    "pt-br": { upright: "ilusao / intuicao / subconsciente / medo", reversed: "medo liberado / verdade revelada / clareza interior / confusao diminuindo" },
  },
  19: {
    en: { upright: "joy / success / vitality / optimism", reversed: "temporary setback / over-optimism / unclear success / dimmed confidence" },
    es: { upright: "alegria / exito / vitalidad / optimismo", reversed: "revés temporal / optimismo excesivo / exito poco claro / confianza apagada" },
    "pt-br": { upright: "alegria / sucesso / vitalidade / otimismo", reversed: "contratempo temporario / otimismo excessivo / sucesso pouco claro / confianca baixa" },
  },
  20: {
    en: { upright: "awakening / rebirth / calling / reflection", reversed: "self-doubt / ignored calling / self-criticism / delay" },
    es: { upright: "despertar / renacimiento / llamado / reflexion", reversed: "duda personal / llamado ignorado / autocritica / demora" },
    "pt-br": { upright: "despertar / renascimento / chamado / reflexao", reversed: "duvida de si / chamado ignorado / autocritica / atraso" },
  },
  21: {
    en: { upright: "completion / integration / achievement / wholeness", reversed: "unfinished business / lack of closure / delayed success / loose ends" },
    es: { upright: "culminacion / integracion / logro / plenitud", reversed: "asunto incompleto / falta de cierre / exito demorado / cabos sueltos" },
    "pt-br": { upright: "conclusao / integracao / conquista / plenitude", reversed: "assunto inacabado / falta de fechamento / sucesso adiado / pontas soltas" },
  },
}

const suitKeywordDomains = {
  major: {
    en: "life lesson / turning point / inner pattern",
    es: "leccion de vida / punto de giro / patron interior",
    "pt-br": "licao de vida / ponto de virada / padrao interior",
  },
  wands: {
    en: "creative energy / ambition / momentum",
    es: "energia creativa / ambicion / impulso",
    "pt-br": "energia criativa / ambicao / movimento",
  },
  cups: {
    en: "emotion / relationship / intuition",
    es: "emocion / relacion / intuicion",
    "pt-br": "emocao / relacionamento / intuicao",
  },
  pentacles: {
    en: "work / money / resources / stability",
    es: "trabajo / dinero / recursos / estabilidad",
    "pt-br": "trabalho / dinheiro / recursos / estabilidade",
  },
  swords: {
    en: "clarity / communication / decision / tension",
    es: "claridad / comunicacion / decision / tension",
    "pt-br": "clareza / comunicacao / decisao / tensao",
  },
} satisfies Record<CardSuit, Record<KeywordLocale, string>>

const minorRankKeywords = {
  ace: {
    en: { upright: "new opportunity / seed potential / first step", reversed: "missed chance / delay / blocked potential" },
    es: { upright: "nueva oportunidad / potencial inicial / primer paso", reversed: "oportunidad perdida / demora / potencial bloqueado" },
    "pt-br": { upright: "nova oportunidade / potencial inicial / primeiro passo", reversed: "chance perdida / atraso / potencial bloqueado" },
  },
  two: {
    en: { upright: "choice / balance / planning / partnership", reversed: "indecision / imbalance / unclear plan / tension" },
    es: { upright: "eleccion / equilibrio / planificacion / asociacion", reversed: "indecision / desequilibrio / plan poco claro / tension" },
    "pt-br": { upright: "escolha / equilibrio / planejamento / parceria", reversed: "indecisao / desequilibrio / plano pouco claro / tensao" },
  },
  three: {
    en: { upright: "growth / teamwork / progress / expansion", reversed: "delay / limited vision / weak collaboration" },
    es: { upright: "crecimiento / trabajo en equipo / progreso / expansion", reversed: "demora / vision limitada / colaboracion debil" },
    "pt-br": { upright: "crescimento / trabalho em equipe / progresso / expansao", reversed: "atraso / visao limitada / colaboracao fraca" },
  },
  four: {
    en: { upright: "stability / foundation / rest / structure", reversed: "instability / restlessness / delayed celebration" },
    es: { upright: "estabilidad / base / descanso / estructura", reversed: "inestabilidad / inquietud / celebracion demorada" },
    "pt-br": { upright: "estabilidade / base / descanso / estrutura", reversed: "instabilidade / inquietacao / celebracao adiada" },
  },
  five: {
    en: { upright: "conflict / challenge / change / pressure", reversed: "avoidance / inner tension / release after conflict" },
    es: { upright: "conflicto / desafio / cambio / presion", reversed: "evitacion / tension interna / alivio tras conflicto" },
    "pt-br": { upright: "conflito / desafio / mudanca / pressao", reversed: "evitacao / tensao interna / alivio apos conflito" },
  },
  six: {
    en: { upright: "progress / recognition / healing / transition", reversed: "lack of recognition / private doubt / slow recovery" },
    es: { upright: "progreso / reconocimiento / sanacion / transicion", reversed: "falta de reconocimiento / duda privada / recuperacion lenta" },
    "pt-br": { upright: "progresso / reconhecimento / cura / transicao", reversed: "falta de reconhecimento / duvida interna / recuperacao lenta" },
  },
  seven: {
    en: { upright: "defense / strategy / patience / assessment", reversed: "overwhelm / poor strategy / giving up" },
    es: { upright: "defensa / estrategia / paciencia / evaluacion", reversed: "sobrecarga / mala estrategia / rendirse" },
    "pt-br": { upright: "defesa / estrategia / paciencia / avaliacao", reversed: "sobrecarga / estrategia fraca / desistir" },
  },
  eight: {
    en: { upright: "momentum / action / movement / message", reversed: "delay / friction / scattered energy" },
    es: { upright: "impulso / accion / movimiento / mensaje", reversed: "demora / friccion / energia dispersa" },
    "pt-br": { upright: "movimento / acao / avanco / mensagem", reversed: "atraso / atrito / energia dispersa" },
  },
  nine: {
    en: { upright: "resilience / boundaries / final test / self-reliance", reversed: "fatigue / defensiveness / hard to continue" },
    es: { upright: "resiliencia / limites / prueba final / autonomia", reversed: "cansancio / defensividad / dificultad para seguir" },
    "pt-br": { upright: "resiliencia / limites / teste final / autonomia", reversed: "cansaco / defensividade / dificuldade de continuar" },
  },
  ten: {
    en: { upright: "completion / burden / legacy / outcome", reversed: "overload / release / letting go" },
    es: { upright: "culminacion / carga / legado / resultado", reversed: "sobrecarga / liberacion / soltar" },
    "pt-br": { upright: "conclusao / carga / legado / resultado", reversed: "sobrecarga / liberacao / deixar ir" },
  },
  page: {
    en: { upright: "curiosity / study / message / new skill", reversed: "immaturity / delay / unfocused learning" },
    es: { upright: "curiosidad / estudio / mensaje / nueva habilidad", reversed: "inmadurez / demora / aprendizaje disperso" },
    "pt-br": { upright: "curiosidade / estudo / mensagem / nova habilidade", reversed: "imaturidade / atraso / aprendizado disperso" },
  },
  knight: {
    en: { upright: "movement / pursuit / courage / mission", reversed: "impulsiveness / restlessness / inconsistent action" },
    es: { upright: "movimiento / busqueda / valor / mision", reversed: "impulsividad / inquietud / accion inconsistente" },
    "pt-br": { upright: "movimento / busca / coragem / missao", reversed: "impulsividade / inquietacao / acao inconsistente" },
  },
  queen: {
    en: { upright: "maturity / care / intuition / steady leadership", reversed: "dependency / scattered energy / emotional strain" },
    es: { upright: "madurez / cuidado / intuicion / liderazgo estable", reversed: "dependencia / energia dispersa / tension emocional" },
    "pt-br": { upright: "maturidade / cuidado / intuicao / lideranca estavel", reversed: "dependencia / energia dispersa / tensao emocional" },
  },
  king: {
    en: { upright: "mastery / authority / strategy / stability", reversed: "control issues / rigidity / imbalanced power" },
    es: { upright: "maestria / autoridad / estrategia / estabilidad", reversed: "control excesivo / rigidez / poder desequilibrado" },
    "pt-br": { upright: "maestria / autoridade / estrategia / estabilidade", reversed: "controle excessivo / rigidez / poder desequilibrado" },
  },
} satisfies Record<string, Record<KeywordLocale, Record<KeywordOrientation, string>>>

function toKeywordLocale(locale: SeoLocale): KeywordLocale {
  return locale === "es" || locale === "pt-br" ? locale : "en"
}

function getMinorRank(card: TarotCard) {
  const name = card.nameEn.toLowerCase()
  if (name.startsWith("ace")) return "ace"
  if (name.startsWith("two")) return "two"
  if (name.startsWith("three")) return "three"
  if (name.startsWith("four")) return "four"
  if (name.startsWith("five")) return "five"
  if (name.startsWith("six")) return "six"
  if (name.startsWith("seven")) return "seven"
  if (name.startsWith("eight")) return "eight"
  if (name.startsWith("nine")) return "nine"
  if (name.startsWith("ten")) return "ten"
  if (name.startsWith("page")) return "page"
  if (name.startsWith("knight")) return "knight"
  if (name.startsWith("queen")) return "queen"
  return "king"
}

function localizedKeywords(card: TarotCard, locale: SeoLocale, orientation: KeywordOrientation) {
  if (locale === "zh") return cleanKeywords(card.meaning[orientation])

  const keywordLocale = toKeywordLocale(locale)
  const major = majorKeywordSets[card.id]?.[keywordLocale]?.[orientation]
  if (major) return major

  const rank = minorRankKeywords[getMinorRank(card)][keywordLocale][orientation]
  const suit = suitKeywordDomains[getCardSuit(card)][keywordLocale]
  return `${rank} / ${suit}`
}

function cardTone(card: TarotCard) {
  if (card.id <= 21) return "major life pattern"
  if (card.id >= 22 && card.id <= 35) return "creative and motivational signal"
  if (card.id >= 36 && card.id <= 49) return "emotional and relational signal"
  if (card.id >= 50 && card.id <= 63) return "practical and material signal"
  return "mental and communicative signal"
}

const englishSuitGuidance = {
  major: {
    upright: "a larger life lesson is becoming visible, so the card should be read as a turning point rather than a small mood",
    reversed: "the lesson is still active, but avoidance, fear, or an unfinished inner process may be delaying integration",
    love: "look for the emotional lesson underneath the relationship, especially repeated choices, values, and growth edges",
    career: "connect the card to calling, responsibility, timing, and whether the current path still matches the person you are becoming",
    money: "treat money as part of a bigger life pattern: control, trust, risk, discipline, or a cycle that wants to change",
    yesNo: "a major card rarely gives a casual answer; it leans yes when you are ready to meet the lesson and no when you are avoiding it",
    advice: "slow down enough to name the lesson before taking action",
  },
  wands: {
    upright: "motivation, movement, and creative fire are available if you choose a direct next step",
    reversed: "energy may be scattered, rushed, blocked, or driven by frustration rather than clear desire",
    love: "watch the pace of attraction, pursuit, chemistry, and whether passion is supported by consistency",
    career: "focus on initiative, visibility, creative risk, leadership, and whether you are using your energy in the right direction",
    money: "notice where ambition is helping growth and where impulse spending, speculation, or impatience could burn resources",
    yesNo: "it often leans yes for action questions when the plan has focus, but reversed cards ask you to slow down first",
    advice: "choose one bold move, then give it enough structure to last",
  },
  cups: {
    upright: "feelings, intuition, and emotional truth are guiding the reading more than logic alone",
    reversed: "emotions may be blocked, idealized, avoided, or difficult to express honestly",
    love: "read the card through emotional availability, mutual care, trust, and the difference between fantasy and real connection",
    career: "ask whether the work supports your emotional well-being, creative voice, team culture, and sense of meaning",
    money: "look for emotional spending, generosity, fear of scarcity, or choices that confuse comfort with long-term security",
    yesNo: "it leans yes when feelings and actions are aligned; reversed, it asks for emotional clarity before a decision",
    advice: "listen to the feeling, then test it against what people actually do",
  },
  pentacles: {
    upright: "practical resources, money, time, health, or tangible progress are the center of the message",
    reversed: "the practical base may be unstable, delayed, over-controlled, or disconnected from real-world limits",
    love: "look at reliability, commitment, shared routines, physical presence, and whether affection is backed by effort",
    career: "focus on skills, compensation, workload, long-term stability, and the systems that make success repeatable",
    money: "this suit speaks directly to budgets, assets, debt, savings, value, and whether a plan can work materially",
    yesNo: "it often leans yes when the resources are real and the timeline is patient; reversed, it warns against weak foundations",
    advice: "make the next step concrete, measurable, and financially grounded",
  },
  swords: {
    upright: "truth, communication, analysis, and decision-making need to be handled clearly",
    reversed: "confusion, avoidance, harsh words, overthinking, or missing information may be distorting the answer",
    love: "pay attention to communication patterns, honesty, boundaries, conflict style, and what has not been said",
    career: "use the card for decisions, contracts, strategy, interviews, negotiation, and the need for cleaner information",
    money: "focus on planning, paperwork, risk analysis, legal details, and any story you are telling yourself about security",
    yesNo: "it leans yes when facts are clear and communication is honest; reversed, it asks for more information before acting",
    advice: "separate the facts from the fear, then say the cleanest true thing",
  },
} satisfies Record<CardSuit, Record<"upright" | "reversed" | "love" | "career" | "money" | "yesNo" | "advice", string>>

function createEnglishCoreSections(card: TarotCard, theme: string) {
  const englishName = card.nameEn
  const suit = getCardSuit(card)
  const guidance = englishSuitGuidance[suit]
  const upright = localizedKeywords(card, "en", "upright")
  const reversed = localizedKeywords(card, "en", "reversed")

  return [
    {
      heading: `${englishName} Upright Meaning`,
      body: `Upright, ${englishName} highlights ${upright}. In a real spread, this means ${guidance.upright}. Read it as active energy that can be used consciously, not as a fixed promise.`,
    },
    {
      heading: `${englishName} Reversed Meaning`,
      body: `Reversed, ${englishName} points toward ${reversed}. The card does not simply become negative; it usually shows where the same theme is blocked, delayed, overdone, or asking for inner correction.`,
    },
    {
      heading: `How to Read ${englishName} in a Spread`,
      body: `${englishName} belongs to the field of ${theme}. In a past position it can describe the pattern you are carrying; in the present it shows the energy now in motion; as advice it asks you to respond with one grounded action.`,
    },
    {
      heading: `When ${englishName} Appears`,
      body: `Treat ${englishName} as a ${cardTone(card)} that deserves attention before you rush to the outcome. The card is most useful when you connect it to the exact question, the spread position, and the concrete choice in front of you.`,
    },
    {
      heading: `Common Mistake With ${englishName}`,
      body: `The common mistake is reading ${englishName} as a single verdict. It works better as a diagnostic: what is active, what is blocked, what needs support, and what action would make the symbolism practical.`,
    },
  ]
}

function createRegionalCoreSections(card: TarotCard, locale: RegionalCardLocale, theme: string) {
  const name = localizedCardName(card, locale)
  const upright = localizedKeywords(card, locale, "upright")
  const reversed = localizedKeywords(card, locale, "reversed")

  if (locale === "es") {
    return [
      {
        heading: `${name} significado normal`,
        body: `En posicion normal, ${name} destaca ${upright}. En una tirada real, esta energia se lee dentro de ${theme}, la posicion de la carta y la pregunta concreta que estas haciendo.`,
      },
      {
        heading: `${name} significado invertido`,
        body: `Invertida, ${name} apunta a ${reversed}. No significa automaticamente algo negativo; suele mostrar un bloqueo, retraso, exceso o ajuste interno que necesita atencion.`,
      },
      {
        heading: `Como interpretar ${name} en una tirada`,
        body: `En pasado puede mostrar un patron que ya traes; en presente, la energia activa; como consejo, una accion practica. Lee la carta junto a las cartas cercanas antes de sacar una conclusion.`,
      },
    ]
  }

  return [
    {
      heading: `${name} significado normal`,
      body: `Na posicao normal, ${name} destaca ${upright}. Em uma tiragem real, essa energia deve ser lida dentro de ${theme}, da posicao da carta e da pergunta concreta que voce fez.`,
    },
    {
      heading: `${name} significado invertido`,
      body: `Invertida, ${name} aponta para ${reversed}. Isso nao significa automaticamente algo ruim; costuma mostrar bloqueio, atraso, excesso ou ajuste interno que precisa de atencao.`,
    },
    {
      heading: `Como interpretar ${name} em uma tiragem`,
      body: `No passado pode mostrar um padrao que voce ja carrega; no presente, a energia ativa; como conselho, uma acao pratica. Leia a carta junto das cartas proximas antes de concluir.`,
    },
  ]
}

function localizedCardName(card: TarotCard, locale: SeoLocale) {
  if (locale === "es" || locale === "pt-br") return regionalCardNames[locale][card.id] || card.nameEn

  return locale === "zh"
    ? card.name
    : locale === "ja"
      ? card.nameJa || card.nameEn
      : locale === "ko"
        ? card.nameKo || card.nameEn
        : card.nameEn
}

function createDeepSections(card: TarotCard, locale: SeoLocale, theme: string) {
  const englishName = card.nameEn
  const name = localizedCardName(card, locale)
  const upright = localizedKeywords(card, locale, "upright")
  const reversed = localizedKeywords(card, locale, "reversed")

  if (locale === "en") {
    const guidance = englishSuitGuidance[getCardSuit(card)]
    return [
      {
        heading: `${englishName} in Love`,
        body: `In love readings, ${englishName} asks you to ${guidance.love}. Upright, it can highlight ${upright}. Reversed, it may show where ${reversed} is blocking emotional clarity or mutual movement.`,
      },
      {
        heading: `${englishName} in Career`,
        body: `For work and career, ${englishName} asks you to ${guidance.career}. It is useful when you are asking about timing, motivation, team dynamics, or whether the next professional step has enough support behind it.`,
      },
      {
        heading: `${englishName} for Money`,
        body: `In money questions, ${englishName} asks you to ${guidance.money}. It is less about prediction and more about the behavior, stability, and resource choices shaping the outcome.`,
      },
      {
        heading: `${englishName} Yes or No`,
        body: `${englishName} is usually a nuanced answer: ${guidance.yesNo}. Upright, it leans toward movement if your question matches ${upright}. Reversed, it suggests waiting, clarifying motives, or fixing the pattern shown by ${reversed}.`,
      },
      {
        heading: `Advice from ${englishName}`,
        body: `The advice is to ${guidance.advice}. Treat this card as a ${cardTone(card)}: name the energy honestly, choose one action you can control today, and avoid forcing the reading to confirm what you already wanted to hear.`,
      },
    ]
  }

  if (locale === "es" || locale === "pt-br") {
    const isEs = locale === "es"
    return [
      {
        heading: isEs ? `${englishName} en el amor` : `${englishName} no amor`,
        body: isEs
          ? `En lecturas de amor, ${englishName} pide observar el patrón de la relación, no solo buscar un sí o no. En posición normal puede señalar ${upright}; invertida puede mostrar dónde ${reversed} bloquea la claridad emocional.`
          : `Em leituras de amor, ${englishName} pede observar o padrão da relação, não apenas buscar um sim ou não. Na posição normal pode indicar ${upright}; invertida pode mostrar onde ${reversed} bloqueia a clareza emocional.`,
      },
      {
        heading: isEs ? `${englishName} en carrera` : `${englishName} na carreira`,
        body: isEs
          ? `Para trabajo y carrera, ${englishName} apunta a ${theme}. Úsala para pensar en timing, motivación, equipo y el siguiente paso profesional.`
          : `Para trabalho e carreira, ${englishName} aponta para ${theme}. Use esta carta para pensar em timing, motivação, equipe e o próximo passo profissional.`,
      },
      {
        heading: isEs ? `${englishName} en dinero` : `${englishName} em dinheiro`,
        body: isEs
          ? "En preguntas de dinero, esta carta habla más de conducta que de predicción. Observa estabilidad, riesgo y los recursos disponibles."
          : "Em perguntas sobre dinheiro, esta carta fala mais de comportamento do que de previsão. Observe estabilidade, risco e os recursos disponíveis.",
      },
      {
        heading: isEs ? `${englishName} sí o no` : `${englishName} sim ou não`,
        body: isEs
          ? `${englishName} suele ser una respuesta matizada. Normalmente apoya movimiento cuando la pregunta coincide con ${upright}; invertida sugiere esperar o corregir ${reversed}.`
          : `${englishName} costuma ser uma resposta com nuances. Normalmente apoia movimento quando a pergunta combina com ${upright}; invertida sugere esperar ou corrigir ${reversed}.`,
      },
      {
        heading: isEs ? `Consejo de ${englishName}` : `Conselho de ${englishName}`,
        body: isEs
          ? `El consejo es convertir el símbolo en una acción concreta. Nombra el patrón, mira qué parte puedes controlar hoy y evita usar la carta solo para confirmar lo que ya querías oír.`
          : `O conselho é transformar o símbolo em uma ação concreta. Nomeie o padrão, veja o que você pode controlar hoje e evite usar a carta apenas para confirmar o que já queria ouvir.`,
      },
    ]
  }

  return [
    {
      heading: locale === "zh" ? "爱情含义" : locale === "ja" ? "恋愛での意味" : "사랑에서의 의미",
      body:
        locale === "zh"
          ? `${name}在爱情中提醒你观察关系模式，而不是只追一个确定答案。正位看见${upright}，逆位则提示${reversed}。`
          : locale === "ja"
            ? `${name}は恋愛で、単純な答えより関係のパターンを見るよう促します。正位置は${upright}、逆位置は${reversed}を示します。`
            : `${name}는 사랑에서 단순한 답보다 관계 패턴을 보라고 말합니다. 정방향은 ${upright}, 역방향은 ${reversed}를 보여줍니다.`,
    },
    {
      heading: locale === "zh" ? "事业与金钱" : locale === "ja" ? "仕事とお金" : "커리어와 돈",
      body:
        locale === "zh"
          ? `在事业和金钱问题里，这张牌把注意力带向${theme}，适合用来判断下一步行动是否稳妥。`
          : locale === "ja"
            ? `仕事やお金の質問では、${theme}に意識を向け、次の一歩が現実的かを見ます。`
            : `커리어와 돈 질문에서는 ${theme}에 주목하며 다음 행동이 현실적인지 살펴봅니다.`,
    },
    {
      heading: locale === "zh" ? "是或否" : locale === "ja" ? "Yes / No" : "예 / 아니오",
      body:
        locale === "zh"
          ? `${name}通常不是绝对的是或否。正位偏向推进，逆位更适合等待、修正或先看清问题。`
          : locale === "ja"
            ? `${name}は単純な Yes/No よりも、進める条件と整えるべき点を示します。`
            : `${name}는 단순한 예/아니오보다 진행 조건과 먼저 정리할 점을 보여줍니다.`,
    },
  ]
}

function createCombinations(card: TarotCard, locale: SeoLocale) {
  const name = localizedCardName(card, locale)
  const englishName = card.nameEn
  const linkedSlug = (englishCardName: string) => {
    const linkedCard = TAROT_CARDS.find((item) => item.nameEn === englishCardName)
    return linkedCard ? getCardSlug(linkedCard) : undefined
  }

  if (locale === "en") {
    const partner = {
      major: { card: "The World", meaning: "completion, integration, and the larger arc of the lesson" },
      wands: { card: "The Chariot", meaning: "momentum, willpower, and whether action has a clear direction" },
      cups: { card: "The Moon", meaning: "emotional projection, intuition, and what is still hard to name" },
      pentacles: { card: "The Emperor", meaning: "structure, commitment, money boundaries, and long-term stability" },
      swords: { card: "Justice", meaning: "truth, consequences, contracts, and clean decision-making" },
    }[getCardSuit(card)]

    return [
      {
        heading: `${englishName} with The Lovers`,
        body: `This combination often brings the card into relationship choices, attraction, values, or the need to make a decision with emotional honesty.`,
        hrefSlug: linkedSlug("The Lovers"),
      },
      {
        heading: `${englishName} with The Tower`,
        body: `The Tower intensifies the message. It can show a pattern breaking open so the lesson of ${englishName} can no longer be ignored.`,
        hrefSlug: linkedSlug("The Tower"),
      },
      {
        heading: `${englishName} with Ace cards`,
        body: `Any Ace beside ${englishName} points to a new beginning. Look at the Ace suit to understand whether the fresh start is emotional, practical, mental, or creative.`,
      },
      {
        heading: `${englishName} with ${partner.card}`,
        body: `Together, these cards emphasize ${partner.meaning}. Read the pair as a clue about what must be stabilized before the message of ${englishName} can become useful.`,
        hrefSlug: linkedSlug(partner.card),
      },
    ]
  }

  if (locale === "es" || locale === "pt-br") {
    const isEs = locale === "es"
    const partner = {
      major: { card: "The World", es: "cierre, integración y el arco completo de la lección", pt: "conclusão, integração e o arco completo da lição" },
      wands: { card: "The Chariot", es: "impulso, voluntad y dirección de la acción", pt: "movimento, vontade e direção da ação" },
      cups: { card: "The Moon", es: "proyección emocional, intuición y lo que aún no está claro", pt: "projeção emocional, intuição e o que ainda não está claro" },
      pentacles: { card: "The Emperor", es: "estructura, compromiso, límites materiales y estabilidad", pt: "estrutura, compromisso, limites materiais e estabilidade" },
      swords: { card: "Justice", es: "verdad, consecuencias, acuerdos y decisiones claras", pt: "verdade, consequências, acordos e decisões claras" },
    }[getCardSuit(card)]

    return [
      {
        heading: isEs ? `${name} con The Lovers` : `${name} com The Lovers`,
        body: isEs
          ? "Esta combinacion suele llevar la lectura hacia elecciones de relacion, valores, atraccion y honestidad emocional."
          : "Essa combinacao costuma levar a leitura para escolhas de relacionamento, valores, atracao e honestidade emocional.",
        hrefSlug: linkedSlug("The Lovers"),
      },
      {
        heading: isEs ? `${name} con The Tower` : `${name} com The Tower`,
        body: isEs
          ? `The Tower intensifica el mensaje y puede mostrar que el patron de ${name} ya no puede ignorarse.`
          : `The Tower intensifica a mensagem e pode mostrar que o padrao de ${name} ja nao pode ser ignorado.`,
        hrefSlug: linkedSlug("The Tower"),
      },
      {
        heading: isEs ? `${name} con Ases` : `${name} com Ases`,
        body: isEs
          ? `Cualquier As junto a ${name} senala un inicio. Mira el palo del As para saber si el comienzo es emocional, practico, mental o creativo.`
          : `Qualquer As junto de ${name} aponta para um inicio. Veja o naipe do As para entender se o começo e emocional, pratico, mental ou criativo.`,
      },
      {
        heading: isEs ? `${name} con ${partner.card}` : `${name} com ${partner.card}`,
        body: isEs
          ? `Juntas, estas cartas enfatizan ${partner.es}. Usa la combinacion para ver que debe estabilizarse antes de aplicar el mensaje de ${name}.`
          : `Juntas, estas cartas enfatizam ${partner.pt}. Use a combinacao para ver o que precisa ser estabilizado antes de aplicar a mensagem de ${name}.`,
        hrefSlug: linkedSlug(partner.card),
      },
    ]
  }

  return [
    {
      heading: locale === "zh" ? `${name}与恋人牌` : locale === "ja" ? `${name}と恋人` : `${name}와 연인 카드`,
      body:
        locale === "zh"
          ? "这个组合通常把重点带到关系选择、价值观和诚实沟通上。"
          : locale === "ja"
            ? "この組み合わせは、関係の選択、価値観、正直な対話を強調します。"
            : "이 조합은 관계 선택, 가치관, 솔직한 소통을 강조합니다.",
      hrefSlug: linkedSlug("The Lovers"),
    },
    {
      heading: locale === "zh" ? `${name}与高塔` : locale === "ja" ? `${name}と塔` : `${name}와 탑`,
      body:
        locale === "zh"
          ? "高塔会放大这张牌的信息，说明旧模式可能已经无法继续。"
          : locale === "ja"
            ? "塔はこのカードの意味を強め、古いパターンが続けられないことを示します。"
            : "탑은 이 카드의 메시지를 강하게 만들며 오래된 패턴이 지속되기 어렵다는 뜻입니다.",
      hrefSlug: linkedSlug("The Tower"),
    },
  ]
}

function createPositionSections(card: TarotCard, locale: SeoLocale, theme: string) {
  const name = localizedCardName(card, locale)
  const englishName = card.nameEn
  const upright = localizedKeywords(card, locale, "upright")
  const reversed = localizedKeywords(card, locale, "reversed")

  if (locale === "en") {
    const guidance = englishSuitGuidance[getCardSuit(card)]
    return {
      label: "Spread position meanings",
      intro: `The same ${englishName} card changes emphasis depending on where it lands in the spread. Use the position first, then refine the meaning with the question and nearby cards.`,
      sections: [
        {
          position: "Past",
          heading: `${englishName} in the past position`,
          body: `In the past position, ${englishName} points to a pattern of ${upright} that shaped the current question. If the card feels reversed in the story, ${reversed} may describe what you are still untangling.`,
        },
        {
          position: "Present",
          heading: `${englishName} in the present position`,
          body: `In the present position, ${englishName} names the active energy now. It asks you to notice where ${theme} is already influencing your choices, emotions, timing, or communication.`,
        },
        {
          position: "Future",
          heading: `${englishName} in the future position`,
          body: `In the future position, ${englishName} shows the direction the situation may take if the current pattern continues. Upright energy supports ${upright}; reversed energy warns that ${reversed} could slow the outcome.`,
        },
        {
          position: "Advice",
          heading: `${englishName} as advice`,
          body: `As advice, ${englishName} asks you to ${guidance.advice}. Make the message practical: choose one action you can control instead of waiting for the card to decide everything for you.`,
        },
        {
          position: "Outcome",
          heading: `${englishName} as an outcome`,
          body: `As an outcome, ${englishName} is strongest when read with the final surrounding cards. It can show a result built around ${upright}, or a lesson that remains unresolved when ${reversed} keeps repeating.`,
        },
      ],
    }
  }

  if (locale === "es") {
    return {
      label: "Significados por posicion",
      intro: `La misma carta ${name} cambia segun la posicion en la tirada. Lee primero la posicion, despues la pregunta y las cartas cercanas.`,
      sections: [
        { position: "Pasado", heading: `${name} en posicion de pasado`, body: `${name} puede mostrar un patron anterior de ${upright} que todavia influye en la pregunta.` },
        { position: "Presente", heading: `${name} en posicion de presente`, body: `En presente, ${name} nombra la energia activa ahora dentro de ${theme}.` },
        { position: "Futuro", heading: `${name} en posicion de futuro`, body: `En futuro, ${name} muestra una direccion posible si el patron actual continua; invertida advierte sobre ${reversed}.` },
        { position: "Consejo", heading: `${name} como consejo`, body: `Como consejo, convierte el simbolo en una accion concreta que puedas controlar hoy.` },
        { position: "Resultado", heading: `${name} como resultado`, body: `Como resultado, ${name} debe leerse con las cartas finales: puede confirmar ${upright} o mostrar que ${reversed} sigue pendiente.` },
      ],
    }
  }

  if (locale === "pt-br") {
    return {
      label: "Significados por posicao",
      intro: `A mesma carta ${name} muda de enfase conforme a posicao na tiragem. Leia primeiro a posicao, depois a pergunta e as cartas proximas.`,
      sections: [
        { position: "Passado", heading: `${name} na posicao de passado`, body: `${name} pode mostrar um padrao anterior de ${upright} que ainda influencia a pergunta.` },
        { position: "Presente", heading: `${name} na posicao de presente`, body: `No presente, ${name} nomeia a energia ativa agora dentro de ${theme}.` },
        { position: "Futuro", heading: `${name} na posicao de futuro`, body: `No futuro, ${name} mostra uma direcao possivel se o padrao atual continuar; invertida alerta para ${reversed}.` },
        { position: "Conselho", heading: `${name} como conselho`, body: `Como conselho, transforme o simbolo em uma acao concreta que voce controla hoje.` },
        { position: "Resultado", heading: `${name} como resultado`, body: `Como resultado, ${name} precisa ser lida com as cartas finais: pode confirmar ${upright} ou mostrar que ${reversed} continua pendente.` },
      ],
    }
  }

  if (locale === "zh") {
    return {
      label: "牌位解读",
      intro: `同一张${name}落在不同牌位，重点会变化。先看牌位，再结合问题和附近的牌。`,
      sections: [
        { position: "过去", heading: `${name}在过去位置`, body: `${name}可能指向已经形成的${cleanKeywords(card.meaning.upright)}模式，也可能提示仍未整理完的${cleanKeywords(card.meaning.reversed)}。` },
        { position: "现在", heading: `${name}在现在位置`, body: `现在位置强调${theme}正在影响你的选择、情绪或行动。` },
        { position: "未来", heading: `${name}在未来位置`, body: `未来位置不是固定预言，而是显示当前模式继续发展时可能出现的方向。` },
        { position: "建议", heading: `${name}作为建议`, body: "把牌义变成一个今天能执行的动作，而不是等待牌替你决定。" },
        { position: "结果", heading: `${name}作为结果`, body: "结果位置需要和最后几张牌一起看，判断主题是否稳定落地，还是仍有阻滞。" },
      ],
    }
  }

  if (locale === "ja") {
    return {
      label: "位置ごとの読み方",
      intro: `${name}は位置によって強調点が変わります。まず位置を見て、質問と周囲のカードで調整します。`,
      sections: [
        { position: "過去", heading: `${name}が過去に出た時`, body: `過去では、${localizedKeywords(card, locale, "upright")}という流れや、まだ残る${localizedKeywords(card, locale, "reversed")}を示します。` },
        { position: "現在", heading: `${name}が現在に出た時`, body: `現在では、${theme}が今の選択や感情に影響していることを示します。` },
        { position: "未来", heading: `${name}が未来に出た時`, body: "未来では、今の流れが続いた場合の方向性を示します。" },
        { position: "助言", heading: `${name}が助言に出た時`, body: "カードの象徴を、今日できる一つの行動に変えることが大切です。" },
        { position: "結果", heading: `${name}が結果に出た時`, body: "結果では、周囲のカードと合わせてテーマが定着するか、まだ調整が必要かを見ます。" },
      ],
    }
  }

  return {
    label: "위치별 해석",
    intro: `${name}는 위치에 따라 강조점이 달라집니다. 먼저 위치를 보고 질문과 주변 카드를 함께 읽으세요.`,
    sections: [
      { position: "과거", heading: `${name}가 과거 위치에 나올 때`, body: `과거에서는 ${localizedKeywords(card, locale, "upright")}의 흐름이나 아직 남은 ${localizedKeywords(card, locale, "reversed")}를 보여줍니다.` },
      { position: "현재", heading: `${name}가 현재 위치에 나올 때`, body: `현재에서는 ${theme}가 지금 선택과 감정에 영향을 주고 있음을 뜻합니다.` },
      { position: "미래", heading: `${name}가 미래 위치에 나올 때`, body: "미래에서는 현재 흐름이 계속될 때의 가능성을 보여줍니다." },
      { position: "조언", heading: `${name}가 조언 위치에 나올 때`, body: "카드의 상징을 오늘 통제할 수 있는 한 가지 행동으로 바꾸세요." },
      { position: "결과", heading: `${name}가 결과 위치에 나올 때`, body: "결과에서는 주변 카드와 함께 주제가 안정되는지, 아직 조정이 필요한지 봅니다." },
    ],
  }
}

function createExampleReadings(card: TarotCard, locale: SeoLocale, theme: string) {
  const name = localizedCardName(card, locale)
  const englishName = card.nameEn
  const upright = localizedKeywords(card, locale, "upright")
  const reversed = localizedKeywords(card, locale, "reversed")

  if (locale === "en") {
    const guidance = englishSuitGuidance[getCardSuit(card)]
    return {
      label: "Example readings",
      intro: `Use these examples as reading patterns, not private user records. They show how ${englishName} changes when the question, surrounding cards, and next step are specific.`,
      readings: [
        {
          label: "Love example",
          question: `Does ${englishName} mean this connection can grow?`,
          cards: `${englishName}, The Lovers, Two of Cups`,
          interpretation: `In a love spread, ${englishName} makes the reading less about a guaranteed outcome and more about emotional readiness. The Lovers and Two of Cups support mutual interest, but ${englishName} asks whether both people can move from curiosity into consistent behavior.`,
          nextStep: `Ask what action would make the connection safer, clearer, and less dependent on guessing.`,
          hrefSlug: "does-he-love-me-tarot",
        },
        {
          label: "Career example",
          question: `How should I use ${englishName} energy at work?`,
          cards: `${englishName}, Eight of Pentacles, The Chariot`,
          interpretation: `For career, ${englishName} turns ${theme} into a practical experiment. Eight of Pentacles asks for skill and repetition, while The Chariot asks for direction. The useful answer is not "quit or stay" yet; it is to test one focused move before making a larger decision.`,
          nextStep: `Choose one measurable work action this week, then review whether it creates momentum or only more noise.`,
          hrefSlug: "career-tarot-reading",
        },
        {
          label: "Yes or no example",
          question: `Is ${englishName} a yes or no for my decision?`,
          cards: `${englishName}, Justice, Four of Swords`,
          interpretation: `This is a conditional answer. ${guidance.yesNo}. Justice asks for facts and consequences; Four of Swords asks for a pause. The reading leans away from rushing and toward a cleaner decision after the missing information is named.`,
          nextStep: `Write the decision as one sentence, list the fact you still need, then ask again only after that fact is clear.`,
          hrefSlug: "yes-or-no-tarot",
        },
      ],
    }
  }

  if (locale === "es") {
    return {
      label: "Ejemplos de lectura",
      intro: `Estos ejemplos muestran como ${name} cambia segun la pregunta, las cartas cercanas y el siguiente paso.`,
      readings: [
        {
          label: "Ejemplo de amor",
          question: `Que muestra ${name} sobre esta conexion?`,
          cards: `${name}, The Lovers, Two of Cups`,
          interpretation: `${name} lleva la lectura a disponibilidad, ritmo y conducta real. Si hay interes, todavia necesita convertirse en acciones consistentes.`,
          nextStep: "Pregunta que accion haria la conexion mas clara y menos dependiente de adivinar.",
          hrefSlug: "does-he-love-me-tarot",
        },
        {
          label: "Ejemplo de carrera",
          question: `Como usar la energia de ${name} en mi trabajo?`,
          cards: `${name}, Eight of Pentacles, The Chariot`,
          interpretation: `${name} convierte ${theme} en un experimento practico: habilidad, repeticion y direccion antes de una decision grande.`,
          nextStep: "Elige una accion medible esta semana y revisa si crea avance real.",
          hrefSlug: "career-tarot-reading",
        },
        {
          label: "Ejemplo si o no",
          question: `${name} indica si o no?`,
          cards: `${name}, Justice, Four of Swords`,
          interpretation: `La respuesta es condicional. Normal puede apoyar ${upright}; invertida pide revisar ${reversed} antes de actuar.`,
          nextStep: "Nombra la informacion que falta antes de tomar la decision.",
          hrefSlug: "yes-or-no-tarot",
        },
      ],
    }
  }

  if (locale === "pt-br") {
    return {
      label: "Exemplos de leitura",
      intro: `Estes exemplos mostram como ${name} muda conforme a pergunta, as cartas próximas e o próximo passo.`,
      readings: [
        {
          label: "Exemplo de amor",
          question: `O que ${name} mostra sobre esta conexao?`,
          cards: `${name}, The Lovers, Two of Cups`,
          interpretation: `${name} leva a leitura para disponibilidade, ritmo e comportamento real. Se existe interesse, ele ainda precisa virar consistencia.`,
          nextStep: "Pergunte qual acao deixaria a conexao mais clara e menos dependente de suposicao.",
          hrefSlug: "does-he-love-me-tarot",
        },
        {
          label: "Exemplo de carreira",
          question: `Como usar a energia de ${name} no trabalho?`,
          cards: `${name}, Eight of Pentacles, The Chariot`,
          interpretation: `${name} transforma ${theme} em um teste pratico: habilidade, repeticao e direcao antes de uma decisao maior.`,
          nextStep: "Escolha uma acao mensuravel esta semana e veja se ela cria avanco real.",
          hrefSlug: "career-tarot-reading",
        },
        {
          label: "Exemplo sim ou nao",
          question: `${name} indica sim ou nao?`,
          cards: `${name}, Justice, Four of Swords`,
          interpretation: `A resposta e condicional. Normal pode apoiar ${upright}; invertida pede revisar ${reversed} antes de agir.`,
          nextStep: "Nomeie a informacao que falta antes de decidir.",
          hrefSlug: "yes-or-no-tarot",
        },
      ],
    }
  }

  if (locale === "zh") {
    return {
      label: "解读示例",
      intro: `这些是代表性场景，不是私人用户记录。它们展示${name}如何随着问题、周围牌和下一步行动而变化。`,
      readings: [
        {
          label: "爱情示例",
          question: `${name}说明这段关系能发展吗？`,
          cards: `${name}、恋人、圣杯二`,
          interpretation: `${name}把重点放在准备度、节奏和真实行动上。即使有好感，也需要从感觉走向稳定行为。`,
          nextStep: "问清楚什么行动能让关系更安全、更清晰，而不是只猜对方想法。",
          hrefSlug: "does-he-love-me-tarot",
        },
        {
          label: "事业示例",
          question: `我该如何把${name}用在工作里？`,
          cards: `${name}、星币八、战车`,
          interpretation: `${name}把${theme}变成一次现实测试：先看技能、重复投入和方向，再判断要不要做大决定。`,
          nextStep: "本周选一个可衡量行动，看它带来推进还是更多消耗。",
          hrefSlug: "career-tarot-reading",
        },
        {
          label: "是或否示例",
          question: `${name}代表 yes 还是 no？`,
          cards: `${name}、正义、宝剑四`,
          interpretation: `这是有条件的答案。正位支持${upright}，逆位则提醒先处理${cleanKeywords(card.meaning.reversed)}。`,
          nextStep: "先写下你还缺的关键信息，再决定是否行动。",
          hrefSlug: "yes-or-no-tarot",
        },
      ],
    }
  }

  if (locale === "ja") {
    return {
      label: "読み方の例",
      intro: `${name}が質問、周囲のカード、次の行動によってどう変わるかを見る代表例です。`,
      readings: [
        {
          label: "恋愛の例",
          question: `${name}はこの関係の成長を示す？`,
          cards: `${name}, The Lovers, Two of Cups`,
          interpretation: `${name}は気持ちだけでなく、準備、ペース、実際の行動を見るよう促します。`,
          nextStep: "相手の気持ちを推測する前に、関係を明確にする行動を一つ決めます。",
          hrefSlug: "does-he-love-me-tarot",
        },
        {
          label: "仕事の例",
          question: `仕事で${name}をどう使う？`,
          cards: `${name}, Eight of Pentacles, The Chariot`,
          interpretation: `${name}は${theme}を現実的な試みに変えます。大きな決断の前に方向と技術を確認します。`,
          nextStep: "今週できる測定可能な行動を一つ選びます。",
          hrefSlug: "career-tarot-reading",
        },
        {
          label: "Yes / No の例",
          question: `${name}は Yes か No か？`,
          cards: `${name}, Justice, Four of Swords`,
          interpretation: `答えは条件付きです。正位置は${upright}を支え、逆位置は${reversed}を整える必要を示します。`,
          nextStep: "不足している情報を一つ明確にしてから決めます。",
          hrefSlug: "yes-or-no-tarot",
        },
      ],
    }
  }

  return {
    label: "해석 예시",
    intro: `${name}가 질문, 주변 카드, 다음 행동에 따라 어떻게 달라지는지 보여주는 대표 예시입니다.`,
    readings: [
      {
        label: "사랑 예시",
        question: `${name}는 이 관계의 성장을 뜻하나요?`,
        cards: `${name}, The Lovers, Two of Cups`,
        interpretation: `${name}는 감정뿐 아니라 준비도, 속도, 실제 행동을 함께 보라고 말합니다.`,
        nextStep: "상대 마음을 추측하기보다 관계를 더 명확하게 만드는 행동을 하나 정하세요.",
        hrefSlug: "does-he-love-me-tarot",
      },
      {
        label: "커리어 예시",
        question: `일에서 ${name} 에너지를 어떻게 쓸까요?`,
        cards: `${name}, Eight of Pentacles, The Chariot`,
        interpretation: `${name}는 ${theme}를 현실적인 실험으로 바꿉니다. 큰 결정 전 방향과 기술을 확인하세요.`,
        nextStep: "이번 주 측정 가능한 행동 하나를 선택하세요.",
        hrefSlug: "career-tarot-reading",
      },
      {
        label: "예 / 아니오 예시",
        question: `${name}는 예인가요, 아니오인가요?`,
        cards: `${name}, Justice, Four of Swords`,
        interpretation: `답은 조건부입니다. 정방향은 ${upright}를 돕고, 역방향은 ${reversed}를 먼저 정리하라고 말합니다.`,
        nextStep: "결정 전에 부족한 정보를 하나 분명히 하세요.",
        hrefSlug: "yes-or-no-tarot",
      },
    ],
  }
}

function createCardFaqs(card: TarotCard, locale: SeoLocale) {
  const name = localizedCardName(card, locale)
  const englishName = card.nameEn

  if (locale === "en") {
    const upright = localizedKeywords(card, locale, "upright")
    const reversed = localizedKeywords(card, locale, "reversed")
    const guidance = englishSuitGuidance[getCardSuit(card)]

    return [
      {
        question: `What does ${englishName} mean in tarot?`,
        answer: `${englishName} represents ${upright} when upright, while the reversed meaning can point to ${reversed}. The exact message depends on the question, position, and surrounding cards.`,
      },
      {
        question: `What does ${englishName} mean upright?`,
        answer: `Upright, ${englishName} usually shows active energy around ${upright}. It is often a sign to work with the theme directly rather than avoid it.`,
      },
      {
        question: `What does ${englishName} mean reversed?`,
        answer: `Reversed, ${englishName} does not have to be bad. It often shows a delay, imbalance, private fear, or correction connected to ${reversed}.`,
      },
      {
        question: `What does ${englishName} mean in love?`,
        answer: `In love readings, ${englishName} asks you to ${guidance.love}. It is strongest when read with both feelings and behavior, not with wishful thinking alone.`,
      },
      {
        question: `Is ${englishName} a yes or no card?`,
        answer: `${englishName} can answer yes or no only when you read the orientation, question, and nearby cards together. ${guidance.yesNo}.`,
      },
      {
        question: `What should I do when I draw ${englishName}?`,
        answer: `Use ${englishName} as a prompt for reflection and action. Notice the pattern it names, then choose one practical next step instead of treating the card as fixed fate.`,
      },
      {
        question: `What does ${englishName} mean for career and money?`,
        answer: `For career, ${englishName} asks you to ${guidance.career}. For money, it asks you to ${guidance.money}. Read both through real resources, timing, and what you can control next.`,
      },
      {
        question: `What is the best advice from ${englishName}?`,
        answer: `The best advice is to ${guidance.advice}. Let the card clarify the pattern, then turn that insight into one grounded action rather than another round of reassurance.`,
      },
    ]
  }

  if (locale === "es" || locale === "pt-br") {
    const isEs = locale === "es"
    const name = localizedCardName(card, locale)
    const upright = localizedKeywords(card, locale, "upright")
    const reversed = localizedKeywords(card, locale, "reversed")

    return [
      {
        question: isEs ? `Que significa ${name} en tarot?` : `O que significa ${name} no tarot?`,
        answer: isEs
          ? `${name} en posicion normal representa ${upright}; invertida puede senalar ${reversed}. El mensaje exacto depende de la pregunta, la posicion y las cartas cercanas.`
          : `${name} na posicao normal representa ${upright}; invertida pode indicar ${reversed}. A mensagem exata depende da pergunta, da posicao e das cartas proximas.`,
      },
      {
        question: isEs ? `Que significa ${name} en posicion normal?` : `O que significa ${name} na posicao normal?`,
        answer: isEs
          ? `En posicion normal, ${name} suele mostrar una energia activa relacionada con ${upright}. Es una invitacion a trabajar el tema de forma consciente.`
          : `Na posicao normal, ${name} costuma mostrar uma energia ativa ligada a ${upright}. E um convite para trabalhar o tema de forma consciente.`,
      },
      {
        question: isEs ? `Que significa ${name} invertida?` : `O que significa ${name} invertida?`,
        answer: isEs
          ? `Invertida, ${name} puede mostrar retraso, desequilibrio, miedo privado o una correccion conectada con ${reversed}.`
          : `Invertida, ${name} pode mostrar atraso, desequilibrio, medo interno ou uma correcao ligada a ${reversed}.`,
      },
      {
        question: isEs ? `Que significa ${name} en el amor?` : `O que significa ${name} no amor?`,
        answer: isEs
          ? `En amor, ${name} se lee mejor junto con conducta real, comunicacion y disponibilidad emocional, no solo como deseo o fantasia.`
          : `No amor, ${name} funciona melhor quando lida junto com comportamento real, comunicacao e disponibilidade emocional, nao apenas desejo ou fantasia.`,
      },
      {
        question: isEs ? `${name} es una carta de si o no?` : `${name} e uma carta de sim ou nao?`,
        answer: isEs
          ? "Puede responder si o no solo cuando se combina orientacion, pregunta y cartas cercanas. Normal suele apoyar avanzar; invertida pide ajuste."
          : "Pode responder sim ou nao apenas quando orientacao, pergunta e cartas proximas sao lidas juntas. Normal apoia avanco; invertida pede ajuste.",
      },
      {
        question: isEs ? `Que debo hacer si saco ${name}?` : `O que devo fazer quando tiro ${name}?`,
        answer: isEs
          ? `Usala como una senal de reflexion y accion. Observa el patron que nombra la carta y elige un siguiente paso practico en lugar de tratarla como destino fijo.`
          : `Use como um sinal de reflexao e acao. Observe o padrao que a carta nomeia e escolha um proximo passo pratico em vez de trata-la como destino fixo.`,
      },
    ]
  }

  return [
    {
      question: locale === "zh" ? `${name}是什么意思？` : locale === "ja" ? `${name}の意味は？` : `${name}의 의미는?`,
      answer:
        locale === "zh"
          ? `${name}正位通常指向${cleanKeywords(card.meaning.upright)}，逆位则提示${cleanKeywords(card.meaning.reversed)}。`
          : locale === "ja"
            ? `${name}の正位置は${localizedKeywords(card, locale, "upright")}、逆位置は${localizedKeywords(card, locale, "reversed")}を示します。`
            : `${name} 정방향은 ${localizedKeywords(card, locale, "upright")}, 역방향은 ${localizedKeywords(card, locale, "reversed")}를 의미합니다.`,
    },
    {
      question: locale === "zh" ? `${name}是或否怎么解？` : locale === "ja" ? `${name}は Yes/No でどう読む？` : `${name}는 예/아니오에서 어떻게 읽나요?`,
      answer:
        locale === "zh"
          ? "需要结合问题、牌位和正逆位。正位多偏向推进，逆位则提醒先修正问题。"
          : locale === "ja"
            ? "質問、位置、正逆を合わせて読みます。正位置は前進、逆位置は調整を示します。"
            : "질문, 위치, 정/역방향을 함께 봅니다. 정방향은 진행, 역방향은 조정이 필요함을 뜻합니다.",
    },
  ]
}

export function getTarotCardSeoPage(card: TarotCard, locale: SeoLocale): TarotCardSeoPage {
  const name = localizedCardName(card, locale)
  const englishName = card.nameEn
  const slug = getCardSlug(card)
  const theme = suitThemes[locale][getCardSuit(card)]
  const positionCopy = createPositionSections(card, locale, theme)
  const exampleCopy = createExampleReadings(card, locale, theme)

  const copy = {
    zh: {
      title: `${name}牌义`,
      description: `了解${name}（${englishName}）正位、逆位和在爱情、事业、每日塔罗中的含义。`,
      eyebrow: "塔罗牌义",
      intro: `${name}会围绕${theme}展开。真正的解读要结合你的问题、牌位和正逆位。`,
      uprightLabel: "正位关键词",
      reversedLabel: "逆位关键词",
      tryQuestion: `${name}现在想提醒我什么？`,
      ctaLabel: "用这张牌开始解读",
      backLabel: "返回牌义大全",
      combinationsLabel: "常见牌组组合",
      faqLabel: "常见问题",
      sections: [
        {
          heading: "这张牌通常代表什么",
          body: `${name}并不是固定答案，而是一组象征。它会把注意力带向${theme}，提醒你看见当前局面里的核心力量。`,
        },
        {
          heading: "如何在牌阵中解读",
          body: "如果它落在过去位置，通常指向已经形成的模式；落在现在位置，代表当前正在运作的能量；落在建议位置，则更像行动提醒。",
        },
      ],
    },
    en: {
      title: `${englishName} Tarot Meaning`,
      description: `Learn the upright and reversed meaning of ${englishName} in love, career, daily tarot, and AI tarot readings.`,
      eyebrow: "Tarot Card Meaning",
      intro: `${englishName} points toward ${theme}. A useful interpretation always depends on your question, the card position, and whether it appears upright or reversed.`,
      uprightLabel: "Upright Keywords",
      reversedLabel: "Reversed Keywords",
      tryQuestion: `What is ${englishName} trying to show me now?`,
      ctaLabel: "Start a Reading With This Card",
      backLabel: "Back to Card Meanings",
      combinationsLabel: "Common Card Combinations",
      faqLabel: "FAQ",
      sections: [
        {
          heading: `${englishName} Quick Meaning`,
          body: `${englishName} is not a fixed answer. It is a symbolic lens that brings attention to ${theme} in your current situation. Use it to name the active pattern before deciding what to do next.`,
        },
        ...createEnglishCoreSections(card, theme),
      ],
    },
    ja: {
      title: `${name}の意味`,
      description: `${name}（${englishName}）の正位置・逆位置、恋愛や仕事での読み方を学びます。`,
      eyebrow: "タロットカードの意味",
      intro: `${name}は${theme}に関わるカードです。質問、位置、正逆によって読み方が変わります。`,
      uprightLabel: "正位置キーワード",
      reversedLabel: "逆位置キーワード",
      tryQuestion: `${name}はいま何を示していますか？`,
      ctaLabel: "このカードで占う",
      backLabel: "カード一覧へ戻る",
      combinationsLabel: "よくあるカードの組み合わせ",
      faqLabel: "よくある質問",
      sections: [
        {
          heading: "このカードが表すこと",
          body: `${name}は固定された答えではなく、現在の状況にある${theme}へ意識を向ける象徴です。`,
        },
        {
          heading: "スプレッドでの読み方",
          body: "過去の位置では既存のパターン、現在では今動いているエネルギー、助言では実践的なヒントとして読みます。",
        },
      ],
    },
    ko: {
      title: `${name} 의미`,
      description: `${name}(${englishName})의 정방향/역방향 의미와 사랑, 커리어, 데일리 타로 해석을 알아보세요.`,
      eyebrow: "타로 카드 의미",
      intro: `${name} 카드는 ${theme}와 관련됩니다. 질문, 위치, 정/역방향에 따라 해석이 달라집니다.`,
      uprightLabel: "정방향 키워드",
      reversedLabel: "역방향 키워드",
      tryQuestion: `${name} 카드가 지금 보여주는 것은 무엇인가요?`,
      ctaLabel: "이 카드로 리딩 시작",
      backLabel: "카드 의미로 돌아가기",
      combinationsLabel: "자주 나오는 카드 조합",
      faqLabel: "질문",
      sections: [
        {
          heading: "이 카드가 나타내는 것",
          body: `${name}는 고정된 답이 아니라 현재 상황 속 ${theme}에 주목하게 하는 상징입니다.`,
        },
        {
          heading: "스프레드에서 읽는 법",
          body: "과거 위치에서는 기존 패턴, 현재 위치에서는 작동 중인 에너지, 조언 위치에서는 실천 힌트로 읽습니다.",
        },
      ],
    },
    es: {
      title: `${name} significado en tarot`,
      description: `Aprende el significado normal e invertido de ${name} en amor, carrera, dinero, tarot diario y lecturas con IA.`,
      eyebrow: "Significado de tarot",
      intro: `${name} apunta a ${theme}. Una lectura util depende de tu pregunta, la posicion de la carta y si aparece normal o invertida.`,
      uprightLabel: "Palabras clave normal",
      reversedLabel: "Palabras clave invertida",
      tryQuestion: `Que intenta mostrarme ${name} ahora?`,
      ctaLabel: "Empezar lectura con esta carta",
      backLabel: "Volver a significados",
      combinationsLabel: "Combinaciones comunes",
      faqLabel: "Preguntas frecuentes",
      sections: [
        {
          heading: `${name} significado rapido`,
          body: `${name} no es una respuesta fija. Es una lente simbolica que dirige la atencion hacia ${theme}. Usala para nombrar el patron activo antes de decidir que hacer.`,
        },
        ...createRegionalCoreSections(card, "es", theme),
      ],
    },
    "pt-br": {
      title: `${name} significado no tarot`,
      description: `Aprenda o significado normal e invertido de ${name} no amor, carreira, dinheiro, tarot diario e leituras com IA.`,
      eyebrow: "Significado de tarot",
      intro: `${name} aponta para ${theme}. Uma leitura util depende da pergunta, da posicao da carta e se ela aparece normal ou invertida.`,
      uprightLabel: "Palavras-chave normal",
      reversedLabel: "Palavras-chave invertida",
      tryQuestion: `O que ${name} quer me mostrar agora?`,
      ctaLabel: "Começar leitura com esta carta",
      backLabel: "Voltar aos significados",
      combinationsLabel: "Combinações comuns",
      faqLabel: "Perguntas frequentes",
      sections: [
        {
          heading: `${name} significado rapido`,
          body: `${name} nao e uma resposta fixa. E uma lente simbolica que chama atencao para ${theme}. Use para nomear o padrao ativo antes de decidir o que fazer.`,
        },
        ...createRegionalCoreSections(card, "pt-br", theme),
      ],
    },
  }[locale]

  return {
    card,
    slug,
    locale,
    path: localePath(locale, `/tarot-card-meanings/${slug}`),
    h1: copy.title,
    title: copy.title,
    description: copy.description,
    eyebrow: copy.eyebrow,
    intro: copy.intro,
    uprightLabel: copy.uprightLabel,
    reversedLabel: copy.reversedLabel,
    tryQuestion: copy.tryQuestion,
    ctaLabel: copy.ctaLabel,
    backLabel: copy.backLabel,
    sections: copy.sections,
    deepSections: createDeepSections(card, locale, theme),
    positionLabel: positionCopy.label,
    positionIntro: positionCopy.intro,
    positionSections: positionCopy.sections,
    exampleLabel: exampleCopy.label,
    exampleIntro: exampleCopy.intro,
    exampleReadings: exampleCopy.readings,
    combinationsLabel: copy.combinationsLabel,
    combinations: createCombinations(card, locale),
    faqLabel: copy.faqLabel,
    faqs: createCardFaqs(card, locale),
  }
}

export function getCardKeywords(card: TarotCard, locale: SeoLocale = "zh") {
  return {
    upright: localizedKeywords(card, locale, "upright"),
    reversed: localizedKeywords(card, locale, "reversed"),
  }
}

export function getAllCardSeoPages(locale: SeoLocale) {
  return TAROT_CARDS.map((card) => getTarotCardSeoPage(card, locale))
}
