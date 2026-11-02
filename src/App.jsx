
import { TalkingAvatarView } from "@interviewflowai/talking-avatar/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const NOVA_MORPH_TARGETS = {
  viseme_sil: [],
  viseme_PP: "PP",
  viseme_FF: "FF",
  viseme_TH: "TH",
  viseme_DD: "DD",
  viseme_kk: "kk",
  viseme_CH: "CH",
  viseme_SS: "SS",
  viseme_nn: "nn",
  viseme_RR: "RR",
  viseme_aa: "aa",
  viseme_E: "E",
  viseme_I: "ih",
  viseme_O: "oh",
  viseme_U: "ou",
  eyeBlinkLeft: "eyeBlinkLeft",
  eyeBlinkRight: "eyeBlinkRight",
  browInnerUp: "browInnerUp",
  jawOpen: "jawOpen",
  mouthPucker: "mouthPucker",
  mouthFunnel: "mouthFunnel",
  mouthRollLower: "mouthRollLower",
  mouthClose: "mouthClose",
  mouthPressLeft: "mouthPressLeft",
  mouthPressRight: "mouthPressRight",
};

const profile = {
  name: "Prakash C",
  role: "Junior Full Stack Developer",
  location: "Ambur, India",
  github: "https://github.com/prakash7395",
  linkedin: "https://www.linkedin.com/in/prakash-c-4946852ba/",
  repository: "https://github.com/prakash7395/CODSOFT_TASKSNO",
};

const projects = [
  {
    number: "01",
    title: "Project Management Tool",
    description:
      "A full-stack application for creating projects, assigning tasks, setting deadlines and tracking progress.",
    stack: ["React.js", "Node.js", "Express.js", "MongoDB"],
    category: "FULL STACK APPLICATION",
    className: "project-orange",
  },
  {
    number: "02",
    title: "Job Board",
    description:
      "A responsive job listing interface built to present opportunities through a clean and accessible experience.",
    stack: ["HTML5", "CSS3", "JavaScript"],
    category: "FRONTEND DEVELOPMENT",
    className: "project-blue",
  },
  {
    number: "03",
    title: "Interactive Calculator",
    description:
      "An interactive calculator created with core web technologies, focusing on functionality and user interaction.",
    stack: ["HTML5", "CSS3", "JavaScript"],
    category: "WEB APPLICATION",
    className: "project-lime",
  },
];

const skillGroups = [
  {
    title: "FRONTEND",
    description: "Building responsive user interfaces",
    skills: ["HTML5", "CSS3", "JavaScript ES6+", "React.js", "Responsive Design"],
  },
  {
    title: "BACKEND",
    description: "Building server-side applications",
    skills: ["Node.js", "Express.js", "REST APIs"],
  },
  {
    title: "DATABASE",
    description: "Working with application data",
    skills: ["MongoDB"],
  },
  {
    title: "TOOLS",
    description: "Development workflow",
    skills: ["Git", "GitHub", "VS Code", "Postman"],
  },
];

const guideAnswers = [
  {
    keywords: ["hello", "hi", "hey", "vanakkam"],
    answer:
      "Hello! I'm Nova, Prakash's AI portfolio guide. I can introduce you to his skills, projects, education and professional journey. What would you like to explore?",
  },
  {
    keywords: ["who", "about", "prakash", "introduce"],
    answer:
      "Prakash C is an aspiring Full Stack Developer from Ambur, India. He completed a BCA degree and is developing his skills through practical projects and structured web development learning.",
  },
  {
    keywords: ["project", "work", "portfolio"],
    answer:
      "Prakash's featured projects are a Project Management Tool built with React, Node.js, Express and MongoDB; a Job Board built with HTML, CSS and JavaScript; and an Interactive Calculator built with HTML, CSS and JavaScript.",
  },
  {
    keywords: ["skill", "technology", "tech stack", "know"],
    answer:
      "His current skills include HTML5, CSS3, JavaScript ES6+, React.js, Node.js, Express.js, REST APIs, MongoDB, Git, GitHub, VS Code and Postman.",
  },
  {
    keywords: ["education", "degree", "college", "study"],
    answer:
      "Prakash completed his Bachelor of Computer Applications at Thiruvalluvar University, Vellore, from June 2021 to May 2024.",
  },
  {
    keywords: ["internship", "codsoft"],
    answer:
      "Prakash completed a Web Development Internship at CodSoft from September to October 2026. His featured internship projects include a Calculator, Job Board and Project Management Tool.",
  },
  {
    keywords: ["experience", "bank", "equitas", "idfc"],
    answer:
      "Prakash worked as a Business Development Officer at Equitas Small Finance Bank from November 2024 to August 2025, and as a Deputy Manager at IDFC FIRST Bank from November 2025 to August 2026. These roles helped him develop communication, customer handling and professional skills.",
  },
  {
    keywords: ["github", "source code", "repository"],
    answer:
      "You can explore Prakash's work at github.com/prakash7395. His CodSoft project repository is github.com/prakash7395/CODSOFT_TASKSNO.",
  },
  {
    keywords: ["linkedin", "contact", "connect", "hire"],
    answer:
      "You can connect with Prakash through LinkedIn at linkedin.com/in/prakash-c-4946852ba/ or explore his GitHub profile. He is pursuing Junior Frontend Developer and Junior Full Stack Developer opportunities.",
  },
  {
    keywords: ["frontend", "front end"],
    answer:
      "Prakash's frontend skills include HTML5, CSS3, JavaScript ES6+, React.js and responsive design.",
  },
  {
    keywords: ["backend", "back end", "server"],
    answer:
      "Prakash is developing his backend skills with Node.js, Express.js, REST APIs and MongoDB. His Project Management Tool is a full-stack project using these technologies.",
  },
  {
    keywords: ["nova", "yourself"],
    answer:
      "I'm Nova, the AI guide inside PRISM. I help visitors explore Prakash's portfolio, understand his projects and discover his technical background. Ask me anything about his work!",
  },
];

function getNovaFallback(message) {
  const normalized = message.toLowerCase();

  const match = guideAnswers.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword))
  );

  return (
    match?.answer ||
    "I can help you explore Prakash's projects, technical skills, education, internship and professional experience. What would you like to know?"
  );
}

/* 3D NEURAL NETWORK */

function NeuralNetworkScene() {
  const groupRef = useRef(null);

  const nodes = useMemo(() => {
    const result = [];
    const count = 34;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const angle = goldenAngle * i;

      result.push([
        Math.cos(angle) * radius * 1.65,
        y * 1.65,
        Math.sin(angle) * radius * 1.65,
      ]);
    }

    return result;
  }, []);

  const connections = useMemo(() => {
    const result = [];

    nodes.forEach((node, index) => {
      nodes.forEach((other, otherIndex) => {
        if (otherIndex <= index) return;

        const distance = Math.sqrt(
          node.reduce(
            (sum, value, axis) => sum + (value - other[axis]) ** 2,
            0
          )
        );

        if (distance < 1.15) result.push([node, other]);
      });
    });

    return result;
  }, [nodes]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y += delta * 0.12;
    groupRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
  });

  return (
    <group ref={groupRef}>
      {connections.map((connection, index) => (
        <Line
          key={`connection-${index}`}
          points={connection}
          color="#c77b50"
          transparent
          opacity={0.32}
          lineWidth={1}
        />
      ))}

      {nodes.map((position, index) => (
        <mesh key={`node-${index}`} position={position}>
          <sphereGeometry
            args={[index % 5 === 0 ? 0.075 : 0.045, 12, 12]}
          />
          <meshStandardMaterial
            color={index % 5 === 0 ? "#e7a16f" : "#bd704b"}
            emissive="#9c4e30"
            emissiveIntensity={0.4}
            roughness={0.3}
            metalness={0.25}
          />
        </mesh>
      ))}

      <mesh>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshBasicMaterial
          color="#e6ad83"
          transparent
          opacity={0.12}
        />
      </mesh>
    </group>
  );
}

function NeuralNetworkVisual() {
  return (
    <div className="neural-visual">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={[1, 1.25]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.4} />
        <pointLight position={[3, 3, 4]} intensity={12} color="#d68a60" />
        <pointLight position={[-3, -2, 2]} intensity={7} color="#e7b17f" />
        <NeuralNetworkScene />
      </Canvas>
    </div>
  );
}

/* NOVA HOLOGRAM */

function NovaHologram({
  speaking = false,
  listening = false,
  busy = false,
  compact = false,
}) {
  return (
    <div
      className={`nova-hologram ${compact ? "nova-hologram-compact" : ""} ${
        speaking ? "is-speaking" : ""
      } ${listening ? "is-listening" : ""} ${
        busy ? "is-thinking" : ""
      }`}
      aria-label="Nova AI assistant"
    >
      <div className="holo-aura" />
      <div className="holo-orbit orbit-one" />
      <div className="holo-orbit orbit-two" />
      <div className="holo-orbit orbit-three" />

      <div className="holo-core">
        <div className="holo-inner">
          <div className="holo-symbol">
            <span className="symbol-top" />
            <span className="symbol-left" />
            <span className="symbol-right" />
            <span className="symbol-center" />
          </div>
          <div className="holo-scanline" />
        </div>
      </div>

      <div className="holo-particle particle-one" />
      <div className="holo-particle particle-two" />
      <div className="holo-particle particle-three" />
      <div className="holo-particle particle-four" />

      <div className="holo-wave wave-one" />
      <div className="holo-wave wave-two" />
      <div className="holo-wave wave-three" />
    </div>
  );
}

/* NOVA AI GUIDE */

function NovaGuide({ avatarRef }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceError, setVoiceError] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "nova",
      text: "Hello! I'm Nova, your guide to Prakash's portfolio. Ask me about his projects, skills or experience.",
    },
  ]);

  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);
  const busyRef = useRef(false);
  const speechRequestRef = useRef(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, busy]);

  useEffect(() => {
    return () => {
      speechRequestRef.current += 1;
      window.speechSynthesis?.cancel();
      avatarRef.current?.stopSpeaking?.();
      recognitionRef.current?.abort?.();
    };
  }, [avatarRef]);

  function stopSpeech() {
    speechRequestRef.current += 1;
    window.speechSynthesis?.cancel();

    try {
      avatarRef.current?.stopSpeaking?.();
    } catch (error) {
      console.warn("Could not stop avatar speech:", error);
    }

    setSpeaking(false);
  }

  async function speak(text) {
    if (!voiceEnabled || !text?.trim()) return;

    stopSpeech();
    const requestId = speechRequestRef.current;
    setVoiceError("");

    try {
      const response = await fetch(`${API_URL}/api/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Voice service returned ${response.status}`);
      }

      const audioBlob = await response.blob();

      if (requestId !== speechRequestRef.current) return;
      if (!audioBlob.size) throw new Error("The voice service returned empty audio.");

      const avatar = avatarRef.current;

      if (!avatar?.speak) {
        throw new Error("The 3D Nova avatar is not ready yet.");
      }

      setSpeaking(true);
      await avatar.speak(audioBlob);
    } catch (error) {
      if (requestId === speechRequestRef.current) {
        console.error("Nova voice playback error:", error);
        setVoiceError("Nova's voice is temporarily unavailable. You can still chat by text.");
      }
    } finally {
      if (requestId === speechRequestRef.current) {
        setSpeaking(false);
      }
    }
  }

  async function sendMessage(value = message) {
    const question = value.trim();

    if (!question || busyRef.current) return;

    stopSpeech();
    setVoiceError("");

    setMessages((previous) => [
      ...previous,
      { role: "user", text: question },
    ]);

    setMessage("");
    setBusy(true);
    busyRef.current = true;

    let reply = "";

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`Chat service returned ${response.status}`);

      const data = await response.json();
      reply =
        data.reply ||
        data.response ||
        data.answer ||
        getNovaFallback(question);
    } catch (error) {
      console.warn("Nova API fallback:", error.message);
      reply = getNovaFallback(question);
    } finally {
      window.clearTimeout(timeoutId);
    }

    setMessages((previous) => [
      ...previous,
      { role: "nova", text: reply },
    ]);

    setBusy(false);
    busyRef.current = false;

    if (voiceEnabled) speak(reply);
  }

  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMessages((previous) => [
        ...previous,
        {
          role: "nova",
          text: "Voice input is not supported in this browser. Please use Chrome or type your question.",
        },
      ]);
      return;
    }

    stopSpeech();

    try {
      recognitionRef.current?.abort?.();

      const recognition = new SpeechRecognition();
      recognition.lang = "en-IN";
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognitionRef.current = recognition;

      recognition.onstart = () => setListening(true);
      recognition.onend = () => setListening(false);

      recognition.onerror = (event) => {
        setListening(false);

        if (event.error !== "aborted" && event.error !== "no-speech") {
          setVoiceError("Microphone unavailable. Check browser permission and try again.");
        }
      };

      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript?.trim();

        if (transcript) {
          setMessage(transcript);
          sendMessage(transcript);
        }
      };

      recognition.start();
    } catch (error) {
      setListening(false);
      setVoiceError("Could not start the microphone. Please try again.");
      console.error("Nova microphone error:", error);
    }
  }

  function toggleVoice() {
    if (voiceEnabled) {
      setVoiceEnabled(false);
      stopSpeech();
      setVoiceError("");
    } else {
      setVoiceEnabled(true);
      setVoiceError("");
    }
  }

  function closePanel() {
    setOpen(false);
    stopSpeech();

    try {
      recognitionRef.current?.abort?.();
    } catch {
      // Ignore an already stopped recognition session.
    }

    setListening(false);
  }

  return (
    <>
      <button
        className={`nova-launcher ${open ? "launcher-open" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-label="Open Nova AI assistant"
        aria-expanded={open}
      >
        <span className="launcher-hologram">
          <NovaHologram compact speaking={speaking} />
        </span>

        <span className="launcher-label">
          <strong>Ask Nova</strong>
          <small>AI portfolio guide</small>
        </span>

        <span className="launcher-status" />
      </button>

      {open && (
        <section className="nova-panel" aria-label="Nova chat panel">
          <header className="nova-panel-header">
            <div className="nova-panel-identity">
              <div className="nova-mini-avatar">
                <NovaHologram
                  compact
                  speaking={speaking}
                  listening={listening}
                  busy={busy}
                />
              </div>

              <div>
                <h3>Nova</h3>
                <p>
                  <span className="online-dot" />
                  {listening
                    ? "Listening..."
                    : speaking
                    ? "Speaking..."
                    : busy
                    ? "Thinking..."
                    : "PRISM AI assistant"}
                </p>
              </div>
            </div>

            <div className="nova-header-actions">
              <button
                className={`voice-toggle ${voiceEnabled ? "voice-active" : ""}`}
                onClick={toggleVoice}
                title="Toggle voice responses"
                aria-pressed={voiceEnabled}
              >
                {voiceEnabled ? "Voice ON" : "Voice OFF"}
              </button>

              <button
                className="nova-close"
                onClick={closePanel}
                aria-label="Close Nova"
              >
                ×
              </button>
            </div>
          </header>

          <div className="nova-welcome">
            <NovaHologram
              speaking={speaking}
              listening={listening}
              busy={busy}
            />
            <div>
              <strong>Meet Nova</strong>
              <p>Your intelligent guide to Prakash's work.</p>
            </div>
          </div>

          <div className="nova-messages" aria-live="polite">
            {messages.map((item, index) => (
              <div
                className={`nova-message ${
                  item.role === "user" ? "user-message" : "assistant-message"
                }`}
                key={`${index}-${item.role}`}
              >
                {item.role === "nova" && (
                  <span className="message-avatar">N</span>
                )}
                <p>{item.text}</p>
              </div>
            ))}

            {busy && (
              <div className="nova-message assistant-message">
                <span className="message-avatar">N</span>
                <p className="typing-indicator">
                  <i />
                  <i />
                  <i />
                </p>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {voiceError && (
            <p className="nova-voice-error" role="status">
              {voiceError}
            </p>
          )}

          <div className="nova-suggestions">
            {[
              "Tell me about Prakash",
              "Show his projects",
              "Technical skills",
              "Work experience",
              "Education",
              "Contact details",
            ].map((item) => (
              <button
                key={item}
                onClick={() => sendMessage(item)}
                disabled={busy}
              >
                {item}
              </button>
            ))}
          </div>

          <form
            className="nova-input-area"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <button
              type="button"
              className={`nova-mic ${listening ? "mic-active" : ""}`}
              onClick={startListening}
              title="Speak to Nova"
              aria-label="Speak to Nova"
              disabled={busy}
            >
              {listening ? "●" : "🎙"}
            </button>

            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask Nova anything..."
              aria-label="Message Nova"
            />

            <button
              type="submit"
              className="nova-send"
              disabled={busy || !message.trim()}
              aria-label="Send message"
            >
              ↗
            </button>
          </form>

          <footer className="nova-panel-footer">
            Powered by PRISM · AI portfolio assistant
          </footer>
        </section>
      )}
    </>
  );
}

/* SECTION HEADING */

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="section-heading">
      <span className="section-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

/* MAIN APP */

function App() {
  const novaAvatarRef = useRef(null);

  const [introVisible, setIntroVisible] = useState(() => {
    try {
      return !sessionStorage.getItem("prism-intro-seen");
    } catch {
      return true;
    }
  });

  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    if (!introVisible) return undefined;

    // CSS intro exit starts at 3.8s and finishes at 4.6s.
    const timer = window.setTimeout(() => {
      setIntroVisible(false);

      try {
        sessionStorage.setItem("prism-intro-seen", "true");
      } catch {
        // The intro can still close if browser storage is unavailable.
      }
    }, 4600);

    return () => window.clearTimeout(timer);
  }, [introVisible]);

  useEffect(() => {
    const sections = document.querySelectorAll("main section[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.35 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  function closeMenu() {
    setMobileMenu(false);
  }

  function dismissIntro() {
    setIntroVisible(false);

    try {
      sessionStorage.setItem("prism-intro-seen", "true");
    } catch {
      // No action needed.
    }
  }

  return (
    <div className="site-shell">
      {introVisible && (
        <div className="cinematic-intro">
          <div className="intro-noise" />
          <div className="intro-grid" />
          <div className="intro-spotlight" />
          <div className="intro-orbit intro-orbit-one" />
          <div className="intro-orbit intro-orbit-two" />

          <div className="intro-content">
            <div className="intro-topline">
              <span>INDEPENDENT DEVELOPER PORTFOLIO</span>
              <span>EST. 2026</span>
            </div>

            <div className="intro-monogram">
              <span>P</span>
              <i />
            </div>

            <p className="intro-overline">
              WELCOME TO THE DIGITAL WORLD OF
            </p>

            <h1 className="intro-title">
              PRISM<span>.</span>
            </h1>

            <div className="intro-divider">
              <span />
            </div>

            <p className="intro-name">PRAKASH C.</p>

            <p className="intro-description">
              DESIGNING IDEAS. BUILDING EXPERIENCES. DEVELOPING THE FUTURE.
            </p>

            <button className="intro-enter" onClick={dismissIntro}>
              <span>EXPLORE PORTFOLIO</span>
              <span className="intro-enter-arrow">↗</span>
            </button>
          </div>

          <div className="intro-bottomline">
            <span>PERSONAL · RESPONSIVE · INTELLIGENT</span>
            <span>SCROLL TO DISCOVER ↓</span>
          </div>

          <button className="intro-skip" onClick={dismissIntro}>
            SKIP INTRO ↗
          </button>
        </div>
      )}

      <header className="site-header">
        <a className="brand-mark" href="#home" onClick={closeMenu}>
          P<span>RISM.</span>
        </a>

        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenu((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={mobileMenu}
        >
          {mobileMenu ? "×" : "☰"}
        </button>

        <nav className={`main-nav ${mobileMenu ? "nav-open" : ""}`}>
          {[
            ["home", "Home"],
            ["work", "Projects"],
            ["about", "About"],
            ["skills", "Skills"],
            ["contact", "Contact"],
          ].map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className={activeSection === id ? "nav-active" : ""}
              onClick={closeMenu}
            >
              {label}
            </a>
          ))}
        </nav>

        <a className="header-cta" href="#contact">
          Let's connect <span>↗</span>
        </a>
      </header>

      <main>
        {/* HERO */}

        <section className="hero-section" id="home">
          <div className="hero-decoration hero-decoration-one" />
          <div className="hero-decoration hero-decoration-two" />

          <div className="hero-content">
            <div className="availability-label">
              <span className="availability-dot" />
              OPEN TO OPPORTUNITIES
            </div>

            <p className="hero-intro">HELLO, I'M PRAKASH C.</p>

            <h1>
              Building
              <br />
              <span className="hero-highlight">what's next.</span>
            </h1>

            <p className="hero-role">JUNIOR FULL STACK DEVELOPER</p>

            <p className="hero-description">
              I build responsive web applications and meaningful digital
              experiences using modern frontend and backend technologies.
              Turning ideas into functional products, one project at a time.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#work">
                Explore my work <span>↗</span>
              </a>
              <a className="secondary-button" href="#contact">
                Let's connect <span>↗</span>
              </a>
            </div>

            <div className="hero-meta">
              <span>BASED IN {profile.location.toUpperCase()}</span>
              <span>FRONTEND · BACKEND · WEB</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="developer-workspace">
              <div className="workspace-topbar">
                <div className="workspace-brand">
                  <span className="workspace-brand-icon">✳</span>
                  <span>PRISM.DEV</span>
                </div>
                <div className="workspace-window-controls">
                  <i />
                  <i />
                  <i />
                </div>
              </div>

              <div className="workspace-body">
                <aside className="workspace-sidebar">
                  <span className="sidebar-label">EXPLORER</span>
                  <div className="sidebar-file active">
                    <span>JS</span> App.jsx
                  </div>
                  <div className="sidebar-file">
                    <span>CS</span> style.css
                  </div>
                  <div className="sidebar-file">
                    <span>JS</span> server.js
                  </div>
                  <div className="sidebar-file">
                    <span>DB</span> database
                  </div>
                  <div className="sidebar-divider" />
                  <span className="sidebar-label">PROJECTS</span>
                  <div className="sidebar-project">
                    <span className="project-status-dot" />
                    Portfolio
                  </div>
                  <div className="sidebar-project">
                    <span className="project-status-dot" />
                    Job Board
                  </div>
                  <div className="sidebar-project">
                    <span className="project-status-dot" />
                    Task Manager
                  </div>
                </aside>

                <div className="workspace-editor">
                  <div className="editor-tab">
                    <span>JS</span> App.jsx
                    <i />
                  </div>

                  <div className="editor-code">
                    <div><span className="code-line">01</span> <span className="code-purple">const</span> <span className="code-blue">developer</span> = {"{"}</div>
                    <div><span className="code-line">02</span> &nbsp;name: <span className="code-orange">"Prakash C"</span>,</div>
                    <div><span className="code-line">03</span> &nbsp;role: <span className="code-orange">"Full Stack Developer"</span>,</div>
                    <div><span className="code-line">04</span> &nbsp;skills: [</div>
                    <div><span className="code-line">05</span> &nbsp;&nbsp;<span className="code-green">"React.js"</span>,</div>
                    <div><span className="code-line">06</span> &nbsp;&nbsp;<span className="code-green">"Node.js"</span>,</div>
                    <div><span className="code-line">07</span> &nbsp;&nbsp;<span className="code-green">"MongoDB"</span></div>
                    <div><span className="code-line">08</span> &nbsp;]</div>
                    <div><span className="code-line">09</span> {"}"};</div>
                    <div className="code-empty"><span className="code-line">10</span></div>
                    <div><span className="code-line">11</span> <span className="code-purple">function</span> <span className="code-blue">buildFuture</span>() {"{"}</div>
                    <div><span className="code-line">12</span> &nbsp;<span className="code-purple">return</span> <span className="code-orange">"Keep creating."</span>;</div>
                    <div><span className="code-line">13</span> {"}"}</div>
                    <div className="code-cursor-line">
                      <span className="code-line">14</span>
                      <span className="code-cursor" />
                    </div>
                  </div>

                  <div className="editor-statusbar">
                    <span>● JavaScript React</span>
                    <span>UTF-8</span>
                    <span>Ln 14, Col 1</span>
                  </div>
                </div>
              </div>

              <div className="workspace-terminal">
                <div className="terminal-heading">
                  <span>TERMINAL</span>
                  <span>OUTPUT</span>
                  <span>PROBLEMS</span>
                </div>
                <div className="terminal-content">
                  <span className="terminal-prompt">prakash@prism:~$</span>
                  <span> npm run build</span>
                  <p className="terminal-success">✓ Build completed successfully</p>
                  <p className="terminal-ready">Ready to create something new_</p>
                </div>
              </div>

              <div className="workspace-footer">
                <span>✳ PRISM DEVELOPMENT ENVIRONMENT</span>
                <span>ALL SYSTEMS READY</span>
              </div>
            </div>

            <div className="floating-note note-one">
              <span>✳</span> FULL STACK JOURNEY
            </div>
            <div className="floating-note note-two">
              <span>↗</span> ALWAYS LEARNING
            </div>
          </div>
        </section>

        {/* MARQUEE */}

        <div className="marquee-strip">
          <div>
            JAVASCRIPT <span>✳</span> REACT.JS <span>✳</span> NODE.JS
            <span>✳</span> EXPRESS.JS <span>✳</span> MONGODB <span>✳</span>
            JAVASCRIPT <span>✳</span> REACT.JS <span>✳</span> NODE.JS
            <span>✳</span> EXPRESS.JS <span>✳</span> MONGODB <span>✳</span>
          </div>
        </div>

        {/* PROJECTS */}

        <section className="projects-section section-wrap" id="work">
          <SectionHeading
            eyebrow="SELECTED WORK / 01"
            title={<>Ideas into <span>applications.</span></>}
            description="A selection of projects built while learning and applying modern web development."
          />

          <div className="project-grid">
            {projects.map((project) => (
              <article
                className={`project-card ${project.className}`}
                key={project.number}
              >
                <div className="project-preview">
                  <div className="preview-toolbar">
                    <span />
                    <span />
                    <span />
                    <small>PRISM / PROJECT_{project.number}</small>
                  </div>

                  <div className="preview-content">
                    <span className="preview-number">{project.number}</span>
                    <div className="preview-art">
                      {project.number === "01" && (
                        <div className="dashboard-art">
                          <div className="dashboard-side" />
                          <div className="dashboard-main">
                            <i />
                            <i />
                            <i />
                            <div className="dashboard-bars">
                              <b />
                              <b />
                              <b />
                              <b />
                            </div>
                          </div>
                        </div>
                      )}

                      {project.number === "02" && (
                        <div className="job-art">
                          <div className="job-search" />
                          <div className="job-row" />
                          <div className="job-row" />
                          <div className="job-row" />
                        </div>
                      )}

                      {project.number === "03" && (
                        <div className="calculator-art">
                          <div className="calculator-screen">123 +</div>
                          <div className="calculator-keys">
                            {Array.from({ length: 12 }, (_, index) => (
                              <i key={index} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="preview-category">{project.category}</span>
                  </div>
                </div>

                <div className="project-details">
                  <div className="project-heading-row">
                    <span>PROJECT {project.number}</span>
                    <a
                      href={profile.repository}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View ${project.title} source code`}
                    >
                      ↗
                    </a>
                  </div>

                  <h3>{project.title}</h3>
                  <p>{project.description}</p>

                  <div className="project-tags">
                    {project.stack.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>

                  <a
                    className="project-link"
                    href={profile.repository}
                    target="_blank"
                    rel="noreferrer"
                  >
                    VIEW SOURCE CODE <span>↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>

          <a
            className="all-projects-link"
            href={profile.github}
            target="_blank"
            rel="noreferrer"
          >
            Explore more on GitHub ↗
          </a>
        </section>

        {/* ABOUT */}

        <section className="about-section section-wrap" id="about">
          <div className="about-layout">
            <div className="about-side">
              <span className="section-eyebrow">
                THE PERSON BEHIND THE CODE / 02
              </span>

              <div className="about-big-number">
                02<span>/04</span>
              </div>

              <div className="neural-card">
                <div className="neural-card-top">
                  <span>✳ THINK. CONNECT. CREATE.</span>
                  <span>02 / 04</span>
                </div>
                <NeuralNetworkVisual />
                <div className="neural-card-bottom">
                  <strong>CURIOUS BY NATURE</strong>
                  <span>IDEAS CONNECT HERE ↗</span>
                </div>
              </div>
            </div>

            <div className="about-main">
              <h2>
                More than
                <br />
                <span>just code.</span>
              </h2>

              <p className="about-lead">
                I'm Prakash — a developer in progress, driven by curiosity
                and the excitement of turning ideas into useful digital experiences.
              </p>

              <p>
                I completed my Bachelor of Computer Applications and am
                developing my skills in frontend and backend technologies
                through structured learning and hands-on projects.
              </p>

              <div className="journey-list">
                <div className="journey-item">
                  <span className="journey-year">2021 — 2024</span>
                  <div>
                    <h3>Bachelor of Computer Applications</h3>
                    <p>Thiruvalluvar University, Vellore</p>
                  </div>
                </div>

                <div className="journey-item">
                  <span className="journey-year">2024 — 2025</span>
                  <div>
                    <h3>Business Development Officer</h3>
                    <p>Equitas Small Finance Bank</p>
                  </div>
                </div>

                <div className="journey-item">
                  <span className="journey-year">2025 — 2026</span>
                  <div>
                    <h3>Deputy Manager</h3>
                    <p>IDFC FIRST Bank</p>
                  </div>
                </div>

                <div className="journey-item">
                  <span className="journey-year">SEP — OCT 2026</span>
                  <div>
                    <h3>Web Development Intern</h3>
                    <p>CodSoft · Completed internship</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS */}

        <section className="skills-section section-wrap" id="skills">
          <SectionHeading
            eyebrow="MY TOOLKIT / 03"
            title={<>Technologies I <span>work with.</span></>}
            description="The tools and technologies I'm currently learning and using to build web applications."
          />

          <div className="skill-grid">
            {skillGroups.map((group, index) => (
              <article className="skill-card" key={group.title}>
                <div className="skill-card-top">
                  <span>0{index + 1}</span>
                  <span>✳</span>
                </div>
                <h3>{group.title}</h3>
                <p>{group.description}</p>
                <div className="skill-tags">
                  {group.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="learning-strip">
            <span className="learning-icon">↗</span>
            <div>
              <strong>ALWAYS IN BUILD MODE</strong>
              <p>
                Continuously learning full-stack development and improving
                through practical projects.
              </p>
            </div>
          </div>
        </section>

        {/* NOVA */}

        <section className="nova-section section-wrap" id="nova">
          <div className="nova-feature">
            <div className="nova-feature-copy">
              <span className="section-eyebrow">MEET YOUR GUIDE / 04</span>

              <h2>
                Curious?
                <br />
                <span>Ask Nova.</span>
              </h2>

              <p>
                Meet Nova, an AI-powered portfolio companion. Ask about
                Prakash's projects, technologies and professional journey
                through an interactive conversation.
              </p>

              <div className="nova-feature-points">
                <span>01 / Ask questions</span>
                <span>02 / Explore projects</span>
                <span>03 / Hear Nova speak</span>
              </div>

              <button
                className="primary-button"
                onClick={() => {
                  document.querySelector(".nova-launcher")?.click();
                }}
              >
                Start a conversation <span>↗</span>
              </button>
            </div>

            <div className="nova-feature-visual">
              <div className="nova-avatar-label">
                <span className="launcher-status" />
                NOVA IS READY
              </div>

              <div className="nova-real-avatar">
                <TalkingAvatarView
                  ref={novaAvatarRef}
                  avatarUrl="/nova.glb"
                  modelUrl="/viseme-model.bin"
                  morphTargets={NOVA_MORPH_TARGETS}
                  status="listening"
                  onError={(error) => {
                    console.error("Nova avatar loading error:", error);
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "transparent",
                  }}
                />
              </div>

              <span className="nova-feature-caption">
                NOVA / AI COMPANION
              </span>
            </div>
          </div>
        </section>

        {/* CONTACT */}

        <section className="contact-section section-wrap" id="contact">
          <div className="contact-topline">
            <span className="section-eyebrow">
              HAVE A PROJECT IN MIND? / 05
            </span>
            <span>LET'S MAKE IT HAPPEN ↗</span>
          </div>

          <h2>
            Let's build
            <br />
            <span>something meaningful.</span>
          </h2>

          <p>
            I'm exploring Junior Frontend Developer and Junior Full Stack
            Developer opportunities. Let's connect.
          </p>

          <div className="contact-actions">
            <a
              className="primary-button"
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              Connect on LinkedIn <span>↗</span>
            </a>

            <a
              className="secondary-button"
              href={profile.github}
              target="_blank"
              rel="noreferrer"
            >
              Explore GitHub <span>↗</span>
            </a>
          </div>

          <div className="contact-socials">
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LINKEDIN ↗
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              GITHUB ↗
            </a>
            <span>AMBUR, INDIA</span>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand-mark" href="#home">
          P<span>RISM.</span>
        </a>
        <p>Designed & developed by Prakash C.</p>
        <span>© 2026 · ALL RIGHTS RESERVED</span>
      </footer>

      <NovaGuide avatarRef={novaAvatarRef} />
    </div>
  );
}

export default App;
