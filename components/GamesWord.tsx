import React, { useState, useEffect, useCallback } from 'react';
import { Button, Loader, Card } from './UI';
import { generateTriviaQuestion, checkWordDuel, getTypingText } from '../services/gemini';
import { TriviaQuestion } from '../types';

// --- COSMIC TRIVIA ---
export const TriviaGame: React.FC = () => {
  const [question, setQuestion] = useState<TriviaQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);

  const loadQuestion = useCallback(async () => {
    setLoading(true);
    setRevealed(false);
    setSelected(null);
    const q = await generateTriviaQuestion();
    setQuestion(q);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadQuestion();
  }, [loadQuestion]);

  const handleSelect = (opt: string) => {
    if (revealed) return;
    setSelected(opt);
    setRevealed(true);
    if (opt === question?.correctAnswer) setScore(s => s + 100);
  };

  if (loading || !question) return <div className="flex h-full items-center justify-center"><Loader /></div>;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-2xl font-bold brand-font text-orange-400">Cosmic Trivia</h2>
         <span className="text-xl">Score: {score}</span>
      </div>
      
      <Card className="mb-6">
        <p className="text-xl font-medium mb-4">{question.question}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              disabled={revealed}
              className={`p-4 rounded-lg text-left transition-all ${
                revealed
                  ? opt === question.correctAnswer
                    ? 'bg-green-600 border-green-400'
                    : opt === selected
                    ? 'bg-red-600 border-red-400'
                    : 'bg-slate-700 opacity-50'
                  : 'bg-slate-700 hover:bg-slate-600 border border-slate-600'
              } border`}
            >
              {opt}
            </button>
          ))}
        </div>
      </Card>

      {revealed && (
        <div className="text-center animate-fade-in">
          <div className="mb-4 bg-blue-900/30 p-4 rounded border border-blue-500/30">
            <span className="font-bold text-blue-300">Fact:</span> {question.fact}
          </div>
          <Button onClick={loadQuestion}>Next Question</Button>
        </div>
      )}
    </div>
  );
};

// --- WORD DUEL ---
export const WordDuelGame: React.FC = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Start by typing any word!");
  const [gameOver, setGameOver] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input || loading || gameOver) return;
    
    const playerWord = input.toLowerCase().trim();
    const currentWord = history.length > 0 ? history[history.length - 1] : "";
    
    // Basic local validation
    if (currentWord && playerWord[0] !== currentWord[currentWord.length - 1]) {
      setMessage(`Must start with '${currentWord[currentWord.length - 1]}'`);
      return;
    }
    if (history.includes(playerWord)) {
      setMessage("Word already used!");
      return;
    }

    setLoading(true);
    setInput("");
    
    // AI turn
    const res = await checkWordDuel(currentWord, playerWord);
    
    if (res.isValid) {
      setHistory(prev => [...prev, playerWord, res.nextWord!]);
      setMessage(`AI played: ${res.nextWord}`);
    } else {
      setMessage(`Invalid: ${res.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 brand-font text-green-400">Word Duel</h2>
      <Card className="h-64 overflow-y-auto mb-4 flex flex-col-reverse">
        <div className="flex flex-wrap gap-2">
            {history.map((w, i) => (
                <span key={i} className={`px-3 py-1 rounded ${i % 2 === 0 ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                    {w}
                </span>
            ))}
        </div>
      </Card>
      <div className="text-center mb-4 h-6 text-yellow-300">{loading ? <Loader /> : message}</div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input 
           value={input}
           onChange={(e) => setInput(e.target.value)}
           placeholder="Type a word..."
           className="flex-1 bg-slate-800 border border-slate-600 p-2 rounded"
           autoFocus
        />
        <Button type="submit" disabled={loading}>Submit</Button>
      </form>
    </div>
  );
};

// --- HYPER TYPER ---
export const TyperGame: React.FC = () => {
    const [targetText, setTargetText] = useState("");
    const [input, setInput] = useState("");
    const [startTime, setStartTime] = useState<number | null>(null);
    const [wpm, setWpm] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const loadGame = async () => {
        setLoading(true);
        setWpm(null);
        setInput("");
        setStartTime(null);
        const txt = await getTypingText();
        setTargetText(txt);
        setLoading(false);
    }

    useEffect(() => {
        loadGame();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        if (!startTime) setStartTime(Date.now());
        setInput(val);

        if (val === targetText) {
            const timeMin = (Date.now() - (startTime || Date.now())) / 60000;
            const words = targetText.split(' ').length;
            setWpm(Math.round(words / timeMin));
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 brand-font text-pink-500">Hyper Typer</h2>
            {loading ? <Loader /> : (
                <>
                 <Card className="mb-6 p-6 text-lg leading-relaxed text-slate-300 font-mono select-none">
                    {targetText.split('').map((char, i) => {
                        let color = "text-slate-500";
                        if (i < input.length) {
                            color = input[i] === char ? "text-green-400" : "text-red-500 bg-red-900/50";
                        }
                        return <span key={i} className={color}>{char}</span>
                    })}
                 </Card>
                 {wpm ? (
                     <div className="text-center">
                         <h3 className="text-4xl font-bold text-green-400 mb-4">{wpm} WPM</h3>
                         <Button onClick={loadGame}>Next Level</Button>
                     </div>
                 ) : (
                    <textarea 
                        value={input}
                        onChange={handleChange}
                        className="w-full bg-slate-800 border border-slate-600 rounded p-4 font-mono focus:border-pink-500 outline-none h-32"
                        placeholder="Start typing..."
                        autoComplete="off"
                        spellCheck={false}
                    />
                 )}
                </>
            )}
        </div>
    )
}
