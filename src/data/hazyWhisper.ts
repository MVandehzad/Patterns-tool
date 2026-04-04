import type { Pattern, RowSegment } from '@/types/pattern'

// Sleeve stitch counts are identical across all yoke rows — sizes 1-8
const SLEEVE: number[] = [9, 9, 11, 11, 11, 11, 13, 13]

// CO = [52,52,56,56,58,58,62,62] for sizes 1-8
// Row 1  RS · plain knit · no increases, no markers yet
// Sl1, knit to last stitch, p1.
const row1Seg: RowSegment[] = [
  { section: 'Left Edge', stitch: 'sl', counts: [1,1,1,1,1,1,1,1] },
  // body = CO − 2 edge sts
  { section: 'Body',      stitch: 'k',  counts: [50,50,54,54,56,56,60,60] },
  { section: 'Right Edge', stitch: 'p', counts: [1,1,1,1,1,1,1,1] },
]

// Row 2  WS · plain purl · "purl to end" means sl1 + purl all remaining
const row2Seg: RowSegment[] = [
  { section: 'Left Edge', stitch: 'sl', counts: [1,1,1,1,1,1,1,1] },
  // body = CO − 1 (sl edge only; last st included in purl-to-end)
  { section: 'Body',      stitch: 'p',  counts: [51,51,55,55,57,57,61,61] },
]

// Row 3  RS · k · +4 sts · markers PLACED here for the first time (PM not SM)
// Sl1, k1, M1R, PM, k9(sizes), PM, M1L, k30(sizes), M1R, PM, k9(sizes), PM, M1L, k1, p1
const row3Seg: RowSegment[] = [
  { section: 'Left Edge',    stitch: 'sl', counts: [1,1,1,1,1,1,1,1] },
  { section: 'Left Front',   stitch: 'k',  counts: [1,1,1,1,1,1,1,1],
    suffix: { increase: 'M1R' } },
  { section: 'Left Sleeve',  stitch: 'k',  counts: SLEEVE,
    prefix: { marker: true }, suffix: { marker: true } },
  { section: 'Back',         stitch: 'k',  counts: [30,30,30,30,32,32,32,32],
    prefix: { increase: 'M1L' }, suffix: { increase: 'M1R' } },
  { section: 'Right Sleeve', stitch: 'k',  counts: SLEEVE,
    prefix: { marker: true }, suffix: { marker: true } },
  { section: 'Right Front',  stitch: 'k',  counts: [1,1,1,1,1,1,1,1],
    prefix: { increase: 'M1L' } },
  { section: 'Right Edge',   stitch: 'p',  counts: [1,1,1,1,1,1,1,1] },
]

// Row 4  WS · p · +4 sts
// Sl1, p2, M1LP, SM, p9(sizes), SM, M1RP, p32(sizes), M1LP, SM, p9(sizes), SM, M1RP, p3
const row4Seg: RowSegment[] = [
  { section: 'Left Edge',    stitch: 'sl', counts: [1,1,1,1,1,1,1,1] },
  { section: 'Left Front',   stitch: 'p',  counts: [2,2,2,2,2,2,2,2],
    suffix: { increase: 'M1LP' } },
  { section: 'Left Sleeve',  stitch: 'p',  counts: SLEEVE,
    prefix: { marker: true }, suffix: { marker: true } },
  { section: 'Back',         stitch: 'p',  counts: [32,32,32,32,34,34,34,34],
    prefix: { increase: 'M1RP' }, suffix: { increase: 'M1LP' } },
  { section: 'Right Sleeve', stitch: 'p',  counts: SLEEVE,
    prefix: { marker: true }, suffix: { marker: true } },
  { section: 'Right Front',  stitch: 'p',  counts: [2,2,2,2,2,2,2,2],
    prefix: { increase: 'M1RP' } },
  { section: 'Right Edge',   stitch: 'p',  counts: [1,1,1,1,1,1,1,1] },
]

// Row 5  RS · k · +6 sts (double V-neck increases on both fronts)
// Sl1, M1R, k3, M1R, SM, k9(sizes), SM, M1L, k34(sizes), M1R, SM, k9(sizes), SM, M1L, k3, M1L, p1
const row5Seg: RowSegment[] = [
  { section: 'Left Edge',    stitch: 'sl', counts: [1,1,1,1,1,1,1,1],
    suffix: { increase: 'M1R' } },                          // first M1R before k3
  { section: 'Left Front',   stitch: 'k',  counts: [3,3,3,3,3,3,3,3],
    suffix: { increase: 'M1R' } },                          // second M1R before SM
  { section: 'Left Sleeve',  stitch: 'k',  counts: SLEEVE,
    prefix: { marker: true }, suffix: { marker: true } },
  { section: 'Back',         stitch: 'k',  counts: [34,34,34,34,36,36,36,36],
    prefix: { increase: 'M1L' }, suffix: { increase: 'M1R' } },
  { section: 'Right Sleeve', stitch: 'k',  counts: SLEEVE,
    prefix: { marker: true }, suffix: { marker: true } },
  { section: 'Right Front',  stitch: 'k',  counts: [3,3,3,3,3,3,3,3],
    prefix: { increase: 'M1L' }, suffix: { increase: 'M1L' } }, // M1L then p1
  { section: 'Right Edge',   stitch: 'p',  counts: [1,1,1,1,1,1,1,1] },
]

// Row 6  WS · p · +4 sts
// Sl1, p5, M1LP, SM, p9(sizes), SM, M1RP, p36(sizes), M1LP, SM, p9(sizes), SM, M1RP, p6
// "p6" at end = p5 right front + p1 right edge
const row6Seg: RowSegment[] = [
  { section: 'Left Edge',    stitch: 'sl', counts: [1,1,1,1,1,1,1,1] },
  { section: 'Left Front',   stitch: 'p',  counts: [5,5,5,5,5,5,5,5],
    suffix: { increase: 'M1LP' } },
  { section: 'Left Sleeve',  stitch: 'p',  counts: SLEEVE,
    prefix: { marker: true }, suffix: { marker: true } },
  { section: 'Back',         stitch: 'p',  counts: [36,36,36,36,38,38,38,38],
    prefix: { increase: 'M1RP' }, suffix: { increase: 'M1LP' } },
  { section: 'Right Sleeve', stitch: 'p',  counts: SLEEVE,
    prefix: { marker: true }, suffix: { marker: true } },
  { section: 'Right Front',  stitch: 'p',  counts: [5,5,5,5,5,5,5,5],
    prefix: { increase: 'M1RP' } },
  { section: 'Right Edge',   stitch: 'p',  counts: [1,1,1,1,1,1,1,1] },
]

// Row 7  RS · k · +4 sts
// Sl1, k6, M1R, SM, k9(sizes), SM, M1L, k38(sizes), M1R, SM, k9(sizes), SM, M1L, k6, p1
const row7Seg: RowSegment[] = [
  { section: 'Left Edge',    stitch: 'sl', counts: [1,1,1,1,1,1,1,1] },
  { section: 'Left Front',   stitch: 'k',  counts: [6,6,6,6,6,6,6,6],
    suffix: { increase: 'M1R' } },
  { section: 'Left Sleeve',  stitch: 'k',  counts: SLEEVE,
    prefix: { marker: true }, suffix: { marker: true } },
  { section: 'Back',         stitch: 'k',  counts: [38,38,38,38,40,40,40,40],
    prefix: { increase: 'M1L' }, suffix: { increase: 'M1R' } },
  { section: 'Right Sleeve', stitch: 'k',  counts: SLEEVE,
    prefix: { marker: true }, suffix: { marker: true } },
  { section: 'Right Front',  stitch: 'k',  counts: [6,6,6,6,6,6,6,6],
    prefix: { increase: 'M1L' } },
  { section: 'Right Edge',   stitch: 'p',  counts: [1,1,1,1,1,1,1,1] },
]

// Row 8  WS · p · +4 sts
// Sl1, p7, M1LP, SM, p9(sizes), SM, M1RP, p40(sizes), M1LP, SM, p9(sizes), SM, M1RP, p8
const row8Seg: RowSegment[] = [
  { section: 'Left Edge',    stitch: 'sl', counts: [1,1,1,1,1,1,1,1] },
  { section: 'Left Front',   stitch: 'p',  counts: [7,7,7,7,7,7,7,7],
    suffix: { increase: 'M1LP' } },
  { section: 'Left Sleeve',  stitch: 'p',  counts: SLEEVE,
    prefix: { marker: true }, suffix: { marker: true } },
  { section: 'Back',         stitch: 'p',  counts: [40,40,40,40,42,42,42,42],
    prefix: { increase: 'M1RP' }, suffix: { increase: 'M1LP' } },
  { section: 'Right Sleeve', stitch: 'p',  counts: SLEEVE,
    prefix: { marker: true }, suffix: { marker: true } },
  { section: 'Right Front',  stitch: 'p',  counts: [7,7,7,7,7,7,7,7],
    prefix: { increase: 'M1RP' } },
  { section: 'Right Edge',   stitch: 'p',  counts: [1,1,1,1,1,1,1,1] },
]

// Row 9  RS · k · +6 sts (double V-neck increases on both fronts)
// Sl1, M1R, k8, M1R, SM, k9(sizes), SM, M1L, k42(sizes), M1R, SM, k9(sizes), SM, M1L, k8, M1L, p1
const row9Seg: RowSegment[] = [
  { section: 'Left Edge',    stitch: 'sl', counts: [1,1,1,1,1,1,1,1],
    suffix: { increase: 'M1R' } },                          // first M1R before k8
  { section: 'Left Front',   stitch: 'k',  counts: [8,8,8,8,8,8,8,8],
    suffix: { increase: 'M1R' } },                          // second M1R before SM
  { section: 'Left Sleeve',  stitch: 'k',  counts: SLEEVE,
    prefix: { marker: true }, suffix: { marker: true } },
  { section: 'Back',         stitch: 'k',  counts: [42,42,42,42,44,44,44,44],
    prefix: { increase: 'M1L' }, suffix: { increase: 'M1R' } },
  { section: 'Right Sleeve', stitch: 'k',  counts: SLEEVE,
    prefix: { marker: true }, suffix: { marker: true } },
  { section: 'Right Front',  stitch: 'k',  counts: [8,8,8,8,8,8,8,8],
    prefix: { increase: 'M1L' }, suffix: { increase: 'M1L' } }, // M1L, then p1
  { section: 'Right Edge',   stitch: 'p',  counts: [1,1,1,1,1,1,1,1] },
]

// Row 10  WS · p · +4 sts
// Sl1, p10, M1LP, SM, p9(sizes), SM, M1RP, p44(sizes), M1LP, SM, p9(sizes), SM, M1RP, p11
const row10Seg: RowSegment[] = [
  { section: 'Left Edge',    stitch: 'sl', counts: [1,1,1,1,1,1,1,1] },
  { section: 'Left Front',   stitch: 'p',  counts: [10,10,10,10,10,10,10,10],
    suffix: { increase: 'M1LP' } },
  { section: 'Left Sleeve',  stitch: 'p',  counts: SLEEVE,
    prefix: { marker: true }, suffix: { marker: true } },
  { section: 'Back',         stitch: 'p',  counts: [44,44,44,44,46,46,46,46],
    prefix: { increase: 'M1RP' }, suffix: { increase: 'M1LP' } },
  { section: 'Right Sleeve', stitch: 'p',  counts: SLEEVE,
    prefix: { marker: true }, suffix: { marker: true } },
  { section: 'Right Front',  stitch: 'p',  counts: [10,10,10,10,10,10,10,10],
    prefix: { increase: 'M1RP' } },
  { section: 'Right Edge',   stitch: 'p',  counts: [1,1,1,1,1,1,1,1] },
]

const hazyWhisper: Pattern = {
  id: 'hazy-whisper-sweater',
  sku: '2591-254-7791',
  name: 'Hazy Whisper',
  craft: 'knitting',
  category: 'sweater',
  difficulty: 'intermediate',
  designer: 'Neringa Rūkė',
  year: 2026,
  sizes: ['1', '2', '3', '4', '5', '6', '7', '8'],
  ease: '5 cm / 2 inches positive ease',
  accentColor: '#8B6F5E',
  coverDescription: 'Top-down V-neck sweater in stockinette, worked with two strands held together for a dreamy drape.',

  measurements: [
    {
      label: 'Chest circumference',
      unitCm: ['87.5', '95', '103', '110.5', '120', '127.5', '135', '145'],
      unitInch: ['35', '38', '41.25', '44.25', '48', '51', '54', '58'],
    },
    {
      label: 'Length',
      unitCm: ['58', '58.5', '60', '60.5', '63', '64.5', '66.5', '68'],
      unitInch: ['23.25', '23.50', '24', '24.25', '25.25', '25.75', '26.50', '27.25'],
    },
    {
      label: 'Sleeve length (from armpit)',
      unitCm: ['52', '53', '53.5', '54.5', '55', '55.5', '56.5', '57'],
      unitInch: ['20.5', '20.75', '21', '21.5', '21.75', '22', '22.25', '22.5'],
    },
  ],

  materials: {
    yarns: [
      {
        id: 'merino-light-23',
        brand: 'COPENHAGEN Fibers',
        name: 'Merino Light',
        colorCode: '23',
        colorName: 'Warm Stone',
        colorHex: '#C9B49A',
        fiber: '100% Wool',
        weightGrams: 50,
        weightOz: 1.76,
        metersPerSkein: 235,
        yardsPerSkein: 157,
        quantitiesPerSize: [4, 5, 5, 6, 6, 7, 8, 9],
        notes: 'Hold together with Silk Mohair throughout',
      },
      {
        id: 'silk-mohair-23',
        brand: 'COPENHAGEN Fibers',
        name: 'Silk Mohair',
        colorCode: '23',
        colorName: 'Warm Stone',
        colorHex: '#D4C2AD',
        fiber: '75% Mohair, 25% Silk',
        weightGrams: 25,
        weightOz: 0.8,
        metersPerSkein: 200,
        yardsPerSkein: 218,
        quantitiesPerSize: [5, 6, 6, 8, 8, 9, 10, 11],
        notes: 'Hold together with Merino Light throughout',
      },
    ],
    tools: [
      { name: 'Circular needles 4 mm / US 6, 40 cm / 16"', icon: '🪡' },
      { name: 'Circular needles 4 mm / US 6, 60 cm / 24"', icon: '🪡' },
      { name: 'Circular needles 4 mm / US 6, 80 cm / 32"', icon: '🪡' },
      { name: 'Double pointed needles 4 mm / US 6', icon: '🪡' },
      { name: '6 stitch markers', icon: '🔵' },
      { name: '2 scrap pieces of cotton yarn', icon: '🧶' },
      { name: 'Tapestry needle', icon: '🪢' },
    ],
  },

  gauge: {
    stitches: 21,
    rows: 28,
    needleOrHook: '4 mm / US 6',
    stitch: 'Stockinette stitch',
  },

  abbreviations: [
    { short: 'St(s)', full: 'Stitch(es)' },
    { short: 'R', full: 'Row(s)' },
    { short: 'K', full: 'Knit' },
    { short: 'P', full: 'Purl' },
    { short: 'Sl', full: 'Slip' },
    { short: 'CO', full: 'Cast on' },
    { short: 'PM', full: 'Place marker' },
    { short: 'SM', full: 'Slip marker from left-hand to right-hand needle' },
    { short: 'M1L', full: 'Make one left — pick up bar front to back, knit through back loop' },
    { short: 'M1R', full: 'Make one right — pick up bar back to front, knit through front loop' },
    { short: 'K2togL', full: 'Knit next two stitches one at a time so second stitch is on top' },
    { short: 'K2togR', full: 'Knit next two stitches together so first stitch is on top' },
    { short: 'P2tog', full: 'Purl two stitches together' },
    { short: 'M1RP', full: 'Make one right purlwise — leans right on purl side' },
    { short: 'M1LP', full: 'Make one left purlwise — leans left on purl side' },
  ],

  sections: [
    {
      id: 'yoke',
      name: 'Yoke',
      description: 'The yoke is worked flat in three parts, then joined to work in the round. All sections are in stockinette stitch.',
      instructions: [
        {
          id: 'yoke-cast-on',
          type: 'step',
          label: 'Cast On',
          text: 'With 1 strand of each yarn held together, CO 52 (52) 56 (56) 58 (58) 62 (62) sts.',
          videoUrl: 'https://youtu.be/7X4pY87fZaE',
        },
        { id: 'yoke-row-1', type: 'row', label: 'Row 1', text: 'Sl1, knit to last stitch, p1.', segments: row1Seg },
        { id: 'yoke-row-2', type: 'row', label: 'Row 2', text: 'Sl1, purl to end.', segments: row2Seg },
        { id: 'yoke-row-3', type: 'row', label: 'Row 3 (increase)', text: 'Sl1, k1, M1R, PM, k9 (9) 11 (11) 11 (11) 13 (13), PM, M1L, k30 (30) 30 (30) 32 (32) 32 (32), M1R, PM, k9 (9) 11 (11) 11 (11) 13 (13), PM, M1L, k1, p1. 4 sts increased.', segments: row3Seg },
        { id: 'yoke-row-4', type: 'row', label: 'Row 4 (increase)', text: 'Sl1, p2, M1LP, SM, p9 (9) 11 (11) 11 (11) 13 (13), SM, M1RP, p32 (32) 32 (32) 34 (34) 34 (34), M1LP, SM, p9 (9) 11 (11) 11 (11) 13 (13), SM, M1RP, p3. 4 sts increased.', segments: row4Seg },
        { id: 'yoke-row-5', type: 'row', label: 'Row 5 (increase)', text: 'Sl1, M1R, k3, M1R, SM, k9 (9) 11 (11) 11 (11) 13 (13), SM, M1L, k34 (34) 34 (34) 36 (36) 36 (36), M1R, SM, k9 (9) 11 (11) 11 (11) 13 (13), SM, M1L, k3, M1L, p1. 6 sts increased.', segments: row5Seg },
        { id: 'yoke-row-6', type: 'row', label: 'Row 6 (increase)', text: 'Sl1, p5, M1LP, SM, p9 (9) 11 (11) 11 (11) 13 (13), SM, M1RP, p36 (36) 36 (36) 38 (38) 38 (38), M1LP, SM, p9 (9) 11 (11) 11 (11) 13 (13), SM, M1RP, p6. 4 sts increased.', segments: row6Seg },
        { id: 'yoke-row-7', type: 'row', label: 'Row 7 (increase)', text: 'Sl1, k6, M1R, SM, k9 (9) 11 (11) 11 (11) 13 (13), SM, M1L, k38 (38) 38 (38) 40 (40) 40 (40), M1R, SM, k9 (9) 11 (11) 11 (11) 13 (13), SM, M1L, k6, p1. 4 sts increased.', segments: row7Seg },
        { id: 'yoke-row-8', type: 'row', label: 'Row 8 (increase)', text: 'Sl1, p7, M1LP, SM, p9 (9) 11 (11) 11 (11) 13 (13), SM, M1RP, p40 (40) 40 (40) 42 (42) 42 (42), M1LP, SM, p9 (9) 11 (11) 11 (11) 13 (13), SM, M1RP, p8. 4 sts increased.', segments: row8Seg },
        { id: 'yoke-row-9', type: 'row', label: 'Row 9 (increase)', text: 'Sl1, M1R, k8, M1R, SM, k9 (9) 11 (11) 11 (11) 13 (13), SM, M1L, k42 (42) 42 (42) 44 (44) 44 (44), M1R, SM, k9 (9) 11 (11) 11 (11) 13 (13), SM, M1L, k8, M1L, p1. 6 sts increased.', segments: row9Seg },
        { id: 'yoke-row-10', type: 'row', label: 'Row 10 (increase)', text: 'Sl1, p10, M1LP, SM, p9 (9) 11 (11) 11 (11) 13 (13), SM, M1RP, p44 (44) 44 (44) 46 (46) 46 (46), M1LP, SM, p9 (9) 11 (11) 11 (11) 13 (13), SM, M1RP, p11. 4 sts increased.', segments: row10Seg },
        { id: 'yoke-p1-cont', type: 'note', text: 'Continue in stockinette until 16 (18) 20 (22) 24 (26) 28 (30) rows have been worked from Row 1. Work M1L and M1R increases every row at Front and Back. Work V-neck increases every 4th row.' },
        { id: 'yoke-p1-dist', type: 'tip', text: 'After Yoke Part 1: Left front – 19 (22) 24 (27) 29 (32) 34 (37) sts | Left sleeve – 9 (9) 11 (11) 11 (11) 13 (13) sts | Back – 58 (62) 66 (70) 76 (80) 84 (88) sts | Right sleeve – 9 (9) 11 (11) 11 (11) 13 (13) sts | Right front – 19 (22) 24 (27) 29 (32) 34 (37) sts' },
        { id: 'yoke-p2-intro', type: 'note', text: 'Yoke Part 2 — Continue in stockinette until 38 (36) 36 (34) 34 (32) 32 (30) rows have been worked. In this section increases are NOT worked at Front and Back — only at Sleeves: SM, M1L, k sleeve sts, M1R, SM. Continue V-neck increases every 4th row until 15 (15) 15 (15) 16 (16) 16 (16) increases per front.' },
        { id: 'yoke-p2-dist', type: 'tip', text: 'After Yoke Part 2: Left front – 29 (31) 33 (35) 38 (40) 42 (44) sts | Left sleeve – 47 (45) 47 (45) 45 (43) 45 (43) sts | Back – 58 (62) 66 (70) 76 (80) 84 (88) sts | Right sleeve – 47 (45) 47 (45) 45 (43) 45 (43) sts | Right front – 29 (31) 33 (35) 38 (40) 42 (44) sts' },
        { id: 'yoke-p3-join', type: 'note', text: 'Yoke Part 3 — Now worked in rounds. The V-neck is joined and increases are made across Front, Back and Sleeves.' },
        { id: 'yoke-rnd-1', type: 'round', label: 'Round 1 (increase)', text: 'Knit left front, M1R, PM (BOR), SM, knit left sleeve, SM, M1L, knit back, M1R, SM, knit right sleeve, SM, M1L, knit right front, knit left front. 4 sts increased.' },
        { id: 'yoke-rnd-2', type: 'round', label: 'Round 2 (increase)', text: 'SM, M1L, knit left sleeve, M1R, SM, knit back, SM, M1L, knit right sleeve, M1R, SM, knit front. 4 sts increased.' },
        { id: 'yoke-rnd-3', type: 'round', label: 'Round 3 (increase)', text: 'M1R, SM, knit left sleeve, SM, M1L, knit back, M1R, SM, knit right sleeve, SM, M1L, knit front. 4 sts increased.' },
        { id: 'yoke-rnd-4', type: 'round', label: 'Round 4 (increase)', text: 'SM, M1L, knit left sleeve, M1R, SM, knit back, SM, M1L, knit right sleeve, M1R, SM, knit front. 4 sts increased.' },
        { id: 'yoke-rnd-cont', type: 'note', text: 'Repeat last 2 rounds until 12 rounds total have been worked from Round 1.' },
        { id: 'yoke-p3-dist', type: 'tip', text: 'After Yoke Part 3: Front – 70 (74) 78 (82) 88 (92) 96 (100) sts | Left sleeve – 57 (59) 61 (63) 65 (67) 69 (71) sts | Back – 70 (74) 78 (82) 88 (92) 96 (100) sts | Right sleeve – 57 (59) 61 (63) 65 (67) 69 (71) sts' },
      ],
    },
    {
      id: 'body',
      name: 'Body',
      description: 'Worked in rounds in stockinette stitch from armhole to hem.',
      instructions: [
        { id: 'body-setup', type: 'step', label: 'Setup', text: 'Place one closed stitch marker at left armpit (BOR). Move sleeve stitches to scrap yarn on both sides. Cast on 22 (26) 30 (34) 38 (42) 46 (52) sts under each sleeve.', videoUrl: 'https://youtu.be/nhw1AgVHDic' },
        { id: 'body-total', type: 'tip', text: 'Total sts on needle: 184 (200) 216 (232) 252 (268) 284 (304)' },
        { id: 'body-work', type: 'note', text: 'Work straight in rounds until 86 (88) 90 (92) 96 (100) 104 (108) rounds have been worked from the first body round.' },
      ],
    },
    {
      id: 'hem',
      name: 'Hem',
      description: 'Ribbed hem band worked in the round.',
      instructions: [
        { id: 'hem-rib', type: 'note', text: 'Work in rib stitch (k1, p1) for 10 rounds from the first hem round.' },
        { id: 'hem-cast-off', type: 'step', label: 'Cast Off', text: 'Cut yarn leaving a tail 4× longer than sweater width. Work the Ruke cast-off in rounds.', videoUrl: 'https://youtu.be/eNxQ5sJDS3M' },
      ],
    },
    {
      id: 'sleeve',
      name: 'Sleeve',
      description: 'Worked in rounds in stockinette from armhole down, with decreases tapering the sleeve.',
      instructions: [
        { id: 'sleeve-setup', type: 'step', label: 'Setup', text: 'Place marker at middle of armpit (BOR). Move 57 (59) 61 (63) 65 (67) 69 (71) sleeve sts from scrap yarn onto 4 mm needles. Pick up 22 (26) 30 (34) 38 (42) 46 (52) sts under the sleeve.', videoUrl: 'https://youtu.be/n_Ne47cU2sU' },
        { id: 'sleeve-total', type: 'tip', text: 'Total sts on needle: 79 (85) 91 (97) 103 (109) 115 (123)' },
        { id: 'sleeve-rnd-2', type: 'round', label: 'Round 2', text: 'Knit to end, SM. Repeat a further 5 (4) 4 (3) 3 (3) 3 (2) times.' },
        { id: 'sleeve-dec', type: 'round', label: 'Decrease round', text: 'K1, k2togL, knit to 3 sts before end, k2togR, k1. 2 sts decreased.', videoUrl: 'https://youtu.be/1PgQDyBXuV4' },
        { id: 'sleeve-cont', type: 'note', text: 'Continue in stockinette until 136 (138) 140 (142) 144 (146) 148 (150) rounds total. Work decrease round every 8th (7th) 7th (6th) 6th (6th) 6th (5th) round.' },
        { id: 'sleeve-final', type: 'tip', text: 'Final sts: 45 (47) 51 (51) 55 (61) 67 (63). Sleeve measures 48.5 (49.5) 50 (50.5) 51.5 (52) 53 (53.5) cm.' },
      ],
    },
    {
      id: 'cuff',
      name: 'Cuff',
      description: 'Ribbed cuff to finish the sleeve.',
      instructions: [
        { id: 'cuff-rib', type: 'note', text: 'Work in rib stitch (k1, p1) for 10 rounds. Note: last 2 sts of first round are worked as p2tog.' },
        { id: 'cuff-cast-off', type: 'step', label: 'Cast Off', text: 'Cut yarn leaving a tail 4× longer than cuff circumference. Work the Ruke cast-off.', videoUrl: 'https://youtu.be/eNxQ5sJDS3M' },
      ],
    },
    {
      id: 'collar',
      name: 'Collar',
      description: 'Simple knit collar picked up around the neckline.',
      instructions: [
        { id: 'collar-pickup', type: 'step', label: 'Pick Up', text: 'With sweater facing you, pick up back sts, left shoulder sts, left front sts (3:2 ratio), right front sts (3:2 ratio), right shoulder sts. Place closed marker at center back.', videoUrl: 'https://youtu.be/fypFLBPrcTc' },
        { id: 'collar-work', type: 'note', text: 'Work 4 rounds in knit stitch.' },
        { id: 'collar-cast-off', type: 'step', label: 'Cast Off', text: 'Repeat the hem cast-off.' },
      ],
    },
    {
      id: 'finishing',
      name: 'Finishing',
      description: '',
      instructions: [
        { id: 'finishing-1', type: 'step', text: 'Weave in all ends.' },
        { id: 'finishing-2', type: 'step', text: 'Wash the sweater according to the yarn label instructions and block to the specified measurements.' },
      ],
    },
  ],

  hashtags: ['#NeringaRukexCOPENHAGENfibers', '#hobbii', '#COPENHAGENfibersHazyWhisper'],
  buyUrl: 'https://shop.hobbii.com/hazy-whisper-sweater',
}

export default hazyWhisper
