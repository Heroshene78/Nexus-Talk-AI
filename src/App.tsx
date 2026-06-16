/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  Send, 
  Trash2, 
  UserCog, 
  Sun, 
  Moon, 
  HelpCircle, 
  X, 
  Download, 
  Search, 
  MessageSquare, 
  RefreshCw, 
  Zap, 
  Copy, 
  Compass, 
  Sparkles,
  ChevronRight,
  Maximize2,
  Lock,
  MessageCircle,
  TrendingUp,
  Award,
  Layers,
  Sparkle,
  LogOut,
  Settings,
  ChevronLeft,
  Cpu,
  Terminal,
  Activity,
  PlusCircle,
  HelpCircle as QuestionIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TechBackground } from "./components/TechBackground";
import { LandingView } from "./components/LandingView";
import { ChatWorkspace } from "./components/ChatWorkspace";

// Types
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

// Extensive 34-Intent Rule Intelligence Matrix with Comprehensive Explanations
const INTENT_PRESETS: Record<string, { keywords: string[]; title: string; responses: string[] }> = {
  greeting: {
    title: "Greeting Sequence",
    keywords: ["hello", "hi", "hey", "greetings", "hola", "sup", "wassup", "howdy"],
    responses: [
      "Hello {name}! Wonderful to welcome you to NexusTalk AI. What exciting topic shall we explore in our tech session today?",
      "Hi there, {name}! Ready to dive into some Python tips, career resources, or machine learning? Let's build something great!",
      "Greetings, {name}! My rule-based matrices are fully active and calibrated for you. Ask me anything about programming!"
    ]
  },
  goodbye: {
    title: "Farewell Prompt",
    keywords: ["bye", "goodbye", "see ya", "farewell", "exit", "quit", "talk to you later", "adios"],
    responses: [
      "Goodbye, {name}! It was wonderful chatting with you. Keep learning, practicing, and sharpening your code!",
      "Farewell, {name}! Consistency is the greatest catalyst in engineering. See you soon in the developer sandbox!",
      "Catch you later, {name}! Don't forget to push your progress to GitHub today. Have a productive day!"
    ]
  },
  thanks: {
    title: "Gratitude Logic",
    keywords: ["thank", "thanks", "appreciate", "grateful", "helpful", "awesome"],
    responses: [
      "You are very welcome, {name}! Supporting aspiring engineers is exactly what my rule core was optimized to do.",
      "Anytime, {name}! I am thrilled that was helpful. Would you like to review Python tips or Resume tactics next?",
      "Happy to assist, {name}! Let's keep this momentum building."
    ]
  },
  who_built_you: {
    title: "Creator Intel",
    keywords: ["who built you", "who made you", "who created you", "who programmed you", "your creator", "your developer", "internship project"],
    responses: [
      "I was meticulously designed and programmed by a talented Software Engineering Intern as a stellar portfolio showcase. I operate entirely on a native rule-matching matrix!",
      "I am the flagship product of an advanced web internship project. My developer engineered me using React & Tailwind to prove that intelligent rule systems can look outstanding!"
    ]
  },
  bot_identity: {
    title: "System Identity",
    keywords: ["who are you", "what is your name", "explain yourself", "explain nexustalk", "what are you", "tell me about yourself"],
    responses: [
      "I am NexusTalk AI—an ultra-modern, rule-based engineering companion designed to assist with software practices, code optimization, and design mockups.",
      "I am NexusTalk AI! Unlike general generative models that can hallucinate, I rely on a deterministic rule-matching cluster to deliver reliable, lightning-fast tech advice."
    ]
  },
  c_programming: {
    title: "C Programming Language",
    keywords: ["what is c", "explain c", "c programming", "c language", "lang c", "pointer in c", "malloc", "gcc", "header file"],
    responses: [
      "C is a highly efficient, general-purpose, procedural programming language originally designed by Dennis Ritchie at Bell Labs in 1972. It is renowned for its low-level memory control, efficiency, and direct mapping to machine code.\n\nKey pillars of C include:\n- **Direct pointers**: Manipulating hardware addresses directly.\n- **Manual heap control**: Dynamic management via `malloc()` and `free()`.\n- **Static typing**: Enhancing runtime security and compiling to native assembly.",
      "C remains the bedrock of systems engineering. It powers operating system kernels (Unix, Linux, Windows), database backends, compilers, and embedded devices.\n\nHere is a simple C code block:\n```c\n#include <stdio.h>\nint main() {\n    printf(\"Hello, Workspace!\\n\");\n    return 0;\n}\n```\nAlways remember to check your array bounds and free dynamic memory!"
    ]
  },
  cpp_programming: {
    title: "C++ Programming Language",
    keywords: ["c++", "cpp", "c plus plus", "what is c++", "explain c++", "oops in c++", "stl", "std::vector", "destructor"],
    responses: [
      "C++ is a high-performance compiled language engineered by Bjarne Stroustrup in 1979 as an extension of C ('C with Classes'). It supports multiple paradigms: Procedural, Object-Oriented (OOP), Generic, and Functional.\n\nKey features of C++:\n- **OOP Principles**: Classes, Encapsulation, Polymorphism, and Inheritance.\n- **RAII**: Resource Acquisition Is Initialization for robust memory and file binding.\n- **Standard Template Library (STL)**: Highly optimized containers like `std::vector`, `std::map`, and algorithms.",
      "C++ provides zero-cost abstractions—you only pay for what you write and compile. It is heavily utilized in video game graphics engines (unreal engine), high-frequency financial trading arrays, browsers, and compiler toolchains.\n\nLet's keep smart pointers (`std::unique_ptr` and `std::shared_ptr`) active to prevent classic pointer memory leaks!"
    ]
  },
  python: {
    title: "Pythonic Core",
    keywords: ["python", "what is python", "explain python", "python language", "guido van rossum", "why python", "condas", "pip env"],
    responses: [
      "Python is an interpreted, high-level programming language formulated by Guido van Rossum. It is celebrated for its dynamic typing, automated memory management, clean indentation blocking, and extensive package landscape.\n\nKey pillars of Python include:\n- **Readability**: Clear, visual syntax resembling natural English.\n- **Aesthetic standard (PEP 8)**: Standardized guidelines for spacing and structures.\n- **Massive library database**: Leading global pipelines in AI, Machine Learning (PyTorch, TensorFlow), and web backends (FastAPI, Django).",
      "Python handles complex paradigms seamlessly. For instance, list comprehensions provide compact syntactic arrays:\n```python\n# Clean Python comprehension\nevendoubles = [x * 2 for x in range(20) if x % 2 == 0]\n```\nIts automated garbage collector abstracts traditional hardware memory tracking so you build tools rapidly!"
    ]
  },
  java: {
    title: "Java Platform",
    keywords: ["java", "what is java", "explain java", "jvm", "jdk", "garbage collector", "oops in java", "spring boot", "learn java"],
    responses: [
      "Java is a premium, class-based, object-oriented language developed by James Gosling at Sun Microsystems in 1995. Its core promise is 'Write Once, Run Anywhere' (WORA), enabled by compiling scripts into universal bytecode executed on local Java Virtual Machines (JVMs).\n\nPrimary rules of Java:\n- **Strict Object-Orientation**: Every instruction belongs to a class.\n- **JVM Garbage Collection**: Automatic sweep parameters freeing heap elements.\n- **Enterprise security**: Strict compile-time checks, type safety, and runtime sandboxing.",
      "Java powers massive backend microservices (via Spring Boot), enterprise banking systems, and legacy/modern Android apps.\n\nAn elegant Java snippet:\n```java\npublic class App {\n    public static void main(String[] args) {\n        System.out.println(\"Java JVM calibrated!\");\n    }\n}\n```\nMastering Polymorphism and interfaces keeps your Java services clean and maintainable!"
    ]
  },
  html: {
    title: "HyperText Markup Language",
    keywords: ["html", "what is html", "explain html", "hypertext markup", "html5", "semantic tag", "doctype", "viewport tag"],
    responses: [
      "HTML (HyperText Markup Language) is the standard semantic scaffold of the World Wide Web. It organizes page layout and headers using hierarchical structural elements called tags.\n\nEssential parameters:\n- **Semantic Elements**: Using tags like `<header>`, `<article>`, and `<main>` instead of unstyled `<div>`s for excellent SEO and assistive reader structures.\n- **HTML5 native standards**: Direct support for inline video feeds, localized offline forms, and dynamic visual graphics canvas tags."
    ]
  },
  css: {
    title: "Cascading Style Sheets",
    keywords: ["css", "what is css", "explain css", "cascading stylesheets", "flexbox", "tailwind", "box model", "css grid"],
    responses: [
      "CSS (Cascading Style Sheets) is the visual styling layout layer of the web. It manages colors, typography pairings, element transitions, and fluid page responses across all viewer viewpoints.\n\nCore elements worth mastering:\n- **Tailwind Grid & Flexbox**: Powering dynamic, responsive screen positioning.\n- **The Box Model**: Constructing spacing through margins, borders, padding, and inner width/height structures."
    ]
  },
  javascript: {
    title: "JavaScript Engine",
    keywords: ["javascript", "js", "what is javascript", "explain javascript", "es6", "event loop", "closures", "v8 engine", "async await"],
    responses: [
      "JavaScript is the high-level, dynamic, single-threaded interpreted language that drives web interactivity. Invented by Brendan Eich in 1995, JS has expanded from simple browser animations to complete server systems via Node.js.\n\nKey terms in JavaScript:\n- **Asynchronous Event Loop**: Resolving queries concurrently via callback stacks without freezing execution threads.\n- **Scope Closures**: Preserving inner functional memory to access parent variables after outer functions deactivate.\n- **ES6+ Standards**: Structuring arrays with arrows, destructured variables, and clean class notations."
    ]
  },
  sql: {
    title: "SQL & Relational Queries",
    keywords: ["sql", "structured query language", "what is sql", "explain sql", "select query", "joins in sql", "primary key", "foreign key"],
    responses: [
      "SQL (Structured Query Language) is the standard specialized query language designed to store, manage, and query data inside relational databases (like PostgreSQL, MySQL, and SQL Server).\n\nEssential Concepts:\n- **JOIN queries**: Merging distinct relational tables using foreign matches (INNER, LEFT, RIGHT, FULL OUTER joins).\n- **Constraints**: Enforcing schema rules via unique Primary Keys and relational Foreign Keys.\n- **Aggregation**: Summarizing records using GROUP BY, HAVING, and standard mathematical filters (SUM, COUNT, AVG)."
    ]
  },
  data_structures: {
    title: "Data Structures",
    keywords: ["data structures", "binary tree", "linked list", "stack", "queue", "graph", "heap", "bst", "array", "hashmap", "trie"],
    responses: [
      "Data Structures are structured arrangements to store, organize, and access metadata efficiently, rated using Big O computational notations for spatial and processing metrics.\n\nCrucial structures include:\n- **Linear containers**: Static Arrays, dynamic Linked Lists, Stacks (LIFO), and Queues (FIFO).\n- **High-speed lookup**: Hash Maps (delivering O(1) average lookup times).\n- **Hierarchical indices**: Binary Search Trees (BST), balanced Heaps (min/max prioritization), and Graphs."
    ]
  },
  operating_systems: {
    title: "Operating Systems",
    keywords: ["operating system", "os", "kernel", "process scheduling", "virtual memory", "paging", "deadlock", "multithreading", "semaphore", "mutex"],
    responses: [
      "An Operating System (OS) is the specialized software core that pilots computational hardware resource pools, distributing them safely to user applications.\n\nCrucial modules of an OS include:\n- **The Kernel**: Handling core processor allocations and security boundary permissions.\n- **Thread Managers**: Process scheduling routines (Round Robin, priority lists) and synchronization mutexes to avoid fatal deadlocks.\n- **Virtual Memory layers**: Mapping address segments with swap spaces via precise paging registers."
    ]
  },
  dbms: {
    title: "Database Management Systems",
    keywords: ["dbms", "database management", "acid properties", "normalization", "1nf", "2nf", "3nf", "bcnf", "rdbms"],
    responses: [
      "A Database Management System (DBMS) is software designed to coordinate concurrent user queries, tables, and files securely.\n\nProfessional guidelines enforce the ACID properties:\n- **Atomicity**: Executing transactions completely or rolling back fully.\n- **Consistency**: Ensuring data matches existing schema structures.\n- **Isolation**: Isolating contemporaneous transactions from corruptive leaks.\n- **Durability**: Securing committed changes against sudden host crashes.\n\nDatabase designs utilize Normalization (1NF, 2NF, 3NF, BCNF) to compress redundant indices!"
    ]
  },
  computer_networks: {
    title: "Computer Networks",
    keywords: ["computer network", "networking", "osi model", "tcp ip", "dns", "router", "switch", "http", "https", "ip address", "port numbers"],
    responses: [
      "Computer Networks enable distributed machines to handshake and share packets securely over physical and air media.\n\nThese interactions are modeled globally using standard layers:\n- **The OSI Model**: Structuring networking into 7 progressive layers (Physical, Data Link, Network, Transport, Session, Presentation, Application).\n- **TCP/IP framework**: Core internet protocol stack where TCP coordinates delivery streams and IP guides packet routing.\n- **Essential systems**: DNS translating user names to numeric IP addresses, and secure HTTPS channels encrypting socket requests."
    ]
  },
  artificial_intelligence: {
    title: "Artificial Intelligence",
    keywords: ["artificial intelligence", "ai", "what is ai", "explain ai", "define ai", "machine intelligence", "expert systems"],
    responses: [
      "Artificial Intelligence (AI) simulates human memory reflection, reasoning, and pattern recognition inside software frameworks.\n\nKey paradigms include:\n- **Heuristic rule engines (like me!)**: Logical matrices resolving queries cleanly without hallucinations.\n- **Generative AI systems**: Complex probabilistic neural modules producing custom media blocks on demand.\n- **Expert networks**: Semantic graphs mapping relationships to diagnose situations."
    ]
  },
  machine_learning: {
    title: "Machine Learning Math",
    keywords: ["machine learning", "ml", "supervised", "unsupervised", "regression", "classification", "overfitting", "underfitting", "random forest", "gradient descent"],
    responses: [
      "Machine Learning (ML) is an AI specialty focused on training mathematical models on existing sample datasets to make future predictions, rather than relying on manually programmed procedural codes.\n\nParadigms include:\n- **Supervised Learning**: Mapping targets using Regression or Classification algorithms.\n- **Unsupervised Learning**: Clustering unstructured groups (using K-Means or PCA).\n- **Reinforcement loops**: Rewarding software actors for resolving state pathways."
    ]
  },
  deep_learning: {
    title: "Neural Architectures",
    keywords: ["deep learning", "neural network", "backpropagation", "convolutional", "transformer"],
    responses: [
      "Deep Learning (DL) leverages layered Artificial Neural Networks to simulate sensory processing, tackling high-dimensional data like images, audio, and large-scale text.",
      "The backbone of DL training is the 'backpropagation' algorithm. It computes partial derivatives of the cost function relative to weights, fine-tuning them via gradient descent.",
      "While brilliant, Deep Learning models demand extensive training clusters (GPUs/TPUs) and immense datasets, unlike lighter heuristic or rule architectures."
    ]
  },
  data_science: {
    title: "Data Science Workflow",
    keywords: ["data science", "data scientist", "pandas", "numpy", "analytics", "data analysis"],
    responses: [
      "Data Science blends math modeling, specialized code interfaces, and domain expertise to capture actionable knowledge from complex records.",
      "The golden standard workflow includes: Business Understanding -> Data Collection -> Thorough Cleansing -> Feature Engineering -> Modeling -> Production Deployment.",
      "To level up, master Python's Pandas library for tabular parsing, and Seaborn/Matplotlib for designing high-impact interactive data stories!"
    ]
  },
  interview_tips: {
    title: "Career Preparedness",
    keywords: ["interview", "job interview", "mock interview", "coding interview", "technical interview", "behavioral", "interview preparation", "interview tip", "how to prepare for interview", "leetcode"],
    responses: [
      "To ace your technical software developer interview, utilize the **STAR strategy**:\n- **S**ituation: Map out the computational challenge.\n- **T**ask: Distill your exact objective.\n- **A**ction: Code the modular, readable solution while explaining it.\n- **R**esult: Clarify performance outcomes and space/time Big O complexity.",
      "Always communicate out loud! Review panels assess your problem decomposition, mental composure under syntax crashes, and edge-case discovery much more than raw speed.",
      "Pro-Tip: Prepare three original, business-oriented questions for the panel at the end. It showcases strong research, interest, and professional initiative!"
    ]
  },
  resume_tips: {
    title: "Resume Blueprint",
    keywords: ["resume", "portfolio", "cover letter", "cv guide", "resume guidance", "resume tips", "ats friendly"],
    responses: [
      "To excel in automated Applicant Tracking Systems (ATS), choose descriptive action verbs (e.g., 'Spearheaded', 'Architected', 'Refactored') and keep layouts in a single column without tables.",
      "Format achievements using Google's **X-Y-Z template**:\n*'Accomplished [X] as measured by [Y], by executing [Z].'*\n\nExample:\n*\"Boosted database query processing efficiency by 34% (as measured by Datadog analytics) by implementing a localized Redis caching system and indices.\"*",
      "Embed links to active GitHub projects featuring comprehensive README guidelines with live preview anchors. Keep visual resumes extremely clean!"
    ]
  },
  career_guidance: {
    title: "Career Navigation",
    keywords: ["career", "job market", "tech role", "software engineer career", "how to get a job", "career advice", "career path", "junior engineer"],
    responses: [
      "A fulfilling career is a marathon. Aim to develop a **T-shaped skill profile**: robust knowledge in general foundational coordinates (OS, databases, networking, servers), paired with profound expertise in one specialized domain.",
      "Never underestimate community involvement. Attend meetings, support open-source, write clean articles, and showcase your daily compile accomplishments online.",
      "Engineering success is built on active empathy. High emotional intelligence, active listening, and agile project delivery are often what secure faster team leadership promotions."
    ]
  },
  internship_advice: {
    title: "Internship Mastery",
    keywords: ["internship", "placement", "work experience", "junior dev", "intern advice"],
    responses: [
      "As an intern, curiosity is your superpower. Research thoroughly, take detailed notes during standups, and never hide when a feature is blocking you.",
      "Log your daily bug triumphs and feature metrics in a private journal. It simplifies your final evaluations and makes updating your resume incredibly easy!",
      "Be a team multiplier: write thorough wiki documentations, help peer-review minor pull requests, and contribute to resolving backlog technical debts."
    ]
  },
  coding_tips: {
    title: "Clean Code Tips",
    keywords: ["recipies", "write clean code", "refactor", "readable", "clean code", "clean code practices"],
    responses: [
      "Write code for humans first, and compilers second. Choose expressive, descriptive variable names rather than cryptic codes like 'x' or 'temp_val'.",
      "Decrease nested block complexity by using 'Guard Clauses' that return early when validation criteria fail. It instantly straightens your logic layout!",
      "Observe the DRY framework (Don't Repeat Yourself). If you copy-paste an instruction block twice, encapsulate it cleanly into a parameterized function."
    ]
  },
  motivation: {
    title: "Developer Motivation",
    keywords: ["motivation", "discouraged", "depressed", "sad", "stress", "burned out", "imposter syndrome", "give up", "hard time", "motivational quote", "vibe check"],
    responses: [
      "Imposter syndrome is concrete proof that you are actively stepping into your growth zone. Every senior tech lead has faced that same feeling. Press forward!",
      "Great engineering is the sum of tiny, daily improvements. Take a screen break, stand up, drink some water, and come back. You have absolute capability!",
      "Never compare your Chapter 1 with another developer's Chapter 20. Your pathway is unique. Celebrate your private compile triumphs!",
      "The expert in anything was once a beginner who refused to quit. Be patient with your learning process and take pride in today's effort."
    ]
  },
  project_ideas: {
    title: "Portfolio Ideas",
    keywords: ["project", "portfolio project", "ideas", "project ideas", "what to build"],
    responses: [
      "Dynamic Portfolio Idea: Build an offline-first task workspace dashboard showcasing weather reports, interactive stats grid, and custom productivity cards.",
      "Back-End Power Project: Build a complete customized API Gateway from scratch featuring token verification, adaptive request rate-limiting, and error logging.",
      "Full-Stack Breakthrough: Develop a real-time markdown editor with clean synchronous preview, folder hierarchy structure, and visual PDF export capabilities."
    ]
  },
  study_tips: {
    title: "Study Mechanics",
    keywords: ["study", "learn", "study tips", "revision", "homework", "focus", "pomodoro"],
    responses: [
      "Adopt the Pomodoro System: maintain absolute focus on your code for 25 minutes, then take a 5-minute physical break. Every 4 rounds, enjoy a longer recovery.",
      "Utilize Active Recall: rather than highlighting text over and over, close your manual and write a program structure entirely from memory.",
      "Designate a zero-friction zone: silence your notifications, clear physical workspace clutter, and put on lo-fi instrumentals or brown noise blocks."
    ]
  },
  tech_facts: {
    title: "Compute History",
    keywords: ["fact", "trivia", "did you know", "tech facts", "technology fact", "tell me a tech fact", "computer facts"],
    responses: [
      "In 1947, the legendary Grace Hopper cataloged the very first physical calculator 'bug'—an actual moth found stuck inside a relay of the Harvard Mark II computer!",
      "Over 5.2 billion citizens worldwide use smartphones, meaning more than half of humanity carries computational capacity that dwarfs Apollo 11's systems.",
      "The very first registered domain name in internet history was 'symbolics.com', recorded on March 15, 1985. It serves as an active computing museum today!"
    ]
  },
  nlp: {
    title: "NLP Logic",
    keywords: ["nlp", "natural language", "text processing", "tokenization", "regex", "stemming"],
    responses: [
      "Natural Language Processing (NLP) enables machines to index human language. It is powered by pipelines like tokenization, lemmatization, and syntax parses.",
      "Early NLP relied heavily on expert syntax rules and lookups (similar to my blazing fast rule matching!). Modern NLP utilizes deep attention mechanism models.",
      "Starting NLP in Python? Scrutinize 'NLTK' (Natural Language Toolkit) or 'spaCy' for highly optimized, industrial-grade syntactic parsing wrappers."
    ]
  },
  cv_vision: {
    title: "Computer Vision",
    keywords: ["computer vision", "image processing", "opencv", "object detection", "yolo", "segmentation"],
    responses: [
      "Computer Vision (CV) empowers systems to evaluate patterns from multidimensional arrays, analyzing camera feeds or scanned datasets.",
      "Prominent CV patterns span from classical Sobel/Canny edge-detection pipelines to deep convolutional architectures like YOLO for real-time video profiling.",
      "To start your CV track, examine OpenCV for Python. You can design an active camera face-tracking script in under 25 lines of neat code!"
    ]
  },
  databases: {
    title: "Database Architectures",
    keywords: ["database", "postgresql", "mysql", "sqlite", "relational", "nosql", "query"],
    responses: [
      "Relational databases (SQL like PostgreSQL, MySQL) organize data structures in schemas and foreign dependencies with rich ACID guarantees.",
      "NoSQL document databases (like Firestore or MongoDB) accommodate JSON structures with high horizontal flexibility, making scaling remarkably straightforward.",
      "Database Optimization Tip: Always index columns frequently utilized in 'WHERE' or 'JOIN' clauses, upgrading linear scans to logarithmic lookups!"
    ]
  },
  cloud_computing: {
    title: "Cloud Infrastructure",
    keywords: ["cloud", "docker", "serverless", "kubernetes", "deployment"],
    responses: [
      "Cloud Computing offers rapid, utility-billed digital services (computation, key-value stores, server arrays) over the internet via GCP, AWS, or Azure.",
      "Containerization tools (like Docker) bundle code packages, static libraries, and system configurations to secure a highly predictable launch pipeline.",
      "Serverless templates (such as Google Cloud Run or AWS Lambda) resolve host provisioning completely, auto-scaling instances in microsecond response to web loads."
    ]
  },
  frontend: {
    title: "Modern Frontend",
    keywords: ["frontend", "react", "tailwind", "responsive", "dom"],
    responses: [
      "Frontend engineering focuses on crafting smooth, sensory interfaces using HTML structures, Tailwind layout styling, and robust state engines like React.",
      "Always design with high contrast, semantic aria labels, and solid keyboard navigation in mind to keep your apps accessible to all.",
      "Modern React optimizes rendering via a dynamic Virtual DOM, selectively synchronizing component state adjustments with physical browser nodes."
    ]
  },
  git: {
    title: "Version Control",
    keywords: ["git", "github", "commit", "branch", "merge", "pull request", "fork"],
    responses: [
      "Git is a distributed version control utility that indexes repository modifications, allowing clean team branch merges and simple rollbacks.",
      "A golden Git practice: Keep commits atomic, and author clear imperative-mood descriptions (e.g., 'Configure login validation' over 'fixed files').",
      "A continuous green contribution grid on your GitHub profile tells recruiting teams you have active, disciplined code-creation habits!"
    ]
  },
  best_practices: {
    title: "Architectural Practice",
    keywords: ["best practices", "solid", "dry principle", "design pattern", "clean code"],
    responses: [
      "Incorporate SOLID engineering coordinates: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.",
      "Strive to keep your functions modular. A robust benchmark is that a routine should specialize in exactly one action and fit inside your editor fold.",
      "Use comments to define the 'Why' of anomalous workarounds, letting the explicit design and descriptive variable names clarify the 'What'."
    ]
  },
  algorithms: {
    title: "Algorithms & Structures",
    keywords: ["algorithm", "sorting", "complexity", "big o"],
    responses: [
      "Algorithms represent step-by-step procedures to resolve issues, modeled via Big O metrics for computational space and time efficiency.",
      "Consistently master core containers: tabular Hash Maps, Stack registers, dual-link lists, Heap hierarchies, and Graph indexes.",
      "When tackling bottlenecks, review trading memory for latency. Leveraging a Hash Map (O(1) lookup) bypasses standard O(N^2) double-iteration loops!"
    ]
  },
  agile: {
    title: "Agile Alignment",
    keywords: ["agile", "scrum", "sprint", "kanban", "standup", "backlog", "retrospective"],
    responses: [
      "Agile cycles design continuous, collaborative loops to deploy usable software incrementally. Scrum provides concrete frameworks inside this model.",
      "Teams align on goals inside 2-week 'Sprints', synchronizing daily challenges in standups and refining team friction in retrospectives.",
      "Kanban boards leverage visual task columns ('To Do', 'In Progress', 'QA', 'Done'), highlighting bottlenecks via strict Work-In-Progress caps."
    ]
  },
  ai_ethics: {
    title: "AI Ethics",
    keywords: ["ethics", "ai bias", "hallucinate", "cybersecurity", "safety", "explainable ai", "responsible ai"],
    responses: [
      "AI Ethics addresses societal dangers, model biases, and copyright transparency to prevent algorithms from executing unfair predictions.",
      "A key issue in modern deep networks is 'hallucination'—where a model invents fabrications. This makes rule-guarded systems highly relevant!",
      "Responsible developer habits demand 'Explainability'—engineering architectures where step-by-step logic pathways are inspectable and clear."
    ]
  },
  help: {
    title: "Intelligent Guidance",
    keywords: ["help", "commands", "what can you do", "how to use", "options", "help menu", "help me with commands"],
    responses: [
      "Hello! I am prepared to analyze queries about: 🐍 Python templates, 💼 ATS resumes, 🤖 Computer science, 🧠 ML algorithms, or 💻 Project scopes. Tap any action badge or write a command!",
      "I house over 34 precise heuristic command templates. Try writing topics like 'Give me a python tip', 'What is deep learning?', 'Resume tips', or 'Study tips'!"
    ]
  },
  python_tips: {
    title: "Python Tips",
    keywords: ["python tip", "list comprehension", "decorator", "pep 8", "generator"],
    responses: [
      "Python tip: Use list comprehensions for compact arrays. E.g., `evens = [n for n in range(50) if n % 25 == 0]` replaces a standard four-line setup beautifully.",
      "Python tip: Deploy generators (`yield` statements) when parsing gargantuan logs. They stream data rows on-demand, saving your computing RAM from crashes!",
      "Python tip: Observe PEP 8 styles. Keep lines under 79 letters, use 4-space indentations, and define methods in snake_case to preserve readability."
    ]
  },
  ai_facts: {
    title: "Artificial Intelligence Facts",
    keywords: ["ai fact", "turing test", "kasparov", "deep blue", "alphafold"],
    responses: [
      "AI Fact: In 1997, IBM's Deep Blue bested master Garry Kasparov, utilizing heuristic search matrices that solved millions of path choices per microsecond!",
      "AI Fact: Google DeepMind's AlphaFold resolved a 50-year-old biological mystery in 2020 by forecasting protein folds with incredible scientific accuracy.",
      "AI Fact: The Turing Test, proposed by Alan Turing in 1950, examines if a digital system can manifest conversation indistinguishable from a fellow human."
    ]
  },
  programming_tips: {
    title: "Developer Wisdom",
    keywords: ["programming tip", "debug", "stack overflow", "rubber duck", "error message"],
    responses: [
      "Developer tip: Leverage Rubber Duck Debugging! Describing your logic routine line-by-line to an inanimate toy forces you to identify logical lapses.",
      "Developer tip: Review compile outputs from bottom to top. 90% of structural errors are detailed in the terminal stack's last three lines.",
      "Developer tip: Write programmatic unit tests. Crafting basic assertions early shields your team from regression bugs during refactoring."
    ]
  }
};

const DEFAULT_MATCH_RESPONSES = [
  "I don't have a predefined answer for that yet. Try asking about programming, AI, Python, C, Java, careers, or interview topics.",
  "I don't have a predefined answer for that yet. Try asking about programming, AI, Python, C, Java, careers, or interview topics."
];

// Heuristic keyword matcher prioritizing the best match score case-insensitively
function getRuleResponse(message: string, name: string): { text: string; intent: string; title: string } {
  const msgLower = message.toLowerCase().trim();
  const msgCleaned = msgLower.replace(/[^\w\s+#-]/g, " ");

  let bestIntent: string | null = null;
  let bestTitle: string = "System Fallback";
  let bestScore = 0;
  let maxLengthMatched = 0;

  for (const [intent, details] of Object.entries(INTENT_PRESETS)) {
    for (const kw of details.keywords) {
      const cleanKw = kw.toLowerCase();
      
      if (msgLower === cleanKw) {
        // Exact match is the absolute highest priority match
        const score = 100 + cleanKw.length;
        if (score > bestScore) {
          bestScore = score;
          bestIntent = intent;
          bestTitle = details.title;
          maxLengthMatched = cleanKw.length;
        }
      } else {
        // Substring / word boundary matches
        const index = msgLower.indexOf(cleanKw);
        if (index !== -1) {
          let score = 10 + cleanKw.length;
          
          // Boost significantly if matches a clean word boundary in msgCleaned
          const cleanedIndex = msgCleaned.indexOf(cleanKw);
          if (cleanedIndex !== -1) {
            const beforeChar = cleanedIndex > 0 ? msgCleaned[cleanedIndex - 1] : " ";
            const afterChar = cleanedIndex + cleanKw.length < msgCleaned.length ? msgCleaned[cleanedIndex + cleanKw.length] : " ";
            if (beforeChar === " " && afterChar === " ") {
              score += 40; // Word boundary match priority is higher than general substring matching
            }
          }
          
          if (score > bestScore || (score === bestScore && cleanKw.length > maxLengthMatched)) {
            bestScore = score;
            bestIntent = intent;
            bestTitle = details.title;
            maxLengthMatched = cleanKw.length;
          }
        }
      }
    }
  }

  if (bestScore > 0 && bestIntent) {
    const details = INTENT_PRESETS[bestIntent];
    const randomResp = details.responses[Math.floor(Math.random() * details.responses.length)];
    return {
      text: randomResp.replace(/{name}/g, name),
      intent: bestIntent,
      title: details.title
    };
  }

  return {
    text: "I don't have a predefined answer for that yet. Try asking about programming, AI, Python, C, Java, careers, or interview topics.",
    intent: "default",
    title: "System Fallback"
  };
}

export default function App() {
  // Persistence States
  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem("react_username") || "";
  });
  
  // Locked permanently to vibrant holographic dark mode
  const theme = "dark";
  const setTheme = (val: "light" | "dark") => {}; // Mock setter to handle any internal reference cleanly
  
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem("react_sessions");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    return localStorage.getItem("react_active_id") || null;
  });

  // Mode: "landing" or "chat"
  const [currentView, setCurrentView] = useState<"landing" | "chat">(() => {
    // If user has active session and username, enter chat immediately; otherwise start at landing
    const savedActiveId = localStorage.getItem("react_active_id");
    const savedUser = localStorage.getItem("react_username");
    return (savedActiveId && savedUser && savedUser.trim()) ? "chat" : "landing";
  });

  // UI Interactive States
  const [inputVal, setInputVal] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [copyToast, setCopyToast] = useState<string | null>(null);

  // Custom Modal States
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmClearAllOpen, setConfirmClearAllOpen] = useState<boolean>(false);
  const [confirmClearChatOpen, setConfirmClearChatOpen] = useState<boolean>(false);

  // Refs for scrolling and animations
  const listEndRef = useRef<HTMLDivElement>(null);

  // Sync state modifications to storage
  useEffect(() => {
    localStorage.setItem("react_username", username);
    localStorage.setItem("react_theme", "dark");
    localStorage.setItem("react_sessions", JSON.stringify(sessions));
    localStorage.setItem("react_active_id", activeSessionId || "");

    // Apply document dark styling class and class list body variables
    document.documentElement.classList.add("dark");
  }, [username, sessions, activeSessionId]);

  // Scroll message board to end
  useEffect(() => {
    if (currentView === "chat") {
      listEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [sessions, activeSessionId, isTyping, currentView]);

  // Find current session object
  const currentSession = sessions.find(s => s.id === activeSessionId) || null;

  // Statistics calculation
  const totalMessagesSent = sessions.reduce((sum, s) => sum + s.messages.filter(m => m.sender === "user").length, 0);

  // Profile management
  const handleSaveUsername = (nameVal: string) => {
    const clean = nameVal.trim();
    setUsername(clean);
    setTempName(clean);
    setSettingsOpen(false);
    if (!clean) {
      setCurrentView("landing");
    }
  };

  // Launch fresh chat session
  const handleStartSession = (initialQuery?: string) => {
    const userToUse = username.trim() || "Developer";

    const timestamp = Date.now();
    const formattedDate = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    const botGreet: Message = {
      id: "msg_greet_" + timestamp,
      sender: "bot",
      text: `Welcome, ${userToUse}! How can I help you today?`,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      intent: "greeting"
    };

    const newSess: ChatSession = {
      id: "session_" + timestamp,
      date: formattedDate,
      startTime: timestamp,
      title: initialQuery ? (initialQuery.length > 22 ? initialQuery.substring(0, 20) + "..." : initialQuery) : "System Discussion #" + (sessions.length + 1),
      messages: [botGreet]
    };

    setSessions(prev => [newSess, ...prev]);
    setActiveSessionId(newSess.id);
    setCurrentView("chat");

    if (initialQuery) {
      // Add the user query right after greeting is printed
      setTimeout(() => {
        handleSendMessageDirect(newSess.id, initialQuery, userToUse);
      }, 400);
    }
  };

  // Handle send message logic inside an active session
  const handleSendMessage = (messageText: string) => {
    if (!activeSessionId) return;
    handleSendMessageDirect(activeSessionId, messageText, username);
  };

  const handleSendMessageDirect = (targetSessionId: string, messageText: string, userTag: string) => {
    if (!messageText.trim()) return;

    const timestamp = Date.now();
    const timeStr = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const userMsg: Message = {
      id: "msg_" + timestamp,
      sender: "user",
      text: messageText,
      timestamp: timeStr
    };

    setSessions(prev => {
      return prev.map(s => {
        if (s.id !== targetSessionId) return s;
        
        let newTitle = s.title;
        if (s.title.startsWith("System Discussion #") || s.messages.length <= 1) {
          const words = messageText.split(" ").slice(0, 3).join(" ");
          newTitle = words.length > 22 ? words.substring(0, 20) + "..." : words;
        }

        return {
          ...s,
          title: newTitle,
          messages: [...s.messages, userMsg]
        };
      });
    });

    setInputVal("");
    setIsTyping(true);

    // Dynamic typing delay for realism
    setTimeout(() => {
      const match = getRuleResponse(messageText, userTag);
      const botMsg: Message = {
        id: "msg_bot_" + Date.now(),
        sender: "bot",
        text: match.text,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        intent: match.intent
      };

      setSessions(prev => {
        return prev.map(s => {
          if (s.id !== targetSessionId) return s;
          return {
            ...s,
            messages: [...s.messages, botMsg]
          };
        });
      });
      setIsTyping(false);
    }, 800);
  };

  // Execute quick actions from Landing or Chat Screen
  const handleQuickAction = (queryText: string) => {
    if (!activeSessionId) {
      handleStartSession(queryText);
    } else {
      setCurrentView("chat");
      handleSendMessage(queryText);
    }
  };

  // Delete atomic session
  const executeDeleteSession = () => {
    if (!confirmDeleteId) return;
    setSessions(prev => prev.filter(s => s.id !== confirmDeleteId));
    if (activeSessionId === confirmDeleteId) {
      setActiveSessionId(null);
    }
    setConfirmDeleteId(null);
  };

  // Clear all chats safely
  const executeClearAllHistory = () => {
    setSessions([]);
    setActiveSessionId(null);
    setConfirmClearAllOpen(false);
  };

  // Clear current active dialogue exchange stream
  const executeClearCurrentChat = () => {
    if (!activeSessionId) return;
    setSessions(prev => {
      return prev.map(s => {
        if (s.id !== activeSessionId) return s;
        return {
          ...s,
          messages: [{
            id: "msg_clear_" + Date.now(),
            sender: "bot",
            text: `Conversation logs have been reset for this active stream. How can I assist you next, ${username || "Developer"}?`,
            timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
            intent: "help"
          }]
        };
      });
    });
    setConfirmClearChatOpen(false);
  };

  // Export conversation as beautiful styled TXT file
  const handleExportTextLog = () => {
    if (!currentSession || currentSession.messages.length === 0) {
      return;
    }

    let textOut = `==================================================\n`;
    textOut += `   NEXUSTALK AI - INTELLIGENT EXPORT DOSSIER\n`;
    textOut += `==================================================\n`;
    textOut += `User Engineer: ${username || "Developer"}\n`;
    textOut += `Format Date:    ${currentSession.date}\n`;
    textOut += `Session Title:  ${currentSession.title}\n`;
    textOut += `Session ID:     ${currentSession.id}\n`;
    textOut += `Total Messages: ${currentSession.messages.length}\n`;
    textOut += `--------------------------------------------------\n\n`;

    currentSession.messages.forEach(msg => {
      const senderLabel = msg.sender === "user" ? (username || "User") : "NexusTalk AI Bot";
      const intentVal = msg.intent && msg.intent !== "default" ? ` [Intent: ${msg.intent.toUpperCase()}]` : "";
      textOut += `[${msg.timestamp}] ${senderLabel}${intentVal}:\n`;
      textOut += `>> ${msg.text}\n`;
      textOut += `--------------------------------------------------\n`;
    });

    textOut += `\nExported from NexusTalk AI Dashboard - 2026.`;

    const blob = new Blob([textOut], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nexustalk_export_${currentSession.id}.txt`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);

    setCopyToast("Exported .txt file successfully!");
    setTimeout(() => setCopyToast(null), 2000);
  };

  // Copy helper
  const handleCopyClipboardMsg = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyToast("Copied to clipboard!");
      setTimeout(() => setCopyToast(null), 1500);
    }).catch(err => console.warn(err));
  };

  // Filter history listings via Search Box
  const filteredSessions = sessions.filter(sess => {
    const matchSearch = sess.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sess.messages.some(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchSearch;
  });

  return (
    <div id="react_app" className="relative flex h-screen w-full overflow-hidden bg-[#07070e] text-slate-100 font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* STELLAR ANIMATED 3D TECH GRID/NEURAL BACKGROUND */}
      <TechBackground />

      {/* DEEP COGNITIVE LUMINESCENT ORB GLOWS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[5%] left-[15%] w-[40%] h-[40%] rounded-full bg-cyan-400/5 blur-[140px] animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute bottom-[10%] right-[10%] w-[45%] h-[45%] rounded-full bg-violet-650/5 blur-[160px] animate-pulse" style={{ animationDuration: "12s", animationDelay: "2s" }} />
      </div>

      {/* RENDER THE MAJESTIC HERO LANDING PAGE */}
      {currentView === "landing" && (
        <LandingView 
          username={username}
          setUsername={setUsername}
          handleStartSession={handleStartSession}
          handleQuickAction={handleQuickAction}
          totalMessagesSent={totalMessagesSent}
          sessionsCount={sessions.length}
          setCurrentView={setCurrentView}
        />
      )}

      {false && currentView === "landing" && (
        <div className="flex-1 w-full h-full flex flex-col overflow-y-auto relative z-10">
          
          {/* HEADER BAR FOR LANDING VIEW */}
          <header className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/20">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView("landing")}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <Bot className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-left">
                <h1 className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
                  NexusTalk AI
                </h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Rule Engine v2.4</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {username && (
                <button
                  onClick={() => setCurrentView("chat")}
                  className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                >
                  <span>Active Workspace</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
              
              <button 
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                title="Toggle visual mode"
              >
                {theme === "dark" ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-violet-600" />}
              </button>
            </div>
          </header>

          {/* MAIN HERO SECTION */}
          <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* HERO LEFT: TEXT, TAGLINE and ONBOARDING CONTAINER */}
            <div className="flex-1 text-left space-y-8 max-w-xl">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center space-x-2 bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-100/50 dark:border-indigo-900/30 px-3 py-1.5 rounded-full">
                  <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400 animate-spin" style={{ animationDuration: "3s" }} />
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wide">Premium Mock Internship Showcase</span>
                </div>
                
                <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                  NexusTalk AI – <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">Intelligent Rule-Based</span> Assistant
                </h2>
                
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed font-sans font-normal max-w-lg">
                  Navigate software engineering concepts using an extensive network of deterministic semantic filters. 100% hallucination-free, zero lag, and equipped with live data widgets.
                </p>
              </motion.div>

              {/* DYNAMIC USERNAME CAPTURE PANEL */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="p-6 bg-white/75 dark:bg-slate-900/75 border border-slate-200/60 dark:border-slate-800/40 rounded-2xl shadow-xl backdrop-blur-md space-y-4"
              >
                <div className="flex items-center space-x-3 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <UserCog className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Configure Sandbox Identity</h3>
                    <p className="text-[11px] text-slate-400">Provide your name for personalized outputs.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    placeholder="E.g., intern_engineer"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-950 text-xs px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 outline-none text-slate-700 dark:text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                  />
                  <button 
                    onClick={() => handleStartSession()}
                    className="py-3 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 flex items-center justify-center space-x-2 cursor-pointer shrink-0"
                  >
                    <span>Enter Workspace</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>

              {/* QUICK SUGGESTION CHIPS GRID FOR THE HERO BOARD */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <p className="text-[10px] uppercase font-extrabold text-slate-400 dark:text-slate-500 tracking-widest">Interactive Quick Triggers</p>
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
                      onClick={() => handleQuickAction(chip)}
                      className="bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/30 hover:border-indigo-500 dark:hover:border-indigo-400 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-[11px] font-medium py-1.5 px-3 rounded-lg transition-all shadow-xs cursor-pointer select-none"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </motion.div>

            </div>

            {/* HERO RIGHT: ANIMATED AI ORB ILLUSTRATION AND STATS WIDGETS */}
            <div className="flex-1 w-full max-w-md flex flex-col items-center justify-center space-y-8">
              
              {/* INTERACTIVE FLOATING AI GLOWING LOGO */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative w-72 h-72 flex items-center justify-center"
              >
                
                {/* Background rotating cosmic lines */}
                <div className="absolute inset-0 border-2 border-dashed border-indigo-500/20 dark:border-indigo-400/10 rounded-full animate-spin" style={{ animationDuration: "25s" }} />
                <div className="absolute inset-4 border border-dashed border-purple-500/20 dark:border-purple-400/10 rounded-full animate-spin" style={{ animationDuration: "12s", animationDirection: "reverse" }} />
                
                {/* Outer Glassmorphic Pulse Shell */}
                <div className="absolute w-56 h-56 rounded-full bg-indigo-500/10 dark:bg-indigo-600/5 blur-md animate-pulse" />
                
                {/* Glowing Core Particle Orb */}
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="w-40 h-40 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-650 to-pink-500 flex flex-col items-center justify-center shadow-2xl shadow-indigo-500/40 relative z-10 border border-white/20 select-none"
                >
                  <Bot className="w-16 h-16 text-white animate-bounce mt-2" style={{ animationDuration: "4s" }} />
                  <div className="absolute bottom-6 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
                    <span className="text-[9px] font-extrabold text-indigo-100 uppercase tracking-widest font-mono">CALIBRATED</span>
                  </div>
                </motion.div>

                {/* Satellite Floating Badges */}
                <div className="absolute -top-2 left-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 px-2.5 py-1 rounded-lg text-[10px] font-mono shadow-md text-slate-500">
                  ⚡ Heuristics OK
                </div>
                <div className="absolute -bottom-2 right-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 px-2.5 py-1 rounded-lg text-[10px] font-mono shadow-md text-slate-500">
                  📂 LocalStorage Sync
                </div>
              </motion.div>

              {/* DASHBOARD STATISTICS WIDGET GRID */}
              <div className="w-full grid grid-cols-2 gap-4">
                
                <div className="bg-white/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/30 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-left">
                  <div className="flex items-center space-x-2 text-slate-400/80 mb-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Sent Queries</span>
                  </div>
                  <p className="font-display text-2xl font-extrabold text-slate-800 dark:text-white leading-tight">
                    {totalMessagesSent}
                  </p>
                  <p className="text-[9px] text-slate-400 mt-0.5">Across active sessions</p>
                </div>

                <div className="bg-white/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/30 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-left">
                  <div className="flex items-center space-x-2 text-slate-400/80 mb-2">
                    <MessageSquare className="w-4 h-4 text-indigo-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Saved Conversations</span>
                  </div>
                  <p className="font-display text-2xl font-extrabold text-slate-800 dark:text-white leading-tight">
                    {sessions.length}
                  </p>
                  <p className="text-[9px] text-slate-400 mt-0.5">Buffered in browser memory</p>
                </div>

                <div className="bg-white/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/30 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-left">
                  <div className="flex items-center space-x-2 text-slate-400/80 mb-2">
                    <Bot className="w-4 h-4 text-purple-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Theme</span>
                  </div>
                  <p className="font-display text-base font-extrabold text-slate-800 dark:text-white capitalize flex items-center space-x-1">
                    <span>{theme} mode</span>
                  </p>
                  <p className="text-[9px] text-slate-400 mt-1">High fidelity CSS transitions</p>
                </div>

                <div className="bg-white/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/30 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-left">
                  <div className="flex items-center space-x-2 text-slate-400/80 mb-2">
                    <UserCog className="w-4 h-4 text-violet-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sandbox Alias</span>
                  </div>
                  <p className="font-display text-base font-extrabold text-slate-800 dark:text-white truncate" title={username || "Unregistered"}>
                    {username || "Guest User"}
                  </p>
                  <p className="text-[9px] text-slate-400 mt-1">Changeable under Preferences</p>
                </div>

              </div>

            </div>

          </main>

          {/* FOOTER */}
          <footer className="w-full text-center py-6 text-[10px] text-slate-400 tracking-wider">
            NexusTalk AI Workspace © 2026. Built with pristine detail for mock internship submission.
          </footer>

        </div>
      )}

      {/* RENDER THE ACTIVE CHAT WORKSPACE MODULE */}
      {currentView === "chat" && (
        <ChatWorkspace 
          sessions={sessions}
          activeSessionId={activeSessionId}
          setActiveSessionId={setActiveSessionId}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredSessions={filteredSessions}
          setConfirmDeleteId={setConfirmDeleteId}
          setConfirmClearAllOpen={setConfirmClearAllOpen}
          setConfirmClearChatOpen={setConfirmClearChatOpen}
          handleStartSession={handleStartSession}
          handleSendMessage={handleSendMessage}
          inputVal={inputVal}
          setInputVal={setInputVal}
          handleExportTextLog={handleExportTextLog}
          username={username}
          setTempName={setTempName}
          setSettingsOpen={setSettingsOpen}
          handleCopyClipboardMsg={handleCopyClipboardMsg}
          isTyping={isTyping}
          listEndRef={listEndRef}
          setCurrentView={setCurrentView}
          totalMessagesSent={totalMessagesSent}
        />
      )}

      {false && currentView === "chat" && (
        <div className="flex-1 w-full h-full flex overflow-hidden relative z-10">
          
          {/* SLIDABLE LEFT SIDEBAR DRAW PANEL */}
          <aside className={`w-80 shrink-0 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md flex flex-col transition-all duration-300 z-30 transform fixed md:static h-full ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}>
            
            {/* BRAND HEADER & LOGO */}
            <div className="p-4 border-b border-slate-200/80 dark:border-slate-800/85 flex items-center justify-between">
              <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setCurrentView("landing")}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="text-left leading-none">
                  <span className="font-bold text-sm tracking-tight text-slate-800 dark:text-white block">NexusTalk AI</span>
                  <span className="text-[8px] text-slate-400 tracking-wider font-extrabold uppercase">Heuristic Matrix</span>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* SIDEBAR METRICS DRAWER */}
            <div className="p-3 bg-slate-50/40 dark:bg-slate-950/20 border-b border-slate-200/60 dark:border-slate-800/30">
              <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2 text-left">Metrics Drawer</span>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200/40 dark:border-slate-850/50 shadow-xs">
                  <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">{totalMessagesSent}</p>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Queries Sent</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200/40 dark:border-slate-850/50 shadow-xs">
                  <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">{sessions.length}</p>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Saved Chats</p>
                </div>
              </div>
            </div>

            {/* QUICK SEARCH FOR SAVED DISCUSSIONS */}
            <div className="p-3 border-b border-slate-200/65 dark:border-slate-800/40">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search saved discussions..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-150/40 dark:bg-slate-950 text-xs py-2 pl-8 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-200 transition-colors"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs text-slate-400">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* EXCHANGES DIRECTORY (CHATS LOG SCREEN) */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
              <div className="flex items-center justify-between px-1 mb-1.5">
                <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">Exchanges Directory</span>
                <button 
                  onClick={() => handleStartSession()} 
                  className="text-[9.5px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  + Fresh Session
                </button>
              </div>

              {filteredSessions.length === 0 ? (
                <div className="text-center py-10 text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center space-y-2">
                  <MessageSquare className="w-6 h-6 opacity-30 text-indigo-500 animate-pulse" />
                  <p className="text-xs font-semibold">No discussions matched.</p>
                </div>
              ) : (
                filteredSessions.map(sess => {
                  const isActive = sess.id === activeSessionId;
                  const queryCount = sess.messages.filter(m => m.sender === "user").length;
                  
                  return (
                    <div 
                      key={sess.id}
                      onClick={() => {
                        setActiveSessionId(sess.id);
                        setSidebarOpen(false);
                      }}
                      className={`group flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-all border text-left ${
                        isActive 
                          ? "bg-indigo-50/70 border-indigo-100/60 dark:bg-indigo-950/20 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-450 font-medium" 
                          : "bg-transparent border-transparent hover:bg-slate-100/50 dark:hover:bg-slate-900/30 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <MessageCircle className={`w-4 h-4 shrink-0 pointer-events-none ${isActive ? "text-indigo-500" : "text-slate-400"}`} />
                        <div className="truncate text-left leading-tight">
                          <p className={`truncate font-semibold ${isActive ? "text-indigo-600 dark:text-indigo-300" : "text-slate-700 dark:text-slate-200"}`}>{sess.title}</p>
                          <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">{queryCount} queries • {sess.date}</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteId(sess.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 hover:text-red-650 dark:hover:bg-red-950/40 text-slate-400 transition-opacity cursor-pointer shrink-0 ml-1.5"
                        title="Delete Session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* SIDEBAR FOOTER (factory reset profile button) */}
            <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
              <button 
                onClick={() => setConfirmClearAllOpen(true)}
                className="w-full flex items-center justify-center space-x-1.5 text-[11px] font-bold py-2 px-3 border border-red-200/50 dark:border-red-950/20 text-red-500 hover:bg-red-50/60 dark:hover:bg-red-950/10 rounded-xl transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Chat History</span>
              </button>
            </div>

          </aside>

          {/* SIDEDRAW OVERLAYS (FOR RESPONSIVE CELL DEVICES) */}
          {sidebarOpen && (
            <div 
              onClick={() => setSidebarOpen(false)} 
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-20 md:hidden"
            />
          )}

          {/* CHAT CONTAINER FEED FRAME */}
          <main className="flex-1 flex flex-col h-full bg-transparent relative overflow-hidden">
            
            {/* WORKSPACE HEADER */}
            <header className="h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-950/30 backdrop-blur-md px-4 flex items-center justify-between relative z-10 shrink-0">
              
              <div className="flex items-center space-x-3.5">
                <button 
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 md:hidden transition-colors cursor-pointer"
                  title="Toggle menu drawing logs"
                >
                  <Maximize2 className="w-4 h-4 rotate-45" />
                </button>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setCurrentView("landing")}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    title="Return to home screen hub"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600/30 flex items-center justify-center text-indigo-600 border border-indigo-550/20">
                      <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-slate-950 rounded-full animate-pulse" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-xs sm:text-sm tracking-tight text-slate-800 dark:text-slate-100">Heuristic Workspace</h3>
                      <span className="hidden sm:inline-block text-[8px] bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-mono uppercase font-bold tracking-widest select-none">
                        DETERMINISTIC
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate max-w-[120px] sm:max-w-none">
                      Active: {currentSession ? currentSession.title : "Unselected"}
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
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                  title="Change Preferred Identity Name"
                >
                  <UserCog className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                  title="Toggle Visual theme color spaces"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-violet-600" />}
                </button>
                <button
                  onClick={() => setCurrentView("landing")}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-150 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all font-bold text-xs flex items-center space-x-1 cursor-pointer"
                  title="Exit chat workspace"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Exit</span>
                </button>
              </div>

            </header>

            {/* CONVERSATION SCROLL VIEW */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 flex flex-col justify-between">
              
              {!currentSession ? (
                // Friendly Empty State Screen (when no conversations are selected/exist)
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-md mx-auto my-auto p-8 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md shadow-xl text-center space-y-6"
                >
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-500 dark:text-indigo-400 mx-auto border border-indigo-500/10 shadow-inner">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white font-display">Inactive Chat Connection</h3>
                    <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
                      Select an existing discussion from the history drawer or launch a fresh rule thread right now.
                    </p>
                  </div>
                  <button 
                    onClick={() => handleStartSession()}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    Launch Heuristic Stream
                  </button>
                </motion.div>
              ) : (
                // Chat dialogue thread view
                <div className="flex-1 max-w-3xl mx-auto w-full flex flex-col space-y-5">
                  <AnimatePresence initial={false}>
                    
                    {currentSession.messages.map((msg) => (
                      <motion.div 
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`flex items-start space-x-3 w-full max-w-[85%] ${
                          msg.sender === "user" ? "self-end flex-row-reverse space-x-reverse" : "self-start"
                        }`}
                      >
                        {/* Avatar */}
                        {msg.sender === "user" ? (
                          <div className="w-8 h-8 rounded-lg bg-indigo-650 text-white font-bold text-[10px] flex items-center justify-center border border-indigo-200/10 shrink-0 select-none uppercase shadow-md bg-gradient-to-tr from-indigo-600 to-indigo-750">
                            {(username || "User").substring(0, 2)}
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-slate-200/80 dark:bg-slate-850/80 border border-slate-300/40 dark:border-slate-800/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 select-none shadow-sm">
                            <Bot className="w-4 h-4" />
                          </div>
                        )}

                        {/* Content text block with Copy button */}
                        <div className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                          <div className={`px-4 py-2.5 rounded-2xl relative group focus:outline-none transition-all ${
                            msg.sender === "user" 
                              ? "bg-gradient-to-br from-indigo-600 to-violet-650 text-white rounded-tr-none shadow-md shadow-indigo-500/10 text-xs sm:text-sm" 
                              : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850/60 text-slate-700 dark:text-slate-100 rounded-tl-none text-xs sm:text-sm leading-relaxed shadow-xs"
                          }`}>
                            
                            <p className="break-words max-w-sm sm:max-w-md whitespace-pre-line text-left leading-normal">
                              {msg.text}
                            </p>
                            
                            {/* Intent Category Badge */}
                            {msg.intent && msg.intent !== "default" && (
                              <div className="mt-2 text-left">
                                <span className="inline-flex items-center space-x-1 text-[8px] font-mono font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-100/50 dark:border-indigo-900/30 uppercase tracking-widest font-mono">
                                  <span>{msg.intent}</span>
                                </span>
                              </div>
                            )}

                            {/* Individual bubble quick actions */}
                            <button 
                              onClick={() => handleCopyClipboardMsg(msg.text)}
                              className={`absolute p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer shadow-xs ${
                                msg.sender === "user" ? "right-full mr-2 top-2" : "left-full ml-2 top-2"
                              }`}
                              title="Copy this dialog response"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold mt-1 tracking-wide select-none">
                            {msg.sender === "user" ? (username || "Developer") : "NexusTalk AI"} • {msg.timestamp}
                          </span>
                        </div>
                      </motion.div>
                    ))}

                    {/* Chatbot typing loading indicators */}
                    {isTyping && (
                      <motion.div 
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start space-x-3 self-start max-w-[80%]"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-250/50 dark:bg-slate-800/50 border border-slate-300/20 dark:border-slate-800/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-xs">
                          <Bot className="w-4 h-4 text-indigo-500 animate-spin" style={{ animationDuration: "3s" }} />
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 px-4 py-3 rounded-2xl rounded-tl-none shadow-xs flex items-center space-x-1.5 w-16 h-10">
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 bg-indigo-550 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                  <div ref={listEndRef} />
                </div>
              )}

            </div>

            {/* ACTION CHIPS BAR */}
            <div className="px-4 py-2 border-t border-slate-200/50 dark:border-slate-800/30 bg-slate-50/50 dark:bg-slate-950/20 flex items-center space-x-2 overflow-x-auto whitespace-nowrap no-scrollbar scroll-smooth shrink-0 z-10">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 select-none shrink-0 flex items-center">
                <Compass className="w-3 h-3 mr-1" /> Quick Triggers:
              </span>
              {[
                { label: "AI Concept", text: "Explain artificial intelligence" },
                { label: "Python Tips", text: "Give me a python tip" },
                { label: "Resume Layout", text: "Resume cv tips" },
                { label: "Mock Questions", text: "Interview preparation tips" },
                { label: "Daily Motivation", text: "Give me a motivational quote" },
                { label: "Tech Core Facts", text: "Tell me a tech fact" },
                { label: "Software Project", text: "Portfolio project ideas" },
                { label: "Heuristic Index", text: "Help me with commands" }
              ].map((chip) => (
                <button 
                  key={chip.label}
                  onClick={() => handleQuickAction(chip.text)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 rounded-full px-3 py-1.5 text-xs text-slate-650 dark:text-slate-300 transition-all font-medium shrink-0 shadow-xs cursor-pointer select-none"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* INPUT FIXED COMPASS */}
            <footer className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/60 backdrop-blur-md relative z-10 shrink-0">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputVal);
                }}
                className="max-w-3xl mx-auto flex items-center space-x-3"
              >
                <button 
                  type="button" 
                  onClick={() => setConfirmClearChatOpen(true)}
                  disabled={!activeSessionId}
                  className="p-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 border border-slate-200/30 dark:border-slate-800/30 disabled:opacity-40 transition-colors shrink-0 cursor-pointer"
                  title="Clear Exchange logs"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <input 
                  type="text" 
                  disabled={!activeSessionId}
                  placeholder={activeSessionId ? "Write a command query (e.g., python tips)..." : "Launch a secure discussion first..."}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-900/60 text-xs sm:text-sm px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-450 outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 transition-all shadow-inner font-sans"
                />

                <button 
                  type="button" 
                  onClick={handleExportTextLog}
                  disabled={!activeSessionId}
                  className="p-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 border border-slate-200/30 dark:border-slate-800/30 disabled:opacity-40 transition-colors shrink-0 cursor-pointer"
                  title="Export dialogue to dossier (.txt)"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button 
                  type="submit" 
                  disabled={!activeSessionId || !inputVal.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all flex items-center justify-center shrink-0 cursor-pointer"
                  title="Send query"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </footer>

          </main>

        </div>
      )}

      {/* COPIED TOAST BANNER */}
      {copyToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-indigo-650 text-white text-xs py-2 px-4 rounded-xl shadow-xl z-50 pointer-events-none flex items-center space-x-2 border border-white/10">
          <Sparkle className="w-3.5 h-3.5 text-indigo-400 dark:text-amber-400 animate-spin" />
          <span className="font-semibold tracking-wide">{copyToast}</span>
        </div>
      )}

      {/* MODAL 1: ATOMIC PROFILE CREDENTIALS DIALOG */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-[#020205]/92 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d0e1b] border-2 border-cyan-500/40 max-w-sm w-full rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.35)] p-6 relative">
            <button 
              onClick={() => setSettingsOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-slate-900 text-cyan-400/70 hover:text-cyan-400 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <UserCog className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white font-display tracking-wide">Sandbox Account Profile</h3>
            </div>
            <div className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-cyan-450 tracking-wider font-mono">Update Name</label>
                <input 
                  type="text" 
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Guest Developer..."
                  className="w-full bg-[#07070f] border border-cyan-500/30 px-3 py-2.5 rounded-xl text-xs outline-none text-white focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] font-mono"
                />
              </div>
              <button 
                onClick={() => handleSaveUsername(tempName)}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-650 hover:from-cyan-400 hover:to-indigo-550 text-white font-bold rounded-xl transition-all text-xs tracking-wider font-mono cursor-pointer shadow-md"
              >
                Save Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CUSTOM ERASE LOGS DIALOG */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-[#020205]/92 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d0e1b] border-2 border-cyan-500/40 max-w-sm w-full rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.35)] p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-500/30 text-red-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-lg text-white font-display tracking-wide">Delete Conversation Log?</h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed px-1">
                Are you sure you want to permanently erase this conversation from LocalStorage? This action is irreversible.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={() => setConfirmDeleteId(null)}
                className="py-2.5 bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 text-xs font-bold font-mono rounded-xl cursor-pointer transition-all hover:bg-slate-800"
              >
                Nevermind
              </button>
              <button 
                onClick={executeDeleteSession}
                className="py-2.5 bg-red-600 hover:bg-red-500 hover:scale-[1.01] text-white text-xs font-bold font-mono rounded-xl cursor-pointer transition-all shadow-md"
              >
                Delete Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CUSTOM CONFIRM ALL WIPE */}
      {confirmClearAllOpen && (
        <div className="fixed inset-0 bg-[#020205]/92 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d0e1b] border-2 border-cyan-500/40 max-w-sm w-full rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.35)] p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-500/30 text-red-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-lg text-white font-display tracking-wide">Wipe All Historical Records?</h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed px-1">
                This will delete every single saved conversation session and reset your preferences to default.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={() => setConfirmClearAllOpen(false)}
                className="py-2.5 bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 text-xs font-bold font-mono rounded-xl cursor-pointer transition-all hover:bg-slate-800"
              >
                Cancel Action
              </button>
              <button 
                onClick={executeClearAllHistory}
                className="py-2.5 bg-red-650 hover:bg-red-500 hover:scale-[1.01] text-white text-xs font-bold font-mono rounded-xl cursor-pointer transition-all shadow-md"
              >
                Wipe Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: CUSTOM CONFIRM CLEAR SYSTEM STREAM */}
      {confirmClearChatOpen && (
        <div className="fixed inset-0 bg-[#020205]/92 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d0e1b] border-2 border-cyan-500/40 max-w-sm w-full rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.35)] p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto">
              <RefreshCw className="w-6 h-6 animate-spin" style={{ animationDuration: "12s" }} />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-lg text-white font-display tracking-wide">Clear Active Chat?</h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed px-1">
                Do you wish to clear all dialogue blocks inside this discussion log? The introductory greeting will stay.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={() => setConfirmClearChatOpen(false)}
                className="py-2.5 bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 text-xs font-bold font-mono rounded-xl cursor-pointer transition-all hover:bg-slate-800"
              >
                Cancel
              </button>
              <button 
                onClick={executeClearCurrentChat}
                className="py-2.5 bg-amber-500 hover:bg-amber-400 hover:scale-[1.01] text-white text-xs font-bold font-mono rounded-xl cursor-pointer transition-all shadow-md"
              >
                Clear Stream
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
