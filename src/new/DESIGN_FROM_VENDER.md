# The design system, read out of `src/App.jsx`

`/new` holds the proposed site: a homepage plus Otorgar and Recaudar. It replicates the
look of the live landing (Vender) and **shares no code with it**.

## Two rules this directory obeys

1. **Vender is never rendered here.** Not copied, not imported. The nav links to the live
   `/`. Vender living at two URLs is how a copy starts to rot — this repo has paid that
   twice (`simulador.html` duplicated across repos, and the `-2`/`-3` preview routes of
   La Candelaria). Home, Otorgar and Recaudar carry no such risk: there is no original to
   diverge from.
2. **The look is replicated by reading `App.jsx`, never by sharing components with it.**
   Factoring shared primitives out of `App.jsx` would mean editing Vender. The honest
   cost: if Vender ever changes, these pages do not follow. Vender does not change.

The only files imported from outside this directory are read-only leaf assets:
`src/ximia/XimiaMark` (the brand X) and `src/index.css` (the keyframes).

## Tokens, with the line in `App.jsx` they were read from

| token | value | source |
|---|---|---|
| typeface | **none** — `font-sans`, the system stack. No webfont is loaded. | `App.jsx:303` |
| accent | `#0092B3` | 14 uses; e.g. `App.jsx:609`, `751`, `763` |
| highlight (on dark) | `#98daed` | `App.jsx:493` |
| off-white panel | `#FAFAFA` | `App.jsx:636` |
| base text | `text-gray-900` | `App.jsx:303` |
| secondary text | `text-gray-500` (21 uses), `text-gray-400` (14) | throughout |
| container | `max-w-7xl mx-auto px-6` | `App.jsx:317`, `363` |
| dark band | `bg-gray-900 text-white` | `App.jsx:483`, `852` |
| light bands | `bg-white`, `bg-gray-50` | `App.jsx:476`, `719` |

## Bands, in the order Vender runs them

| # | band | the shape it has in `App.jsx` |
|---|---|---|
| 1 | header | `fixed top-0 w-full bg-white shadow z-50`; logo `h-12 md:h-16`; nav `space-x-6 hidden md:block font-medium`; CTA `bg-black text-white rounded-full px-5 py-2.5 text-sm font-bold` (`316-358`) |
| 2 | hero | `pt-44 pb-36 md:pt-52 md:pb-44 bg-gradient-to-b from-white to-gray-50`; title `text-7xl md:text-8xl lg:text-[130px] font-bold leading-[0.9] tracking-tight`, second line `text-gray-500`; sub `text-[22px] text-gray-700 leading-[1.5] max-w-xl` (`361-396`) |
| 3 | statement | `py-20 md:py-40 text-center bg-white`; lead `text-xl md:text-3xl text-gray-600`; punch `text-4xl md:text-[4rem] leading-[1.1] font-bold tracking-tight` (`476-482`) |
| 4 | dark stat | `py-40 bg-gray-900 text-white text-center`; headline `text-5xl md:text-8xl font-bold`; figure `text-[8rem] md:text-[11rem] leading-none tracking-tighter`; caption `text-gray-400 md:text-5xl`; Sin/Con `grid grid-cols-2`, divider `border-r border-white/10`, labels `text-sm md:text-xl font-bold uppercase tracking-widest`; result `text-5xl md:text-8xl font-black text-gray-400` (`483-566`) |
| 5 | stepper | `pt-20 pb-40 bg-white`; title `text-5xl md:text-8xl font-black`; numbers `text-6xl font-black`, active `text-[#0092B3]` / idle `text-gray-400`; step title `text-4xl font-bold`; body `text-2xl text-gray-500 font-medium` (`572-620`) |
| 6 | vs table | `py-32 md:py-40 bg-gray-50`, `max-w-5xl`; card `bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-xl`; three columns, the Ximia one `text-[#0092B3] font-bold`; check `text-green-500` (`719-744`) |
| 7 | why ximia | `py-24 md:py-32 bg-white`; eyebrow `text-[#0092B3] font-bold tracking-widest uppercase text-sm`; headline `text-[60px] md:text-[85px] leading-[1.1] font-bold`; bento `grid md:grid-cols-3 gap-6`, first card `bg-[#0092B3] text-white rounded-3xl` (`748-790`) |
| 8 | cta dark | `py-32 md:py-40 bg-gray-900`, `max-w-4xl`; headline `text-6xl font-bold leading-[0.9]`; button `bg-white text-black rounded-full px-12 py-6 uppercase tracking-widest` (`851-868`) |
| 9 | footer | `bg-gray-900 pt-16 pb-12 text-gray-400`; address `text-6xl md:text-8xl font-bold text-white hover:text-[#0092B3]` (`874-915`) |

## The formula each page keeps

The hero is a negation followed by the verb, the close is "No X. Y.", and each door owns
one verb: Vender **vende**, Otorgar **resuelve**, Recaudar **reconoce**, the homepage
**resuelve casos**.
