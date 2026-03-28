import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Shield, Code, Server, Lock, Cpu, 
  Database, Send, X, ChevronRight, CheckCircle2, 
  Activity, ShieldCheck, UserCircle, Briefcase,
  Layers, MessageSquare, ExternalLink, Mail, FileText
} from 'lucide-react';

// --- CONFIGURATION ---
// Replace this with a direct web link to your photo (e.g., "https://imgur.com/yourphoto.jpg") 
// OR ensure a file named "profile.jpg" is in your project's "public" folder.
const PROFILE_PIC_URL = "/JudePhoto.jpeg"; 

// --- CUSTOM BRAND ICONS ---
const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.5-1.4 6.5-7a4.6 4.6 0 0 0-1.39-3.2 4.2 4.2 0 0 0-.1-3.2s-1.14-.36-3.7 1.4a13.3 13.3 0 0 0-7 0C6.2 1.4 5.06 1.8 5.06 1.8a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 3.5 8.2c0 5.6 3.36 6.6 6.5 7a4.8 4.8 0 0 0-1 3.02V22"></path>
    <path d="M9 20c-5 1.5-5-2.5-7-3"></path>
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

// --- COMPONENTS ---

const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*'.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.05)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#059669'; 
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-20" />;
};

const TypewriterText = ({ text, delay = 30 }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <span>{currentText}</span>;
};

const HackerText = ({ text, className = "" }) => {
  const [displayText, setDisplayText] = useState(text);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

  const triggerEffect = () => {
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplayText(text.split("").map((letter, index) => {
        if (index < iterations) return text[index];
        if (text[index] === " ") return " ";
        return letters[Math.floor(Math.random() * letters.length)];
      }).join(""));

      if(iterations >= text.length){
        clearInterval(interval);
      }
      iterations += 1 / 3; 
    }, 30);
  };

  useEffect(() => {
    triggerEffect();
  }, [text]);

  return <span className={`inline-block ${className}`} onMouseEnter={triggerEffect}>{displayText}</span>;
};

const SectionHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center space-x-3 mb-8 border-b border-emerald-900/50 pb-4">
    <Icon className="text-emerald-500 w-6 h-6" />
    <h2 className="text-2xl font-bold text-slate-100 tracking-wider uppercase font-mono cursor-default">
      <HackerText text={title} />
    </h2>
  </div>
);

// --- MAIN APP COMPONENT ---

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState([
    { role: 'model', text: " Hi There! I'm Judy's Profile Bot. How can I assist you with evaluating his profile?" }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contactStatus, setContactStatus] = useState('idle'); 
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  
  // State to track if we already sent the handshake notification
  const [hasNotifiedHandshake, setHasNotifiedHandshake] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatOpen]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // --- FULL-STACK SECURE CHAT REQUEST ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMsg = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // Safely route the request to your local/Vercel serverless backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server error');
      }

      setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
    } catch (error) {
      console.error("Chat Client Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: `Connection disrupted: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- WEB3FORMS INTEGRATION ---
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus('submitting');
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          // Replace this string with your actual access key from Web3Forms
          access_key: "d4d3c558-d63c-4cf8-b294-3213ea5b7a39", 
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: "New Message from Portfolio Website",
          from_name: "Portfolio Terminal Secure Form"
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setContactStatus('success');
        setFormData({ name: '', email: '', message: '' });
        // Reset the success animation after 5 seconds
        setTimeout(() => setContactStatus('idle'), 5000);
      } else {
        throw new Error(result.message || "Failed to send transmission");
      }
    } catch (error) {
      console.error("Transmission Error:", error);
      alert("Transmission failed. Please use my direct email address: Judysepe9@gmail.com");
      setContactStatus('idle');
    }
  };

  const scrollToContact = () => {
    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- HANDSHAKE BUTTON NOTIFICATION ---
  const handleHandshakeClick = async () => {
    scrollToContact(); // Keep existing behavior of scrolling down

    // Send a silent background notification email only once
    if (!hasNotifiedHandshake) {
      setHasNotifiedHandshake(true);
      try {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            // Ensure you paste your Web3Forms Access Key here as well!
            access_key: "YOUR_WEB3FORMS_ACCESS_KEY_HERE", 
            subject: "🔔 System Alert: Handshake Initiated",
            from_name: "Portfolio Tracker",
            message: "A visitor just clicked the 'Initiate Handshake' button on your portfolio website!"
          }),
        });
      } catch (error) {
        // Fail silently so it doesn't disrupt the user's experience
        console.error("Handshake notification failed silently.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-emerald-500/30 relative">
      <MatrixRain />
      <div className="pointer-events-none fixed inset-0 z-10 h-full w-full bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20" />
      <div 
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.04), transparent 80%)`
        }}
      />
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-900/20 blur-[120px] rounded-full pointer-events-none z-0" />

      <main className="max-w-5xl mx-auto px-6 py-16 relative z-20">
        {/* HERO SECTION */}
        <header className="mb-24 mt-12 backdrop-blur-[2px] rounded-2xl p-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-950/50 border border-emerald-800/50 rounded-full px-4 py-1.5 mb-6 text-sm text-emerald-400 font-mono">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>Status: Available for Opportunities</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Secure Systems. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
              Intelligent Solutions.
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl leading-relaxed mb-8">
            <TypewriterText text="I am a Full Stack Web Developer that leverages AI to speed up the prototyping and to improve productivity in terms of developing and deploying enterprise and scalable web applications.. I am currently exploring an entry level Cybersecurity role. I am an active member of International Information System Security Certification Consortium
             and recently passed the certified in cybersecurity exam in which outlines the 5 domains of cybersecurity. I am actively taking Google Cybersecurity Professional Certificate Course to gain hands on and practical real world skills. If you happen to need an enterprise application for your business or an employer that has an entry level Cybersecurity role opportunity, please feel free to reach out, I have built a chatbot on this page(located in the lower right hand corner) and the chatbot will respond all the inquiries related to me and where I can be reach out.
             My LinkedIn profile link is also visible on this page and email, whichever is convenient for you, I will be very happy to connect." />
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <button 
              onClick={handleHandshakeClick}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-mono text-sm transition-colors flex items-center space-x-2 border border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
            >
              <Terminal className="w-4 h-4" />
              <span>Initiate Handshake</span>
            </button>
            <a 
              href="/Judy_Sepe_Resume.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-lg font-mono text-sm transition-colors flex items-center space-x-2 border border-slate-600"
            >
              <FileText className="w-4 h-4" />
              <span>Extract CV</span>
            </a>
            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="font-medium text-sm">ISC2 CC Certified</span>            
            </div>
              <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="font-medium text-sm">Google CyberSecurity Certificate</span>
              </div>
          </div>
          <div className="mt-8 flex items-center space-x-6">
            <a href="mailto:Judysepe9@gmail.com" className="text-slate-500 hover:text-emerald-400 transition-colors" title="Email"><Mail className="w-6 h-6" /></a>
            <a href="https://www.linkedin.com/in/judy-sepe-a41a723b5" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400 transition-colors" title="LinkedIn"><LinkedinIcon className="w-6 h-6" /></a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-purple-400 transition-colors" title="GitHub"><GithubIcon className="w-6 h-6" /></a>
          </div>
        </header>

        {/* PROJECTS SECTION */}
        <section className="mb-24 backdrop-blur-[2px] rounded-2xl p-4">
          <SectionHeader title="System Deployments" icon={Code} />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 transition-colors group flex flex-col relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <Database className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded">PROD_ENV</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 cursor-default relative z-10">
                <HackerText text="Katrina Knowledgebase" />
              </h3>
              <p className="text-slate-400 mb-5 text-sm leading-relaxed relative z-10">
                Architected a robust knowledge management system with an embedded AI Assistant for rapid natural-language querying.
              </p>
              
              <div className="mb-6 relative z-10 flex-grow">
                <h4 className="text-emerald-400 text-xs font-bold mb-3 uppercase tracking-wider flex items-center"><Terminal className="w-3 h-3 mr-2"/> Features & Functions</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start space-x-2"><ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span>AI-accelerated natural language information retrieval</span></li>
                  <li className="flex items-start space-x-2"><ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span>Scalable file categorization engine</span></li>
                  <li className="flex items-start space-x-2"><ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span>Geospatial mapping & real-time interactive store locator</span></li>
                  <li className="flex items-start space-x-2"><ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span>Secure access controls & structured data flow</span></li>
                </ul>
              </div>

              <div className="mb-6 relative z-10">
                <h4 className="text-cyan-400 text-xs font-bold mb-3 uppercase tracking-wider flex items-center"><Code className="w-3 h-3 mr-2"/> Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Node.js', 'AI API', 'Firebase', 'JavaScript'].map(tech => (
                    <span key={tech} className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-2 py-1 rounded border border-cyan-900/50">{tech}</span>
                  ))}
                </div>
              </div>
              
              <a href="https://katrina.vignettes.me/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors group/link mt-auto relative z-10 pt-4 border-t border-slate-800">
                <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                <span>View Live Application</span>
              </a>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 transition-colors group flex flex-col relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <Layers className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded">PROD_ENV</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 cursor-default relative z-10">
                <HackerText text="Katrina Bakery ERP" />
              </h3>
              <p className="text-slate-400 mb-5 text-sm leading-relaxed relative z-10">
                Scalable Enterprise Resource Planning application tailored to manage custom order workflows, inventory, and sales tracking. Engineered with a security-first architecture.
              </p>
              
              <div className="mb-6 relative z-10 flex-grow">
                <h4 className="text-emerald-400 text-xs font-bold mb-3 uppercase tracking-wider flex items-center"><Terminal className="w-3 h-3 mr-2"/> Features & Functions</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start space-x-2"><ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span>Tailored custom order workflows & automated inventory</span></li>
                  <li className="flex items-start space-x-2"><ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span>Real-time financial and sales tracking dashboard</span></li>
                  <li className="flex items-start space-x-2"><ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span>Strict Role-Based Access Control (RBAC) implementation</span></li>
                  <li className="flex items-start space-x-2"><ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span>AI-assisted rapid prototyping for feature scaling</span></li>
                </ul>
              </div>

              <div className="mb-6 relative z-10">
                <h4 className="text-cyan-400 text-xs font-bold mb-3 uppercase tracking-wider flex items-center"><Code className="w-3 h-3 mr-2"/> Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {['Full-Stack', 'SQL/Supabase/PostgreSQL', 'Authentication', 'REST API', 'JavaScript'].map(tech => (
                    <span key={tech} className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-2 py-1 rounded border border-cyan-900/50">{tech}</span>
                  ))}
                </div>
              </div>

              <a href="https://katrinaerp.vignettes.me/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors group/link mt-auto relative z-10 pt-4 border-t border-slate-800">
                <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                <span>View Live Application</span>
              </a>
            </div>
          </div>
        </section>

        {/* EXPERIENCE SECTION */}
        <section className="mb-24 backdrop-blur-[2px] rounded-2xl p-4">
          <SectionHeader title="Operational Logs" icon={Briefcase} />
          <div className="relative border-l border-emerald-900/50 ml-3 pl-8 space-y-12">
            <div className="relative">
              <div className="absolute -left-[41px] top-1.5 bg-slate-950 border-2 border-cyan-500 w-4 h-4 rounded-full z-10">
                <span className="absolute inset-0 rounded-full bg-cyan-500 animate-ping opacity-25"></span>
              </div>
              <h3 className="text-xl font-bold text-white">Seeking Full Stack Web Development / Entry Level Cybersecurity role</h3>
              <p className="text-cyan-400 font-mono text-sm mb-4">Present</p>
              <p className="text-slate-400 leading-relaxed">
                Actively seeking opportunities to apply my full-stack web development expertise and ISC2 CC certification to secure, scalable, and innovative enterprise projects. Eager to contribute to a forward-thinking team.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -left-[41px] top-1.5 bg-slate-950 border-2 border-emerald-500 w-4 h-4 rounded-full z-10" />
              <h3 className="text-xl font-bold text-white">SAP Support Engineer</h3>
              <p className="text-emerald-400 font-mono text-sm mb-4">1 Year Duration</p>
              <p className="text-slate-400 mb-4 leading-relaxed">
                Bridged the gap between complex enterprise technology and end-user operations by delivering high-level technical support for SAP systems. Combined advanced client relations experience with rigorous technical troubleshooting.
              </p>
              <div className="bg-slate-900/80 rounded-lg p-4 text-sm border border-slate-800">
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" /><span>Resolved complex database errors and integration failures.</span></li>
                  <li className="flex items-start space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" /><span>Managed user provisioning, RBAC, and access controls.</span></li>
                  <li className="flex items-start space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" /><span>Translated critical backend outages into actionable updates for stakeholders.</span></li>
                </ul>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-[41px] top-1.5 bg-slate-950 border-2 border-slate-700 w-4 h-4 rounded-full z-10" />
              <h3 className="text-xl font-bold text-white">Service Desk Support</h3>
              <p className="text-slate-500 font-mono text-sm mb-4">5+ Years Experience</p>
              <p className="text-slate-400 leading-relaxed">
                Serves as the first point of contact for users, logging, categorizing, and resolving incidents and service requests. Escalates complex issues to appropriate support teams, coordinates with vendors and specialists, and ensures timely resolution in line with SLAs. Provides regular updates to users and maintains accurate documentation throughout the incident management lifecycle.
              </p>
            </div>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section className="mb-24 backdrop-blur-[2px] rounded-2xl p-4">
          <SectionHeader title="Technical Matrix" icon={Cpu} />
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span>Security & IAM</span>
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li>Identity & Access Management</li>
                <li>Role-Based Access Control (RBAC)</li>
                <li>Security Compliance</li>
                <li>Data Integrity</li>
              </ul>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <Server className="w-5 h-5 text-cyan-400" />
                <span>Enterprise & Systems</span>
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li>SAP ERP</li>
                <li>System Administration</li>
                <li>Incident Management</li>
                <li>Root Cause Analysis</li>
              </ul>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <Code className="w-5 h-5 text-purple-400" />
                <span>Development</span>
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li>Full-Stack Architecture</li>
                <li>REST API Integration</li>
                <li>Database Management</li>
                <li>User-Centric UI/UX</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CERTIFICATIONS & TRAINING SECTION */}
        <section className="mb-24 backdrop-blur-[2px] rounded-2xl p-4">
          <SectionHeader title="Certifications & Training" icon={ShieldCheck} />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-emerald-500/50 transition-all hover:-translate-y-1">
              <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <ShieldCheck className="w-32 h-32 text-emerald-500" />
              </div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <h3 className="text-xl font-bold text-white leading-tight">ISC2 Certified in Cybersecurity (CC)</h3>
              </div>
              <div className="inline-flex items-center space-x-2 bg-emerald-950/50 border border-emerald-800/50 text-emerald-400 text-xs px-3 py-1.5 rounded-full mb-6 font-mono relative z-10">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>STATUS: ACTIVE / PASSED</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 relative z-10">
                Demonstrates foundational knowledge across the five key domains of cybersecurity, proving readiness for entry-level security roles and adherence to ISC2's rigorous ethical and technical standards.
              </p>
              <div className="relative z-10">
                <h4 className="text-slate-500 text-xs font-mono mb-3">CORE DOMAINS MASTERED:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-300 font-mono text-xs">
                  <li className="flex items-center"><ChevronRight className="w-3 h-3 text-emerald-500 mr-2 flex-shrink-0" />Security Principles</li>
                  <li className="flex items-center"><ChevronRight className="w-3 h-3 text-emerald-500 mr-2 flex-shrink-0" />Access Controls</li>
                  <li className="flex items-center"><ChevronRight className="w-3 h-3 text-emerald-500 mr-2 flex-shrink-0" />Network Security</li>
                  <li className="flex items-center"><ChevronRight className="w-3 h-3 text-emerald-500 mr-2 flex-shrink-0" />Security Ops</li>
                  <li className="flex items-center sm:col-span-2"><ChevronRight className="w-3 h-3 text-emerald-500 mr-2 flex-shrink-0" />Incident Response, BC & DR</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-cyan-500/50 transition-all hover:-translate-y-1">
              <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Activity className="w-32 h-32 text-cyan-500" />
              </div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <h3 className="text-xl font-bold text-white leading-tight">Google Cybersecurity Professional</h3>
              </div>
              <div className="inline-flex items-center space-x-2 bg-cyan-950/50 border border-cyan-800/50 text-cyan-400 text-xs px-3 py-1.5 rounded-full mb-6 font-mono relative z-10">
                <div className="flex space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce delay-150"></span>
                </div>
                <span>STATUS: IN PROGRESS</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 relative z-10">
                A hands-on, practical program developed by Google focusing on real-world threat mitigation, network security, and defensive tooling. Designed to build practical skills in identifying and addressing vulnerabilities.
              </p>
              <div className="relative z-10">
                <h4 className="text-slate-500 text-xs font-mono mb-3">PRACTICAL SKILLS GAINED:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-300 font-mono text-xs">
                  <li className="flex items-center"><ChevronRight className="w-3 h-3 text-cyan-500 mr-2 flex-shrink-0" />Security Audits</li>
                  <li className="flex items-center"><ChevronRight className="w-3 h-3 text-cyan-500 mr-2 flex-shrink-0" />Linux & SQL</li>
                  <li className="flex items-center"><ChevronRight className="w-3 h-3 text-cyan-500 mr-2 flex-shrink-0" />Python Auto</li>
                  <li className="flex items-center"><ChevronRight className="w-3 h-3 text-cyan-500 mr-2 flex-shrink-0" />SIEM (Chronicle)</li>
                  <li className="flex items-center sm:col-span-2"><ChevronRight className="w-3 h-3 text-cyan-500 mr-2 flex-shrink-0" />Intrusion Detection Systems</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact-section" className="mb-12 backdrop-blur-[2px] rounded-2xl p-4">
          <SectionHeader title="Secure Communications" icon={Mail} />
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-slate-400 mb-8 leading-relaxed">
                System ready for inbound transmissions. Whether you're looking to discuss a potential role, a cybersecurity project, or just want to connect, initialize a handshake through the form or my direct channels below.
              </p>
              <div className="space-y-4">
                <a href="mailto:Judysepe9@gmail.com" className="flex items-center space-x-4 p-4 bg-slate-900/80 border border-slate-800 rounded-lg hover:border-emerald-500/50 hover:bg-slate-900 transition-all group">
                  <div className="bg-emerald-950/50 p-2 rounded text-emerald-500 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-mono">ENCRYPTED_EMAIL</p>
                    <p className="text-slate-300 font-medium group-hover:text-emerald-400 transition-colors">Judysepe9@gmail.com</p>
                  </div>
                </a>
                <a href="https:/www.linkedin.com/in/judy-sepe-a41a723b5" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 p-4 bg-slate-900/80 border border-slate-800 rounded-lg hover:border-cyan-500/50 hover:bg-slate-900 transition-all group">
                  <div className="bg-cyan-950/50 p-2 rounded text-cyan-500 group-hover:scale-110 transition-transform">
                    <LinkedinIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-mono">PROFESSIONAL_NETWORK</p>
                    <p className="text-slate-300 font-medium group-hover:text-cyan-400 transition-colors">www.linkedin.com/in/judy-sepe-a41a723b5</p>
                  </div>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 p-4 bg-slate-900/80 border border-slate-800 rounded-lg hover:border-purple-500/50 hover:bg-slate-900 transition-all group">
                  <div className="bg-purple-950/50 p-2 rounded text-purple-500 group-hover:scale-110 transition-transform">
                    <GithubIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-mono">CODE_REPOSITORY</p>
                    <p className="text-slate-300 font-medium group-hover:text-purple-400 transition-colors">GitHub Profile</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
              {contactStatus === 'success' ? (
                <div className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-300 z-10">
                  <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Transmission Successful</h3>
                  <p className="text-emerald-200/70">Your message has been securely delivered to my inbox. I will review and respond shortly.</p>
                </div>
              ) : null}
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-emerald-500" />
                    <span>Initialize Connection</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-500 flex items-center">
                    <Lock className="w-3 h-3 mr-1" /> SECURE_CHANNEL
                  </span>
                </div>
                <div className="space-y-1">
                  <label htmlFor="name" className="text-xs font-mono text-slate-400">IDENTIFIER [NAME]</label>
                  <input type="text" id="name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-md py-2.5 px-4 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" placeholder="Enter your name or organization..." />
                </div>
                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs font-mono text-slate-400">RETURN_ADDRESS [EMAIL]</label>
                  <input type="email" id="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-md py-2.5 px-4 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" placeholder="name@company.com" />
                </div>
                <div className="space-y-1">
                  <label htmlFor="message" className="text-xs font-mono text-slate-400">PAYLOAD [MESSAGE]</label>
                  <textarea id="message" required rows="4" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-md py-2.5 px-4 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none" placeholder="Enter message details here..."></textarea>
                </div>
                <button type="submit" disabled={contactStatus === 'submitting'} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-md py-3 font-mono text-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4">
                  {contactStatus === 'submitting' ? (
                    <><Activity className="w-4 h-4 animate-spin" /><span>ENCRYPTING & SENDING...</span></>
                  ) : (
                    <><Send className="w-4 h-4" /><span>TRANSMIT PAYLOAD</span></>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>
        
        <footer className="border-t border-slate-800/50 pt-8 mt-12 text-center flex flex-col items-center justify-center">
          <Terminal className="w-6 h-6 text-slate-700 mb-4" />
          <p className="text-xs text-slate-500 font-mono">
            &copy; {new Date().getFullYear()} Judy Sepe. All systems operational.
          </p>
        </footer>
      </main>

      {/* --- AI CHATBOT WIDGET --- */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isChatOpen ? (
          <div className="animate-bounce">
            <button 
              onClick={() => setIsChatOpen(true)}
              className="relative bg-slate-950 border border-emerald-500 hover:bg-emerald-900 text-white rounded-full p-1.5 shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all hover:scale-110 group flex items-center"
            >
              {/* Aggressive Ping Animation */}
              <span className="absolute inset-0 rounded-full border border-emerald-500 animate-ping opacity-75 pointer-events-none"></span>

              <div className="relative flex items-center justify-center flex-shrink-0 z-10">
                {/* Expanded Whirlwind Rings - Placed outside to overflow the button entirely */}
                <div className="absolute -inset-2 border-[3px] border-dashed border-emerald-500/80 rounded-full animate-[spin_3s_linear_infinite] pointer-events-none z-0"></div>
                <div className="absolute -inset-4 border-[2px] border-dashed border-emerald-400/50 rounded-full animate-[spin_4s_linear_infinite_reverse] pointer-events-none z-0"></div>
                <div className="absolute -inset-6 border-[1px] border-dashed border-emerald-300/30 rounded-full animate-[spin_6s_linear_infinite] pointer-events-none z-0"></div>

                {/* Profile Image Container */}
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-400 bg-slate-800 z-10">
                  <img 
                    src={PROFILE_PIC_URL} 
                    alt="Judy Sepe" 
                    className="w-full h-full object-cover p-1 rounded-full relative z-10"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' className='text-emerald-500'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ccircle cx='12' cy='10' r='3'/%3E%3Cpath d='M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662'/%3E%3C/svg%3E";
                    }}
                  />
                </div>
              </div>
              
              <span className="font-mono text-sm font-bold text-emerald-400 max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap z-10">
                <span className="inline-block pl-8 pr-4 tracking-wider">INITIATE_UPLINK</span>
              </span>
            </button>
          </div>
        ) : (
          <div className="bg-slate-950/95 backdrop-blur-xl border-x-2 border-t-2 border-b-4 border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.4)] w-[350px] sm:w-[400px] h-[550px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-200 ease-out relative">
            {/* Subtle Terminal Scanline Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:100%_4px] z-0 opacity-50"></div>

            <div className="bg-emerald-950/80 border-b border-emerald-500 p-4 flex justify-between items-center relative z-10">
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 rounded-sm overflow-hidden border border-emerald-400 bg-slate-800 flex-shrink-0 group">
                  <img 
                    src={PROFILE_PIC_URL}
                    alt="Judy Sepe" 
                    className="w-full h-full object-cover grayscale contrast-125 sepia group-hover:grayscale-0 transition-all duration-500"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' className='text-emerald-500'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ccircle cx='12' cy='10' r='3'/%3E%3Cpath d='M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662'/%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-mono text-sm font-bold text-white tracking-widest uppercase">MyProfile_Bot.exe</h3>
                  <p className="text-xs text-red-500 font-bold flex items-center tracking-widest mt-0.5">
                    <span className="w-2 h-2 bg-red-500 mr-1.5 animate-[ping_0.5s_linear_infinite]"></span>
                    LIVE_INTERCEPT
                  </p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-emerald-500 hover:text-white transition-colors hover:rotate-90 duration-200 relative z-10">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm relative z-10 scrollbar-thin scrollbar-thumb-emerald-500 scrollbar-track-slate-900">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in ${msg.role === 'user' ? 'slide-in-from-right-8' : 'slide-in-from-left-8'} fade-in duration-300`}>
                  <div className={`max-w-[85%] p-3 shadow-[0_0_15px_rgba(0,0,0,0.5)] border ${
                    msg.role === 'user' 
                      ? 'bg-slate-900 text-emerald-100 border-r-4 border-r-emerald-500 border-slate-700 rounded-l-md' 
                      : 'bg-emerald-950/40 text-emerald-50 border-l-4 border-l-red-500 border-emerald-900/50 rounded-r-md'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-in fade-in duration-200">
                  <div className="bg-slate-900 border border-red-500/50 border-l-4 border-l-red-500 text-red-400 p-3 max-w-[85%] rounded-r-md flex flex-col space-y-2 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                    <span className="text-[10px] uppercase font-bold tracking-widest animate-pulse">&gt; Processing_Vector...</span>
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-3 bg-red-500 animate-[bounce_0.6s_infinite]"></div>
                      <div className="w-1.5 h-3 bg-red-500 animate-[bounce_0.6s_infinite_100ms]"></div>
                      <div className="w-1.5 h-3 bg-red-500 animate-[bounce_0.6s_infinite_200ms]"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-emerald-500 relative z-10 flex space-x-2">
              <div className="relative flex-grow">
                <Terminal className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 animate-pulse" />
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="ENTER_COMMAND..."
                  disabled={isLoading}
                  className="w-full bg-slate-900/80 border border-slate-700 focus:border-emerald-500 rounded-sm py-2 pl-8 pr-3 text-sm font-mono text-emerald-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all disabled:opacity-50 placeholder-emerald-800 uppercase tracking-wider"
                />
              </div>
              <button type="submit" disabled={!inputMessage.trim() || isLoading} className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-4 rounded-sm flex items-center justify-center disabled:opacity-50 disabled:bg-slate-800 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}