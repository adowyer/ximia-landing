/**
 * ⚠️ PORTED FROM ConstruirFácil (components/ximia/, lib/ximia/) on 2026-10-02, commit b11be4c.
 * This repo is React + Vite and that one is Next + TypeScript, so the files were transpiled
 * and live here as a COPY. Keep them in step: a change to how Ximia moves belongs in both.
 * The only parts that are meant to differ are the imports and `moments.js` (the lines).
 */
/**
 * Ximia's moments on the landing — what she reacts to, and what she says.
 *
 * Same contract as in ConstruirFácil: a section DECLARES its moment on its own markup,
 *
 *   <section {...ximiaStands({ id: 'hero', x: 'box-right', y: 0.8, wave: true })}>
 *   <section {...ximiaSays({ line: t('ximia_line_cost'), ask: 'calculator' })}>
 *   <button {...ximiaPerches()}>Book a demo</button>
 *
 * and the actor finds the attributes wherever they are.
 *
 * What differs here: there is no conversation to open. `ask` is not a question sent to the
 * agent but the NAME OF AN ACTION the page runs when the person takes her up on the line
 * (see `onOpen` in App.jsx). The lines themselves are copy and live in the translation files.
 */
import { useEffect } from 'react';

export const XIMIA_MOMENT_EVENT = 'cf:ximia:moment';

/** Lines for things the person DOES (nothing announces one on the landing yet). */
export const MOMENT_LINES = {};

export const XIMIA_SAY_ATTR = 'data-ximia-say';
export const XIMIA_ASK_ATTR = 'data-ximia-ask';
export const XIMIA_OUT_ATTR = 'data-ximia-out';
export const XIMIA_KEEP_ATTR = 'data-ximia-keep';

/** Props for an element Ximia has something to say about, once the person is reading it. */
export function ximiaSays(l) {
    return {
        [XIMIA_SAY_ATTR]: l.line,
        [XIMIA_ASK_ATTR]: l.ask,
        ...(l.keep ? { [XIMIA_KEEP_ATTR]: '' } : {}),
    };
}

/** Props for a control that invites to talk to her: while it is on screen she comes out. */
export function ximiaInvites() {
    return { [XIMIA_OUT_ATTR]: '' };
}

export const XIMIA_STAGE_ATTR = 'data-ximia-stage';
export const XIMIA_PERCH_ATTR = 'data-ximia-perch';

/**
 * Props for a section that gives Ximia a place to stand while it is being read.
 *   id    — a name for the spot (two sections with the same id are one spot)
 *   x     — her center across the screen: 0..1, or 'box-right' / 'box-left' to line her up
 *           with the edge of the site's content box
 *   y     — her center down the screen, 0..1
 *   size  — px
 *   pose  — a XimiaMark state ('idle', 'listening', 'thinking', 'speaking', 'bounce')
 *   wave  — she waves when she gets there
 *   exit  — the edge she tucks behind after leaving this spot ('left' | 'right')
 *   away  — true: she leaves the screen altogether (the section shows her itself)
 */
export function ximiaStands(spot) {
    return { [XIMIA_STAGE_ATTR]: JSON.stringify(spot) };
}

/** Props for a control she jumps onto while it is on screen. It gets `data-ximia-lit`. */
export function ximiaPerches() {
    return { [XIMIA_PERCH_ATTR]: '' };
}

/** Announces a moment while `active` is true, and its end when it stops or unmounts. */
export function useXimiaMoment(kind, active, about) {
    const key = about?.key;
    const label = about?.label;
    useEffect(() => {
        if (!active) return;
        const fire = (on) => window.dispatchEvent(new CustomEvent(XIMIA_MOMENT_EVENT, { detail: { kind, active: on, key, label } }));
        fire(true);
        return () => {
            fire(false);
        };
    }, [kind, active, key, label]);
}
