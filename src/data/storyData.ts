import { 
  CharacterArchetype, 
  WorldRealm, 
  StoryObject, 
  StoryProblem, 
  SupportingCompanion, 
  TwistItem, 
  AchievementBadge,
  IslandLocation
} from '../types/story';

export const ISLAND_LOCATIONS: IslandLocation[] = [
  {
    id: 'level-1',
    name: 'Starter Cove & Moai Coast',
    tagline: 'Hero & Companion Forge',
    emoji: '🗿',
    coords: { x: 38, y: 78 },
    color: '#10B981',
    levelNumber: 1,
    questTitle: 'Level 1: Forge Your Hero & Assemble Team',
    description: 'The golden shores where every legend begins. Choose your protagonist, customize their abilities, and pair with a loyal companion.',
    activityType: 'forge'
  },
  {
    id: 'level-2',
    name: 'Sun Temple of the Golden Relic',
    tagline: 'The Relic Riddle Vault',
    emoji: '🏛️',
    coords: { x: 42, y: 55 },
    color: '#F59E0B',
    levelNumber: 2,
    questTitle: 'Level 2: Unlock the Ancient Artifact & Quest Stakes',
    description: 'An ancient stepped pyramid holding forgotten relics. Solve the dial riddle to reveal your magical tool and discover the realm dilemma.',
    activityType: 'vault'
  },
  {
    id: 'level-3',
    name: 'Whispering Jungle & Stepping Stones',
    tagline: 'Baton Relay & Scene Builder',
    emoji: '🌴',
    coords: { x: 55, y: 62 },
    color: '#8B5CF6',
    levelNumber: 3,
    questTitle: 'Level 3: Pass the Baton & Arrange the Journey',
    description: 'A dense canopy crossed by stepping stone trails. Pass the digital baton between teams and sequence the unfolding story events.',
    activityType: 'relay'
  },
  {
    id: 'level-4',
    name: 'Crystal Waterfall & Mystic Stream',
    tagline: 'Twist Wheel & Voice Tone Studio',
    emoji: '🌊',
    coords: { x: 26, y: 42 },
    color: '#06B6D4',
    levelNumber: 4,
    questTitle: 'Level 4: Spin the Twist & Voice the Scene',
    description: 'A glowing waterfall cascading into a split river. Spin the surprise twist wheel, vote on path directions, and master vocal tones.',
    activityType: 'waterfall'
  },
  {
    id: 'level-5',
    name: 'The Smoking Volcano Forge',
    tagline: 'Climax Defusal Battle',
    emoji: '🌋',
    coords: { x: 52, y: 28 },
    color: '#EF4444',
    levelNumber: 5,
    questTitle: 'Level 5: Overcome the Climax & Save the Island',
    description: 'The volcanic peak where all choices converge. Balance risks and forge a creative, non-violent solution to the central crisis.',
    activityType: 'volcano'
  },
  {
    id: 'level-6',
    name: 'Galleon Harbor & Starry Lighthouse',
    tagline: 'Class Storybook & Passport Ceremony',
    emoji: '⛵',
    coords: { x: 82, y: 65 },
    color: '#EC4899',
    levelNumber: 6,
    questTitle: 'Level 6: Publish Class Storybook & Award Passports',
    description: 'The finish line! Flip through your completed digital storybook with text-to-speech reading, print certificates, and celebrate victory.',
    activityType: 'storybook'
  }
];

export const HERO_LOCATIONS_MAP: Record<string, IslandLocation[]> = {
  'hero-naruto': [
    {
      id: 'level-1',
      name: 'Hidden Leaf Ninja Academy',
      tagline: 'Ninja Team & Shinobi Gear Forge',
      emoji: '🥷',
      coords: { x: 38, y: 78 },
      color: '#F59E0B',
      levelNumber: 1,
      questTitle: 'Level 1: Assemble Your Shinobi Squad & Gear',
      description: 'The sacred grounds where ninja legends are born. Select your protagonist and loyal companion.',
      activityType: 'forge'
    },
    {
      id: 'level-2',
      name: 'Grand Hokage Vault & Sealing Matrix',
      tagline: 'Sage Chakra Matrix & Rasengan Forge',
      emoji: '🌀',
      coords: { x: 42, y: 55 },
      color: '#EA580C',
      levelNumber: 2,
      questTitle: 'Level 2: Calibrate Sage Chakra & Unlock Forbidden Scroll',
      description: '3D Chakra Matrix simulation. Balance Spiritual, Physical, and Sage Senjutsu energy to forge the Sacred Scroll.',
      activityType: 'vault'
    },
    {
      id: 'level-3',
      name: 'Whispering Shinobi Forest',
      tagline: 'Baton Relay & Akatsuki Defense Sequencing',
      emoji: '🌲',
      coords: { x: 55, y: 62 },
      color: '#10B981',
      levelNumber: 3,
      questTitle: 'Level 3: Ninja Baton Relay & Defense Sequencing',
      description: 'Pass the ninja baton between squads and sequence the unfolding village defense.',
      activityType: 'relay'
    },
    {
      id: 'level-4',
      name: 'Mystic Waterfall of Truth',
      tagline: 'Twist Wheel & Shinobi Voice Studio',
      emoji: '🌊',
      coords: { x: 26, y: 42 },
      color: '#06B6D4',
      levelNumber: 4,
      questTitle: 'Level 4: Rapid Crossing & Sage Vocal Tone Mastery',
      description: 'Cross the rushing chakra rapids, spin the surprise twist wheel, and master dramatic shinobi tones.',
      activityType: 'waterfall'
    },
    {
      id: 'level-5',
      name: 'Valley of the End',
      tagline: 'Tailed-Beast Chakra Convergence',
      emoji: '🔥',
      coords: { x: 52, y: 28 },
      color: '#EF4444',
      levelNumber: 5,
      questTitle: 'Level 5: Overcome the Akatsuki Crisis & Restore Peace',
      description: 'Seal the 5 rogue crimson chakra rifts and resolve the conflict through empathy and teamwork.',
      activityType: 'volcano'
    },
    {
      id: 'level-6',
      name: 'Hokage Monument & Grand Chronicle',
      tagline: 'Shinobi Class Storybook & Passport',
      emoji: '📜',
      coords: { x: 82, y: 65 },
      color: '#EC4899',
      levelNumber: 6,
      questTitle: 'Level 6: Publish Ninja Storybook & Award Shinobi Passports',
      description: 'Publish your completed ninja storybook with audio reading and celebration fanfare.',
      activityType: 'storybook'
    }
  ],
  'hero-goku': [
    {
      id: 'level-1',
      name: 'Mt. Paozu & Turtle Hermit Cove',
      tagline: 'Z-Fighter Team & Gi Forge',
      emoji: '🥋',
      coords: { x: 38, y: 78 },
      color: '#F97316',
      levelNumber: 1,
      questTitle: 'Level 1: Assemble Your Z-Fighter Squad & Gi',
      description: 'Assemble Goku and his loyal companions and equip legendary martial gear.',
      activityType: 'forge'
    },
    {
      id: 'level-2',
      name: 'Capsule Corp Hyper-Gravity Ki Chamber',
      tagline: 'Gravity Ki Grid & Dragon Radar Lab',
      emoji: '🐉',
      coords: { x: 42, y: 55 },
      color: '#2563EB',
      levelNumber: 2,
      questTitle: 'Level 2: Calibrate Saiyan Ki & Locate 4-Star Dragon Ball',
      description: '3D Gravity Ki simulation. Balance Kaio-ken and Super Saiyan harmonics to locate the 4-Star Dragon Ball.',
      activityType: 'vault'
    },
    {
      id: 'level-3',
      name: 'Snake Way & Lookout Plateau',
      tagline: 'Supersonic Relay & Spirit Bomb Rally',
      emoji: '☁️',
      coords: { x: 55, y: 62 },
      color: '#8B5CF6',
      levelNumber: 3,
      questTitle: 'Level 3: Supersonic Relay & Story Scene Sprint',
      description: 'Pass the digital baton along Snake Way and sequence the cosmic journey.',
      activityType: 'relay'
    },
    {
      id: 'level-4',
      name: 'Sacred Kai Realm River',
      tagline: 'Ki Rapids & Saiyan Roar Studio',
      emoji: '🌊',
      coords: { x: 26, y: 42 },
      color: '#06B6D4',
      levelNumber: 4,
      questTitle: 'Level 4: Cross Ki Torrent Rapids & Master Battle Tones',
      description: 'Navigate raging ki currents, spin the plot twist wheel, and master powerful character tones.',
      activityType: 'waterfall'
    },
    {
      id: 'level-5',
      name: 'Subterranean Planetary Ki Core',
      tagline: 'Cosmic Ki Harmony Convergence',
      emoji: '💥',
      coords: { x: 52, y: 28 },
      color: '#EF4444',
      levelNumber: 5,
      questTitle: 'Level 5: Stabilize Planetary Ki & Save Earth',
      description: 'Channel unstable thermal energy harmlessly into the sky with the Super Spirit Sphere.',
      activityType: 'volcano'
    },
    {
      id: 'level-6',
      name: 'World Martial Arts Champion Arena',
      tagline: 'Z-Fighter Storybook & Champion Passport',
      emoji: '🏆',
      coords: { x: 82, y: 65 },
      color: '#EC4899',
      levelNumber: 6,
      questTitle: 'Level 6: Publish Z-Fighter Storybook & Award Passports',
      description: 'Flip through your digital hero chronicle and celebrate planetary victory.',
      activityType: 'storybook'
    }
  ],
  'hero-po': [
    {
      id: 'level-1',
      name: 'Valley of Peace Noodle Square',
      tagline: 'Dragon Warrior & Furious 5 Forge',
      emoji: '🐼',
      coords: { x: 38, y: 78 },
      color: '#10B981',
      levelNumber: 1,
      questTitle: 'Level 1: Assemble Dragon Warrior Team & Kung Fu Gear',
      description: 'Choose Po, pair with Master Shifu or Tigress, and equip the secret dumpling noodle tools.',
      activityType: 'forge'
    },
    {
      id: 'level-2',
      name: 'Jade Palace Celestial Hall of Heroes',
      tagline: 'Oogway\'s Jade Staff & Spirit Portal Vault',
      emoji: '🥢',
      coords: { x: 42, y: 55 },
      color: '#059669',
      levelNumber: 2,
      questTitle: 'Level 2: Balance Jade Chi Mirrors & Awaken Dragon Scroll',
      description: '3D Chi Reflection simulation. Rotate the 3 Jade Dragon mirrors across the lotus pool to awaken the Dragon Scroll.',
      activityType: 'vault'
    },
    {
      id: 'level-3',
      name: 'Jade Palace Thousand Steps',
      tagline: 'Kung Fu Relay & Valley Defense Sequencing',
      emoji: '🐾',
      coords: { x: 55, y: 62 },
      color: '#8B5CF6',
      levelNumber: 3,
      questTitle: 'Level 3: Kung Fu Baton Relay & Sequence the Legend',
      description: 'Pass the baton up the sacred thousand steps and sequence the kung fu defense.',
      activityType: 'relay'
    },
    {
      id: 'level-4',
      name: 'Sacred Peach Tree of Heavenly Wisdom',
      tagline: 'Twist Wheel & Kung Fu Voice Studio',
      emoji: '🌸',
      coords: { x: 26, y: 42 },
      color: '#06B6D4',
      levelNumber: 4,
      questTitle: 'Level 4: Log Rapids Bounce & Master Comic Voice Tones',
      description: 'Execute the panda belly flop crossing, spin the twist wheel, and master dramatic vocal delivery.',
      activityType: 'waterfall'
    },
    {
      id: 'level-5',
      name: 'Spirit Realm Celestial Fissure',
      tagline: 'Golden Chi Harmony Convergence',
      emoji: '🐉',
      coords: { x: 52, y: 28 },
      color: '#EF4444',
      levelNumber: 5,
      questTitle: 'Level 5: Restore Spirit Realm Harmony & Inner Peace',
      description: 'Restore the 5 Chi balance stones and unleash the Golden Chi Dragon.',
      activityType: 'volcano'
    },
    {
      id: 'level-6',
      name: 'Jade Palace Fireworks Pavilion',
      tagline: 'Dragon Legend Storybook & Passport',
      emoji: '📜',
      coords: { x: 82, y: 65 },
      color: '#EC4899',
      levelNumber: 6,
      questTitle: 'Level 6: Publish Kung Fu Storybook & Award Dragon Passports',
      description: 'Publish your hilarious and heartwarming martial arts storybook with fireworks.',
      activityType: 'storybook'
    }
  ],
  'hero-ironman': [
    {
      id: 'level-1',
      name: 'Stark Tower Workshop',
      tagline: 'Avenger Team & Nanotech Armor Forge',
      emoji: '🦾',
      coords: { x: 38, y: 78 },
      color: '#DC2626',
      levelNumber: 1,
      questTitle: 'Level 1: Assemble Iron Man & Nanotech Armored Suite',
      description: 'Select Tony Stark, pair with J.A.R.V.I.S., and configure flight repulsors and nanotech armor.',
      activityType: 'forge'
    },
    {
      id: 'level-2',
      name: 'Stark Industries Holographic Quantum Lab',
      tagline: 'Arc Reactor Quantum Grid Simulation',
      emoji: '💠',
      coords: { x: 42, y: 55 },
      color: '#06B6D4',
      levelNumber: 2,
      questTitle: 'Level 2: Calibrate Arc Reactor Magnetic Grid & Forge Core',
      description: '3D Holographic Arc Reactor simulation. Calibrate magnetic confinement to achieve 100% Clean Fusion.',
      activityType: 'vault'
    },
    {
      id: 'level-3',
      name: 'New York Hypersonic Skyway',
      tagline: 'Avengers Relay & Defense Protocol',
      emoji: '🏙️',
      coords: { x: 55, y: 62 },
      color: '#8B5CF6',
      levelNumber: 3,
      questTitle: 'Level 3: Hypersonic Relay & Story Scene Sprint',
      description: 'Pass the digital baton between Avengers and sequence the nanotech defense protocol.',
      activityType: 'relay'
    },
    {
      id: 'level-4',
      name: 'Acoustic Resonance & Laser Lab',
      tagline: 'Twist Wheel & Tech Genius Voice Studio',
      emoji: '⚡',
      coords: { x: 26, y: 42 },
      color: '#06B6D4',
      levelNumber: 4,
      questTitle: 'Level 4: Hardlight Bridge Rapids & Master Tech Tones',
      description: 'Cross the electrified plasma rapids, spin the plot twist wheel, and master confident tech delivery.',
      activityType: 'waterfall'
    },
    {
      id: 'level-5',
      name: 'Sub-Orbital Defense Array',
      tagline: 'EMP Core & Arc Containment Battle',
      emoji: '🚀',
      coords: { x: 52, y: 28 },
      color: '#EF4444',
      levelNumber: 5,
      questTitle: 'Level 5: Contain Quantum EMP Pulse & Save the Planet',
      description: 'Reroute the runaway power surge through the Vibranium Arc Gauntlet safely.',
      activityType: 'volcano'
    },
    {
      id: 'level-6',
      name: 'Stark Expo Global Showcase',
      tagline: 'Innovator Storybook & Avenger Passport',
      emoji: '📖',
      coords: { x: 82, y: 65 },
      color: '#EC4899',
      levelNumber: 6,
      questTitle: 'Level 6: Publish Stark Tech Storybook & Award Passports',
      description: 'Publish your high-tech superhero storybook and celebrate global innovation.',
      activityType: 'storybook'
    }
  ]
};

export const getHeroLocations = (heroId?: string): IslandLocation[] => {
  if (heroId && HERO_LOCATIONS_MAP[heroId]) {
    return HERO_LOCATIONS_MAP[heroId];
  }
  return ISLAND_LOCATIONS;
};

export const HEROES: CharacterArchetype[] = [
  {
    id: 'hero-naruto',
    name: 'Naruto Uzumaki',
    title: 'Hokage-in-Training & Hero of the Hidden Leaf',
    avatar: '🍥',
    emoji: '🥷',
    image: '/assets/naruto_original.webp',
    color: 'from-amber-500 to-orange-600',
    soundUrl: '/assets/audio/naruto_theme.mp3',
    soundStartTime: 0,
    soundDuration: 10,
    gifs: [
      '/assets/gifs/naruto_1.gif',
      '/assets/gifs/naruto_2.gif',
      '/assets/gifs/naruto_3.gif',
      '/assets/gifs/naruto_4.gif',
      '/assets/gifs/naruto_5.gif'
    ],
    themeStyles: {
      cardBg: 'from-amber-700 via-orange-600 to-amber-900',
      borderClass: 'border-amber-400 ring-4 ring-orange-500/40 shadow-[0_20px_50px_rgba(234,88,12,0.45)]',
      badgeBg: 'bg-orange-500/30 text-amber-200 border-amber-400/50',
      accentText: 'text-amber-300',
      statColors: {
        courage: 'bg-amber-400',
        ingenuity: 'bg-orange-400',
        teamwork: 'bg-yellow-300',
        willpower: 'bg-amber-300'
      }
    },
    personality: 'Unstoppable willpower, passionately loyal to teammates, turns fierce rivals into lifelong friends.',
    strength: 'Massive Chakra Reserves & Multi-Shadow Clone Formations.',
    specialAbility: 'Rasengan Energy Sphere & Nine-Tails Sage Chakra Surge.',
    signatureMove: 'Giant Rasengan Barrage',
    quote: '"I won’t run away, I never go back on my word! That is my Ninja Way!"',
    description: 'Dressed in his iconic orange and black shinobi jacket and leaf headband, radiating unshakeable determination.',
    moral: 'Hard work, loyalty, and never giving up can overcome any perceived destiny.',
    storyArchetype: 'The Relentless Underdog',
    teachingNote: 'Underdog Archetype: Shows students that great protagonists start with setbacks and grow through grit and friendship.',
    stats: {
      courage: 100,
      ingenuity: 88,
      teamwork: 98,
      willpower: 100
    }
  },
  {
    id: 'hero-goku',
    name: 'Son Goku',
    title: 'Saiyan Defender of Earth',
    avatar: '🐉',
    emoji: '🥋',
    image: '/assets/goku_original.webp',
    color: 'from-orange-500 to-blue-600',
    soundUrl: '/assets/audio/goku_theme.mp3',
    soundStartTime: 0,
    soundDuration: 10,
    gifs: [
      '/assets/gifs/goku_1.gif',
      '/assets/gifs/goku_2.gif',
      '/assets/gifs/goku_3.gif',
      '/assets/gifs/goku_4.gif'
    ],
    themeStyles: {
      cardBg: 'from-orange-600 via-slate-900 to-blue-950',
      borderClass: 'border-blue-400 ring-4 ring-orange-500/40 shadow-[0_20px_50px_rgba(37,99,235,0.45)]',
      badgeBg: 'bg-blue-600/30 text-blue-200 border-blue-400/50',
      accentText: 'text-amber-400',
      statColors: {
        courage: 'bg-orange-500',
        ingenuity: 'bg-cyan-400',
        teamwork: 'bg-blue-400',
        willpower: 'bg-amber-400'
      }
    },
    personality: 'Pure-hearted, cheerful, constantly strives to break his limits to protect the universe and his friends.',
    strength: 'Master Martial Artist with superhuman reflexes and instinctual combat flow.',
    specialAbility: 'Kamehameha Wave & Super Saiyan Ki Awakening.',
    signatureMove: 'Instant Transmission Kamehameha',
    quote: '"Power comes in response to a need, not a desire. I will protect everyone!"',
    description: 'Clad in the iconic orange Turtle School gi, channeling bright golden ki energy and an infectious smile.',
    moral: 'True strength is used to protect others and is forged through continuous self-improvement.',
    storyArchetype: 'The Transcendent Champion',
    teachingNote: 'Champion Archetype: Teaches students how noble motivations push characters to conquer impossible odds.',
    stats: {
      courage: 99,
      ingenuity: 90,
      teamwork: 94,
      willpower: 100
    }
  },
  {
    id: 'hero-po',
    name: 'Po the Dragon Warrior',
    title: 'Master of the Jade Palace & Valley of Peace',
    avatar: '🐼',
    emoji: '🥢',
    image: '/assets/kung_fu_panda_original.webp',
    color: 'from-emerald-500 to-amber-500',
    soundUrl: '/assets/audio/po_theme.mp3',
    soundStartTime: 2,
    soundDuration: 10,
    gifs: [
      '/assets/gifs/po_1.gif',
      '/assets/gifs/po_2.gif',
      '/assets/gifs/po_3.gif',
      '/assets/gifs/po_4.gif',
      '/assets/gifs/po_5.gif'
    ],
    themeStyles: {
      cardBg: 'from-neutral-950 via-slate-900 to-stone-900',
      borderClass: 'border-emerald-400 ring-4 ring-emerald-500/40 shadow-[0_20px_50px_rgba(16,185,129,0.45)]',
      badgeBg: 'bg-emerald-900/40 text-emerald-200 border-emerald-400/50',
      accentText: 'text-emerald-300',
      statColors: {
        courage: 'bg-emerald-400',
        ingenuity: 'bg-teal-300',
        teamwork: 'bg-white',
        willpower: 'bg-amber-400'
      }
    },
    personality: 'Warm-hearted, hilariously enthusiastic, discovers that believing in his authentic self is the true secret.',
    strength: 'Flab-absorbing Panda Kung Fu & legendary Wuxi Finger Hold.',
    specialAbility: 'Golden Chi Mastery & Inner Peace Deflection.',
    signatureMove: 'Golden Chi Dragon Blast',
    quote: '"There is no secret ingredient... to make something special, you just have to believe it is special!"',
    description: 'Equipped with patchwork martial arts pants, boundless heart, and unmatched enthusiasm for dumplings and justice.',
    moral: 'Your unique quirks and authentic self are your greatest superpowers.',
    storyArchetype: 'The Unlikely Chosen One',
    teachingNote: 'Unlikely Hero: Demonstrates how self-acceptance and humor turn perceived weaknesses into legendary strengths.',
    stats: {
      courage: 92,
      ingenuity: 96,
      teamwork: 96,
      willpower: 95
    }
  },
  {
    id: 'hero-ironman',
    name: 'Tony Stark (Iron Man)',
    title: 'Genius Inventor & Armored Avenger',
    avatar: '⚡',
    emoji: '🦾',
    image: '/assets/hero_ironman.jpg',
    color: 'from-red-500 to-amber-500',
    soundUrl: '/assets/audio/theme_ironman.wav',
    soundStartTime: 0,
    soundDuration: 10,
    gifs: [
      '/assets/gifs/ironman_1.gif',
      '/assets/gifs/ironman_2.gif',
      '/assets/gifs/ironman_3.gif',
      '/assets/gifs/ironman_4.gif',
      '/assets/gifs/ironman_5.gif'
    ],
    themeStyles: {
      cardBg: 'from-red-800 via-rose-950 to-amber-950',
      borderClass: 'border-amber-400 ring-4 ring-red-500/40 shadow-[0_20px_50px_rgba(220,38,38,0.45)]',
      badgeBg: 'bg-red-900/40 text-amber-200 border-amber-400/50',
      accentText: 'text-amber-400',
      statColors: {
        courage: 'bg-red-500',
        ingenuity: 'bg-cyan-400',
        teamwork: 'bg-amber-400',
        willpower: 'bg-yellow-400'
      }
    },
    personality: 'Brilliant, quick-witted, visionary futurist who turns science and engineering into heroic miracles.',
    strength: 'Nanotech battle armor, hypersonic flight, and tactical computation.',
    specialAbility: 'Arc Reactor Unibeam & Autonomous Nanotech Morphing.',
    signatureMove: 'Maximum Output Unibeam',
    quote: '"It’s not the armor that makes the hero — it’s the mind and heart inside it!"',
    description: 'Armored in crimson and gold aerospace alloy powered by a glowing clean-energy Arc Reactor.',
    moral: 'Genius is a responsibility to protect others and invent creative solutions to humanity’s toughest challenges.',
    storyArchetype: 'The Visionary Inventor',
    teachingNote: 'Inventor Archetype: Shows how intellect, creativity, and taking responsibility resolve major story conflicts.',
    stats: {
      courage: 94,
      ingenuity: 100,
      teamwork: 90,
      willpower: 96
    }
  }
];

export const IMPORTANT_OBJECTS: StoryObject[] = [
  {
    id: 'obj-scroll',
    name: 'Forbidden Scroll of Sealing',
    category: 'Shinobi Relic',
    emoji: '📜',
    glowColor: '#F59E0B',
    power: 'Contains secret formulas to calm volatile energy storms and bind destructive forces.',
    description: 'An ancient parchment bound with golden chakra silk that glows when danger approaches.',
    origin: 'Sealed inside the Sun Temple by the first Hokage.'
  },
  {
    id: 'obj-dragonball',
    name: 'The 4-Star Dragon Ball',
    category: 'Cosmic Artifact',
    emoji: '🔮',
    glowColor: '#EF4444',
    power: 'Emits a warm cosmic frequency capable of recharging depleted planetary energy grids.',
    description: 'A translucent orange crystalline sphere containing four glowing red stars.',
    origin: 'Guarded by ancient monks atop the highest island peak.'
  },
  {
    id: 'obj-dragonscroll',
    name: 'The Golden Dragon Scroll',
    category: 'Kung Fu Masterpiece',
    emoji: '📜',
    glowColor: '#10B981',
    power: 'Reveals the secret of Chi — reflecting the user’s true inner potential to harmonize elements.',
    description: 'A sacred golden scroll held by a dragon statue in the Sun Temple vault ceiling.',
    origin: 'Crafted by Master Oogway in the Jade Realm.'
  },
  {
    id: 'obj-arcreactor',
    name: 'Vibranium Arc Reactor Core',
    category: 'High-Tech Invention',
    emoji: '💠',
    glowColor: '#06B6D4',
    power: 'Generates infinite clean plasma energy to power island shields and defuse volcano overheating.',
    description: 'A pocket fusion reactor with glowing blue copper coils and palladium capacitors.',
    origin: 'Engineered by Tony Stark inside the island cavern laboratory.'
  }
];

export const WORLDS: WorldRealm[] = [
  {
    id: 'world-island',
    name: 'The Lost Isles of Wonder',
    subtitle: 'Tropical Adventure Archipelago',
    emoji: '🏝️',
    image: '/assets/island_map.jpg',
    themeColor: '#10B981',
    skyColor: '#BAE6FD',
    groundColor: '#059669',
    fogColor: '#E0F2FE',
    ambientColor: '#FFFFFF',
    description: 'An enchanted island featuring moai beaches, ancient golden pyramids, misty waterfalls, a smoking volcano, and starry skies.',
    features: ['Smoking Volcano Crags', 'Sun Temple Pyramids', 'Crystal River Waterfalls', 'Galleon Harbor'],
    landmarks: ['Starter Cove', 'Sun Temple', 'Whispering Jungle', 'Crystal Waterfall', 'Volcano Forge', 'Lighthouse']
  }
];

export const STORY_PROBLEMS: StoryProblem[] = [
  {
    id: 'prob-volcano',
    title: 'The Great Island Energy Core Overload',
    hook: 'The island’s subterranean volcano core is vibrating uncontrollably, threatening an eruption that could submerge the realm!',
    emoji: '🌋',
    stakes: 'If the core is not stabilized before dusk, the energy matrix will fracture and the island will sink.',
    possibleImpact: 'Magma vents heat up the whispering jungle and rivers begin glowing with charged plasma.',
    questionForClass: 'How can our hero’s unique skills and unlocked relic balance the geothermal core peacefully?'
  },
  {
    id: 'prob-shadowrift',
    title: 'The Phantom Dimensional Rift',
    hook: 'A mysterious dark anomaly has opened above the lighthouse, siphoning the island’s light and magic into the void!',
    emoji: '🌀',
    stakes: 'Without the guiding light beacon, all incoming explorer airships and sea galleons will be lost.',
    possibleImpact: 'Shadows detach from objects and the waterfall flows upward in reverse gravity.',
    questionForClass: 'What combination of team courage and relic frequency can seal the rift permanently?'
  }
];

export const COMPANIONS: SupportingCompanion[] = [
  {
    id: 'comp-gamakichi',
    name: 'Gamakichi (Ninja Toad Ally)',
    archetype: 'Loyal Shinobi Scout',
    emoji: '🐸',
    quirk: 'Breathes tiny harmless smoke rings when excited.',
    howTheyHelp: 'Can leap 100 feet in a single bound to scout hidden high-ground pathways.',
    howTheyComplicate: 'Insists on stopping for snacks whenever he smells roasted bugs.'
  },
  {
    id: 'comp-nimbus',
    name: 'Flying Nimbus & King Kai',
    archetype: 'Enchanted Sky Guide',
    emoji: '☁️',
    quirk: 'Telepathically cracks corny dad jokes during serious moments.',
    howTheyHelp: 'Provides supersonic aerial transport and warns of incoming hazards.',
    howTheyComplicate: 'Cannot carry anyone with impure or grumpy thoughts.'
  },
  {
    id: 'comp-shifu',
    name: 'Master Shifu & Tigress',
    archetype: 'Kung Fu Mentors',
    emoji: '🐾',
    quirk: 'Quotes ancient proverbs with extreme dramatic seriousness.',
    howTheyHelp: 'Decodes ancient martial riddles and executes synchronized acrobatics.',
    howTheyComplicate: 'Holds extremely high perfectionist training standards.'
  },
  {
    id: 'comp-jarvis',
    name: 'J.A.R.V.I.S. AI Hologram',
    archetype: 'Tactical Computing Companion',
    emoji: '🤖',
    quirk: 'Politely delivers witty British sarcasm during extreme emergencies.',
    howTheyHelp: 'Analyzes structural weak points and calculates real-time puzzle solutions.',
    howTheyComplicate: 'Requires rebooting if exposed to high magnetic pulses.'
  }
];

export const TWISTS: TwistItem[] = [
  {
    id: 'twist-rival',
    category: 'UNEXPECTED ALLY',
    title: 'The Rival’s True Intention',
    emoji: '🤝',
    description: 'The shadowy rival reveals they were actually trying to prevent the volcano from overheating!',
    storyPrompt: 'How does the team welcome the rival to solve the puzzle together?'
  },
  {
    id: 'twist-path',
    category: 'SECRET DISCOVERY',
    title: 'The Subterranean Lava Canal',
    emoji: '🚪',
    description: 'A stone tablet slides open, revealing a hidden river that leads directly to the core.',
    storyPrompt: 'What vehicle or gadget does the team use to navigate the heat?'
  },
  {
    id: 'twist-weather',
    category: 'COSMIC ANOMALY',
    title: 'The Starlight Aurora Gravity Flip',
    emoji: '⚡',
    description: 'Cosmic auroras illuminate the night sky, temporarily making everyone weightless!',
    storyPrompt: 'How does zero-gravity help or hinder our hero’s mission?'
  },
  {
    id: 'twist-awakening',
    category: 'RELIC AWAKENING',
    title: 'The Object Speaks',
    emoji: '🔮',
    description: 'The golden relic projects a holographic message from the ancient island architects.',
    storyPrompt: 'What riddle or formula does the message reveal?'
  }
];

export const HERO_TWISTS_MAP: Record<string, TwistItem[]> = {
  'hero-naruto': [
    {
      id: 'naruto-twist-1',
      category: 'SHADOW ALLIANCE',
      title: 'Sasuke Sharingan Assist',
      emoji: '👁️',
      description: 'Sasuke activates his Sharingan from the shadow canopy, predicting the enemy’s trap!',
      storyPrompt: 'How does Team 7 combine their jutsu to strike in unison?'
    },
    {
      id: 'naruto-twist-2',
      category: 'SUMMONING JUTSU',
      title: 'Chief Toad Gamabunta Appears',
      emoji: '🐸',
      description: 'Gamabunta drops from the sky with a colossal pipe and massive water shield!',
      storyPrompt: 'How do the ninja ride the giant toad into battle?'
    },
    {
      id: 'naruto-twist-3',
      category: 'SECRET NINJA ART',
      title: 'Hidden Mist Barrier Shatters',
      emoji: '📜',
      description: 'The ice mirror prison dissolves after Naruto triggers an explosive seal tag!',
      storyPrompt: 'What combination jutsu breaks the barrier?'
    },
    {
      id: 'naruto-twist-4',
      category: 'KURAMA POWER',
      title: 'Nine-Tails Chakra Cloak',
      emoji: '🦊',
      description: 'A golden Nine-Tails shroud awakens, granting every squad member flaming chakra armor!',
      storyPrompt: 'How does the squad charge forward with enhanced speed?'
    },
    {
      id: 'naruto-twist-5',
      category: 'AKATSUKI ENCOUNTER',
      title: 'Itachi’s Crow Illusion Message',
      emoji: '🦅',
      description: 'A flurry of black crows delivers a secret scroll detailing the enemy’s weak point!',
      storyPrompt: 'What hidden formula does the message reveal?'
    },
    {
      id: 'naruto-twist-6',
      category: 'SAGE MODE SURGE',
      title: 'Sage Toad Oil Geyser',
      emoji: '🌀',
      description: 'A geyser of natural Sage oil erupts, supercharging the Rasengan into a Giant Sage Blast!',
      storyPrompt: 'How do they channel natural senjutsu energy?'
    }
  ],
  'hero-goku': [
    {
      id: 'goku-twist-1',
      category: 'SAIYAN PRIDE',
      title: 'Vegeta Final Flash Interception',
      emoji: '💥',
      description: 'Vegeta drops from orbit with a roaring Final Flash, vaporizing the enemy blockade!',
      storyPrompt: 'How do Goku and Vegeta coordinate their dual assault?'
    },
    {
      id: 'goku-twist-2',
      category: 'SENZU BEAN',
      title: 'Emergency Senzu Bean Drop',
      emoji: '🫘',
      description: 'Korin’s sacred Senzu Beans instantly restore 100% stamina and ki to the entire squad!',
      storyPrompt: 'How does the team rally for the counterattack?'
    },
    {
      id: 'goku-twist-3',
      category: 'FUSION RITUAL',
      title: 'Metamoran Fusion Signal',
      emoji: '✨',
      description: 'Goku and Vegeta execute the sacred Fusion Dance to summon Gogeta into the fray!',
      storyPrompt: 'How does the fused warrior break the dimensional seal?'
    },
    {
      id: 'goku-twist-4',
      category: 'DRAGON RADAR',
      title: '7 Dragon Balls Synchronize',
      emoji: '🔮',
      description: 'All seven Dragon Balls begin pulsating in harmony, casting Shenron’s protective golden barrier!',
      storyPrompt: 'What wish protects the planet?'
    },
    {
      id: 'goku-twist-5',
      category: 'KAIO-KEN SURGE',
      title: 'Kaio-ken 20x Limit Break',
      emoji: '⚡',
      description: 'Goku ignites his crimson Kaio-ken aura twentyfold to outspeed the collapsing gravity field!',
      storyPrompt: 'How does Goku push past physical limits?'
    },
    {
      id: 'goku-twist-6',
      category: 'INSTANT WARP',
      title: 'Yardrat Instant Transmission',
      emoji: '🌀',
      description: 'Goku teleports the entire allied squad directly inside the enemy command center!',
      storyPrompt: 'How do they catch the invaders off guard?'
    }
  ],
  'hero-po': [
    {
      id: 'po-twist-1',
      category: 'FURIOUS STRIKE',
      title: 'Tigress Tiger Claw Ambush',
      emoji: '🐯',
      description: 'Master Tigress leaps from the highest bamboo stalk to neutralize the ambush!',
      storyPrompt: 'How does Po coordinate with Tigress?'
    },
    {
      id: 'po-twist-2',
      category: 'NOODLE SECRET',
      title: 'Mr. Ping’s Golden Tofu Dumpling',
      emoji: '🥟',
      description: 'A secret stash of Golden Dumplings gives Po an unstoppable burst of panda stamina!',
      storyPrompt: 'How does delicious food inspire kung fu genius?'
    },
    {
      id: 'po-twist-3',
      category: 'SACRED STAFF',
      title: 'Oogway’s Peach Staff Glows',
      emoji: '🌸',
      description: 'Cherry blossom petals swirl, creating an impenetrable ring of peaceful Chi!',
      storyPrompt: 'What ancient wisdom is unlocked?'
    },
    {
      id: 'po-twist-4',
      category: 'BELLY BOUNCE',
      title: 'Super Panda Belly Ricochet',
      emoji: '🐼',
      description: 'Po bounces a heavy cannonball off his belly, deflecting it straight into the obstacle!',
      storyPrompt: 'How does humor and softness defeat hard armor?'
    },
    {
      id: 'po-twist-5',
      category: 'JADE WARRIORS',
      title: 'Chi Jade Amulet Activation',
      emoji: '🟢',
      description: 'Ancestral jade amulets awaken, granting the Furious Five glowing Chi shields!',
      storyPrompt: 'How does the team fight as one synchronized family?'
    },
    {
      id: 'po-twist-6',
      category: 'SKIDOO HOLD',
      title: 'Golden Dragon Chi Aura',
      emoji: '🐉',
      description: 'A magnificent golden dragon wraps around Po as he prepares the sacred Wuxi Finger Hold!',
      storyPrompt: 'How does inner peace conquer chaos?'
    }
  ],
  'hero-ironman': [
    {
      id: 'ironman-twist-1',
      category: 'AVENGERS ASSEMBLE',
      title: 'Thor Lightning Supercharge',
      emoji: '⚡',
      description: 'Thor strikes Tony’s suit with Mjolnir lightning, boosting power capacity to 400%!',
      storyPrompt: 'How does Tony unleash the supercharged repulsors?'
    },
    {
      id: 'ironman-twist-2',
      category: 'VERONICA PROTOCOL',
      title: 'Hulkbuster Modular Drop',
      emoji: '🦾',
      description: 'Orbital satellite Veronica deploys heavy armor plating and hydraulic thrusters!',
      storyPrompt: 'How is the heavy armor deployed to secure the crater?'
    },
    {
      id: 'ironman-twist-3',
      category: 'CAPTAIN SHIELD',
      title: 'Vibranium Shield Reflector',
      emoji: '🛡️',
      description: 'Tony bounces his laser beams off Captain America’s shield to neutralize all targets simultaneously!',
      storyPrompt: 'How does teamwork triumph over technology?'
    },
    {
      id: 'ironman-twist-4',
      category: 'J.A.R.V.I.S. OVERCLOCK',
      title: 'Neural AI Quantum Decrypt',
      emoji: '🤖',
      description: 'J.A.R.V.I.S. decrypts the geothermal core in 0.04 seconds, pinpointing the exact override switch!',
      storyPrompt: 'How do they execute the bypass hack?'
    },
    {
      id: 'ironman-twist-5',
      category: 'NANOTECH CANNON',
      title: 'Nanotech Plasma Blade Surge',
      emoji: '💠',
      description: 'The suit reshapes into twin plasma cannons to weld the ruptured containment valves!',
      storyPrompt: 'How does nanotech adapt to the crisis?'
    },
    {
      id: 'ironman-twist-6',
      category: 'UNIBEAM MAXIMUM',
      title: '100% Arc Reactor Discharge',
      emoji: '🚀',
      description: 'Tony vents the central reactor core in a blinding beam of clean energy!',
      storyPrompt: 'How does clean energy save the day?'
    }
  ]
};

export const getHeroTwists = (heroId?: string): TwistItem[] => {
  if (heroId && HERO_TWISTS_MAP[heroId]) {
    return HERO_TWISTS_MAP[heroId];
  }
  return TWISTS;
};

export const HERO_EPISODE_SPRINT_MAP: Record<string, { sentence: string; act: string; icon: string }[]> = {
  'hero-naruto': [
    { sentence: 'At the Great Naruto Bridge in the Land of Waves,', act: 'Act 1: Setting', icon: '🌉' },
    { sentence: 'Zabuza summoned his Hidden Mist Jutsu while Haku trapped Sasuke in Ice Mirrors,', act: 'Act 2: Crisis', icon: '❄️' },
    { sentence: 'Naruto tapped into Kurama’s crimson Nine-Tails chakra with blazing red eyes,', act: 'Act 3: Surge', icon: '🦊' },
    { sentence: 'Master Jiraiya taught Naruto the 3-stage water balloon Rasengan training,', act: 'Act 4: Mentorship', icon: '📜' },
    { sentence: 'Summoning Gamakichi and two Shadow Clones to concentrate the swirling chakra sphere,', act: 'Act 5: Preparation', icon: '🐸' },
    { sentence: 'Naruto unleashed the Giant Rasengan to smash through the enemy defense line,', act: 'Act 6: Clash', icon: '🌀' },
    { sentence: 'Kakashi and Team 7 arrived to reinforce the Leaf Village perimeter,', act: 'Act 7: Alliance', icon: '🥷' },
    { sentence: 'Vowing to protect his comrades because that is his true Ninja Way!', act: 'Act 8: Resolution', icon: '🍥' }
  ],
  'hero-goku': [
    { sentence: 'Arriving on Planet Namek after rigorous Capsule Corp 100x Gravity training,', act: 'Act 1: Setting', icon: '🪐' },
    { sentence: 'Frieza powered up to maximum form and unleashed destructive death beams,', act: 'Act 2: Crisis', icon: '💥' },
    { sentence: 'Goku’s righteous fury triggered the legendary golden Super Saiyan transformation,', act: 'Act 3: Surge', icon: '✨' },
    { sentence: 'King Kai established a telepathic link from Other World to guide the Z-Fighters,', act: 'Act 4: Mentorship', icon: '☁️' },
    { sentence: 'Channeling energy from the surrounding cosmos into the colossal Spirit Bomb,', act: 'Act 5: Preparation', icon: '🌌' },
    { sentence: 'Goku charged the Full Power Super Kamehameha across the shattered landscape,', act: 'Act 6: Clash', icon: '🥋' },
    { sentence: 'Instant Transmission teleported Goku right past the incoming energy volley,', act: 'Act 7: Alliance', icon: '⚡' },
    { sentence: 'Standing victorious as the unbreakable defender of Earth and universe peace!', act: 'Act 8: Resolution', icon: '🏆' }
  ],
  'hero-po': [
    { sentence: 'Climbing the sacred Thousand Steps of the Jade Palace carrying a noodle cart,', act: 'Act 1: Setting', icon: '🏮' },
    { sentence: 'Master Oogway pointed the peach staff and proclaimed Po the Dragon Warrior,', act: 'Act 2: Prophecy', icon: '🌸' },
    { sentence: 'Master Shifu trained Po’s panda agility using bowls of steamed bean dumplings,', act: 'Act 3: Training', icon: '🥟' },
    { sentence: 'Tai Lung breached the sacred bridge and clashed with the Furious Five,', act: 'Act 4: Crisis', icon: '🐾' },
    { sentence: 'Opening the legendary Golden Dragon Scroll to discover the blank reflective surface,', act: 'Act 5: Revelation', icon: '📜' },
    { sentence: 'Realizing the true secret ingredient was believing in his authentic self,', act: 'Act 6: Enlightenment', icon: '✨' },
    { sentence: 'Catching Tai Lung’s strike with panda belly deflection and the Wuxi Finger Hold,', act: 'Act 7: Clash', icon: '🐼' },
    { sentence: 'Skidoo! Restoring peace, harmony, and laughter to the entire Valley of Peace!', act: 'Act 8: Resolution', icon: '🐉' }
  ],
  'hero-ironman': [
    { sentence: 'Inside the Stark Tower workshop, Tony upgraded the Mark L nanotech armor,', act: 'Act 1: Setting', icon: '🏙️' },
    { sentence: 'A sudden wormhole opened over Manhattan unleashing the hostile invasion fleet,', act: 'Act 2: Crisis', icon: '🛸' },
    { sentence: 'J.A.R.V.I.S. routed 100% auxiliary power to the chest Arc Reactor repulsors,', act: 'Act 3: Surge', icon: '🤖' },
    { sentence: 'Captain America and Thor coordinated the perimeter defense at Grand Central,', act: 'Act 4: Alliance', icon: '🛡️' },
    { sentence: 'Tony deployed the Vibranium Nanotech shield to absorb heavy energy blasts,', act: 'Act 5: Preparation', icon: '🦾' },
    { sentence: 'Overriding safety protocols to fire the Maximum Output Unibeam into the portal,', act: 'Act 6: Clash', icon: '⚡' },
    { sentence: 'Guiding the runaway missile through the wormhole with thrusters at maximum,', act: 'Act 7: Heroic Feat', icon: '🚀' },
    { sentence: 'Landing safely back at Stark Tower to celebrate with the Avengers over shawarma!', act: 'Act 8: Resolution', icon: '💠' }
  ]
};

export const getHeroEpisodeStory = (heroId?: string): { sentence: string; act: string; icon: string }[] => {
  if (heroId && HERO_EPISODE_SPRINT_MAP[heroId]) {
    return HERO_EPISODE_SPRINT_MAP[heroId];
  }
  return HERO_EPISODE_SPRINT_MAP['hero-naruto'];
};

export const HERO_COMPANIONS_MAP: Record<string, SupportingCompanion> = {
  'hero-naruto': COMPANIONS[0], // Gamakichi
  'hero-goku': COMPANIONS[1],   // Flying Nimbus & King Kai
  'hero-po': COMPANIONS[2],     // Master Shifu & Tigress
  'hero-ironman': COMPANIONS[3] // J.A.R.V.I.S.
};

export const HERO_RELICS_MAP: Record<string, StoryObject> = {
  'hero-naruto': IMPORTANT_OBJECTS[0], // Forbidden Scroll of Sealing
  'hero-goku': IMPORTANT_OBJECTS[1],   // 4-Star Dragon Ball
  'hero-po': IMPORTANT_OBJECTS[2],     // Golden Dragon Scroll
  'hero-ironman': IMPORTANT_OBJECTS[3] // Vibranium Arc Reactor Core
};

export const HERO_PROBLEMS_MAP: Record<string, StoryProblem> = {
  'hero-naruto': {
    id: 'prob-naruto-chakra',
    title: 'The Rogue Tailed-Beast Chakra Geyser',
    hook: 'An ancient sealing barrier beneath the island’s volcano has ruptured, releasing wild crimson chakra storms that threaten to engulf the entire ninja archipelago!',
    emoji: '🌀',
    stakes: 'If the seal is not repaired before sunset, the runaway chakra vortex will blow the island off the map and disrupt the global peace treaty.',
    possibleImpact: 'Red lightning crackles across the whispering jungle, and shadow clones begin acting on their own wild instincts.',
    questionForClass: 'How can Naruto’s unshakeable willpower and the Forbidden Scroll of Sealing stabilize the chakra flow peacefully?'
  },
  'hero-goku': {
    id: 'prob-goku-core',
    title: 'The Subterranean Planetary Energy Overload',
    hook: 'A massive burst of unstable geothermal ki has formed deep inside the island’s magma core, threatening an explosion that could shatter the island into cosmic dust!',
    emoji: '💥',
    stakes: 'King Kai warns that the energy spike is increasing exponentially. The island’s core needs to be defused before it reaches critical mass!',
    possibleImpact: 'Gravity fluctuates across the island, causing boulders to float and hot springs to erupt with glowing golden ki.',
    questionForClass: 'How can Goku’s martial instincts, team cooperation, and the 4-Star Dragon Ball channel the energy safely away?'
  },
  'hero-po': {
    id: 'prob-po-chi',
    title: 'The Jade Realm Spirit Imbalance',
    hook: 'Chaotic spirit energy is bubbling up from the volcano fissure, turning the Valley of Peace’s sacred springs into boiling magma and threatening the sacred peach tree!',
    emoji: '🐼',
    stakes: 'Without balance, the island’s natural harmony will collapse, corrupting the peaceful creatures and trapping the Jade Palace in stone.',
    possibleImpact: 'Misty waterfalls glow with jade fire, and bamboo groves begin to bend and creak in reverse wind currents.',
    questionForClass: 'How can Po’s authentic humor, dumpling wisdom, and the Golden Dragon Scroll restore harmonious inner peace?'
  },
  'hero-ironman': {
    id: 'prob-ironman-meltdown',
    title: 'The Geothermal Arc Grid Malfunction',
    hook: 'An experimental clean-energy geothermal power station installed by Stark Industries has suffered a quantum cascade failure inside the volcanic crater!',
    emoji: '⚡',
    stakes: 'The containment fields are holding at 18% integrity. If breached, a thermal pulse will blackout communications and sink the island’s research reef.',
    possibleImpact: 'Electromagnetic EMP pulses disable compasses and make the island’s metal bridges hum with blinding blue plasma.',
    questionForClass: 'How can Tony Stark’s rapid engineering improvisation and the Vibranium Arc Reactor defuse the thermal overload?'
  }
};

export const HERO_DECISIONS_MAP: Record<string, { question: string; options: { id: 'A' | 'B' | 'C' | 'D'; label: string; votes: number; icon: string; perk: string }[] }> = {
  'hero-naruto': {
    question: 'Rogue Hidden Mist Water Dragons & Razor Torrents ambush the squad in the canyon! How does Naruto counter with elite shinobi jutsu?',
    options: [
      { id: 'A', label: 'Sage Art: Multi-Shadow Clone Wind Scythe Formation', votes: 12, icon: '🌀', perk: '+15 Teamwork' },
      { id: 'B', label: 'Summon Chief Toad Gamabunta to crush the torrent with a Giant Water Bullet', votes: 8, icon: '🐸', perk: '+20 Power' },
      { id: 'C', label: 'Chakra Foot-Grip Water Sprint & Precision Rasengan Blast', votes: 5, icon: '⚡', perk: '+25 Focus' },
      { id: 'D', label: 'Deploy Smoke Bombs & Kunai Wire Traps to outmaneuver the ambush', votes: 3, icon: '🎯', perk: '+30 Ingenuity' }
    ]
  },
  'hero-goku': {
    question: 'A 100x Gravity Ki Anomaly & hostile plasma barrage engulfs the gorge! What Saiyan mastery does Goku deploy to protect the squad?',
    options: [
      { id: 'A', label: 'Instant Transmission Quad-Strike to neutralize all plasma cores instantly', votes: 14, icon: '⚡', perk: '+25 Reflexes' },
      { id: 'B', label: 'Super Saiyan Golden Ki Barrier to shield the entire squad', votes: 9, icon: '🛡️', perk: '+30 Defense' },
      { id: 'C', label: 'Kaio-ken x10 Shockwave to disperse the gravity field', votes: 6, icon: '💥', perk: '+20 Power' },
      { id: 'D', label: 'Channel Planetary Ki to safely stabilize the seismic fracture', votes: 2, icon: '✨', perk: '+15 Harmony' }
    ]
  },
  'hero-po': {
    question: "Lord Shen's fiery cannon barrage and cascading boulder torrents rain over the falls! How does the Dragon Warrior redirect the disaster?",
    options: [
      { id: 'A', label: 'Inner Peace: Fluid Tai Chi Redirection to guide cannonballs into the mist', votes: 15, icon: '☯️', perk: '+30 Inner Peace' },
      { id: 'B', label: 'Furious Five Synchronized Acrobatics to shatter falling boulders mid-air', votes: 8, icon: '🐾', perk: '+20 Discipline' },
      { id: 'C', label: 'Golden Chi Dragon Pulse to harmonize the violent river current', votes: 6, icon: '🐉', perk: '+25 Chi Power' },
      { id: 'D', label: 'Panda Belly Bounce Deflection to launch projectiles safely away', votes: 4, icon: '🐼', perk: '+15 Agility' }
    ]
  },
  'hero-ironman': {
    question: 'An automated swarm of 50,000-volt EMP drones threatens to fry the valley power grid! What tech protocol does Tony Stark execute?',
    options: [
      { id: 'A', label: 'J.A.R.V.I.S. Multi-Target Lock with Repulsor Micro-Pulses', votes: 16, icon: '🎯', perk: '+30 Precision' },
      { id: 'B', label: 'Deploy Nanotech EMP Dampening Matrix over the gorge', votes: 7, icon: '🦾', perk: '+25 High Tech' },
      { id: 'C', label: 'Overcharge Arc Reactor to emit a localized EMP counter-frequency', votes: 5, icon: '⚡', perk: '+20 Strategy' },
      { id: 'D', label: 'Deploy Friday Sub-Orbital Sentry Drones to intercept the swarm', votes: 3, icon: '🚀', perk: '+15 Defense' }
    ]
  }
};

export const HERO_STRATEGIES_MAP: Record<string, { id: string; title: string; type: string; icon: string; summary: string; effort: string; creativeScore: string; color: string }[]> = {
  'hero-naruto': [
    {
      id: 'strat-naruto-rasengan',
      title: 'Sage Art: Giant Rasengan Wind Vortex',
      type: 'Clever Jutsu Innovation',
      icon: '🌀',
      summary: 'Channel massive swirling wind chakra into the caldera center, creating a cool updraft that rapidly solidifies molten lava into safe granite terraces.',
      effort: 'High Willpower',
      creativeScore: '99%',
      color: 'border-orange-400 bg-orange-50/80'
    },
    {
      id: 'strat-naruto-talk',
      title: 'Shinobi Empathy & Heart-to-Heart (Talk-no-Jutsu)',
      type: 'Compassionate Alliance',
      icon: '🤝',
      summary: 'Reach out with deep empathy to the ancient island spirit trapped within the volcano, turning fear and destruction into a collaborative protective bond.',
      effort: 'High Heart',
      creativeScore: '98%',
      color: 'border-amber-400 bg-amber-50/80'
    },
    {
      id: 'strat-naruto-clones',
      title: 'Multi-Shadow Clone Grand Aqueduct',
      type: 'Teamwork Mastery',
      icon: '🍥',
      summary: 'Deploy 200 shadow clones working in perfect harmony to dig an emerald trench that diverts the lava flow safely into the open ocean.',
      effort: 'High Teamwork',
      creativeScore: '96%',
      color: 'border-emerald-400 bg-emerald-50/80'
    }
  ],
  'hero-goku': [
    {
      id: 'strat-goku-spirit',
      title: 'Planetary Spirit Energy Redistribution',
      type: 'Cosmic Ki Harmony',
      icon: '🐉',
      summary: 'Gently gather the dangerous excess volcanic thermal energy into a radiant sphere, then launch it harmlessly into the upper atmosphere to create a protective aurora.',
      effort: 'High Ki Mastery',
      creativeScore: '99%',
      color: 'border-blue-400 bg-blue-50/80'
    },
    {
      id: 'strat-goku-kishield',
      title: 'Super Saiyan Core Containment Barrier',
      type: 'Heroic Courage',
      icon: '✨',
      summary: 'Surround the volcanic chamber with an impenetrable golden Ki dome, giving the companions time to activate the 4-Star Dragon Ball frequency.',
      effort: 'High Courage',
      creativeScore: '97%',
      color: 'border-amber-400 bg-amber-50/80'
    },
    {
      id: 'strat-goku-teleport',
      title: 'Instant Transmission Glacial Coolant',
      type: 'Clever Spatial Tactic',
      icon: '🥋',
      summary: 'Teleport deep subterranean glacier ice directly into the overheating vents, dropping the core temperature to safe levels in seconds.',
      effort: 'High Ingenuity',
      creativeScore: '95%',
      color: 'border-cyan-400 bg-cyan-50/80'
    }
  ],
  'hero-po': [
    {
      id: 'strat-po-chi',
      title: 'Golden Chi Dragon Harmonization',
      type: 'Inner Peace Mastery',
      icon: '🐉',
      summary: 'Unleash the golden dragon of Chi from within, infusing the fiery caldera with tranquility and transforming dangerous magma into peaceful hot spring gardens.',
      effort: 'High Inner Peace',
      creativeScore: '99%',
      color: 'border-amber-400 bg-amber-50/80'
    },
    {
      id: 'strat-po-wuxi',
      title: 'The Legendary Wuxi Finger Hold Defusal',
      type: 'Ancient Secret Art',
      icon: '🥢',
      summary: 'Apply a delicate, respectful tap of the pinky finger to the volcano’s central pressure node, releasing trapped steam in a magnificent celebration fireworks display.',
      effort: 'High Precision',
      creativeScore: '98%',
      color: 'border-emerald-400 bg-emerald-50/80'
    },
    {
      id: 'strat-po-furious5',
      title: 'Furious Five Synchronized Element Stance',
      type: 'Kung Fu Teamwork',
      icon: '🐾',
      summary: 'Coordinate with Master Shifu, Tigress, Monkey, Crane, Viper, and Mantis in a 6-way redirecting kata that guides the lava around the sacred village.',
      effort: 'High Teamwork',
      creativeScore: '96%',
      color: 'border-purple-400 bg-purple-50/80'
    }
  ],
  'hero-ironman': [
    {
      id: 'strat-ironman-inversion',
      title: 'Arc Reactor Polarity Inversion Siphon',
      type: 'Advanced Clean Energy Invention',
      icon: '⚡',
      summary: 'Invert the Vibranium Arc Reactor’s magnetic coil polarity, siphoning the runaway volcanic thermal surge directly into the island’s clean power grid.',
      effort: 'High Intellect',
      creativeScore: '99%',
      color: 'border-cyan-400 bg-cyan-50/80'
    },
    {
      id: 'strat-ironman-nanotech',
      title: 'Nanotech Cryogenic Venting Matrix',
      type: 'Nanotechnology Swarm',
      icon: '🦾',
      summary: 'Disperse a cloud of microscopic thermal-regulating nanobots across all 5 fissures to seal fractures and freeze boiling magma in milliseconds.',
      effort: 'High Tech',
      creativeScore: '97%',
      color: 'border-red-400 bg-red-50/80'
    },
    {
      id: 'strat-ironman-jarvis',
      title: 'J.A.R.V.I.S. Subterranean Pressure Equilibrium',
      type: 'Tactical AI Computing',
      icon: '🤖',
      summary: 'Execute real-time algorithmic pressure equalization by firing micro-concussive pulses that safely vent gas without causing a single crack.',
      effort: 'High Computing',
      creativeScore: '96%',
      color: 'border-purple-400 bg-purple-50/80'
    }
  ]
};

export const TONES = [
  { id: 'excited', label: 'Excited & Energetic', emoji: '🎉', pitch: 1.4, rate: 1.3, sample: 'You will never believe what just happened right before our eyes!' },
  { id: 'mysterious', label: 'Mysterious & Suspenseful', emoji: '🕵️', pitch: 0.8, rate: 0.85, sample: 'A cold whisper echoed through the corridor... and the shadows moved.' },
  { id: 'secretive', label: 'Secretive Whisper', emoji: '🤫', pitch: 1.1, rate: 0.9, sample: 'Lean in closer... nobody else in the temple can know about this key.' },
  { id: 'royal', label: 'Majestic & Heroic', emoji: '👑', pitch: 0.7, rate: 0.8, sample: 'By the courage in our hearts, we shall save the island!' },
  { id: 'robotic', label: 'Robotic & Scientific', emoji: '🤖', pitch: 0.5, rate: 1.05, sample: 'Analyzing island core. Energy spike detected. Computing trajectory.' },
  { id: 'funny', label: 'Goofy & Laughing', emoji: '🤪', pitch: 1.5, rate: 1.25, sample: 'Oops! I definitely didn’t mean to press that shiny button, but here we gooooo!' }
];

export const ACHIEVEMENTS: AchievementBadge[] = [
  { id: 'ach-hero', title: 'Legendary Hero', description: 'Crafted a distinct hero with courage and creativity.', icon: '🦸', color: 'from-amber-400 to-orange-500', unlocked: true },
  { id: 'ach-relic', title: 'Vault Breaker', description: 'Solved the ancient temple dial riddle and unlocked the relic.', icon: '🔑', color: 'from-purple-400 to-pink-500', unlocked: true },
  { id: 'ach-relay', title: 'Baton Master', description: 'Passed the story baton seamlessly across team members.', icon: '🪄', color: 'from-blue-400 to-cyan-500', unlocked: true },
  { id: 'ach-sequencer', title: 'Logic Weaver', description: 'Sequenced scrambled events accurately using cause & effect.', icon: '🧩', color: 'from-emerald-400 to-teal-500', unlocked: true },
  { id: 'ach-twist', title: 'Twist Navigator', description: 'Embraced sudden plot twists with creative adaptability.', icon: '🌀', color: 'from-fuchsia-400 to-rose-500', unlocked: true },
  { id: 'ach-climax', title: 'Volcano Peacemaker', description: 'Forged a brilliant non-violent resolution to the crisis.', icon: '🌋', color: 'from-red-400 to-amber-500', unlocked: true },
  { id: 'ach-voice', title: 'Tone Virtuoso', description: 'Mastered vocal pacing and emotional expression.', icon: '🎭', color: 'from-cyan-400 to-blue-500', unlocked: true },
  { id: 'ach-author', title: 'Published Author', description: 'Collaboratively created and published the class storybook!', icon: '🏆', color: 'from-amber-300 to-yellow-500', unlocked: true }
];

export const TEACHER_PROMPTS: Record<string, string[]> = {
  'level-1': [
    'Prompt the class: What secret motivation drives our hero to accept this quest?',
    'Discuss: How does the companion’s quirk create funny or challenging moments?'
  ],
  'level-2': [
    'Prompt: If the artifact can solve any lock or riddle, what cost or rule does it have?',
    'Facilitate: Connect the problem to the hero’s special ability.'
  ],
  'level-3': [
    'Prompt the active baton holder: Look at what the team before you created and add the next step!',
    'Challenge: Why must cause always come before effect?'
  ],
  'level-4': [
    'Spin the twist wheel with dramatic classroom suspense!',
    'Prompt: How can we shift our tone from mysterious to energetic?'
  ],
  'level-5': [
    'Evaluate: Why is an alliance or invention more rewarding than brute force?',
    'Consensus: Vote on the final strategy to save the island!'
  ],
  'level-6': [
    'Celebrate: Every single team contributed a vital link to this collective story!',
    'Review: Read the published book together using the Read Aloud narration.'
  ]
};
