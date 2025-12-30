import React, { useState, useEffect, useRef } from 'react';
import { AppStep } from './types';
import { CLASS_NAME, SCHOOL_NAME, YEAR, WISH_CATEGORIES, TEACHER_NAME } from './constants';
// Import bezpośredni (pliki luzem w głównym folderze)
import SystemActivation from './SystemActivation';

// --- KOMPONENT FAJERWERKÓW ---
const Fireworks: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: Particle[] = [];
    const colors = ['#10b981', '#34d399', '#fbbf24', '#ffffff'];

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.color = color;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.05;
        this.alpha -= 0.01;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const createExplosion = (x: number, y: number) => {
      for (let i = 0; i < 50; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x, y, color));
      }
    };

    const interval = setInterval(() => {
        const x = Math.random() * width;
        const y = Math.random() * (height / 2);
        createExplosion(x, y);
    }, 800);

    const animate = () => {
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; 
      ctx.fillRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
        clearInterval(interval);
        window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60" />;
};

// --- KOMPONENT SZAMPANA (Nowość) ---
const ChampagneClink: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-6 animate-in fade-in zoom-in duration-1000 delay-500">
      <div className="relative w-24 h-24 group cursor-pointer">
        {/* Style animacji */}
        <style>{`
          @keyframes clink-left {
            0%, 100% { transform: rotate(0deg) translateX(0); }
            50% { transform: rotate(15deg) translateX(10px); }
          }
          @keyframes clink-right {
            0%, 100% { transform: rotate(0deg) translateX(0); }
            50% { transform: rotate(-15deg) translateX(-10px); }
          }
          .glass-left { animation: clink-left 3s infinite ease-in-out; transform-origin: bottom center; }
          .glass-right { animation: clink-right 3s infinite ease-in-out; transform-origin: bottom center; }
        `}</style>
        
        {/* Lewy kieliszek */}
        <div className="absolute left-2 top-0 glass-left">
           <svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 0V20C5 28.2843 11.7157 35 20 35C28.2843 35 35 28.2843 35 20V0" stroke="#fbbf24" strokeWidth="2"/>
              <path d="M20 35V55" stroke="#fbbf24" strokeWidth="2"/>
              <path d="M10 55H30" stroke="#fbbf24" strokeWidth="2"/>
              {/* Płyn */}
              <path d="M7 10V20C7 25 12 33 20 33C28 33 33 25 33 20V10" fill="#fbbf24" fillOpacity="0.6"/>
              {/* Bąbelki */}
              <circle cx="15" cy="15" r="1" fill="white" className="animate-pulse"/>
              <circle cx="25" cy="22" r="1" fill="white" className="animate-pulse delay-75"/>
           </svg>
        </div>

        {/* Prawy kieliszek */}
        <div className="absolute right-2 top-0 glass-right">
           <svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 0V20C5 28.2843 11.7157 35 20 35C28.2843 35 35 28.2843 35 20V0" stroke="#fbbf24" strokeWidth="2"/>
              <path d="M20 35V55" stroke="#fbbf24" strokeWidth="2"/>
              <path d="M10 55H30" stroke="#fbbf24" strokeWidth="2"/>
              {/* Płyn */}
              <path d="M7 10V20C7 25 12 33 20 33C28 33 33 25 33 20V10" fill="#fbbf24" fillOpacity="0.6"/>
              {/* Bąbelki */}
              <circle cx="15" cy="18" r="1" fill="white" className="animate-pulse delay-100"/>
              <circle cx="22" cy="12" r="1" fill="white" className="animate-pulse delay-200"/>
           </svg>
        </div>
        
        {/* Błysk stuknięcia */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full blur-sm opacity-0 animate-[ping_3s_infinite_1.5s]"></div>
      </div>
    </div>
  );
};

// --- FUNKCJA GENERUJĄCA ŻYCZENIA ---
async function generatePersonalizedPoem() {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    
    if (!apiKey) {
       console.warn("Brak klucza API. Używam trybu offline.");
       throw new Error("Missing API Key");
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ 
            role: "user", 
            parts: [{ 
              text: "Napisz krótkie (4-6 wersów), profesjonalne i szczerze ciepłe życzenia noworoczne 2026 od wychowawcy Wojciecha Borkowego dla klasy 4 Technikum Ochrony Środowiska (Tychy ZS1).\n\n" +
                    "WYTYCZNE:\n" +
                    "1. ZERO patosu. Konkretny, męski styl.\n" +
                    "2. Motyw przewodni: Turbiny wiatrowe jako symbol energii i skuteczności.\n" +
                    "3. Wartości: Rzetelna wiedza, stabilizacja, zdrowie.\n" +
                    "4. Brak gwiazdek (*), brak podpisu." 
            }] 
          }]
        })
      }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    return text
      .replace(/\*/g, '')
      .replace(/Z poważaniem.*/is, '')
      .replace(/Wojciech Borkowy.*/is, '')
      .trim();

  } catch (error) {
    console.error("Fallback Mode:", error);
    return "Na kolejny rok życzę Wam, aby\nwasza wiedza i kompetencje stały się napędem,\nktóry jak sprawna turbina, pozwoli Wam realizować każdy ambitny plan.\nNiech zdrowie i wsparcie najbliższych będą stabilnym fundamentem,\na rok 2026 przyniesie konkretne sukcesy, z których będziecie dumni.";
  }
}

// --- GŁÓWNY KOMPONENT ---
const App: React.FC = () => {
  const [step, setStep] = useState(AppStep.INTRO);
  const [poem, setPoem] = useState("");

  useEffect(() => {
    generatePersonalizedPoem().then(setPoem);
  }, []);

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-emerald-500/30 overflow-hidden flex flex-col items-center justify-center relative">
      
      {/* Tło techniczne */}
      <div className="fixed inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Światła ambientowe */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-900/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-zinc-800/20 blur-[100px] rounded-full"></div>

      {step === AppStep.INTRO && (
        <div className="z-10 text-center animate-in fade-in zoom-in duration-1000">
          
          <p className="text-emerald-500 font-bold text-xs uppercase tracking-widest mb-6">
            Życzenia na nowy rok od wychowawcy Wojciecha Borkowego
          </p>

          <p className="text-zinc-500 text-xs tracking-[0.5em] mb-4 uppercase">Zespół {CLASS_NAME}</p>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-2">
            Kierunek <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-700">{YEAR}</span>
          </h1>
          <div className="h-px w-32 bg-emerald-900 mx-auto my-8"></div>
          
          <button 
            onClick={() => setStep(AppStep.WELCOME)}
            className="px-14 py-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-[0.7rem] font-bold uppercase tracking-[0.4em] hover:bg-emerald-500 hover:text-black transition-all duration-500 shadow-2xl active:scale-95 text-white"
          >
            Dostęp do Wiadomości
          </button>
        </div>
      )}

      {step === AppStep.WELCOME && (
        <div className="z-10 max-w-2xl text-center px-6 animate-in slide-in-from-bottom-10 fade-in duration-700">
          <div className="mb-8 inline-block px-4 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 text-[0.6rem] tracking-widest text-emerald-500">
            {SCHOOL_NAME}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Specjaliści <br/>
            <span className="text-emerald-500">Ochrony Środowiska</span>
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed mb-10 font-light">
            Kończycie ważny etap. Czas na przełożenie technicznej wiedzy na realne osiągnięcia.
          </p>
          
          <button 
            onClick={() => setStep(AppStep.ACTIVATE)}
            className="px-16 py-7 bg-emerald-600 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all active:scale-95 shadow-xl"
          >
            Generuj Raport {YEAR}
          </button>
        </div>
      )}

      {step === AppStep.ACTIVATE && (
        <SystemActivation onComplete={() => setStep(AppStep.WISHES)} />
      )}

      {step === AppStep.WISHES && (
        <>
          {/* FAJERWERKI W TLE */}
          <Fireworks />
          
          <div className="z-10 w-full max-w-4xl px-4 py-8 md:py-12 animate-in zoom-in-95 fade-in duration-1000 flex flex-col items-center">
            
            <div className="w-full bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden mb-8">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600"></div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-zinc-800 pb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{TEACHER_NAME}</h3>
                  <p className="text-emerald-500 text-xs uppercase tracking-widest">Wychowawca</p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-zinc-500 text-xs uppercase tracking-widest">Klasa {CLASS_NAME} • Rok {YEAR}</p>
                </div>
              </div>

              <div className="space-y-6 mb-10">
                <p className="text-xl md:text-2xl leading-relaxed text-zinc-100 font-medium whitespace-pre-line">
                  {poem || "Synchronizacja..."}
                </p>
              </div>

              <div className="flex items-center justify-between text-[0.6rem] text-zinc-600 uppercase tracking-widest font-bold">
                <span>Wiadomość zweryfikowana rzetelnie</span>
                <span>{SCHOOL_NAME} | Branża Środowiskowa</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8">
              {WISH_CATEGORIES.map((cat, i) => (
                <div key={i} className={`p-6 rounded-2xl border border-zinc-800/50 bg-zinc-900/80 hover:bg-zinc-800/90 transition-colors group backdrop-blur-sm`}>
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`w-10 h-10 rounded-full ${cat.color} flex items-center justify-center text-lg shadow-lg group-hover:scale-110 transition-transform`}>
                      {cat.icon}
                    </div>
                    <h4 className="font-bold text-zinc-200">{cat.title}</h4>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed pl-14">
                    {cat.message}
                  </p>
                </div>
              ))}
            </div>

            {/* TUTAJ DODAŁEM SZAMPANA */}
            <ChampagneClink />

            <div className="text-center mb-8">
              <p className="text-emerald-500/80 text-[0.6rem] tracking-[0.5em] uppercase mb-4 font-bold bg-black/50 inline-block px-4 py-1 rounded-full">Status: Gotowość do działania</p>
              <h2 className="text-3xl font-black text-white tracking-tighter drop-shadow-xl">Solidne fundamenty na rok {YEAR}</h2>
            </div>

            <button onClick={() => window.location.reload()} className="relative z-10 px-10 py-4 rounded-xl bg-zinc-950 text-[0.7rem] font-black text-zinc-500 hover:text-emerald-400 transition-all uppercase tracking-[0.3em] border border-zinc-800 active:scale-95 shadow-xl">
              Odśwież 🔄
            </button>

          </div>
        </>
      )}
    </div>
  );
};

export default App;
