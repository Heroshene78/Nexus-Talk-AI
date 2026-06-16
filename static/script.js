/**
 * NexusTalk AI - Advanced Client-Side Script
 * Manages Chat Sessions, LocalStorage Persistence, UI render loops, and API synchronization.
 */

// Global State
let APP_STATE = {
    username: "",
    theme: "dark", // default to modern dark mode
    sessions: [], // Array of sessions, each { id, date, startTime, title, messages: [] }
    activeSessionId: null,
    totalMessagesSent: 0,
    startTime: Date.now()
};

// DOM Cache
const dom = {
    app: document.getElementById("app"),
    sidebar: document.getElementById("sidebar"),
    sidebarOverlay: document.getElementById("sidebar-overlay"),
    openSidebarBtn: document.getElementById("open-sidebar-btn"),
    closeSidebarMobile: document.getElementById("close-sidebar-mobile"),
    
    themeToggleBtn: document.getElementById("theme-toggle-btn"),
    themeIcon: document.getElementById("theme-icon"),
    
    helpMenuBtn: document.getElementById("help-menu-btn"),
    helpModal: document.getElementById("help-modal"),
    closeHelpModal: document.getElementById("close-help-modal"),
    
    openSettingsBtn: document.getElementById("open-settings-btn"),
    settingsModal: document.getElementById("settings-modal"),
    closeSettingsModal: document.getElementById("close-settings-modal"),
    settingsUsernameInput: document.getElementById("settings-username-input"),
    saveSettingsBtn: document.getElementById("save-settings-btn"),
    
    welcomePanel: document.getElementById("welcome-panel"),
    welcomeNameSetup: document.getElementById("welcome-name-setup"),
    setupUsernameInput: document.getElementById("setup-username-input"),
    saveSetupNameBtn: document.getElementById("save-setup-name-btn"),
    welcomeReadyArea: document.getElementById("welcome-ready-area"),
    currentUserDisplay: document.getElementById("current-user-display"),
    startNewSessionBtn: document.getElementById("start-new-session"),
    
    messagesContainer: document.getElementById("messages-container"),
    chatStage: document.getElementById("chat-stage"),
    
    chatForm: document.getElementById("chat-form"),
    chatInput: document.getElementById("chat-input"),
    sendBtn: document.getElementById("send-btn"),
    clearChatBtn: document.getElementById("clear-chat-btn"),
    exportChatBtn: document.getElementById("export-chat-btn"),
    
    statTotalMessages: document.getElementById("stat-total-messages"),
    statActiveTime: document.getElementById("stat-active-time"),
    searchHistory: document.getElementById("search-history"),
    historySessionsList: document.getElementById("history-sessions-list"),
    historyEmptyMessage: document.getElementById("history-empty-message"),
    clearAllHistoryBtn: document.getElementById("clear-all-history-btn")
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    loadStateFromStorage();
    applyTheme(APP_STATE.theme);
    registerEvents();
    renderSidebarSessions();
    updateStatisticsUI();
    
    // Parse Initial Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
    
    // Personalization check
    if (APP_STATE.username && APP_STATE.username.trim() !== "") {
        showReadyArea();
    } else {
        showNameSetupArea();
    }
    
    // Auto-Focus Name input if visible
    if (!APP_STATE.username) {
        dom.setupUsernameInput.focus();
    }
    
    // Live Timer for session count
    setInterval(() => {
        updateActiveTimeStat();
    }, 60000); // every minute
});

// Load state from local storage
function loadStateFromStorage() {
    try {
        const stored = localStorage.getItem("nexustalk_state");
        if (stored) {
            const parsed = JSON.parse(stored);
            APP_STATE = { ...APP_STATE, ...parsed };
        } else {
            // Default check from system
            const osDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            APP_STATE.theme = osDark ? "dark" : "light";
        }
    } catch (e) {
        console.error("Failed to load local storage state:", e);
    }
}

// Save state to local storage
function saveStateToStorage() {
    try {
        localStorage.setItem("nexustalk_state", JSON.stringify(APP_STATE));
    } catch (e) {
        console.error("Failed to save state to storage:", e);
    }
}

// Apply Theme (light vs dark)
function applyTheme(theme) {
    if (theme === "dark") {
        document.documentElement.classList.add("dark");
        dom.themeToggleBtn.setAttribute("title", "Switch to Light Mode");
        dom.themeIcon.setAttribute("data-lucide", "sun");
    } else {
        document.documentElement.classList.remove("dark");
        dom.themeToggleBtn.setAttribute("title", "Switch to Dark Mode");
        dom.themeIcon.setAttribute("data-lucide", "moon");
    }
    if (window.lucide) {
        window.lucide.createIcons();
    }
    APP_STATE.theme = theme;
    saveStateToStorage();
}

// Show Name Setup Mode
function showNameSetupArea() {
    dom.welcomeNameSetup.classList.remove("hidden");
    dom.welcomeReadyArea.classList.add("hidden");
    disableInputs(true);
}

// Show Ready to Chat Mode
function showReadyArea() {
    dom.welcomeNameSetup.classList.add("hidden");
    dom.welcomeReadyArea.classList.remove("hidden");
    dom.currentUserDisplay.textContent = APP_STATE.username;
    dom.settingsUsernameInput.value = APP_STATE.username;
    
    if (APP_STATE.activeSessionId) {
        resumeActiveSession();
    } else {
        disableInputs(true);
    }
}

// Disable or Enable chat inputs
function disableInputs(disabled) {
    dom.chatInput.disabled = disabled;
    dom.sendBtn.disabled = disabled;
    if (disabled) {
        dom.chatInput.placeholder = "Please start or select a session to begin chatting...";
    } else {
        dom.chatInput.placeholder = "Type your question (e.g. 'Give me a python tip')...";
    }
}

// Resume previous active session
function resumeActiveSession() {
    const session = APP_STATE.sessions.find(s => s.id === APP_STATE.activeSessionId);
    if (session) {
        // Hide welcome panel, show message panel
        dom.welcomePanel.classList.add("hidden");
        dom.messagesContainer.classList.remove("hidden");
        disableInputs(false);
        renderActiveMessages();
        scrollToBottom();
    } else {
        APP_STATE.activeSessionId = null;
        dom.welcomePanel.classList.remove("hidden");
        dom.messagesContainer.classList.add("hidden");
        disableInputs(true);
    }
}

// Events Registration
function registerEvents() {
    // Theme toggle
    dom.themeToggleBtn.addEventListener("click", () => {
        const nextTheme = APP_STATE.theme === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
    });

    // Sidebar Mobile triggers
    dom.openSidebarBtn.addEventListener("click", () => {
        dom.sidebar.classList.remove("-translate-x-full");
        dom.sidebarOverlay.classList.remove("hidden");
    });

    const closeSidebarHandler = () => {
        dom.sidebar.classList.add("-translate-x-full");
        dom.sidebarOverlay.classList.add("hidden");
    };
    dom.closeSidebarMobile.addEventListener("click", closeSidebarHandler);
    dom.sidebarOverlay.addEventListener("click", closeSidebarHandler);

    // Help Modal Triggers
    dom.helpMenuBtn.addEventListener("click", () => dom.helpModal.classList.remove("hidden"));
    dom.closeHelpModal.addEventListener("click", () => dom.helpModal.classList.add("hidden"));
    dom.helpModal.addEventListener("click", (e) => {
        if (e.target === dom.helpModal) dom.helpModal.classList.add("hidden");
    });

    // Profile Settings triggers
    dom.openSettingsBtn.addEventListener("click", () => {
        dom.settingsUsernameInput.value = APP_STATE.username;
        dom.settingsModal.classList.remove("hidden");
    });
    dom.closeSettingsModal.addEventListener("click", () => dom.settingsModal.classList.add("hidden"));
    dom.settingsModal.addEventListener("click", (e) => {
        if (e.target === dom.settingsModal) dom.settingsModal.classList.add("hidden");
    });

    // Name setters
    dom.saveSetupNameBtn.addEventListener("click", saveFirstLaunchName);
    dom.setupUsernameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            saveFirstLaunchName();
        }
    });

    dom.saveSettingsBtn.addEventListener("click", saveProfileSettingsName);

    // Start Chat Session Button
    dom.startNewSessionBtn.addEventListener("click", () => {
        createNewSession();
    });

    // Form Chat Submission
    dom.chatForm.addEventListener("submit", handleChatSubmit);

    // Suggestion Chips Tappers
    document.querySelectorAll(".chip-suggest").forEach(chip => {
        chip.addEventListener("click", () => {
            if (dom.chatInput.disabled) {
                // If inputs are disabled, auto launch a session first
                if (APP_STATE.username && APP_STATE.username.trim() !== "") {
                    createNewSession();
                    setTimeout(() => {
                        dom.chatInput.value = chip.textContent;
                        handleMessageSend(chip.textContent);
                    }, 300);
                } else {
                    alert("Please provide your username in the greeting card first!");
                    dom.setupUsernameInput.focus();
                }
            } else {
                dom.chatInput.value = chip.textContent;
                dom.chatInput.focus();
            }
        });
    });

    // Restart Current Chat Log button
    dom.clearChatBtn.addEventListener("click", () => {
        if (!APP_STATE.activeSessionId) return;
        if (confirm("Are you sure you want to clear the message stream for this active session? This cannot be undone.")) {
            clearActiveChatStream();
        }
    });

    // Export Chat log trigger
    dom.exportChatBtn.addEventListener("click", exportConversationLog);

    // Clear All saved sessions from memory
    dom.clearAllHistoryBtn.addEventListener("click", () => {
        if (confirm("🚨 WARNING: This will permanently purge your entire saved conversation logs, stats, and settings preferences! Are you sure?")) {
            localStorage.clear();
            APP_STATE = {
                username: "",
                theme: "dark",
                sessions: [],
                activeSessionId: null,
                totalMessagesSent: 0,
                startTime: Date.now()
            };
            location.reload();
        }
    });

    // Filter History elements dynamically
    dom.searchHistory.addEventListener("input", (e) => {
        filterSidebarSessions(e.target.value);
    });
}

// First setup name save helper
function saveFirstLaunchName() {
    const name = dom.setupUsernameInput.value.trim();
    if (!name) {
        alert("Please enter a valid nickname to personalize the experience!");
        return;
    }
    APP_STATE.username = name;
    saveStateToStorage();
    showReadyArea();
}

// Profile Settings change helper
function saveProfileSettingsName() {
    const name = dom.settingsUsernameInput.value.trim();
    if (!name) {
        alert("Username cannot be blank!");
        return;
    }
    APP_STATE.username = name;
    saveStateToStorage();
    dom.currentUserDisplay.textContent = name;
    dom.settingsModal.classList.add("hidden");
    
    // Refresh names in message headers if matched
    renderActiveMessages();
}

// Create clean, unique session log
function createNewSession() {
    const timestamp = Date.now();
    const formattedDate = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
    
    const newSession = {
        id: "session_" + timestamp,
        date: formattedDate,
        startTime: timestamp,
        title: "Session Topic #" + (APP_STATE.sessions.length + 1),
        messages: []
    };

    APP_STATE.sessions.unshift(newSession);
    APP_STATE.activeSessionId = newSession.id;
    saveStateToStorage();
    
    resumeActiveSession();
    renderSidebarSessions();
    updateStatisticsUI();
    
    // Put brief bot intro trigger
    addBotGreetingSequence(newSession.id);
}

// Bot intro standard response
function addBotGreetingSequence(sessionId) {
    const session = APP_STATE.sessions.find(s => s.id === sessionId);
    if (!session) return;
    
    const botMessage = {
        id: "msg_" + Date.now(),
        sender: "bot",
        text: `Hello ${APP_STATE.username}! I am NexusTalk AI, your advanced rule-driven engineering assistant. Tap any suggestion chips or write custom commands to explore code, stats, resumes, or motivation!`,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        intent: "greeting"
    };

    session.messages.push(botMessage);
    saveStateToStorage();
    renderActiveMessages();
    scrollToBottom();
}

// Post a chat message
function handleChatSubmit(e) {
    e.preventDefault();
    const queryText = dom.chatInput.value.trim();
    if (!queryText) return;
    
    // Clear and refocus immediately to prevent duplicates
    dom.chatInput.value = "";
    dom.chatInput.focus();
    
    handleMessageSend(queryText);
}

// Main message pipeline
async function handleMessageSend(message) {
    if (!APP_STATE.activeSessionId) return;
    
    const activeSession = APP_STATE.sessions.find(s => s.id === APP_STATE.activeSessionId);
    if (!activeSession) return;
    
    // 1. Append User Bubble
    const userMsg = {
        id: "msg_user_" + Date.now(),
        sender: "user",
        text: message,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    };
    
    activeSession.messages.push(userMsg);
    
    // Dynamic Updates
    if (activeSession.title.startsWith("Session Topic #")) {
        // Shorten title to first 3 words of the user's first query
        const words = message.split(" ").slice(0, 3).join(" ");
        activeSession.title = words.length > 20 ? words.substring(0, 18) + '...' : words;
    }

    APP_STATE.totalMessagesSent += 1;
    saveStateToStorage();
    
    renderActiveMessages();
    renderSidebarSessions();
    updateStatisticsUI();
    scrollToBottom();
    
    // 2. Append Typing Indicator
    const typingBubbleId = appendTypingIndicator();
    scrollToBottom();
    
    // 3. Contact Local Python backend API 
    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: message,
                username: APP_STATE.username
            })
        });
        
        removeTypingIndicator(typingBubbleId);
        
        if (response.ok) {
            const data = await response.json();
            
            const botMsg = {
                id: "msg_bot_" + Date.now(),
                sender: "bot",
                text: data.reply,
                timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
                intent: data.intent
            };
            
            activeSession.messages.push(botMsg);
            saveStateToStorage();
            renderActiveMessages();
            scrollToBottom();
        } else {
            throw new Error("Backend response error");
        }
        
    } catch (error) {
        console.warn("Express proxy active or backend direct failure. Engaging direct client fallback match logic.");
        removeTypingIndicator(typingBubbleId);
        
        // Local deterministic match fallback logic (replicates Python intents completely)
        setTimeout(() => {
            const botReply = generateClientFallbackReply(message);
            const fallbackBotMsg = {
                id: "msg_bot_fallback_" + Date.now(),
                sender: "bot",
                text: botReply.reply,
                timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
                intent: botReply.intent
            };
            activeSession.messages.push(fallbackBotMsg);
            saveStateToStorage();
            renderActiveMessages();
            scrollToBottom();
        }, 600);
    }
}

// Generate typing bubble marker
function appendTypingIndicator() {
    const typingId = "typing_" + Date.now();
    const typingHTML = `
        <div id="${typingId}" class="flex items-start space-x-3 max-w-[80%] message-animate-in">
            <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-500 scale-90 border border-slate-200/50 dark:border-slate-800/40 shrink-0">
                <i data-lucide="bot" class="w-4 h-4"></i>
            </div>
            <div class="bg-white/80 dark:bg-slate-900/80 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-200/40 dark:border-slate-800/20 shadow-sm flex items-center justify-center space-x-1.5 h-10 w-16">
                <span class="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full typing-dot"></span>
                <span class="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full typing-dot"></span>
                <span class="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full typing-dot"></span>
            </div>
        </div>
    `;
    dom.messagesContainer.insertAdjacentHTML("beforeend", typingHTML);
    if (window.lucide) window.lucide.createIcons();
    return typingId;
}

// Remove indicator bubble
function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

// Render active conversations
function renderActiveMessages() {
    const activeSession = APP_STATE.sessions.find(s => s.id === APP_STATE.activeSessionId);
    if (!activeSession) return;
    
    dom.messagesContainer.innerHTML = "";
    
    activeSession.messages.forEach(msg => {
        let bubbleHTML = "";
        
        if (msg.sender === "user") {
            bubbleHTML = `
                <div class="flex items-start justify-end space-x-3 w-full max-w-[85%] self-end message-animate-in">
                    <div class="flex flex-col items-end space-y-1">
                        <div class="bg-indigo-600 text-white px-4 py-3 rounded-2xl rounded-tr-none shadow-md shadow-indigo-500/10 text-sm break-words relative group">
                            <p>${escapeHTML(msg.text)}</p>
                            
                            <!-- hover clip copy button -->
                            <button onclick="copyMessageText('${msg.id}')" class="absolute -left-8 top-1/2 -translate-y-1/2 p-1 rounded bg-slate-200/50 dark:bg-slate-800/50 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" title="Copy to clipboard">
                                <i data-lucide="copy" class="w-3 h-3"></i>
                            </button>
                        </div>
                        <div class="flex items-center space-x-1.5 text-[9px] text-slate-400 font-medium">
                            <span class="text-slate-500">${escapeHTML(APP_STATE.username)}</span>
                            <span>•</span>
                            <span>${msg.timestamp}</span>
                        </div>
                    </div>
                    <div class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-black text-xs flex items-center justify-center border border-indigo-200/30 shrink-0">
                        ${escapeHTML(APP_STATE.username.substring(0, 2).toUpperCase())}
                    </div>
                </div>
            `;
        } else {
            // bot bubble
            bubbleHTML = `
                <div class="flex items-start space-x-3 w-full max-w-[85%] self-start message-animate-in">
                    <div class="w-8 h-8 rounded-full bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center text-indigo-500 border border-slate-200/40 dark:border-slate-800/20 shrink-0 select-none">
                        <i data-lucide="bot" class="w-4 h-4 text-indigo-600 dark:text-indigo-400"></i>
                    </div>
                    <div class="flex flex-col items-start space-y-1">
                        <div class="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700 dark:text-slate-100 break-words relative group leading-relaxed">
                            <p>${escapeHTML(msg.text)}</p>
                            
                            <!-- Intent Indicator badge inside block -->
                            ${msg.intent && msg.intent !== "default" ? `
                            <span class="inline-block mt-2 text-[9px] font-bold text-indigo-500/80 bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded border border-indigo-100/30 uppercase tracking-widest pointer-events-none">
                                ${msg.intent}
                            </span>` : ''}

                            <button onclick="copyMessageText('${msg.id}')" class="absolute -right-8 top-1/2 -translate-y-1/2 p-1 rounded bg-slate-200/50 dark:bg-slate-800/50 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" title="Copy to clipboard">
                                <i data-lucide="copy" class="w-3 h-3"></i>
                            </button>
                        </div>
                        <div class="flex items-center space-x-1.5 text-[9px] text-slate-400 font-medium">
                            <span class="text-slate-500">NexusTalk Bot</span>
                            <span>•</span>
                            <span>${msg.timestamp}</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Append
        const wrapper = document.createElement("div");
        wrapper.id = msg.id;
        wrapper.className = "w-full flex " + (msg.sender === "user" ? "justify-end" : "justify-start");
        wrapper.innerHTML = bubbleHTML;
        
        dom.messagesContainer.appendChild(wrapper);
    });
    
    if (window.lucide) window.lucide.createIcons();
}

// Copy message logic
window.copyMessageText = function(msgId) {
    const activeSession = APP_STATE.sessions.find(s => s.id === APP_STATE.activeSessionId);
    if (!activeSession) return;
    
    const msg = activeSession.messages.find(m => m.id === msgId);
    if (msg) {
        navigator.clipboard.writeText(msg.text).then(() => {
            // Temporary overlay notification
            const notification = document.createElement("div");
            notification.className = "fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg z-50 flex items-center space-x-2";
            notification.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 text-green-400"></i><span>Text Copied!</span>`;
            document.body.appendChild(notification);
            if (window.lucide) window.lucide.createIcons();
            
            setTimeout(() => {
                notification.remove();
            }, 1200);
        }).catch(err => {
            console.error("Copy failed due to security/iframe constraints:", err);
        });
    }
};

// Render Sidebar saved sessions list
function renderSidebarSessions() {
    dom.historySessionsList.innerHTML = "";
    
    if (APP_STATE.sessions.length === 0) {
        dom.historyEmptyMessage.classList.remove("hidden");
        return;
    }
    
    dom.historyEmptyMessage.classList.add("hidden");
    
    // Group sidebars by Date string
    const groups = {};
    APP_STATE.sessions.forEach(sess => {
        if (!groups[sess.date]) {
            groups[sess.date] = [];
        }
        groups[sess.date].push(sess);
    });

    Object.keys(groups).forEach(dateStr => {
        // Render Date Group Header
        const groupHeader = document.createElement("div");
        groupHeader.className = "text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pt-2 border-t border-slate-100/50 dark:border-slate-950/20";
        groupHeader.textContent = dateStr;
        dom.historySessionsList.appendChild(groupHeader);
        
        groups[dateStr].forEach(sess => {
            const isActive = sess.id === APP_STATE.activeSessionId;
            const card = document.createElement("div");
            card.className = `group flex items-center justify-between p-2.5 rounded-lg text-xs cursor-pointer transition-all ${
                isActive 
                ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-l-2 border-indigo-600 font-semibold" 
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-900/40"
            }`;
            
            card.setAttribute("data-session-id", sess.id);
            
            const count = sess.messages.filter(m => m.sender === 'user').length;
            
            card.innerHTML = `
                <div class="flex items-center space-x-2.5 min-w-0" onclick="switchSession('${sess.id}')">
                    <i data-lucide="message-square" class="w-3.5 h-3.5 shrink-0 select-none ${isActive ? 'text-indigo-500' : 'text-slate-400'}"></i>
                    <div class="truncate text-left">
                        <p class="truncate font-medium">${escapeHTML(sess.title)}</p>
                        <p class="text-[9px] text-slate-400 mt-0.5">${count} exchanges</p>
                    </div>
                </div>
                <button onclick="deleteSession(event, '${sess.id}')" class="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 text-slate-400 transition-opacity" title="Delete conversation log">
                    <i data-lucide="trash-2" class="w-3 h-3"></i>
                </button>
            `;
            dom.historySessionsList.appendChild(card);
        });
    });
    
    if (window.lucide) window.lucide.createIcons();
}

// Switch Active Session
window.switchSession = function(sessionId) {
    APP_STATE.activeSessionId = sessionId;
    saveStateToStorage();
    resumeActiveSession();
    renderSidebarSessions();
    
    // Close sidebar on mobile
    dom.sidebar.classList.add("-translate-x-full");
    dom.sidebarOverlay.classList.add("hidden");
};

// Delete single session log
window.deleteSession = function(event, sessionId) {
    event.stopPropagation();
    if (confirm("Delete this conversation history completely?")) {
        APP_STATE.sessions = APP_STATE.sessions.filter(s => s.id !== sessionId);
        if (APP_STATE.activeSessionId === sessionId) {
            APP_STATE.activeSessionId = null;
        }
        saveStateToStorage();
        resumeActiveSession();
        renderSidebarSessions();
        updateStatisticsUI();
    }
};

// Filter sidebars search query
function filterSidebarSessions(queryText) {
    const cleanQuery = queryText.toLowerCase().trim();
    const cards = dom.historySessionsList.querySelectorAll("[data-session-id]");
    
    cards.forEach(card => {
        const sessId = card.getAttribute("data-session-id");
        const sess = APP_STATE.sessions.find(s => s.id === sessId);
        if (sess) {
            const matchesText = sess.title.toLowerCase().includes(cleanQuery) || 
                                sess.messages.some(m => m.text.toLowerCase().includes(cleanQuery));
            if (matchesText) {
                card.classList.remove("hidden");
            } else {
                card.classList.add("hidden");
            }
        }
    });
}

// Clear current logs
function clearActiveChatStream() {
    const session = APP_STATE.sessions.find(s => s.id === APP_STATE.activeSessionId);
    if (session) {
        session.messages = [];
        saveStateToStorage();
        renderActiveMessages();
        addBotGreetingSequence(session.id);
    }
}

// Export Chat Log text file
function exportConversationLog() {
    const activeSession = APP_STATE.sessions.find(s => s.id === APP_STATE.activeSessionId);
    if (!activeSession || activeSession.messages.length === 0) {
        alert("There is no active dialogue to export!");
        return;
    }
    
    let textOut = `NEXUSTALK AI - CHAT EXPORT\n`;
    textOut += `User: ${APP_STATE.username}\n`;
    textOut += `Session ID: ${activeSession.id}\n`;
    textOut += `Date: ${activeSession.date}\n`;
    textOut += `=`.repeat(40) + `\n\n`;
    
    activeSession.messages.forEach(msg => {
        const senderLabel = msg.sender === 'user' ? APP_STATE.username : 'NexusTalk Bot';
        const intentBadge = msg.intent ? ` [Intent: ${msg.intent}]` : '';
        textOut += `[${msg.timestamp}] ${senderLabel}${intentBadge}:\n`;
        textOut += `${msg.text}\n\n`;
    });
    
    const blob = new Blob([textOut], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexustalk_chat_export_${activeSession.id}.txt`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// Scroll to bottom helper
function scrollToBottom() {
    dom.chatStage.scrollTo({
        top: dom.chatStage.scrollHeight,
        behavior: "smooth"
    });
}

// Safe HTML sanitizer
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
}

// Dynamic updates to static panels
function updateStatisticsUI() {
    dom.statTotalMessages.textContent = APP_STATE.totalMessagesSent;
    dom.statActiveTime.textContent = APP_STATE.sessions.length;
}

// Compute active duration of the app state
function updateActiveTimeStat() {
    const elapsedMinutes = Math.floor((Date.now() - APP_STATE.startTime) / 60000);
    // Real time live count tracker can go here
}


// CLIENT-SIDE FALLBACK MATCH ENGINE (Complete mirror of Python app.py intents)
// Guaranteed reliability under sandbox iframe environments
function generateClientFallbackReply(userMessage) {
    const cleanMsg = userMessage.toLowerCase().trim().replace(/[^\w\s-]/g, "");
    
    const clientIntents = {
        greeting: {
            keywords: ["hello", "hi", "hey", "greetings", "hola", "sup", "wassup", "howdy"],
            responses: [
                "Hello {name}! Wonderful to have you here at NexusTalk AI. What exciting topic shall we explore today?",
                "Hi there, {name}! Ready to dive into the world of programming, AI, or python tips? Let me know!"
            ]
        },
        goodbye: {
            keywords: ["bye", "goodbye", "see ya", "farewell", "exit", "quit"],
            responses: [
                "Goodbye, {name}! It was wonderful chatting with you. Keep learning, practicing, and coding!"
            ]
        },
        thanks: {
            keywords: ["thank", "thanks", "appreciate", "grateful", "helpful", "awesome"],
            responses: [
                "You are very welcome, {name}! Supporting eager learners is exactly what I was coded to do."
            ]
        },
        python_tips: {
            keywords: ["python tip", "list comprehension", "decorator", "pep 8", "generator"],
            responses: [
                "Python Tip: Use list comprehensions for concise syntax! Example: `squares = [x**2 for x in range(10) if x%2 == 0]` replaces a lengthy 4-line loop.",
                "Python Tip: Use generators (`yield` instead of `return`) when processing massive datasets. It streams rows on-demand, preventing your RAM from crashing!"
            ]
        },
        ai_facts: {
            keywords: ["ai fact", "turing test", "kasparov", "deep blue", "alphafold"],
            responses: [
                "AI Fact: In 1997, IBM's Deep Blue defeated world chess champion Garry Kasparov. It was an advanced rule-based heuristic search tree computing millions of nodes!",
                "AI Fact: Google DeepMind's AlphaFold resolved a 50-year-old biological mystery in 2020 by predicting protein fold structures with atomic precision."
            ]
        },
        programming_tips: {
            keywords: ["programming tip", "debug", "stack overflow", "rubber duck", "error message"],
            responses: [
                "Programming Tip: Try 'Rubber Duck Debugging'. Explaining your code line-by-line to an clean inanimate duck forces you to notice systemic compiler flaws."
            ]
        },
        motivation: {
            keywords: ["motivation", "discouraged", "depressed", "sad", "stress", "burned out", "imposter syndrome"],
            responses: [
                "Imposter syndrome is a sign that you are challenging yourself and growing. Every senior engineer felt like a fraud at some point. Keep taking small steps!",
                "Success is the sum of small effort, repeated day in and day out. Take a 15-minute break, stretch, drink water, and tackle it again!"
            ]
        }
    };

    let matchedIntent = "default";
    let matchedResponse = null;

    for (const [intent, details] of Object.entries(clientIntents)) {
        for (const kw of details.keywords) {
            if (cleanMsg.includes(kw)) {
                matchedIntent = intent;
                matchedResponse = details.responses[Math.floor(Math.random() * details.responses.length)];
                break;
            }
        }
        if (matchedResponse) break;
    }

    if (!matchedResponse) {
        const fallbacks = [
            "Interesting! While my client-side rules don't cover that exact phrase, I can discuss Python, AI, Machine Learning, Resume Optimization, or Project Ideas! Tap a suggest chip below to test.",
            "I'm listening carefully! Although I didn't match that with my rule index, you can ask for a 'python tip', 'programming tip', 'ai fact', or 'resume tips'!"
        ];
        matchedResponse = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    return {
        reply: matchedResponse.replace("{name}", APP_STATE.username),
        intent: matchedIntent
    };
}
