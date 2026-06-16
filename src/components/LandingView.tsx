import React from "react";
import { motion } from "motion/react";
import { 
  Bot, 
  Sparkles, 
  UserCog, 
  ChevronRight, 
  Activity, 
  Cpu, 
  Terminal, 
  TrendingUp, 
  MessageSquare 
} from "lucide-react";

interface LandingViewProps {
  username: string;
  setUsername: (name: string) => void;
  handleStartSession: (initialQuery?: string) => void;
  handleQuickAction: (queryText: string) => void;
  totalMessagesSent: number;
  sessionsCount: number;
  setCurrentView: (view: "landing" | "chat") => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  username,
  setUsername,
  handleStartSession,
  handleQuickAction,
  totalMessagesSent,
  sessionsCount,
  setCurrentView
}) => {
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [isShaking, setIsShaking] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUsername(val);
    if (val.trim()) {
      setValidationError(null);
    }
  };

  const onStartChatting = (initialQuery?: string) => {
    if (!username || !username.trim()) {
      setValidationError("⚠️ Please enter your name to continue.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      return;
    }
    setValidationError(null);
    handleStartSession(initialQuery);
  };

  const onQuickTrigger = (queryText: string) => {
    if (!username || !username.trim()) {
      setValidationError("⚠️ Please enter your name to continue.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      return;
    }
    setValidationError(null);
    handleQuickAction(queryText);
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col overflow-y-auto relative z-10 no-scrollbar">
      
      {/* GLORIOUS COGNITIVE HEADER */}
      <header className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-cyan-500/10 bg-slate-950/20 backdrop-blur-md">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView("landing")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-cyan-400/20">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div className="text-left">
            <h1 className="font-display font-semibold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              NexusTalk AI
            </h1>
            <p className="text-[9px] text-cyan-400/70 font-mono tracking-widest leading-none">DETERMINISTIC NODE v3.0</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {username && (
            <button
              onClick={() => setCurrentView("chat")}
              className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-4 py-2.5 rounded-xl backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Enter Workspace</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* BODY SECTION */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* LEFT COLUMN: HERO DETAIL & ID REGISTER */}
        <div className="flex-1 text-left space-y-8 max-w-xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-950/65 to-violet-950/65 border border-cyan-500/30 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: "5s" }} />
              <span className="text-[11px] font-mono font-bold text-cyan-300 tracking-wider uppercase">Premium Cognitive Studio</span>
            </div>
            
            <h2 className="font-display text-4xl sm:text-5xl md:text-6.5xl font-extrabold text-white leading-[1.08] tracking-tight">
              NexusTalk AI – <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(6,182,212,0.2)]">Futuristic Core</span> Assistant
            </h2>
            
            <p className="text-sm sm:text-base text-slate-350 leading-relaxed font-sans max-w-lg">
              Explore software engineering paradigms, clean-code heuristics, ATS resume optimizations, and computer science theorems through a colorful, deterministic 3D-style node interface.
            </p>
          </motion.div>

          {/* DYNAMIC REGISTER PANEL */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="p-6 bg-slate-950/45 border border-cyan-500/20 rounded-2xl shadow-[0_0_35px_rgba(6,182,212,0.06)] backdrop-blur-xl relative overflow-hidden group hover:border-cyan-400/30 transition-all duration-300"
          >
            {/* Visual neon lightbar */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 opacity-60" />

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <UserCog className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-mono font-bold text-white tracking-wide">Client Identity Terminal</h3>
                <p className="text-[11px] text-cyan-300/60 font-mono">Define your handles for custom session handshakes.</p>
              </div>
            </div>

            <motion.div 
              animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="space-y-3"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder="Enter identity handle (e.g., neo_coder)..."
                    value={username}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-950/80 text-xs px-4 py-3.5 rounded-xl border ${
                      validationError 
                        ? "border-red-500 ring-2 ring-red-500/20 focus:border-red-500 focus:ring-red-500" 
                        : "border-cyan-500/20 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-550 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                    } text-white placeholder-slate-500 outline-none transition-all font-mono`}
                  />
                  <span className="absolute right-3.5 top-3.5 text-[9px] font-mono font-bold text-cyan-400/50">ID_DOCK</span>
                </div>
                <button 
                  onClick={() => onStartChatting()}
                  className={`py-3.5 px-6 bg-gradient-to-r from-cyan-550 via-indigo-600 to-violet-650 hover:from-cyan-400 hover:to-indigo-550 text-white text-xs font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.22)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center space-x-2 cursor-pointer shrink-0 border border-white/10 font-mono tracking-wider ${
                    !username.trim() ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  <span>START CHATTING</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {validationError && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-400 font-mono text-left font-semibold"
                >
                  {validationError}
                </motion.p>
              )}
            </motion.div>
          </motion.div>

          {/* DYNAMIC HEURISTIC TAG CHIPS */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <p className="text-[10px] uppercase font-bold text-cyan-400/80 font-mono tracking-widest text-left flex items-center">
              <Activity className="w-3.5 h-3.5 text-cyan-400 mr-2 animate-pulse" />
              <span>PRE-COMPILED QUICK TRiggers</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Give me a python tip",
                "Explain artificial intelligence",
                "Resume cv tips",
                "Interview preparation tips",
                "Portfolio project ideas",
                "Give me a motivational quote"
              ].map((chip) => (
                <button 
                  key={chip}
                  onClick={() => onQuickTrigger(chip)}
                  className="bg-slate-950/40 border border-cyan-500/10 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-300 text-[11px] font-mono py-1.5 px-3.5 rounded-xl transition-all shadow-[0_4px_15px_rgba(0,0,0,0.12)] cursor-pointer select-none"
                >
                  &gt; {chip}
                </button>
              ))}
            </div>
          </motion.div>

        </div>

        {/* RIGHT COLUMN: 3D EMBLEM & COUNTERS */}
        <div className="flex-1 w-full max-w-md flex flex-col items-center justify-center space-y-8 relative z-10">
          
          {/* NEURAL REACTOR INNER DIAL */}
          <motion.div 
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-80 h-80 flex items-center justify-center"
          >
            {/* Spinning geometric coordinates representing AI depth */}
            <div className="absolute inset-0 border border-dashed border-cyan-400/20 rounded-full animate-spin [animation-duration:35s]" />
            <div className="absolute inset-4 border border-dashed border-violet-500/25 rounded-full animate-spin [animation-duration:20s] [animation-direction:reverse]" />
            <div className="absolute inset-10 border border-cyan-400/10 rounded-full animate-pulse [animation-duration:4s]" />
            
            {/* Glowing neon halo */}
            <div className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-cyan-500/10 via-violet-500/5 to-pink-500/10 blur-xl animate-pulse" />
            
            {/* Glass core dial */}
            <div className="absolute w-52 h-52 rounded-full bg-slate-950/40 border border-white/5 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.15)] flex items-center justify-center">
              <div className="absolute w-44 h-44 rounded-full border border-dashed border-cyan-400/35 animate-spin [animation-duration:60s]" />
              
              {/* Massive Center Logo Reactor Core */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                onClick={() => onStartChatting()}
                className="w-36 h-36 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-650 flex flex-col items-center justify-center shadow-2xl shadow-cyan-500/20 relative z-10 border border-white/15 select-none cursor-pointer"
              >
                <Bot className="w-14 h-14 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.55)] animate-pulse" />
                <div className="absolute bottom-5 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                  <span className="text-[8px] font-extrabold text-cyan-200 tracking-widest font-mono">CORE V3.0</span>
                </div>
              </motion.div>
            </div>

            {/* Satellite widgets floating */}
            <div className="absolute -top-3 left-4 bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-mono shadow-[0_0_15px_rgba(6,182,212,0.15)] text-cyan-300 flex items-center space-x-1 animate-bounce" style={{ animationDuration: "5s" }}>
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Heuristics Online</span>
            </div>
            <div className="absolute -bottom-3 right-4 bg-slate-950/80 border border-violet-500/30 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-mono shadow-[0_0_15px_rgba(139,92,246,0.15)] text-violet-300 flex items-center space-x-1 animate-bounce" style={{ animationDuration: "7s" }}>
              <Terminal className="w-3.5 h-3.5 text-violet-400" />
              <span>Local Database</span>
            </div>
          </motion.div>

          {/* TELEMETRY TILES CONTAINER */}
          <div className="w-full grid grid-cols-2 gap-4">
            
            <div className="bg-slate-950/45 border border-cyan-500/15 p-4 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.25)] backdrop-blur-md text-left">
              <div className="flex items-center space-x-2 text-cyan-400 mb-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span className="text-[9px] font-mono uppercase tracking-wider text-cyan-300/60">Total Queries</span>
              </div>
              <p className="font-display text-2xl font-extrabold text-white leading-tight">
                {totalMessagesSent}
              </p>
              <p className="text-[9px] text-slate-450 font-mono mt-0.5">Across dynamic loops</p>
            </div>

            <div className="bg-slate-950/45 border border-violet-500/15 p-4 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.25)] backdrop-blur-md text-left">
              <div className="flex items-center space-x-2 text-violet-400 mb-2">
                <MessageSquare className="w-4 h-4 text-violet-400" />
                <span className="text-[9px] font-mono uppercase tracking-wider text-violet-300/60">Saved Sessions</span>
              </div>
              <p className="font-display text-2xl font-extrabold text-white leading-tight">
                {sessionsCount}
              </p>
              <p className="text-[9px] text-slate-450 font-mono mt-0.5">Retained in storage</p>
            </div>

          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="w-full text-center py-6 text-[10px] text-cyan-400/40 font-mono tracking-widest shrink-0">
        NEXUSTALK CORE ENGINE © 2026. DELIVERING COMPACT RULE SYNTAX DETERMINISTICALLY.
      </footer>

    </div>
  );
};
