// The bands of the live landing, rebuilt one by one. Nothing here is imported from
// App.jsx: the classes were read from it (DESIGN_FROM_VENDER.md maps each to its line).
import React from "react";
import { Check } from "lucide-react";
import { ACCENT, HIGHLIGHT, useInView } from "./lib";

// 2 · HERO. A negation, then the verb. The verb is the only thing each door changes.
// Vender's 130px works because its negation is three words. A longer one wraps to four
// lines and pushes the verb off the first screen, which is the whole point of the band —
// so a long negation drops one step instead of breaking the shape. Found by looking at
// the page, not by reading it.
const HERO_SIZE = {
  wide: "text-7xl md:text-8xl lg:text-[130px]",
  tight: "text-6xl md:text-7xl lg:text-[104px]",
};

export function Hero({ negation, verb, subLead, subTail, onPrimary, onSecondary, aside, size = "wide" }) {
  return (
    <section className="pt-44 pb-36 md:pt-52 md:pb-44 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className={`${HERO_SIZE[size]} font-bold leading-[0.9] tracking-tight mb-6`}>
            <span className="block">{negation}</span>
            <span className="block text-gray-500">{verb}</span>
          </h1>

          <p className="text-[22px] text-gray-700 leading-[1.5] mb-10 max-w-xl">
            <span className="block">{subLead}</span>
            <span className="block text-gray-500">{subTail}</span>
          </p>

          <div className="flex flex-wrap gap-4">
            {onSecondary && (
              <button
                onClick={onSecondary.onClick}
                className="border border-gray-300 px-6 py-3 rounded-xl text-lg hover:bg-gray-50 transition-colors"
              >
                {onSecondary.label}
              </button>
            )}
            <button
              onClick={onPrimary.onClick}
              className="bg-black text-white px-6 py-3 rounded-xl text-lg hover:opacity-90 transition-opacity"
            >
              {onPrimary.label}
            </button>
          </div>
        </div>

        <div className="w-full">{aside}</div>
      </div>
    </section>
  );
}

// 3 · STATEMENT. A quiet lead, then one line at full weight.
export function Statement({ lead, punch, icon }) {
  return (
    <section className="py-20 md:py-40 text-center bg-white">
      <div className="w-full max-w-7xl mx-auto px-6 flex flex-col items-center">
        {lead && (
          <p className="text-xl md:text-3xl text-gray-600 leading-snug whitespace-pre-line max-w-6xl mb-12">
            {lead}
          </p>
        )}
        <p className="text-4xl md:text-[4rem] leading-[1.1] font-bold text-gray-900 tracking-tight whitespace-pre-line max-w-full text-center">
          {icon}
          {punch}
        </p>
      </div>
    </section>
  );
}

const Arrow = () => (
  <div className="flex justify-center my-12">
    <div className="animate-bounce text-gray-500 text-6xl">↓</div>
  </div>
);

// 4 · DARK STAT. The giant figure, its source line, the Sin/Con flows, the result.
// `source` has no counterpart in Vender and is required here on purpose: Vender's +75%
// is an industry figure, ours are our own measurements and have to say so.
export function DarkStat({ headline, highlight, figure, caption, source, without, with_, result }) {
  const [ref, inView] = useInView(0.2);

  return (
    <section ref={ref} className="py-40 bg-gray-900 text-white text-center">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl md:text-8xl font-bold leading-tight tracking-tight mb-10">
          {headline.map((line) => (
            <span key={line} className="block">{line}</span>
          ))}
          {highlight && (
            <span className="block" style={{ color: HIGHLIGHT }}>{highlight}</span>
          )}
        </h2>

        <Arrow />

        <div className="mb-16 max-w-5xl mx-auto text-center flex flex-col items-center">
          <p
            className={`text-[8rem] md:text-[11rem] leading-none tracking-tighter transition-all duration-500 ease-out ${
              inView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-90"
            }`}
          >
            {figure}
          </p>

          <p
            className={`text-gray-400 mt-2 md:text-5xl transition-all duration-700 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {caption}
          </p>

          {source && (
            <p className="text-gray-500 text-sm md:text-base mt-8 max-w-2xl leading-relaxed">
              {source}
            </p>
          )}

          <div
            className={`mt-16 grid grid-cols-2 gap-0 max-w-4xl mx-auto transition-all duration-700 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="flex flex-col items-center pr-4 md:pr-8 border-r border-white/10">
              <p className="text-sm md:text-xl font-bold uppercase tracking-widest mb-8">{without.label}</p>
              {without.steps.map((step, idx, arr) => (
                <div key={step} className="flex flex-col items-center">
                  <p className={`text-center text-base md:text-xl ${idx === arr.length - 1 ? "font-bold" : "text-gray-400"}`}>
                    {step}
                  </p>
                  {idx < arr.length - 1 && <span className="text-gray-600 text-2xl my-3">↓</span>}
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center pl-4 md:pl-8">
              <p className="text-sm md:text-xl font-bold uppercase tracking-widest mb-8">{with_.label}</p>
              {with_.steps.map((step, idx, arr) => (
                <div key={step} className="flex flex-col items-center">
                  <p className={`text-center text-base md:text-xl ${idx === arr.length - 1 ? "font-bold" : "text-gray-300"}`}>
                    {step}
                  </p>
                  {idx < arr.length - 1 && <span className="text-2xl my-3">↓</span>}
                </div>
              ))}
            </div>
          </div>

          <Arrow />

          <p className="text-5xl md:text-8xl font-black leading-tight tracking-tight text-center text-gray-400">
            {result}
          </p>
        </div>
      </div>
    </section>
  );
}

// 5 · STEPPER. Vender drives this with a sticky visual and a scroll observer; here it is
// the same type scale laid out statically, which is the part that carries the look.
export function Stepper({ title, steps }) {
  const [ref, inView] = useInView(0.15);

  return (
    <section ref={ref} className="pt-20 pb-40 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative py-12 md:py-24 mb-20 flex items-center justify-center w-full">
          <h2 className="text-5xl md:text-8xl font-black leading-tight tracking-tight text-center text-gray-900">
            {title}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-24">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`flex flex-col gap-4 transition-all duration-700 ease-out ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex items-center gap-4" style={{ color: ACCENT }}>
                <span className="text-6xl font-black">0{index + 1}</span>
              </div>
              <div>
                <h3 className="text-4xl font-bold mb-4 text-gray-900">{step.title}</h3>
                <p className="text-2xl text-gray-500 font-medium leading-normal max-w-md">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 6 · VS TABLE.
export function VsTable({ title, columns, rows }) {
  const [ref, inView] = useInView(0.2);

  return (
    <section ref={ref} className="py-32 md:py-40 bg-gray-50 text-gray-900 border-b border-gray-100/50">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-5xl md:text-6xl tracking-tight font-bold text-center mb-16 md:mb-20">
          {title}
        </h2>

        <div
          className={`bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-xl transition-all duration-1000 transform ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="grid grid-cols-3 gap-4 md:gap-6 border-b border-gray-200 pb-6 mb-6">
            <div className="text-gray-400 uppercase tracking-widest text-xs md:text-sm">{columns[0]}</div>
            <div className="text-gray-500 font-bold text-base md:text-xl">{columns[1]}</div>
            <div className="font-bold text-xl" style={{ color: ACCENT }}>{columns[2]}</div>
          </div>

          {rows.map((row, idx) => (
            <div
              key={row.feature}
              className={`grid grid-cols-3 gap-4 md:gap-6 items-center py-6 transition-all duration-700 ease-out transform ${
                inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              } ${idx !== rows.length - 1 ? "border-b border-gray-200" : ""}`}
              style={{ transitionDelay: `${400 + idx * 150}ms` }}
            >
              <div className="text-gray-500 text-sm md:text-lg font-medium">{row.feature}</div>
              <div className="text-gray-400 text-base md:text-lg">{row.old}</div>
              <div className="text-gray-900 text-base md:text-lg flex items-start gap-3">
                <Check className="text-green-500 shrink-0 mt-1" strokeWidth={3} /> {row.ximia}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 7 · WHY XIMIA. The accent card carries the claims; the white one, the layers.
export function WhyXimia({ eyebrow, headline, intro, claims, panel }) {
  const [ref, inView] = useInView(0.15);

  return (
    <section ref={ref} className="py-24 md:py-32 bg-white border-t border-gray-100/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-6xl mb-16 md:mb-20">
          <p className="font-bold tracking-widest uppercase mb-4 text-sm md:text-base" style={{ color: ACCENT }}>
            {eyebrow}
          </p>
          <h2
            className={`whitespace-pre-line text-[46px] md:text-[85px] leading-[1.1] font-bold tracking-tight mb-8 transition-all duration-1000 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {headline}
          </h2>
          <p
            className={`text-xl md:text-3xl text-gray-500 leading-relaxed max-w-4xl transition-opacity duration-1000 delay-300 ${
              inView ? "opacity-100" : "opacity-0"
            }`}
          >
            {intro}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div
            className={`col-span-1 text-white rounded-3xl p-8 md:p-10 shadow-xl flex flex-col justify-between transition-all duration-1000 delay-500 transform ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
            style={{ backgroundColor: ACCENT }}
          >
            <div className="space-y-10">
              {claims.map((claim) => (
                <div key={claim.title} className="flex flex-col gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 mb-2">
                    {claim.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{claim.title}</h4>
                    <p className="text-white/80 leading-relaxed text-sm md:text-base">{claim.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
            <div
              className={`flex-grow bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-sm transition-all duration-1000 delay-700 transform ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
            >
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{panel.title}</h3>
              <p className="text-gray-500 text-xl mb-10 max-w-2xl leading-relaxed">{panel.subtitle}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                {panel.layers.map((layer, idx) => (
                  <div
                    key={layer.layer}
                    className="flex items-start gap-5 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
                  >
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
          </div>
        </div>
      </div>
    </section>
  );
}

// 8 · CTA. Always the "No X. Y." close.
export function CtaDark({ headline, subheadline, button, onClick }) {
  const [ref, inView] = useInView(0.3);

  return (
    <section ref={ref} className="py-32 md:py-40 bg-gray-900 text-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <h2
          className={`text-5xl md:text-6xl font-bold leading-[0.9] tracking-tight mb-10 text-white transition-all duration-1000 ${
            inView ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          {headline}
        </h2>
        <p
          className={`text-2xl md:text-3xl text-gray-400 font-medium mb-16 max-w-3xl mx-auto leading-snug transition-all duration-1000 delay-300 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {subheadline}
        </p>
        <button
          onClick={onClick}
          className={`relative overflow-hidden group bg-white text-black px-8 md:px-12 py-5 md:py-6 rounded-full text-base md:text-xl font-bold transition-all duration-1000 delay-700 uppercase tracking-widest flex mx-auto items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.6)] ${
            inView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-90"
          }`}
        >
          <span className="relative z-10">{button}</span>
          <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-gray-100 to-gray-300 transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
        </button>
      </div>
    </section>
  );
}
