#!/usr/bin/env python3
"""
NexusTalk AI - Advanced Rule-Based AI Chatbot
Portfolio Internship Project Entrypoint
Written in Python 3 with Flask
"""

import sys
import re
import random
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Define our robust list of 34 rule-based intents
INTENTS = {
    "greeting": {
        "keywords": [r"\bhello\b", r"\bhi\b", r"\bhey\b", r"\bgreetings\b", r"\bhola\b", r"\bsup\b", r"\bwassup\b", r"\bhowdy\b"],
        "responses": [
            "Hello {name}! Wonderful to have you here at NexusTalk AI. What exciting topic shall we explore today?",
            "Hi there, {name}! Ready to dive into the world of programming, AI, or python tips? Let me know how I can help!",
            "Greetings, {name}! I am optimized and ready to assist you. Ask me anything about Artificial Intelligence, career tips, or motivation!",
            "Hey {name}! Hope you are having an productive day. Feel free to use the quick suggestion chips below if you aren't sure where to start!"
        ]
    },
    "goodbye": {
        "keywords": [r"\bbye\b", r"\bgoodbye\b", r"\bsee ya\b", r"\bfarewell\b", r"\bexit\b", r"\bquit\b", r"\btalk to you later\b", r"\badios\b"],
        "responses": [
            "Goodbye, {name}! It was wonderful chatting with you. Keep learning, practicing, and coding!",
            "Farewell, {name}! Remember, consistency is key in software engineering. See you soon!",
            "Catch you later, {name}! Don't forget to push your code to GitHub today. Have a great day!",
            "Au revoir, {name}! I'll be right here waiting whenever you need more tips or programming advice."
        ]
    },
    "thanks": {
        "keywords": [r"\bthank\b", r"\bthanks\b", r"\bappreciate\b", r"\bgrateful\b", r"\bhelpful\b", r"\bawesome\b"],
        "responses": [
            "You are very welcome, {name}! Supporting eager learners is exactly what I was coded to do.",
            "Anytime, {name}! I'm glad that was helpful. Do you want to discuss Python tips or resume optimization next?",
            "No problem at all! Feel free to ask more. Your professional development is important!",
            "Happy to help, {name}! Let's keep the momentum going."
        ]
    },
    "who_built_you": {
        "keywords": [r"who built you", r"who made you", r"who created you", r"who programmed you", r"your creator", r"your developer", r"internship project"],
        "responses": [
            "I was designed and programmed by a brilliant Software Engineering Intern as a premium portfolio showcase. I run entirely on an advanced rule-matching intelligence matrix!",
            "I am the ultimate product of an internship development project. My creator engineered me to demonstrate how complex flows can be modeled beautifully using rule-based state logic."
        ]
    },
    "bot_identity": {
        "keywords": [r"who are you", r"what is your name", r"explain yourself", r"explain nexustalk", r"what are you", r"tell me about yourself"],
        "responses": [
            "I am NexusTalk AI, an advanced rule-based chatbot designed to help you master Python, Machine Learning, Data Science, and Career strategies.",
            "I am NexusTalk AI! Unlike generative AI models which can hallucinate, I am a highly deterministic, reliable, and swift AI knowledge portal."
        ]
    },
    "artificial_intelligence": {
        "keywords": [r"artificial intelligence", r"\bai\b", r"machine intelligence", r"intelligence simulation"],
        "responses": [
            "Artificial Intelligence (AI) simulates human intelligence in machines—enabling them to learn, reason, and self-correct. It's revolutionizing every industry!",
            "AI is broad, ranging from rule-based engines (like me!) and expert systems to neural networks and Large Language Models. At its core, it's about solving complex tasks computationally.",
            "Did you know? The term 'Artificial Intelligence' was first coined by John McCarthy in 1956 at the famous Dartmouth Conference!"
        ]
    },
    "machine_learning": {
        "keywords": [r"machine learning", r"\bml\b", r"supervised", r"unsupervised", r"regression", r"classification"],
        "responses": [
            "Machine Learning (ML) is a subset of AI where algorithms learn patterns from data to make predictions or decisions without being explicitly programmed.",
            "ML has three main types: Supervised (labeled data), Unsupervised (finding hidden structures in unlabeled data), and Reinforcement Learning (reward/penalty systems).",
            "A great tip for starting with ML: Master linear algebra, probability, and statistics first, then study libraries like Scikit-Learn!"
        ]
    },
    "deep_learning": {
        "keywords": [r"deep learning", r"neural network", r"backpropagation", r"convolutional", r"transformer", r"\bdl\b"],
        "responses": [
            "Deep Learning uses complex Artificial Neural Networks with multiple layers (hence 'deep') to mimic the human brain and process complex structures like images or audio.",
            "The magic of Deep Learning lies in backpropagation, which computes gradients of loss functions to adjust weights, slowly correcting errors over training epochs.",
            "DL powers modern breakthroughs like image generation, self-driving cars, and ChatGPT. However, it requires massive amounts of data and computational power (GPUs)!"
        ]
    },
    "data_science": {
        "keywords": [r"data science", r"data scientist", r"pandas", r"numpy", r"analytics", r"data analysis"],
        "responses": [
            "Data Science combines programming, domain expertise, and mathematics to extract meaningful insights from structured and unstructured data.",
            "An industry-standard Data Science workflow (CRISP-DM) includes: Business Understanding -> Data Prep -> Modeling -> Evaluation -> Deployment.",
            "If you want to excel in Data Science, master the Python 'Pandas' library for data manipulation, and 'Matplotlib' or 'Seaborn' for striking visuals!"
        ]
    },
    "python": {
        "keywords": [r"python", r"guido van rossum", r"why python", r"python language"],
        "responses": [
            "Python is a high-level, general-purpose, interpreted language known for its incredible readability, simple syntax, and massive ecosystem in AI, web, and scripting.",
            "Python was created by Guido van Rossum and released in 1991. Fun fact: It was named after the British comedy group 'Monty Python', not the snake!",
            "With its dynamic typing and automatic memory management, Python lets developers build fast prototypes and scale to complex architectures with packages like Flask, Django, and FastAPI."
        ]
    },
    "programming": {
        "keywords": [r"programming", r"coding", r"software development", r"computer science", r"write code"],
        "responses": [
            "Programming is the craft of writing instructions that a computer can execute to solve problems. It is a mix of logic, architecture, and creative engineering!",
            "The best way to learn programming is through building real projects. Don't just watch videos—open your editor and write code every single day!",
            "Remember: 'First, solve the problem. Then, write the code.' - John Johnson. Planning is half the battle!"
        ]
    },
    "interview_tips": {
        "keywords": [r"interview", r"job interview", r"mock interview", r"coding interview", r"technical interview", r"behavioral"],
        "responses": [
            "For technical coding interviews, practice the STAR method (Situation, Task, Action, Result) for behavioral questions, and master major data structures.",
            "During a live coding test, ALWAYS think out loud! Interviewers care more about your problem-solving process and communication than just getting a perfect syntax on the first try.",
            "Pro-Tip: Prepare 3 thoughtful questions to ask the interviewer at the end. It shows enthusiasm, deep interest, and active listening!"
        ]
    },
    "resume_tips": {
        "keywords": [r"resume", r"\bcv\b", r"curriculum vitae", r"portfolio", r"cover letter"],
        "responses": [
            "To beat ATS (Applicant Tracking Systems), use action verbs (e.g., 'Engineered', 'Optimized', 'Designed') and align bullet points with keyword requirements.",
            "Quantify your resume achievements using the Google X-Y-Z formula: 'Accomplished [X] as measured by [Y], by doing [Z]'. Example: 'Reduced memory usage by 20% by implementing lazy loading.'",
            "Keep your resume to exactly one page for junior/intern roles. Prioritize projects with GitHub links and verifiable live URLs!"
        ]
    },
    "career_guidance": {
        "keywords": [r"career", r"job market", r"tech role", r"software engineer career", r"how to get a job"],
        "responses": [
            "The modern tech career is a marathon, not a sprint. Focus on building a strong T-shaped skill profile—broad general knowledge with deep expertise in one area.",
            "Networking is key. Attend local tech meetups, build a professional LinkedIn profile, and contribute to open-source project issues to get noticed.",
            "Don't limit yourself to just coding skills. Empathy, product knowledge, communication, and team agility are often what lead to fast promotions!"
        ]
    },
    "internship_advice": {
        "keywords": [r"internship", r"\bintern\b", r"placement", r"work experience", r"junior dev", r"intern advice"],
        "responses": [
            "As an intern, your most powerful tool is curiosity. Ask clarifying questions, write notes, and never pretend to understand something when you don't.",
            "Document your achievements and challenges weekly. This journal makes writing your final internship report and updating your resume incredibly easy!",
            "Be a proactive team member. If you finish your assigned tasks, offer to help review PRs, write documentation, or pair-program on backlog tickets."
        ]
    },
    "coding_tips": {
        "keywords": [r"coding tip", r"coding advice", r"write clean code", r"refactor", r"readable code"],
        "responses": [
            "Always write code for humans first, and computers second. Use clear, self-documenting variable and function names instead of overly abbreviated terms.",
            "Avoid nesting code too deeply. Instead, use 'guard clauses' that exit functions early if conditions aren't met. It keeps code remarkably clean!",
            "Remember the DRY principle (Don't Repeat Yourself). If you copy-paste code more than twice, it's time to abstract it into a reusable helper function."
        ]
    },
    "motivation": {
        "keywords": [r"motivation", r"discouraged", r"depressed", r"sad", r"stress", r"burned out", r"imposter syndrome", r"give up", r"hard time"],
        "responses": [
            "Imposter syndrome is a sign that you are challenging yourself and growing. Every senior engineer felt like a fraud at some point. Keep taking small steps!",
            "Success is the sum of small effort, repeated day in and day out. Take a 15-minute break, stretch, drink water, and tackle it again. You've got this!",
            "Don't compare your Chapter 1 with someone else's Chapter 20. Everyone's coding journey is unique. Celebrate your personal breakthroughs!",
            "The expert in anything was once a beginner. Be gentle with yourself and proud of the discipline you're building today."
        ]
    },
    "project_ideas": {
        "keywords": [r"project", r"portfolio project", r"ideas", r"project ideas", r"what to build"],
        "responses": [
            "Awesome portfolio project: Build an offline-first personal dashboard that displays weather, custom tasks, habit trackers, and visual data logs.",
            "A high-value project for back-end developers: Code a custom API gateway with rate limiting, task queues, and authentication endpoints from scratch.",
            "For full-stack developers: Try building a real-time markdown editor with live side-by-side preview, file organizing hierarchy, and PDF exporter."
        ]
    },
    "study_tips": {
        "keywords": [r"study", r"learn", r"study tips", r"revision", r"homework", r"focus", r"pomodoro"],
        "responses": [
            "Try the Pomodoro Technique: Code/Study with high focus for 25 minutes, then take a 5-minute break. After 4 sessions, take a long 20-minute break.",
            "Use Active Recall and Spaced Repetition. Instead of re-reading code docs, try to sketch the structure or explain key concepts from memory.",
            "Set up an absolute study zone: Put your phone in another room, block distractors like social media, and play instrumental lo-fi or brown noise!"
        ]
    },
    "tech_facts": {
        "keywords": [r"fact", r"trivia", r"did you know", r"tech facts", r"technology fact"],
        "responses": [
            "Did you know? The first computer bug was a real physical moth found trapped inside a relay of the Harvard Mark II computer by Grace Hopper in 1947!",
            "Did you know? Over 4.8 billion people operate a smartphone globally today, meaning half of humanity literally holds a supercomputer in their pockets.",
            "Fun Fact: The world's first domain name, 'symbolics.com', was registered on March 15, 1985. It is still active today as a technology museum!"
        ]
    },
    "nlp": {
        "keywords": [r"nlp", r"natural language", r"text processing", r"tokenization", r"regex", r"stemming"],
        "responses": [
            "Natural Language Processing (NLP) bridges the gap between human communication and computer understanding. It involves text preprocessing like tokenization, stemming, and vectorization.",
            "Traditional NLP relied heavily on Regex and statistical rule logic (similar to how I clean your messages!). Modern NLP uses transformer-based neural maps.",
            "If you're studying NLP in Python, start by exploring libraries like NLTK (Natural Language Toolkit) and SpaCy for quick syntactic parsing."
        ]
    },
    "cv_vision": {
        "keywords": [r"computer vision", r"image processing", r"opencv", r"object detection", r"yolo", r"segmentation"],
        "responses": [
            "Computer Vision (CV) equips systems to understand visual information from digital images, videos, and multi-dimensional matrices.",
            "Popular CV algorithms range from edge detectors (Canny) and Haar cascades to modern deep networks like YOLO (You Only Look Once) for microsecond detection.",
            "Try Python OpenCV: It's the ultimate open-source computer vision library. You can write a script to detect faces in real-time in under 20 lines of code!"
        ]
    },
    "databases": {
        "keywords": [r"database", r"sql", r"postgresql", r"mysql", r"sqlite", r"relational", r"nosql", r"query"],
        "responses": [
            "Databases store and manage application data. Relational databases (SQL like Postgres, MySQL, SQLite) use tables, columns, constraints, and relationships.",
            "NoSQL databases (like MongoDB or Firestore) utilize document-based or key-value structures, perfect for unstructured data and massive horizontal scaling.",
            "Tip: Always write indexes on columns that you query frequently. It can turn slow, linear table scans into incredibly fast logarithmic lookups!"
        ]
    },
    "cloud_computing": {
        "keywords": [r"cloud", r"aws", r"gcp", r"azure", r"docker", r"serverless", r"kubernetes", r"deployment"],
        "responses": [
            "Cloud Computing provides on-demand computing services (servers, storage, databases) over the internet. Major providers are AWS, GCP, and Microsoft Azure.",
            "Containerization (with Docker) packages application code, libraries, and runtime dependencies so the app runs consistently in any environment.",
            "Serverless computing (like AWS Lambda or Google Cloud Run) lets you focus solely on writing code without worrying about server provisioning or auto-scaling infrastructure."
        ]
    },
    "frontend": {
        "keywords": [r"frontend", r"html", r"css", r"react", r"javascript", r"tailwind", r"responsive", r"dom"],
        "responses": [
            "Frontend development centers on crafting what the user sees and interacts with. It requires absolute mastery of HTML, styling systems (CSS/Tailwind), and Javascript/React.",
            "Always prioritize accessibility (a11y) in frontend code! Use semantic HTML, ARIA attributes, and ensure high color contrast for screen-reader usability.",
            "React is a component-driven framework that updates the virtual DOM selectively, ensuring fast UI rendering and smooth visual feedback loops."
        ]
    },
    "git": {
        "keywords": [r"\bgit\b", r"github", r"commit", r"branch", r"merge", r"pull request", r"fork"],
        "responses": [
            "Git is a distributed version control system that tracks file changes, making team collaboration and rollback operations incredibly safe.",
            "A golden Git rule: Commit early, commit often, and write descriptive, imperative-mood commit messages (e.g., 'Fix auth error', not 'solved bug stuff').",
            "GitHub acts as a social cloud for code. Having continuous green commit grids on your profile shows interviewers your consistent building habits!"
        ]
    },
    "best_practices": {
        "keywords": [r"best practices", r"solid", r"dry principle", r"design pattern", r"design patterns", r"clean code"],
        "responses": [
            "Modern architecture revolves around SOLID design principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.",
            "Keep functions small! A stellar rule of thumb is that a function should fit on a single screen and perform exactly one atomic action cleanly.",
            "Code comments should explain the 'Why', not the 'What'. Let your code's structure and variable naming explain the 'What'."
        ]
    },
    "algorithms": {
        "keywords": [r"algorithm", r"sorting", r"data structure", r"binary search", r"stack", r"queue", r"tree", r"complexity", r"big o"],
        "responses": [
            "Algorithms are step-by-step procedures to accomplish tasks, measured by Big O notation for time and space efficiency as inputs scale.",
            "Mastering core data structures (Arrays, Linked Lists, Hash Maps, Stacks, Queues, Trees, Graphs) is the foundation of efficient coding.",
            "When optimizing algorithms, always check if you can trade memory for speed. Using a Hash Map (O(1) lookup) is a classic way to bypass nested O(N^2) loops!"
        ]
    },
    "agile": {
        "keywords": [r"agile", r"scrum", r"sprint", r"kanban", r"standup", r"backlog", r"retrospective"],
        "responses": [
            "Agile is a product lifecycle methodology focusing on iterative development, quick feedback, and adaptability. Scrum is a popular framework under Agile.",
            "In Scrum, teams work in structured loops called 'Sprints' (usually 2 weeks), synced via daily standups and improved during retrospectives.",
            "Kanban boards leverage visual lanes ('To Do', 'In Progress', 'Testing', 'Done') to control project flow and prevent team burnout by setting Work In Progress limits."
        ]
    },
    "ai_ethics": {
        "keywords": [r"ethics", r"ai bias", r"hallucinate", r"cybersecurity", r"safety", r"explainable ai", r"responsible ai"],
        "responses": [
            "AI Ethics focuses on ensuring AI models operate fairly, transparently, and securely without amplifying historic biases of human datasets.",
            "One major challenge in generative AI is 'hallucinations'—where a model asserts false claims as facts. This makes rule-based guard rails highly relevant!",
            "Responsible AI engineering calls for 'Explainability'—designing systems where decision chains can be parsed, and developers can audit why an output occurred."
        ]
    },
    "help": {
        "keywords": [r"\bhelp\b", r"commands", r"what can you do", r"how to use", r"options", r"help menu"],
        "responses": [
            "I'm here to support your internship journey! You can ask me about: 🐍 Python tips, 🤖 AI facts, 💼 Resumes, 🧠 Machine Learning, or 💻 Tech projects. Simply type your question, or tap any suggestion chip!",
            "I have 30+ built-in intent categories! Just ask me questions like 'How to optimize my resume?', 'What are study tips?', 'Give me a python tip', or simply 'Tell me a tech fact'."
        ]
    },
    "python_tips": {
        "keywords": [r"python tip", r"list comprehension", r"decorator", r"pep 8", r"generator"],
        "responses": [
            "Python Tip: Use list comprehensions for concise syntax! Example: `squares = [x**2 for x in range(10) if x%2 == 0]` replaces a lengthy 4-line loop.",
            "Python Tip: Use generators (`yield` instead of `return`) when processing massive datasets. It streams rows on-demand, preventing your RAM from crashing!",
            "Python Tip: Follow PEP 8 guidelines. Keeping lines below 79 characters, using 4 spaces for indentation, and naming variables in snake_case makes code beautiful."
        ]
    },
    "ai_facts": {
        "keywords": [r"ai fact", r"turing test", r"kasparov", r"deep blue", r"alphafold"],
        "responses": [
            "AI Fact: In 1997, IBM's Deep Blue defeated world chess champion Garry Kasparov. It was an advanced rule-based heuristic search tree computing millions of nodes!",
            "AI Fact: Google DeepMind's AlphaFold resolved a 50-year-old biological mystery in 2020 by predicting the 3D structures of protein folders with atomic accuracy.",
            "AI Fact: The Turing Test, proposed by Alan Turing in 1950, tests a machine's ability to exhibit intelligent behavior indistinguishable from a human."
        ]
    },
    "programming_tips": {
        "keywords": [r"programming tip", r"debug", r"stack overflow", r"rubber duck", r"error message"],
        "responses": [
            "Programming Tip: Try 'Rubber Duck Debugging'. Explaining your code line-by-line to an inanimate object forces you to see structural flaws you'd ignore in your head.",
            "Programming Tip: Read error stack traces carefully from bottom to top! 90% of bugs are identified in the last three lines of a compiler stack trace.",
            "Programming Tip: Write tests! Even a few simple unit tests will save you hours of debugging when you modify code later on."
        ]
    }
}

DEFAULT_RESPONSES = [
    "That is a great question! While my rule matrix doesn't cover that exact phrase, I can discuss Python, AI, Machine Learning, Resume Optimization, or Project Ideas. Feel free to try a suggestion chip below!",
    "I'm listening carefully! Although I didn't match that with my current rule index, you can ask for a 'python tip', 'programming tip', 'ai fact', or 'resume tips'!",
    "Interesting point! To make sure I give you reliable value, try asking about career tips, coding tips, or tech facts. Let's explore together!",
    "I want to make sure I assist you perfectly. Tap one of the recommendation chips below to see my rule-based engine in action!"
]


def clean_and_match(user_message, user_name):
    """
    Core rule-matching engine (mimicking Python if/elif/else and dictionary flows).
    """
    clean_msg = user_message.lower().strip()
    # Remove standard punctuation for clean keyword search
    clean_msg = re.sub(r"[^\w\s-]", "", clean_msg)
    
    matched_intent = "default"
    selected_response = None
    
    # Try pattern matching each rule-based intent
    for intent, details in INTENTS.items():
        for pattern in details["keywords"]:
            if re.search(pattern, clean_msg):
                matched_intent = intent
                selected_response = random.choice(details["responses"])
                break
        if selected_response:
            break
            
    if not selected_response:
        selected_response = random.choice(DEFAULT_RESPONSES)
        
    # Dynamically inject username naturally
    final_reply = selected_response.replace("{name}", user_name)
    
    return final_reply, matched_intent


@app.route("/")
def home():
    """
    Serve the main user interface.
    """
    return render_template("index.html")


@app.route("/api/chat", methods=["POST"])
def chat():
    """
    Chat endpoint for client requests.
    """
    data = request.get_json() or {}
    message = data.get("message", "").strip()
    username = data.get("username", "Intern").strip()
    
    if not message:
        return jsonify({"error": "Empty message"}), 400
        
    reply, intent = clean_and_match(message, username)
    return jsonify({
        "reply": reply,
        "intent": intent,
        "username": username
    })


if __name__ == "__main__":
    # Ensure standard bindings for container ingress
    app.run(host="0.0.0.0", port=3000, debug=True)
