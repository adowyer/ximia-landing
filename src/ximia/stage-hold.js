/**
 * ⚠️ PORTED FROM ConstruirFácil (components/ximia/, lib/ximia/) on 2026-10-02, commit b11be4c.
 * This repo is React + Vite and that one is Next + TypeScript, so the files were transpiled
 * and live here as a COPY. Keep them in step: a change to how Ximia moves belongs in both.
 * The only parts that are meant to differ are the imports and `moments.js` (the lines).
 */
/**
 * Stage hold — a page tells Ximia "my own entrance is still playing, wait".
 *
 * Ximia walks onto the page as a character (components/ximia/XimiaActor.tsx). She must not
 * run across a hero that is still animating, so a page with an intro holds the stage and the
 * actor enters a couple of seconds after the last hold is released. Pages without an intro
 * do nothing and she enters a couple of seconds after load.
 *
 * The hold is a counter on <html data-ximia-hold>, so it survives any mount order between the
 * page and the widget (which lives in the root layout).
 */
import { useEffect } from 'react';
const ATTR = 'ximiaHold';
function acquire() {
    const root = document.documentElement;
    root.dataset[ATTR] = String(Number(root.dataset[ATTR] || 0) + 1);
    let released = false;
    return () => {
        if (released)
            return;
        released = true;
        const left = Number(root.dataset[ATTR] || 1) - 1;
        if (left <= 0)
            delete root.dataset[ATTR];
        else
            root.dataset[ATTR] = String(left);
    };
}
export function isXimiaStageHeld() {
    return typeof document !== 'undefined' && ATTR in document.documentElement.dataset;
}
/** Holds the stage while `active` is true (e.g. while an intro overlay is on screen). */
export function useXimiaStageHold(active) {
    useEffect(() => {
        if (!active)
            return;
        return acquire();
    }, [active]);
}
/** Holds the stage for `ms` after mount (for entrances that are pure CSS and emit no event). */
export function useXimiaStageHoldFor(ms) {
    useEffect(() => {
        const release = acquire();
        const t = setTimeout(release, ms);
        return () => {
            clearTimeout(t);
            release();
        };
    }, [ms]);
}
