import React, { useState, useEffect, useRef } from 'react';
import { Button, Loader, Card } from './UI';
import { playDungeon, mixEmojis, startMystery, checkMysteryGuess } from '../services/gemini';
import { DungeonState, ChatMessage } from '../types';

// --- DUNGEON TEXT ---
export const DungeonGame: React.FC = () => {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const start = async () => {
    setLoading(true);
    const intro = await playDungeon([], "Start Game");
    setHistory([{ role: 'model', text: intro }]);
    setLoading(false);
  };

  useEffect(() => {
    if (history.length === 0) start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const action = input;
    setInput("");
    const newHistory = [...history, { role: 'user', text: action } as ChatMessage];
    setHistory(newHistory);
    setLoading(true);
    
    const response = await playDungeon(newHistory, action);
    setHistory(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  return (
    <div className="h-[500px] flex flex-col w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2 brand-font text-red-500">Echo Dungeon</h2>
      <div className="flex-1 overflow-y-auto bg-black/30 p-4 rounded-lg mb-4 space-y-3 border border-slate-700" ref={scrollRef}>
        {history.map((msg, i) => (
          <div key={i} className={`${msg.role === 'user' ? 'text-cyan-400 text-right' : 'text-slate-300 text-left'}`}>
             <span className={`inline-block p-2 rounded ${msg.role === 'user' ? 'bg-cyan-900/30' : 'bg-slate-800'}`}>
               {msg.role === 'model' && <span className="text-red-500 font-bold mr-2">DM:</span>}
               {msg.text}
             </span>
          </div>
        ))}
        {loading && <Loader />}
      </div>
      <form onSubmit={handleAction} className="flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What do you want to do?"
          className="flex-1 bg-slate-800 border border-slate-600 rounded p-2 focus:border-cyan-500 outline-none"
        />
        <Button type="submit" disabled={loading}>Act</Button>
      </form>
    </div>
  );
};

// --- EMOJI ALCHEMY ---
export const EmojiGame: React.FC = () => {
  const [e1, setE1] = useState("🔥");
  const [e2, setE2] = useState("💧");
  const [result, setResult] = useState<{name: string, description: string} | null>(null);
  const [loading, setLoading] = useState(false);

  const emojis = ["🔥", "💧", "🌍", "💨", "⚡", "❄️", "🌱", "💀", "🤖", "👽", "🦄", "🍔", "🚗", "🚀"];

  const mix = async () => {
    setLoading(true);
    setResult(null);
    const res = await mixEmojis(e1, e2);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold mb-6 brand-font text-yellow-500">Emoji Alchemy</h2>
      <div className="flex justify-center items-center gap-4 mb-8">
        <select value={e1} onChange={(e) => setE1(e.target.value)} className="text-4xl bg-slate-800 p-2 rounded border border-slate-600">
            {emojis.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
        <span className="text-2xl">+</span>
        <select value={e2} onChange={(e) => setE2(e.target.value)} className="text-4xl bg-slate-800 p-2 rounded border border-slate-600">
            {emojis.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>
      
      <Button onClick={mix} disabled={loading} className="w-full mb-6">FUSE</Button>
      
      {loading && <Loader />}
      
      {result && (
        <Card className="animate-fade-in">
           <h3 className="text-xl font-bold text-yellow-400 mb-2">{result.name}</h3>
           <p className="text-slate-300">{result.description}</p>
        </Card>
      )}
    </div>
  );
};

// --- MYSTERY 20 ---
export const MysteryGame: React.FC = () => {
    const [secretSet, setSecretSet] = useState(false);
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [secret, setSecret] = useState("");
    const [won, setWon] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const init = async () => {
        setLoading(true);
        const s = await startMystery();
        setSecret(s);
        setSecretSet(true);
        setHistory([{role: 'model', text: "I have picked an object. Ask me Yes/No questions to guess it!"}]);
        setLoading(false);
    };

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [history]);

    const handleGuess = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!input.trim() || loading || won) return;
        const guess = input;
        setInput("");
        setHistory(prev => [...prev, {role: 'user', text: guess}]);
        setLoading(true);

        const res = await checkMysteryGuess(secret, guess);
        setHistory(prev => [...prev, {role: 'model', text: res.won ? `CORRECT! The word was ${secret}.` : res.response}]);
        if (res.won) setWon(true);
        setLoading(false);
    }

    return (
        <div className="h-[500px] flex flex-col w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-2 brand-font text-purple-400">Mystery 20</h2>
            <div className="flex-1 overflow-y-auto bg-black/30 p-4 rounded-lg mb-4 space-y-3 border border-slate-700" ref={scrollRef}>
                {history.map((msg, i) => (
                <div key={i} className={`${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <span className={`inline-block px-3 py-2 rounded-lg ${msg.role === 'user' ? 'bg-purple-900/50 text-white' : 'bg-slate-800 text-purple-200'}`}>
                        {msg.text}
                    </span>
                </div>
                ))}
                {loading && <Loader />}
            </div>
            {!won ? (
                <form onSubmit={handleGuess} className="flex gap-2">
                    <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Is it a..."
                    className="flex-1 bg-slate-800 border border-slate-600 rounded p-2"
                    />
                    <Button type="submit" disabled={loading}>Ask</Button>
                </form>
            ) : (
                <Button onClick={() => { setWon(false); setHistory([]); init(); }}>Play Again</Button>
            )}
        </div>
    )
}
