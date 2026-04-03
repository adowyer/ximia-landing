import React, { useEffect, useRef, useState } from "react";
import { Zap, BarChart3, Target, Check, Database, Cpu, Home, Braces, Landmark, Radar } from "lucide-react";

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

  const problemItems = t("problem_items", { returnObjects: true }) || [];
  console.log("problem_items:", problemItems, typeof problemItems);

  const [stage, setStage] = useState(0);
  const problemRef = useRef(null);
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
        threshold: 0.75 // delay until prominent
      }
    );

    if (problemRef.current) {
      observer.observe(problemRef.current);
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
            <img src="/Logo-X-b.png" alt="Ximia IA" className="h-12 md:h-16 w-auto object-contain" />
          </button>
          <nav className="space-x-6 hidden md:block">
            <button onClick={() => scrollTo("problem")} className="hover:text-gray-500">
              {t("nav_problem")}
            </button>

            <button onClick={() => scrollTo("solution")} className="hover:text-gray-500">
              {t("nav_solution")}
            </button>

            <button onClick={() => scrollTo("impact")} className="hover:text-gray-500">
              {t("nav_impact")}
            </button>
          </nav>
          <button
            onClick={() => scrollTo("demo")}
            className="bg-black text-white px-4 py-2 rounded-xl"
          >
            Ver demo
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

            <p className="text-2xl md:text-3xl text-gray-700 leading-snug mb-10 max-w-xl">
              <span className="block">
                {t("hero_sub_line_1")}
              </span>
              <span className="block text-gray-500">
                {t("hero_sub_line_2")}
              </span>
            </p>

            <div className="flex gap-4">
              <button className="border px-6 py-3 rounded-xl text-lg">
                {t("hero_cta_secondary")}
              </button>
              <button className="bg-black text-white px-6 py-3 rounded-xl text-lg">
                {t("hero_cta_primary")}
              </button>
            </div>

          </div>

          {/* RIGHT SIDE: Interactive Demo */}
          <div className="w-full h-full flex flex-col gap-6 justify-between">

            {/* THE CHAT BOX */}
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-[2rem] p-4 md:p-6 shadow-xl flex flex-col overflow-hidden relative flex-1 min-h-[420px]">
              {/* MESSAGES */}
              <div key={activeScenario} className="flex-1 flex flex-col justify-start gap-4 overflow-y-auto pb-8 scrollbar-hide">
                {heroScenarios[activeScenario]?.messages?.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex animate-step ${msg.from === "user" ? "justify-end" : "items-start gap-2"}`}
                    style={{ animationDelay: `${i * 0.15}s`, animationFillMode: "both" }}
                  >
                    {msg.from === "ai" && (
                      <img src="/AI-Icon.gif" alt="AI Agent" className="w-6 h-6 mt-1 rounded-full shadow-sm" />
                    )}

                    <div
                      className={`p-3 rounded-2xl max-w-[85%] md:max-w-[80%] text-sm md:text-base leading-relaxed shadow-sm ${msg.from === "user"
                          ? "bg-[#0092B3] text-white rounded-br-sm"
                          : "bg-gray-50 border border-gray-100 text-gray-800 rounded-bl-sm"
                        }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom fading gradient to simulate scroll bounds */}
              <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-[2rem]"></div>
            </div>

            {/* THE CONTROLS (OUTSIDE, BELOW, CENTERED) */}
            <div className="flex flex-col items-center gap-3 mt-2">
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
          className="w-full h-full object-cover"
        >
          <source src="/demo2.mp4" type="video/mp4" />
        </video>
      </div>

      {/* THE PROBLEM */}
      <section className="py-40 md:py-48 text-center bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xl md:text-4xl text-gray-700 mb-8">
            {t("problem_intro_line1")}
          </p>
          <p className="text-2xl md:text-6xl font-bold text-gray-900 leading-tight">
            {t("problem_intro_line2")}
          </p>
        </div>
      </section>

      <section ref={problemRef} className="py-40 bg-gray-900 text-white text-center">
        <div className="max-w-8xl mx-auto px-6">
          <h2 ref={headlineRef} className="text-5xl md:text-8xl font-bold leading-tight tracking-tight mb-10">
            <span className="block">
              {visible ? textLine1 : <span className="opacity-0">{t("problem_headline", { returnObjects: true })[0]}</span>}
            </span>
            <span className="block">
              {visible ? textLine2 : <span className="opacity-0">{t("problem_headline", { returnObjects: true })[1]}</span>}
            </span>
            <span className={`block transform transition-all duration-[2000ms] ease-out ${isLine2Done ? "translate-x-0 opacity-100 delay-300" : "-translate-x-10 opacity-0"}`} >
              <span className={`text-white ${isLine2Done ? "animate-fadeToGray" : ""}`} style={{ animationDelay: isLine2Done ? "1s" : "0s" }} >
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
          <div className="mb-16 max-w-8xl mx-auto text-center">
            <p className={`text-6xl md:text-8xl font-bold transition-all duration-700 ${stage >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}>
              {t("problem_stat_value")}
            </p>

            <p className={`text-gray-400 mt-2 md:text-5xl transition-all duration-700 ${stage >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}>
              {t("problem_stat_caption")}
            </p>

            <div className="mt-10 space-y-4 text-gray-400 text-xl md:text-2xl">
              {problemItems.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center transition-all duration-700 ${stage >= 4
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                    }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <p className="opacity-90 text-center max-w-2xl">
                    {item}
                  </p>

                  {index < problemItems.length - 1 && (
                    <div className="h-px bg-white/10 w-16 mt-4" />
                  )}
                </div>
              ))}
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
            <p className="text-2xl md:text-6xl font-semibold mb-16">
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
            {/* The 'X' watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <img src="/X.png" alt="Ximia Watermark" className="w-[800px] h-auto object-contain" />
            </div>

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
                        <span className="font-bold flex items-center gap-2 px-3 py-1.5"><Target size={18}/> CRM DASHBOARD</span>
                        <span className="opacity-70 flex items-center"><BarChart3 size={18}/></span>
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

      {/* 1. BACKEND / TECHNOLOGY */}
      <section className="py-24 md:py-32 bg-gray-50 border-t border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div ref={backendTitleRef} className="text-center mb-16 md:mb-24 max-w-4xl mx-auto">
            <h2 className="text-7xl md:text-7xl font-bold tracking-tight mb-6 flex flex-wrap justify-center gap-x-3 gap-y-2">
              {Array.isArray(t("backend_title_words", { returnObjects: true }))
                ? t("backend_title_words", { returnObjects: true }).map((word, idx, arr) => (
                  <span
                    key={idx}
                    className={`inline-block ${backendInView ? "animate-step" : "opacity-0"} ${idx === 0 ? "text-gray-900" : idx === arr.length - 1 ? "text-[#0092B3]" : "text-gray-500"}`}
                    style={{ animationDelay: `${idx * 0.4}s`, animationFillMode: "both" }}
                  >
                    {word}
                  </span>
                ))
                : <span className="text-gray-900">{t("backend_title")}</span>
              }
            </h2>
            <p className={`text-xl md:text-2xl text-gray-500 leading-relaxed transition-opacity duration-1000 ${backendInView ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "1.6s" }}>
              {t("backend_subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {Array.isArray(t("backend_items", { returnObjects: true })) && t("backend_items", { returnObjects: true }).map((item, idx) => (
              <div
                key={idx}
                className={`transition-all duration-700 ${backendInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${1200 + idx * 200}ms` }}
              >
                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full">
                  <div className="w-14 h-14 bg-[#0092B3]/10 text-[#0092B3] rounded-2xl flex items-center justify-center mb-8 transition-transform duration-300 hover:scale-110">
                    {idx === 0 ? <Braces size={28} /> : idx === 1 ? <Landmark size={28} /> : <Radar size={28} />}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-500 text-lg leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. THE VS TABLE (LIGHT) */}
      <section ref={tableRef} className="py-32 md:py-40 bg-white text-gray-900 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-10">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-center mb-16 md:mb-20">
              {t("vs_title")}
            </h2>

            <div className={`bg-gray-50 border border-gray-200 rounded-[2.5rem] p-8 md:p-12 shadow-2xl transition-all duration-1000 transform ${tableInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
              <div className="grid grid-cols-3 gap-6 border-b border-gray-200 pb-6 mb-6">
                <div className="text-gray-400 font-bold uppercase tracking-widest text-xs md:text-sm">Área</div>
                <div className="text-gray-500 font-bold text-base md:text-xl">Chatbot Tradicional</div>
                <div className="text-[#0092B3] font-black text-xl md:text-2xl">Ximia</div>
              </div>

              {Array.isArray(t("vs_features", { returnObjects: true })) && t("vs_features", { returnObjects: true }).map((feat, idx) => (
                <div key={idx} className={`grid grid-cols-3 gap-6 items-center py-6 transition-all duration-700 ease-out transform ${tableInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"} ${idx !== t("vs_features", { returnObjects: true }).length - 1 ? 'border-b border-gray-200' : ''}`} style={{ transitionDelay: `${400 + idx * 150}ms` }}>
                  <div className="text-gray-500 text-sm md:text-lg font-medium">{feat.feature}</div>
                  <div className="text-gray-400 text-base md:text-xl">{feat.old}</div>
                  <div className="text-gray-900 font-bold text-lg md:text-2xl flex items-center gap-3">
                    <Check className="text-green-500" strokeWidth={3} /> {feat.ximia}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. CTA (DARK) */}
      <section ref={ctaRef} className="py-32 md:py-40 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className={`text-6xl md:text-8xl font-black leading-[0.9] tracking-tight mb-10 text-white transition-all duration-1000 ${ctaInView ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
              {t("cta_headline")}
            </h2>
            <p className={`text-2xl md:text-3xl text-gray-400 font-medium mb-16 max-w-3xl mx-auto leading-snug transition-all duration-1000 delay-300 ${ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              {t("cta_subheadline")}
            </p>
            <button className={`relative overflow-hidden group bg-white text-black px-12 py-6 rounded-full text-xl font-bold transition-all duration-1000 delay-700 uppercase tracking-widest flex mx-auto items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.6)] ${ctaInView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-90"}`}>
              <span className="relative z-10 flex items-center gap-2">{t("cta_button")} <Zap size={20} fill="currentColor" /></span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-gray-100 to-gray-300 transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100"></div>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}