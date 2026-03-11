import { useState, useEffect } from 'react';
import fallbackData from './fallbacks.json';

// --- NO STATIC CONTENT (100% AI DRIVEN) ---// --- ICONS (lucide-react stand-ins using simple SVG) ---
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
    </svg>
);

export default function App() {
    // --- STATE ---
    const [phase, setPhase] = useState('landing'); // landing, players, gameplay, endgame
    const [selectedGame, setSelectedGame] = useState(null);

    const [players, setPlayers] = useState([]); // [{ id, name, score }]
    const [newPlayerName, setNewPlayerName] = useState('');

    // Gameplay State
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [currentPair, setCurrentPair] = useState(null); // Used for compatibility test
    const [stats, setStats] = useState({ compatibilityMatches: 0, compatibilityTurns: 0 }); // Global stats for couples game
    const [turnPhase, setTurnPhase] = useState('reveal'); // reveal, loading, choice, task, stats, outcome
    const [currentTask, setCurrentTask] = useState({ type: null, text: null, item: null });

    // --- HANDLERS ---

    // AI Integration
    const fetchAIQuestion = async (gameMode, subType) => {
        // Determine Prompt
        let promptText = "You are a game designer creating a spicy 18+ party game for adult couples. Your job is to generate ONE unique question or dare. The text MUST BE SHORT, SIMPLE, direct, and under 15 words. NO long paragraphs. Return ONLY the text, NO quotes, NO emojis.";
        if (gameMode === 'truth_or_dare') {
            if (subType === 'truth') promptText += " Create a short, intimate 'Truth' question. Example: 'What is your biggest secret fantasy?'";
            if (subType === 'dare') promptText += " Create a short, simple, sexy 'Dare'. Example: 'Kiss me on the neck for 10 seconds.'";
        } else if (gameMode === 'never_have_i_ever') {
            promptText += " Create a short, scandalous 'Never have I ever' statement. Example: 'Never have I ever sent a nude.'";
        } else if (gameMode === 'most_likely_to') {
            promptText += " Create a short, spicy 'Most likely to' prompt. Example: 'Most likely to suggest a threesome.'";
        } else if (gameMode === 'compatibility_test') {
            promptText += " Create a short relationship question for couples. Example: 'What is my favorite sexual position?'";
        } else if (gameMode === 'light_dare') {
            promptText += " Create a short romance penalty dare. Example: 'Give me a 30-second back rub.'";
        }

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "YOUR_API_KEY_HERE";

            const fetchPromise = fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite-preview-02-05:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }] }]
                })
            });
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Request Timeout")), 4000));

            const response = await Promise.race([fetchPromise, timeoutPromise]);
            const data = await response.json();

            if (data.candidates && data.candidates.length > 0) {
                return data.candidates[0].content.parts[0].text.trim();
            }
        } catch (e) {
            console.error("AI fetch failed, falling back to local DB", e);
        }

        // Fallback to local DB if API fails
        if (gameMode === 'would_you_rather') return null; // handled separately

        // Deduplicated pop logic
        const updatePool = (poolKey) => {
            let pool = fallbackPools[poolKey] || [];
            if (pool.length === 0) {
                // If empty, re-shuffle from source
                pool = [...(fallbackData[poolKey] || [])].sort(() => 0.5 - Math.random());
            }
            const item = pool.pop();
            setFallbackPools(prev => ({ ...prev, [poolKey]: pool }));
            return item || "Wildcard! Take a shot or kiss the person next to you.";
        };

        if (gameMode === 'truth_or_dare') return updatePool(subType === 'truth' ? 'truths' : 'dares');
        if (gameMode === 'never_have_i_ever') return updatePool('never_have_i_ever');
        if (gameMode === 'most_likely_to') return updatePool('most_likely_to');
        if (gameMode === 'compatibility_test') return updatePool('compatibility_test');
        if (gameMode === 'light_dare') return updatePool('light_dares');

        return "Wildcard! Give a compliment to the person across from you.";
    };

    // Would You Rather AI Gen handles JSON formatting separately
    const fetchWouldYouRather = async () => {
        const promptText = `You are a game designer creating a spicy 18+ party game for adult couples. Create ONE unique, provocative 'Would You Rather' dilemma. Keep choices SHORT and simple, under 6 words each.
You MUST return the output as a raw JSON string matching exactly this schema and nothing else (no markdown blocks, no conversational filler):
{ "text": "Would you rather [Short Choice A] or [Short Choice B]?", "optionA": "[Short Choice A]", "optionB": "[Short Choice B]", "statsA": [Random number 1-99 representing popularity percent] }`;

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "YOUR_API_KEY_HERE";

            const fetchPromise = fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
            });
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Request Timeout")), 4000));

            const response = await Promise.race([fetchPromise, timeoutPromise]);
            const data = await response.json();

            if (data.candidates && data.candidates.length > 0) {
                const textOutput = data.candidates[0].content.parts[0].text.trim().replace(/```json|```/g, '');
                return JSON.parse(textOutput);
            }
        } catch (e) {
            console.error("WYR fetch failed", e);
        }

        let pool = fallbackPools.would_you_rather || [];
        if (pool.length === 0) {
            pool = [...(fallbackData.would_you_rather || [])].sort(() => 0.5 - Math.random());
        }
        const item = pool.pop();
        setFallbackPools(prev => ({ ...prev, would_you_rather: pool }));
        return item || { text: "Would you rather kiss the person to your left or right?", optionA: "Left", optionB: "Right", statsA: 50 };
    }
    const selectGame = (gameType) => {
        setSelectedGame(gameType);
        setPhase('players');
    };

    const addPlayer = (e) => {
        e.preventDefault();
        if (!newPlayerName.trim()) return;
        setPlayers([...players, { id: Date.now(), name: newPlayerName.trim(), score: 0, lives: 5 }]);
        setNewPlayerName('');
    };

    const removePlayer = (id) => {
        setPlayers(players.filter(p => p.id !== id));
    };

    const startGame = () => {
        if (players.length === 0) return;
        // reset scores and lives if starting fresh
        setPlayers(players.map(p => ({ ...p, score: 0, lives: 5 })));
        setStats({ compatibilityMatches: 0, compatibilityTurns: 0 });
        setPhase('gameplay');
        nextTurn();
    };

    const endGame = () => {
        setPhase('endgame');
    };

    const resetGame = () => {
        setPhase('players');
    };

    const backToMenu = () => {
        setPhase('landing');
        setSelectedGame(null);
    };

    const nextTurn = () => {
        if (selectedGame === 'compatibility_test' && players.length >= 2) {
            let shuffled = [...players].sort(() => 0.5 - Math.random());
            setCurrentPair([shuffled[0], shuffled[1]]);
            setCurrentPlayer(null);
        } else {
            const randomPlayer = players[Math.floor(Math.random() * players.length)];
            setCurrentPlayer(randomPlayer);
            setCurrentPair(null);
        }
        setTurnPhase('reveal');
        setCurrentTask({ type: null, text: null, item: null });
    };

    const handleChoice = async (type) => {
        if (selectedGame === 'truth_or_dare') {
            setTurnPhase('loading');
            const randomQuestion = await fetchAIQuestion('truth_or_dare', type);
            setCurrentTask({ type, text: randomQuestion });
            setTurnPhase('task');
        } else if (selectedGame === 'never_have_i_ever') {
            setTurnPhase('loading');
            const randomQuestion = await fetchAIQuestion('never_have_i_ever');
            setCurrentTask({ type: 'never_have_i_ever', text: randomQuestion });
            setTurnPhase('task');
        } else if (selectedGame === 'most_likely_to') {
            setTurnPhase('loading');
            const randomQuestion = await fetchAIQuestion('most_likely_to');
            setCurrentTask({ type: 'most_likely_to', text: randomQuestion });
            setTurnPhase('task');
        } else if (selectedGame === 'would_you_rather') {
            // Deprecated path: `initWYRTurn` handles this now via Next Turn button bypassing choice menu entirely
            setTurnPhase('task');
        } else if (selectedGame === 'compatibility_test') {
            setTurnPhase('loading');
            const randomQuestion = await fetchAIQuestion('compatibility_test');
            setCurrentTask({ type: 'compatibility_test', text: randomQuestion });
            setTurnPhase('task');
        }
    };

    const handleOutcome = async (successOrId) => {
        if (selectedGame === 'compatibility_test' && currentTask.type === 'compatibility_test') {
            setStats(s => ({ ...s, compatibilityTurns: s.compatibilityTurns + 1, compatibilityMatches: successOrId === true ? s.compatibilityMatches + 1 : s.compatibilityMatches }));

            if (successOrId === true) {
                setPlayers(players.map(p =>
                    (currentPair && (p.id === currentPair[0].id || p.id === currentPair[1].id)) ? { ...p, score: p.score + 1 } : p
                ));
                setTurnPhase('outcome');
                setTimeout(nextTurn, 1000);
            } else {
                setTurnPhase('loading');
                const randomDare = await fetchAIQuestion('light_dare');
                setCurrentTask({ type: 'light_dare', text: randomDare });
                setTurnPhase('task');
            }
            return;
        }

        if (currentTask.type === 'light_dare') {
            setTurnPhase('outcome');
            setTimeout(nextTurn, 1000);
            return;
        }

        if (selectedGame === 'truth_or_dare') {
            if (successOrId) {
                setPlayers(players.map(p =>
                    p.id === currentPlayer.id ? { ...p, score: p.score + 1 } : p
                ));
            }
        } else if (selectedGame === 'never_have_i_ever') {
            if (successOrId) { // "I have done it" = loses life
                setPlayers(players.map(p =>
                    p.id === currentPlayer.id ? { ...p, lives: Math.max(0, p.lives - 1) } : p
                ));
            }
        } else if (selectedGame === 'most_likely_to') {
            // successOrId is the voted player's ID
            setPlayers(players.map(p =>
                p.id === successOrId ? { ...p, score: p.score + 1 } : p
            ));
        } else if (selectedGame === 'would_you_rather') {
            setPlayers(players.map(p =>
                p.id === currentPlayer.id ? { ...p, score: p.score + 1 } : p
            ));
        }

        setTurnPhase('outcome'); // Briefly show outcome? Or just go next. Let's just go next in a moment
        setTimeout(nextTurn, 1000); // 1 second delay before next turn
    };

    const handleChoiceWYR = async () => {
        setTurnPhase('loading');
        const randomItem = await fetchWouldYouRather();
        if (randomItem) {
            setCurrentTask({ type: 'would_you_rather', text: randomItem.text, item: randomItem });
        }
        setTurnPhase('task');
    };

    const initWYRTurn = () => {
        handleChoiceWYR();
    }

    // --- RENDERERS ---
    const renderScoreboard = () => (
        <div className="absolute top-4 right-4 flex flex-col items-end gap-3 z-50">
            <div className="bg-zinc-900/80 backdrop-blur-md p-3 rounded-xl border border-neon-purple/30 shadow-[0_0_15px_rgba(168,85,247,0.2)] min-w-[120px]">
                <h3 className="text-xs uppercase tracking-wider text-neon-pink font-bold mb-2">
                    {selectedGame === 'never_have_i_ever' ? 'Lives' : 'Scores'}
                </h3>
                <div className="space-y-1">
                    {players.sort((a, b) => selectedGame === 'never_have_i_ever' ? b.lives - a.lives : b.score - a.score).map(p => (
                        <div key={p.id} className="flex justify-between items-center text-sm gap-4">
                            <span className={`truncate max-w-[80px] ${selectedGame === 'never_have_i_ever' && p.lives === 0 ? 'text-zinc-600 line-through' : 'text-gray-300'}`}>{p.name}</span>
                            <span className={`font-mono font-bold ${selectedGame === 'never_have_i_ever' ? (p.lives > 2 ? 'text-green-400' : p.lives > 0 ? 'text-amber-400' : 'text-red-600') : 'text-neon-blue'}`}>
                                {selectedGame === 'never_have_i_ever' ? "❤️".repeat(p.lives) || "💀" : p.score}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {phase === 'gameplay' && (
                <button
                    onClick={endGame}
                    className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg border border-red-500/50 text-red-500 bg-zinc-900 hover:bg-red-500 hover:text-white transition-colors shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                >
                    End Game
                </button>
            )}
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-neon-pink/30">

            {/* Background glow effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-purple/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-blue/20 rounded-full blur-[100px] pointer-events-none"></div>

            {phase === 'landing' && (
                <div className="z-10 flex flex-col items-center animate-in fade-in zoom-in duration-500 w-full max-w-sm">
                    <h1 className="text-5xl md:text-6xl font-black mb-12 text-center text-transparent bg-clip-text bg-gradient-to-br from-neon-pink via-neon-purple to-neon-blue filter drop-shadow-[0_0_20px_rgba(168,85,247,0.5)] leading-tight tracking-tight">
                        PARTY <br /> GAMES
                    </h1>

                    <div className="flex flex-col w-full gap-4">
                        <button
                            onClick={() => selectGame('truth_or_dare')}
                            className="group relative px-6 py-5 rounded-2xl bg-zinc-900 border border-neon-blue text-white font-bold text-xl hover:bg-neon-blue/10 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] overflow-hidden"
                        >
                            <span className="relative z-10 text-neon-blue group-hover:text-glow uppercase tracking-wider">Truth or Dare</span>
                        </button>

                        <button
                            onClick={() => selectGame('never_have_i_ever')}
                            className="group relative px-6 py-5 rounded-2xl bg-zinc-900 border border-neon-pink text-white font-bold text-xl hover:bg-neon-pink/10 transition-all duration-300 shadow-[0_0_15px_rgba(236,72,153,0.2)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] overflow-hidden"
                        >
                            <span className="relative z-10 text-neon-pink group-hover:text-glow uppercase tracking-wider">Never Have I Ever</span>
                        </button>

                        <button
                            onClick={() => selectGame('most_likely_to')}
                            className="group relative px-6 py-5 rounded-2xl bg-zinc-900 border border-neon-purple text-white font-bold text-xl hover:bg-neon-purple/10 transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] overflow-hidden"
                        >
                            <span className="relative z-10 text-neon-purple group-hover:text-glow uppercase tracking-wider">Most Likely To</span>
                        </button>

                        <button
                            onClick={() => selectGame('would_you_rather')}
                            className="group relative px-6 py-5 rounded-2xl bg-zinc-900 border border-amber-500 text-white font-bold text-xl hover:bg-amber-500/10 transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] overflow-hidden"
                        >
                            <span className="relative z-10 text-amber-500 group-hover:text-glow uppercase tracking-wider">Would You Rather</span>
                        </button>

                        <button
                            onClick={() => selectGame('compatibility_test')}
                            className="group relative px-6 py-5 rounded-2xl bg-zinc-900 border border-teal-500 text-white font-bold text-xl hover:bg-teal-500/10 transition-all duration-300 shadow-[0_0_15px_rgba(20,184,166,0.2)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] overflow-hidden"
                        >
                            <span className="relative z-10 text-teal-500 group-hover:text-glow uppercase tracking-wider">The Compatibility Test</span>
                        </button>
                    </div>
                </div>
            )}

            {phase === 'players' && (
                <div className="z-10 flex flex-col items-center w-full max-w-md animate-in slide-in-from-bottom duration-500">
                    <h2 className="text-3xl font-bold mb-6 text-neon-purple drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] uppercase tracking-wider">
                        Who's Playing?
                    </h2>

                    <form onSubmit={addPlayer} className="w-full flex gap-2 mb-8">
                        <input
                            type="text"
                            value={newPlayerName}
                            onChange={(e) => setNewPlayerName(e.target.value)}
                            placeholder="Enter name..."
                            className="flex-1 bg-zinc-900/80 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all text-white placeholder-zinc-500"
                        />
                        <button
                            type="submit"
                            className="bg-neon-purple text-white px-6 py-3 rounded-xl font-bold hover:bg-neon-purple/80 transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                        >
                            Add
                        </button>
                    </form>

                    <div className="w-full max-h-[40vh] overflow-y-auto space-y-2 mb-8 pr-2 custom-scrollbar">
                        {players.length === 0 ? (
                            <p className="text-zinc-500 text-center italic py-4">Add at least one player to start.</p>
                        ) : (
                            players.map(p => (
                                <div key={p.id} className="flex justify-between items-center bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 group hover:border-zinc-700 transition-colors">
                                    <span className="text-lg font-medium">
                                        {p.name} {selectedGame === 'never_have_i_ever' && <span className="text-sm text-zinc-500 ml-2">(5 ❤️)</span>}
                                    </span>
                                    <button
                                        onClick={() => removePlayer(p.id)}
                                        className="text-zinc-500 hover:text-neon-pink transition-colors p-2"
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <button
                        onClick={startGame}
                        disabled={players.length === 0}
                        className={`w-full py-4 rounded-xl font-bold text-xl uppercase tracking-wider transition-all duration-300 mb-4 ${players.length > 0
                            ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-[1.02]'
                            : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                            }`}
                    >
                        Start Game
                    </button>

                    <button
                        onClick={backToMenu}
                        className="text-zinc-500 hover:text-zinc-300 transition-colors underline text-sm"
                    >
                        Back to Menu
                    </button>
                </div>
            )}

            {phase === 'gameplay' && (
                <>
                    {renderScoreboard()}

                    <div className="z-10 flex flex-col items-center w-full max-w-md h-[60vh] justify-center relative">

                        {turnPhase === 'reveal' && (currentPlayer || currentPair) && (
                            <div className="text-center animate-in zoom-in duration-500">
                                <p className="text-xl text-zinc-400 mb-2 tracking-widest uppercase">Get ready...</p>
                                <h2 className="text-5xl font-black text-white mb-2 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                    {selectedGame === 'compatibility_test' && currentPair ? (
                                        <>It's <span className="text-teal-500">{currentPair[0].name}</span> & <span className="text-teal-500">{currentPair[1].name}'s</span> turn!</>
                                    ) : (
                                        <>It's <span className="text-neon-blue">{currentPlayer?.name}'s</span> turn!</>
                                    )}
                                </h2>

                                {selectedGame === 'never_have_i_ever' && currentPlayer?.lives === 0 && (
                                    <p className="text-red-500 font-bold mt-4 uppercase tracking-widest animate-pulse">Eliminated! Drink Every Turn!</p>
                                )}

                                <p className="text-zinc-500 mt-8">
                                    {selectedGame === 'truth_or_dare' ? 'Tap to choose your fate' : 'Tap to reveal statement'}
                                </p>
                                <button
                                    onClick={() => {
                                        if (selectedGame === 'truth_or_dare') setTurnPhase('choice');
                                        else if (selectedGame === 'would_you_rather') initWYRTurn();
                                        else handleChoice(selectedGame);
                                    }}
                                    className="mt-8 px-8 py-3 rounded-full border border-zinc-700 hover:bg-zinc-800 transition-colors"
                                >
                                    Continue
                                </button>
                            </div>
                        )}

                        {turnPhase === 'choice' && selectedGame === 'truth_or_dare' && (
                            <div className="flex flex-col w-full gap-6 animate-in slide-in-from-right duration-500">
                                <button
                                    onClick={() => handleChoice('truth')}
                                    className="w-full py-12 rounded-3xl bg-zinc-900 border-2 border-neon-blue flex items-center justify-center hover:bg-neon-blue/5 transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] hover:scale-[1.02] group"
                                >
                                    <span className="text-4xl font-black text-neon-blue tracking-widest uppercase group-hover:text-glow">TRUTH</span>
                                </button>
                                <button
                                    onClick={() => handleChoice('dare')}
                                    className="w-full py-12 rounded-3xl bg-zinc-900 border-2 border-neon-pink flex items-center justify-center hover:bg-neon-pink/5 transition-all shadow-[0_0_20px_rgba(236,72,153,0.2)] hover:shadow-[0_0_40px_rgba(236,72,153,0.5)] hover:scale-[1.02] group"
                                >
                                    <span className="text-4xl font-black text-neon-pink tracking-widest uppercase group-hover:text-glow">DARE</span>
                                </button>
                            </div>
                        )}

                        {turnPhase === 'choice' && selectedGame !== 'truth_or_dare' && selectedGame !== 'never_have_i_ever' && selectedGame !== 'most_likely_to' && selectedGame !== 'compatibility_test' && selectedGame !== 'would_you_rather' && (
                            <div className="flex flex-col w-full gap-6 animate-in slide-in-from-right duration-500 text-center">
                                <p className="text-zinc-400 italic mb-4">Content for {selectedGame.replace(/_/g, ' ')} coming soon...</p>
                                <button
                                    onClick={() => handleOutcome(false)}
                                    className="w-full py-6 rounded-3xl bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center hover:bg-zinc-800 transition-all font-bold text-zinc-300"
                                >
                                    Skip Turn
                                </button>
                            </div>
                        )}

                        {turnPhase === 'loading' && (
                            <div className="text-center flex flex-col items-center justify-center animate-pulse">
                                <div className="w-16 h-16 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mb-6"></div>
                                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple tracking-widest uppercase">
                                    The AI is thinking...
                                </h2>
                            </div>
                        )}

                        {turnPhase === 'task' && (
                            <div className={`w-full p-8 rounded-3xl border-2 flex flex-col items-center text-center animate-in zoom-in duration-500 bg-zinc-900/80 backdrop-blur-sm ${selectedGame === 'never_have_i_ever' ? 'border-neon-pink shadow-[0_0_30px_rgba(236,72,153,0.3)]' : selectedGame === 'most_likely_to' ? 'border-neon-purple shadow-[0_0_30px_rgba(168,85,247,0.3)]' : selectedGame === 'would_you_rather' ? 'border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)]' : selectedGame === 'compatibility_test' ? 'border-teal-500 shadow-[0_0_30px_rgba(20,184,166,0.3)]' : currentTask.type === 'truth'
                                ? 'border-neon-blue shadow-[0_0_30px_rgba(6,182,212,0.3)]'
                                : 'border-neon-pink shadow-[0_0_30px_rgba(236,72,153,0.3)]'
                                }`}>
                                <h3 className={`text-2xl font-bold uppercase tracking-widest mb-6 ${selectedGame === 'never_have_i_ever' ? 'text-neon-pink' : selectedGame === 'most_likely_to' ? 'text-neon-purple' : selectedGame === 'would_you_rather' ? 'text-amber-500' : selectedGame === 'compatibility_test' ? 'text-teal-500' : currentTask.type === 'truth' ? 'text-neon-blue' : 'text-neon-pink'
                                    }`}>
                                    {selectedGame === 'never_have_i_ever' ? 'Never Have I Ever' : selectedGame === 'most_likely_to' ? 'Most Likely To' : selectedGame === 'would_you_rather' ? 'Would You Rather' : selectedGame === 'compatibility_test' ? (currentTask.type === 'light_dare' ? 'Penalty Dare' : 'Compatibility Test') : currentTask.type}
                                </h3>

                                <p className="text-2xl md:text-3xl font-medium leading-relaxed mb-12">
                                    {currentTask.text}
                                </p>

                                {selectedGame === 'would_you_rather' ? (
                                    <div className="flex flex-col w-full gap-4 mt-auto">
                                        <button
                                            onClick={() => {
                                                setTurnPhase('stats');
                                            }}
                                            className="w-full py-6 rounded-xl border border-amber-500/50 text-amber-500 font-bold hover:bg-amber-500 hover:text-white transition-all shadow-md leading-tight text-lg"
                                        >
                                            {currentTask.item?.optionA}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setTurnPhase('stats');
                                            }}
                                            className="w-full py-6 rounded-xl border border-teal-500/50 text-teal-500 font-bold hover:bg-teal-500 hover:text-white transition-all shadow-md leading-tight text-lg"
                                        >
                                            {currentTask.item?.optionB}
                                        </button>
                                    </div>
                                ) : currentTask.type === 'light_dare' ? (
                                    <button onClick={() => handleOutcome(true)} className="w-full py-4 rounded-xl border border-teal-500/50 text-teal-500 font-bold hover:bg-teal-500 hover:text-white transition-all shadow-md leading-tight text-lg">
                                        We Did It!
                                    </button>
                                ) : selectedGame === 'compatibility_test' ? (
                                    <div className="flex flex-col w-full gap-4 mt-auto">
                                        <button onClick={() => handleOutcome(true)} className="w-full py-4 rounded-xl font-bold bg-teal-500 text-white hover:bg-teal-600 transition-all shadow-md leading-tight text-lg">
                                            We Matched! (+1 Point)
                                        </button>
                                        <button onClick={() => handleOutcome(false)} className="w-full py-4 rounded-xl border border-rose-500/50 text-rose-500 font-bold hover:bg-rose-500 hover:text-white transition-all shadow-md leading-tight text-lg">
                                            No Match (Light Dare)
                                        </button>
                                    </div>
                                ) : selectedGame === 'most_likely_to' ? (
                                    <div className="w-full flex flex-col gap-3 mt-auto">
                                        <p className="text-zinc-400 text-sm uppercase tracking-widest mb-2 font-bold animate-pulse">Count 1, 2, 3... and Vote!</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            {players.map(p => (
                                                <button
                                                    key={p.id}
                                                    onClick={() => handleOutcome(p.id)}
                                                    className="py-3 px-4 rounded-xl border border-neon-purple/50 bg-zinc-800 text-zinc-300 font-bold hover:bg-neon-purple hover:text-white hover:border-neon-purple transition-all leading-tight shadow-md"
                                                >
                                                    {p.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex w-full gap-4 mt-auto">
                                        <button
                                            onClick={() => handleOutcome(false)}
                                            className="flex-1 py-4 rounded-xl border border-zinc-700 text-zinc-400 font-bold hover:bg-zinc-800 transition-colors leading-tight"
                                        >
                                            {selectedGame === 'never_have_i_ever' ? "I haven't (Safe)" : "I didn't (0)"}
                                        </button>
                                        <button
                                            onClick={() => handleOutcome(true)}
                                            className={`flex-1 py-4 rounded-xl font-bold text-white transition-all shadow-lg leading-tight ${selectedGame === 'never_have_i_ever' ? 'bg-red-600 hover:bg-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.6)]' : currentTask.type === 'truth'
                                                ? 'bg-neon-blue hover:bg-neon-blue/80 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]'
                                                : 'bg-neon-pink hover:bg-neon-pink/80 hover:shadow-[0_0_20px_rgba(236,72,153,0.6)]'
                                                }`}
                                        >
                                            {selectedGame === 'never_have_i_ever' ? "I have (Drink & -1 ❤️)" : "I did it (+1)"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {turnPhase === 'stats' && selectedGame === 'would_you_rather' && (
                            <div className="w-full p-8 rounded-3xl border-2 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)] flex flex-col items-center text-center animate-in zoom-in duration-500 bg-zinc-900/80 backdrop-blur-sm">
                                <h3 className="text-2xl font-bold uppercase tracking-widest text-amber-500 mb-6">Global Stats</h3>
                                <p className="text-xl md:text-2xl font-medium leading-relaxed mb-8">
                                    {currentTask.text}
                                </p>

                                <div className="w-full space-y-6 mb-12">
                                    {/* Option A Stat */}
                                    <div className="w-full">
                                        <div className="flex justify-between text-sm font-bold mb-2">
                                            <span className="text-amber-500 truncate max-w-[70%] text-left">{currentTask.item?.optionA}</span>
                                            <span className="text-amber-500">{currentTask.item?.statsA}%</span>
                                        </div>
                                        <div className="w-full h-4 bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${currentTask.item?.statsA}%` }}></div>
                                        </div>
                                    </div>

                                    {/* Option B Stat */}
                                    <div className="w-full">
                                        <div className="flex justify-between text-sm font-bold mb-2">
                                            <span className="text-teal-500 truncate max-w-[70%] text-left">{currentTask.item?.optionB}</span>
                                            <span className="text-teal-500">{100 - currentTask.item?.statsA}%</span>
                                        </div>
                                        <div className="w-full h-4 bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-teal-500 transition-all duration-1000" style={{ width: `${100 - currentTask.item?.statsA}%` }}></div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleOutcome(true)}
                                    className="w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg bg-amber-500 hover:bg-amber-600 hover:shadow-[0_0_20px_rgba(245,158,11,0.6)] uppercase tracking-widest"
                                >
                                    Next Turn
                                </button>
                            </div>
                        )}

                        {turnPhase === 'outcome' && (
                            <div className="text-center animate-pulse">
                                <h2 className="text-4xl font-black text-neon-purple">Updating Score...</h2>
                            </div>
                        )}

                    </div>
                </>
            )}

            {phase === 'endgame' && (
                <div className="z-10 flex flex-col items-center w-full max-w-md animate-in zoom-in duration-500">
                    <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple mb-8 filter drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                        Game Over!
                    </h2>

                    {selectedGame === 'compatibility_test' && players.length === 2 && stats.compatibilityTurns > 0 && (
                        <div className="w-full bg-zinc-900/50 border border-teal-500/50 rounded-3xl p-6 mb-8 backdrop-blur-sm text-center">
                            <h3 className="text-xl uppercase tracking-widest text-teal-500 mb-2">Couple Score</h3>
                            <p className="text-5xl font-black text-white mb-4">
                                {Math.round((stats.compatibilityMatches / stats.compatibilityTurns) * 100)}%
                            </p>
                            <p className="text-zinc-400 italic">
                                {(stats.compatibilityMatches / stats.compatibilityTurns) >= 0.8 ? "You guys are soulmates!" :
                                    (stats.compatibilityMatches / stats.compatibilityTurns) >= 0.5 ? "A solid connection!" : "You might need to communicate more..."}
                            </p>
                        </div>
                    )}

                    <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 mb-8 backdrop-blur-sm">
                        <h3 className="text-xl uppercase tracking-widest text-zinc-400 text-center mb-6">
                            {selectedGame === 'never_have_i_ever' ? 'Survivors' : 'Final Scores'}
                        </h3>
                        <div className="space-y-3">
                            {players.sort((a, b) => selectedGame === 'never_have_i_ever' ? b.lives - a.lives : b.score - a.score).map((p, index) => (
                                <div key={p.id} className="flex justify-between items-center p-3 bg-zinc-800/50 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <span className={`font-black text-xl w-6 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-600' : 'text-zinc-500'}`}>
                                            #{index + 1}
                                        </span>
                                        <span className={`text-xl font-bold ${selectedGame === 'never_have_i_ever' && p.lives === 0 ? 'text-zinc-600 line-through' : ''}`}>{p.name}</span>
                                    </div>
                                    <span className={`text-2xl font-mono font-black ${selectedGame === 'never_have_i_ever' ? 'text-red-500' : 'text-neon-pink'}`}>
                                        {selectedGame === 'never_have_i_ever' ? "❤️".repeat(p.lives) || "💀" : p.score}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={resetGame}
                        className="w-full py-4 rounded-xl font-bold text-xl uppercase tracking-wider transition-all duration-300 bg-gradient-to-r from-neon-pink to-neon-purple text-white shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:shadow-[0_0_30px_rgba(236,72,153,0.8)] hover:scale-[1.02] mb-4"
                    >
                        Play Again
                    </button>

                    <button
                        onClick={backToMenu}
                        className="text-zinc-500 hover:text-zinc-300 transition-colors underline text-sm"
                    >
                        Back to Menu
                    </button>
                </div>
            )}

        </div>
    );
}
