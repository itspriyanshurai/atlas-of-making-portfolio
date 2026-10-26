import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls, Float, Sparkles, Html, Environment, Trail } from "@react-three/drei";
import * as THREE from "three";
import { ArrowDownRight, ArrowUpRight, Mail, Menu, X, Orbit, Network, Terminal, Rocket, ExternalLink, Cpu, Cloud, Activity, Volume2, VolumeX, RotateCcw, Code2 } from "lucide-react";
import "./style.css";

const projects = [
  {
    id:"voicepilot", number:"01", title:"VoicePilot AI", type:"AI / REAL-TIME VOICE",
    short:"A voice-agent experiment bringing speech recognition, an LLM, and real-time conversation into one system.",
    problem:"How do you connect speech recognition, reasoning, and spoken responses into a conversation that feels immediate?",
    details:"A Python and LiveKit agent experiment using speech-to-text, a language model, and voice activity detection. Update the implementation notes to match the current repository before publishing.",
    stack:["Python","LiveKit","STT","LLM"], repo:"https://github.com/itspriyanshurai/voicepilot-ai", color:"#ffad78", planet:0.78, size:0.62, status:"EXPERIMENT"
  },
  {
    id:"clouddeploy", number:"02", title:"CloudDeploy CI/CD", type:"CLOUD / DELIVERY",
    short:"An automated deployment workflow connecting source control to AWS infrastructure.",
    problem:"How can a code change become a repeatable deployment instead of a manual checklist?",
    details:"GitHub Actions, AWS credential configuration, S3 artifact sync, EC2 deployment through Systems Manager, and IAM permissions. Never publish access keys or secrets.",
    stack:["AWS","GitHub Actions","S3","EC2"], color:"#9edcff", planet:2.35, size:0.72, status:"CLOUD SYSTEM"
  },
  {
    id:"hotel", number:"03", title:"Hotel Management System", type:"WEB / PRODUCT",
    short:"A modern web application concept connecting a Next.js interface to a persistent data layer.",
    problem:"How can hotel workflows be represented in a straightforward web application?",
    details:"Next.js frontend, Prisma data access, and SQLite persistence. Add verified screenshots and implemented feature details before publishing.",
    stack:["Next.js","Prisma","SQLite"], color:"#c6b4ff", planet:3.65, size:0.65, status:"APPLICATION"
  },
  {
    id:"retail", number:"04", title:"Retail Analytics", type:"DATA / CUSTOMER INSIGHT",
    short:"RFM customer segmentation and churn analysis using transaction-level retail data.",
    problem:"What can transaction history reveal about customer value and potential inactivity?",
    details:"Data cleaning, revenue calculations, Recency/Frequency/Monetary features, logistic regression, random forest, model comparison, and feature importance. Present metrics accurately.",
    stack:["R","RFM","Random Forest","Analytics"], color:"#d7f58a", planet:4.65, size:0.53, status:"DATA STUDY"
  },
  {
    id:"gamehive", number:"05", title:"GameHive", type:"WEB / GAMING",
    short:"A gaming-focused website concept designed around discovery and browsing.",
    problem:"How can a gaming site make discovering content engaging and intuitive?",
    details:"Use this project to demonstrate interface hierarchy, reusable components, and responsive behavior. Replace this description with verified features from your implementation.",
    stack:["Frontend","UI/UX","Web"], color:"#ff8eae", planet:5.55, size:0.48, status:"WEB EXPERIMENT"
  },
  {
    id:"promap", number:"06", title:"ProMap", type:"FULL STACK / WEB",
    short:"A full-stack project using a React interface and a Node.js/MongoDB backend.",
    problem:"How can a frontend experience connect to server routes and persistent data?",
    details:"React UI, Node.js APIs, MongoDB data modeling, and CRUD workflows where implemented. Add screenshots and repository links.",
    stack:["React","Node.js","MongoDB"], color:"#ffcf83", planet:1.42, size:0.5, status:"FULL STACK"
  }
];

const contact = {
  email: "priyanshurai0211@gmail.com",
  phone: "+919823369865",
  github: "https://github.com/itspriyanshurai",
  githubVoicePilot: "https://github.com/itspriyanshurai/voicepilot-ai",
  githubJarvis: "https://github.com/itspriyanshurai/Jarvis-AI-Agent"
};

const PLANET_TEXTURES = {
  mars: "https://www.solarsystemscope.com/textures/download/2k_mars.jpg",
  jupiter: "https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg",
  saturn: "https://www.solarsystemscope.com/textures/download/2k_saturn.jpg",
  venus: "https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg",
  neptune: "https://www.solarsystemscope.com/textures/download/2k_neptune.jpg",
  uranus: "https://www.solarsystemscope.com/textures/download/2k_uranus.jpg",
  earth: "https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg",
  earthClouds: "https://www.solarsystemscope.com/textures/download/2k_earth_clouds.jpg",
  saturnRings: "https://www.solarsystemscope.com/textures/download/2k_saturn_ring_alpha.png"
};

function usePlanetTexture(url) {
  const [texture, setTexture] = useState(null);
  useEffect(() => {
    let active = true;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(url, (loaded) => {
      if (!active) { loaded.dispose(); return; }
      loaded.colorSpace = THREE.SRGBColorSpace;
      loaded.anisotropy = 8;
      loaded.needsUpdate = true;
      setTexture(loaded);
    }, undefined, () => {
      // Keep the coloured fallback material if the remote texture is unavailable.
      console.warn(`Planet texture could not be loaded: ${url}`);
    });
    return () => { active = false; };
  }, [url]);
  return texture;
}

const PROJECT_PLANET = {
  voicepilot: "venus",
  clouddeploy: "jupiter",
  hotel: "uranus",
  retail: "mars",
  gamehive: "neptune",
  promap: "saturn"
};

function SaturnRings({ size }) {
  const rings = usePlanetTexture(PLANET_TEXTURES.saturnRings);
  return <group rotation={[Math.PI / 2.35, 0.08, 0.16]}>
    <mesh>
      <ringGeometry args={[size * 1.18, size * 1.9, 128]} />
      <meshStandardMaterial map={rings || null} color="#d8c7a4" transparent opacity={0.88} side={THREE.DoubleSide} roughness={1} depthWrite={false} />
    </mesh>
    <mesh>
      <ringGeometry args={[size * 1.43, size * 1.55, 128]} />
      <meshBasicMaterial color="#f0e2c7" transparent opacity={0.32} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  </group>;
}

function Planet({ project, index, selected, onSelect }) {
  const group = useRef();
  const mesh = useRef();
  const angle = project.planet;
  const radius = 2.15 + (index % 3) * 0.65;
  const y = ((index % 3) - 1) * 0.42;
  const body = PROJECT_PLANET[project.id] || "mars";
  const texture = usePlanetTexture(PLANET_TEXTURES[body]);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime * (0.10 + index * 0.008) + angle;
    group.current.position.set(Math.cos(t) * radius, y + Math.sin(t * 1.5) * 0.13, Math.sin(t) * radius);
    group.current.rotation.y += 0.002 + index * 0.00015;
    const target = selected ? 1.18 : 1;
    const scale = THREE.MathUtils.lerp(group.current.scale.x, target, 0.08);
    group.current.scale.setScalar(scale);
    if (mesh.current && mesh.current.material) mesh.current.material.emissiveIntensity = selected ? 0.48 : 0.12;
  });
  const color = project.color;
  return (
    <group ref={group}>
      <mesh ref={mesh} onClick={(e) => { e.stopPropagation(); onSelect(project.id); }} onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }} onPointerOut={() => { document.body.style.cursor = "auto"; }}>
        <sphereGeometry args={[project.size, 64, 64]} />
        <meshStandardMaterial map={texture || null} color={texture ? "#ffffff" : color} roughness={0.88} metalness={0.03} emissive={color} emissiveIntensity={0.12} />
      </mesh>
      <mesh scale={project.size * 1.1}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial color={body === "earth" ? "#7bcfff" : color} transparent opacity={selected ? 0.12 : 0.045} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      {body === "saturn" && <SaturnRings size={project.size} />}
      {selected && <Html distanceFactor={10} position={[0, project.size + 0.35, 0]} center>
        <div className="planet-label-3d">{project.title}</div>
      </Html>}
    </group>
  );
}

function EarthGlobe() {
  const earth = usePlanetTexture(PLANET_TEXTURES.earth);
  const clouds = usePlanetTexture(PLANET_TEXTURES.earthClouds);
  const cloudRef = useRef();
  useFrame(({ clock }) => {
    if (cloudRef.current) cloudRef.current.rotation.y = clock.elapsedTime * 0.018;
  });
  return <group>
    <mesh>
      <sphereGeometry args={[1.22, 96, 96]} />
      <meshStandardMaterial map={earth || null} color={earth ? "#ffffff" : "#287aa5"} roughness={0.86} metalness={0.02} />
    </mesh>
    {clouds && <mesh ref={cloudRef} scale={1.008}>
      <sphereGeometry args={[1.22, 96, 96]} />
      <meshStandardMaterial map={clouds} transparent opacity={0.23} roughness={1} depthWrite={false} />
    </mesh>}
    <mesh scale={1.055}>
      <sphereGeometry args={[1.22, 64, 64]} />
      <meshBasicMaterial color="#62c7ff" transparent opacity={0.075} side={THREE.BackSide} depthWrite={false} />
    </mesh>
  </group>;
}


function CosmicWarp() {
  const pointsRef = useRef();
  const streaksRef = useRef();
  const count = 520;
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 4 + Math.random() * 15;
      const angle = Math.random() * Math.PI * 2;
      a[i * 3] = Math.cos(angle) * radius;
      a[i * 3 + 1] = (Math.random() - .5) * 13;
      a[i * 3 + 2] = (Math.random() - .5) * 28;
    }
    return a;
  }, []);
  const streakPositions = useMemo(() => {
    const a = new Float32Array(72 * 2 * 3);
    for (let i = 0; i < 72; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 5 + Math.random() * 13;
      const y = (Math.random() - .5) * 12;
      a[i * 6] = Math.cos(angle) * r;
      a[i * 6 + 1] = y;
      a[i * 6 + 2] = -14 + Math.random() * 28;
      a[i * 6 + 3] = Math.cos(angle) * (r + .12);
      a[i * 6 + 4] = y;
      a[i * 6 + 5] = a[i * 6 + 2] - .6 - Math.random() * 2.4;
    }
    return a;
  }, []);
  useFrame((state, delta) => {
    if (pointsRef.current) {
      const attr = pointsRef.current.geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        attr.array[i * 3 + 2] += delta * (1.6 + (i % 7) * .25);
        if (attr.array[i * 3 + 2] > 15) attr.array[i * 3 + 2] = -15;
      }
      attr.needsUpdate = true;
      pointsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * .08) * .035;
    }
    if (streaksRef.current) {
      streaksRef.current.rotation.z = state.clock.elapsedTime * -.012;
      streaksRef.current.material.opacity = .22 + (Math.sin(state.clock.elapsedTime * 2.2) + 1) * .12;
    }
  });
  return <group>
    <points ref={pointsRef}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color="#9edcff" size={.035} transparent opacity={.72} sizeAttenuation depthWrite={false} />
    </points>
    <lineSegments ref={streaksRef}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[streakPositions, 3]} /></bufferGeometry>
      <lineBasicMaterial color="#8fdcff" transparent opacity={.3} depthWrite={false} />
    </lineSegments>
  </group>;
}

function EnergyRings({ selected }) {
  const rings = useRef([]);
  useFrame(({ clock }) => {
    rings.current.forEach((ring, i) => {
      if (!ring) return;
      ring.rotation.x = 1.04 + Math.sin(clock.elapsedTime * .28 + i) * .12;
      ring.rotation.y = clock.elapsedTime * (.11 + i * .025) * (i % 2 ? -1 : 1);
      ring.scale.setScalar(1 + ((clock.elapsedTime * .22 + i * .33) % 1) * .32);
      ring.material.opacity = .08 + (1 - ((clock.elapsedTime * .22 + i * .33) % 1)) * (selected ? .34 : .13);
    });
  });
  return <group>
    {[0,1,2].map(i => <mesh key={i} ref={el => rings.current[i] = el} rotation={[1.04, i * 1.8, i * .4]}>
      <torusGeometry args={[1.58 + i * .17, .009 + i * .002, 8, 180]} />
      <meshBasicMaterial color={i === 1 ? "#d7f58a" : "#7ad7ff"} transparent opacity={.2} depthWrite={false} />
    </mesh>)}
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.72, .003, 6, 180]} />
      <meshBasicMaterial color="#f5c8ff" transparent opacity={.22} />
    </mesh>
  </group>;
}

function CoreWorld({ selected, setSelected }) {
  const core = useRef();
  useFrame(({ clock, pointer }) => {
    if (!core.current) return;
    core.current.rotation.y = clock.elapsedTime * 0.08 + pointer.x * 0.12;
    core.current.rotation.x = Math.sin(clock.elapsedTime * 0.15) * 0.05 - pointer.y * 0.05;
  });
  return (
    <>
      <ambientLight intensity={0.38} />
      <pointLight position={[0, 0, 0]} intensity={25} color="#9edcff" distance={14} />
      <pointLight position={[-5, 4, -4]} intensity={11} color="#d7f58a" distance={18} />
      <pointLight position={[5, -3, 5]} intensity={10} color="#b9a0ff" distance={18} />
      <Stars radius={90} depth={45} count={3200} factor={3.4} saturation={0.5} fade speed={0.35} />
      <Sparkles count={260} scale={18} size={2.2} speed={0.65} color="#9edcff" opacity={0.62} />
      <CosmicWarp />
      <group ref={core}>
        <Float speed={0.35} rotationIntensity={0.035} floatIntensity={0.08}>
          <EarthGlobe />
          <EnergyRings selected={Boolean(selected)} />
          <mesh rotation={[0.7, 0.4, 0.2]} scale={1.39}>
            <torusGeometry args={[1, 0.004, 8, 160]} />
            <meshBasicMaterial color="#9edcff" transparent opacity={0.24} />
          </mesh>
        </Float>
      </group>
      {projects.map((p, i) => <Planet key={p.id} project={p} index={i} selected={selected === p.id} onSelect={setSelected} />)}
      <OrbitControls enablePan={false} minDistance={5.5} maxDistance={14} minPolarAngle={0.5} maxPolarAngle={2.55} rotateSpeed={0.42} zoomSpeed={0.65} />
    </>
  );
}

function Universe({ selected, setSelected }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className="universe-fallback"><div className="fallback-orbit"><span>AI</span><span>CLOUD</span><span>WEB</span><span>DATA</span></div><p>Interactive universe unavailable on this device. Explore the project list below.</p></div>;
  return <div className={`universe-canvas ${selected ? "has-selection" : "cosmic-live"}`} aria-label="Interactive 3D project universe">
    <Canvas camera={{ position: [0, 4.2, 10.5], fov: 45 }} dpr={[1, 1.65]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} onCreated={({ gl }) => { gl.setClearColor("#070a11", 0); }} fallback={<div className="universe-fallback">3D view unavailable</div>}>
      <Suspense fallback={null}><CoreWorld selected={selected} setSelected={setSelected} /></Suspense>
    </Canvas>
    <div className="universe-hud"><span><i className="live-dot"/> SYSTEM ONLINE</span><span>DRAG TO ORBIT · SCROLL TO ZOOM</span></div>
    <div className="universe-reticle" aria-hidden="true">+</div>
    <div className="warp-flash" aria-hidden="true" />
    <div className="cosmic-corner cosmic-corner-a" aria-hidden="true">ATLAS / DEEP SPACE</div>
    <div className="cosmic-corner cosmic-corner-b" aria-hidden="true">LIVE SYSTEM · 06 WORLDS</div>
  </div>;
}


function ProjectPreview({ id }) {
  if (id === "voicepilot") return <div className="preview-ui voice-ui"><div className="preview-top"><span>VOICEPILOT / LIVE SESSION</span><i>● CONNECTED</i></div><div className="voice-orb"><span>VP</span></div><div className="waveform">{Array.from({length:42},(_,i)=><i key={i} style={{"--h":`${12+Math.abs(Math.sin(i*.67)*58+Math.cos(i*.21)*18)}px`}} />)}</div><div className="preview-caption">LISTENING <b>·</b> UNDERSTANDING <b>·</b> RESPONDING</div></div>;
  if (id === "clouddeploy") return <div className="preview-ui cloud-ui"><div className="preview-top"><span>DEPLOYMENT / RUN #042</span><i>✓ PASSED</i></div><div className="cloud-flow">{[["01","SOURCE","GitHub"],["02","BUILD","Actions"],["03","ARTIFACT","Amazon S3"],["04","RELEASE","EC2 / SSM"]].map(([n,t,d])=><div className="cloud-step" key={n}><small>{n}</small><strong>{t}</strong><span>{d}</span></div>)}</div><div className="cloud-log"><b>✓</b> workflow completed <span>02m 14s</span></div></div>;
  if (id === "hotel") return <div className="preview-ui hotel-ui"><div className="hotel-sidebar"><b>STAY /</b><span>Overview</span><span>Reservations</span><span>Rooms</span><span>Guests</span></div><div className="hotel-main"><div className="hotel-greeting">Good morning, Alex <span>⌁</span></div><div className="hotel-metrics"><div><small>OCCUPANCY</small><b>82%</b><i>↗ 8.4%</i></div><div><small>CHECK-INS</small><b>24</b><i>Today</i></div><div><small>REVENUE</small><b>₹48k</b><i>Today</i></div></div><div className="hotel-chart"><span style={{height:'34%'}}/><span style={{height:'58%'}}/><span style={{height:'46%'}}/><span style={{height:'78%'}}/><span style={{height:'61%'}}/><span style={{height:'91%'}}/><span style={{height:'70%'}}/><span style={{height:'100%'}}/><span style={{height:'83%'}}/></div></div></div>;
  if (id === "retail") return <div className="preview-ui retail-ui"><div className="preview-top"><span>CUSTOMER INTELLIGENCE / Q4</span><i>RFM ANALYSIS</i></div><div className="retail-metrics"><div><small>CUSTOMERS</small><b>4,338</b></div><div><small>SEGMENTS</small><b>5</b></div><div><small>MODEL</small><b>RF</b></div></div><div className="retail-chart"><div className="retail-bars">{[38,66,47,82,59,94,71,53,88,62,100,76,45,68].map((h,i)=><i key={i} style={{height:`${h}%`}} />)}</div><div className="retail-legend"><span><i/> Recency</span><span><i/> Frequency</span><span><i/> Monetary</span></div></div></div>;
  if (id === "gamehive") return <div className="preview-ui game-ui"><div className="preview-top"><span>GAMEHIVE / DISCOVER</span><i>PLAYER 01</i></div><div className="game-feature"><div className="game-sun"/><div className="game-copy"><small>FEATURED WORLD</small><b>Beyond<br/>the grid.</b><span>EXPLORE COLLECTION ↗</span></div><div className="game-rings"/></div><div className="game-library"><div/><div/><div/><div/></div></div>;
  return <div className="preview-ui promap-ui"><div className="preview-top"><span>PROMAP / NETWORK VIEW</span><i>LIVE MAP</i></div><div className="map-art"><svg viewBox="0 0 520 180" aria-hidden="true"><path d="M15 125 C90 10 130 170 220 85 S360 20 500 115 M45 25 C130 70 170 25 260 135 S400 155 485 35 M70 170 C150 120 180 145 285 45 S400 65 460 155" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 7"/><g fill="#d7f58a"><circle cx="15" cy="125" r="5"/><circle cx="220" cy="85" r="6"/><circle cx="500" cy="115" r="5"/><circle cx="260" cy="135" r="4"/><circle cx="285" cy="45" r="5"/></g><g fill="#9edcff"><circle cx="130" cy="70" r="4"/><circle cx="400" cy="65" r="4"/><circle cx="70" cy="170" r="4"/></g></svg><span className="map-pin pin-a">YOUR LOCATION</span><span className="map-pin pin-b">NODE / 04</span><span className="map-pin pin-c">CONNECTED</span></div><div className="map-status"><span>● API ONLINE</span><span>REACT · NODE · MONGODB</span></div></div>;
}

function ProjectWorld({ project, onClose }) {
  const [tab, setTab] = useState("experience");
  const [deployState, setDeployState] = useState("idle");
  const [stage, setStage] = useState(-1);
  const [expanded, setExpanded] = useState(false);
  const pipeline = ["COMMIT", "BUILD", "TEST", "PACKAGE", "DEPLOY"];
  useEffect(() => { setTab("experience"); setDeployState("idle"); setStage(-1); setExpanded(false); }, [project?.id]);
  useEffect(() => {
    if (deployState !== "running") return;
    if (stage >= pipeline.length - 1) { setDeployState("success"); return; }
    const timer = setTimeout(() => setStage(s => s + 1), 620);
    return () => clearTimeout(timer);
  }, [deployState, stage]);
  if (!project) return null;
  return <div className="world-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <section className="project-world" role="dialog" aria-modal="true" aria-labelledby="world-title">
      <header className="world-header">
        <div className="world-mark"><span style={{background:project.color}}/>{project.number} / FIELD WORLD</div>
        <button className="icon-button" onClick={onClose} aria-label="Close project world"><X size={18}/></button>
      </header>
      <div className="world-hero" style={{"--world-color":project.color}}>
        <div className="world-preview"><ProjectPreview id={project.id}/></div>
        <div className="world-title-block"><div className="eyebrow">{project.type}</div><h2 id="world-title">{project.title}</h2><p>{project.short}</p></div>
      </div>
      <div className="world-tabs" role="tablist" aria-label="Project views">
        <button role="tab" aria-selected={tab==="experience"} className={tab==="experience"?"active":""} onClick={()=>setTab("experience")}>Experience</button>
        <button role="tab" aria-selected={tab==="underhood"} className={tab==="underhood"?"active":""} onClick={()=>setTab("underhood")}>Under the hood</button>
        {project.id==="clouddeploy" && <button role="tab" aria-selected={tab==="lab"} className={tab==="lab"?"active":""} onClick={()=>setTab("lab")}>Pipeline lab <Rocket size={13}/></button>}
      </div>
      <div className="world-content">
        {tab==="experience" && <>
          <div className="world-kicker">THE QUESTION</div><h3>{project.problem}</h3><p>{project.details}</p>
          <div className="world-kicker spaced">TECHNOLOGY CONSTELLATION</div><div className="world-tags">{project.stack.map(t=><span key={t}>{t}</span>)}</div>
          <div className="world-footnote">PROJECT STATUS: {project.status} · VERIFY REPOSITORY DETAILS BEFORE PUBLISHING</div>
        </>}
        {tab==="underhood" && <>
          <div className="world-kicker">ENGINEERING NOTES</div><h3>From idea to implementation.</h3><p>{project.details}</p>
          <div className="underhood-grid"><div><Cpu/><strong>Design question</strong><span>{project.problem}</span></div><div><Network/><strong>System thinking</strong><span>Explore dependencies, interfaces, data flow, and failure points relevant to this project.</span></div><div><Activity/><strong>Honest status</strong><span>Only claim features, test results, and deployments that are verified in the actual project.</span></div></div>
          {project.id === "voicepilot" && <a className="outline-button repo-link" href={contact.githubVoicePilot} target="_blank" rel="noreferrer"><Code2 size={15}/> View VoicePilot repository <ArrowUpRight size={14}/></a>}
          {project.id === "gamehive" && <p className="repo-note">Repository link can be added when its public URL is confirmed.</p>}
          <button className="outline-button" onClick={()=>setExpanded(v=>!v)}>{expanded?"Hide architecture notes":"Reveal architecture notes"} <ArrowDownRight size={15}/></button>
          {expanded && <div className="architecture-note"><div className="arch-node">INPUT / USER ACTION</div><span>↓</span><div className="arch-node">APPLICATION / LOGIC</div><span>↓</span><div className="arch-node">DATA / SERVICE LAYER</div><span>↓</span><div className="arch-node">OUTPUT / OBSERVABLE RESULT</div><p>Illustrative architecture pattern. Replace with the exact architecture of this project before using it as a technical claim.</p></div>}
        </>}
        {tab==="lab" && project.id==="clouddeploy" && <>
          <div className="world-kicker">INTERACTIVE CI/CD SIMULATION</div><h3>Ship a change through the pipeline.</h3><p>This is a local simulation of a deployment workflow, not a real AWS deployment. Start it to see the sequence and what each stage means.</p>
          <div className="pipeline">
            {pipeline.map((s,i)=><React.Fragment key={s}><div className={`pipeline-stage ${i<stage?"done":i===stage&&deployState==="running"?"running":deployState==="success"&&i===pipeline.length-1?"done":""}`}><span>{i<stage||deployState==="success"&&i===pipeline.length-1?"✓":String(i+1).padStart(2,"0")}</span><strong>{s}</strong><small>{["Source update","Compile / bundle","Run checks","Store artifact","Publish release"][i]}</small></div>{i<pipeline.length-1&&<div className={`pipeline-link ${i<stage||deployState==="success"?"lit":""}`}/>}</React.Fragment>)}
          </div>
          <div className="pipeline-result" aria-live="polite">{deployState==="idle"?"READY · Awaiting simulated commit":deployState==="running"?`RUNNING · ${pipeline[Math.max(stage,0)]}`:deployState==="success"?"SIMULATION COMPLETE · All stages passed":""}</div>
          <div className="pipeline-actions"><button className="solid-button" disabled={deployState==="running"} onClick={()=>{setStage(0);setDeployState("running")}}><Rocket size={15}/> {deployState==="success"?"Run again":"Deploy simulation"}</button><button className="outline-button" onClick={()=>{setStage(-1);setDeployState("idle")}}><RotateCcw size={14}/> Reset</button></div>
        </>}
      </div>
    </section>
  </div>;
}

function App() {
  const [selected, setSelected] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [intro, setIntro] = useState(true);
  const [introDismissed, setIntroDismissed] = useState(false);
  const [explorer, setExplorer] = useState("ALL");
  const [graphSelected, setGraphSelected] = useState(null);
  const [toast, setToast] = useState("");
  const [sound, setSound] = useState(false);
  const [progress, setProgress] = useState(0);
  const activeProject = projects.find(p=>p.id===selected);
  const filteredProjects = explorer==="ALL"?projects:projects.filter(p=>p.stack.some(t=>t.toUpperCase().includes(explorer)) || p.type.includes(explorer));
  useEffect(()=>{const t=setTimeout(()=>{setIntro(false);setIntroDismissed(true)},2800);return()=>clearTimeout(t)},[]);
  useEffect(()=>{const onScroll=()=>{const max=document.documentElement.scrollHeight-innerHeight;setProgress(max>0?scrollY/max*100:0)};window.addEventListener("scroll",onScroll,{passive:true});onScroll();return()=>window.removeEventListener("scroll",onScroll)},[]);
  useEffect(()=>{
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reduced)return;
    const move=e=>{document.documentElement.style.setProperty("--pointer-x",`${e.clientX}px`);document.documentElement.style.setProperty("--pointer-y",`${e.clientY}px`);};
    window.addEventListener("pointermove",move,{passive:true});
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:"0px 0px -40px 0px"});
    document.querySelectorAll(".section-heading,.connection-layout,.project-card3d,.pipeline-lab,.maker-grid,.timeline>div,.contact-panel").forEach((el,i)=>{el.classList.add("reveal-on-scroll");el.style.setProperty("--reveal-delay",`${(i%4)*75}ms`);observer.observe(el)});
    return()=>{window.removeEventListener("pointermove",move);observer.disconnect()};
  },[]);
  useEffect(()=>{if(!activeProject)return;const onKey=e=>{if(e.key==="Escape")setSelected(null)};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey)},[activeProject]);
  useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(""),2300);return()=>clearTimeout(t)},[toast]);
  const openProject=id=>{setSelected(id);setMenuOpen(false)};
  return <>
    <div className="progress-track"><div style={{width:`${progress}%`}}/></div>
    <div className="grain" aria-hidden="true"/><div className="pointer-aurora" aria-hidden="true"/>
    {intro&&!introDismissed&&<div className="intro-screen"><div className="intro-orbit o1"/><div className="intro-orbit o2"/><div className="intro-copy"><span>PRIYANSHU RAI / INTERACTIVE PORTFOLIO</span><h1>ATLAS <em>OF MAKING</em></h1><div className="intro-load"><i/></div><small>PREPARING YOUR FIELD OF VIEW</small><button onClick={()=>{setIntro(false);setIntroDismissed(true)}}>ENTER ATLAS ↗</button></div></div>}
    <nav className="topbar">
      <a className="wordmark" href="#home"><span className="wordmark-icon">PR</span><span>ATLAS <i>OF MAKING</i></span></a>
      <button className="mobile-menu" onClick={()=>setMenuOpen(v=>!v)} aria-label={menuOpen?"Close navigation":"Open navigation"}>{menuOpen?<X size={18}/>:<Menu size={18}/>}</button>
      <div className={`nav-items ${menuOpen?"open":""}`}><a href="#universe" onClick={()=>setMenuOpen(false)}>Universe</a><a href="#connections" onClick={()=>setMenuOpen(false)}>Connections</a><a href="#projects" onClick={()=>setMenuOpen(false)}>Projects</a><a href="#maker" onClick={()=>setMenuOpen(false)}>The maker</a><a className="nav-contact" href="#contact" onClick={()=>setMenuOpen(false)}>Let's connect <ArrowUpRight size={14}/></a></div>
    </nav>

    <main id="home">
      <section className="hero3d" id="universe">
        <div className="hero-text">
          <div className="eyebrow"><span className="status-light"/> A LIVING ATLAS OF EXPERIMENTS <span className="year">/ 2026</span></div>
          <h1>Curiosity is<br/>a form of <em>engineering.</em></h1>
          <p>I'm <strong>Priyanshu Rai</strong> — a computer science student exploring where software, cloud infrastructure, and AI meet. This is a map of things I'm learning to make, not just a list of things I've done.</p>
          <div className="hero-actions"><a className="btn-primary" href="#projects">Explore the work <ArrowUpRight size={16}/></a><a className="btn-ghost" href="#universe">Touch the universe <Orbit size={15}/></a></div>
          <div className="hero-stats"><span><i/> CS / CLOUD COMPUTING</span><span>BASED IN INDIA</span><span>EXPECTED GRAD. 2027</span></div>
        </div>
        <div className="universe-column">
          <div className="universe-label"><span>FIG. 001 / PROJECT CONSTELLATION</span><span>INTERACTIVE 3D</span></div>
          <Universe selected={selected} setSelected={openProject}/>
          <div className="universe-bottom"><span>DRAG TO ORBIT · SCROLL TO ZOOM</span><span>SELECT A PLANET TO ENTER ↗</span></div>
        </div>
        <a className="scroll-cue" href="#connections"><span>SCROLL TO DISCOVER</span><ArrowDownRight size={14}/></a>
      </section>

      <section className="connections-section section-pad" id="connections">
        <div className="section-heading"><div><div className="section-id">01 / THE CONNECTIONS</div><h2>Everything is<br/><em>connected.</em></h2></div><p>Projects are intersections of tools, ideas, and systems. Choose a node to see where the connections lead — then open the project world for a deeper look.</p></div>
        <div className="connection-layout">
          <div className="connection-copy"><div className="connection-current"><span className="current-dot" style={{background:(projects.find(p=>p.id===graphSelected)||{}).color||"#d7f58a"}}/><span>{graphSelected?projects.find(p=>p.id===graphSelected).title:"SYSTEM MAP / OVERVIEW"}</span></div><h3>{graphSelected?"Follow the signal.":"A map of how I build."}</h3><p>{graphSelected?projects.find(p=>p.id===graphSelected).details:"Select a project node. Its relationships to languages, frameworks, cloud services, and data tools will light up."}</p><button className="text-link" onClick={()=>graphSelected?openProject(graphSelected):document.querySelector("#projects").scrollIntoView({behavior:"smooth"})}>{graphSelected?"Enter this project":"Explore all projects"} <ArrowUpRight size={14}/></button><div className="map-legend"><span><i style={{background:"#9edcff"}}/> CLOUD / DELIVERY</span><span><i style={{background:"#ffad78"}}/> AI / VOICE</span><span><i style={{background:"#d7f58a"}}/> DATA / INSIGHT</span></div></div>
          <div className="connection-map" role="group" aria-label="Interactive project and technology connections">
            <svg viewBox="0 0 700 410" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              <defs><linearGradient id="edgeGradient"><stop stopColor="#9edcff"/><stop offset="1" stopColor="#d7f58a"/></linearGradient></defs>
              {[[100,90,350,55],[350,55,590,100],[100,90,160,290],[350,55,360,205],[590,100,540,300],[160,290,360,205],[360,205,540,300],[160,290,540,300],[100,90,360,205],[590,100,360,205],[350,55,540,300]].map((l,i)=><line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} className={`map-edge ${(graphSelected&&i%2===0)?"lit":""}`} />)}
              {[[100,90],[350,55],[590,100],[160,290],[360,205],[540,300]].map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r={i===4?70:40} className={`map-orbit ${graphSelected===projects[i].id?"selected":""}`} />)}
            </svg>
            {projects.map((p,i)=><button key={p.id} className={`map-node n${i+1} ${graphSelected===p.id?"selected":""}`} onClick={()=>setGraphSelected(p.id)} aria-pressed={graphSelected===p.id} style={{"--node-color":p.color}}><span className="node-index">{p.number}</span><span>{p.title}</span></button>)}
            <div className="map-coordinates">ATLAS NETWORK / 06 NODES / SELECT A SIGNAL</div>
          </div>
        </div>
      </section>

      <section className="projects-section section-pad" id="projects">
        <div className="section-heading"><div><div className="section-id">02 / SELECTED WORLDS</div><h2>Proof of <em>curiosity.</em></h2></div><p>Every build begins with a question. Enter a world to explore its purpose, engineering notes, and the systems behind it.</p></div>
        <div className="explorer-bar"><span>EXPLORE BY DOMAIN</span><div>{["ALL","AI","CLOUD","WEB","DATA"].map(f=><button key={f} className={explorer===f?"active":""} onClick={()=>setExplorer(f)}>{f}</button>)}</div></div>
        <div className="project-grid">{filteredProjects.map((p,i)=><button key={p.id} className="project-card3d" onClick={()=>openProject(p.id)} style={{"--project-color":p.color,"--card-index":i}}><div className={`card-art art-${p.id}`}><ProjectPreview id={p.id}/><span className="card-index">FIELD NOTE / {p.number}</span><span className="card-type">{p.type}</span><span className="card-enter">OPEN CASE STUDY ↗</span></div><div className="card-info"><div><h3>{p.title}</h3><p>{p.short}</p></div><div className="card-footer"><div className="tag-row">{p.stack.slice(0,3).map(t=><span key={t}>{t}</span>)}</div><span className="card-arrow"><ArrowUpRight size={17}/></span></div></div></button>)}</div>
        <p className="project-disclaimer">PROJECT DETAILS REFLECT KNOWN WORK AND MAY NEED UPDATING. ADD VERIFIED REPOSITORY LINKS AND DEMOS BEFORE PUBLISHING.</p>
      </section>

      <section className="lab-section section-pad" id="lab">
        <div className="section-heading"><div><div className="section-id">03 / THE DELIVERY LAB</div><h2>From commit<br/>to <em>orbit.</em></h2></div><p>A small interactive simulation of a deployment pipeline. Trigger a release and watch each stage complete. This is a demo, not a real AWS deployment.</p></div>
        <PipelineLab/>
      </section>

      <section className="maker-section section-pad" id="maker">
        <div className="section-heading"><div><div className="section-id">04 / THE MAKER</div><h2>Learning by<br/><em>making.</em></h2></div><p>The best portfolio should show what works today, what is being explored, and what the maker learned along the way.</p></div>
        <div className="maker-grid"><div className="maker-statement">I like the moment when a complicated idea becomes <em>something real.</em></div><div className="maker-bio"><p>I'm pursuing a B.Sc. in Computer Science with a Cloud Computing specialization at MIT World Peace University, Pune. My projects take me across React applications, cloud deployment workflows, AI voice agents, and retail analytics.</p><p>I'm still learning. I believe in showing honest work, explaining technical decisions, and improving through experiments.</p><div className="maker-facts"><div><strong>2027</strong><span>EXPECTED GRADUATION</span></div><div><strong>Cloud + AI</strong><span>CURRENT INTERESTS</span></div><div><strong>Build / Test</strong><span>WORKING PHILOSOPHY</span></div><div><strong>Pune, IN</strong><span>BASE</span></div></div></div></div>
        <div className="timeline"><div><span>EDUCATION</span><section><h3>B.Sc. Computer Science — Cloud Computing</h3><p>MIT World Peace University, Pune · Expected 2027</p></section></div><div><span>EXPERIENCE</span><section><h3>Software development internship</h3><p>Acceltree Software Pvt. Ltd. · Confirm exact dates, responsibilities, and role before publishing.</p></section></div><div><span>ONGOING</span><section><h3>Exploring cloud-native delivery and AI systems</h3><p>React, Python, AWS, CI/CD workflows, and data analysis.</p></section></div></div>
      </section>

      <section className="contact-section section-pad" id="contact"><div className="contact-panel"><div className="section-id">05 / OPEN CHANNEL</div><h2>Have a good problem?<br/><em>Let's build.</em></h2><p>I'm interested in thoughtful projects, internships, and conversations with people who enjoy turning ideas into working systems.</p><div className="contact-actions"><a className="btn-primary" href={`mailto:${contact.email}`}><Mail size={15}/> Email me</a><a className="btn-ghost" href={`tel:${contact.phone}`}><ExternalLink size={15}/> +91 98233 69865</a><a className="btn-ghost" href={contact.github} target="_blank" rel="noreferrer"><Code2 size={15}/> GitHub profile <ArrowUpRight size={14}/></a></div><div className="contact-direct"><span>DIRECT EMAIL</span><a href={`mailto:${contact.email}`}>{contact.email}</a><span className="contact-separator">/</span><span>PHONE</span><a href={`tel:${contact.phone}`}>+91 98233 69865</a></div></div></section>
    </main>
    <footer><span>© {new Date().getFullYear()} PRIYANSHU RAI / ATLAS OF MAKING</span><a href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noreferrer">PLANETARY TEXTURES: SOLAR SYSTEM SCOPE · CC BY 4.0</a><a href={contact.github} target="_blank" rel="noreferrer">GITHUB ↗</a><a href="#home">BACK TO ORBIT ↑</a></footer>
    {activeProject&&<ProjectWorld project={activeProject} onClose={()=>setSelected(null)}/>}
    {toast&&<div className="toast" role="status">{toast}</div>}
  </>;
}

function PipelineLab() {
  const [run,setRun] = useState("idle");
  const [stage,setStage] = useState(-1);
  const stages = [
    {name:"COMMIT",desc:"Source change detected",tool:"GITHUB"},
    {name:"BUILD",desc:"Create production bundle",tool:"VITE / BUILD"},
    {name:"TEST",desc:"Run validation checks",tool:"QUALITY GATE"},
    {name:"PACKAGE",desc:"Prepare deployment artifact",tool:"S3 / ARTIFACT"},
    {name:"DEPLOY",desc:"Publish to target environment",tool:"EC2 / SSM"}
  ];
  useEffect(()=>{
    if(run!=="running")return;
    if(stage>=stages.length-1){const t=setTimeout(()=>setRun("success"),450);return()=>clearTimeout(t)}
    const t=setTimeout(()=>setStage(s=>s+1),760);return()=>clearTimeout(t);
  },[run,stage]);
  const start=()=>{setStage(0);setRun("running")};
  const reset=()=>{setRun("idle");setStage(-1)};
  return <div className="pipeline-lab">
    <div className="lab-top"><div><span className="lab-indicator"/><span>DEPLOYMENT SIMULATOR / LOCAL MODE</span></div><span>PIPELINE ID: ATLAS-0{run==="idle"?"0":run==="success"?"5":Math.max(stage+1,1)}</span></div>
    <div className="pipeline-stages">{stages.map((s,i)=><React.Fragment key={s.name}><div className={`pipeline-stage-card ${i<stage||run==="success"?"complete":i===stage&&run==="running"?"processing":""}`}><div className="stage-top"><span>{i<stage||run==="success"?"✓":`0${i+1}`}</span><span className="stage-light"/></div><h3>{s.name}</h3><p>{s.desc}</p><small>{s.tool}</small></div>{i<stages.length-1&&<div className={`pipeline-connector ${i<stage||run==="success"?"active":""}`}><span/></div>}</React.Fragment>)}</div>
    <div className="lab-bottom"><div className="lab-log" aria-live="polite"><span className="log-prefix">›</span>{run==="idle"?"Awaiting trigger. No cloud resources will be changed.":run==="running"?`${stages[Math.max(0,stage)].name}: ${stages[Math.max(0,stage)].desc.toLowerCase()}…`: "SIMULATION COMPLETE — all five illustrative stages passed."}</div><div className="lab-controls"><button className="btn-primary" onClick={start} disabled={run==="running"}><Rocket size={14}/>{run==="success"?"Run again":"Trigger pipeline"}</button><button className="btn-ghost" onClick={reset}><RotateCcw size={14}/> Reset</button></div></div>
    <p className="lab-disclaimer">SIMULATION ONLY · THIS INTERACTION DOES NOT CONNECT TO AWS OR TRIGGER A REAL DEPLOYMENT.</p>
  </div>;
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App/></React.StrictMode>);
