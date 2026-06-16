# NexusTalk AI – Advanced Rule-Based AI Chatbot (Portfolio Internship Showcase)

An advanced, production-ready **Rule-Based AI Chatbot** engineered as a premium Software Engineering and Artificial Intelligence internship showcase project.

Developed with deterministic branching maps instead of deep neural models, **NexusTalk AI** achieves millisecond local response rates while maintaining 100% security against prompt-injection issues and factual hallucinations.

---

## 🎯 Objectives
- **Zero-Latency Rules Matrix**: Synthesize and clean user inputs through automated case foldings, regex boundary screenings, and word tokens extraction.
- **Durable Memory & Session Tracks**: Build local storage managers recording usernames, structural themes, and multiple historic active dialogue sessions.
- **Premium Dual-Theme Contexts**: Deliver clean **Dark Mode** and high-contrast **Light Mode** styling systems with seamless viewport transformations.
- **Comprehensive Internship Resources**: Embed 34+ distinct professional topic intents covering python tips, interview templates, motivation scripts, database schema rules, and computer science frameworks.

---

## 🎨 Premium Features Built-In
- **Modern Glassmorphic Sandbox**: Built with fluid translucent layouts, floating cards, real-time micro-animations, and full responsive design for desktop & mobile viewports.
- **User Customization Dialogs**: Welcomes the user with a personal greeting on the first launch, allowing theme toggling and name modifications from Settings.
- **Infinite Conversation Logs**: Saves previous chats grouped by date in a scrollable history sidebar. Includes quick conversational word searches and selective message deletion.
- **Utility Multi-Tools**:
  - **Suggestion Chips**: Prompt quick trigger questions inside the textbox with one click.
  - **Copy Message**: Direct button to copy single bubbles cleanly to clipboards.
  - **Export TXT**: Downloads complete chats as neatly formatted text files.
  - **Session Statistics**: Live analytics tallying sent messages and active conversation counts.

---

## 📂 Project Structure
```text
/
├── app.py                   # Main Flask Backend Router and Python Rules Engine
├── requirements.txt         # Required Python packages (Flask)
├── README.md                # Comprehensive Project Documentation
├── templates/
│   └── index.html           # Master App HTML5 view layout structure
└── static/
    ├── style.css            # Custom CSS variables, dark-mode styling and dot animation hooks
    └── script.js            # Frontend orchestrator managing states and client fallbacks
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8 or higher installed on your machine.
- Pip (Python Package Installer).

### Steps to Run Locally

1. **Clone the project files & navigate to directory**:
   ```bash
   cd nexustalk-ai
   ```

2. **Install dependency structures**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Boot the Flask Dev Server**:
   ```bash
   python app.py
   ```

4. **Open in browser**:
   Navigate to `http://localhost:3000` to start interacting!

---

## 🧠 Sample Key Prompts (Rule Triggers)
Identify any of these custom triggers to test the bot's categorical rules:
- `Give me a python tip` – Prints standard syntaxes and PEP advice.
- `Tell me a tech fact` – Shares fascinating computing trivia.
- `Motivation` or `imposter syndrome` – Gives encouraging advice for devs.
- `Resume cv tips` – Advises on how to beat ATS software.
- `Project ideas` – Recommends high-value repository ideas.
- `Agile scrum` – Explains sprints, Kanban, and product owners.

---

## 🚀 Future Roadmap & Extensions
1. **SQLite Database Sync**: Add a lightweight SQLite database backup layer inside `app.py` for server-side persistence.
2. **Dynamic Flowcharts**: Render visualized graphs of matched rule branches using D3 or Mermaid inside chat bubbles.
3. **Regex Expansion Panels**: Add a developer dashboard allowing administrators to test and modify matching weights dynamically.
