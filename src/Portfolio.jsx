import { useState, useEffect, useRef } from "react";
import image from "./assets/image.png";
import { motion } from "framer-motion";
import image1 from "./assets/image1.png";
import image2 from "./assets/image2.png";
import image3 from "./assets/image3.png";
import image4 from "./assets/image4.png";
import { FaPhoneAlt, FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
/* ══════════════════════════════════════════════
   ANIMATED PARTICLE BACKGROUND
══════════════════════════════════════════════ */
const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);

    const DOTS = Array.from({ length: 90 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5,
      r: Math.random() * 1.8 + .4,
      alpha: Math.random() * .6 + .15,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      DOTS.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165,180,252,${d.alpha})`;
        ctx.fill();
      });
      DOTS.forEach((a, i) => {
        DOTS.slice(i + 1).forEach(b => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(99,102,241,${.18 * (1 - dist / 120)})`;
            ctx.lineWidth = .6;
            ctx.stroke();
          }
        });
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }} />;
};
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.4, // ⏳ delay for whole animation
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 80, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 14,
        },
  },
};

/* ══════════════════════════════════════════════
   GLASS BUTTON
══════════════════════════════════════════════ */
const GlassButton = ({ children, primary, onClick, small }) => (
  <button onClick={onClick} style={{
    position:"relative", overflow:"hidden",
    padding: small ? "8px 20px" : "12px 28px",
    borderRadius:14, fontFamily:"'DM Sans',sans-serif",
    fontWeight:600, fontSize: small ? 12 : 13.5,
    letterSpacing:".03em", cursor:"pointer", userSelect:"none",
    background: primary
      ? "linear-gradient(135deg,rgba(99,179,237,.3),rgba(129,140,248,.3))"
      : "rgba(255,255,255,0.055)",
    border: primary ? "1.5px solid rgba(129,140,248,.6)" : "1.5px solid rgba(255,255,255,.14)",
    backdropFilter:"blur(18px) saturate(180%)",
    WebkitBackdropFilter:"blur(18px) saturate(180%)",
    boxShadow: primary
      ? "0 4px 28px rgba(129,140,248,.22),inset 0 1px 0 rgba(255,255,255,.2)"
      : "0 4px 18px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.09)",
    color: primary ? "#e0e7ff" : "rgba(255,255,255,.76)",
    transition:"transform .25s ease, box-shadow .25s ease",
  }}
    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px) scale(1.04)"}
    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0) scale(1)"}
  >
    <span style={{ position:"absolute", inset:0, borderRadius:14, pointerEvents:"none",
      background:"linear-gradient(135deg,rgba(255,255,255,.1) 0%,transparent 55%)" }} />
    <span style={{ position:"relative", zIndex:1 }}>{children}</span>
  </button>
);

/* ══════════════════════════════════════════════
   ORBIT SYSTEM — 2 rings + bg decoration
══════════════════════════════════════════════ */
// Inner orbit (closer, faster)
const INNER_BADGES = [
  { icon:"⚛️", label:"React",      color:"rgba(99,214,255,.9)"  },
  { icon:"🟩", label:"Node.js",    color:"rgba(134,239,172,.9)" },
  { icon:"🍃", label:"MongoDB",    color:"rgba(74,222,128,.9)"  },
  { icon:"🚀", label:"Express",    color:"rgba(251,191,36,.9)"  },
  { icon:"🔷", label:"TypeScript", color:"rgba(147,197,253,.9)" },
  { icon:"🎨", label:"Tailwind",   color:"rgba(196,181,253,.9)" },
];
// Outer orbit (further, slower, more items)
const OUTER_BADGES = [
  { icon:"🌐", label:"HTML/CSS",   color:"rgba(253,186,116,.9)" },
  { icon:"💛", label:"JavaScript", color:"rgba(253,224,71,.9)"  },
  { icon:"🗄️", label:"MySQL",      color:"rgba(129,140,248,.9)" },
  { icon:"☁️", label:"AWS",        color:"rgba(147,197,253,.9)" },
  { icon:"🔀", label:"Git",        color:"rgba(251,113,133,.9)" },
  { icon:"🐙", label:"GitHub",     color:"rgba(192,132,252,.9)" },
  { icon:"🅱️", label:"Bootstrap",  color:"rgba(167,139,250,.9)" },
  { icon:"💠", label:"C/C++",      color:"rgba(103,232,249,.9)" },
];

const INNER_R = 155;
const OUTER_R = 230;

const OrbitSystem = () => (
  <div style={{ position:"relative", width:620, height:620, flexShrink:0 }}>

    {/* ── OUTER ring ── */}
    <div style={{
      position:"absolute", top:"50%", left:"50%",
      width:OUTER_R*2, height:OUTER_R*2,
      marginTop:-OUTER_R, marginLeft:-OUTER_R,
      borderRadius:"50%",
      border:"1px dashed rgba(99,102,241,.3)",
      animation:"spinRing 44s linear infinite",
      zIndex:1,
    }}/>

    {/* ── INNER ring ── */}
    <div style={{
      position:"absolute", top:"50%", left:"50%",
      width:INNER_R*2, height:INNER_R*2,
      marginTop:-INNER_R, marginLeft:-INNER_R,
      borderRadius:"50%",
      border:"1px solid rgba(129,140,248,.25)",
      animation:"spinRing 22s linear infinite reverse",
      zIndex:1,
    }}/>

    {/* ── PHOTO — full, no crop, no card ── */}
    <div style={{
      position:"absolute", top:"50%", left:"50%",
      transform:"translate(-50%,-50%)",
      width:"55%",
height:"68%",
      zIndex:50,
      background:"none", border:"none", boxShadow:"none",
    }}>
      <img src={image} alt="Gunika"
        style={{
          width:"100%", height:"100%",
          objectFit:"contain",
          objectPosition:"center bottom",
          display:"block",
        }}/>
    </div>

    {/* ── INNER ORBIT BADGES ── */}
    {INNER_BADGES.map((b, i) => (
      <div key={b.label} style={{
        position:"absolute", top:"50%", left:"50%",
        width:62, height:62, marginTop:-31, marginLeft:-31,
        animation:`orbitBadgeInner 16s linear infinite`,
        animationDelay:`${-(16 / INNER_BADGES.length) * i}s`,
        zIndex:40,
      }}>
        <div style={{
          width:62, height:62, borderRadius:15,
          display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center", gap:2,
          background:"rgba(7,9,22,.9)",
          border:`1px solid ${b.color.replace(".9","0.38")}`,
          backdropFilter:"blur(18px)",
          boxShadow:`0 6px 22px rgba(0,0,0,.65),inset 0 1px 0 rgba(255,255,255,.12),0 0 16px ${b.color.replace(".9","0.18")}`,
          animation:`counterRotateInner 16s linear infinite`,
          animationDelay:`${-(16 / INNER_BADGES.length) * i}s`,
          transition:"transform .2s",
        }}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.25)"}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
        >
          <span style={{ fontSize:20 }}>{b.icon}</span>
          <span style={{ fontSize:7.5, color:"rgba(255,255,255,.85)", fontWeight:700, letterSpacing:".02em" }}>{b.label}</span>
        </div>
      </div>
    ))}

    {/* ── OUTER ORBIT BADGES ── */}
    {OUTER_BADGES.map((b, i) => (
      <div key={b.label} style={{
        position:"absolute", top:"50%", left:"50%",
        width:66, height:66, marginTop:-33, marginLeft:-33,
        animation:`orbitBadgeOuter 30s linear infinite`,
        animationDelay:`${-(30 / OUTER_BADGES.length) * i}s`,
        zIndex:40,
      }}>
        <div style={{
          width:66, height:66, borderRadius:15,
          display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center", gap:2,
          background:"rgba(7,9,22,.85)",
          border:`1px solid ${b.color.replace(".9","0.3")}`,
          backdropFilter:"blur(18px)",
          boxShadow:`0 6px 22px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.09),0 0 14px ${b.color.replace(".9","0.14")}`,
          animation:`counterRotateOuter 30s linear infinite`,
          animationDelay:`${-(30 / OUTER_BADGES.length) * i}s`,
          transition:"transform .2s",
        }}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.22)"}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
        >
          <span style={{ fontSize:20 }}>{b.icon}</span>
          <span style={{ fontSize:7.5, color:"rgba(255,255,255,.8)", fontWeight:700, letterSpacing:".02em" }}>{b.label}</span>
        </div>
      </div>
    ))}
  </div>
);

/* ══════════════════════════════════════════════
   SKILL TAG
══════════════════════════════════════════════ */
const SkillTag = ({ label, icon, color }) => (
  <div style={{
    display:"flex", alignItems:"center", gap:7,
    padding:"7px 14px", borderRadius:10, fontSize:13, fontWeight:500,
    background:`rgba(${color},0.1)`,
    border:`1px solid rgba(${color},0.25)`,
    backdropFilter:"blur(10px)", color:"rgba(255,255,255,.85)",
    transition:"all .22s",
  }}
    onMouseEnter={e => { e.currentTarget.style.background = `rgba(${color},0.22)`; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={e => { e.currentTarget.style.background = `rgba(${color},0.1)`; e.currentTarget.style.transform = "none"; }}
  >
    {icon && <span style={{ fontSize:16 }}>{icon}</span>}
    {label}
  </div>
);

/* ══════════════════════════════════════════════
   ABOUT CARD
══════════════════════════════════════════════ */
const AboutCard = ({ icon, title, desc, gradient, delay }) => (
  <div style={{ animation:`cardIn .65s ease both`, animationDelay:delay }}>
    <div style={{
      borderRadius:22, padding:"26px 22px",
      background:gradient,
      border:"1px solid rgba(255,255,255,.08)",
      backdropFilter:"blur(18px)",
      boxShadow:"0 8px 36px rgba(0,0,0,.32),inset 0 1px 0 rgba(255,255,255,.08)",
      display:"flex", flexDirection:"column", gap:12, height:"100%",
      transition:"transform .3s ease, box-shadow .3s ease",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-7px)"; e.currentTarget.style.boxShadow = "0 22px 60px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 36px rgba(0,0,0,.32),inset 0 1px 0 rgba(255,255,255,.08)"; }}
    >
      <span style={{ fontSize:32 }}>{icon}</span>
      <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:17, color:"#fff", fontWeight:700 }}>{title}</h3>
      <p style={{ fontSize:13.5, color:"rgba(255,255,255,.54)", lineHeight:1.75 }}>{desc}</p>
    </div>
  </div>
);

/* ══════════════════════════════════════════════
   PROJECT CARD
══════════════════════════════════════════════ */
const ProjectCard = ({ emoji, title, desc, tags, accent, link }) => (
  <div style={{
    borderRadius:22, padding:"24px 22px",
    background:"rgba(255,255,255,.035)",
    border:"1px solid rgba(255,255,255,.08)",
    backdropFilter:"blur(20px)",
    boxShadow:"0 8px 36px rgba(0,0,0,.32),inset 0 1px 0 rgba(255,255,255,.06)",
    display:"flex", flexDirection:"column", gap:12,
    transition:"transform .3s ease, box-shadow .3s ease",
    cursor:"pointer",
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = `0 24px 60px rgba(0,0,0,.5),0 0 30px ${accent}28`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 36px rgba(0,0,0,.32),inset 0 1px 0 rgba(255,255,255,.06)"; }}
  >
    <div style={{ fontSize:36 }}>{emoji}</div>
    <div style={{ height:2, width:34, borderRadius:2, background:accent }} />
    <h3 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:18, color:"#fff", fontWeight:700 }}>{title}</h3>
    <p style={{ fontSize:13.5, color:"rgba(255,255,255,.5)", lineHeight:1.7, flex:1 }}>{desc}</p>
    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
      {tags.map(t => (
        <span key={t} style={{ fontSize:11, padding:"3px 10px", borderRadius:999,
          background:"rgba(99,102,241,.13)", border:"1px solid rgba(99,102,241,.25)", color:"#a5b4fc" }}>{t}</span>
      ))}
    </div>
    <span style={{ fontSize:12, color:accent, marginTop:4 }}>View Project →</span>
  </div>
);

/* ══════════════════════════════════════════════
   CERT CARD
══════════════════════════════════════════════ */
const CertCard = ({ icon, title, org, date, highlight }) => (
  <div style={{
    borderRadius:18, padding:"20px 20px",
    background: highlight ? "linear-gradient(135deg,rgba(99,102,241,.18),rgba(56,189,248,.1))" : "rgba(255,255,255,.035)",
    border: highlight ? "1px solid rgba(99,102,241,.35)" : "1px solid rgba(255,255,255,.08)",
    backdropFilter:"blur(16px)",
    boxShadow:"0 6px 28px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.07)",
    display:"flex", flexDirection:"column", gap:8,
    transition:"transform .25s ease",
  }}
    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
    onMouseLeave={e => e.currentTarget.style.transform = "none"}
  >
    <span style={{ fontSize:26 }}>{icon}</span>
    <h4 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:14.5, color:"#fff", fontWeight:700, lineHeight:1.4 }}>{title}</h4>
    <p style={{ fontSize:12, color:"rgba(255,255,255,.5)" }}>{org}</p>
    {date && <span style={{ fontSize:11, color:"#818cf8", marginTop:2 }}>{date}</span>}
  </div>
);

/* ══════════════════════════════════════════════
   DATA
══════════════════════════════════════════════ */
const skillGroups = [
  { label:"Frontend", color:"99,102,241", skills:[
    { label:"HTML & CSS", icon:"🌐" }, { label:"JavaScript", icon:"💛" },
    { label:"React.js", icon:"⚛️" }, { label:"Tailwind CSS", icon:"🎨" },
    { label:"Bootstrap", icon:"🅱️" }, { label:"jQuery", icon:"🔌" },
  ]},
  { label:"Backend & DB", color:"52,211,153", skills:[
    { label:"Node.js", icon:"🟩" }, { label:"Express.js", icon:"🚀" },
    { label:"MongoDB", icon:"🍃" }, { label:"MySQL", icon:"🗄️" },
    { label:"RESTful API", icon:"🔗" }, { label:"AWS", icon:"☁️" },
  ]},
  { label:"Languages", color:"251,191,36", skills:[
    { label:"C", icon:"💠" }, { label:"C++", icon:"⚙️" },
  ]},
  { label:"Tools", color:"56,189,248", skills:[
    { label:"Git", icon:"🔀" }, { label:"GitHub", icon:"🐙" },
  ]},
  { label:"Soft Skills", color:"251,113,133", skills:[
    { label:"English", icon:"🗣️" }, { label:"Communication", icon:"💬" },
    { label:"Teamwork", icon:"🤝" }, { label:"Problem-Solving", icon:"🧩" },
    { label:"Adaptability", icon:"🔄" }, { label:"Time Management", icon:"⏱️" },
  ]},
];

const projects = [
  { emoji:"🛠️", title:"Real-Time Collaboration Tool", accent:"#06b6d4",
    desc:"Multi-user workspace with real-time editing and cloud storage built on AWS.",
    tags:["Node.js","Express","MongoDB","AWS"] },
  { emoji:"🤖", title:"Gemini Clone", accent:"#a78bfa",
    desc:"Chat interface with async LLM API integration, streaming responses & history.",
    tags:["React","Tailwind CSS","Gemini API"] },
  { emoji:"💼", title:"Personal Portfolio", accent:"#f97316",
    desc:"Responsive portfolio featuring an interactive 3D hero scene with Spline.",
    tags:["React","Tailwind CSS","Spline"] },
  { emoji:"🎬", title:"Netflix Clone", accent:"#ef4444",
    desc:"Pixel-perfect, fully responsive static replica using Flexbox and CSS Grid.",
    tags:["HTML","CSS","JavaScript"] },
];

const aboutCards = [
  { icon:"🎓", title:"BCA Student", delay:"0s",
    gradient:"linear-gradient(135deg,rgba(99,102,241,.18) 0%,rgba(18,14,55,.75) 100%)",
    desc:"Pursuing Bachelor of Computer Applications (2023–2026) at Himachal Pradesh University. Strong foundation in CS fundamentals — DSA, OS, DBMS & networking." },
  { icon:"🚀", title:"MERN Stack Dev", delay:".1s",
    gradient:"linear-gradient(135deg,rgba(52,211,153,.16) 0%,rgba(5,28,18,.75) 100%)",
    desc:"Built real-world full-stack apps with MongoDB, Express, React & Node. Comfortable with REST APIs, JWT auth & AWS cloud deployment." },
  { icon:"🏆", title:"Top 100 Builder", delay:".2s",
    gradient:"linear-gradient(135deg,rgba(251,191,36,.16) 0%,rgba(44,28,4,.75) 100%)",
    desc:"Placed in the top 100 teams out of 25,000 at BuildwithIndia (Google Finale). Certified in Google AI Essentials & IBM Web Development." },
  { icon:"🎨", title:"UI/UX Mindset", delay:".3s",
    gradient:"linear-gradient(135deg,rgba(251,113,133,.16) 0%,rgba(50,8,22,.75) 100%)",
    desc:"Believe great software must look as good as it works. Figma and Spline are my go-to tools for prototyping before writing a single line of code." },
  { icon:"📚", title:"Lifelong Learner", delay:".4s",
    gradient:"linear-gradient(135deg,rgba(56,189,248,.15) 0%,rgba(6,36,60,.75) 100%)",
    desc:"Currently exploring TypeScript, Docker & CI/CD. Completed internships and certifications in AI, Web Dev & Professional Skills." },
  { icon:"🤝", title:"Team Player", delay:".5s",
    gradient:"linear-gradient(135deg,rgba(167,139,250,.18) 0%,rgba(34,14,55,.75) 100%)",
    desc:"Hackathon enthusiast and open-source contributor who thrives in collaborative environments. Strong communicator and problem-solver." },
];

// 👇 component ke top pe (return se pehle)
const certs = [
  {
    title: "🤖 AI Virtual Internship",
    desc: "SKILLRAAce · May–June 2024",
    extra: "AI fundamentals & real-world applications",
    link: "/pdfs/ai-internship.pdf",
  },
  {
    title: "BuildwithIndia (Google)",
    desc: "Top 100 out of 25,000 teams",
    link: "/pdfs/buildwithindia.pdf",
  },
  {
    title: "Google AI Essentials",
    desc: "Coursera · 2025",
    link: "/pdfs/google-ai.pdf",
  },
  {
    title: "IBM Web Development",
    desc: "HTML, CSS & JS",
    link: "/pdfs/web-dev.pdf",
  },
  {
    title: "IBM Professional Skills",
    desc: "Communication & workplace skills",
    link: "/pdfs/pro-skills.pdf",
  },
];

const SECTIONS = ["home","about","skills","projects","certifications","contact"];


/* ══════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════ */
export default function Portfolio() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const roles = ["Full Stack Developer","BCA Student @ HPU","MERN Stack Dev","UI/UX Enthusiast","Problem Solver"];
  const roleRef = useRef(0), charRef = useRef(0), deletingRef = useRef(false);
useEffect(() => {
  const timeout = setTimeout(() => {
    document.querySelectorAll("[data-width]").forEach((el) => {
      el.style.width = el.getAttribute("data-width") + "%";
      el.style.transition = "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)";
    });
  }, 600);
  return () => clearTimeout(timeout);
}, []);
  // Typewriter
  useEffect(() => {
    let t;
    const tick = () => {
      const cur = roles[roleRef.current];
      if (!deletingRef.current) {
        if (charRef.current < cur.length) { charRef.current++; setTyped(cur.slice(0, charRef.current)); t = setTimeout(tick, 68); }
        else t = setTimeout(() => { deletingRef.current = true; tick(); }, 1900);
      } else {
        if (charRef.current > 0) { charRef.current--; setTyped(cur.slice(0, charRef.current)); t = setTimeout(tick, 40); }
        else { deletingRef.current = false; roleRef.current = (roleRef.current + 1) % roles.length; t = setTimeout(tick, 320); }
      }
    };
    t = setTimeout(tick, 600);
    return () => clearTimeout(t);
  }, []);

  // Active section on scroll
  useEffect(() => {
    const onScroll = () => {
      let found = "home";
      SECTIONS.forEach(id => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 80) found = id;
      });
      setActive(found);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        @keyframes floatOrb1  { 0%,100%{transform:translate(0,0)} 50%{transform:translate(55px,35px)} }
        @keyframes floatOrb2  { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-38px,52px)} }
        @keyframes floatOrb3  { 0%,100%{transform:translate(0,0)} 33%{transform:translate(25px,-25px)} 66%{transform:translate(-25px,25px)} }
        @keyframes fadeUp     { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink      { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes shimmer    { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes spinRing   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes cardIn     { from{opacity:0;transform:translateY(36px) scale(.96)} to{opacity:1;transform:none} }
        @keyframes floatPhoto { 0%,100%{transform:translate(-50%,-50%) translateY(0)} 50%{transform:translate(-50%,-50%) translateY(-12px)} }

        @keyframes orbitBadgeInner {
          from { transform: rotate(0deg)   translateX(${INNER_R}px) rotate(0deg);   }
          to   { transform: rotate(360deg) translateX(${INNER_R}px) rotate(-360deg); }
        }
        @keyframes counterRotateInner {
          from { transform: rotate(0deg);    }
          to   { transform: rotate(-360deg); }
        }
        @keyframes orbitBadgeOuter {
          from { transform: rotate(0deg)   translateX(${OUTER_R}px) rotate(0deg);   }
          to   { transform: rotate(360deg) translateX(${OUTER_R}px) rotate(-360deg); }
        }
        @keyframes counterRotateOuter {
          from { transform: rotate(0deg);    }
          to   { transform: rotate(-360deg); }
        }

        .fade-up { animation:fadeUp .7s ease both; }
        .d1{animation-delay:.08s} .d2{animation-delay:.22s} .d3{animation-delay:.36s}
        .d4{animation-delay:.5s}  .d5{animation-delay:.64s} .d6{animation-delay:.78s}

        .cursor::after { content:'|'; animation:blink 1s step-end infinite; color:#818cf8; margin-left:2px; }

        .shimmer-text {
          background:linear-gradient(90deg,#a5b4fc 0%,#ffffff 38%,#7dd3fc 68%,#a5b4fc 100%);
          background-size:200% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          animation:shimmer 4s linear infinite;
        }

        .nav-link-active { color:#a5b4fc !important; }

        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#070910; }
        ::-webkit-scrollbar-thumb { background:rgba(99,102,241,.45); border-radius:10px; }
        html { scroll-behavior:smooth; }
        section { scroll-margin-top:72px; }
      `}</style>

      <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#060810 0%,#0a0d1a 50%,#060c18 100%)", fontFamily:"'DM Sans',sans-serif", color:"#fff", overflowX:"hidden" }}>

        {/* ── Animated particle canvas ── */}
        <ParticleCanvas />

        {/* ── Ambient orbs ── */}
        <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:1, overflow:"hidden" }}>
          {[
            { w:550,h:550, top:-140, left:-120, color:"rgba(99,102,241,.17)",  anim:"floatOrb1 14s ease-in-out infinite" },
            { w:440,h:440, bottom:-80, right:-100, color:"rgba(56,189,248,.13)", anim:"floatOrb2 18s ease-in-out infinite" },
            { w:340,h:340, top:"42%", left:"44%", color:"rgba(168,85,247,.1)",  anim:"floatOrb3 22s ease-in-out infinite" },
          ].map((o,i) => (
            <div key={i} style={{
              position:"absolute", width:o.w, height:o.h,
              top:o.top, left:o.left, bottom:o.bottom, right:o.right,
              borderRadius:"50%",
              background:`radial-gradient(circle,${o.color} 0%,transparent 70%)`,
              filter:"blur(48px)", animation:o.anim,
            }}/>
          ))}
        </div>

        {/* ══════════ NAVBAR ══════════ */}
      <nav className="navbar">
  <div className="navbar-container">
    {/* Logo */}
    <div className="logo" onClick={() => scrollTo("home")}>
      {"Gunika"}
    </div>

    {/* Hamburger for mobile */}
    <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
      <span className={menuOpen ? "line rotate1" : "line"}></span>
      <span className={menuOpen ? "line fade" : "line"}></span>
      <span className={menuOpen ? "line rotate2" : "line"}></span>
    </div>

    {/* Links */}
    <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
      {SECTIONS.map((id) => (
        <li key={id}>
          <button
            onClick={() => scrollTo(id)}
            className={active === id ? "active" : ""}
          >
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </button>
        </li>
      ))}
      <li>
  <a href="/Gunika.pdf" target="_blank" style={{ textDecoration: "none" }}>
    <GlassButton primary small>
      Resume ↗
    </GlassButton>
  </a>
</li>
    </ul>
  </div>

  {/* Styles */}
  <style>{`
    /* Navbar Container */
    .navbar {
      position: fixed;
      top: 12px; /* floating effect */
      left: 0;
      right: 0;
      margin: 0 24px; /* side margin for floating feel */
      z-index: 100;
      backdrop-filter: blur(30px) saturate(180%);
      background: rgba(6, 8, 16, 0.85);
      border-radius: 16px; /* rounded edges */
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5); /* soft shadow */
      transition: all 0.4s ease;
    }

    .navbar:hover {
      transform: translateY(-2px); /* lift on hover */
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55);
    }

    .navbar-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      height: 68px;
    }

    /* Logo */
    .logo {
      font-family: 'Poppins', sans-serif; /* Stylish modern font */
      font-weight: 800;
      font-size: 26px;
      color: #8b5cf6; /* Bright violet */
      padding: 0; 
      border-radius: 0;
      background: none; 
      border: none;
      cursor: pointer;
      box-shadow: none;
      transition: transform 0.3s ease, color 0.3s ease;
    }
    .logo:hover {
      transform: scale(1.1);
      color: #a78bfa; /* lighter violet on hover */
    }

    /* Links */
    .nav-links {
      display: flex;
      align-items: center;
      gap: 10px;
      list-style: none;
      transition: all 0.3s ease;
    }
    .nav-links li button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px 16px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.65);
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    .nav-links li button.active,
    .nav-links li button:hover {
      color: #fff;
    }
    .nav-links li button::before {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(to right, #6366f1, #9333ea);
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.3s ease;
    }
    .nav-links li button:hover::before,
    .nav-links li button.active::before {
      transform: scaleX(1);
      transform-origin: left;
    }

    /* Hamburger menu for mobile */
    .hamburger {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      width: 28px;
      height: 20px;
      cursor: pointer;
    }
    .line {
      height: 3px;
      background: #a5b4fc;
      border-radius: 2px;
      transition: all 0.4s ease;
    }
    .rotate1 { transform: rotate(45deg) translate(5px, 5px); }
    .rotate2 { transform: rotate(-45deg) translate(5px, -5px); }
    .fade { opacity: 0; }

    @media (max-width: 900px) {
      .nav-links { 
        position: fixed;
        top: 68px;
        left: 0;
        right: 0;
        background: rgba(6, 8, 16, 0.95);
        flex-direction: column; 
        transform: translateY(-150%);
        opacity: 0;
        gap: 16px;
        padding: 16px 0;
        border-top: 1px solid rgba(255,255,255,0.05);
      }
      .nav-links.open { transform: translateY(0); opacity:1; }
      .hamburger { display: flex; }
    }
  `}</style>
</nav>
        {/* ══════════ HERO ══════════ */}



<section
  id="home"
  className="hero-section relative z-10 min-h-screen flex items-center px-5 pt-28 pb-10 md:px-10 lg:px-20 lg:pt-36"
>

<style>{`

/* ✅ MOBILE FIX */
@media (max-width: 768px) {

  .hero-section {
    padding: 110px 20px 30px !important; /* 🔥 navbar + top gap */
  }

  .hero-grid {
    display: flex !important;
    flex-direction: column !important;
    gap: 30px !important;
  }

  .left-side {
    order: 1;
  }

  .right-side {
    order: 2;
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

}

`}</style>

  <motion.div
  className="hero-grid w-full max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
  variants={container}
  initial="hidden"
  whileInView="show"
  viewport={{ once: false, amount: 0.3 }}
>

    {/* LEFT */}
  <div
  className="left-side"
  style={{
    display: "flex",
    flexDirection: "column",
    gap: 22,
    paddingLeft: "40px",
  }}
>

      <motion.div
        variants={item}
        whileHover={{ scale: 1.05 }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 14px",
          borderRadius: 999,
          width: "fit-content",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          background: "rgba(99,102,241,.15)",
          border: "1px solid rgba(99,102,241,.35)",
          color: "#818cf8",
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#4ade80",
            boxShadow: "0 0 10px #4ade80",
          }}
        />
        Open to Opportunities
      </motion.div>

      <motion.h1 variants={item} style={{
        fontFamily:"'Clash Display',sans-serif",
        fontSize:"clamp(2.4rem,4.6vw,4rem)",
        fontWeight:700,
        lineHeight:1.08,
        color:"#fff",
      }}>
        Hi, I'm <span className="shimmer-text">Gunika</span><br/>
        <span style={{ color:"rgba(255,255,255,.9)" }}>
          Full-Stack Developer
        </span>
      </motion.h1>

      <motion.div variants={item} style={{
        fontSize:19,
        fontWeight:500,
        color:"#7dd3fc",
        fontFamily:"'Clash Display',sans-serif",
        minHeight:30,
      }}>
        {typed}
      </motion.div>

      <motion.p variants={item} style={{
        color:"rgba(255,255,255,.5)",
        lineHeight:1.78,
        maxWidth:480,
        fontSize:15
      }}>
        I’m a Full Stack Developer focused on building fast, scalable, and user-friendly web applications.
        I enjoy turning complex ideas into simple, elegant solutions — from real-time platforms to AI-powered apps.
        Recognized in the Top 100 at Google’s BuildwithIndia.
      </motion.p>

      <motion.div variants={item} style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
        <motion.button
          whileHover={{ scale: 1.08, y: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => scrollTo("projects")}
          style={{
            padding: "12px 24px",
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg,#6366f1,#7dd3fc)",
            color: "white",
            fontWeight: 600,
          }}
        >
          Explore My Work ✨
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08, y: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => scrollTo("contact")}
          style={{
            padding: "12px 24px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,.2)",
            background: "rgba(255,255,255,.05)",
            color: "white",
          }}
        >
          Let’s Connect →
        </motion.button>
      </motion.div>

      <motion.div variants={item} style={{ display:"flex", gap:36, flexWrap:"wrap" }}>
        {[["4+","Projects"],["12+","Tech"],["Top 100","Google"]].map(([n,l]) => (
          <motion.div key={l} whileHover={{ scale: 1.1 }}>
            <span style={{
              fontSize:24,
              fontWeight:700,
              background:"linear-gradient(135deg,#a5b4fc,#7dd3fc)",
              WebkitBackgroundClip:"text",
              WebkitTextFillColor:"transparent",
            }}>{n}</span>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.4)" }}>{l}</div>
          </motion.div>
        ))}
      </motion.div>

    </div>

    {/* RIGHT */}
    <motion.div
  className="right-side flex justify-center scale-[0.52] sm:scale-[0.65] md:scale-[0.78] lg:scale-100 -my-28 sm:-my-20 md:-my-10 lg:my-0"
  initial={{ opacity: 0, scale: 0.7, rotate: -15 }}
  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
  viewport={{ once: false }}
  transition={{ duration: 1.2, type: "spring" }}
>
      <OrbitSystem />
    </motion.div>

  </motion.div>
</section>

    

    

        {/* ══════════ ABOUT ══════════ */}
       <section
  id="about"
  style={{
    padding: "100px 80px",
    position: "relative",
    zIndex: 10,
  }}
>
  <style>{`
    .about-wrap {
      max-width: 1000px;
      margin: 0 auto;
      opacity: 0;
      transform: translateY(80px) scale(0.95);
      filter: blur(10px);
      transition: all 0.9s cubic-bezier(.16,1,.3,1);
    }

    .about-wrap.show {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0);
    }

    .about-text {
      text-align: center;
      margin-bottom: 60px;
      transform: translateY(30px);
      opacity: 0;
      transition: 0.8s ease;
    }

    .about-wrap.show .about-text {
      transform: translateY(0);
      opacity: 1;
    }

    .about-tag {
      color: #818cf8;
      font-size: 12px;
      letter-spacing: .15em;
      text-transform: uppercase;
    }

    .about-title {
      font-size: clamp(2.3rem, 3.5vw, 3rem);
      color: white;
      margin: 12px 0;
      font-weight: 700;
    }

    .about-desc {
      color: rgba(255,255,255,.6);
      max-width: 600px;
      margin: auto;
    }

    .about-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
    }

    /* CARD BASE */
    .neon-card {
      position: relative;
      padding: 24px;
      border-radius: 18px;
      background: rgba(255,255,255,0.03);
      color: white;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.08);

      opacity: 0;
      transform: translateY(50px) scale(0.9);
      filter: blur(6px);
      transition: all 0.6s ease;
    }

    /* STAGGER ENTRY */
    .about-wrap.show .neon-card {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0);
    }

    .about-wrap.show .neon-card:nth-child(1) { transition-delay: 0.1s; }
    .about-wrap.show .neon-card:nth-child(2) { transition-delay: 0.2s; }
    .about-wrap.show .neon-card:nth-child(3) { transition-delay: 0.3s; }
    .about-wrap.show .neon-card:nth-child(4) { transition-delay: 0.4s; }

    /* NEON BORDER */
    .neon-card::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      padding: 1px;
      background: linear-gradient(135deg, #6366f1, #22d3ee, #a855f7);
      -webkit-mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0.8;
      animation: glowPulse 3s infinite linear;
    }

    /* GLOW ANIMATION */
    @keyframes glowPulse {
      0% { opacity: 0.4; }
      50% { opacity: 1; }
      100% { opacity: 0.4; }
    }

    /* HOVER EFFECT */
    .neon-card:hover {
      transform: translateY(-10px) scale(1.05);
      box-shadow:
        0 0 25px rgba(99,102,241,0.5),
        0 0 60px rgba(34,211,238,0.35);
    }

    .neon-card h4 {
      margin-bottom: 8px;
    }

    .neon-card p {
      font-size: 13px;
      color: rgba(255,255,255,.6);
    }
  `}</style>

  <div
    className="about-wrap"
    ref={(el) => {
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add("show");
          } else {
            el.classList.remove("show"); // 🔁 repeat animation
          }
        },
        {
          threshold: 0.2,
        }
      );

      observer.observe(el);
    }}
  >
    {/* TEXT */}
    <div className="about-text">
      <p className="about-tag">About Me</p>

      <h2 className="about-title">
        I create <span className="shimmer-text">modern web UI</span>
      </h2>

      <p className="about-desc">
        I’m a BCA student passionate about front-end development and building
        clean, responsive web interfaces using React and modern tools.
      </p>
    </div>

    {/* CARDS */}
    <div className="about-cards">
      {aboutCards.map((c, i) => (
        <div key={i} className="neon-card">
          <h4>{c.title}</h4>
          <p>{c.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

        {/* ══════════ SKILLS ══════════ */}
        
<section
  id="skills"
  className="py-16 md:py-24 flex flex-col items-center px-4"
>
  {/* Title */}
  <h2
    style={{
      fontSize: "2.5rem",
      fontWeight: 700,
      marginBottom: "4rem",
      textAlign: "center",
      zIndex: 1,
      color: "#fff",
    }}
  >
    My{" "}
    <span
      style={{
        background: "linear-gradient(90deg, #c084fc, #60a5fa)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      Skills
    </span>
  </h2>

  {/* Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-[760px]">
    {[
      {
        title: "Frontend",
        subtitle: "UI & Web Technologies",
        icon: "🖥",
        barFrom: "#818cf8",
        barTo: "#a78bfa",
        skills: [["HTML", 72], ["CSS", 68], ["JavaScript", 65], ["React", 70]],
      },
      {
        title: "Backend",
        subtitle: "Server & Databases",
        icon: "⚙️",
        barFrom: "#60a5fa",
        barTo: "#22d3ee",
        skills: [["Node.js", 63], ["Express", 60], ["MongoDB", 62], ["MySQL", 58]],
      },
      {
        title: "Programming",
        subtitle: "Systems Languages",
        icon: "💡",
        barFrom: "#fbbf24",
        barTo: "#f59e0b",
        skills: [["C", 55], ["C++", 58]],
      },
      {
        title: "Tools & DevOps",
        subtitle: "Version Control & Cloud",
        icon: "🛠",
        barFrom: "#34d399",
        barTo: "#10b981",
        skills: [["Git", 65], ["GitHub", 68], ["AWS", 50]],
      },
    ].map((cat, i) => (
      <div
        key={i}
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "18px",
          padding: "24px",
          opacity: 0,
          transform: "translateY(30px)",
          animation: "fadeUp 0.5s ease forwards",
          animationDelay: `${i * 0.15}s`,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              background: `${cat.barFrom}22`,
              border: `1px solid ${cat.barFrom}44`,
              flexShrink: 0,
              opacity: 0,
              transform: "scale(0.5)",
              animation: "iconPop 0.4s ease forwards",
              animationDelay: `${i * 0.15 + 0.3}s`,
            }}
          >
            {cat.icon}
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>{cat.title}</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>{cat.subtitle}</div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            marginBottom: "18px",
            background: `linear-gradient(90deg, ${cat.barFrom}66, transparent)`,
          }}
        />

        {/* Skills */}
        {cat.skills.map(([name, val], j) => (
          <div key={j} style={{ marginBottom: j === cat.skills.length - 1 ? 0 : "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>{name}</span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "2px 7px",
                  borderRadius: "6px",
                  background: `${cat.barFrom}22`,
                  color: cat.barFrom,
                }}
              >
                {val}%
              </span>
            </div>

            {/* Bar track */}
            <div
              style={{
                width: "100%",
                height: "6px",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "99px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Filled bar */}
              <div
                data-width={val}
                style={{
                  height: "100%",
                  borderRadius: "99px",
                  background: `linear-gradient(90deg, ${cat.barFrom}, ${cat.barTo})`,
                  boxShadow: `0 0 10px ${cat.barFrom}99`,
                  width: "0%",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Shimmer */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "60%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                    animation: "shimmer 2s ease-in-out infinite",
                    animationDelay: `${1.5 + j * 0.2}s`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    ))}
  </div>

  <style>{`
    @keyframes fadeUp {
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes iconPop {
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes shimmer {
      0% { left: -60%; }
      100% { left: 110%; }
    }
  `}</style>
</section>

        


        {/* ══════════ PROJECTS ══════════ */}
      <section
  id="projects"
  className="relative z-10 px-5 py-16 md:px-10 lg:px-[60px] lg:py-[100px]"
>
  <style>{`
    .projects-wrap {
      max-width: 1200px;
      margin: auto;
      text-align: center;
    }

    .projects-title {
      font-size: clamp(2rem,3.5vw,3rem);
      color: #fff;
      font-weight: 700;
      margin-bottom: 50px;
    }

    .zigzag-wrap {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 30px;
      align-items: center;
    }

    .col {
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    .left { transform: translateY(-40px); }
    .right { transform: translateY(40px); }
    .center { transform: scale(1.08); z-index: 2; }

    .project-card {
      border-radius: 18px;
      overflow: hidden;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      backdrop-filter: blur(12px);
      transition: 0.4s ease;
      cursor: pointer;
      position: relative;
    }

    .project-img {
      height: 180px;
      overflow: hidden;
      position: relative;
    }

    .project-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease, filter 0.4s ease;
    }

    .project-card:hover img {
      transform: scale(1.15) rotate(2deg);
      filter: brightness(1.2);
    }

    .project-img::after {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 60%;
      height: 100%;
      background: linear-gradient(120deg,transparent,rgba(255,255,255,0.5),transparent);
      transform: skewX(-20deg);
    }

    .project-card:hover .project-img::after {
      animation: shine 0.9s forwards;
    }

    @keyframes shine {
      100% { left: 140%; }
    }

    /* LIVE BADGE */
    .live-badge {
      position: absolute;
      top: 10px;
      left: 10px;
      padding: 5px 10px;
      font-size: 10px;
      font-weight: 600;
      color: #fff;
      background: linear-gradient(135deg,#22c55e,#4ade80);
      border-radius: 20px;
      box-shadow: 0 0 10px rgba(34,197,94,0.6);
      display: flex;
      align-items: center;
      gap: 5px;
      animation: pulseLive 1.5s infinite;
      z-index: 2;
    }

    .live-dot {
      width: 6px;
      height: 6px;
      background: #fff;
      border-radius: 50%;
      box-shadow: 0 0 8px #fff;
    }

    @keyframes pulseLive {
      0% { box-shadow: 0 0 10px rgba(34,197,94,0.6); }
      50% { box-shadow: 0 0 20px rgba(34,197,94,1); }
      100% { box-shadow: 0 0 10px rgba(34,197,94,0.6); }
    }

    .project-card:hover {
      transform: translateY(-12px) scale(1.04);
      box-shadow: 0 0 25px rgba(99,102,241,0.4),
                  0 0 50px rgba(34,211,238,0.2);
    }

    .project-content {
      padding: 16px;
      text-align: left;
    }

    .project-title {
      color: #fff;
      font-size: 16px;
      font-weight: 600;
    }

    /* 💎 EXTRA LINE */
    .project-line {
      font-size: 11px;
      color: rgba(255,255,255,0.45);
      margin-top: 4px;
      letter-spacing: 0.04em;
    }

    .btn {
      margin-top: 10px;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 11px;
      color: #fff;
      border: 1px solid rgba(255,255,255,0.2);
      text-decoration: none;
      transition: 0.3s;
      display: inline-block;
    }

    .btn:hover {
      background: linear-gradient(135deg,#6366f1,#22d3ee);
      box-shadow: 0 0 10px rgba(99,102,241,0.6);
    }

    @media(max-width:900px){
      .zigzag-wrap {
        grid-template-columns: 1fr;
      }
      .left,.right,.center { transform:none; }
    }
  `}</style>

  <div className="projects-wrap">
    <h2 className="projects-title">
      Featured <span className="shimmer-text">Projects</span>
    </h2>

    <div className="zigzag-wrap grid grid-cols-1 lg:grid-cols-3 gap-7 items-center">

      {/* LEFT */}
      <div className="col left">

        <div className="project-card">
          <div className="project-img">
            <img src={image1} alt="Project 1" />
          </div>
          <div className="project-content">
            <h3 className="project-title">Gemini Clone 🤖</h3>
            <p className="project-line">AI UI • Chat System • API Based</p>
            <a href="https://clonegemini-mu.vercel.app/" target="_blank" className="btn">View</a>
          </div>
        </div>

        <div className="project-card">
          <div className="project-img">
            <img src={image2} alt="Project 2" />
          </div>
          <div className="project-content">
            <h3 className="project-title">Netflix Clone 🎬</h3>
            <p className="project-line">Streaming UI • Responsive • Clone</p>
            <a href="https://netflixclone-five-beta.vercel.app/" target="_blank" className="btn">View</a>
          </div>
        </div>

      </div>

      {/* CENTER */}
      <div className="col center">
        <div className="project-card">
          <div className="project-img">
            <span className="live-badge">
              <span className="live-dot"></span> LIVE
            </span>
            <img src={image3} alt="Project 3" />
          </div>
          <div className="project-content">
            <h3 className="project-title">One Axis 🚀</h3>
            <p className="project-line">Live Project • Hiring Platform • Production</p>
            <a href="https://www.oneaxissolutions.com/" target="_blank" className="btn">Visit</a>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="col right">

        <div className="project-card">
          <div className="project-img">
            <span className="live-badge">
              <span className="live-dot"></span> LIVE
            </span>
            <img src={image4} alt="Project 4" />
          </div>
          <div className="project-content">
            <h3 className="project-title">SnapCharge ⚡</h3>
            <p className="project-line">Live Project • EV Tech • Real-time</p>
            <a href="https://www.snapchargee.in/" target="_blank" className="btn">Visit</a>
          </div>
        </div>

        <div className="project-card">
          <div className="project-img">
            <img src={image3} alt="Project 4" />
          </div>
          <div className="project-content">
            <h3 className="project-title">Portfolio 💎</h3>
            <p className="project-line">Personal Site • Animations • UI Design</p>
            <a href="https://portfolio-five-tan-20.vercel.app/" target="_blank" className="btn">View</a>
          </div>
        </div>

      </div>

    </div>
  </div>
</section>

        {/* ══════════ CERTIFICATIONS ══════════ */}
        <section
  id="certifications"
  className="relative z-10 px-5 py-14 md:px-10 lg:px-20 lg:py-[60px]"
>
          <div style={{ maxWidth:1000, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:48 }}>
              <p style={{ fontSize:11, textTransform:"uppercase", letterSpacing:".12em", color:"#fbbf24", marginBottom:10 }}>Achievements</p>
              <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(2rem,3.5vw,3rem)", fontWeight:700, color:"#fff" }}>
                Certifications & <span className="shimmer-text">Internships</span>
              </h2>
            </div>

            {/* Internship highlight */}
          <section style={{ padding: "10px 40px" }}>
  <style>{`

    .certs {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      max-width: 1000px;
      margin: auto;
    }

    @media (max-width: 900px) {
      .certs {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 600px) {
      .certs {
        grid-template-columns: 1fr;
      }

      section {
        padding: 20px !important;
      }
    }

    .cert {
      padding: 18px;
      border-radius: 16px;
      background: linear-gradient(135deg, rgba(99,102,241,.18), rgba(34,211,238,.12));
      border: 1px solid rgba(99,102,241,.3);
      backdrop-filter: blur(18px);
      position: relative;
      overflow: visible; /* ✅ FIX */
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .cert::before {
      content: "";
      position: absolute;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle,#6366f1,transparent);
      opacity: 0.15;
      animation: rotateGlow 8s linear infinite;
      z-index: -1; /* ✅ FIX */
    }

    @keyframes rotateGlow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .content {
      position: relative;
      z-index: 2;
    }

    .cert h4 {
      color: #fff;
      font-size: 15px;
    }

    .cert p {
      font-size: 13px;
      color: rgba(255,255,255,.7);
      margin-top: 5px;
      line-height: 1.5;
    }

    .btn {
      margin-top: 10px;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      color: #fff;
      border: 1px solid rgba(255,255,255,0.2);
      text-decoration: none;
      width: fit-content;
      z-index: 2;
      position: relative;
    }

  `}</style>

  <div className="certs">

   <div className="cert">
  <div className="content">
    <h4>🤖 AI Virtual Internship</h4>
    <p>SKILLRAAce · May–June 2024</p>
    <p>Worked on AI basics, ML concepts and real-world use cases with hands-on practice.</p>
  </div>

  <a
    href="/Skill.pdf"
    target="_blank"
    rel="noopener noreferrer"
    className="btn"
  >
    View ↗
  </a>
</div>

  <div className="cert">
  <div className="content">
    <h4>BuildwithIndia</h4>
    <p>Top 100 Teams</p>
    <p>Built innovative project and competed among 25,000+ participants nationwide.</p>
  </div>

  <a
    href="/Build.pdf"
    target="_blank"
    rel="noopener noreferrer"
    className="btn"
  >
    View ↗
  </a>
</div>
<div className="cert">
  <div className="content">
    <h4>Google AI</h4>
    <p>Coursera</p>
    <p>Learned generative AI, prompt engineering and real-world AI tools usage.</p>
  </div>

  <a href="/Google.pdf" target="_blank" className="btn">
    View
  </a>
</div>

   <div className="cert">
  <div className="content">
    <h4>IBM Web Dev</h4>
    <p>Frontend</p>
    <p>Strong foundation in HTML, CSS, JS and responsive UI development.</p>
  </div>

  <a
    href="/web.pdf"
    target="_blank"
    rel="noopener noreferrer"
    className="btn"
  >
    View ↗
  </a>
</div>

   <div className="cert">
  <div className="content">
    <h4>IBM Skills</h4>
    <p>Soft Skills</p>
    <p>Improved communication, teamwork and professional skills.</p>
  </div>

  <a
    href="/soft.pdf"
    target="_blank"
    rel="noopener noreferrer"
    className="btn"
  >
    View ↗
  </a>
</div>

</div>

</section>
    

          
            {/* Education */}

          </div>
        </section>
        <section style={{ padding: "80px 20px" }}>

 <style>{`

  .eduX-sec {
    position: relative;
    max-width: 1000px;
    margin: auto;
    color: #fff;
  }

  .eduX-line {
    position: absolute;
    left: 50%;
    top: 0;
    width: 3px;
    height: 100%;
    transform: translateX(-50%);
    background: rgba(255,255,255,0.08);
    overflow: hidden;
  }

  .eduX-line::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 120px;
    background: linear-gradient(to bottom, transparent, #a855f7, transparent);
    animation: eduX-travel 5s linear infinite;
  }

  @keyframes eduX-travel {
    0% { top: -120px; }
    100% { top: 100%; }
  }

  .eduX-item {
    position: relative;
    width: 50%;
    padding: 50px 30px;
    background: rgba(30,41,59,0.85);
    border-radius: 28px;
    margin-bottom: 35px;
  }

  .eduX-left {
    text-align: right;
  }

  .eduX-right {
    margin-left: 50%;
    text-align: left;
  }

  .eduX-node {
    position: absolute;
    top: 50%;
    left: 100%;
    transform: translate(-50%, -50%);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #666;
    z-index: 5;
  }

  .eduX-right .eduX-node {
    left: 0%;
  }

  .eduX-title {
    font-size: 18px;
    font-weight: 700;
    transition: 0.3s;
  }

  .eduX-desc {
    font-size: 13px;
    color: rgba(255,255,255,0.75);
    margin-top: 10px;
    line-height: 1.7;
  }

  .eduX-item1 .eduX-title { animation: eduX-glow 5s infinite; }
  .eduX-item2 .eduX-title { animation: eduX-glow 5s infinite 1.6s; }
  .eduX-item3 .eduX-title { animation: eduX-glow 5s infinite 3.2s; }

  .eduX-item1 .eduX-node { animation: eduX-nodeGlow 5s infinite; }
  .eduX-item2 .eduX-node { animation: eduX-nodeGlow 5s infinite 1.6s; }
  .eduX-item3 .eduX-node { animation: eduX-nodeGlow 5s infinite 3.2s; }

  @keyframes eduX-glow {
    0%,100% { color:#fff; text-shadow:none; }
    20% {
      color:#a855f7;
      text-shadow: 0 0 14px #a855f7, 0 0 28px #22d3ee;
    }
    40% { color:#fff; }
  }

  @keyframes eduX-nodeGlow {
    0%,100% { background:#666; }
    20% {
      background:#a855f7;
      box-shadow: 0 0 18px #a855f7;
    }
  }

  @media(max-width:700px) {
    .eduX-sec {
      max-width: 100%;
      padding-left: 25px;
    }

    .eduX-line {
      left: 10px;
      transform: none;
    }

    .eduX-item {
      width: 100% !important;
      margin-left: 0 !important;
      padding: 24px 18px 24px 32px !important;
      text-align: left !important;
      margin-bottom: 28px;
    }

    .eduX-node {
      left: -15px !important;
    }

    .eduX-title {
      font-size: 16px;
      line-height: 1.4;
    }

    .eduX-desc {
      font-size: 12.5px;
      line-height: 1.6;
    }
  }

`}</style>

  <h2 style={{
    textAlign:"center",
    fontSize:34,
    fontWeight:800,
    marginBottom:60,
    background:"linear-gradient(90deg,#6366f1,#a855f7,#22d3ee)",
    WebkitBackgroundClip:"text",
    WebkitTextFillColor:"transparent"
  }}>
    🎓 Education 
  </h2>

  <div className="eduX-sec">

    <div className="eduX-line"></div>

    {/* 10th */}
    <div className="eduX-item eduX-left eduX-item1 w-20px bg-slate-700 rounded-4xl right-1">
      <div className="eduX-node"></div>
      <div className="eduX-title">📗 10th – 88% (CBSE)</div>
      <div className="eduX-desc">
        Completed 
        </div>
      <div className="eduX-desc">
        Built a strong academic foundation with focus on Mathematics and Science.  
        Developed discipline, consistency, and a structured approach to learning.  
        This phase sparked my curiosity towards technology and problem-solving.
      </div>
    </div>

    {/* 12th */}
    <div className="eduX-item eduX-right eduX-item2 bg-slate-700 rounded-4xl left-1">
      <div className="eduX-node"></div>
      <div className="eduX-title">📘 12th – Non-Medical (72%) (CBSE)</div>
      <div className="eduX-desc">completed</div>
      <div className="eduX-desc">
        Studied Physics, Chemistry, and Mathematics with deep focus.  
        Improved logical reasoning, analytical thinking, and real-world problem-solving ability.  
        This stage built the base for entering the technical and development field.
      </div>
    </div>

    {/* BCA */}
    <div className="eduX-item eduX-left eduX-item3" style={{ paddingBottom: "80px" }}>
      <div className="eduX-node"></div>
      <div className="eduX-title">🎓 BCA – Result Awaited</div>
      <div className="eduX-desc">
        Completed Bachelor of Computer Applications with a strong focus on full-stack development.  
        Worked on multiple real-world projects using React.js, Node.js, MongoDB, and REST APIs.  
        Gained practical experience in UI/UX design, performance optimization, and modern web technologies.

        <br /><br />
        <span style={{
          padding:"6px 14px",
          borderRadius:20,
          background:"linear-gradient(90deg,#a855f7,#22d3ee)",
          boxShadow:"0 0 12px #a855f7"
        }}>
          7.23 CGPA
        </span>
      </div>
    </div>

  </div>

</section>

        {/* ══════════ CONTACT ══════════ */}
       

    
    <section id="contact" style={{ padding: "70px 20px" }}>

<style>{`

.contact-cardX {
  max-width: 700px;
  margin: auto;
  border-radius: 16px;
  overflow: hidden;
  background: #111;
  border: 1px solid #222;
}

/* HEADER */
.contact-headerX {
  padding: 25px;
  text-align: center;
  border-bottom: 1px solid #222;
}

.contact-headerX h2 {
  margin: 10px 0;
  color: #fff;
  display: flex;
  justify-content: center;
  gap: 10px;
}

/* ARROW */
.arrowX {
  transition: 0.3s;
}

.contact-cardX.active .arrowX {
  transform: rotate(180deg);
}

/* BODY */
.contact-bodyX {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: 0.4s;
  padding: 0 25px;
}

.contact-cardX.active .contact-bodyX {
  max-height: 1000px;
  opacity: 1;
  padding: 25px;
}

/* GRID */
.contact-gridX {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 15px;
}

.contact-itemX {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  background: #1a1a1a;
  text-decoration: none;
  color: #ddd;
}

.contact-itemX:hover {
  background: #222;
}

.contact-itemX svg {
  color: #4f46e5;
}

/* BUTTON */
.contact-btnX {
  margin-top: 10px;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  background: #4f46e5;
  color: white;
  cursor: pointer;
}

/* FORM */
.contact-formX {
  display: none;
  margin-top: 15px;
  flex-direction: column;
  gap: 10px;
}

.showForm {
  display: flex;
}

.contact-formX input,
.contact-formX textarea {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #333;
  background: #111;
  color: white;
}

#successMsg {
  margin-top: 10px;
  color: #22c55e;
}

`}</style>

<div className="contact-cardX" id="cardX">

  {/* HEADER */}
  <div className="contact-headerX">
    <p style={{ color:"#888" }}>Let's connect</p>

    <h2>
      Get In Touch 
      <span className="arrowX">⬇️</span>
    </h2>

    {/* ✅ BUTTON HERE */}
    <button
      className="contact-btnX"
      onClick={()=>{
        document.getElementById("cardX").classList.toggle("active");
      }}
    >
      Open Contact
    </button>
  </div>

  {/* BODY */}
  <div className="contact-bodyX">

    <p style={{ color:"#aaa" }}>
      I’m actively looking for opportunities as a Full Stack Developer.
    </p>

    <div className="contact-gridX">

      <a href="tel:9015963951" className="contact-itemX">
        <FaPhoneAlt />
        <span>Call Me</span>
      </a>

      <a href="mailto:gunika463@gmail.com" className="contact-itemX">
        <FaEnvelope />
        <span>Email Me</span>
      </a>

      <a href="https://github.com/gunika1" target="_blank" rel="noreferrer" className="contact-itemX">
        <FaGithub />
        <span>GitHub</span>
      </a>

      <a href="https://linkedin.com/in/gunika-thakur-web" target="_blank" rel="noreferrer" className="contact-itemX">
        <FaLinkedin />
        <span>LinkedIn</span>
      </a>

    </div>

    {/* FORM BUTTON */}
    <button
      className="contact-btnX"
      onClick={()=>{
        document.getElementById("formX").classList.toggle("showForm");
      }}
    >
      Send Message
    </button>

    {/* FORM */}
    <form
      id="formX"
      className="contact-formX"
      onSubmit={async (e)=>{
        e.preventDefault();

        const formData = new FormData(e.target);

        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData
        });

        const data = await res.json();

        if(data.success){
          document.getElementById("successMsg").style.display = "block";
          e.target.reset();

          setTimeout(()=>{
            document.getElementById("successMsg").style.display = "none";
          }, 3000);
        }
      }}
    >
      <input type="hidden" name="access_key" value="7e8d63fc-b3f8-4cb9-a9bf-224343dc95b3" />

      <input type="text" name="name" placeholder="Your Name" required />
      <input type="email" name="email" placeholder="Your Email" required />
      <input type="text" name="subject" placeholder="Subject" required />
      <textarea name="message" placeholder="Your Message" required />

      <button type="submit" className="contact-btnX">
        Send Message
      </button>
    </form>

    <div id="successMsg" style={{ display:"none" }}>
      ✅ Message Sent Successfully!
    </div>

  </div>

</div>

</section>
           
                

        {/* FOOTER */}
       
      </div>
    </>
  );
}