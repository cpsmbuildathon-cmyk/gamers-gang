import React, { useState } from 'react';
import { GameId, GameMeta } from './types';
import { BackButton, Card } from './components/UI';

// Game Components
import { ReflexGame, MathGame, ColorGame, MemoryGame } from './components/GamesArcade';
import { DungeonGame, EmojiGame, MysteryGame } from './components/GamesCreative';
import { TriviaGame, WordDuelGame, TyperGame } from './components/GamesWord';

const GAMES: GameMeta[] = [
  { id: GameId.TRIVIA, title: "Cosmic Trivia", description: "Infinite AI-generated quiz.", icon: "🌌", isAI: true, color: "text-orange-400" },
  { id: GameId.DUNGEON, title: "Echo Dungeon", description: "Text adventure RPG.", icon: "🏰", isAI: true, color: "text-red-400" },
  { id: GameId.REFLEX, title: "Neon Reflex", description: "Test your reaction speed.", icon: "⚡", isAI: false, color: "text-yellow-400" },
  { id: GameId.EMOJI, title: "Emoji Alchemy", description: "Mix emojis, discover items.", icon: "⚗️", isAI: true, color: "text-green-400" },
  { id: GameId.MATH, title: "Quantum Math", description: "Speed arithmetic.", icon: "🧮", isAI: false, color: "text-blue-400" },
  { id: GameId.WORD_DUEL, title: "Word Duel", description: "AI word chain battle.", icon: "⚔️", isAI: true, color: "text-purple-400" },
  { id: GameId.MEMORY, title: "Memory Grid", description: "Pattern matching.", icon: "🧠", isAI: false, color: "text-cyan-400" },
  { id: GameId.COLOR, title: "Color Chaos", description: "Stroop effect challenge.", icon: "🎨", isAI: false, color: "text-pink-400" },
  { id: GameId.MYSTERY, title: "Mystery 20", description: "Guess the hidden object.", icon: "🕵️", isAI: true, color: "text-indigo-400" },
  { id: GameId.TYPER, title: "Hyper Typer", description: "Type crazy AI sentences.", icon: "⌨️", isAI: true, color: "text-teal-400" },
];

function App() {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  const renderGame = () => {
    switch (activeGame) {
      case GameId.TRIVIA: return <TriviaGame />;
      case GameId.DUNGEON: return <DungeonGame />;
      case GameId.REFLEX: return <ReflexGame />;
      case GameId.MATH: return <MathGame />;
      case GameId.EMOJI: return <EmojiGame />;
      case GameId.WORD_DUEL: return <WordDuelGame />;
      case GameId.MEMORY: return <MemoryGame />;
      case GameId.COLOR: return <ColorGame />;
      case GameId.MYSTERY: return <MysteryGame />;
      case GameId.TYPER: return <TyperGame />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 p-4 md:p-8 selection:bg-cyan-500 selection:text-black">
      <header className="mb-10 text-center relative z-10">
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 neon-text brand-font tracking-wider">
          GAME GANG
        </h1>
        <p className="mt-2 text-slate-400">The AI Arcade Hub</p>
      </header>

      <main className="max-w-6xl mx-auto relative z-10">
        {activeGame ? (
          <div className="animate-fade-in-up">
            <BackButton onClick={() => setActiveGame(null)} />
            <div className="bg-slate-900/50 border border-slate-700/50 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-2xl min-h-[600px] flex flex-col justify-center">
               {renderGame()}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {GAMES.map((game) => (
              <div 
                key={game.id}
                onClick={() => setActiveGame(game.id)}
                className="group relative bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-cyan-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:-translate-y-2 cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-2 opacity-50">
                    {game.isAI && <span className="bg-purple-900 text-purple-200 text-xs px-2 py-1 rounded-full border border-purple-500">AI Powered</span>}
                </div>
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 transform origin-left">{game.icon}</div>
                <h3 className={`text-xl font-bold mb-2 brand-font ${game.color}`}>{game.title}</h3>
                <p className="text-slate-400 text-sm">{game.description}</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
}

export default App;
