import React from "react";
import { useEffect, useState } from "react";

export default function App() {

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // CHAT DATA
  const messages = [
    { from: "user", text: "I'm looking for a house for my family" },
    { from: "ai", text: "I see, that's great, a family home. How many people?" },
    { from: "user", text: "4, two kids" },
    {
      from: "ai",
      text: "Perfect — A 3-bedroom home with separate space to each kid sounds good? I can suggest some houses designed just for families like yours."
    }
  ];

  // STATE
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // LOOP + SEQUENCE
  useEffect(() => {
    if (currentIndex < messages.length) {
      const timeout = setTimeout(() => {
        setVisibleMessages((prev) => [...prev, messages[currentIndex]]);
        setCurrentIndex((prev) => prev + 1);
      }, 900);

      return () => clearTimeout(timeout);
    } else {
      // loop reset
      const reset = setTimeout(() => {
        setVisibleMessages([]);
        setCurrentIndex(0);
      }, 2500);

      return () => clearTimeout(reset);
    }
  }, [currentIndex, messages]);

  const fullText1 = "Ximia AI doesn’t chat.";
  const fullText2 = "It converts.";

  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");

  useEffect(() => {
      let i = 0;

      const typing1 = setInterval(() => {
        setText1(fullText1.slice(0, i + 1));
        i++;

        if (i === fullText1.length) {
          clearInterval(typing1);

          let j = 0;

          setTimeout(() => {
            const typing2 = setInterval(() => {
              setText2(fullText2.slice(0, j + 1));
              j++;

              if (j === fullText2.length) {
                clearInterval(typing2);
              }
            }, 80);
          }, 700);
        }
      }, 80);

      return () => clearInterval(typing1);
    }, []);

  return (
    <div className="font-sans text-gray-900">

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="font-bold text-xl">Ximia</h1>
          <nav className="space-x-6 hidden md:block">
            <button onClick={() => scrollTo("problem")} className="hover:text-gray-500">Why our AI</button>
            <button onClick={() => scrollTo("solution")} className="hover:text-gray-500">How it works</button>
            <button onClick={() => scrollTo("impact")} className="hover:text-gray-500">The Impact</button>
          </nav>
          <button
            onClick={() => scrollTo("demo")}
            className="bg-black text-white px-4 py-2 rounded-xl"
          >
            Ver demo
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-40 pb-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-stretch">

          {/* LEFT SIDE */}
          <div>

            <h2 className="text-7xl md:text-8xl lg:text-[110px] font-bold leading-[0.9] tracking-tight mb-6">

              <span className="block">
                {text1}
              </span>

              <span className="block">
                {text2}
                 <span className="animate-blink">|</span>
              </span>

            </h2>

            <p className="text-xl text-gray-600 mb-8">
              Ximia turns visitors into qualified buyers and guides them to the right property automatically.
            </p>

            <div className="flex gap-4">
              <button className="bg-black text-white px-6 py-3 rounded-xl text-lg">
                Try the demo
              </button>
              <button className="border px-6 py-3 rounded-xl text-lg">
                Watch how it works
              </button>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-full flex flex-col justify-start gap-4 overflow-hidden">
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

      <div className="w-full h-[500px] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/demo.mp4" type="video/mp4" />
        </video>
      </div>

      {/* THE PROBLEM */}
      <section id="problem" className="py-32 text-center">
        <div className="max-w-4xl mx-auto px-6">

          <p className="text-gray-500 mb-6">
            Most websites lose their best opportunities
          </p>

          <h2 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
            Visitors come.
            <br /> They ask.
            <br /> They leave.
          </h2>

          <p className="text-lg text-gray-600">
            No follow-up. No qualification. No conversion.
          </p>

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