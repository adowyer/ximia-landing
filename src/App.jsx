import React, { useEffect, useRef, useState } from "react";
import { Zap, BarChart3, Target, Check, Database, Cpu, Home, Braces, Landmark, Radar, BrainCircuit, Calculator, UserCheck, ShieldCheck, AlertTriangle } from "lucide-react";

// i18n
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";

import en from "./locales/en/translation.json";
import es from "./locales/es/translation.json";

// INIT i18n
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es }
  },
  lng: navigator.language.startsWith("es") ? "es" : "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default function App() {
  const { t, i18n: i18nInstance } = useTranslation();

  // LANG
  const [lang, setLang] = useState(
    localStorage.getItem("lang") ||
    (navigator.language.startsWith("es") ? "es" : "en")
  );

  useEffect(() => {
    i18nInstance.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  }, [lang, i18nInstance]);

  // SCROLL
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // =========================
  // CHAT
  // =========================

  const rawScenarios = t("hero_scenarios", { returnObjects: true });
  const heroScenarios = Array.isArray(rawScenarios) ? rawScenarios : [];
  const [activeScenario, setActiveScenario] = useState(0);

  // =========================
  // HERO TYPEWRITER
  // =========================

  const fullText1 = t("hero_title_1");
  const fullText2 = t("hero_title_2");

  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");

  useEffect(() => {
    let i = 0;
    let j = 0;

    let typing1;
    let typing2;
    let delayTimeout;

    setText1("");
    setText2("");

    typing1 = setInterval(() => {
      setText1(fullText1.slice(0, i + 1));
      i++;

      if (i === fullText1.length) {
        clearInterval(typing1);

        delayTimeout = setTimeout(() => {
          typing2 = setInterval(() => {
            setText2(fullText2.slice(0, j + 1));
            j++;

            if (j === fullText2.length) clearInterval(typing2);
          }, 50);
        }, 700);
      }
    }, 50);

    return () => {
      clearInterval(typing1);
      clearInterval(typing2);
      clearTimeout(delayTimeout);
    };
  }, [fullText1, fullText2]);

  // =========================
  // PROBLEM TYPEWRITER 
  // =========================

  const [textLine1, setTextLine1] = useState("");
  const [textLine2, setTextLine2] = useState("");

  const headlineRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.4 }
    );

    if (headlineRef.current) observer.observe(headlineRef.current);

    return () => {
      if (headlineRef.current) observer.unobserve(headlineRef.current);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;

    const lines = t("problem_headline", { returnObjects: true });

    let i = 0;
    let j = 0;

    setTextLine1("");
    setTextLine2("");

    const typing1 = setInterval(() => {
      setTextLine1(lines[0].slice(0, i + 1));
      i++;

      if (i >= lines[0].length) {
        clearInterval(typing1);

        const typing2 = setInterval(() => {
          setTextLine2(lines[1].slice(0, j + 1));
          j++;

          if (j >= lines[1].length) clearInterval(typing2);
        }, 40);
      }
    }, 80);

    return () => clearInterval(typing1);
  }, [visible, t]);

  const lines = t("problem_headline", { returnObjects: true });
  const isLine2Done = textLine2.length === lines[1].length;


  const rawStat = t("problem_stat_value");
  const targetMatch = rawStat?.match(/\d+/);
  const targetValue = targetMatch ? parseInt(targetMatch[0]) : 75;
  const statPrefix = rawStat?.split(/\d+/)[0] || "";
  const statSuffix = rawStat?.split(/\d+/)[1] || "";

  const [statCount, setStatCount] = useState(0);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (stage >= 2 && targetValue > 0) {
      let current = 0;
      const duration = 1200; // 1.2s to count up
      const stepTime = Math.max(16, Math.floor(duration / targetValue));

      const timer = setInterval(() => {
        current += 1;
        setStatCount(current);
        if (current >= targetValue) {
          setStatCount(targetValue);
          clearInterval(timer);
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [stage, targetValue]);
  const problemRef = useRef(null);
  const statsRef = useRef(null);
  const [inView, setInView] = useState(false);

  const backendTitleRef = useRef(null);
  const [backendInView, setBackendInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setBackendInView(true);
    }, { threshold: 0.3 });
    if (backendTitleRef.current) observer.observe(backendTitleRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    const timers = [
      setTimeout(() => setStage(1), 200),
      setTimeout(() => setStage(2), 1200),
      setTimeout(() => setStage(3), 2000),
      setTimeout(() => setStage(4), 2800)
    ];

    return () => timers.forEach(clearTimeout);
  }, [inView]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      {
        threshold: 0.5 // delay until prominent
      }
    );

    if (problemRef.current) {
      observer.observe(problemRef.current);
    }

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const iconMap = { zap: Zap, chart: BarChart3, target: Target, check: Check };

  const rawSteps = t("process_steps", { returnObjects: true });
  const steps = Array.isArray(rawSteps) ? rawSteps : [];

  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveStep(index);
          }
        });
      },
      { rootMargin: "-30% 0px -50% 0px" }
    );

    const currentRefs = stepRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => currentRefs.forEach((ref) => { if (ref) observer.unobserve(ref) });
  }, [steps]);

  // Observers for Final Sections
  const tableRef = useRef(null);
  const [tableInView, setTableInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTableInView(true); }, { threshold: 0.2 });
    if (tableRef.current) obs.observe(tableRef.current);
    return () => obs.disconnect();
  }, []);

  const ctaRef = useRef(null);
  const [ctaInView, setCtaInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setCtaInView(true); }, { threshold: 0.4 });
    if (ctaRef.current) obs.observe(ctaRef.current);
    return () => obs.disconnect();
  }, []);

  // =========================
  // UI
  // =========================

  return (
    <div className="font-sans text-gray-900">

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <button onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-2 transition-transform hover:scale-105">
            <img src="/Ximia-Header.png" alt="Ximia IA" className="h-12 md:h-16 w-auto object-contain" />
          </button>
          <nav className="space-x-6 hidden md:block font-medium">
            <button onClick={() => scrollTo("problem")} className="hover:text-gray-500 transition-colors">
              {t("nav_problem")}
            </button>

            <button onClick={() => scrollTo("solution")} className="hover:text-gray-500 transition-colors">
              {t("nav_solution")}
            </button>

            <button onClick={() => scrollTo("tech")} className="hover:text-gray-500 transition-colors">
              {t("nav_tech")}
            </button>

            <button onClick={() => scrollTo("vs")} className="hover:text-gray-500 transition-colors">
              {t("nav_vs")}
            </button>
          </nav>
          <button
            onClick={() => window.open("https://calendly.com/hola-ximia-ectr/ximia-demo", "_blank")}
            className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md hover:scale-105 transition-all"
          >
            {t("hero_cta_primary")}
          </button>
          <div className="relative">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="appearance-none bg-white/80 backdrop-blur border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm font-medium cursor-pointer hover:border-black transition"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>

            <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
              ▼
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-44 pb-36 md:pt-52 md:pb-44 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-stretch">

          {/* LEFT SIDE */}
          <div>
            <h2 className="text-7xl md:text-8xl lg:text-[130px] font-bold leading-[0.9] tracking-tight mb-6">
              <span className="block">
                {text1}
              </span>
              <span className="block text-gray-500">
                {text2}
                <span className="animate-blink">|</span>
              </span>
            </h2>

            <p className="text-[22px] md:text-[22px] text-gray-700 leading-[1.5] mb-10 max-w-xl">
              <span className="block">
                {t("hero_sub_line_1")}
              </span>
              <span className="block text-gray-500">
                {t("hero_sub_line_2")}
              </span>
            </p>

            <div className="flex gap-4">
              {/* <button className="border px-6 py-3 rounded-xl text-lg">
                {t("hero_cta_secondary")}
              </button> */}
              <button 
                onClick={() => window.open("https://calendly.com/hola-ximia-ectr/ximia-demo", "_blank")}
                className="bg-black text-white px-6 py-3 rounded-xl text-lg"
              >
                {t("hero_cta_primary")}
              </button>
            </div>

          </div>

          {/* RIGHT SIDE: Interactive Demo */}
          <div className="w-full h-full flex flex-col gap-6 justify-between">

            {/* THE CHAT BOX */}
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-[2rem] p-4 md:p-6 shadow-xl flex flex-col overflow-hidden relative max-h-[520px]">
              {/* MESSAGES */}
              <div key={activeScenario} className="flex-1 flex flex-col justify-start gap-4 overflow-y-auto py-2 pb-6 scrollbar-hide">
                {heroScenarios[activeScenario]?.messages?.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex animate-step ${msg.from === "user" ? "justify-end" : "items-start gap-2"}`}
                    style={{ animationDelay: `${i * 0.15}s`, animationFillMode: "both" }}
                  >
                    {msg.from === "ai" && (
                      <img src="/AI-Icon.gif" alt="AI Agent" className="w-6 h-6 mt-1 rounded-full shadow-sm shrink-0" />
                    )}

                    <div
                      className={`p-3 rounded-2xl max-w-[85%] md:max-w-[80%] text-sm md:text-base leading-relaxed shadow-sm ${msg.from === "user"
                        ? "bg-[#0092B3] text-white rounded-br-sm"
                        : "bg-gray-50 border border-gray-100 text-gray-800 rounded-bl-sm"
                        }`}
                      dangerouslySetInnerHTML={{ __html: msg.text }}
                    >
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom fading gradient to simulate scroll bounds */}
              <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white/95 to-transparent pointer-events-none rounded-b-[2rem]"></div>
            </div>

            {/* THE CONTROLS (OUTSIDE, BELOW, CENTERED) */}
            <div className="flex flex-col items-center gap-2 mt-1">
              <span className="text-sm font-medium text-gray-500">
                {t("hero_demo_label")}
              </span>
              <div className="flex gap-2 p-1 overflow-x-auto scrollbar-hide justify-center w-full max-w-full">
                {heroScenarios.map((scenario, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveScenario(idx)}
                    className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 border ${activeScenario === idx
                      ? 'bg-gray-700 text-white border-gray-700 shadow-md scale-105'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:scale-105'
                      }`}
                  >
                    {scenario.tab}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      <div className="w-full h-[700px] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-top"
        >
          <source src="/AI.mp4" type="video/mp4" />
        </video>
      </div>

      <section className="py-20 md:py-40 text-center bg-white">
        <div className="w-full max-w-7xl mx-auto px-6 flex flex-col items-center">
          <p className="text-xl md:text-3xl text-gray-600 leading-snug whitespace-pre-line max-w-6xl mb-12">
            {t("problem_intro_line2")}
          </p>
          <p className="text-4xl md:text-[4rem] leading-[1.1] font-bold text-gray-900 tracking-tight whitespace-pre-line max-w-full text-center">
            <AlertTriangle size={80} strokeWidth={2.5} fill="#facc15" className="text-black inline-block align-middle mr-4 -mt-4 animate-pulse" />
            {t("problem_intro_line1")}
          </p>
        </div>
      </section>

      <section ref={problemRef} id="problem" className="py-40 bg-gray-900 text-white text-center">
        <div className="max-w-8xl mx-auto px-6">
          <h2 ref={headlineRef} className="text-5xl md:text-8xl font-bold leading-tight tracking-tight mb-10">
            <span className="block">
              {visible ? textLine1 : <span className="opacity-0">{t("problem_headline", { returnObjects: true })[0]}</span>}
            </span>
            <span className="block">
              {visible ? textLine2 : <span className="opacity-0">{t("problem_headline", { returnObjects: true })[1]}</span>}
            </span>
            <span className={`block transform transition-all duration-[2000ms] ease-out ${isLine2Done ? "translate-x-0 opacity-100 delay-300" : "-translate-x-10 opacity-0"}`} >
              <span className={`transition-colors duration-[2000ms] ease-in-out ${isLine2Done ? "text-[#98daed]" : "text-white"}`} style={{ transitionDelay: isLine2Done ? "1s" : "0s" }} >
                {lines[2]}
              </span>
            </span>
          </h2>

          <div className="flex justify-center my-12">
            <div className="flex flex-col items-center gap-2 mt-6">
              {/* Arrow */}
              <div className="animate-bounce text-gray-500 text-6xl">
                ↓
              </div>

            </div>
          </div>

          {/* STAT */}
          <div ref={statsRef} className="mb-16 max-w-5xl mx-auto text-center flex flex-col items-center">
            <p className={`text-[8rem] md:text-[11rem] leading-none tracking-tighter transition-all duration-500 ease-out ${stage >= 2 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-90"
              }`}>
              {statPrefix}{statCount}{statSuffix}
            </p>

            <p className={`text-gray-400 mt-2 md:text-5xl transition-all duration-700 ${stage >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}>
              {t("problem_stat_caption")}
            </p>

            <div className={`mt-16 grid grid-cols-2 gap-0 max-w-4xl mx-auto transition-all duration-700 ${stage >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              {/* WITHOUT XIMIA */}
              <div className="flex flex-col items-center pr-8 border-r border-white/10">
                <p className="text-sm md:text-xl font-bold uppercase tracking-widest mb-8">{t("problem_flow_without_label")}</p>
                {(t("problem_flow_without", { returnObjects: true }) || []).map((step, idx, arr) => (
                  <div key={idx} className="flex flex-col items-center" style={{ transitionDelay: `${idx * 200}ms` }}>
                    <p className={`text-center text-base md:text-xl ${idx === arr.length - 1 ? "font-bold" : "text-gray-400"}`}>{step}</p>
                    {idx < arr.length - 1 && (
                      <span className="text-gray-600 text-2xl my-3">↓</span>
                    )}
                  </div>
                ))}
              </div>
              {/* WITH XIMIA */}
              <div className="flex flex-col items-center pl-8">
                <p className="text-sm md:text-xl font-bold uppercase tracking-widest mb-8">{t("problem_flow_with_label")}</p>
                {(t("problem_flow_with", { returnObjects: true }) || []).map((step, idx, arr) => (
                  <div key={idx} className="flex flex-col items-center" style={{ transitionDelay: `${idx * 200}ms` }}>
                    <p className={`text-center text-base md:text-xl ${idx === arr.length - 1 ? "font-bold" : "text-gray-300"}`}>{step}</p>
                    {idx < arr.length - 1 && (
                      <span className="text-2xl my-3">↓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center my-12">
              <div className="flex flex-col items-center gap-2 mt-6">
                {/* Flecha animada */}
                <div className="animate-bounce text-gray-500 text-6xl">
                  ↓
                </div>

              </div>
            </div>

            {/* RESULT */}
            <p className="text-5xl md:text-8xl font-black leading-tight tracking-tight text-center text-gray-400">
              {t("problem_result")}
            </p>
          </div>
        </div>
      </section>

      {/* THE SOLUTION (STICKY STEPPER) */}
      <section id="solution" className="pt-20 pb-40 bg-white relative">
        <style>{`
          @keyframes stepFadeIn {
            from { opacity: 0; transform: translateY(10px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .animate-step { animation: stepFadeIn 0.5s ease-out forwards; }
        `}</style>
        <div className="max-w-7xl mx-auto px-6">

          {/* HEADER WITH BG X */}
          <div className="relative py-12 md:py-24 mb-20 flex items-center justify-center w-full">
            {/* The actual text */}
            <h2 className="text-5xl md:text-8xl font-black leading-tight tracking-tight text-center text-gray-900 relative z-10">
              {t("solution_title")}
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-16 relative items-start">

            {/* LEFT: Scrolling Steps */}
            <div className="w-full md:w-5/12 space-y-40 py-20 pb-[10vh] md:pb-[20vh]">
              {steps.map((step, index) => {
                const Icon = iconMap[step.icon];
                const isActive = activeStep === index;

                return (
                  <div
                    key={index}
                    ref={(el) => (stepRefs.current[index] = el)}
                    data-index={index}
                    className={`flex flex-col gap-4 transform-gpu transition-all duration-500 ease-out origin-left ${isActive ? "opacity-100 scale-100 translate-x-4" : "opacity-30 scale-95 blur-[1px]"
                      }`}
                  >
                    <div className={`flex items-center gap-4 ${isActive ? "text-[#0092B3]" : "text-gray-400"}`}>
                      <span className="text-6xl font-black">0{index + 1}</span>
                      {Icon && <Icon size={40} strokeWidth={isActive ? 3 : 1.5} />}
                    </div>
                    <div>
                      <h3 className={`text-4xl font-bold mb-4 transition-colors ${isActive ? "text-gray-900" : "text-gray-400"}`}>
                        {step.title}
                      </h3>
                      <p className="text-2xl text-gray-500 font-medium leading-normal max-w-md">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT: Sticky Visual Container (Borderless) */}
            <div className="hidden md:flex w-full md:w-7/12 sticky top-40 h-[600px] flex-col items-center justify-center relative">

              <div key={activeStep} className="w-full h-full flex items-center justify-center animate-step">
                {/* INTERFAZ CHAT B2C PARA PASOS 0, 1 Y 2 */}
                {activeStep <= 2 && (
                  <div className="w-full max-w-lg h-[540px] bg-[#FAFAFA] rounded-3xl shadow-[0_15px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-200 flex flex-col overflow-hidden relative">
                    {/* Header Chat */}
                    <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between z-10 shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-200 overflow-hidden">
                          <img src="/AI-Icon.gif" alt="Ximia.ai" className="h-8 w-auto object-contain scale-125" />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide flex flex-col gap-6 relative">
                      {activeStep === 0 && (
                        <div className="flex flex-col gap-4 animate-step">
                          <div className="self-end max-w-[85%] bg-[#0092B3] text-white p-4 rounded-xl rounded-tr-sm text-sm shadow-sm" dangerouslySetInnerHTML={{ __html: t("stepper_chat_0_user_1") }}></div>
                          <div className="self-start max-w-[90%] bg-white border border-gray-100 text-gray-700 p-5 rounded-xl rounded-tl-sm text-[13px] shadow-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: t("stepper_chat_0_ai_1") }}></div>
                          <div className="self-end max-w-[85%] bg-[#0092B3] text-white p-4 rounded-xl rounded-tr-sm text-sm shadow-sm opacity-30 blur-[1px]" dangerouslySetInnerHTML={{ __html: t("stepper_chat_0_user_2") }}></div>
                        </div>
                      )}

                      {activeStep === 1 && (
                        <div className="flex flex-col gap-4 animate-step">
                          <div className="self-end max-w-[60%] bg-[#0092B3] text-white px-5 py-3 rounded-xl rounded-tr-sm text-sm font-medium shadow-sm">
                            {t("stepper_chat_1_user")}
                          </div>
                          <div className="self-start w-full bg-white border border-gray-100 text-gray-700 p-5 rounded-xl rounded-tl-sm text-[13px] leading-relaxed shadow-sm" dangerouslySetInnerHTML={{ __html: t("stepper_chat_1_ai") }}></div>
                        </div>
                      )}

                      {activeStep === 2 && (
                        <div className="flex flex-col gap-4 animate-step">
                          <div className="self-start w-full bg-white border border-gray-100 text-gray-700 p-5 rounded-xl rounded-tl-sm text-[13px] leading-relaxed shadow-sm">
                            <img src="/2-Plantas.jpg" alt="Vivienda HPR03" className="w-full h-36 object-cover rounded-lg mb-4 border border-gray-100" />
                            <div dangerouslySetInnerHTML={{ __html: t("stepper_chat_2_ai") }}></div>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Fake Chat Input */}
                    <div className="bg-white p-4 border-t border-gray-100 shrink-0">
                      <div className="bg-gray-50 border border-gray-200 rounded-full h-10 flex items-center px-4">
                        <div className="w-full h-full bg-transparent flex items-center text-xs text-gray-400">{t("stepper_chat_input")}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PASO 3: LIGHT CRM MOCKUP */}
                {activeStep === 3 && (
                  <div className="w-full max-w-lg h-[540px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden relative animate-step">
                    {/* CRM Header */}
                    <div className="bg-[#3b82f6] h-14 flex items-center px-6 shrink-0">
                      <div className="flex gap-6 text-white text-sm">
                        <span className="font-bold flex items-center gap-2 px-3 py-1.5"><Target size={18} /> CRM DASHBOARD</span>
                        <span className="opacity-70 flex items-center"><BarChart3 size={18} /></span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 bg-gray-50/30 overflow-y-auto">
                      <h3 className="text-xl text-gray-700 mb-4">{t("stepper_crm_title")}</h3>
                      <div className="h-px w-full bg-blue-500 mb-6"></div>
                      {/* Notifications List */}
                      <div className="flex flex-col gap-6">
                        {(Array.isArray(t("stepper_crm_leads", { returnObjects: true })) ? t("stepper_crm_leads", { returnObjects: true }) : []).map((lead, idx) => (
                          <div key={idx} className="flex items-start gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                            <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                              <img src="/X.png" className="w-6 h-6 object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1">
                                <p className="text-[13px] text-gray-500 truncate mr-2">{lead.title}</p>
                                <span className="text-[11px] text-gray-400 shrink-0">{lead.time}</span>
                              </div>
                              <p className="text-blue-600 font-bold text-[14px] mb-2 truncate">{lead.name}</p>
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 w-full text-[13px]">
                                <span className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-widest uppercase border shrink-0 ${lead.tagColor}`}>
                                  {lead.tag}
                                </span>
                                <span className="text-gray-500 leading-snug break-words">{lead.desc}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. THE VS TABLE (LIGHT) */}
      <section ref={tableRef} id="vs" className="py-32 md:py-40 bg-gray-50 text-gray-900 border-b border-gray-100/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-10">
            <h2 className="text-5xl md:text-6xl tracking-tight font-bold text-center mb-16 md:mb-20">
              {t("vs_title")}
            </h2>

            <div className={`bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-xl transition-all duration-1000 transform ${tableInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
              <div className="grid grid-cols-3 gap-6 border-b border-gray-200 pb-6 mb-6">
                <div className="text-gray-400 uppercase tracking-widest text-xs md:text-sm">Área</div>
                <div className="text-gray-500 font-bold text-base md:text-xl">Sin Ximia</div>
                <div className="text-[#0092B3] font-bold text-xl md:text-xl">Con Ximia</div>
              </div>

              {Array.isArray(t("vs_features", { returnObjects: true })) && t("vs_features", { returnObjects: true }).map((feat, idx) => (
                <div key={idx} className={`grid grid-cols-3 gap-6 items-center py-6 transition-all duration-700 ease-out transform ${tableInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"} ${idx !== t("vs_features", { returnObjects: true }).length - 1 ? 'border-b border-gray-200' : ''}`} style={{ transitionDelay: `${400 + idx * 150}ms` }}>
                  <div className="text-gray-500 text-sm md:text-lg font-medium">{feat.feature}</div>
                  <div className="text-gray-400 text-base md:text-lg">{feat.old}</div>
                  <div className="text-gray-900 text-lg md:text-lg flex items-center gap-3">
                    <Check className="text-green-500" strokeWidth={3} /> {feat.ximia}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* THE ARCHITECTURE BENTO GRID */}
      <section id="tech" className="py-24 md:py-32 bg-white border-t border-gray-100/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div ref={backendTitleRef} className="max-w-5xl mb-16 md:mb-20">
            <p className="text-[#0092B3] font-bold tracking-widest uppercase mb-4 text-sm md:text-base">{t("why_ximia_label")}</p>
            <h2 className={`text-[60px] md:text-[85px] leading-[1.1] font-bold tracking-tight mb-8 transition-all duration-1000 ${backendInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              {t("why_ximia_headline")}
            </h2>
            <p className={`text-xl md:text-3xl text-gray-500 leading-relaxed max-w-4xl transition-opacity duration-1000 delay-300 ${backendInView ? "opacity-100" : "opacity-0"}`}>
              {t("why_ximia_intro")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {/* CARD 1: The Core Features (Col 1) */}
            <div className={`col-span-1 bg-[#0092B3] text-white rounded-3xl p-8 md:p-10 shadow-xl flex flex-col justify-between transition-all duration-1000 delay-500 transform ${backendInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
              <div className="space-y-10">
                {Array.isArray(t("why_ximia_features", { returnObjects: true })) && t("why_ximia_features", { returnObjects: true }).map((feat, idx) => (
                  <div key={idx} className="flex flex-col gap-3">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 mb-2">
                      {idx === 0 ? <BrainCircuit size={24} /> : idx === 1 ? <Calculator size={24} /> : idx === 2 ? <UserCheck size={24} /> : <ShieldCheck size={24} />}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{feat.title}</h4>
                      <p className="text-white/80 leading-relaxed text-sm md:text-base">{feat.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN STACK */}
            <div className="col-span-1 md:col-span-2 flex flex-col gap-6">

              {/* CARD 2: Architecture Layers (Bigger, more weight) */}
              <div className={`flex-grow bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-sm transition-all duration-1000 delay-700 transform ${backendInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{t("infra_title")}</h3>
                <p className="text-gray-500 text-xl mb-10 max-w-2xl leading-relaxed">{t("infra_subtitle")}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                  {Array.isArray(t("infra_layers", { returnObjects: true })) && t("infra_layers", { returnObjects: true }).map((layer, idx) => (
                    <div key={idx} className="flex items-start gap-5 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-full border border-gray-300 bg-white text-gray-900 flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                        0{idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-2">{layer.layer}</h4>
                        <p className="text-base text-gray-500 leading-relaxed">{layer.function}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 3: Tech Stack (Smaller) */}
              <div className={`bg-gray-900 text-white rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col transition-all duration-1000 delay-1000 transform ${backendInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0092B3] rounded-full filter blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between items-center h-full">
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">{t("stack_title")}</h3>
                    <p className="text-gray-400 text-base mb-8 max-w-lg">{t("stack_subtitle")}</p>

                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {Array.isArray(t("stack_tags", { returnObjects: true })) && t("stack_tags", { returnObjects: true }).map((tag, idx) => (
                        <span key={idx} className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-xs md:text-sm font-medium backdrop-blur-md hover:bg-white/20 transition-colors cursor-default">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* VISUAL FILLER: MOCK CODE SNIPPET */}
                  <div className="w-full md:w-auto shrink-0 mt-6 md:mt-0">
                    <div className="bg-[#0b1120]/80 rounded-xl p-5 font-mono text-xs md:text-sm border border-gray-800/80 shadow-inner overflow-x-auto text-gray-300 leading-relaxed w-full md:w-[340px]">
                      <div className="flex gap-2 mb-3 opacity-70">
                        <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                      </div>
                      <div>
                        <span className="text-pink-400">const</span> <span className="text-blue-300">ximiaStack</span> <span className="text-pink-400">=</span> <span className="text-yellow-300">{"{"}</span>
                        <br />
                        &nbsp;&nbsp;<span className="text-[#0092B3]">orchestrator</span><span className="text-pink-400">:</span> <span className="text-green-300">"n8n"</span>,
                        <br />
                        &nbsp;&nbsp;<span className="text-[#0092B3]">logicModel</span><span className="text-pink-400">:</span> <span className="text-green-300">"DeepSeek-R1"</span>,
                        <br />
                        &nbsp;&nbsp;<span className="text-[#0092B3]">persistence</span><span className="text-pink-400">:</span> <span className="text-green-300">"Supabase-Vector"</span>,
                        <br />
                        &nbsp;&nbsp;<span className="text-[#0092B3]">state</span><span className="text-pink-400">:</span> <span className="text-yellow-200">DecisionEngine</span>.<span className="text-blue-300">execute</span>()
                        <br />
                        <span className="text-yellow-300">{"}"}</span>;
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 3. CTA (DARK) */}
      <section ref={ctaRef} id="cta" className="py-32 md:py-40 bg-gray-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className={`text-6xl md:text-6xl font-bold leading-[0.9] tracking-tight mb-10 text-white transition-all duration-1000 ${ctaInView ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
              {t("cta_headline")}
            </h2>
            <p className={`text-2xl md:text-3xl text-gray-400 font-medium mb-16 max-w-3xl mx-auto leading-snug transition-all duration-1000 delay-300 ${ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              {t("cta_subheadline")}
            </p>
            <button 
              onClick={() => window.open("https://calendly.com/hola-ximia-ectr/ximia-demo", "_blank")}
              className={`relative overflow-hidden group bg-white text-black px-12 py-6 rounded-full text-xl font-bold transition-all duration-1000 delay-700 uppercase tracking-widest flex mx-auto items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.6)] ${ctaInView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-90"}`}
            >
              <span className="relative z-10 flex items-center gap-2">{t("cta_button")} <Zap size={20} fill="currentColor" /></span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-gray-100 to-gray-300 transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100"></div>
            </button>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="bg-gray-900 border-t border-gray-800/80 pt-16 pb-12 text-gray-400 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* TOP ROW: Logo & Copy | Contact */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-center gap-10 md:gap-0 pb-16">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <img src="/Ximia-Footer.png" alt="Ximia AI" className="h-60 md:h-60 mb-6 opacity-90 transition-opacity hover:opacity-100" />
              <p className="max-w-sm text-base text-gray-500 leading-relaxed">
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end">
              <a href="mailto:hola@ximia.ai" className="text-6xl md:text-8xl font-bold text-white hover:text-[#0092B3] transition-colors pb-1">
                hola@ximia.ai
              </a>
            </div>
          </div>

          {/* BOTTOM ROW: Logos */}
          <div className="pt-10 pb-12 border-y border-gray-800/60 mb-8 grid grid-cols-4 md:grid-cols-8 place-items-center gap-y-8 w-full">
            <img src="/logos/marketeam.png" alt="Marketeam" className="h-9 md:h-14 w-auto opacity-50 hover:opacity-100 transition-all duration-300 object-contain" />
            <img src="/logos/ad.png" alt="AD" className="h-12 md:h-24 scale-110 w-auto opacity-50 hover:opacity-100 transition-all duration-300 object-contain" />
            <img src="/logos/link.png" alt="Link" className="h-10 md:h-20 w-auto opacity-50 hover:opacity-100 transition-all duration-300 object-contain" />
            <img src="/logos/n8n.png" alt="n8n" className="h-4 md:h-8 w-auto opacity-50 hover:opacity-100 transition-all duration-300 object-contain" />
            <img src="/logos/botpress.png" alt="Botpress" className="h-4 md:h-8 w-auto opacity-50 hover:opacity-100 transition-all duration-300 object-contain" />
            <img src="/logos/deepseek.png" alt="DeepSeek" className="h-4 md:h-8 w-auto opacity-50 hover:opacity-100 transition-all duration-300 object-contain" />
            <img src="/logos/openai.png" alt="OpenAI" className="h-8 md:h-10 w-auto opacity-50 hover:opacity-100 transition-all duration-300 object-contain" />
            <img src="/logos/hubspot.png" alt="Hubspot" className="h-8 md:h-8 w-auto opacity-50 hover:opacity-100 transition-all duration-300 object-contain" />
          </div>

          <div className="flex flex-col-reverse md:flex-row justify-between items-center text-xs text-gray-600">
            <span>&copy; {new Date().getFullYear()} Ximia AI. {t("footer_rights")}</span>
            <div className="flex gap-6 mb-4 md:mb-0">
              <a href="#" className="hover:text-gray-400 transition-colors">{t("footer_privacy")}</a>
              <a href="#" className="hover:text-gray-400 transition-colors">{t("footer_terms")}</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}