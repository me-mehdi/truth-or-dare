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
        "Let me check the last thing you searched for on Google.",
        "Give me a 1-minute massage.",
        "Perform a sensual dance for 1 minute.",
        "Let me do a blindfolded taste test on you.",
        "Whisper a secret seductively in my ear.",
        "Kiss your favorite spot on my body."
    ],
    never_have_i_ever: [
        "Never have I ever lied to a partner.",
        "Never have I ever ghosted someone after a first date.",
        "Never have I ever snooped through my partner's phone.",
        "Never have I ever kissed someone in this room.",
        "Never have I ever sent a risky text to the wrong person.",
        "Never have I ever faked being sick to get out of a date.",
        "Never have I ever stayed friends with an ex.",
        "Never have I ever crushed on a friend's partner.",
        "Never have I ever used a dating app while in a relationship.",
        "Never have I ever flirted my way out of a ticket or a problem."
    ],
    most_likely_to: [
        "Most likely to end up in jail for something stupid.",
        "Most likely to forget their own anniversary.",
        "Most likely to become a millionaire and lose it all in a week.",
        "Most likely to survive a zombie apocalypse.",
        "Most likely to dramatically trip in public and pretend it was a dance move.",
        "Most likely to talk their way out of a speeding ticket.",
        "Most likely to secretly be a spy.",
        "Most likely to spend all their money on a ridiculous impulse buy.",
        "Most likely to randomly disappear and move to a new country.",
        "Most likely to start a cult by accident."
    ],
    would_you_rather: [
        { text: "Would you rather always have to sing instead of speaking or always have to dance instead of walking?", optionA: "Sing instead of speaking", optionB: "Dance instead of walking", statsA: 34 },
        { text: "Would you rather only be able to kiss for the rest of your life or only be able to hug?", optionA: "Only kiss", optionB: "Only hug", statsA: 68 },
        { text: "Would you rather know how you die or when you die?", optionA: "How you die", optionB: "When you die", statsA: 42 },
        { text: "Would you rather constantly itch or constantly be in pain?", optionA: "Constantly itch", optionB: "Constantly be in pain", statsA: 20 },
        { text: "Would you rather find true love today or win the lottery next year?", optionA: "True love today", optionB: "Lottery next year", statsA: 55 },
        { text: "Would you rather have a rewind button or a pause button on your life?", optionA: "Rewind button", optionB: "Pause button", statsA: 78 },
        { text: "Would you rather never use the internet again or never go outside again?", optionA: "No internet", optionB: "No outside", statsA: 15 },
        { text: "Would you rather accidentally like an old photo of your ex or accidentally text them 'I miss you'?", optionA: "Like an old photo", optionB: "Text 'I miss you'", statsA: 82 },
        { text: "Would you rather always say everything on your mind or never speak again?", optionA: "Say everything", optionB: "Never speak", statsA: 30 },
        { text: "Would you rather be famous when you are alive and forgotten when you die or unknown when you are alive but famous after you die?", optionA: "Famous alive", optionB: "Famous after death", statsA: 45 }
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
    const [phase, setPhase] = useState('landing'); // landing, players, gameplay, endgame
    const [selectedGame, setSelectedGame] = useState(null);

    const [players, setPlayers] = useState([]); // [{ id, name, score }]
    const [newPlayerName, setNewPlayerName] = useState('');

    // Gameplay State
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [turnPhase, setTurnPhase] = useState('reveal'); // reveal, choice, task, stats, outcome
    const [currentTask, setCurrentTask] = useState({ type: null, text: null, item: null });

    // --- HANDLERS ---
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
        const randomPlayer = players[Math.floor(Math.random() * players.length)];
        setCurrentPlayer(randomPlayer);
        setTurnPhase('reveal');
        setCurrentTask({ type: null, text: null, item: null });
    };

    const handleChoice = (type) => {
        if (selectedGame === 'truth_or_dare') {
            const questions = content[type === 'truth' ? 'truths' : 'dares'];
            const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
            setCurrentTask({ type, text: randomQuestion });
            setTurnPhase('task');
        } else if (selectedGame === 'never_have_i_ever') {
            const questions = content.never_have_i_ever;
            const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
            setCurrentTask({ type: 'never_have_i_ever', text: randomQuestion });
            setTurnPhase('task');
        } else if (selectedGame === 'most_likely_to') {
            const questions = content.most_likely_to;
            const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
            setCurrentTask({ type: 'most_likely_to', text: randomQuestion });
            setTurnPhase('task');
        } else if (selectedGame === 'would_you_rather') {
            const questions = content.would_you_rather;
            const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
            setCurrentTask({ type: 'would_you_rather', text: randomQuestion.text, item: randomQuestion });
            setTurnPhase('task');
        }
    };

    const handleOutcome = (successOrId) => {
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

                        {turnPhase === 'reveal' && currentPlayer && (
                            <div className="text-center animate-in zoom-in duration-500">
                                <p className="text-xl text-zinc-400 mb-2 tracking-widest uppercase">Get ready...</p>
                                <h2 className="text-5xl font-black text-white mb-2 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                    It's <span className="text-neon-blue">{currentPlayer.name}'s</span> turn!
                                </h2>

                                {selectedGame === 'never_have_i_ever' && currentPlayer.lives === 0 && (
                                    <p className="text-red-500 font-bold mt-4 uppercase tracking-widest animate-pulse">Eliminated! Drink Every Turn!</p>
                                )}

                                <p className="text-zinc-500 mt-8">
                                    {selectedGame === 'truth_or_dare' ? 'Tap to choose your fate' : 'Tap to reveal statement'}
                                </p>
                                <button
                                    onClick={() => {
                                        if (selectedGame === 'truth_or_dare') setTurnPhase('choice');
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

                        {turnPhase === 'choice' && selectedGame !== 'truth_or_dare' && selectedGame !== 'never_have_i_ever' && selectedGame !== 'most_likely_to' && (
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

                        {turnPhase === 'task' && (
                            <div className={`w-full p-8 rounded-3xl border-2 flex flex-col items-center text-center animate-in zoom-in duration-500 bg-zinc-900/80 backdrop-blur-sm ${selectedGame === 'never_have_i_ever' ? 'border-neon-pink shadow-[0_0_30px_rgba(236,72,153,0.3)]' : selectedGame === 'most_likely_to' ? 'border-neon-purple shadow-[0_0_30px_rgba(168,85,247,0.3)]' : selectedGame === 'would_you_rather' ? 'border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)]' : currentTask.type === 'truth'
                                ? 'border-neon-blue shadow-[0_0_30px_rgba(6,182,212,0.3)]'
                                : 'border-neon-pink shadow-[0_0_30px_rgba(236,72,153,0.3)]'
                                }`}>
                                <h3 className={`text-2xl font-bold uppercase tracking-widest mb-6 ${selectedGame === 'never_have_i_ever' ? 'text-neon-pink' : selectedGame === 'most_likely_to' ? 'text-neon-purple' : selectedGame === 'would_you_rather' ? 'text-amber-500' : currentTask.type === 'truth' ? 'text-neon-blue' : 'text-neon-pink'
                                    }`}>
                                    {selectedGame === 'never_have_i_ever' ? 'Never Have I Ever' : selectedGame === 'most_likely_to' ? 'Most Likely To' : selectedGame === 'would_you_rather' ? 'Would You Rather' : currentTask.type}
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
