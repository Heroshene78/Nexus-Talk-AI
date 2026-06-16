import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bot, 
  Send, 
  Trash2, 
  UserCog, 
  X, 
  Download, 
  Search, 
  MessageSquare, 
  RefreshCw, 
  Copy, 
  Compass, 
  ChevronLeft, 
  Maximize2,
  MessageCircle,
  LogOut,
  Sparkle
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  intent?: string;
}

interface ChatSession {
  id: string;
  date: string;
  startTime: number;
  title: string;
  messages: Message[];
}

interface ChatWorkspaceProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredSessions: ChatSession[];
  setConfirmDeleteId: (id: string | null) => void;
  setConfirmClearAllOpen: (open: boolean) => void;
  setConfirmClearChatOpen: (open: boolean) => void;
  handleStartSession: (initialQuery?: string) => void;
  handleSendMessage: (text: string) => void;
  inputVal: string;
  setInputVal: (val: string) => void;
  handleExportTextLog: () => void;
  username: string;
  setTempName: (name: string) => void;
  setSettingsOpen: (open: boolean) => void;
  handleCopyClipboardMsg: (text: string) => void;
  isTyping: boolean;
  listEndRef: React.RefObject<HTMLDivElement | null>;
  setCurrentView: (view: "landing" | "chat") => void;
  totalMessagesSent: number;
}

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({
  sessions,
  activeSessionId,
  setActiveSessionId,
  sidebarOpen,
  setSidebarOpen,
  searchQuery,
  setSearchQuery,
  filteredSessions,
  setConfirmDeleteId,
  setConfirmClearAllOpen,
  setConfirmClearChatOpen,
  handleStartSession,
  handleSendMessage,
  inputVal,
  setInputVal,
  handleExportTextLog,
  username,
  setTempName,
  setSettingsOpen,
  handleCopyClipboardMsg,
  isTyping,
  listEndRef,
  setCurrentView,
  totalMessagesSent
}) => {
  const currentSession = sessions.find(s => s.id === activeSessionId) || null;

  // Colorful border array to give cards in sidebar a beautiful tech custom styling
  const cardBorderColors = [
    "border-l-cyan-400 focus-within:shadow-[0_0_12px_rgba(34,211,238,0.15)]",
    "border-l-violet-500 focus-within:shadow-[0_0_12px_rgba(139,92,246,0.15)]",
    "border-l-pink-500 focus-within:shadow-[0_0_12px_rgba(236,72,153,0.15)]",
    "border-l-emerald-500 focus-within:shadow-[0_0_12px_rgba(16,185,129,0.15)]"
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    
    // Requirement 13: Unlimited conversations without freezing or disabling the input field.
    // If no active session, start one immediately with this input! Onboarding is always active.
    if (!activeSessionId) {
      handleStartSession(inputVal);
    } else {
      handleSendMessage(inputVal);
    }
  };

  const handleQuickActionTrigger = (text: string) => {
    if (!activeSessionId) {
      handleStartSession(text);
    } else {
      handleSendMessage(text);
    }
  };

  return (
    <div className="flex-1 w-full h-full flex overflow-hidden relative z-10">
      
      {/* SLIDABLE LEFT SIDEBAR DRAW PANEL (GLASSMORPHISM) */}
      <aside className={`w-80 shrink-0 border-r border-cyan-500/15 bg-slate-950/70 backdrop-blur-xl flex flex-col transition-all duration-300 z-30 transform fixed md:static h-full ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        
        {/* BRAND HEADER & LOGO */}
        <div className="p-4 border-b border-cyan-500/10 flex items-center justify-between bg-slate-950/30">
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setCurrentView("landing")}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-650 flex items-center justify-center text-white shadow-[0_0_12px_rgba(6,182,212,0.25)]">
              <Bot className="w-5 h-5" />
            </div>
            <div className="text-left leading-none">
              <span className="font-bold text-sm tracking-tight text-white block">NexusTalk AI</span>
              <span className="text-[8px] text-cyan-400 tracking-wider font-bold uppercase font-mono">Heuristic Core</span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white cursor-pointer border border-cyan-500/10">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* SIDEBAR METRICS DRAWER */}
        <div className="p-3.5 bg-cyan-950/20 border-b border-cyan-500/10">
          <span className="text-[9px] font-bold text-cyan-400/80 uppercase tracking-widest block mb-2 text-left font-mono">Telemetry Status</span>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-slate-950/60 p-2 rounded-xl border border-cyan-500/10">
              <p className="text-sm font-black text-cyan-400 font-mono">{totalMessagesSent}</p>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider font-mono">Queries</p>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-xl border border-cyan-500/10">
              <p className="text-sm font-black text-violet-400 font-mono">{sessions.length}</p>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider font-mono">Saved Chats</p>
            </div>
          </div>
        </div>

        {/* QUICK SEARCH FOR SAVED DISCUSSIONS */}
        <div className="p-3 border-b border-cyan-500/10">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Filter session logs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/90 text-xs py-2 my-1 pl-8 pr-3.5 rounded-xl border border-cyan-500/20 outline-none focus:border-cyan-400 text-white placeholder-slate-500 transition-colors font-mono"
            />
            <Search className="w-3.5 h-3.5 text-cyan-400/60 absolute left-2.5 top-3.5 pointer-events-none" />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-3 md:top-3.5 text-slate-400 hover:text-white text-xs">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* EXCHANGES DIRECTORY (CHATS LOG LIST) */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 no-scrollbar">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-[9px] font-bold text-cyan-400/80 uppercase tracking-widest text-left font-mono">Archive Registry</span>
            <button 
              onClick={() => handleStartSession()} 
              className="text-[10px] text-cyan-400 font-bold hover:text-cyan-300 font-mono flex items-center space-x-1"
            >
              <span>+ New Session</span>
            </button>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 flex flex-col items-center justify-center space-y-2">
              <MessageSquare className="w-6 h-6 opacity-25 text-cyan-500" />
              <p className="text-xs font-mono">Registry empty.</p>
            </div>
          ) : (
            filteredSessions.map((sess, index) => {
              const isActive = sess.id === activeSessionId;
              const queryCount = sess.messages.filter(m => m.sender === "user").length;
              const borderStyle = cardBorderColors[index % cardBorderColors.length];
              
              return (
                <div 
                  key={sess.id}
                  onClick={() => {
                    setActiveSessionId(sess.id);
                    setSidebarOpen(false);
                  }}
                  className={`group flex items-center justify-between p-3 rounded-xl text-xs cursor-pointer transition-all border-l-2 ${borderStyle} ${
                    isActive 
                      ? "bg-cyan-950/30 border-y border-r border-cyan-500/40 text-cyan-300 font-medium scale-[1.02]" 
                      : "bg-slate-950/20 border-y border-r border-cyan-500/5 hover:bg-slate-900/40 text-slate-350 hover:text-white"
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <MessageCircle className={`w-4 h-4 shrink-0 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
                    <div className="truncate text-left leading-tight">
                      <p className={`truncate font-mono font-semibold ${isActive ? "text-cyan-300" : "text-slate-200"}`}>{sess.title}</p>
                      <p className="text-[9px] text-slate-400/80 mt-0.5 font-mono">{queryCount} threads • {sess.date}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDeleteId(sess.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition-opacity cursor-pointer shrink-0 ml-1.5 border border-transparent hover:border-red-500/20"
                    title="Erase Log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* SIDEBAR FOOTER */}
        <div className="p-3 border-t border-cyan-500/10">
          <button 
            onClick={() => setConfirmClearAllOpen(true)}
            className="w-full flex items-center justify-center space-x-1.5 text-[10px] font-mono font-bold py-2.5 px-3 border border-red-500/30 text-red-450 hover:bg-red-950/20 rounded-xl transition-all cursor-pointer hover:border-red-450"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Wipe Archive Memory</span>
          </button>
        </div>

      </aside>

      {/* OVERLAY FOR CELL DEVICES */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-20 md:hidden"
        />
      )}

      {/* CONTAINER CHAT FEED FRAME (GLASSMORPHISM) */}
      <main className="flex-1 flex flex-col h-full bg-slate-950/10 relative overflow-hidden backdrop-blur-xs">
        
        {/* WORKSPACE UPPER BAR */}
        <header className="h-16 border-b border-cyan-500/15 bg-slate-950/40 backdrop-blur-xl px-4 flex items-center justify-between relative z-10 shrink-0">
          
          <div className="flex items-center space-x-3.5">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-slate-950/50 hover:bg-slate-900 border border-cyan-500/10 text-cyan-400 md:hidden transition-colors cursor-pointer"
              title="Toggle sidebar logs"
            >
              <Maximize2 className="w-4 h-4 rotate-45" />
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentView("landing")}
                className="p-2 rounded-xl bg-slate-950/50 hover:bg-slate-900 border border-cyan-500/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Return to home screen hub"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-cyan-950/50 border border-cyan-500/35 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.2)]">
                  <Bot className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              <div className="text-left">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-xs sm:text-sm tracking-tight text-white font-mono">INTELLIGENT NEURAL NODE</h3>
                  <span className="hidden sm:inline-block text-[8px] bg-cyan-950 border border-cyan-500/30 text-cyan-400 px-1.5 py-0.5 rounded font-mono uppercase font-bold tracking-widest select-none">
                    DETERMINISTIC
                  </span>
                </div>
                <p className="text-[10px] text-cyan-400/75 truncate max-w-[130px] sm:max-w-none font-mono">
                  Active Thread: {currentSession ? currentSession.title : "Unassigned Node"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => {
                setTempName(username);
                setSettingsOpen(true);
              }}
              className="p-2 rounded-xl bg-slate-950/50 hover:bg-slate-900 text-slate-400 hover:text-white border border-cyan-500/10 transition-colors cursor-pointer"
              title="Change Preferred Identity Name"
            >
              <UserCog className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentView("landing")}
              className="p-2 rounded-xl bg-slate-950/50 hover:bg-slate-900 border border-red-500/15 text-slate-400 hover:text-red-400 transition-all font-mono font-bold text-xs flex items-center space-x-1 cursor-pointer"
              title="Exit conversation workspace"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>

        </header>

        {/* FEED PANEL CONTAINER */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 flex flex-col justify-between">
          
          {!currentSession ? (
            // Inactive / No Session Selected Welcome Module
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto my-auto p-8 rounded-2xl bg-slate-950/50 border border-cyan-500/20 backdrop-blur-md shadow-[0_0_40px_rgba(6,182,212,0.06)] text-center space-y-6 relative"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 to-indigo-500" />
              <div className="w-14 h-14 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto shadow-inner">
                <MessageSquare className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white font-mono">DORMANT TRANSIMISSION SIGNAL</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto font-sans">
                  The active socket is idle. Select an active log from the Registry history, or spawn a fresh cognitive matrix discussion.
                </p>
              </div>
              
              <div className="space-y-3 pt-2">
                <button 
                  onClick={() => handleStartSession()}
                  className="w-full py-3 bg-gradient-to-r from-cyan-550 to-indigo-650 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer font-mono border border-white/10"
                >
                  SPAWN HEURISTIC LOG
                </button>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">or simply type below to start</p>
              </div>
            </motion.div>
          ) : (
            // Dynamic Thread Discussion Feeds
            <div className="flex-1 max-w-3xl mx-auto w-full flex flex-col space-y-5">
              <AnimatePresence initial={false}>
                {currentSession.messages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, scale: 0.98, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className={`flex items-start space-x-3 w-full max-w-[85%] ${
                      msg.sender === "user" ? "self-end flex-row-reverse space-x-reverse" : "self-start"
                    }`}
                  >
                    {/* User / Bot Avatar */}
                    {msg.sender === "user" ? (
                      <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-650 text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0 shadow-lg border border-white/10 uppercase">
                        {(username || "Me").substring(0, 2)}
                      </div>
                    ) : (
                      <div className="w-8.5 h-8.5 rounded-xl bg-slate-900 border border-cyan-500/15 flex items-center justify-center text-cyan-400 shrink-0 shadow-sm">
                        <Bot className="w-4 h-4 text-cyan-400" />
                      </div>
                    )}

                    {/* Content text block with Copy button */}
                    <div className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                      <div className={`px-4 py-3 rounded-2xl relative group transition-all border ${
                        msg.sender === "user" 
                          ? "bg-gradient-to-r from-indigo-650 via-violet-650 to-purple-700 text-white border-white/10 rounded-tr-none shadow-[0_4px_15px_rgba(139,92,246,0.3)] text-xs sm:text-sm" 
                          : "bg-slate-950/45 backdrop-blur-md border-cyan-500/15 text-slate-100 rounded-tl-none text-xs sm:text-sm leading-relaxed shadow-[0_4px_15px_rgba(6,182,212,0.06)]"
                      }`}>
                        
                        <p className="break-words max-w-sm sm:max-w-md whitespace-pre-line text-left leading-relaxed font-sans">
                          {msg.text}
                        </p>
                        
                        {/* Interactive intent indicator */}
                        {msg.intent && msg.intent !== "default" && (
                          <div className="mt-2.5 text-left">
                            <span className="inline-flex items-center space-x-1.5 text-[8.5px] font-mono font-black text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-400/20 uppercase tracking-widest leading-none">
                              <span>{msg.intent}</span>
                            </span>
                          </div>
                        )}

                        {/* Interactive bubble copy anchor */}
                        <button 
                          onClick={() => handleCopyClipboardMsg(msg.text)}
                          className={`absolute p-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-400/70 hover:text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer border border-cyan-500/20 ${
                            msg.sender === "user" ? "right-full mr-2 top-2" : "left-full ml-2 top-2"
                          }`}
                          title="Copy text block"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      <span className="text-[9px] text-slate-500 font-bold mt-1 tracking-wider font-mono">
                        {msg.sender === "user" ? (username || "Developer") : "NexusTalk Machine"} • {msg.timestamp}
                      </span>
                    </div>
                  </motion.div>
                ))}

                {/* Cyber Loading sequence */}
                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start space-x-3 self-start max-w-[80%]"
                  >
                    <div className="w-8.5 h-8.5 rounded-xl bg-slate-900 border border-cyan-500/15 flex items-center justify-center text-cyan-400 shrink-0">
                      <Bot className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: "3s" }} />
                    </div>
                    <div className="bg-slate-950/45 border border-cyan-500/15 px-4 py-3.5 rounded-2xl rounded-tl-none shadow-[0_4px_15px_rgba(6,182,212,0.06)] flex items-center space-x-1.5 w-16 h-10.5">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={listEndRef} />
            </div>
          )}

        </div>

        {/* COMPASS QUICK CHIPS SELECTOR */}
        <div className="px-4 py-2 bg-cyan-950/15 border-t border-cyan-500/10 flex items-center space-x-2 overflow-x-auto whitespace-nowrap no-scrollbar scroll-smooth shrink-0 z-10">
          <span className="text-[9px] uppercase tracking-wider font-bold text-cyan-400/80 font-mono shrink-0 flex items-center">
            <Compass className="w-3.5 h-3.5 mr-1" /> Quick Queries:
          </span>
          {[
            { label: "AI Concept", text: "Explain artificial intelligence" },
            { label: "Python Core", text: "Give me a python tip" },
            { label: "ATS Resume", text: "Resume cv tips" },
            { label: "Technical Interview", text: "Interview preparation tips" },
            { label: "Daily Motivation", text: "Give me a motivational quote" },
            { label: "Computer facts", text: "Tell me a tech fact" },
            { label: "Clean Code", text: "Clean code practices" },
            { label: "Help Docs", text: "Help me with commands" }
          ].map((chip) => (
            <button 
              key={chip.label}
              onClick={() => handleQuickActionTrigger(chip.text)}
              className="bg-slate-950 border border-cyan-500/10 hover:border-cyan-400/50 hover:text-cyan-300 text-[11px] font-mono rounded-full px-3 py-1 text-slate-305 transition-all cursor-pointer select-none"
            >
              &gt; {chip.label}
            </button>
          ))}
        </div>

        {/* DISPATCH INPUT CONSOLE (GLOWING GLASSMORPHISM) */}
        <footer className="p-4 border-t border-cyan-500/15 bg-slate-950/60 backdrop-blur-xl relative z-10 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
          <form 
            onSubmit={handleFormSubmit}
            className="max-w-3xl mx-auto flex items-center space-x-3.5"
          >
            <button 
              type="button" 
              onClick={() => setConfirmClearChatOpen(true)}
              disabled={!activeSessionId}
              className="p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 text-cyan-400/80 border border-cyan-500/10 hover:border-cyan-400/40 disabled:opacity-30 disabled:border-slate-800 disabled:text-slate-600 transition-all shrink-0 cursor-pointer"
              title="Reset active thread logs"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Always active glowing inputs */}
            <div className="flex-1 relative flex items-center group">
              <input 
                type="text" 
                placeholder="Type your message handle (e.g., Python, AI facts)..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full bg-slate-950/80 text-xs sm:text-sm pl-4 pr-12 py-3.5 rounded-xl border border-cyan-500/20 text-white placeholder-slate-500 group-focus-within:border-cyan-400 group-focus-within:shadow-[0_0_15px_rgba(34,211,238,0.2)] outline-none transition-all font-mono"
              />
              <span className="absolute right-4 text-[9px] font-mono text-cyan-400/45 pointer-events-none uppercase font-bold">READY</span>
            </div>

            <button 
              type="button" 
              onClick={handleExportTextLog}
              disabled={!activeSessionId}
              className="p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 text-cyan-400/80 border border-cyan-500/10 hover:border-cyan-400/40 disabled:opacity-30 disabled:border-slate-800 disabled:text-slate-600 transition-all shrink-0 cursor-pointer"
              title="Export session transcripts (.txt)"
            >
              <Download className="w-4 h-4" />
            </button>

            <button 
              type="submit" 
              disabled={!inputVal.trim()}
              className="bg-gradient-to-r from-cyan-550 to-indigo-650 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-30 disabled:from-slate-800 disabled:to-slate-905 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-xl shadow-lg border border-white/5 hover:shadow-cyan-500/20 transition-all flex items-center justify-center shrink-0 cursor-pointer text-xs sm:text-sm font-bold font-mono tracking-wide"
              title="Dispatch signal"
            >
              <Send className="w-4 h-4 mr-0 sm:mr-1.5" />
              <span className="hidden sm:inline">DISPATCH</span>
            </button>
          </form>
        </footer>

      </main>

    </div>
  );
};
