import { useState, useEffect } from 'react';

// --- CONTENT ---
const content = {
    truths: [
        "What is your most embarrassing memory?",
        "Who was your first crush?",
        "Have you ever lied to get out of trouble?",
        "What is the most childish thing you still do?",
        "What is a secret you have never told anyone?",
        "What was your first impression of me?",
        "What is a secret fantasy you haven't shared with me yet?",
        "What is your biggest relationship fear?",
        "Describe your perfect romantic evening.",
        "What is a secret you've kept from past partners?",
        "What was the very first thing you noticed about me when we met?",
        "What is your biggest 'green flag' in a partner?",
        "What is the most spontaneous thing you’ve ever done on a date?",
        "What is your favorite physical feature on yourself?",
        "What’s the most romantic thing someone has ever done for you?",
        "What’s the best compliment you’ve ever received?",
        "What was your most awkward dating experience?",
        "Do you believe in chemistry at first sight?",
        "What’s the most adventurous thing you’ve ever did?",
        "What was your first impression of me?",
        "What is a secret fantasy you haven't shared with me yet?",
        "What is your biggest relationship fear?",
        "Describe your perfect romantic evening.",
        "What is a secret you've kept from past partners?",
        "What part of my body were you most excited to see in person tonight?",
        "If we had sex tonight and it was terrible, would you tell me the truth or just ghost me?",
        "What’s the kinkiest thing you’ve ever done with someone you met online?",
        "Have you been talking to or going on dates with anyone else since we started talking?",
        "Do you have any exes I should actually be worried about? What would they say about us?",
        "If I had a secret fetish, what do you *hope* it is, and what do you *fear* it is?",
        "What is the likelihood (0-100%) of us sleeping together after this game ends?",
        "Would you rather kiss me right now or leave and block me forever?",
        "What was your biggest fear about meeting me in real life?",
        "Have you ever slept with someone else while we were in the 'talking' phase?",
        "What was the darkest/weirdest assumption you made about me before we became friends?",
        "What is something I’ve said or done recently that actually worried you?",
        "Who in this room would you survive with the longest in a disaster, and who would you sacrifice first?",
        "If I had a secret that could ruin my reputation, would you keep it or tell your closest person?",
        "What is one thing you noticed about me the moment we met that you’re still trying to process?",
        "Have you ever lied to me about why you couldn't hang out?",
        "Would you be okay with dating someone for 2 years without being intimate?",
        "What's the most 'online' or 'weird' thing you've ever caught me doing?"
    ],
    dares: [
        "Sing the chorus of your favorite song loudly.",
        "Speak in an accent for the next 3 rounds.",
        "Give me a 1-minute massage.",
        "Perform a sensual dance for 1 minute.",
        "Let me do a blindfolded taste test on you.",
        "Whisper a secret seductively in my ear.",
        "Kiss your favorite spot on my body.",
        "Show the most emberising photo in your gallery and tell me the story behind it.",
        "Let’s take a selfie together right now.",
        "Hold my hand for the next 2 minutes while we keep talking.",
        "Let me check the last thing you searched for on Google.",
        "Give me a 1-minute massage.",
        "Perform a sensual dance for 1 minute.",
        "Let me do a blindfolded taste test on you.",
        "Whisper a secret seductively in my ear.",
        "Kiss your favorite spot on my body."
    ]
};

// --- ICONS (lucide-react stand-ins using simple SVG) ---
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
    </svg>
);

export default function App() {
    // --- STATE ---
    const [phase, setPhase] = useState('players'); // players, gameplay

    const [players, setPlayers] = useState([]); // [{ id, name, score }]
    const [newPlayerName, setNewPlayerName] = useState('');

    // Gameplay State
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [turnPhase, setTurnPhase] = useState('reveal'); // reveal, choice, task, outcome
    const [currentTask, setCurrentTask] = useState({ type: null, text: null });

    // --- HANDLERS ---
    const addPlayer = (e) => {
        e.preventDefault();
        if (!newPlayerName.trim()) return;
        setPlayers([...players, { id: Date.now(), name: newPlayerName.trim(), score: 0 }]);
        setNewPlayerName('');
    };

    const removePlayer = (id) => {
        setPlayers(players.filter(p => p.id !== id));
    };

    const startGame = () => {
        if (players.length === 0) return;
        setPhase('gameplay');
        nextTurn();
    };

    const nextTurn = () => {
        const randomPlayer = players[Math.floor(Math.random() * players.length)];
        setCurrentPlayer(randomPlayer);
        setTurnPhase('reveal');
        setCurrentTask({ type: null, text: null });
    };

    const handleChoice = (type) => {
        const questions = content[type === 'truth' ? 'truths' : 'dares'];
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        setCurrentTask({ type, text: randomQuestion });
        setTurnPhase('task');
    };

    const handleOutcome = (success) => {
        if (success) {
            setPlayers(players.map(p =>
                p.id === currentPlayer.id ? { ...p, score: p.score + 1 } : p
            ));
        }
        setTurnPhase('outcome'); // Briefly show outcome? Or just go next. Let's just go next in a moment
        setTimeout(nextTurn, 1000); // 1 second delay before next turn
    };

    // --- RENDERERS ---
    const renderScoreboard = () => (
        <div className="absolute top-4 right-4 bg-zinc-900/80 backdrop-blur-md p-3 rounded-xl border border-neon-purple/30 shadow-[0_0_15px_rgba(168,85,247,0.2)] min-w-[120px]">
            <h3 className="text-xs uppercase tracking-wider text-neon-pink font-bold mb-2">Scores</h3>
            <div className="space-y-1">
                {players.sort((a, b) => b.score - a.score).map(p => (
                    <div key={p.id} className="flex justify-between items-center text-sm">
                        <span className="truncate max-w-[80px] text-gray-300">{p.name}</span>
                        <span className="font-mono text-neon-blue font-bold">{p.score}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-neon-pink/30">

            {/* Background glow effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-purple/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-blue/20 rounded-full blur-[100px] pointer-events-none"></div>

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
                                    <span className="text-lg font-medium">{p.name}</span>
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
                        className={`w-full py-4 rounded-xl font-bold text-xl uppercase tracking-wider transition-all duration-300 ${players.length > 0
                            ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-[1.02]'
                            : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                            }`}
                    >
                        Start Game
                    </button>
                </div>
            )}

            {phase === 'gameplay' && (
                <>
                    {renderScoreboard()}

                    <div className="z-10 flex flex-col items-center w-full max-w-md h-[60vh] justify-center relative">

                        {turnPhase === 'reveal' && currentPlayer && (
                            <div className="text-center animate-in zoom-in duration-500">
                                <p className="text-xl text-zinc-400 mb-2 tracking-widest uppercase">Get ready...</p>
                                <h2 className="text-5xl font-black text-white mb-2 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                    It's <span className="text-neon-blue">{currentPlayer.name}'s</span> turn!
                                </h2>
                                <p className="text-zinc-500 mt-8">Tap to choose your fate</p>
                                <button
                                    onClick={() => setTurnPhase('choice')}
                                    className="mt-8 px-8 py-3 rounded-full border border-zinc-700 hover:bg-zinc-800 transition-colors"
                                >
                                    Continue
                                </button>
                            </div>
                        )}

                        {turnPhase === 'choice' && (
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

                        {turnPhase === 'task' && (
                            <div className={`w-full p-8 rounded-3xl border-2 flex flex-col items-center text-center animate-in zoom-in duration-500 bg-zinc-900/80 backdrop-blur-sm ${currentTask.type === 'truth'
                                ? 'border-neon-blue shadow-[0_0_30px_rgba(6,182,212,0.3)]'
                                : 'border-neon-pink shadow-[0_0_30px_rgba(236,72,153,0.3)]'
                                }`}>
                                <h3 className={`text-2xl font-bold uppercase tracking-widest mb-6 ${currentTask.type === 'truth' ? 'text-neon-blue' : 'text-neon-pink'
                                    }`}>
                                    {currentTask.type}
                                </h3>

                                <p className="text-2xl md:text-3xl font-medium leading-relaxed mb-12">
                                    {currentTask.text}
                                </p>

                                <div className="flex w-full gap-4 mt-auto">
                                    <button
                                        onClick={() => handleOutcome(false)}
                                        className="flex-1 py-4 rounded-xl border border-zinc-700 text-zinc-400 font-bold hover:bg-zinc-800 transition-colors"
                                    >
                                        I didn't (0)
                                    </button>
                                    <button
                                        onClick={() => handleOutcome(true)}
                                        className={`flex-1 py-4 rounded-xl font-bold text-white transition-all shadow-lg ${currentTask.type === 'truth'
                                            ? 'bg-neon-blue hover:bg-neon-blue/80 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]'
                                            : 'bg-neon-pink hover:bg-neon-pink/80 hover:shadow-[0_0_20px_rgba(236,72,153,0.6)]'
                                            }`}
                                    >
                                        I did it (+1)
                                    </button>
                                </div>
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

        </div>
    );
}
