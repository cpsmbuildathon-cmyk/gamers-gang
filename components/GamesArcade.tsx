import React, { useState, useEffect, useRef } from 'react';
import { Button, Card } from './UI';

// --- REFLEX GAME ---
export const ReflexGame: React.FC = () => {
  const [gameState, setGameState] = useState<'start' | 'waiting' | 'ready' | 'clicked'>('start');
  const [startTime, setStartTime] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const startGame = () => {
    setGameState('waiting');
    setScore(null);
    const delay = Math.random() * 2000 + 1000; // 1-3 seconds
    timeoutRef.current = window.setTimeout(() => {
      setGameState('ready');
      setStartTime(performance.now());
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'waiting') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setGameState('start');
      alert("Too early!");
    } else if (gameState === 'ready') {
      const time = performance.now() - startTime;
      setScore(time);
      setGameState('clicked');
    }
  };

  return (
    <div className="text-center h-full flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4 brand-font text-purple-400">Neon Reflex</h2>
      {gameState === 'start' || gameState === 'clicked' ? (
        <div className="space-y-4">
          {score && <div className="text-4xl text-green-400 mb-4">{score.toFixed(0)} ms</div>}
          <Button onClick={startGame}>Start Test</Button>
        </div>
      ) : (
        <div 
          onMouseDown={handleClick}
          className={`w-64 h-64 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-100 ${
            gameState === 'waiting' ? 'bg-red-500/20 hover:bg-red-500/30 border-red-500' : 'bg-green-500 border-green-400 shadow-[0_0_50px_rgba(34,197,94,0.8)]'
          } border-4`}
        >
          <span className="text-xl font-bold">{gameState === 'waiting' ? 'WAIT...' : 'CLICK!'}</span>
        </div>
      )}
    </div>
  );
};

// --- QUANTUM MATH ---
export const MathGame: React.FC = () => {
  const [problem, setProblem] = useState("");
  const [answer, setAnswer] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let interval: number | undefined;
    if (playing && timer > 0) {
      interval = window.setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      setPlaying(false);
    }
    return () => {
      if (interval !== undefined) clearInterval(interval);
    };
  }, [playing, timer]);

  const generateProblem = () => {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    let probString = `${a} ${op} ${b}`;
    let ans = 0;
    // eslint-disable-next-line no-eval
    if (op === '+') ans = a + b;
    if (op === '-') ans = a - b;
    if (op === '*') ans = a * b;
    
    setProblem(probString);
    setAnswer(ans);
    setUserAnswer("");
  };

  const startGame = () => {
    setScore(0);
    setTimer(30);
    setPlaying(true);
    generateProblem();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(userAnswer) === answer) {
      setScore(s => s + 10);
      generateProblem();
    } else {
        // Penalty for wrong answer to prevent spamming
        setScore(s => Math.max(0, s - 5));
        setUserAnswer(""); 
    }
  };

  return (
    <div className="text-center w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 brand-font text-blue-400">Quantum Math</h2>
      {!playing ? (
        <div className="space-y-4">
          <p>Solve as many problems as possible in 30 seconds.</p>
          {score > 0 && <p className="text-xl text-yellow-400">Last Score: {score}</p>}
          <Button onClick={startGame}>Start Sprint</Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between text-lg font-mono">
            <span>Time: {timer}s</span>
            <span>Score: {score}</span>
          </div>
          <div className="text-5xl font-bold py-8">{problem}</div>
          <form onSubmit={handleSubmit}>
            <input 
              type="number" 
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded p-4 text-center text-2xl outline-none focus:border-blue-500"
              autoFocus
            />
          </form>
        </div>
      )}
    </div>
  );
};

// --- COLOR CHAOS (STROOP) ---
export const ColorGame: React.FC = () => {
  const colors = ['RED', 'BLUE', 'GREEN', 'YELLOW'];
  const colorMap: Record<string, string> = {
    'RED': 'text-red-500',
    'BLUE': 'text-blue-500',
    'GREEN': 'text-green-500',
    'YELLOW': 'text-yellow-500'
  };
  
  const [currentWord, setCurrentWord] = useState('');
  const [currentColor, setCurrentColor] = useState('');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const nextRound = () => {
    const w = colors[Math.floor(Math.random() * colors.length)];
    const c = colors[Math.floor(Math.random() * colors.length)];
    setCurrentWord(w);
    setCurrentColor(c);
  };

  const startGame = () => {
    setScore(0);
    setTimer(20);
    setIsActive(true);
    nextRound();
  };

  useEffect(() => {
    let interval: number | undefined;
    if (isActive && timer > 0) {
      interval = window.setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval !== undefined) clearInterval(interval);
    };
  }, [isActive, timer]);

  const handleChoice = (matches: boolean) => {
    const isMatch = currentWord === currentColor;
    if (matches === isMatch) {
      setScore(s => s + 1);
    } else {
      setScore(s => Math.max(0, s - 1));
    }
    nextRound();
  };

  return (
    <div className="text-center w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 brand-font text-pink-500">Color Chaos</h2>
      {!isActive ? (
        <div className="space-y-4">
          <p>Does the WORD match the COLOR? 20 Seconds.</p>
          {score > 0 && <p className="text-xl">Score: {score}</p>}
          <Button onClick={startGame}>Start Chaos</Button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between mb-8 font-mono">
            <span>Time: {timer}</span>
            <span>Score: {score}</span>
          </div>
          <div className={`text-6xl font-black mb-12 ${colorMap[currentColor]}`}>
            {currentWord}
          </div>
          <div className="flex gap-4 justify-center">
            <Button variant="danger" onClick={() => handleChoice(false)}>NO</Button>
            <Button variant="primary" onClick={() => handleChoice(true)}>YES</Button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MEMORY GRID ---
export const MemoryGame: React.FC = () => {
  const icons = ['🚀', '👾', '💎', '🔥', '🤖', '🪐', '🌟', '🎸'];
  const [cards, setCards] = useState<{id: number, icon: string, flipped: boolean, matched: boolean}[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  
  const setupGame = () => {
    const duplicated = [...icons, ...icons];
    const shuffled = duplicated.sort(() => Math.random() - 0.5).map((icon, i) => ({
      id: i, icon, flipped: false, matched: false
    }));
    setCards(shuffled);
    setFlipped([]);
    setMatches(0);
  };

  useEffect(() => {
    setupGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCardClick = (id: number) => {
    if (flipped.length === 2) return;
    if (cards[id].flipped || cards[id].matched) return;

    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);
    setFlipped([...flipped, id]);
  };

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first].icon === cards[second].icon) {
        setCards(prev => prev.map(c => c.id === first || c.id === second ? { ...c, matched: true } : c));
        setMatches(m => m + 1);
        setFlipped([]);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => c.id === first || c.id === second ? { ...c, flipped: false } : c));
          setFlipped([]);
        }, 800);
      }
    }
  }, [flipped, cards]);

  return (
    <div className="w-full max-w-lg mx-auto text-center">
       <h2 className="text-2xl font-bold mb-4 brand-font text-cyan-400">Memory Grid</h2>
       <div className="flex justify-between mb-4">
         <span>Pairs: {matches}/{icons.length}</span>
         <button onClick={setupGame} className="text-sm underline text-slate-400">Reset</button>
       </div>
       <div className="grid grid-cols-4 gap-3">
         {cards.map(card => (
           <div 
             key={card.id}
             onClick={() => handleCardClick(card.id)}
             className={`aspect-square rounded-lg flex items-center justify-center text-3xl cursor-pointer transition-all duration-300 transform ${
               card.flipped || card.matched ? 'bg-indigo-600 rotate-0' : 'bg-slate-700 hover:bg-slate-600 rotate-y-180'
             }`}
           >
             {(card.flipped || card.matched) ? card.icon : ''}
           </div>
         ))}
       </div>
    </div>
  );
};
