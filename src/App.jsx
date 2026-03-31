import React, { useEffect, useRef, useState } from "react";
import { Zap, BarChart3, Target, Check } from "lucide-react";

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

  const rawConversations = t("hero_demo_conversations", { returnObjects: true });
  const conversations = Array.isArray(rawConversations) ? rawConversations : [];

  const [conversationIndex, setConversationIndex] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const messages = Array.isArray(conversations[conversationIndex])
    ? conversations[conversationIndex]
    : [];

  useEffect(() => {
    if (messages.length > 0) {
      setVisibleMessages([messages[0]]);
      setCurrentIndex(1);
    }
  }, [conversationIndex]);

  useEffect(() => {
    if (!messages.length) return;

    if (currentIndex < messages.length) {
      const isLastMessage = currentIndex === messages.length - 1;
      const delay = isLastMessage ? 2000 : 1200;

      const timeout = setTimeout(() => {
        setVisibleMessages((prev) => [...prev, messages[currentIndex]]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else {
      const lastMessages = messages.slice(-2);
      const totalChars = lastMessages.reduce(
        (acc, msg) => acc + (msg?.text?.length || 0),
        0
      );

      const readingTime = totalChars * 50;
      const finalDelay = Math.max(readingTime, 4000);

      const reset = setTimeout(() => {
        setConversationIndex((prev) => (prev + 1) % conversations.length);
        setVisibleMessages([]);
        setCurrentIndex(0);
      }, finalDelay);

      return () => clearTimeout(reset);
    }
  }, [currentIndex, messages, conversations.length]);

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
        threshold: 0.4 // delay
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

          {/* RIGHT SIDE */}
          <div className="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm h-full flex flex-col justify-start gap-4 overflow-hidden">
            {visibleMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from === "user" ? "justify-end" : "items-start gap-2"
                  }`}
              >
                {msg.from === "ai" && (
                  <img src="/AI-Icon.gif" className="w-6 h-6 mt-1" />
                )}

                <div
                  className={`p-3 rounded-xl max-w-[75%] transition-all duration-300 ${msg.from === "user"
                    ? "bg-[#0092B3] text-white"
                    : "bg-gray-100"
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

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
            {/* The giant 'X' background watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <img src="/X.png" alt="Ximia Watermark" className="w-[800px] h-auto object-contain" />
            </div>

            {/* The actual text */}
            <h2 className="text-5xl md:text-8xl font-black leading-tight tracking-tight text-center text-gray-900 relative z-10">
              Ximia IA cambia eso.
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-16 relative items-start">

            {/* LEFT: Scrolling Steps */}
            <div className="w-full md:w-5/12 space-y-40 py-20 pb-80 md:pb-[60vh]">
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

            {/* RIGHT: Sticky Visual Container */}
            <div className="hidden md:flex w-full md:w-7/12 sticky top-40 h-[600px] bg-gray-100 rounded-3xl border border-gray-200 shadow-[inset_0_2px_20px_rgba(0,0,0,0.04)] p-10 flex-col items-center justify-center overflow-hidden relative">

              {/* BRAND LOGO (FIXED) */}
              <div className="absolute top-10 left-10">
                <img src="/Logo-X-ia.png" alt="Ximia AI" className="h-10 md:h-14 w-auto object-contain opacity-100" />
              </div>

              <div key={activeStep} className="w-full h-full flex items-center justify-center animate-step">
                {activeStep === 0 && (
                  <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                    <div className="bg-[#0092B3] text-white p-5 rounded-2xl rounded-bl-sm w-5/6 mb-6 text-lg shadow-sm">
                      Busco un departamento para inversión, tengo USD 80k.
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-400 uppercase tracking-widest bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <Zap size={20} className="text-[#0092B3]" /> Intención: INVERSIÓN
                    </div>
                  </div>
                )}

                {activeStep === 1 && (
                  <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-6 mb-6">
                      <div className="flex items-center gap-3">
                        <BarChart3 size={28} className="text-blue-600" />
                        <span className="text-gray-900 font-bold text-2xl">Score Financiero</span>
                      </div>
                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold shadow-sm">Validado</span>
                    </div>
                    <div className="space-y-4 text-lg">
                      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                        <span className="text-gray-500 font-medium">Presupuesto</span>
                        <span className="font-bold text-gray-900">USD 250k</span>
                      </div>
                      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                        <span className="text-gray-500 font-medium">Perfil de Riesgo</span>
                        <span className="font-bold text-gray-900">Conservador</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                    <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl mb-6 w-full flex items-center justify-center shadow-inner">
                      <Target size={48} className="text-white opacity-50" />
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-2xl text-gray-900">Proyecto Palmas</h4>
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold">98% Match</span>
                    </div>
                    <p className="text-gray-500 text-base mb-4 font-medium">Ideal para el presupuesto y objetivo de rentabilidad detectado.</p>
                    <button className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition">
                      Avanzar propuesta
                    </button>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="w-full max-w-md bg-gray-900 text-white rounded-3xl p-10 shadow-2xl flex flex-col items-center text-center">
                    <div className="bg-green-500/20 p-6 rounded-full border border-green-500/30 mb-8 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                      <Check size={56} className="text-green-400" />
                    </div>
                    <h4 className="font-bold text-3xl mb-3">Oportunidad Creada</h4>
                    <p className="text-gray-400 text-lg font-medium leading-relaxed">
                      El equipo comercial acaba de recibir un nuevo lead listo para firmar.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section id="impact" className="py-32 text-center">
        <div className="max-w-4xl mx-auto px-6">

          <h2 className="text-6xl md:text-7xl font-bold leading-[0.9] tracking-tight mb-6">
            This isn’t a chatbot.
            <br /> It’s your best salesperson.
          </h2>

          <p className="text-xl text-gray-600 mb-10">
            Working 24/7. Never missing a lead.
          </p>

          <button className="bg-black text-white px-8 py-4 rounded-xl text-lg">
            Start converting visitors
          </button>

        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-black text-white text-center">
        <h2 className="text-3xl font-bold mb-6">
          Empezá a vender más hoy
        </h2>
        <button className="bg-white text-black px-6 py-3 rounded-xl">
          Solicitar demo
        </button>
      </section>

    </div>
  );
}