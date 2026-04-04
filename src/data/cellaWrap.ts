import type { Pattern } from '@/types/pattern'

const cellaWrap: Pattern = {
  id: 'cella-wrap',
  sku: '2422-254-8060',
  name: 'Cella Wrap',
  craft: 'knitting',
  category: 'wrap',
  difficulty: 'intermediate',
  designer: 'JoJo Knitwear | Hobbii Design',
  year: 2025,
  sizes: ['S/M', 'L/XL', '2XL/3XL'],
  ease: 'Fits chest 85–95 (95–110) 110–130 cm / 33.5–37.5 (37.5–43.25) 43.25–51.25"',
  measurements: [
    {
      label: 'Total length',
      unitCm: ['240', '255', '280'],
      unitInch: ['94.5"', '100.5"', '110.25"'],
    },
    {
      label: 'Width',
      unitCm: ['40', '44', '48'],
      unitInch: ['15.75"', '17.25"', '19"'],
    },
  ],
  materials: {
    yarns: [
      {
        id: 'yarn-baby-alpaca-05',
        brand: 'Copenhagen Fibers',
        name: 'Baby Alpaca Blend',
        colorCode: '05',
        colorName: 'Dusty Blue',
        colorHex: '#A8C0CC',
        fiber: '50% Alpaca, 35% Cotton, 15% Wool',
        weightGrams: 50,
        weightOz: 1.75,
        metersPerSkein: 110,
        yardsPerSkein: 120,
        quantitiesPerSize: [8, 8, 10],
      },
    ],
    tools: [
      { name: 'Circular needle 5 mm (US 8) — 40–60 cm', icon: '🪡' },
      { name: 'Circular needle 5.5 mm (US 9) — 40–60 cm', icon: '🪡' },
      { name: 'Circular needle 9 mm (US 13) — for cable purl rows', icon: '🪡' },
      { name: 'Cable needle', icon: '🪡' },
      { name: 'Stitch markers', icon: '🔶' },
    ],
  },
  gauge: {
    stitches: 15,
    rows: 26,
    needleOrHook: '5.5 mm (US 9)',
    stitch: 'Stockinette stitch',
  },
  abbreviations: [
    { short: 'st(s)', full: 'Stitch(es)' },
    { short: 'k', full: 'Knit' },
    { short: 'p', full: 'Purl' },
    { short: 'tbl', full: 'Through the back loop' },
    { short: 'RS', full: 'Right side' },
    { short: 'WS', full: 'Wrong side' },
    { short: 'sl1p', full: 'Slip 1 stitch purlwise' },
    { short: 'k2tog', full: 'Knit 2 stitches together (decrease)' },
    { short: 'co', full: 'Cast on' },
    { short: 'bo', full: 'Bind off' },
    { short: 'BOR', full: 'Beginning of round' },
    { short: 'wyif', full: 'With yarn in front' },
    { short: 'wyib', full: 'With yarn in back' },
  ],
  sections: [
    {
      id: 'first-sleeve',
      name: 'First Sleeve (Ribbing)',
      description: 'Worked in the round on 5 mm needles',
      instructions: [
        {
          id: 'sleeve1-co',
          type: 'step',
          label: 'Cast on',
          text: 'Using 5 mm needles, CO 42 (46) 50 sts. Place BOR marker and join in the round.',
        },
        {
          id: 'sleeve1-rib',
          type: 'round',
          label: 'Twisted rib',
          text: 'Work *k1tbl, p1* rib to end of round. Continue until ribbing measures 28 (30) 32 cm / 11 (11.75) 12.5". The ribbing forms the first sleeve.',
        },
      ],
    },
    {
      id: 'shawl-body',
      name: 'Shawl Body',
      description: 'Worked flat — cables with i-cord edges on 5.5 mm',
      instructions: [
        {
          id: 'shawl-increase',
          type: 'step',
          label: 'Increase row',
          text: 'Work back and forth from here. Change to 5.5 mm circular needle. On next RS row, increase 28 (32) 36 sts evenly across (pick up bar between 2 sts, k1tbl). Total: 70 (78) 86 sts.',
        },
        {
          id: 'shawl-setup',
          type: 'row',
          label: 'Chart setup',
          text: 'Row 1 (WS): P3, work chart to last 3 sts, sl1p wyif × 3 (i-cord edge). Row 2 (RS): K3, work chart to last 3 sts, sl1p wyib × 3 (i-cord edge).',
        },
        {
          id: 'shawl-note',
          type: 'note',
          text: 'The chart features a cable pattern. Cable purl rows (WS rows 1, 5, 9, 13 of the pattern repeat) are worked using 9 mm needles for a looser, more open stitch. Return to 5.5 mm for all other rows.',
        },
        {
          id: 'shawl-work',
          type: 'step',
          label: 'Work the shawl',
          text: 'Repeat rows 1–2 until the work measures approx. 210 (225) 250 cm / 82.75 (88.5) 98.5". Adjust length here by working more or fewer repeats.',
        },
        {
          id: 'shawl-decrease',
          type: 'step',
          label: 'Decrease row',
          text: 'On next RS row, decrease 28 (32) 36 sts evenly back to 42 (46) 50 sts: K6, *k2tog* × 21 (21) 22 times, k3, *k2tog* × 7 (11) 14 times, k to end.',
        },
      ],
    },
    {
      id: 'second-sleeve',
      name: 'Second Sleeve (Ribbing)',
      description: 'Worked in the round on 5 mm needles',
      instructions: [
        {
          id: 'sleeve2-join',
          type: 'step',
          label: 'Join in round',
          text: 'Change to 5 mm circular needle. Work in the round. Place BOR marker.',
        },
        {
          id: 'sleeve2-rib',
          type: 'round',
          label: 'Twisted rib',
          text: 'Work *k1tbl, p1* rib to end of round. Continue until ribbing measures 28 (30) 32 cm / 11 (11.75) 12.5". Bind off as established.',
        },
      ],
    },
    {
      id: 'finishing',
      name: 'Finishing',
      description: '',
      instructions: [
        {
          id: 'fin-weave',
          type: 'step',
          label: 'Weave in ends',
          text: 'Weave in all yarn ends.',
        },
        {
          id: 'fin-wash',
          type: 'step',
          label: 'Wash & dry',
          text: 'Wash according to yarn label. Dry by rolling in a towel — do NOT hang, as this prevents the ribbed hems from rolling up.',
        },
        {
          id: 'fin-wear',
          type: 'tip',
          text: 'To wear: wrap the shawl body around your torso like a cocoon and slip your arms through the ribbed sleeve tubes. The wrap can also be worn as a traditional shawl.',
        },
      ],
    },
  ],
  hashtags: ['#jojoknitwearxhobbii', '#hobbiidesign', '#hobbiicella'],
  buyUrl: 'https://shop.hobbii.com/cella-wrap',
  accentColor: '#4A8C7A',
  coverDescription: 'A hybrid shawl-sweater that wraps around the body like a cocoon, with ribbed sleeve tubes at each end. Features a cable-panelled body with i-cord edges in a soft alpaca blend. 3 sizes.',
}

export default cellaWrap
