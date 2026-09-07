export type LevelId = 
  | 'level-1' 
  | 'level-2' 
  | 'level-3' 
  | 'level-4' 
  | 'level-5' 
  | 'level-6';

export type ChapterId = LevelId | '1.1' | '2.1' | '3.1' | '4.1' | '5.1' | '6.1';

export interface IslandLocation {
  id: LevelId;
  name: string;
  tagline: string;
  emoji: string;
  iconImage?: string;
  coords: { x: number; y: number }; // percentage on island map
  color: string;
  levelNumber: number;
  questTitle: string;
  description: string;
  activityType: 'forge' | 'vault' | 'relay' | 'waterfall' | 'volcano' | 'storybook';
}

export interface CharacterArchetype {
  id: string;
  name: string;
  title: string;
  avatar: string;
  emoji: string;
  image?: string;
  color: string;
  personality: string;
  strength: string;
  specialAbility: string;
  signatureMove?: string;
  quote: string;
  description: string;
  moral?: string;
  storyArchetype?: string;
  teachingNote?: string;
  soundUrl?: string;
  soundStartTime?: number;
  soundDuration?: number;
  gifs?: string[];
  themeStyles?: {
    cardBg: string;
    borderClass: string;
    badgeBg: string;
    accentText: string;
    statColors: {
      courage: string;
      ingenuity: string;
      teamwork: string;
      willpower: string;
    };
  };
  stats?: {
    courage: number;
    ingenuity: number;
    teamwork: number;
    willpower: number;
  };
}

export interface WorldRealm {
  id: string;
  name: string;
  subtitle: string;
  emoji: string;
  image?: string;
  themeColor: string;
  skyColor: string;
  groundColor: string;
  fogColor: string;
  ambientColor: string;
  description: string;
  features: string[];
  landmarks: string[];
}

export interface StoryObject {
  id: string;
  name: string;
  category: string;
  emoji: string;
  image?: string;
  glowColor: string;
  power: string;
  description: string;
  origin: string;
}

export interface StoryProblem {
  id: string;
  title: string;
  hook: string;
  emoji: string;
  image?: string;
  stakes: string;
  possibleImpact: string;
  questionForClass: string;
}

export interface SupportingCompanion {
  id: string;
  name: string;
  archetype: string;
  emoji: string;
  image?: string;
  quirk: string;
  howTheyHelp: string;
  howTheyComplicate: string;
}

export interface TwistItem {
  id: string;
  category: string;
  title: string;
  emoji: string;
  image?: string;
  description: string;
  storyPrompt: string;
}

export interface ChoiceOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
  consequence: string;
  votes: number;
}

export interface StoryEventCard {
  id: string;
  order: number;
  chapterId: string;
  title: string;
  description: string;
  storyteller: string;
  badge: string;
  icon: string;
  timestamp: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  earnedBy?: string;
}

export interface BatonPassRecord {
  id: string;
  fromHolder: string;
  toHolder: string;
  chapterTitle: string;
  contribution: string;
  time: string;
}

export interface StoryState {
  className: string;
  storyTitle: string;
  hero: CharacterArchetype | null;
  world: WorldRealm | null;
  importantObject: StoryObject | null;
  problem: StoryProblem | null;
  companion: SupportingCompanion | null;
  storyEvents: StoryEventCard[];
  twists: TwistItem[];
  decisions: { question: string; chosenOption: ChoiceOption }[];
  currentTone: string;
  climaxSolution: string | null;
  ending: {
    type?: string;
    summary?: string;
    moral?: string;
    problemResolution?: string;
    heroFate?: string;
    objectFate?: string;
    companionOutcome?: string;
  } | null;
  currentLevelId: LevelId;
  currentChapterId: string;
  currentBatonHolder: string;
  previousBatonHolder: string | null;
  batonHistory: BatonPassRecord[];
  achievements: AchievementBadge[];
  participants: string[];
  storyEnergy: number; // 0 - 100
  isTeacherMode: boolean;
  votingLocked: boolean;
  revealedChoices: boolean;
  activeVoteQuestion: string | null;
  activeVoteOptions: ChoiceOption[];
  completedLevels: LevelId[];
  isMapOverlayOpen: boolean;
  isActivityModalOpen?: boolean;
  selectedStoryId?: string;
  isStoryCompleted?: boolean;
  showHonorsCeremony?: boolean;
}
