import type { Pattern } from '@/types/pattern'

const copperCrest: Pattern = {
  id: 'copper-crest',
  sku: '2591-254-1408',
  name: 'Copper Crest',
  craft: 'knitting',
  category: 'sweater',
  difficulty: 'intermediate',
  designer: 'Neringa Rūkė',
  year: 2026,
  sizes: ['1', '2', '3', '4', '5', '6', '7', '8'],
  ease: 'Designed to be worn fitted. Model (83 cm chest) wears size 2.',
  measurements: [
    {
      label: 'Chest circumference',
      unitCm: ['84', '91.5', '99', '106.5', '118', '125.5', '133.5', '141'],
      unitInch: ['33.5"', '36.5"', '39.5"', '42.75"', '47.25"', '50.25"', '53.25"', '56.5"'],
    },
    {
      label: 'Length',
      unitCm: ['54.5', '56', '61', '62.5', '67', '68.5', '73', '74.5'],
      unitInch: ['21.75"', '22.5"', '24.25"', '25"', '26.75"', '27.5"', '29.25"', '29.75"'],
    },
    {
      label: 'Sleeve length (from armpit)',
      unitCm: ['48.5', '50', '51.5', '53', '54.5', '56', '57.5', '59'],
      unitInch: ['19"', '19.75"', '20.25"', '20.75"', '21.5"', '22"', '22.75"', '23.25"'],
    },
  ],
  materials: {
    yarns: [
      {
        id: 'yarn-natural-wool-12',
        brand: 'COPENHAGEN Fibers',
        name: 'Natural Wool',
        colorCode: '12',
        colorName: 'Copper Brown',
        colorHex: '#B06A40',
        fiber: '100% Wool',
        weightGrams: 50,
        weightOz: 1.76,
        metersPerSkein: 91,
        yardsPerSkein: 99,
        quantitiesPerSize: [10, 10, 11, 13, 15, 17, 19, 20],
      },
    ],
    tools: [
      { name: 'Circular needles 4 mm, 40 cm / US 6', icon: '🪡' },
      { name: 'Circular needles 4 mm, 60 cm / US 6', icon: '🪡' },
      { name: 'Circular needles 4 mm, 80 cm / US 6', icon: '🪡' },
      { name: 'Double pointed needles 4 mm / US 6', icon: '🪡' },
      { name: '9 stitch markers', icon: '🔶' },
      { name: '2 scrap pieces of cotton yarn (stitch holders)', icon: '🧵' },
    ],
  },
  gauge: {
    stitches: 21,
    rows: 26,
    needleOrHook: '4 mm',
    stitch: 'Rib stitch (k2, p2), washed & blocked',
  },
  abbreviations: [
    { short: 'St(s)', full: 'Stitch(es)' },
    { short: 'R', full: 'Row(s) / Round(s)' },
    { short: 'K', full: 'Knit' },
    { short: 'P', full: 'Purl' },
    { short: 'Sl', full: 'Slip' },
    { short: 'CO', full: 'Cast on' },
    { short: 'PM', full: 'Place marker' },
    { short: 'SM', full: 'Slip marker from left to right needle' },
    { short: 'M1L', full: 'Make one left: pick up bar between sts front to back, knit through back loop' },
    { short: 'M1R', full: 'Make one right: pick up bar between sts back to front, knit through front loop' },
    { short: 'K2togL', full: 'Knit next 2 sts together so the second stitch is on top (left-leaning)' },
    { short: 'K2togR', full: 'Knit next 2 sts together so the first stitch is on top (right-leaning)' },
  ],
  sections: [
    {
      id: 'collar',
      name: 'Collar',
      description: 'Worked in the round in rib stitch — 20 rounds',
      instructions: [
        {
          id: 'collar-co',
          type: 'step',
          label: 'Cast on',
          text: 'CO 80 (80) 80 (80) 96 (96) 96 (96) sts. Join in the round.',
          videoUrl: 'https://youtu.be/7X4pY87fZaE',
        },
        {
          id: 'collar-rib',
          type: 'round',
          label: 'Rib stitch',
          text: 'Round 1: PM, [k2, p2] to marker, SM. Continue in k2, p2 rib until 20 rounds are completed counting from cast-on.',
        },
      ],
    },
    {
      id: 'yoke',
      name: 'Yoke',
      description: 'Top-down raglan in rib stitch — increases every odd round',
      instructions: [
        {
          id: 'yoke-setup',
          type: 'note',
          text: 'The yoke uses 8 raglan markers (4 pairs of 2) defining: 2 front sections, 2 sleeve sections, 1 back section, and 4 × 2-stitch raglan columns. M1R and M1L are worked immediately outside each raglan pair on every odd round (+8 sts per increase round).',
        },
        {
          id: 'yoke-r1',
          type: 'round',
          label: 'Round 1 (increase)',
          text: 'M1R, PM (BOR), SM, k2, PM, M1L, p2, [k2, p2] 3 (3) 3 (3) 4 (4) 4 (4) times, M1R, PM, k2, PM, M1L, p2, [k2, p2] 5 (5) 5 (5) 6 (6) 6 (6) times, M1R, PM, k2, PM, M1L, p2, [k2, p2] 3 (3) 3 (3) 4 (4) 4 (4) times, M1R, PM, k2, PM, M1L, p2, [k2, p2] 5 (5) 5 (5) 6 (6) 6 (6) times, k1. +8 sts.',
          videoUrl: 'https://youtu.be/5SHX7VQFrtM',
        },
        {
          id: 'yoke-r2',
          type: 'round',
          label: 'Round 2 (plain)',
          text: 'Work all stitches in established k2, p2 rib, slipping markers.',
        },
        {
          id: 'yoke-r3',
          type: 'round',
          label: 'Round 3 (increase)',
          text: 'M1R, SM, k2, SM, M1L — work across each section in rib, M1R before each raglan pair and M1L after. +8 sts.',
        },
        {
          id: 'yoke-continue',
          type: 'note',
          text: 'Continue: increase every odd round, work even on every even round. Work until 56 (56) 64 (64) 72 (72) 80 (80) total rounds from Round 1.',
        },
        {
          id: 'yoke-final-dist',
          type: 'tip',
          label: 'Final stitch distribution',
          text: 'Front: 78 (78) 86 (86) 98 (98) 106 (106) sts + 2 raglan. Left sleeve: 70 (70) 78 (78) 90 (90) 98 (98) sts + 2 raglan. Back: 78 (78) 86 (86) 98 (98) 106 (106) sts + 2 raglan. Right sleeve: 70 (70) 78 (78) 90 (90) 98 (98) sts + 2 raglan.',
        },
      ],
    },
    {
      id: 'body',
      name: 'Body',
      description: 'Worked in the round — straight in rib stitch',
      instructions: [
        {
          id: 'body-divide',
          type: 'step',
          label: 'Divide sleeves',
          text: 'Place 70 (70) 78 (78) 90 (90) 98 (98) sts from each sleeve onto scrap yarn. Add raglan sts to body. CO 6 (14) 14 (22) 22 (30) 30 (38) sts under each sleeve (underarm bridge).',
          videoUrl: 'https://youtu.be/nhw1AgVHDic',
        },
        {
          id: 'body-total',
          type: 'note',
          text: 'Total body stitches: 176 (192) 208 (224) 248 (264) 280 (296) sts. Place one stitch marker at the middle of the left armpit (BOR).',
        },
        {
          id: 'body-work',
          type: 'round',
          label: 'Body straight',
          text: 'Work in k2, p2 rib pattern straight until 66 (70) 74 (78) 82 (86) 90 (94) rounds have been completed from Round 1.',
        },
        {
          id: 'body-bo',
          type: 'step',
          label: 'Cast off',
          text: 'Cut yarn leaving a tail 4× the body width. Work the Ruke cast-off in rounds.',
          videoUrl: 'https://youtu.be/eNxQ5sJDS3M',
        },
      ],
    },
    {
      id: 'sleeves',
      name: 'Sleeves',
      description: 'Worked in the round from armhole — make both',
      instructions: [
        {
          id: 'sleeve-setup',
          type: 'step',
          label: 'Pick up sts',
          text: 'Return 70 (70) 78 (78) 90 (90) 98 (98) sleeve sts to needle. Pick up 6 (14) 14 (22) 22 (30) 30 (38) underarm sts. Place BOR marker in the middle of the underarm sts.',
          videoUrl: 'https://youtu.be/4F_5N3YNHeU',
        },
        {
          id: 'sleeve-total',
          type: 'note',
          text: 'Total sleeve sts: 76 (84) 92 (100) 112 (120) 128 (136).',
        },
        {
          id: 'sleeve-plain',
          type: 'round',
          label: 'Plain rounds before first decrease',
          text: 'Sizes 1–4: Work 4 plain rounds. Sizes 5–6: Work 3 plain rounds. Sizes 7–8: Work 2 plain rounds.',
        },
        {
          id: 'sleeve-dec',
          type: 'round',
          label: 'Decrease round',
          text: 'K2togR, work in rib to last 2 sts, K2togL, SM. −2 sts. Continue decreasing in every 5th (5th) 5th (5th) 4th (4th) 3rd (3rd) round.',
          videoUrl: 'https://youtu.be/1PgQDyBXuV4',
        },
        {
          id: 'sleeve-total-rounds',
          type: 'note',
          text: 'Work until 90 (110) 130 (120) 136 (144) 120 (126) total sleeve rounds. Final sleeve sts: 40 (40) 40 (40) 44 (48) 48 (52).',
        },
        {
          id: 'sleeve-straight',
          type: 'round',
          label: 'Straight to cuff',
          text: 'Continue in rib without decreases until 126 (130) 134 (138) 142 (146) 150 (154) total rounds from Round 1.',
        },
        {
          id: 'sleeve-bo',
          type: 'step',
          label: 'Cast off',
          text: 'Cut yarn leaving a 4× tail. Work the Ruke cast-off in rounds. Repeat for second sleeve.',
          videoUrl: 'https://youtu.be/eNxQ5sJDS3M',
        },
      ],
    },
    {
      id: 'finishing',
      name: 'Finishing',
      description: 'Final steps',
      instructions: [
        {
          id: 'fin-weave',
          type: 'step',
          label: 'Weave in ends',
          text: 'Weave in all yarn ends securely.',
        },
        {
          id: 'fin-wash',
          type: 'step',
          label: 'Wash & block',
          text: 'Wash according to yarn label instructions. Block to specified measurements.',
        },
      ],
    },
  ],
  /**
   * Raglan yoke construction metadata.
   *
   * Round order from BOR: Right Sleeve → Front → Left Sleeve → Back
   *
   * Starting counts (before any increase rounds):
   *   Sizes 1–4 (CO 80): sleeve=14, front/back=22  →  8 + 28 + 44 = 80 ✓
   *   Sizes 5–8 (CO 96): sleeve=18, front/back=26  →  8 + 36 + 52 = 96 ✓
   *
   * Increases fire on every ODD round (rounds 1, 3, 5, …):
   *   After round N: increasesElapsed = ceil(N/2)
   *   Each section grows by +2 per increase round (M1R left + M1L right).
   *
   * Final yoke counts (size 1, 56 rounds → 28 increase rounds):
   *   Sleeve: 14 + 28×2 = 70 ✓   Front/Back: 22 + 28×2 = 78 ✓
   */
  constructionMeta: {
    type: 'raglan',
    sections: [
      { label: 'R Sleeve', colorHint: '#00B9CD' },
      { label: 'Front',    colorHint: '#B06A40' },
      { label: 'L Sleeve', colorHint: '#00B9CD' },
      { label: 'Back',     colorHint: '#8A4E2A' },
    ],
    raglansPerJoint: 2,
    // [sizeIndex 0-7][sectionIndex 0-3]
    startCounts: [
      [14, 22, 14, 22], // size 1
      [14, 22, 14, 22], // size 2
      [14, 22, 14, 22], // size 3
      [14, 22, 14, 22], // size 4
      [18, 26, 18, 26], // size 5
      [18, 26, 18, 26], // size 6
      [18, 26, 18, 26], // size 7
      [18, 26, 18, 26], // size 8
    ],
    increaseFrequency: 2, // every other round (odd rounds only)
  },
  hashtags: ['#NeringaRukexCOPENHAGENfibers', '#hobbii', '#COPENHAGENfibersCopperCrest'],
  buyUrl: 'https://shop.hobbii.com/copper-crest-sweater',
  coverImage: 'https://hobbii.dk/cdn/shop/files/20251126-DSC06997_0943ed00-a069-482a-bd4f-ac84ea139f59.jpg?v=1772542213',
  images: [
    'https://hobbii.dk/cdn/shop/files/20251126-DSC06997_0943ed00-a069-482a-bd4f-ac84ea139f59.jpg?v=1772542213',
    'https://hobbii.dk/cdn/shop/files/20251126-DSC07005_c9d2f7a7-662d-4e2c-a4f7-43d3b7ad4d9d.jpg?v=1772542213',
    'https://hobbii.dk/cdn/shop/files/20251126-DSC07003_d3294987-67fd-49b4-b9b8-53e701ebf8d1.jpg?v=1772542214',
    'https://hobbii.dk/cdn/shop/files/20251123-DSC06743_e4ace603-2534-49f7-aaf6-3c819e2988b3.jpg?v=1772542214',
    'https://hobbii.dk/cdn/shop/files/20251123-DSC06765_feb18550-b867-44c8-a523-f458de659729.jpg?v=1772542214',
    'https://hobbii.dk/cdn/shop/files/20251123-DSC06758_7ac97aa2-649b-4e49-8e58-905a4027505f.jpg?v=1772542214',
    'https://hobbii.dk/cdn/shop/files/20251123-DSC06746_5b4c68ca-c443-4655-bfd5-3f2202777624.jpg?v=1772542214',
    'https://hobbii.dk/cdn/shop/files/20251123-DSC06751_e2b75f29-1962-42c5-a28e-23d3285ee6e9.jpg?v=1772542214',
    'https://hobbii.dk/cdn/shop/files/20251123-DSC06761_161530b9-9f97-4c4a-988d-2cea095b266d.jpg?v=1772542214',
    'https://hobbii.dk/cdn/shop/files/20251123-DSC06762_78eb2b06-5a75-4920-92b2-f4422f5dcb5e.jpg?v=1772542214',
  ],
  accentColor: '#B06A40',
  coverDescription: 'A fitted top-down raglan sweater worked entirely in a k2, p2 rib structure — no separate hem, cuff or neckline. The continuous rib creates a sleek, minimal silhouette perfect for layering. 8 sizes.',
}

export default copperCrest
