import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  StoryState, 
  LevelId, 
  CharacterArchetype, 
  WorldRealm, 
  StoryObject, 
  StoryProblem, 
  SupportingCompanion, 
  TwistItem, 
  ChoiceOption, 
  StoryEventCard, 
  BatonPassRecord 
} from '../types/story';
import { ACHIEVEMENTS, HEROES, WORLDS, IMPORTANT_OBJECTS, STORY_PROBLEMS, COMPANIONS } from '../data/storyData';

interface StoryContextType extends StoryState {
  setStoryTitle: (title: string) => void;
  setClassName: (name: string) => void;
  setHero: (hero: CharacterArchetype) => void;
  setWorld: (world: WorldRealm) => void;
  setImportantObject: (obj: StoryObject) => void;
  setProblem: (prob: StoryProblem) => void;
  setCompanion: (comp: SupportingCompanion) => void;
  setCurrentLevel: (id: LevelId) => void;
  passBaton: (toHolder: string, contribution: string) => void;
  addStoryEvent: (event: Omit<StoryEventCard, 'id' | 'order' | 'timestamp'>) => void;
  reorderStoryEvents: (newEvents: StoryEventCard[]) => void;
  addTwist: (twist: TwistItem) => void;
  addDecision: (question: string, chosenOption: ChoiceOption) => void;
  setTone: (toneId: string) => void;
  setClimaxSolution: (solution: string) => void;
  setEnding: (ending: StoryState['ending']) => void;
  unlockAchievement: (id: string, earnedBy?: string) => void;
  toggleTeacherMode: () => void;
  toggleMapOverlay: () => void;
  setIsMapOverlayOpen: (open: boolean) => void;
  isActivityModalOpen: boolean;
  setIsActivityModalOpen: (open: boolean) => void;
  openLevelActivity: (id: LevelId) => void;
  closeLevelActivity: () => void;
  setVotingLocked: (locked: boolean) => void;
  setRevealedChoices: (revealed: boolean) => void;
  castVote: (optionId: 'A' | 'B' | 'C' | 'D') => void;
  setupVoting: (question: string, options: ChoiceOption[]) => void;
  addParticipant: (name: string) => void;
  removeParticipant: (name: string) => void;
  renameParticipant: (oldName: string, newName: string) => void;
  setParticipants: (names: string[]) => void;
  setSelectedStoryId: (id: string) => void;
  completeStory: () => void;
  setShowHonorsCeremony: (show: boolean) => void;
  resetStory: () => void;
}

const STORAGE_KEY = 'SKILLIZEE_STORY_SPRINT_ISLAND_V2';

const DEFAULT_PARTICIPANTS = [
  'Team Alpha', 'Team Phoenix', 'Team Nebula', 'Team Voyager', 'Team Titan'
];

const INITIAL_STATE: StoryState = {
  className: 'Class 6-A Story Explorers',
  storyTitle: 'The Legend of the Hidden Realm',
  selectedStoryId: 'naruto-story-1',
  hero: null,
  world: WORLDS[0],
  importantObject: IMPORTANT_OBJECTS[0],
  problem: STORY_PROBLEMS[0],
  companion: COMPANIONS[0],
  storyEvents: [
    {
      id: 'evt-1',
      order: 1,
      chapterId: 'level-1',
      title: 'Arrival at Starter Cove',
      description: 'Naruto Uzumaki tightened his leaf headband, grinning with unstoppable energy as he stepped onto the golden sands of Starter Cove beside Gamakichi.',
      storyteller: 'Team Alpha',
      badge: 'Hero Forge',
      icon: '🍥',
      timestamp: '10:00 AM'
    },
    {
      id: 'evt-2',
      order: 2,
      chapterId: 'level-2',
      title: 'Unlocking the Sun Temple Scroll',
      description: 'Solving the solar prism matrix, the team uncovered the ancient Forbidden Scroll of Sealing pulsing with golden chakra light.',
      storyteller: 'Team Phoenix',
      badge: 'Relic Vault',
      icon: '📜',
      timestamp: '10:08 AM'
    }
  ],
  twists: [],
  decisions: [],
  currentTone: 'excited',
  climaxSolution: null,
  ending: null,
  currentLevelId: 'level-1',
  currentChapterId: 'level-1',
  currentBatonHolder: 'Team Alpha',
  previousBatonHolder: null,
  batonHistory: [
    {
      id: 'baton-1',
      fromHolder: 'Teacher / GM',
      toHolder: 'Team Alpha',
      chapterTitle: 'Level 1: Starter Cove',
      contribution: 'Selected Aria the Brave and calibrated the expedition team.',
      time: '10:00 AM'
    }
  ],
  achievements: ACHIEVEMENTS,
  participants: DEFAULT_PARTICIPANTS,
  storyEnergy: 25,
  isTeacherMode: false,
  isMapOverlayOpen: false,
  votingLocked: false,
  revealedChoices: true,
  activeVoteQuestion: 'Which path through the Waterfall Mist should the hero take?',
  activeVoteOptions: [
    { id: 'A', text: 'Follow the glowing turquoise river rapids', consequence: 'High speed, requires agile balance', votes: 12 },
    { id: 'B', text: 'Climb the slippery crystal waterfall cliffs', consequence: 'Spots hidden cave from above', votes: 16 },
    { id: 'C', text: 'Use the Relic to part the waterfall curtain', consequence: 'Reveals ancient secret passage', votes: 9 },
    { id: 'D', text: 'Send the Companion scout ahead through the mist', consequence: 'Gains vital scout intelligence', votes: 14 }
  ],
  completedLevels: ['level-1'],
  isActivityModalOpen: false
};

const StoryStateContext = createContext<StoryContextType | null>(null);

export const StoryStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StoryState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return { ...INITIAL_STATE, ...parsed };
        }
      } catch (err) {
        console.warn('Failed to parse stored story state, using defaults', err);
      }
    }
    return INITIAL_STATE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('LocalStorage save failed', err);
    }
  }, [state]);

  const setStoryTitle = (title: string) => {
    setState(prev => ({ ...prev, storyTitle: title }));
  };

  const setClassName = (name: string) => {
    setState(prev => ({ ...prev, className: name }));
  };

  const setHero = (hero: CharacterArchetype) => {
    const defaultStoryId = hero?.id ? `${hero.id.replace('hero-', '')}-story-1` : 'naruto-story-1';
    setState(prev => ({
      ...prev,
      hero,
      selectedStoryId: defaultStoryId,
      storyEnergy: Math.min(100, prev.storyEnergy + 15)
    }));
  };

  const setSelectedStoryId = (id: string) => {
    setState(prev => ({
      ...prev,
      selectedStoryId: id
    }));
  };

  const setWorld = (world: WorldRealm) => {
    setState(prev => ({
      ...prev,
      world,
      storyEnergy: Math.min(100, prev.storyEnergy + 10)
    }));
  };

  const setImportantObject = (obj: StoryObject) => {
    setState(prev => ({
      ...prev,
      importantObject: obj,
      storyEnergy: Math.min(100, prev.storyEnergy + 15)
    }));
  };

  const setProblem = (prob: StoryProblem) => {
    setState(prev => ({
      ...prev,
      problem: prob,
      storyEnergy: Math.min(100, prev.storyEnergy + 15)
    }));
  };

  const setCompanion = (comp: SupportingCompanion) => {
    setState(prev => ({
      ...prev,
      companion: comp,
      storyEnergy: Math.min(100, prev.storyEnergy + 10)
    }));
  };

  const setCurrentLevel = (id: LevelId) => {
    setState(prev => {
      const completed = prev.completedLevels.includes(id)
        ? prev.completedLevels
        : [...prev.completedLevels, id];
      return {
        ...prev,
        currentLevelId: id,
        currentChapterId: id,
        completedLevels: completed,
        storyEnergy: Math.min(100, prev.storyEnergy + 10)
      };
    });
  };

  const passBaton = (toHolder: string, contribution: string) => {
    setState(prev => {
      const newRecord: BatonPassRecord = {
        id: `baton-${Date.now()}`,
        fromHolder: prev.currentBatonHolder,
        toHolder,
        chapterTitle: `Quest ${prev.currentLevelId}`,
        contribution,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      return {
        ...prev,
        previousBatonHolder: prev.currentBatonHolder,
        currentBatonHolder: toHolder,
        batonHistory: [...prev.batonHistory, newRecord],
        storyEnergy: Math.min(100, prev.storyEnergy + 12)
      };
    });
  };

  const addStoryEvent = (event: Omit<StoryEventCard, 'id' | 'order' | 'timestamp'>) => {
    setState(prev => {
      const newEvent: StoryEventCard = {
        ...event,
        id: `event-${Date.now()}`,
        order: prev.storyEvents.length + 1,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      return {
        ...prev,
        storyEvents: [...prev.storyEvents, newEvent],
        storyEnergy: Math.min(100, prev.storyEnergy + 15)
      };
    });
  };

  const reorderStoryEvents = (newEvents: StoryEventCard[]) => {
    setState(prev => ({
      ...prev,
      storyEvents: newEvents.map((evt, idx) => ({ ...evt, order: idx + 1 }))
    }));
  };

  const addTwist = (twist: TwistItem) => {
    setState(prev => ({
      ...prev,
      twists: [...prev.twists, twist],
      storyEnergy: Math.min(100, prev.storyEnergy + 15)
    }));
  };

  const addDecision = (question: string, chosenOption: ChoiceOption) => {
    setState(prev => ({
      ...prev,
      decisions: [...prev.decisions, { question, chosenOption }],
      storyEnergy: Math.min(100, prev.storyEnergy + 10)
    }));
  };

  const setTone = (toneId: string) => {
    setState(prev => ({ ...prev, currentTone: toneId }));
  };

  const setClimaxSolution = (solution: string) => {
    setState(prev => ({ ...prev, climaxSolution: solution, storyEnergy: 95 }));
  };

  const setEnding = (ending: StoryState['ending']) => {
    setState(prev => ({
      ...prev,
      ending,
      storyEnergy: 100
    }));
  };

  const unlockAchievement = (id: string, earnedBy?: string) => {
    setState(prev => ({
      ...prev,
      achievements: prev.achievements.map(ach => 
        ach.id === id ? { ...ach, unlocked: true, earnedBy: earnedBy || prev.currentBatonHolder } : ach
      )
    }));
  };

  const toggleTeacherMode = () => {
    setState(prev => ({ ...prev, isTeacherMode: !prev.isTeacherMode }));
  };

  const toggleMapOverlay = () => {
    setState(prev => ({ 
      ...prev, 
      isActivityModalOpen: false,
      isMapOverlayOpen: !prev.isMapOverlayOpen 
    }));
  };

  const setIsMapOverlayOpen = (open: boolean) => {
    setState(prev => ({ ...prev, isMapOverlayOpen: open }));
  };

  const setIsActivityModalOpen = (open: boolean) => {
    setState(prev => ({ ...prev, isActivityModalOpen: open }));
  };

  const openLevelActivity = (id: LevelId) => {
    setState(prev => ({ ...prev, currentLevelId: id, isActivityModalOpen: true }));
  };

  const closeLevelActivity = () => {
    setState(prev => ({ ...prev, isActivityModalOpen: false }));
  };

  const setVotingLocked = (locked: boolean) => {
    setState(prev => ({ ...prev, votingLocked: locked }));
  };

  const setRevealedChoices = (revealed: boolean) => {
    setState(prev => ({ ...prev, revealedChoices: revealed }));
  };

  const castVote = (optionId: 'A' | 'B' | 'C' | 'D') => {
    setState(prev => ({
      ...prev,
      activeVoteOptions: prev.activeVoteOptions.map(opt => 
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      )
    }));
  };

  const setupVoting = (question: string, options: ChoiceOption[]) => {
    setState(prev => ({
      ...prev,
      activeVoteQuestion: question,
      activeVoteOptions: options,
      votingLocked: false,
      revealedChoices: false
    }));
  };

  const addParticipant = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState(prev => ({
      ...prev,
      participants: prev.participants.includes(trimmed) 
        ? prev.participants 
        : [...prev.participants, trimmed]
    }));
  };

  const removeParticipant = (name: string) => {
    setState(prev => {
      const filtered = prev.participants.filter(p => p !== name);
      return {
        ...prev,
        participants: filtered.length > 0 ? filtered : ['Team Alpha']
      };
    });
  };

  const renameParticipant = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === oldName) return;
    setState(prev => ({
      ...prev,
      participants: prev.participants.map(p => (p === oldName ? trimmed : p)),
      currentBatonHolder: prev.currentBatonHolder === oldName ? trimmed : prev.currentBatonHolder
    }));
  };

  const setParticipants = (names: string[]) => {
    if (!names || names.length === 0) return;
    setState(prev => ({
      ...prev,
      participants: names
    }));
  };

  const setShowHonorsCeremony = (show: boolean) => {
    setState(prev => ({ ...prev, showHonorsCeremony: show }));
  };

  const completeStory = () => {
    setState(prev => ({
      ...prev,
      currentLevelId: 'level-6',
      isActivityModalOpen: true,
      isStoryCompleted: true,
      showHonorsCeremony: true,
      completedLevels: ['level-1', 'level-2', 'level-3', 'level-4', 'level-5', 'level-6'],
      achievements: prev.achievements.map((ach, idx) => ({
        ...ach,
        unlocked: true,
        earnedBy: ach.earnedBy || prev.participants[idx % prev.participants.length] || 'Classroom Authors'
      }))
    }));
  };

  const resetStory = () => {
    if (window.confirm('Are you sure you want to reset and start a new Story Sprint Island Quest?')) {
      setState(INITIAL_STATE);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <StoryStateContext.Provider
      value={{
        ...state,
        setStoryTitle,
        setClassName,
        setHero,
        setWorld,
        setImportantObject,
        setProblem,
        setCompanion,
        setCurrentLevel,
        passBaton,
        addStoryEvent,
        reorderStoryEvents,
        addTwist,
        addDecision,
        setTone,
        setClimaxSolution,
        setEnding,
        unlockAchievement,
        toggleTeacherMode,
        toggleMapOverlay,
        setIsMapOverlayOpen,
        isActivityModalOpen: state.isActivityModalOpen ?? false,
        setIsActivityModalOpen,
        openLevelActivity,
        closeLevelActivity,
        setVotingLocked,
        setRevealedChoices,
        castVote,
        setupVoting,
        addParticipant,
        removeParticipant,
        renameParticipant,
        setParticipants,
        setSelectedStoryId,
        completeStory,
        setShowHonorsCeremony,
        resetStory
      }}
    >
      {children}
    </StoryStateContext.Provider>
  );
};

export const useStoryState = () => {
  const context = useContext(StoryStateContext);
  if (!context) {
    throw new Error('useStoryState must be used within a StoryStateProvider');
  }
  return context;
};
