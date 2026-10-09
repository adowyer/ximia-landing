/**
 * ⚠️ PORTED FROM ConstruirFácil (components/ximia/, lib/ximia/) on 2026-10-02, commit b11be4c.
 * This repo is React + Vite and that one is Next + TypeScript, so the files were transpiled
 * and live here as a COPY. Keep them in step: a change to how Ximia moves belongs in both.
 * The only parts that are meant to differ are the imports and `moments.js` (the lines).
 */
/**
 * XimiaMark — the Ximia "X" as a living agent avatar (replaces /AI-Icon.gif).
 *
 * The personality comes from behavior, not from a face: the widget derives the state from
 * what it already knows (panel opened, the person typing, waiting on n8n, reply being revealed)
 * and the mark reacts. Approved by Andrea on 2026-09-30; greeting = the X waving one arm.
 *
 * The X outline is traced from public/Ximia-AI_Logo.png (the brand logo, 2026-09-30). Each arm is
 * that outline clipped to a diagonal band, so the two can move independently.
 */
import { useEffect, useId, useRef, useState } from 'react';
import styles from './XimiaMark.module.css';
// Traced outline, in viewBox units (the crossing sits at 125, 118.5).
const X_PATH = 'M11.8 0.0 L91.9 0.0 L92.4 0.5 L93.8 0.7 L96.6 2.2 L102.1 8.3 L125.5 49.2 L126.4 48.6 L128.6 45.2 L151.1 8.5 L156.1 2.9 L159.8 0.7 L161.2 0.5 L161.7 0.0 L238.2 0.0 L240.3 1.4 L242.0 3.1 L243.2 5.8 L243.2 9.0 L242.7 10.5 L181.0 108.0 L177.1 114.3 L176.9 115.1 L249.4 226.5 L250.0 228.2 L250.0 231.2 L248.8 233.9 L246.4 236.2 L243.5 237.0 L162.3 236.8 L159.5 236.0 L156.6 234.1 L152.5 229.7 L124.7 186.4 L123.3 184.5 L122.8 184.4 L94.6 229.9 L90.0 234.8 L87.7 236.2 L83.4 237.0 L4.6 236.8 L2.6 235.6 L-0.3 232.1 L-0.3 227.3 L0.2 227.0 L1.1 224.9 L71.7 116.0 L69.0 111.0 L62.9 101.5 L60.1 96.6 L54.0 87.1 L7.3 10.5 L6.7 8.1 L7.2 4.4 L9.4 1.5 L11.4 0.5 Z';
// Clip regions that pick one arm each out of the outline. They pass through the four inner
// vertices of the crossing (top, right, bottom and left notch), so each arm owns the crossing
// and nothing of the other arm. The arms taper toward the center, so straight diagonal bands
// always carried a piece of the OTHER arm, seen as a stub whenever one arm moved alone
// (Andrea, 2026-09-30).
const BAND_A = 'M-40 -40 L125.5 -40 L125.5 49.2 L176.9 115.1 L300 300 L122.8 300 L122.8 184.4 L71.7 116.0 Z';
const BAND_B = 'M125.5 -40 L300 -40 L176.9 115.1 L122.8 184.4 L122.8 300 L-40 300 L71.7 116.0 L125.5 49.2 Z';
// Brand stops sampled from the logo: magenta top-left, orange bottom-left, lavender top-right,
// blue bottom-right, over a coral ground. They drift so the color is never quite still.
// No blob at the center: coral over the coral ground only showed up as a ring (Andrea, 2026-09-30).
const BLOBS = [
    { c: '#E5007E', x: 25, y: 20, r: 150, f: 0.9, g: 1.1, k: 0 },
    { c: '#F07800', x: 25, y: 225, r: 150, f: 1.2, g: 0.8, k: 1.7 },
    { c: '#A393DC', x: 235, y: 15, r: 135, f: 0.7, g: 1.3, k: 3.1 },
    { c: '#0089CF', x: 240, y: 230, r: 140, f: 1.1, g: 0.9, k: 4.4 },
];
// Eased falloff: a linear fade leaves a visible circular edge where it reaches zero.
const FALLOFF = [
    [0, 1],
    [0.3, 0.8],
    [0.55, 0.45],
    [0.8, 0.12],
    [1, 0],
];
// How far each blob wanders, in viewBox units. Kept small so the colors stay where the logo has them.
const DRIFT_X = 30;
const DRIFT_Y = 26;
const FLOW_SPEED = {
    greeting: 1.4,
    idle: 0.35,
    listening: 0.8,
    thinking: 2.2,
    speaking: 1.2,
    fall: 1.6,
    land: 1.2,
    bounce: 1.2,
    peek: 0.35,
};
const GREETING_MS = 2000;
function prefersReducedMotion() {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
export default function XimiaMark({ state = 'idle', greetOnMount = false, waveKey = 0, still = false, className }) {
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
    const svgRef = useRef(null);
    const [greeting, setGreeting] = useState(greetOnMount && !still);
    // A new waveKey starts a wave. Adjusted during render (not in an effect) so it lands in the
    // same commit as the key change.
    const [seenWave, setSeenWave] = useState(waveKey);
    if (waveKey !== seenWave) {
        setSeenWave(waveKey);
        if (!still)
            setGreeting(true);
    }
    // A wave only shows at rest: while she falls, lands or talks, the body is busy.
    const atRest = state === 'idle' || state === 'peek';
    const effective = still ? 'still' : greeting && atRest ? 'greeting' : state;
    const speedRef = useRef(FLOW_SPEED.idle);
    useEffect(() => {
        speedRef.current = effective === 'still' ? 0 : FLOW_SPEED[effective];
    }, [effective]);
    // With reduced motion the CSS drops the greeting animation, so the timer is harmless there.
    useEffect(() => {
        if (!greeting)
            return;
        const t = setTimeout(() => setGreeting(false), GREETING_MS);
        return () => clearTimeout(t);
    }, [greeting]);
    // One rAF per LIVE mark (past message avatars pass `still`), paused by the browser
    // whenever the tab is hidden.
    useEffect(() => {
        if (still || prefersReducedMotion())
            return;
        const svg = svgRef.current;
        if (!svg)
            return;
        const circles = Array.from(svg.querySelectorAll('circle[data-blob]'));
        let phase = Math.random() * 10;
        let last = performance.now();
        let raf = 0;
        const tick = (t) => {
            const dt = Math.min(0.05, (t - last) / 1000);
            last = t;
            phase += dt * speedRef.current;
            for (const c of circles) {
                const b = BLOBS[Number(c.dataset.blob)];
                c.setAttribute('cx', (b.x + Math.sin(phase * b.f + b.k) * DRIFT_X).toFixed(1));
                c.setAttribute('cy', (b.y + Math.cos(phase * b.g + b.k) * DRIFT_Y).toFixed(1));
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [still]);
    const paint = (arm) => (<g mask={`url(#${uid}-m${arm})`}>
      <rect x="-40" y="-40" width="330" height="320" fill="#EC5466"/>
      {BLOBS.map((b, i) => (<circle key={i} data-blob={i} cx={b.x} cy={b.y} r={b.r} fill={`url(#${uid}-g${i})`}/>))}
    </g>);
    return (<svg ref={svgRef} className={`${styles.mark} ${className ?? ''}`} viewBox="-30 -30 310 297" data-state={effective} aria-hidden="true" focusable="false">
      <defs>
        {BLOBS.map((b, i) => (<radialGradient key={i} id={`${uid}-g${i}`}>
            {FALLOFF.map(([offset, opacity]) => (<stop key={offset} offset={offset} stopColor={b.c} stopOpacity={opacity}/>))}
          </radialGradient>))}
        <clipPath id={`${uid}-cA`}>
          <path d={BAND_A}/>
        </clipPath>
        <clipPath id={`${uid}-cB`}>
          <path d={BAND_B}/>
        </clipPath>
        <mask id={`${uid}-mA`}>
          <path d={X_PATH} fill="#fff" clipPath={`url(#${uid}-cA)`}/>
        </mask>
        <mask id={`${uid}-mB`}>
          <path d={X_PATH} fill="#fff" clipPath={`url(#${uid}-cB)`}/>
        </mask>
      </defs>
      <g className={styles.halo}>
        <circle cx="125" cy="118.5" r="140" fill="none" stroke="#F26A5A" strokeWidth="6"/>
      </g>
      <g className={styles.whole}>
        <g className={`${styles.arm} ${styles.armB}`}>{paint('B')}</g>
        <g className={`${styles.arm} ${styles.armA}`}>{paint('A')}</g>
      </g>
    </svg>);
}
