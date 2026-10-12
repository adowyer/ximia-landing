// The frame every page under /new wears: the live landing's header and footer, rebuilt
// from the classes in App.jsx. See DESIGN_FROM_VENDER.md for where each one was read.
import React from "react";
import { DOORS, openCalendly } from "./lib";

export function Header({ here }) {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 gap-4">
        <a href="/new/" className="flex items-center gap-2 transition-transform hover:scale-105 shrink-0">
          <img src="/Ximia-Header.png" alt="Ximia AI" className="h-12 md:h-16 w-auto object-contain" />
        </a>

        <nav className="space-x-6 hidden md:block font-medium">
          {DOORS.filter((d) => d.label !== "Ximia").map((door) => (
            <a
              key={door.href}
              href={door.href}
              className={
                door.href === here
                  ? "text-[#0092B3]"
                  : "hover:text-gray-500 transition-colors"
              }
            >
              {door.label}
            </a>
          ))}
        </nav>

        <button
          onClick={openCalendly}
          className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md hover:scale-105 transition-all shrink-0"
        >
          Agendar una demo
        </button>
      </div>
    </header>
  );
}

// A note that only exists while this lives under /new: whoever lands here by accident has
// to be able to tell a proposal from the product.
export function DraftNotice() {
  return (
    <div className="fixed bottom-0 left-0 w-full z-40 bg-black/85 backdrop-blur text-white text-center text-xs md:text-sm px-6 py-2.5">
      Boceto en revisión · la web publicada es{" "}
      <a href="/" className="underline hover:text-[#0092B3] transition-colors">
        ximia.ai
      </a>
    </div>
  );
}

const PARTNERS = [
  { href: "https://linkargentina.com", src: "/logos/link.png", alt: "Link", h: "h-10 md:h-20" },
  { href: "https://andreadowyer.com", src: "/logos/ad.png", alt: "AD", h: "h-12 md:h-24 scale-110" },
  { href: "https://marketeam.xyz", src: "/logos/marketeam.png", alt: "Marketeam", h: "h-9 md:h-14" },
  { href: "https://n8n.io", src: "/logos/n8n.png", alt: "n8n", h: "h-4 md:h-8" },
  { href: "https://developers.openai.com", src: "/logos/openai.png", alt: "OpenAI", h: "h-8 md:h-10" },
  { href: "https://hubspot.com", src: "/logos/hubspot.png", alt: "Hubspot", h: "h-8 md:h-8" },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800/80 pt-16 pb-20 text-gray-400 relative z-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 md:gap-0 pb-16">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <img
              src="/Ximia-Footer.png"
              alt="Ximia AI"
              className="h-60 md:h-60 mb-6 opacity-90 transition-opacity hover:opacity-100"
            />
          </div>

          <div className="flex flex-col items-center md:items-end">
            <a
              href="mailto:hola@ximia.ai"
              className="text-6xl md:text-8xl font-bold text-white hover:text-[#0092B3] transition-colors pb-1"
            >
              hola@ximia.ai
            </a>
          </div>
        </div>

        <div className="pt-10 pb-12 border-y border-gray-800/60 mb-8 grid grid-cols-3 md:grid-cols-6 place-items-center gap-y-8 w-full">
          {PARTNERS.map((p) => (
            <a key={p.src} href={p.href} target="_blank" rel="noopener noreferrer">
              <img
                src={p.src}
                alt={p.alt}
                className={`${p.h} w-auto opacity-50 hover:opacity-100 transition-all duration-300 object-contain`}
              />
            </a>
          ))}
        </div>

        <div className="flex flex-col-reverse md:flex-row justify-between items-center text-xs text-gray-600 gap-4">
          <span>&copy; {new Date().getFullYear()} Ximia AI. Todos los derechos reservados.</span>
          <div className="flex gap-6">
            {DOORS.map((door) => (
              <a key={door.href} href={door.href} className="hover:text-gray-400 transition-colors">
                {door.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Page({ here, children }) {
  return (
    <div className="font-sans text-gray-900">
      <Header here={here} />
      {children}
      <Footer />
      <DraftNotice />
    </div>
  );
}
