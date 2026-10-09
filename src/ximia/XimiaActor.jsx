/**
 * XimiaActor — Ximia on HER OWN site: a character that travels the page with the reader.
 *
 * It started as a port of ConstruirFácil's actor (components/ximia/XimiaActor.tsx, b11be4c) and
 * was rewritten here on 2026-10-02. There she is a guest on someone else's page and stays out
 * of the way; here she is the product, so she moves more (Andrea: «es el sitio de Ximia…
 * debería tener otro peso» · «en este sitio Ximia sí debería moverse más»).
 *
 * The rule that survives from CF: every move answers the person's scroll, never a clock.
 *
 *   · A section DECLARES where she stands while it is being read (`ximiaStands`): a spot on the
 *     screen, a size, a pose. She glides from one spot to the next; her only jump is the
 *     entrance (Andrea, 2026-10-07: «salta mucho»).
 *   · That choreography is for reading DOWN. Scrolling back up she does not undo it move by
 *     move: she rests at the bottom center and returns to her spot only at the top of the page
 *     (Andrea, 2026-10-07: «no ir deshaciendo todos los movimientos»).
 *   · Between spots she tucks behind an edge and breathes. Which edge is declared by the spot
 *     she just left (`exit`), so the page can walk her from the right side to the left.
 *   · A control can ask her to stand BY it (`ximiaPerches`): she glides to just under it, the
 *     control lights up, and from then on she is part of the page — she scrolls with it, rigidly,
 *     and leaves the screen with it. No jump, no elastic lag, no flight back to the edge
 *     (Andrea, 2026-10-07: «ubiquémosla debajo del botón, sin salto… y que el botón se encienda»).
 *   · A section can give her one line to say (`ximiaSays`); taking her up on it runs an action.
 *
 * On phones she skips the spots (they would land on the copy) and only tucks and perches.
 *
 * The body poses (fall, land, peek, thinking…) belong to XimiaMark, which IS still the same
 * file as in ConstruirFácil.
 */
import { useEffect, useRef, useState } from 'react';
import {
    XIMIA_ASK_ATTR,
    XIMIA_KEEP_ATTR,
    XIMIA_PERCH_ATTR,
    XIMIA_SAY_ATTR,
    XIMIA_STAGE_ATTR,
} from './moments';
import { isXimiaStageHeld } from './stage-hold';
import XimiaMark from './XimiaMark';
import styles from './XimiaActor.module.css';

/** Side of the square she is drawn in, at scale 1. Every size is a scale of this. */
const BASE = 220;
/** The drawing fills this much of that square (see `.fabImg`). */
const DRAWN = 0.76;
const DEFAULT_SIZE = 190;
const TUCKED_SIZE = 150;
const PERCH_SIZE = 120;
/** The site's content box: Tailwind `max-w-7xl` with `px-6`. */
const BOX_MAX = 1280;
const BOX_PAD = 24;
/** Fraction of her width that stays on screen when tucked, and when leaning out of the edge. */
const TUCKED_VISIBLE = 0.6;
const NUDGE_VISIBLE = 0.9;
const TUCKED_Y = 0.84;
const ENTER_DELAY_MS = 1400; // let the headline type first
const FALL_MS = 620;
const LAND_MS = 620;
const SLIDE_MS = 420;
const HIDE_MS = 1300;
/** Waves every 10 s at first, then less and less. */
const WAVE_FIRST_MS = 10000;
const WAVE_STEADY_COUNT = 6;
const WAVE_MAX_MS = 80000;
const LINE_DWELL_MS = 1200;
const LINE_STAYS_MS = 7000;
const LINE_AGAIN_MS = 12000;
const LINE_CLOSED_MS = 180000;
const LINE_GAP_MS = 6000;
const PHONE_MAX_VW = 768;
/** How long she takes to reach a control. After that she is locked to it. */
const APPROACH_MS = 550;
/** Air between a control and her, when she stands under it. */
const PERCH_GAP = 14;
/** Where she rests while the person scrolls back up. */
const REST_SIZE = 130;
/** Scrolling up this far sends her to rest; scrolling down this far resumes the choreography. */
const REST_AFTER_UP_PX = 120;
const RESUME_AFTER_DOWN_PX = 240;
/** «The top of the page»: above this she is back on her spot. */
const TOP_PX = 80;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export default function XimiaActor({ hidden, onOpen, label = 'Ximia' }) {
    const ref = useRef(null);
    const [pose, setPose] = useState('idle');
    const [waveKey, setWaveKey] = useState(0);
    const [entered, setEntered] = useState(false);
    const [line, setLine] = useState(null);
    /** How she is drawn right now: scale, tilt, and which side her balloon opens to. */
    const [look, setLook] = useState({ scale: DEFAULT_SIZE / BASE, tilt: 0, flip: false });
    const hiddenRef = useRef(hidden);
    const api = useRef({ wave: () => {}, hover: () => {}, dismiss: () => {} });

    useEffect(() => {
        hiddenRef.current = hidden;
        if (hidden) {
            api.current.dismiss();
            return;
        }
        const t = setTimeout(() => api.current.wave(), 350);
        return () => clearTimeout(t);
    }, [hidden]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let alive = true;
        let busy = false;
        let onStage = false;
        // Where she is: the center of her square, in viewport px, and what put her there.
        let cur = { kind: 'off', key: '', cx: 0, cy: 0, size: DEFAULT_SIZE };
        // The facts her place is derived from.
        const stages = new Set(); // declared sections now being read
        const perches = new Set(); // declared controls now on screen
        let exitSide = 'right';
        let resting = false;
        let hovered = false;
        let lineId = null;
        let litEl = null;
        const closedAt = new Map();
        const saidAt = new Map();
        let lastLineAt = -Infinity;
        let lineTimer;
        const dwell = new Map();
        let waves = 0;
        let nextWaveAt = Infinity;

        const tf = (cx, cy) => `translate3d(${cx - BASE / 2}px, ${cy - BASE / 2}px, 0)`;
        // Pinned, she is positioned in the PAGE instead of the screen, so the browser scrolls
        // her with the content: placed per frame from script she trailed the control by a frame.
        let pinned = false;
        const place = (cx, cy) => {
            cur.cx = cx;
            cur.cy = cy;
            el.style.transform = pinned ? tf(cx + window.scrollX, cy + window.scrollY) : tf(cx, cy);
        };
        const pin = (on) => {
            if (pinned === on) return;
            const r = el.getBoundingClientRect();
            pinned = on;
            el.style.position = on ? 'absolute' : '';
            place(r.left + BASE / 2, r.top + BASE / 2);
        };
        const viewport = () => ({ vw: document.documentElement.clientWidth, vh: window.innerHeight });
        const firstInPage = (set) =>
            [...set].sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))[0];
        const readSpot = (e) => {
            try {
                return JSON.parse(e.getAttribute(XIMIA_STAGE_ATTR) || '{}');
            } catch {
                return {};
            }
        };

        /** Where she should be, from the facts. One rule, so nothing can leave her stranded. */
        const target = () => {
            const { vw, vh } = viewport();
            const phone = vw < PHONE_MAX_VW;
            const perch = firstInPage(perches);
            // Already by a control, she stays with it while it is on screen even if the person
            // scrolls up: it carries her down to the bottom, where she rests. Letting go at once
            // sent her across the screen.
            if (resting && !phone && !(perch && cur.kind === 'perch')) {
                return { kind: 'rest', key: 'rest', cx: vw / 2, cy: vh - (REST_SIZE * DRAWN) / 2 - 20, size: REST_SIZE, pose: 'idle', tilt: 0 };
            }
            if (perch) {
                const r = perch.getBoundingClientRect();
                const size = phone ? 84 : PERCH_SIZE;
                // Just under the control.
                return { kind: 'perch', key: 'perch', el: perch, cx: r.left + r.width / 2, cy: r.bottom + PERCH_GAP + (size * DRAWN) / 2, size, pose: 'idle', tilt: 0, wave: true };
            }
            const stage = phone ? null : firstInPage(stages);
            if (stage) {
                const s = readSpot(stage);
                const size = s.size || DEFAULT_SIZE;
                if (s.away) {
                    // The section shows her itself (the showcase): she steps off the screen.
                    return { kind: 'away', key: s.id || 'away', cx: vw + size, cy: vh * TUCKED_Y, size, pose: 'idle', tilt: 0, exit: s.exit };
                }
                const boxW = Math.min(vw, BOX_MAX);
                const boxLeft = (vw - boxW) / 2 + BOX_PAD;
                const boxRight = (vw + boxW) / 2 - BOX_PAD;
                const half = (size * DRAWN) / 2;
                const cx = s.x === 'box-right' ? boxRight - half : s.x === 'box-left' ? boxLeft + half : vw * (s.x ?? 0.5);
                const cy = clamp(vh * (s.y ?? 0.8), size / 2, vh - half - 8);
                return { kind: 'stage', key: s.id || 'stage', cx, cy, size, pose: s.pose || 'idle', tilt: 0, wave: !!s.wave, exit: s.exit };
            }
            if (cur.kind === 'rest' && !phone) {
                // Nothing claims her: she stays where she rests instead of walking back to an
                // edge she would leave again at the next section.
                return { kind: 'rest', key: 'rest', cx: vw / 2, cy: vh - (REST_SIZE * DRAWN) / 2 - 20, size: REST_SIZE, pose: 'idle', tilt: 0 };
            }
            const size = phone ? 96 : TUCKED_SIZE;
            const out = lineId || hovered;
            const visible = size * (out ? NUDGE_VISIBLE : TUCKED_VISIBLE);
            const right = exitSide === 'right';
            return {
                kind: out ? 'nudge' : 'tucked',
                key: exitSide,
                cx: right ? vw - visible + size / 2 : visible - size / 2,
                cy: vh * TUCKED_Y,
                size,
                pose: out ? 'idle' : 'peek',
                // Tilted toward the page, like someone leaning out of a doorway.
                tilt: out ? 0 : right ? -16 : 16,
            };
        };

        const applyLook = (t) => setLook({ scale: t.size / BASE, tilt: t.tilt, flip: t.cx < viewport().vw / 2 });

        const slide = async (t, ms) => {
            const from = [cur.cx, cur.cy];
            place(t.cx, t.cy);
            if (reduce) return;
            const a = el.animate([{ transform: tf(...from) }, { transform: tf(t.cx, t.cy) }], { duration: ms, easing: 'cubic-bezier(0.4, 0, 0.3, 1)' });
            await a.finished.catch(() => {});
        };
        const scheduleWave = () => {
            const gap = waves < WAVE_STEADY_COUNT ? WAVE_FIRST_MS : Math.min(WAVE_MAX_MS, WAVE_FIRST_MS * 2 ** (waves - WAVE_STEADY_COUNT + 1));
            nextWaveAt = performance.now() + gap;
        };
        const wave = () => {
            // Tucked behind the edge she only breathes: a wave from there is a hand out of a door.
            if (!alive || !onStage || busy || hiddenRef.current || cur.kind === 'tucked') return;
            waves += 1;
            scheduleWave();
            setWaveKey((k) => k + 1);
        };
        const unlight = () => {
            if (litEl) litEl.removeAttribute('data-ximia-lit');
            litEl = null;
        };

        /**
         * By a control: she closes in on it, and once there she is locked to it frame by frame,
         * like any other thing on the page. The chase is only the approach.
         */
        let riding = 0;
        let rodeBefore = false;
        let locked = false;
        const ride = (t) => {
            if (riding) return;
            locked = false;
            cur = { ...cur, kind: 'perch', key: 'perch', size: t.size, pose: 'idle', exit: undefined };
            applyLook(t);
            setPose('idle');
            // The approach is her starting distance fading out over a fixed time, measured from
            // where the control IS each frame: however fast the page scrolls she arrives on time.
            // (A chase with lag never arrived while the person kept scrolling — measured.)
            const first = target();
            const from = [cur.cx - first.cx, cur.cy - first.cy];
            const t0 = performance.now();
            const step = (now) => {
                if (!alive) return;
                const goal = target();
                if (goal.kind !== 'perch') {
                    // The control left by the bottom, or she was sent to rest: let go.
                    pin(false);
                    riding = 0;
                    void settle();
                    return;
                }
                const e = reduce ? 1 : Math.min(1, (now - t0) / APPROACH_MS);
                const left = (1 - e) ** 3;
                place(goal.cx + from[0] * left, goal.cy + from[1] * left);
                if (e >= 1) {
                    locked = true;
                    pin(true);
                }
                if (!litEl && locked) {
                    litEl = goal.el;
                    goal.el.setAttribute('data-ximia-lit', '');
                    // She says hi the first time she gets there, not on every return.
                    if (!rodeBefore) wave();
                    rodeBefore = true;
                }
                // Once lit it stays lit until she lets go.
                riding = requestAnimationFrame(step);
            };
            riding = requestAnimationFrame(step);
        };

        const settle = async () => {
            if (!alive || !onStage || busy || riding) return;
            // The edge she leaves toward is decided BEFORE choosing where to go: read after, she
            // walked to the old edge first and then crossed the whole screen to the new one.
            if (cur.exit) {
                const next = target();
                if (next.kind !== cur.kind || next.key !== cur.key) exitSide = cur.exit;
            }
            const t = target();
            const same = t.kind === cur.kind && t.key === cur.key;
            if (t.kind === 'perch') {
                ride(t);
                return;
            }
            if (same && Math.abs(t.cx - cur.cx) < 2 && Math.abs(t.cy - cur.cy) < 2) {
                if (t.pose !== cur.pose) {
                    cur.pose = t.pose;
                    setPose(t.pose);
                }
                return;
            }
            busy = true;
            const { vw: sw, vh: sh } = viewport();
            if (cur.cy < -cur.size / 2 || cur.cy > sh + cur.size / 2) {
                // She left the screen with a control: she comes back in from the edge nearest to
                // where she is going, not across the whole screen.
                if (t.kind === 'tucked' || t.kind === 'nudge') place(t.cx < sw / 2 ? -BASE : sw + BASE, t.cy);
                else place(t.cx, sh + BASE);
            }
            const edgeToEdge = (cur.kind === 'tucked' || cur.kind === 'nudge') && (t.kind === 'tucked' || t.kind === 'nudge') && cur.key === t.key;
            if (cur.kind === 'perch') unlight();
            applyLook(t);
            if (edgeToEdge || cur.kind === 'off') {
                setPose(t.pose);
                await slide(t, t.kind === 'tucked' ? HIDE_MS : SLIDE_MS);
            } else if (t.kind === 'tucked' || t.kind === 'away' || cur.kind === 'away' || cur.kind === 'perch') {
                // Leaving a spot for the edge: she walks off, she does not jump into the wall.
                setPose('idle');
                await slide(t, 700);
                setPose(t.pose);
            } else {
                // Spot to spot: a glide, as long as the distance asks for.
                setPose('idle');
                await slide(t, clamp(Math.hypot(t.cx - cur.cx, t.cy - cur.cy) / 1.2, 450, 900));
                if (!alive) return;
                setPose(t.pose);
            }
            cur = { ...cur, kind: t.kind, key: t.key, size: t.size, pose: t.pose, exit: t.exit };
            busy = false;
            if (t.wave) wave();
            void settle();
        };

        const unsay = (id, byPerson = false) => {
            if (!lineId || (id && id !== lineId)) return;
            if (byPerson) closedAt.set(lineId, performance.now());
            lineId = null;
            clearTimeout(lineTimer);
            setLine(null);
            void settle();
        };
        const say = (id, l) => {
            if (!alive || !onStage || hiddenRef.current || lineId === id) return;
            const now = performance.now();
            if (now - (closedAt.get(id) ?? -Infinity) < LINE_CLOSED_MS) return;
            if (now - (saidAt.get(id) ?? -Infinity) < LINE_AGAIN_MS) return;
            if (now - lastLineAt < LINE_GAP_MS) return;
            saidAt.set(id, now);
            lastLineAt = now;
            lineId = id;
            setLine({ id, text: l.line, ask: l.ask });
            clearTimeout(lineTimer);
            if (!l.keep) lineTimer = setTimeout(() => unsay(id), LINE_STAYS_MS);
            void settle();
        };
        api.current = {
            wave,
            dismiss: (byPerson = false) => unsay(undefined, byPerson),
            hover: (on) => {
                hovered = on;
                if (on && !busy) wave();
                void settle();
            },
        };

        // What the page declared, found by attribute — and found again when the page grows.
        const watched = new WeakSet();
        const band = { rootMargin: '-45% 0px -45% 0px' }; // the middle of the screen: what is being read
        const track = (set) => (entries) => {
            for (const e of entries) {
                if (e.isIntersecting) set.add(e.target);
                else set.delete(e.target);
            }
            void settle();
        };
        const stageWatch = new IntersectionObserver(track(stages), band);
        // She goes to a control once it is whole on screen, and lets go only when it leaves by
        // the BOTTOM (the person went back up). When it leaves by the top she leaves with it:
        // letting go there sent her flying across the screen to the edge.
        const perchWatch = new IntersectionObserver((entries) => {
            for (const e of entries) {
                if (e.intersectionRatio >= 0.95) perches.add(e.target);
                else if (e.intersectionRatio <= 0.05 && e.boundingClientRect.top > 0) perches.delete(e.target);
            }
            void settle();
        }, { threshold: [0.05, 0.95] });
        const lineOf = (e) => {
            const text = e.getAttribute(XIMIA_SAY_ATTR);
            if (!text) return null;
            return { id: `say:${text}`, l: { line: text, ask: e.getAttribute(XIMIA_ASK_ATTR) || text, keep: e.hasAttribute(XIMIA_KEEP_ATTR) } };
        };
        const reading = new Set();
        const offer = (e) => {
            const found = lineOf(e);
            if (!found || !reading.has(e)) return;
            const wait = LINE_GAP_MS - (performance.now() - lastLineAt);
            if (wait > 0 || lineId) {
                clearTimeout(dwell.get(found.id));
                dwell.set(found.id, setTimeout(() => offer(e), Math.max(wait, 1000)));
                return;
            }
            say(found.id, found.l);
        };
        const read = new IntersectionObserver((entries) => {
            for (const e of entries) {
                const found = lineOf(e.target);
                if (!found) continue;
                clearTimeout(dwell.get(found.id));
                if (e.isIntersecting) {
                    reading.add(e.target);
                    dwell.set(found.id, setTimeout(() => offer(e.target), LINE_DWELL_MS));
                } else {
                    reading.delete(e.target);
                    unsay(found.id);
                }
            }
        }, { rootMargin: '-40% 0px -40% 0px' });
        const scan = () => {
            for (const [attr, watch] of [[XIMIA_STAGE_ATTR, stageWatch], [XIMIA_PERCH_ATTR, perchWatch], [XIMIA_SAY_ATTR, read]]) {
                for (const e of document.querySelectorAll(`[${attr}]`)) {
                    // One element may declare several things: remember the pair, not the element.
                    const key = `${attr}`;
                    if (!watched.has(e)) watched.add(e);
                    if (e[`__ximia_${key}`]) continue;
                    e[`__ximia_${key}`] = true;
                    watch.observe(e);
                }
            }
        };
        let rescan;
        // Throttled, not debounced: a page that never stops mutating would postpone a debounce
        // forever. It also fires when a section changes the spot it declares (a new pose).
        const grown = new MutationObserver(() => {
            if (rescan) return;
            rescan = setTimeout(() => {
                rescan = undefined;
                scan();
                void settle();
            }, 200);
        });

        const enter = async () => {
            onStage = true;
            busy = true;
            scan();
            grown.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: [XIMIA_STAGE_ATTR] });
            // Observers report on the next frame: wait for the first report before choosing a spot.
            await sleep(120);
            if (!alive) return;
            const t = target();
            applyLook(t);
            const { vw } = viewport();
            if (t.kind === 'stage' && !reduce) {
                // Drops from above the screen onto her spot, squashes on landing, and waves.
                place(t.cx, t.cy);
                setPose('fall');
                setEntered(true);
                const a = el.animate([{ transform: tf(t.cx, -BASE) }, { transform: tf(t.cx, t.cy) }], { duration: FALL_MS, easing: 'cubic-bezier(0.5, 0, 1, 0.7)' });
                await a.finished.catch(() => {});
                if (!alive) return;
                setPose('land');
                await sleep(LAND_MS);
                if (!alive) return;
            } else {
                place(t.cx > vw / 2 ? vw + BASE : -BASE, t.cy);
                setEntered(true);
                await slide(t, SLIDE_MS);
            }
            setPose(t.pose);
            cur = { ...cur, kind: t.kind, key: t.key, size: t.size, pose: t.pose, exit: t.exit };
            busy = false;
            if (t.kind === 'stage') wave();
            else scheduleWave();
            void settle();
        };

        let quietSince = null;
        const gate = setInterval(() => {
            const now = performance.now();
            // A hidden tab freezes animations: entering there would be an entrance nobody sees.
            if (isXimiaStageHeld() || document.hidden) {
                quietSince = null;
                return;
            }
            if (quietSince === null) quietSince = now;
            if (now - quietSince >= ENTER_DELAY_MS) {
                clearInterval(gate);
                void enter();
            }
        }, 200);

        let lastY = window.scrollY;
        let upRun = 0;
        let downRun = 0;
        const onScroll = () => {
            const y = window.scrollY;
            const d = y - lastY;
            lastY = y;
            if (d < 0) {
                upRun -= d;
                downRun = 0;
                if (upRun > REST_AFTER_UP_PX) resting = true;
            } else if (d > 0) {
                downRun += d;
                upRun = 0;
                if (downRun > RESUME_AFTER_DOWN_PX) resting = false;
            }
            if (y <= TOP_PX) resting = false;
            void settle();
        };
        const onResize = () => {
            if (!onStage || busy) return;
            const t = target();
            applyLook(t);
            place(t.cx, t.cy);
        };
        const heartbeat = setInterval(() => {
            if (document.hidden || reduce || lineId) return;
            if (performance.now() >= nextWaveAt) wave();
        }, 1000);

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize);
        return () => {
            alive = false;
            clearInterval(gate);
            clearInterval(heartbeat);
            cancelAnimationFrame(riding);
            pin(false);
            clearTimeout(lineTimer);
            clearTimeout(rescan);
            dwell.forEach((t) => clearTimeout(t));
            stageWatch.disconnect();
            perchWatch.disconnect();
            read.disconnect();
            grown.disconnect();
            unlight();
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
            setLine(null);
        };
    }, []);

    return (
        <div
            ref={ref}
            className={`${styles.actor} ${entered ? '' : styles.actorOffstage}`}
            style={{
                visibility: hidden ? 'hidden' : undefined,
                '--ximia-scale': look.scale,
                '--ximia-tilt': `${look.tilt}deg`,
                '--ximia-half': `${(BASE * look.scale * DRAWN) / 2}px`,
            }}
        >
            {line && !hidden && (
                <div className={`${styles.say} ${look.flip ? styles.sayFlip : ''}`} role="status">
                    <button
                        type="button"
                        className={styles.sayText}
                        onClick={() => {
                            api.current.dismiss();
                            onOpen(line.ask);
                        }}
                    >
                        {line.text}
                    </button>
                    <button type="button" className={styles.sayClose} aria-label="Cerrar" onClick={() => api.current.dismiss(true)}>
                        ×
                    </button>
                </div>
            )}
            <button
                type="button"
                className={styles.fab}
                aria-label={label}
                onClick={() => onOpen()}
                onPointerEnter={() => api.current.hover(true)}
                onPointerLeave={() => api.current.hover(false)}
            >
                <XimiaMark state={pose} waveKey={waveKey} className={styles.fabImg} />
            </button>
        </div>
    );
}
