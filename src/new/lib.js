// Everything under /new that is not a component. Kept out of the .jsx files so fast
// refresh works: a module that mixes components with plain exports loses it.
import { useEffect, useRef, useState } from "react";

export const ACCENT = "#0092B3";
export const HIGHLIGHT = "#98daed";

// The four doors. Vender points at the live page and is deliberately NOT a route here:
// a second copy of it is what this directory exists to avoid.
export const DOORS = [
  { href: "/new/", label: "Ximia" },
  { href: "/", label: "Vender", live: true },
  { href: "/new/otorgar/", label: "Otorgar" },
  { href: "/new/recaudar/", label: "Recaudar" },
];

const CALENDLY = "https://calendly.com/hola-ximia-ectr/ximia-demo";

export function openCalendly() {
  if (window.Calendly) {
    window.Calendly.initPopupWidget({ url: CALENDLY });
  } else {
    window.open(CALENDLY, "_blank");
  }
}

// Vender reveals every band on scroll entry with useRef + IntersectionObserver. Same here.
export function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setInView(true),
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, inView];
}
