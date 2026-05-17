export type RegretLevel = 'low' | 'medium' | 'high';

export interface BarberCard {
  style: string;
  top: string;
  sides: string;
  front: string;
  back: string;
  avoid: string;
  note: string;
}

/** Broad cut family — used for history-based recommendation adjustments. */
export type HaircutFamily = 'fringe' | 'crop' | 'medium' | 'fade' | 'buzz';

export interface Haircut {
  id: string;
  name: string;
  short: string;
  fit: number;
  regret: RegretLevel;
  maint: string;
  effort: string;
  tag: string | null;
  family: HaircutFamily;
  why: string;
  goodFor: string[];
  avoidIf: string[];
  barber: BarberCard;
}

export const HAIRCUTS: Haircut[] = [
  {
    id: 'fringe-low-taper',
    name: 'Textured Fringe + Low Taper',
    short: 'Modern, school-safe, low effort.',
    fit: 94,
    regret: 'low',
    maint: 'Low–Medium',
    effort: '2 min daily',
    tag: 'Recommended',
    family: 'fringe',
    why: 'Works with your oval face and medium-thick hair. Keeps proportion balanced and avoids the face looking too long.',
    goodFor: [
      'Oval / round face shapes',
      'Medium or thick hair',
      'School-friendly',
      'Wants modern but safe',
    ],
    avoidIf: [
      'You want zero hair on forehead',
      'You want a very formal cut',
      'You want zero styling',
    ],
    barber: {
      style: 'Textured Fringe with Low Taper',
      top: 'Keep 5–6 cm length. Point-cut for texture. Do NOT cut shorter than 4 cm.',
      sides: 'Low taper. Start the fade at the temple, no higher. Keep it natural — not skin.',
      front: 'Soft textured fringe, slightly swept. Do not cut straight across.',
      back: 'Natural taper into the neckline. Clean line, not blocked.',
      avoid: 'High fade • Skin fade • Hard part • Bowl fringe • Cutting top under 4 cm',
      note: 'Keep weight on top. The fringe is the focal point.',
    },
  },
  {
    id: 'french-crop',
    name: 'French Crop',
    short: 'Sharp, clean, almost no styling.',
    fit: 89,
    regret: 'low',
    maint: 'Low',
    effort: '< 1 min',
    tag: 'Easy mode',
    family: 'crop',
    why: 'Short top with a defined front edge — clean for school, no daily styling.',
    goodFor: ['Straight or wavy hair', "Don't want to style", 'Like a sharp front edge'],
    avoidIf: ['You want longer hair', 'Very curly / coily hair', 'You hate forehead hair'],
    barber: {
      style: 'French Crop',
      top: '2.5–3.5 cm on top. Texture lightly with scissors.',
      sides: 'Mid taper, scissor blend at temple. No skin.',
      front: 'Cut a straight fringe edge across forehead, 1 cm above brow.',
      back: 'Tapered, natural neckline.',
      avoid: 'Skin fade • Long top • Curtain fringe • Disconnected sides',
      note: 'The straight front edge is the signature — do not soften it.',
    },
  },
  {
    id: 'messy-medium',
    name: 'Messy Medium Cut',
    short: 'Relaxed, longer, daily styling.',
    fit: 84,
    regret: 'medium',
    maint: 'Medium',
    effort: '4–5 min daily',
    tag: null,
    family: 'medium',
    why: 'Works if you want a relaxed look with movement. Needs daily product and styling.',
    goodFor: ['Wavy hair', 'Like longer styles', 'Confident with styling'],
    avoidIf: ["You're lazy in the morning", 'Hate using product', 'Want a clean look'],
    barber: {
      style: 'Messy Medium Cut',
      top: 'Keep 7–9 cm. Heavy texturizing. Leave length, do not thin out.',
      sides: 'Scissor-cut sides, blended into top. No taper, no fade.',
      front: 'Long fringe past brow, swept loose.',
      back: 'Long over the collar, soft neckline.',
      avoid: 'Fade • Taper • Cutting shorter than 7 cm on top • Thinning shears',
      note: 'This is a scissor cut only. No clippers needed.',
    },
  },
  {
    id: 'mid-fade-pomp',
    name: 'Mid Fade + Loose Pomp',
    short: 'Stronger contrast, more presence.',
    fit: 78,
    regret: 'medium',
    maint: 'Medium',
    effort: '3 min daily',
    tag: 'Bold',
    family: 'fade',
    why: 'Bolder look that frames the face. Higher contrast, needs touch-ups every 3 weeks.',
    goodFor: ['You want presence', 'Thick hair', 'OK with shorter cycles'],
    avoidIf: [
      'Want low maintenance',
      "Don't like high contrast",
      'School has fade rules',
    ],
    barber: {
      style: 'Mid Fade with Loose Pompadour',
      top: 'Keep 6–7 cm. Cut for swept-back direction.',
      sides: 'Mid fade — start at top of ear. Skin OK at the lowest point.',
      front: 'No fringe. Swept up and back, loose hold.',
      back: 'Faded into clean neckline.',
      avoid: 'High fade • Hard part • Slick wet look • Cutting top below 5 cm',
      note: 'Use matte product, not gel. Loose volume, not stiff.',
    },
  },
  {
    id: 'buzz-1',
    name: 'Buzz #1',
    short: 'Reset button.',
    fit: 62,
    regret: 'high',
    maint: 'Low',
    effort: '0 min',
    tag: null,
    family: 'buzz',
    why: "It's a haircut, but probably not the one you want. Saved here in case you want to hit reset.",
    goodFor: ['Summer', 'Reset', 'Hate styling'],
    avoidIf: ['You want anything stylish', 'Cold weather', 'Round face'],
    barber: {
      style: 'Buzz #1 All Over',
      top: '#1 clipper guard, all over.',
      sides: '#1, blended into the top — no fade.',
      front: 'No fringe. Buzz to the hairline.',
      back: 'Natural taper into the neck.',
      avoid: 'Fade • Going below #1 • Lining the hairline too sharp',
      note: 'Be sure before you sit down. Grows back slow.',
    },
  },
];

export interface QuizOption {
  v: string;
  label: string;
  sub?: string;
}

export interface QuizStep {
  id: 'hair' | 'problem' | 'style' | 'maint';
  title: string;
  subtitle: string;
  multi?: boolean;
  options: QuizOption[];
  second?: { label: string; options: QuizOption[] };
}

export const QUIZ: QuizStep[] = [
  {
    id: 'hair',
    title: "What's your hair like?",
    subtitle: 'Pick the closest match.',
    options: [
      { v: 'straight', label: 'Straight' },
      { v: 'wavy', label: 'Wavy' },
      { v: 'curly', label: 'Curly' },
      { v: 'coily', label: 'Coily' },
    ],
    second: {
      label: 'Thickness',
      options: [
        { v: 'thin', label: 'Thin' },
        { v: 'medium', label: 'Medium' },
        { v: 'thick', label: 'Thick' },
      ],
    },
  },
  {
    id: 'problem',
    title: "What's gone wrong before?",
    subtitle: 'Pick all that apply.',
    multi: true,
    options: [
      { v: 'unsure', label: "I don't know what suits me" },
      { v: 'short', label: 'Barber cuts too short' },
      { v: 'days', label: 'Looks bad after a few days' },
      { v: 'explain', label: "I can't explain what I want" },
      { v: 'stylish', label: 'I want a more stylish look' },
    ],
  },
  {
    id: 'style',
    title: 'What look do you want?',
    subtitle: 'Pick one. You can change it later.',
    options: [
      { v: 'clean', label: 'Clean' },
      { v: 'casual', label: 'Casual' },
      { v: 'trendy', label: 'Trendy' },
      { v: 'sporty', label: 'Sporty' },
      { v: 'school', label: 'School-friendly' },
      { v: 'bold', label: 'Bold' },
    ],
  },
  {
    id: 'maint',
    title: 'How much daily effort?',
    subtitle: 'Be honest about your mornings.',
    options: [
      { v: 'low', label: 'Low', sub: '< 1 min, no product' },
      { v: 'med', label: 'Medium', sub: '2–5 min, light product' },
      { v: 'high', label: 'High', sub: "I'll do whatever it takes" },
    ],
  },
];
