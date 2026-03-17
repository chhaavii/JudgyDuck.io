export type Trait = "logic" | "chaos" | "empathy" | "control" | "confidence" | "insecurity"

export interface Answer {
  text: string
  traits: Partial<Record<Trait, number>>
}

export interface Question {
  id: number
  question: string
  answers: Answer[]
}

export const questions: Question[] = [
  {
    id: 1,
    question: "Would you rather be:",
    answers: [
      { text: "A lion that's afraid of mice", traits: { confidence: 2, insecurity: 3 } },
      { text: "A shark that can't swim", traits: { logic: -1, chaos: 2, insecurity: 2 } },
      { text: "An eagle that hates heights", traits: { control: 2, insecurity: 2 } },
      { text: "A wolf that only eats salad", traits: { empathy: 2, chaos: 1 } },
    ],
  },
  {
    id: 2,
    question: "Pick your destiny:",
    answers: [
      { text: "A wizard with no spells, just vibes", traits: { chaos: 3, confidence: 2 } },
      { text: "A superhero whose only power is good timing", traits: { logic: 2, control: 2 } },
      { text: "A villain who apologizes after every evil act", traits: { empathy: 3, insecurity: 2 } },
      { text: "A side character who knows everything", traits: { logic: 3, control: 1 } },
    ],
  },
  {
    id: 3,
    question: "Choose your cursed ability:",
    answers: [
      { text: "Invisibility… but only when no one is looking anyway", traits: { insecurity: 3, chaos: 1 } },
      { text: "Time travel… but only 5 seconds back", traits: { control: 2, logic: 2 } },
      { text: "Mind reading… but only your own thoughts", traits: { empathy: 1, insecurity: 2 } },
      { text: "Super speed… but you trip often", traits: { chaos: 3, confidence: 1 } },
    ],
  },
  {
    id: 4,
    question: "What would hurt more?",
    answers: [
      { text: "Being ignored in a group chat", traits: { insecurity: 3, empathy: 2 } },
      { text: "Laughing at a joke no one else found funny", traits: { chaos: 2, confidence: 1 } },
      { text: "Waving back at someone who wasn't waving at you", traits: { insecurity: 2, empathy: 1 } },
      { text: "Calling a teacher 'mom'", traits: { chaos: 1, insecurity: 3 } },
    ],
  },
  {
    id: 5,
    question: "Pick a chaotic companion:",
    answers: [
      { text: "A talking cat that judges you", traits: { logic: 2, insecurity: 1 } },
      { text: "A duck that runs your life decisions", traits: { chaos: 3, control: -1 } },
      { text: "A ghost that gives bad advice", traits: { chaos: 2, empathy: 1 } },
      { text: "A robot that overthinks everything", traits: { logic: 3, control: 2 } },
    ],
  },
  {
    id: 6,
    question: "Choose your 'flawed perfection':",
    answers: [
      { text: "Always right, but no one believes you", traits: { logic: 3, insecurity: 2 } },
      { text: "Always lucky, but only in useless things", traits: { chaos: 2, confidence: 1 } },
      { text: "Always calm, but secretly panicking", traits: { control: 3, insecurity: 2 } },
      { text: "Always honest, but brutally so", traits: { empathy: -1, confidence: 3 } },
    ],
  },
  {
    id: 7,
    question: "Your life is now a show. Pick the genre:",
    answers: [
      { text: "Mystery (you don't even know what's happening)", traits: { chaos: 2, logic: 1 } },
      { text: "Comedy (everyone laughs… mostly at you)", traits: { empathy: 2, insecurity: 1 } },
      { text: "Thriller (constant stress, no breaks)", traits: { control: 2, confidence: 1 } },
      { text: "Documentary (too real, too exposed)", traits: { logic: 2, empathy: 2 } },
    ],
  },
  {
    id: 8,
    question: "Final judgment — the duck stares at you:",
    answers: [
      { text: "I follow my brain over impulse", traits: { logic: 3, control: 2 } },
      { text: "I follow my impulse over my brain", traits: { chaos: 3, confidence: 2 } },
      { text: "I regret things deeply", traits: { empathy: 2, insecurity: 2 } },
      { text: "I justify everything I do", traits: { confidence: 3, control: 1 } },
    ],
  },
]

export const duckReactions = [
  "Hmm. A predictable deviation.",
  "You confuse avoidance with strategy.",
  "Interesting… you lean toward controlled chaos.",
  "You chose comfort over truth.",
  "Not bold. Not safe. Something in between.",
  "Fascinating. You reveal more than you intend.",
  "A choice born of fear, dressed as wisdom.",
  "You think yourself unpredictable. You are not.",
  "The safe choice. How... expected.",
  "Chaos suits you. Embrace it.",
]

export interface JudgmentTitle {
  primary: Trait
  secondary: Trait
  title: string
}

export const judgmentTitles: JudgmentTitle[] = [
  { primary: "logic", secondary: "chaos", title: "The Calculated Fool" },
  { primary: "logic", secondary: "control", title: "The Silent Architect" },
  { primary: "logic", secondary: "empathy", title: "The Reluctant Sage" },
  { primary: "logic", secondary: "confidence", title: "The Certain Scholar" },
  { primary: "logic", secondary: "insecurity", title: "The Doubtful Genius" },
  { primary: "chaos", secondary: "logic", title: "The Chaotic Thinker" },
  { primary: "chaos", secondary: "control", title: "The Paradox Incarnate" },
  { primary: "chaos", secondary: "empathy", title: "The Whimsical Heart" },
  { primary: "chaos", secondary: "confidence", title: "The Reckless Flame" },
  { primary: "chaos", secondary: "insecurity", title: "The Beautiful Disaster" },
  { primary: "empathy", secondary: "logic", title: "The Thoughtful Healer" },
  { primary: "empathy", secondary: "chaos", title: "The Compassionate Storm" },
  { primary: "empathy", secondary: "control", title: "The Gentle Sovereign" },
  { primary: "empathy", secondary: "confidence", title: "The Radiant Guide" },
  { primary: "empathy", secondary: "insecurity", title: "The Hesitant Dreamer" },
  { primary: "control", secondary: "logic", title: "The Master Planner" },
  { primary: "control", secondary: "chaos", title: "The Reluctant Sovereign" },
  { primary: "control", secondary: "empathy", title: "The Benevolent Ruler" },
  { primary: "control", secondary: "confidence", title: "The Iron Visionary" },
  { primary: "control", secondary: "insecurity", title: "The Anxious Commander" },
  { primary: "confidence", secondary: "logic", title: "The Assured Intellect" },
  { primary: "confidence", secondary: "chaos", title: "The Bold Maverick" },
  { primary: "confidence", secondary: "empathy", title: "The Shining Champion" },
  { primary: "confidence", secondary: "control", title: "The Unyielding Force" },
  { primary: "confidence", secondary: "insecurity", title: "The Masked Warrior" },
  { primary: "insecurity", secondary: "logic", title: "The Overthinking Mind" },
  { primary: "insecurity", secondary: "chaos", title: "The Anxious Wanderer" },
  { primary: "insecurity", secondary: "empathy", title: "The Tender Soul" },
  { primary: "insecurity", secondary: "control", title: "The Careful Schemer" },
  { primary: "insecurity", secondary: "confidence", title: "The Hidden Flame" },
]

export const shakespeareanJudgments = [
  `Lo and behold, thou art a curious creature—torn betwixt reason and reckless whim!
Thou dost ponder as a scholar, yet act as a jester in moonlight.
Verily, thy choices betray a mind most cunning… and yet delightfully confused.`,

  `O misguided soul! Thou seekest control, yet embraceth chaos like a long-lost friend.
A paradox thou art—both architect and ruin of thine own tale.`,

  `Mark this well—thou art neither fool nor sage, but a delightful disaster of both.
Wisdom knocketh, yet thou hidest behind questionable decisions.`,

  `Behold! A spirit caught between the stars and the mud below!
Thy heart yearns for greatness, yet thy feet choose comfort's path.
'Tis not weakness—'tis the human condition, most entertainingly displayed.`,

  `Hark! The cosmos hath delivered unto me a puzzle most perplexing!
Thou wearest logic as a crown, yet thy soul dances to chaos's tune.
Fascinating contradiction, wrapped in mortal flesh.`,

  `Forsooth! Thou art a tapestry woven of contradictions most splendid!
Where others see confusion, I perceive... potential.
Or perhaps 'tis merely chaos. Time shall tell.`,
]

export const finalDuckLines = [
  "Thou art judged.",
  "I expected worse.",
  "Mildly disappointing… yet intriguing.",
  "You are chaos, dressed as logic.",
  "The duck has spoken.",
  "Remember this moment.",
  "We are not so different, you and I.",
  "I shall remember you. Perhaps.",
]

export function getRandomQuestions(count: number = 6): Question[] {
  const shuffled = [...questions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, questions.length))
}

export function calculateTraits(answers: Answer[]): Record<Trait, number> {
  const traits: Record<Trait, number> = {
    logic: 0,
    chaos: 0,
    empathy: 0,
    control: 0,
    confidence: 0,
    insecurity: 0,
  }

  answers.forEach((answer) => {
    Object.entries(answer.traits).forEach(([trait, value]) => {
      traits[trait as Trait] += value || 0
    })
  })

  return traits
}

export function getTopTraits(traits: Record<Trait, number>): { primary: Trait; secondary: Trait } {
  const sorted = Object.entries(traits).sort(([, a], [, b]) => b - a) as [Trait, number][]
  return {
    primary: sorted[0][0],
    secondary: sorted[1][0],
  }
}

export function getJudgmentTitle(primary: Trait, secondary: Trait): string {
  const found = judgmentTitles.find(
    (j) => j.primary === primary && j.secondary === secondary
  )
  return found?.title || "The Enigmatic One"
}

export function getRandomReaction(): string {
  return duckReactions[Math.floor(Math.random() * duckReactions.length)]
}

export function getRandomJudgment(): string {
  return shakespeareanJudgments[Math.floor(Math.random() * shakespeareanJudgments.length)]
}

export function getRandomFinalLine(): string {
  return finalDuckLines[Math.floor(Math.random() * finalDuckLines.length)]
}
