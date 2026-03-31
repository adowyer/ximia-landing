import React, { useEffect, useRef, useState } from "react";

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

  // LANG STATE
  const [lang, setLang] = useState(
    localStorage.getItem("lang") ||
    (navigator.language.startsWith("es") ? "es" : "en")
  );

  useEffect(() => {
    i18nInstance.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  }, [lang, i18nInstance]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // CHAT DATA
  const rawConversations = t("hero_demo_conversations", { returnObjects: true });
  const conversations = Array.isArray(rawConversations)
    ? rawConversations
    : [];

  const [conversationIndex, setConversationIndex] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const messages = Array.isArray(conversations[conversationIndex])
    ? conversations[conversationIndex]
    : [];


  // CHAT STATE
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
      // ⏱ pausa de lectura inteligente
      const lastMessages = Array.isArray(messages)
        ? messages.slice(-2)
        : [];

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

  // HERO TYPEWRITER
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

    // 🔥 RESET estado al cambiar idioma
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

            if (j === fullText2.length) {
              clearInterval(typing2);
            }
          }, 50);
        }, 700);
      }
    }, 50);

    // 🔥 COMPLETE CLEANUP 
    return () => {
      clearInterval(typing1);
      clearInterval(typing2);
      clearTimeout(delayTimeout);
    };

  }, [fullText1, fullText2]);

  // FADE PROBLEM TEXT

  const headlineRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.4 }
    );

    if (headlineRef.current) {
      observer.observe(headlineRef.current);
    }

    return () => {
      if (headlineRef.current) {
        observer.unobserve(headlineRef.current);
      }
    };
  }, []);

  return (
    <div className="font-sans text-gray-900">

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="font-bold text-xl">Ximia</h1>
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
      <section className="pt-40 pb-32 bg-gradient-to-b from-white to-gray-50">
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
                className={`flex ${
                  msg.from === "user" ? "justify-end" : "items-start gap-2"
                }`}
              >
                {msg.from === "ai" && (
                  <img src="/AI-Icon.gif" className="w-6 h-6 mt-1" />
                )}

                <div
                  className={`p-3 rounded-xl max-w-[75%] transition-all duration-300 ${
                    msg.from === "user"
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
      <section className="py-32 text-center bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xl md:text-3xl text-gray-700 mb-8">
            {t("problem_intro_line1")}
          </p>
          <p className="text-2xl md:text-6xl font-bold text-gray-900 leading-tight">
            {t("problem_intro_line2")}
          </p>
        </div>
      </section>

      <section className="py-40 bg-gray-900 text-white text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h2 ref={headlineRef} className="text-5xl md:text-8xl font-bold leading-tight tracking-tight mb-10">
          <span className={`block ${visible ? "animate-slideIn" : "opacity-0"}`}>
            {t("problem_headline", { returnObjects: true })[0]}
          </span>
          <span className={`block ${visible ? "animate-slideIn delay-200" : "opacity-0"}`}>
            {t("problem_headline", { returnObjects: true })[1]}
          </span>
          <span className="block" style={{ opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-40px)", transition: "transform 2s ease-out, opacity 1.2s ease-out", transitionDelay: visible ? "0.7s" : "0s" }} >
            <span className="text-white" style={{color: visible ? "#4b5563" : "#ffffff", transition: "color 1.5s ease", transitionDelay: visible ? "1.6s" : "0s"}} >
            {t("problem_headline", { returnObjects: true })[2]}</span>
          </span>
        </h2>

          <p className="text-2xl md:text-2xl text-gray-400 mb-12">
            {t("problem_subtext")}
          </p>

          {/* STAT */}
          <div className="mb-16">
            <p className="text-6xl md:text-8xl font-bold">
              {t("problem_stat_value")}
            </p>
            <p className="text-gray-400 mt-2">
              {t("problem_stat_caption")}
            </p>
          </div>

          {/* RESULT */}
          <p className="text-2xl font-semibold mb-16">
            {t("problem_result")}
          </p>

          {/* VERDICT */}
          <div className="max-w-2xl mx-auto">
            <p className="text-3xl md:text-4xl font-semibold leading-tight mb-6">
              “{t("problem_quote")}”
            </p>

            <p className="text-gray-400 mb-4">
              {t("problem_quote_sub")}
            </p>

            <p className="font-medium">
              {t("problem_quote_closing")}
            </p>
          </div>

        </div>
      </section>

      {/* THE SOLUTION */}
      <section id="solution" className="py-40 bg-gray-50 text-center">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-6xl md:text-7xl font-bold leading-[0.9] tracking-tight mb-16">
            Ximia changes that.
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            <div className="p-10 rounded-3xl bg-white shadow-md hover:shadow-xl transition text-left">
              <div className="text-4xl mb-6">⚡</div>
              <h3 className="font-semibold text-2xl mb-3">
                Understand instantly
              </h3>
              <p className="text-gray-600 text-lg">
                Knows what the user wants in seconds, without forms or friction.
              </p>
            </div>

            <div className="p-10 rounded-3xl bg-white shadow-md hover:shadow-xl transition text-left">
              <div className="text-4xl mb-6">🎯</div>
              <h3 className="font-semibold text-2xl mb-3">
                Qualify automatically
              </h3>
              <p className="text-gray-600 text-lg">
                Filters real buyers from noise and focuses only on high-intent users.
              </p>
            </div>

            <div className="p-10 rounded-3xl bg-white shadow-md hover:shadow-xl transition text-left">
              <div className="text-4xl mb-6">📈</div>
              <h3 className="font-semibold text-2xl mb-3">
                Guide to conversion
              </h3>
              <p className="text-gray-600 text-lg">
                Recommends, explains and moves users forward until they’re ready to buy.
              </p>
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