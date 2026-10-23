// Lumen Museum of Art History — shared content & data layer
// All artwork, era, tour, and audio-guide data lives here so the five
// feature components stay presentation-only.

export interface HeroArtwork {
  id: string;
  title: string;
  artist: string;
  year: string;
  period: string;
  medium: string;
  image: string;
  caption: string;
}

export const heroArtworks: HeroArtwork[] = [
  {
    id: "renaissance",
    title: "Lady with the Emerald Veil",
    artist: "Workshop of Florentine Masters",
    year: "c. 1488",
    period: "High Renaissance",
    medium: "Oil on poplar panel",
    image: "/gallery/hero/hero-renaissance.png",
    caption:
      "A study in sfumato — the soft, smoke-like transition of light and shadow that defined the late 15th century Florentine school.",
  },
  {
    id: "baroque",
    title: "The Banquet of Shadows",
    artist: "Attributed to a Caravaggisti",
    year: "c. 1612",
    period: "Italian Baroque",
    medium: "Oil on canvas",
    image: "/gallery/hero/hero-baroque.png",
    caption:
      "Chiaroscuro as theatre: a single candle source carves drama from darkness, a hallmark of the Roman Baroque.",
  },
  {
    id: "impressionism",
    title: "Garden of the Lily Pond",
    artist: "After Claude Monet",
    year: "c. 1899",
    period: "Late Impressionism",
    medium: "Oil on canvas",
    image: "/gallery/hero/hero-impressionism.png",
    caption:
      "Light becomes subject. Broken colour and visible brushwork dissolve the boundary between the observed and the felt.",
  },
  {
    id: "modern",
    title: "Field of Contemplation",
    artist: "Modernist School",
    year: "1957",
    period: "Abstract Expressionism",
    medium: "Oil and pigment on canvas",
    image: "/gallery/hero/hero-modern.png",
    caption:
      "Suspended fields of colour invite a meditative, almost religious reading of the picture plane.",
  },
];

export interface StillLifeDetail {
  id: string;
  label: string;
  description: string;
  // position as a percentage of the source image (x right, y down)
  x: number;
  y: number;
}

export const stillLifeArtwork = {
  image: "/gallery/still-life.png",
  title: "Abundance and Vanitas",
  artist: "Dutch Golden Age, circle of Willem Kalf",
  year: "c. 1660",
  medium: "Oil on oak panel",
  width: 1344,
  height: 768,
  details: [
    {
      id: "goblet",
      label: "Silver-gilt Nautilus Cup",
      description:
        "A virtuoso piece of goldsmithing — the shell mounted in silver recounts the era's fascination with naturalia and the exotic reaches of global trade.",
    },
    {
      id: "drapery",
      label: "Crimson Velvet Drapery",
      description:
        "Kalf's signature folds: crimson lake over a lead-white underpainting, catching and releasing light to give the cloth its weighty fall.",
    },
    {
      id: "fruit",
      label: "Peel of the Peach",
      description:
        "A single droplet of juice, rendered with a white highlight over translucent glazes — a meditation on perishable beauty central to the vanitas tradition.",
    },
    {
      id: "feather",
      label: "Peacock Feather",
      description:
        "An iridescent interplay of green, gold and blue. Pigments of verdigris and lead-tin yellow are layered wet-into-wet to mimic the eye of the feather.",
    },
  ] as StillLifeDetail[],
};

export interface EraCard {
  id: string;
  name: string;
  years: string;
  startYear: number; // for proportional width on the axis
  endYear: number;
  region: string;
  summary: string;
  hallmarks: string[];
  image: string;
}

export const eras: EraCard[] = [
  {
    id: "gothic",
    name: "Gothic",
    years: "1140 – 1500",
    startYear: 1140,
    endYear: 1500,
    region: "Northern Europe",
    summary:
      "An architecture of aspiration. Pointed arches, ribbed vaults and stained glass drew the eye — and the spirit — heavenward. Painting followed suit with luminous altar panels of gilded gold-leaf.",
    hallmarks: [
      "Pointed arch & flying buttress",
      "Stained-glass light",
      "Illuminated manuscripts",
      "Gold-leaf altar panels",
    ],
    image: "/gallery/era/era-gothic.png",
  },
  {
    id: "renaissance",
    name: "Renaissance",
    years: "1400 – 1600",
    startYear: 1400,
    endYear: 1600,
    region: "Italy & the Low Countries",
    summary:
      "The rebirth of classical reason. Linear perspective, anatomical study, and the rediscovery of antiquity produced a harmonious, human-centred art that still defines how we picture the world.",
    hallmarks: [
      "Linear perspective",
      "Sfumato & chiaroscuro",
      "Anatomical realism",
      "Classical mythology",
    ],
    image: "/gallery/era/era-renaissance.png",
  },
  {
    id: "baroque",
    name: "Baroque",
    years: "1600 – 1750",
    startYear: 1600,
    endYear: 1750,
    region: "Italy, Spain, Flanders",
    summary:
      "Art as spectacle. Sweeping diagonals, raking light and theatrical emotion served both the Church's Counter-Reformation and the absolutist courts of Europe.",
    hallmarks: [
      "Tenebrism & chiaroscuro",
      "Spiral compositions",
      "Emotional theatricality",
      "Sensuous realism",
    ],
    image: "/gallery/era/era-baroque.png",
  },
  {
    id: "rococo",
    name: "Rococo",
    years: "1700 – 1780",
    startYear: 1700,
    endYear: 1780,
    region: "France",
    summary:
      "The art of the boudoir and the garden fête. Pastel palettes, asymmetrical shellwork (rocaille) and aristocratic leisure defined a period of refined, intimate decoration.",
    hallmarks: [
      "Pastel palette",
      "Rocaille ornament",
      "Fêtes galantes",
      "Asymmetry & lightness",
    ],
    image: "/gallery/era/era-rococo.png",
  },
  {
    id: "neoclassicism",
    name: "Neoclassicism",
    years: "1760 – 1840",
    startYear: 1760,
    endYear: 1840,
    region: "France & Rome",
    summary:
      "A return to the noble simplicity of antiquity. Excavations at Pompeii and the ideals of the Enlightenment fuelled a stern, moralising art of clean lines and civic virtue.",
    hallmarks: [
      "Archaeological antiquity",
      "Civic virtue & stoicism",
      "Smooth contour & finish",
      "Cool marble palette",
    ],
    image: "/gallery/era/era-neoclassicism.png",
  },
  {
    id: "romanticism",
    name: "Romanticism",
    years: "1780 – 1850",
    startYear: 1780,
    endYear: 1850,
    region: "Britain, France, Germany",
    summary:
      "The sublime and the terrible. Against Neoclassical restraint, the Romantics prized feeling, the individual, and the overwhelming power of nature and history.",
    hallmarks: [
      "The sublime & terrifying",
      "Painterly turbulence",
      "National myth & history",
      "The solitary figure",
    ],
    image: "/gallery/era/era-romanticism.png",
  },
  {
    id: "impressionism",
    name: "Impressionism",
    years: "1860 – 1890",
    startYear: 1860,
    endYear: 1890,
    region: "France",
    summary:
      "Painting moved outdoors. Premixed colours in tubes, the camera, and the railway let artists chase fleeting light in the open air, breaking colour into separate, visible touches.",
    hallmarks: [
      "Plein-air practice",
      "Broken colour & touch",
      "Modern life subject",
      "Synthetic cadmiums",
    ],
    image: "/gallery/era/era-impressionism.png",
  },
  {
    id: "modern",
    name: "Modern & Contemporary",
    years: "1900 – Today",
    startYear: 1900,
    endYear: 2025,
    region: "Global",
    summary:
      "A century of rupture. From abstraction to conceptual practice, art interrogated its own medium — colour, form, the gallery itself — and embraced a global, plural present.",
    hallmarks: [
      "Pure abstraction",
      "Readymade & collage",
      "Conceptual practice",
      "Global pluralism",
    ],
    image: "/gallery/era/era-modern.png",
  },
];

export interface TourWing {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  description: string;
  // hotspots relative to the panorama's left edge as a percentage
  hotspots: {
    id: string;
    label: string;
    x: number; // percentage 0-100
    targetWing: string; // id of wing to teleport to
    direction: string;
  }[];
}

export const tourWings: TourWing[] = [
  {
    id: "hall-1",
    name: "Hall I — The Classical Galleries",
    subtitle: "Renaissance & Baroque",
    image: "/gallery/tour/tour-hall-1.png",
    description:
      "Vaulted ceilings, marble floors and the warm glow of gilded frames. The grand axial hall that anchors the museum's pre-1800 collection.",
    hotspots: [
      {
        id: "to-hall-3",
        label: "Continue to the Modern Wing",
        x: 88,
        targetWing: "hall-3",
        direction: "East",
      },
      {
        id: "to-hall-2",
        label: "Step into the Sculpture Gallery",
        x: 12,
        targetWing: "hall-2",
        direction: "West",
      },
    ],
  },
  {
    id: "hall-2",
    name: "Hall II — The Sculpture Gallery",
    subtitle: "Marble & Plaster",
    image: "/gallery/tour/tour-hall-3.png",
    description:
      "A long enfilade of white marble on pedestals, lit from arched windows. The cast collection traces the human figure from Praxiteles to Rodin.",
    hotspots: [
      {
        id: "to-hall-1",
        label: "Return to the Classical Galleries",
        x: 88,
        targetWing: "hall-1",
        direction: "East",
      },
    ],
  },
  {
    id: "hall-3",
    name: "Hall III — The Modern Wing",
    subtitle: "20th Century & Beyond",
    image: "/gallery/tour/tour-hall-2.png",
    description:
      "White walls, polished concrete and the cool wash of skylights. A minimalist container for the ruptures and reinventions of the last century.",
    hotspots: [
      {
        id: "to-hall-1",
        label: "Return to the Classical Galleries",
        x: 12,
        targetWing: "hall-1",
        direction: "West",
      },
    ],
  },
];

export interface AudioTrack {
  id: string;
  title: string;
  stop: string;
  duration: number; // seconds (simulated playback)
  narrator: string;
  excerpt: string;
  // accent color of the ring (oklch hue channel number)
  accent: string;
}

export const audioTracks: AudioTrack[] = [
  {
    id: "stop-01",
    title: "The Persistence of Light",
    stop: "Gallery 01 · Stop 1 of 5",
    duration: 184,
    narrator: "Dr. Elena Marsh, Curator of European Painting",
    excerpt:
      "Look first at the candle. Notice how the light does not so much fall upon the figures as carve them — each fold of cloth, each knuckle, is a small cliff of shadow thrown back from that single flame…",
    accent: "oklch(0.74 0.13 75)",
  },
  {
    id: "stop-02",
    title: "A Garden Made of Time",
    stop: "Gallery 03 · Stop 2 of 5",
    duration: 212,
    narrator: "Prof. Idris Okafor, Visiting Scholar",
    excerpt:
      "Monet did not paint the lilies. He painted the half-second of light upon the lilies — the trembling interface between the surface of the water and the sky that lies beneath it…",
    accent: "oklch(0.62 0.14 40)",
  },
  {
    id: "stop-03",
    title: "The Weight of a Fold",
    stop: "Conservation Lab · Stop 3 of 5",
    duration: 167,
    narrator: "Marisol Vega, Senior Conservator",
    excerpt:
      "Here is the crimson lake, laid over a lead-white underpainting. The white beneath is what gives the drapery its body — without it the red would be thin, merely red, instead of dense and falling…",
    accent: "oklch(0.55 0.10 145)",
  },
  {
    id: "stop-04",
    title: "Why the Frame Matters",
    stop: "Gallery 07 · Stop 4 of 5",
    duration: 195,
    narrator: "Henrik Sø, Frame Historian",
    excerpt:
      "A Baroque frame is not a border; it is a proscenium. Its carved cartouches reach into the room, drawing the viewer toward a stage on which the painted drama can be enacted…",
    accent: "oklch(0.70 0.08 30)",
  },
  {
    id: "stop-05",
    title: "When Colour Became Subject",
    stop: "Hall III · Stop 5 of 5",
    duration: 228,
    narrator: "Dr. Elena Marsh, Curator of European Painting",
    excerpt:
      "Stand back. Then step closer. From across the room the colour is a temperature — warm, heavy, almost audible. Up close it dissolves into the weft of the canvas, into the labour of the hand…",
    accent: "oklch(0.50 0.06 30)",
  },
];

export const museumInfo = {
  name: "Lumen",
  fullName: "Lumen Museum of Art History",
  tagline: "A journey through five centuries of Western art.",
  hours: "Tue–Sun · 10:00–18:00",
  address: "1 Curator's Walk, Old Quarter",
  founded: "1887",
};
