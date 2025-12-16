export enum GameId {
  TRIVIA = 'trivia',
  DUNGEON = 'dungeon',
  WORD_DUEL = 'word_duel',
  EMOJI = 'emoji',
  MYSTERY = 'mystery',
  REFLEX = 'reflex',
  MEMORY = 'memory',
  MATH = 'math',
  COLOR = 'color',
  TYPER = 'typer'
}

export interface GameMeta {
  id: GameId;
  title: string;
  description: string;
  icon: string;
  isAI: boolean;
  color: string;
}

export interface TriviaQuestion {
  question: string;
  options: string[];
  correctAnswer: string; // The correct option string
  fact: string;
}

export interface DungeonState {
  history: { role: 'user' | 'model'; text: string }[];
  hp: number;
  inventory: string[];
  gameOver: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
