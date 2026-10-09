/**
 * XimiaShowcase — the band under the hero: Ximia herself, large, going through what she does.
 *
 * It replaces a stock clip of blue holograms over a laptop (the «AI» cliché the new identity
 * leaves behind). Here the product is the picture: one verb at a time, and her body doing it.
 * Clicking a verb picks it and pauses the rotation for a while.
 */
import { useEffect, useState } from 'react';
import XimiaMark from './XimiaMark';

// What her body does for each line, in order. The first one is a wave, not a pose.
const POSES = ['idle', 'listening', 'thinking', 'speaking'];
const EVERY_MS = 3200;
const PAUSE_AFTER_CLICK_MS = 9000;

export default function XimiaShowcase({ eyebrow, items, ...rest }) {
    const [active, setActive] = useState(0);
    const [waveKey, setWaveKey] = useState(0);
    const [pausedUntil, setPausedUntil] = useState(0);
    const count = Math.min(items.length, POSES.length);

    useEffect(() => {
        if (count === 0) return;
        const id = setInterval(() => {
            if (document.hidden || performance.now() < pausedUntil) return;
            setActive((i) => (i + 1) % count);
        }, EVERY_MS);
        return () => clearInterval(id);
    }, [count, pausedUntil]);

    // The first line is «says hello»: she waves each time it comes up.
    useEffect(() => {
        if (active !== 0) return;
        const t = setTimeout(() => setWaveKey((k) => k + 1), 150);
        return () => clearTimeout(t);
    }, [active]);

    return (
        <section className="bg-gray-900 text-white py-24 md:py-32 overflow-hidden" {...rest}>
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-8 items-center">
                <div className="flex justify-center">
                    <XimiaMark state={POSES[active]} waveKey={waveKey} className="w-56 h-56 md:w-[26rem] md:h-[26rem]" />
                </div>
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400 mb-8">{eyebrow}</p>
                    <ul className="flex flex-col gap-3">
                        {items.slice(0, count).map((item, i) => (
                            <li key={i}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActive(i);
                                        setPausedUntil(performance.now() + PAUSE_AFTER_CLICK_MS);
                                    }}
                                    className="text-left w-full group"
                                    aria-current={i === active}
                                >
                                    <span
                                        className={`block font-bold tracking-tight leading-none transition-all duration-500 ${i === active ? 'text-5xl md:text-7xl text-white' : 'text-3xl md:text-4xl text-gray-600 group-hover:text-gray-400'}`}
                                    >
                                        {item.verb}
                                    </span>
                                    <span
                                        className={`block text-lg md:text-xl text-gray-300 overflow-hidden transition-all duration-500 ${i === active ? 'max-h-24 opacity-100 mt-3 mb-4' : 'max-h-0 opacity-0'}`}
                                    >
                                        {item.sub}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
